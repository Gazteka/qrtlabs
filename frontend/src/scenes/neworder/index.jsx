import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {React,handleSubmit,Copyright,useState,useEffect} from 'react';
import {ChartComponent,initialData} from "../../components/CandlestickHover";
import Grid from '@mui/material/Grid';
import axios from "axios";
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloudIcon from '@mui/icons-material/Cloud';
import StatBox from "../../components/StatBox";
import Calendar from 'react-calendar';
import Container from '@mui/material/Container';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';




const NewOrder = ({email}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const[stage,setStage] = useState(0)
  const [predictions, setPredictions] = useState(null);
  const [predValue,setPredvalue] = useState(30);
  const startDate = new Date();
  const [predDate, setStartDate] = useState(new Date())
  const [minvalue,setMinvalue] = useState(0);
  const [maxvalue,setMaxvalue] = useState(0);
  const [target,setTarget] = useState(0);
  const [loss,setLoss] = useState(0);
  const [sucess,setSuccess] = useState(0);
  const [fail,setFail] = useState(0);
  const [factor,setFactor] = useState(0);
  const [note,setNote] = useState("");
  const [amount,setAmount] = useState(0);
  

  const StageOne = (n) =>{
    const url = `http://localhost:8000/predict/${n}`;
    console.log(url)
    const getPredictions = () => {
      axios.get(url).then((response)=> {
          console.log(response.data)
          setPredictions(response.data.result)
          setStage(1)
          console.log()
      }).catch((error)=> {
        console.log(error)
        console.log("Error")
      })
    }
    getPredictions()




  }
  const sendData = (date) =>{
    const strDate = String(Object.entries(date)[2][1]);
    const firstDate = strDate.split("(")[0].split(" ");
    const sendArray = Array([firstDate[1],firstDate[2],firstDate[3]])
    
    const sending = sendArray.join("-")
    const url = `http://localhost:8000/datepredict/${sending}`;
    console.log(url)
    const getPredictions = () => {
      axios.get(url).then((response)=> {
        //   console.log(response.data)
          setPredictions(response.data.result)
          const maxValue = response.data.result.up[response.data.result.up.length -1].value
          const minValue = response.data.result.down[response.data.result.down.length -1].value
          setMaxvalue(Math.round(maxValue))
          setMinvalue(Math.round(minValue))
          setStage(1)
      }).catch((error)=> {
        console.log(error)
        console.log("Error")
      })
    }
    getPredictions()
  }


  const sendRisk = ()=>{
    
    const strDate = String(Object.entries(predDate)[2][1]);
    const firstDate = strDate.split("(")[0].split(" ");
    const sendArray = Array([firstDate[1],firstDate[2],firstDate[3]])
    
    const sending = sendArray.join("-")

    const targetprice =target
    const lossprice = loss
    const url = `http://localhost:8000/getrisk/${sending}/${targetprice}/${lossprice}`;
    console.log(url)
    const getTargets = () => {
      axios.get(url).then((response)=> {
          console.log(response.data.result)
          setSuccess(response.data.result.target)
          setFail(response.data.result.loss)
          setFactor(response.data.result.factor)
          setStage(2)
      }).catch((error)=> {
        console.log(error)
        console.log("Error")
      })
    }
    getTargets()
  }

  const sendOrder = () =>{
    
  axios.post("http://localhost:8000/orders/create",{
    "created_by": email,
    "target_price": target,
    "loss_price": loss,
    "deadline": predDate,
    "note": note,
    "amount": amount
  },{headers: 
  {
    "Content-Type": "application/json" }}
  ).then((e) => {setStage(0)}
    )
  }

  return (
    
    <Box m="20px">
        
      <Header title="Crear Orden" subtitle="Introduce la cantidad de dias " />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
        label="Selecciona una fecha"
        value={predDate}
        minDate={startDate}
        onChange={(newValue) => {
            setStartDate(newValue);
          }}
        renderInput={(params) => <TextField {...params} />}
        />
        </LocalizationProvider>
        {/* <Box
            m="20px 0 0 0">
          <Button variant="contained"
          color="secondary"
          onClick={()=>{
        
            StageOne(predValue)}}
          >Realizar prediccion</Button>
        </Box> */}
        <Box
            m="20px 0 0 0">
          <Button variant="contained"
          color="secondary"
          onClick={()=>{
        
            sendData(predDate)}}
          >Realizar prediccion</Button>
        </Box>
        

        <Grid>
        {/* <div> */}
        
        {/* </div> */}
        </Grid>
        
        {stage==1? 
      <Box
      m="20px 0 0 0">

      <ChartComponent data={predictions}></ChartComponent>
      <Box m="20px 0 "
      justifyContent={"flex-end"}
      >
    <Typography variant="h3" color={colors.grey[100]}>
    {`Tu rango de precios se encuentra entre ${minvalue} y ${maxvalue}`}
    
    </Typography>
    <Box m="20px 0">
            <Typography variant="h2" color={colors.grey[200]}>
              Calcular riesgo
               
    </Typography>
    
    </Box>
    <Typography variant="h6" color={colors.grey[100]}>
        A continuacion puedes calcular tu riesgo, seleccionando un precio target (mejor precio) y un precio de pérdida(peor precio).
        Indicando los niveles a los que te gustaria comprar, esto servirá para simular tus probabilidades en ambos caso.
        Procura que los niveles se encuentren dentro de tu rango de precio.
    </Typography>
      <Grid justifyContent="flex">
        <Box m="20px 0">
              <TextField
          required
          id="outlined-required"
          label="Precio de target"
          color="secondary"
          type="number"
          onChange={(e)=> setTarget(e.target.value)}
          InputProps={{ inputProps: { min: minvalue, max: maxvalue } }}
        //   onChange={(e) => setPredvalue(e.target.value)}
          defaultValue={maxvalue}
        />
        </Box>
        <Box m="20px 0">
              <TextField
          required
          id="outlined-required"
          label="Required"
          color="secondary"
          type="number"
          onChange={(e)=> setLoss(e.target.value)}
          InputProps={{ inputProps: { min: minvalue, max: maxvalue } }}
        //   onChange={(e) => setPredvalue(e.target.value)}
        defaultValue={minvalue}
        />
        </Box>
      <Button variant="contained"
        
          color="secondary"
          onClick={()=>sendRisk()}
          >Obtener probabilidades</Button>
          </Grid>
        </Box>
      </Box>
      :null}
      {stage==2?
      
      <Box>
                <Box m="20px 0">
              <TextField
          required
          id="outlined-required"
          label="Precio de target"
          color="secondary"
          type="number"
          onChange={(e)=> setTarget(e.target.value)}
          InputProps={{ inputProps: { min: minvalue, max: maxvalue } }}
        //   onChange={(e) => setPredvalue(e.target.value)}
          defaultValue={maxvalue}
        />
        </Box>
        <Box m="20px 0">
              <TextField
          required
          id="outlined-required"
          label="Required"
          color="secondary"
          type="number"
          onChange={(e)=> setLoss(e.target.value)}
          InputProps={{ inputProps: { min: minvalue, max: maxvalue } }}
        //   onChange={(e) => setPredvalue(e.target.value)}
        defaultValue={minvalue}
        />
        </Box>
        <Button variant="contained"
        
        color="secondary"
        onClick={()=>sendRisk()}
        >Obtener probabilidades</Button>
    <Box m="20px 0">
            <Typography variant="h2" color={colors.grey[200]}>
                 ¿Estan las probabilidades a tu favor?
    </Typography>
    
    </Box>
     <Typography variant="h6" color={colors.grey[100]}>
        Hemos pasado tus objetivos a traves de uno de nuestros modelos de inteligencia,
        a continuación se muestran los resultados obtenidos a través de una simulacion de montecarlo

        </Typography>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >

          <StatBox
            title={`${sucess[0]}%`}
            subtitle="Probabilidad de alcanzar tu target"
            progress="0.75"
            increase={sucess[2]}
            color={sucess[1]}
            icon={
              <ClearAllIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${fail[0]}%`}
            subtitle="Probabilidad de alcanzar tu precio de pérdida"
            progress="0.50"
            increase={fail[2]}
            color={fail[1]}
            icon={
              <CloudIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${factor[0]}`}
            subtitle="Factor de riesgo"
            progress="0.30"
            increase={factor[2]}
            color={factor[1]}
            icon={
              <CallMissedOutgoingIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          <Box>
          </Box>
        </Box>
          <Box m="20px 0">
            <Typography variant="h2" color={colors.grey[200]}>
                 Guardar para seguimiento
          </Typography>
          
          </Box>
          <Typography variant="h6" color={colors.grey[100]}>
              Puedes guardar tu orden para realizar un seguimiento, agrega un monto y un comentario para entregarte estadisticas.

        </Typography>
          <Box m ="20px 0">
          <TextField
          id="outlined-multiline-static"
          label="Nota"
          variant="filled"
          multiline
          onChange={(e)=> setNote(e.target.value)}
          rows={4}
          defaultValue=""
        />
        </Box>
        <Box m ="20px 0">
          <TextField
          required
          id="outlined-required"
          label="Monto $"
          color="secondary"
          type="number"
          onChange={(e)=> setAmount(e.target.value)}
        defaultValue={1000}
        />
        </Box>
            <Box>
            <Button variant="contained"
            
            color="secondary"
            onClick={()=>sendOrder()}
            >Guardar Orden</Button>
            </Box>
          </Box>:
       null}

    </Box>
  );
};

export default NewOrder;