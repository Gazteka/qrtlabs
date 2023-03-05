import { Box, Button, TextField,useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";


const Atr = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px" height="60%">
      <Header title="Modelo ATR" subtitle="Modelo de volatilidad para el USDCLP" />
      <iframe title="ATRBACKUP" width="95%" height="600px" 
      src="https://app.powerbi.com/view?r=eyJrIjoiMDNmZDAzYzctMWIxMi00ODc0LTg2Y2QtYmVkNjZiMzYwNWQwIiwidCI6ImQzMmIwMTgwLTdiYTAtNDM4OC1hZjcwLTQ5YTM4NmNlNGQ4ZCJ9" 
      frameborder="0" 
      allowFullScreen="true">

      </iframe>

    </Box>
  );
};

export default Atr;