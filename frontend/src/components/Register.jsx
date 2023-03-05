import {React,handleSubmit,Copyright,useState} from 'react'
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
import axios from "axios";
const Register = () => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: 
            {
              "Content-Type": "application/json" },
              // mode:"cors",
              body:JSON.stringify({
              "email": email,
              "hash_password": password
            }),
          };
        console.log(requestOptions)
        axios.post("http://localhost:8000/users/create",{
          "email": email,
          "hash_password": password
        },{headers: 
        {
          "Content-Type": "application/json" }}
        ).then((e) => {window.location.assign("/");}
          )

      };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmationPassword && password.length > 5) {
          console.log()
          submitRegistration();
        } else {
          setErrorMessage(
            "Ensure that the passwords match and greater than 5 characters"
          );
        }
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} id="qrt-icon" >
            QRT
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
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
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              label="Password"
              type="password"
              id="password"
            //   autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={confirmationPassword}
              name=" confirm-password"
              onChange={(e)=> setConfirmationPassword(e.target.value)}
              label="Confirm Password"
              type="password"
              id="confirm-password"
            //   autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              id="signup-button"
            //   onClick={}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2" id="signup-link">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item >
                <Link href="/signin" variant="body2" id= "signup-link">
                  {<h1>Already have an account? Login</h1>}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
      </div>
  )
}

export default Register
