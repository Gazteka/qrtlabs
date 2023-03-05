
import datetime

import fastapi.security as security
import jwt
import numpy as np
import pandas as pd
import pmdarima as pm
from fastapi import APIRouter, Depends, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
from config import SessionLocal
from model import Users
from schemas import (HistoricalSchema, OrdersCreate, OrdersGet, OrdersSearch,
                     RequestHistorical, Response, User, UserCreate,
                     UsersSchema)

JWT_SECRET = "myjwtsecret"
oauth2schema = security.OAuth2PasswordBearer(tokenUrl="/token")

router = APIRouter()

# origins = ["*","http://localhost:3000/"
# ]

# router.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/all")
async def get(db:Session = Depends(get_db)):
    _historical = crud.get_historical(db,0,100)
    return Response(code = 200,status = "ok",message="Sucessfull",result=_historical)

@router.get("/users")
async def get(db:Session = Depends(get_db)):
    users = crud.get_users(db,0,100)
    return Response(code = 200,status = "ok",message="Sucessfull",result=users)

@router.post("/users/create")
async def create_user(user: UserCreate ,db:Session = Depends(get_db)): 

    db_user = await crud.get_user_by_email(user.email, db)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already in use")

    user = await crud.create_user(user, db)

    return user

@router.post("/token")
async def generate_token(
    form_data: security.OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):  
    user = await crud.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    return await crud.create_token(user)

@router.get("/users/me",response_model=User)
async def get_user(db: Session = Depends(get_db),token = Depends(oauth2schema)):
    
    user = await crud.get_current_user(db = db,token = token)

    return user


@router.get("/predict/{n_days}")
async def get(n_days,db:Session = Depends(get_db)):
    _historical = crud.get_historical(db,0,100)
    df = pd.DataFrame(_historical)

    df["fecha"] = pd.to_datetime(df["fecha"])
    df.index = df["fecha"]
    df = df.drop(["fecha"],axis = 1)
    # df = df.drop(["fecha","up","down","volumen"],axis = 1)
    # df.columns = ["open","high","low","close"]
    df = df.sort_index(ascending=True)
    # resample_dict = {"open":"first",
    #                     "high":"max","low":"min",
    #                     "close":"last"}
    resample_dict = {"close":"last"}
    data_1d = df.resample("1D").apply(resample_dict)
    data_1d = data_1d.dropna()
    data_daily =  data_1d.asfreq("1d").ffill()
    # print(data_daily)
    new_data = []
    new_data1 = []
    for i in range(data_daily.shape[0]):
        row = data_daily.iloc[i]
        fecha = str(data_daily.index[i])
        value = row["close"]
        fecha = fecha.split(" ")[0]
        time_value = {"time":fecha,
                        "value":value}
        new_data.append(time_value)
        time_value_1 = {"time":fecha,
                        "value":value+15}
        new_data1.append(time_value_1)
    new_data = {"closes":new_data,"closes1":new_data1}
    arima_fit = pm.auto_arima(data_daily["close"])
    arima_fcast = arima_fit.predict(n_periods = int(n_days),return_conf_int = True,alpha = 0.05)
    forecast_df = pd.DataFrame()
    forecast_df["predictions"] = arima_fcast[0]
    forecast_df["up"] = arima_fcast[1][:,1]
    forecast_df["down"] = arima_fcast[1][:,0]
    predictions = []
    up = []
    down = []
    for i in range(forecast_df.shape[0]):
        row = forecast_df.iloc[i]
        fecha = str(forecast_df.index[i]).split(" ")[0]
        up_fecha = row["up"]
        down_fecha = row["down"]
        pred_fecha = row["predictions"]
        predictions.append({"time":fecha,"value":pred_fecha})
        up.append({"time":fecha,"value":up_fecha})
        down.append({"time":fecha,"value":down_fecha})

    new_data["pred"] = predictions
    new_data["up"] = up
    new_data["down"] = down
    return Response(code = 200,status = "ok",message="Sucessfull",result=new_data)



@router.post("/orders/create")
async def create_order(order: OrdersCreate ,db:Session = Depends(get_db)): 



    user = await crud.create_order(order, db)

    return user
@router.post("/orders/user")
async def get_orders(order:OrdersSearch,db:Session = Depends(get_db)):
    try:
        _order = await crud.get_orders_by_email(email = order.created_by,db = db)
        return Response(code = 200,status = "ok",message="Sucessfull",result=_order)
    except Exception as e:
        print(e)


@router.post("/users/orders")
async def get_orders(email:UsersSchema,db: Session = Depends(get_db)):
    print(email)
    try:
        orders = await crud.get_orders_by_email(email=email.email,db=db)
        for order in orders:
            print(order)
        return  Response(code = 200,status = "ok",message="Sucessfull",result=orders)
    except Exception as e:
        print(e)



@router.get("/datepredict/{date}")
async def get(date,db:Session = Depends(get_db)):
    _historical = crud.get_historical(db,0,100)
    df = pd.DataFrame(_historical)

    df["fecha"] = pd.to_datetime(df["fecha"])
    df.index = df["fecha"]
    df = df.drop(["fecha"],axis = 1)
    df = df.sort_index(ascending=True)
    resample_dict = {"close":"last"}
    data_1d = df.resample("1D").apply(resample_dict)
    data_1d = data_1d.dropna()
    data_daily =  data_1d.asfreq("1d").ffill()
    last_saved = data_daily.index[-1].replace(tzinfo=None)
    # print(last_saved)

    date = date.split(",")
    mes = date[0]
    dia = date[1]
    year = date[2]
    date_string =f"{dia} {mes}, {year}"
    date_object = datetime.datetime.strptime(date_string, "%d %b, %Y")
    n_days = (date_object-last_saved).days
    new_data = []
    new_data1 = []
    for i in range(data_daily.shape[0]):
        row = data_daily.iloc[i]
        fecha = str(data_daily.index[i])
        value = row["close"]
        fecha = fecha.split(" ")[0]
        time_value = {"time":fecha,
                        "value":value}
        new_data.append(time_value)
        time_value_1 = {"time":fecha,
                        "value":value+15}
        new_data1.append(time_value_1)
    new_data = {"closes":new_data,"closes1":new_data1}
    arima_fit = pm.auto_arima(data_daily["close"])
    arima_fcast = arima_fit.predict(n_periods = int(n_days),return_conf_int = True,alpha = 0.05)
    forecast_df = pd.DataFrame()
    forecast_df["predictions"] = arima_fcast[0]
    forecast_df["up"] = arima_fcast[1][:,1]
    forecast_df["down"] = arima_fcast[1][:,0]
    predictions = []
    up = []
    down = []
    for i in range(forecast_df.shape[0]):
        row = forecast_df.iloc[i]
        fecha = str(forecast_df.index[i]).split(" ")[0]
        up_fecha = row["up"]
        down_fecha = row["down"]
        pred_fecha = row["predictions"]
        predictions.append({"time":fecha,"value":pred_fecha})
        up.append({"time":fecha,"value":up_fecha})
        down.append({"time":fecha,"value":down_fecha})

    new_data["pred"] = predictions
    new_data["up"] = up
    new_data["down"] = down

    return Response(code = 200,status = "ok",message="Sucessfull",result=new_data)




@router.get("/getrisk/{date}/{target}/{loss}")
async def get(date,target,loss,db:Session = Depends(get_db)):

    colors = {"red":"#db4f4a","green":"#4CCEAC","yellow":"#E4D00A"}
    _historical = crud.get_historical(db,0,100)
    df = pd.DataFrame(_historical)

    df["fecha"] = pd.to_datetime(df["fecha"])
    df.index = df["fecha"]
    df = df.drop(["fecha"],axis = 1)
    df = df.sort_index(ascending=True)
    resample_dict = {"close":"last"}
    data_1d = df.resample("1D").apply(resample_dict)
    data_1d = data_1d.dropna()
    data_daily =  data_1d.asfreq("1d").ffill()
    last_saved = data_daily.index[-1].replace(tzinfo=None)
    # print(last_saved)
    
    returns = data_daily['close'].pct_change()[1:]
    # daily_vol = np.std(returns)
    returns = returns.astype(np.float64)
    daily_vol = returns.std()
    date = date.split(",")
    mes = date[0]
    dia = date[1]
    year = date[2]
    date_string =f"{dia} {mes}, {year}"
    date_object = datetime.datetime.strptime(date_string, "%d %b, %Y")
    n_days = (date_object-last_saved).days
    try:
        T = n_days
        last_price = float(data_daily['close'][-1])

        NUM_SIMULATIONS =  100
        df_montecarlo = pd.DataFrame()
        last_price_list = []
        for x in range(NUM_SIMULATIONS):
            count = 0
            price_list = []
            price = last_price * (1 + np.random.normal(0, daily_vol))
            price_list.append(price)
            
            for y in range(T):
                if count == T-1:
                    break
                price = price_list[count]* (1 + np.random.normal(0, daily_vol))
                price_list.append(price)
                count += 1
                
            df_montecarlo[x] = price_list
            last_price_list.append(price_list[-1])

        base = data_daily.index[-1]
        numdays = T+1
        date_list = [base + datetime.timedelta(days=x) for x in range(1,numdays)]
        df_montecarlo.index = date_list
        ultimos_valores = list(df_montecarlo.iloc[-1])
        print(ultimos_valores)
        beneficio = [valor for valor in ultimos_valores if valor > int(target)]
        prob_exito = len(beneficio)
        perdida = [valor for valor in ultimos_valores if valor < int(loss)]
        prob_perdida = (len(perdida))
        risk_factor = prob_exito/prob_perdida

        # print(loss,target)
        semaphore  ={}
        if prob_exito >=66:
            semaphore["target"] =[prob_exito,colors["green"],"Probabilidad alta"]
        elif prob_exito >=33:
            semaphore["target"] = [prob_exito,colors["yellow"],"Probabilidad media"]
        else:
            semaphore["target"] = [prob_exito,colors["red"],"Probabilidad baja"]

        if prob_perdida >=66:
            semaphore["loss"] =[prob_perdida,colors["green"],"Probabilidad alta"]
        elif prob_perdida >=33:
            semaphore["loss"] = [prob_perdida,colors["yellow"],"Probabilidad media"]
        else:
            semaphore["loss"] = [prob_perdida,colors["red"],"Probabilidad baja"]
        if risk_factor >=2:
            semaphore["factor"] =[risk_factor,colors["green"],"Factor de riesgo positivo"]
        elif risk_factor >=1:
            semaphore["factor"] = [risk_factor,colors["yellow"],"Factor de riesgo neutro"]
        else:
            semaphore["factor"] = [risk_factor,colors["red"],"Factor de riesgo negativo"]
        print(semaphore)
        return Response(code = 200,status = "ok",message="Sucessfull",result=semaphore)
    except Exception as e:
        print(e)




@router.get("/getorder")
async def order_following(db:Session = Depends(get_db)):
    _historical = crud.get_historical(db,0,100)
    df = pd.DataFrame(_historical)

    df["fecha"] = pd.to_datetime(df["fecha"])
    df.index = df["fecha"]
    df = df.drop(["fecha"],axis = 1)
    df = df.sort_index(ascending=True)
    resample_dict = {"close":"last"}
    data_1d = df.resample("1D").apply(resample_dict)
    data_1d = data_1d.dropna()
    data_daily =  data_1d.asfreq("1d").ffill()
    last_saved = data_daily.index[-1].replace(tzinfo=None) 
    orders = await crud.get_orders_by_email(email="pablo@gmail.com",db=db)
    buscar = orders[2]
    fecha_creacion,deadline = buscar.created_at,buscar.deadline
    fecha_final = deadline
    n_days = (deadline-fecha_creacion).days

    fecha_creacion = str(fecha_creacion).split(" ")[0]
    buscar_df = data_daily.loc[:fecha_creacion]
    arima_fit = pm.auto_arima(data_daily["close"].loc[:str(fecha_creacion)])
    
    arima_fcast = arima_fit.predict(n_periods = n_days,return_conf_int = True,alpha = 0.05)
    forecast_df = pd.DataFrame()
    forecast_df["predictions"] = arima_fcast[0]
    forecast_df["up"] = arima_fcast[1][:,1]
    forecast_df["down"] = arima_fcast[1][:,0]
    new_data = []
    new_data1 = []
    for i in range(data_daily.shape[0]):
        row = data_daily.iloc[i]
        fecha = str(data_daily.index[i])
        value = row["close"]
        fecha = fecha.split(" ")[0]
        time_value = {"time":fecha,
                        "value":value}
        new_data.append(time_value)
        time_value_1 = {"time":fecha,
                        "value":value+15}
        new_data1.append(time_value_1)
    new_data = {"closes":new_data,"closes1":new_data1}
    predictions = []
    up = []
    down = []
    for i in range(forecast_df.shape[0]):
        row = forecast_df.iloc[i]
        fecha = str(forecast_df.index[i]).split(" ")[0]
        up_fecha = row["up"]
        down_fecha = row["down"]
        pred_fecha = row["predictions"]
        predictions.append({"time":fecha,"value":pred_fecha})
        up.append({"time":fecha,"value":up_fecha})
        down.append({"time":fecha,"value":down_fecha})

    new_data["pred"] = predictions
    new_data["up"] = up
    new_data["down"] = down
    new_data["target"]=  buscar.target_price
    new_data["loss"] = buscar.loss_price
    return Response(code = 200,status = "ok",message="Sucessfull",result=new_data)