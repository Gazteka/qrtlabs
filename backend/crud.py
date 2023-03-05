import fastapi.security as security
import jwt
from fastapi import Depends, HTTPException
from passlib import hash
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from model import Historical, Orders, Users
from schemas import (HistoricalSchema, OrdersCreate, User, UserCreate,
                     UsersSchema)

# from router import get_db
JWT_SECRET = "myjwtsecret"
oauth2schema = security.OAuth2PasswordBearer(tokenUrl="token")


def get_historical(db:Session,skip:int=0,limit:int=0):
    return db.query(Historical.close,Historical.fecha).order_by(desc("fecha")).offset(skip).limit(25000).all()


def get_users(db:Session,skip:int=0,limit:int=0):
    return db.query(Users).all()

async def get_user_by_email(email: str, db: Session):
    return db.query(Users).filter(Users.email == email).first()


async def create_user(user:UserCreate, db:Session):
    user_obj = Users(
        email=user.email, hash_password=hash.bcrypt.hash(user.hash_password)
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    user_clean = User(id=user_obj.id ,email=user_obj.email)
    return user_clean

async def create_order(order:OrdersCreate, db:Session):
    order_obj = Orders(
        created_by=order.created_by, 
        deadline=order.deadline,
        target_price = order.target_price,
        loss_price = order.loss_price,
        note = order.note,
        amount = order.amount
    )
    db.add(order_obj)
    db.commit()
    db.refresh(order_obj)
    # user_clean = User(id=user_obj.id ,email=user_obj.email)
    return order_obj



async def authenticate_user(email: str, password: str, db:Session):
    user = await get_user_by_email(db=db, email=email)

    if not user:
        return False

    if not user.verify_password(password):
        return False

    return user

async def create_token(user: User):
    user_obj = User.from_orm(user)

    token = jwt.encode(user_obj.dict(), JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


async def get_current_user(
    db: Session ,
    token: str = Depends(oauth2schema),
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(Users).get(payload["id"])
    except Exception as e:
        raise HTTPException(
            status_code=401, detail=f"Invalid Email or Password {e}" 
        )

    return User.from_orm(user)
async def get_token():
    token = Depends(oauth2schema)
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

        return payload
    except:
        return token


async def get_orders_by_email(email: str, db: Session):
    print(email)
    return db.query(Orders).filter(Orders.created_by == email).all()