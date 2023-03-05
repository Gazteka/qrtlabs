import {React,handleSubmit,useState,useContext,useTheme} from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import "../theme"
import { ColorModeContext,tokens } from "../theme";
import axios from "axios";
import UserContext from "../context/UserContext"


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const  [token,setToken] = useState(localStorage.getItem("token"));

  // console.log(token.token)
  const props = useContext(UserContext);
    const handleSubmit = (event) => {
        event.preventDefault();
          const requestOptions = {
            method: "POST",
            headers: 
            {
              "Content-Type": "application/json" },
              // mode:"cors",
              body:JSON.stringify(`grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
            ),
          };
        console.log(requestOptions)
        axios.post("http://localhost:8000/token",
        `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`,{headers: 
        {
          "Content-Type":"application/x-www-form-urlencoded" }}
        ).then((e) =>{
            console.log("Token recibido")
           localStorage.setItem("token",e.data.access_token);
          setToken(e.data.access_token);
        window.location.assign("/")}
          ).catch((error)=> console.log(`Error ${error}`))
        };
  return (<div>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        > 
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} id="qrt-icon">
            QRT
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1  }}>


            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              variant='filled'
              label="Email Address"
              name="email"
              onChange={(e)=> setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              onChange={(e)=> setPassword(e.target.value)}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <FormControlLabel
              control={<Checkbox value="remember"  />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              id="signup-button"
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>          
              <Typography component="h1" variant="h5"   >          
                <Link href="/#" id="signup-link" >
                  Forgot password?
                </Link>
                </Typography>
              </Grid>
              <Grid item >
              <Typography component="h1" variant="h5" >
                <Link href="/signup" id="signup-link" >
                  {<h1 color={"white"}>Don't have an account? Sign Up</h1>}
                </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
      </div>
  )
}

export default Login
