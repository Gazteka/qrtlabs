import {Box,Icon, IconButton, useTheme}  from "@mui/material"
import { useContext } from "react";
import { ColorModeContext,tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import QRTlogo from "../../images/favicon_QRT.png"


const Topbar = ({token,setToken}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);  
    const colorMode = useContext(ColorModeContext);
    return (<div id="header">
            <Box 
            backgroundColor={theme.palette.mode === 'dark'?colors.primary[500]:"white"}
            display="flex" 
            justifyContent="space-between" 
                p={2}>
                     <Box 
                        display="flex" 
                        backgroundColor={theme.palette.mode === 'dark'?colors.primary[500]:"white"}
                        
                        borderRadius ="3px">
                            <Link href="/" variant="h1"   >
                                                        <img src={QRTlogo}
                            widht="40"
                            height="40"
                            
            ></img>
            </Link>
            <Typography component="h2" variant="h3" href="/">Lab</Typography>
            

                        </Box>
                        <Box 
                        // display="flex-end" 
                        // backgroundColor={colors.primary[400]} 
                        borderRadius ="3px">
                        
                        </Box>
                        <Box display = "flex">
                        
                            <div>
                            <IconButton onClick= {colorMode.toggleColorMode}>
                                {theme.palette.mode === 'dark'? (
                                <DarkModeOutlinedIcon/>) : (<LightModeOutlinedIcon/>
                                )}
                            
                            </IconButton>
                            </div>
                            {token?
                            <div>
                            <IconButton>
                                <NotificationsOutlinedIcon />
                            </IconButton>
                            <IconButton>
                                <SettingsOutlinedIcon/>
                            </IconButton>
                            <Link href="/" onClick={(e)=>{localStorage.setItem("token",null);
                            setToken(null);
                            window.location.assign("/")}}>
                                <IconButton className={"Logoutbutton"}>
                                    <PersonOutlinedIcon/>
                                    <Typography>Logout</Typography>
                                </IconButton>
                        
                            </Link>
                            </div>: null}
                        </Box>
                    </Box>
                    </div>);
};



export default Topbar;