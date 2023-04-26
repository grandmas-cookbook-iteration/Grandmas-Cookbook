import React, { FC, useState, ReactElement} from 'react';
import { Palette, Typography, AppBar, Container, Toolbar, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CardGrid from './containers/cardGrid';

// TODO: extend palette with terniary
// interface customPalette extends Palette {
//   tertiary:
// }

//MuiPaper might need import later

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFE8D6',
    },
    secondary: {
      main: '#DDBEA9',
    },
    // tertiary: {
    //   main: '#CB997E',
    // },
  },
  components: { 
    MuiPaper: { 
      styleOverrides: { 
        root: {
          'background': '#DDBEA9',
        }
      }
    }}
});


const App : FC<{}> = () => {
  return (
    <ThemeProvider theme={theme}>
      <header>
        <Typography align="center" variant="h1" color="primary">
          {"Grandma's Cookbook"}
        </Typography>
        <div className="actionHeader">
          <Typography variant="h2" align="center" color="primary">
            Recipes
          </Typography>
        </div>
      </header>
      <CardGrid />
    </ThemeProvider>
  );
}

export default App;
