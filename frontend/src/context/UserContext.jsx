

import { PropaneSharp } from '@mui/icons-material';
import axios from 'axios';
import {React,useState,useContext,useEffect,createContext} from 'react'
import { tokens } from '../theme';


export const UserContext = createContext(null);

export const UserProvider = (props) => {
  const [token,setToken] = useState(localStorage.getItem("token"))
  useEffect(() =>{
    axios.get("http://localhost:8000/users/me",{headers:{
      "accept":"application/json",
      "Authorization":"Bearer "+token,
    }}).then((response)=> {
      localStorage.setItem("token",token)
      setToken(token)
      // response?  localStorage.setItem("user_info",response.data.email):
      // localStorage.setItem("user_info",null)
    


    }).catch((error)=> {
      // console.log("Settingtokennull")
      // setToken(null)
    });

  },[token])
  
  // const item = localStorage.getItem("user_info")
  // console.log(`user_info : ${item}`)

  return ([token,setToken]

  )
}

export default UserProvider

