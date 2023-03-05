

import { PropaneSharp } from '@mui/icons-material';
import axios from 'axios';
import {React,useState,useContext,useEffect,createContext} from 'react'
import { tokens } from '../theme';

export const UserContext = createContext(null);


export const UserInfoProvider = (props) => {
  const [token,setToken] = useState(localStorage.getItem("token"))
  const [email,setEmail] = useState("");
  useEffect(() =>{
    axios.get("http://localhost:8000/users/me",{headers:{
      "accept":"application/json",
      "Authorization":"Bearer "+token,
    }}).then((response)=> {
      setEmail(response.data.email)
        console.log("email,setted")
        console.log(email)


    }).catch((error)=> {
        console.log(error)
      // console.log("Settingtokennull")
      // setToken(null)
    });

  },[email]);
  
  // const item = localStorage.getItem("user_info")
  // console.log(`user_info : ${item}`)

  return ([email,setEmail]

  )
}

export default UserInfoProvider

