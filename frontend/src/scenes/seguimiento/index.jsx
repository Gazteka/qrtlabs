import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import {ChartComponent,initialData} from "../../components/CandlestickHover";
import {React,handleSubmit,Copyright,useState,useEffect} from 'react';
import axios from "axios";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';




const Seguimiento = ({email}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [predictions, setPredictions] = useState(null); 
  const [age, setAge] = useState('');
  const [orders,setOrders] = useState(null);
  const [update,setUpdate] = useState(false)
  useEffect(()=> {
      const url = 'http://localhost:8000/users/orders';

            axios.post(url,{
            "email": email,
            },{headers: 
            {
            "accept": "application/json" }}
            ).then((response)=> {
                console.log(response.data)
                setOrders(response.data.result)
                console.log("a")
                setUpdate(true)
            }).catch((error)=> {
            console.log(error)
            console.log("Error")
            })
        },[email]
);
        
        
      useEffect(() => {
            const url2 = `http://localhost:8000/getorder/`;
            axios.get(url2).then((response)=> {
                console.log(response.data)
                console.log("E")
                setPredictions(response.data.result)

                console.log()
            }).catch((error)=> {
            console.log(error)
            console.log("Error")
            })
        },[email])
        
  

  return (
    <Box m="20px">
      <Header title="Calculadora de riesgo" subtitle="Realiza un seguimiento a tus ordenes" />
      {orders?<div>
        <Box>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
        //   onChange={handleChange}
        >
          <MenuItem value={10}>2023-03-03</MenuItem>
          {/* <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem> */}

        </Select>
      </FormControl>
        <ChartComponent data={predictions?predictions:initialData}></ChartComponent>
        </Box>
        </div>:null}
    </Box>
  );
};

export default Seguimiento;