import Topbar from "./scenes/global/Topbar";
import { ColorModeContext,useMode } from "./theme";
import { CssBaseline,ThemeProvider } from "@mui/material";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import {Route, Routes} from "react-router-dom";
import {UserContext,UserProvider} from "./context/UserContext";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import NewOrder from "./scenes/neworder";
import Atr from "./scenes/atr";
import Calendar from "./scenes/calendar";
import AllOrders from "./scenes/allorders";
import Seguimiento from "./scenes/seguimiento";
import {UserInfoProvider} from "./context/UserInfo";

function App() {
  const [theme,colorMode] = useMode();
  const [token,setToken] = UserProvider();
  const [email,setEmail] = UserInfoProvider();


  return (<ColorModeContext.Provider value = {colorMode}>
            <ThemeProvider theme= {theme}>
              <CssBaseline />


                  <div className="App">
                    <Topbar id="header" token={token}/>
                    
                    {!token?
                    <div>
                    <Routes>
                    <Route path="/" element={<Home theme={theme}/>}/>
                    <Route path="/signin" element={<Login/>}/>
                    <Route path="/signup" element={<Register/>}/>
                    </Routes>
                    </div>
                    :
                    // <Route path="/" element= {<Dashboard/>} />
                    <div className="app">
                    <Sidebar/>
                    <main className="content">
                    <Routes>
                      <Route path="/" element={<Dashboard/>}/>
                      <Route path="/allorders" element= {<AllOrders email={email}/>} />
                    <Route path="/neworder" element={<NewOrder email={email}/>}/>
                    <Route path="/atr" element={<Atr/>}/>
                    <Route path="/calendar" element= {<Calendar/>} />
                    <Route path="/seguimiento" element= {<Seguimiento email={email}/>} />
                    </Routes>
                    </main>
                    </div>
                      }
                    
                    <Footer/>
                  </div>



            </ThemeProvider>
            </ColorModeContext.Provider>
  );
}

export default App;
