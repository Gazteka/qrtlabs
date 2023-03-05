
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from "./../images/patt.jpg"
import Paper from '@mui/material/Paper';
import LabImage from "./../images/lab_generated.png"
import MarketImage from "./../images/market.jpeg"
import FactoryImage from "./../images/factory.png"

const styles = {
    paperContainer: {
        backgroundImage: `url(${Image})`,
        // backgroundSize: 'cover',
        backgroundPosition: 'center',
    }
};


const Home = ({theme}) => {


    const cards = [1, 2, 3];
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <AppBar position="relative">
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Album layout
          </Typography>
        </Toolbar>
      </AppBar> */}
      <main>
        {/* Hero unit */}
        
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
          style={styles.paperContainer}
        >

          <Container width="90%">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              ¡Bienvenido al Laboratorio!
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Estamos buscando formas acercar los datos a las personas para que puedan tomar mejores decisiones.
                    Al probar nuestras aplicaciones y darnos feedback, mejoras la experiencia de usuario.
                    ¡Prueba nuestras aplicaciones y danos tu feedback!

            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            > 
            <Link href= "/signin">
              <Button variant="contained">Iniciar Sesión</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outlined">Registrarse</Button>
              </Link>
            </Stack>
          </Container>

        </Box>
        
        <Container sx={{ py: 8 }} maxWidth="md">
        <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Acerca de nosotros
            </Typography> 
            <Typography
              component="h1"
              variant="h4"
              align="center"
              color="text.secondary"
              gutterBottom
            >
              (Las siguientes imagenes fueron generadas a través de inteligencia artificial)
            </Typography> 
          {/* End hero unit */}
          <Grid container spacing={4}>
            {/* {cards.map((card) => ( */}
              <Grid item key={1} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image={LabImage}
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Investigación
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe the
                      content.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item key={1} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image={FactoryImage}
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      AI factory
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe the
                      content.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item key={1} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image={MarketImage}
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Analisis cuantitativo
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe the
                      content.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            {/* ))} */}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      {/* <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>

      </Box> */}
      {/* End footer */}
    </ThemeProvider>
  );
}

export default Home
