import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import {React,handleSubmit,Copyright,useState,useEffect} from 'react';
import  { UserInfoProvider } from "../../context/UserInfo"


const AllOrders = ({email}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [orders,setOrders] = useState(null);
  const [update,setUpdate] = useState(false)
  // const email = email;
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "created_by", headerName: "Created by" },
    {
      field: "target_price",
      headerName: "Target Price",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "loss_price",
      headerName: "Loss Price",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "created_at",
      headerName: "Created date",
      flex: 1,
    },
    {
      field: "deadline",
      headerName: "Deadline date",
      flex: 1,
    },
 
  ];

    const url = 'http://localhost:8000/users/orders';
    console.log(url)
    useEffect(() => {
      axios.post(url,{
        "email": email,
      },{headers: 
      {
        "accept": "application/json" }}
      ).then((response)=> {
          console.log(response.data)
          setOrders(response.data.result)
          setUpdate(true)
      }).catch((error)=> {
        console.log(error)
        console.log("Error")
      })
    },[email])

  



  return (
    <Box m="20px">
      <Header
        title="Ordenes"
        subtitle="Aqui puedes revisar tus ordenes en progreso"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        widht="90%"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {update?
        <DataGrid
          rows={orders}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />:
        <DataGrid
          rows={mockDataContacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
        } 

      </Box>
    </Box>
  );
};

export default AllOrders;




