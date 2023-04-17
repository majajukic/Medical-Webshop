import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'Roboto, sans-serif',

    },
    palette: {
        primary: {
            main: '#2A7C6C', 
        },
        secondary: {
            main: '#CCE8E1', 
        },
        accent: {
            main:'#F1DFDB'
        }
    },
    // add more global CSS styles as needed
});

export default theme;
