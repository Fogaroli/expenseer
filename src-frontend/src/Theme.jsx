import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
      light: "#a5d6a7",
      dark: "#1b5e20",
    },
    secondary: {
      main: "#cddc39",
    },
    background: {
      default: "#c8e6c9",
      paper: "#e8f5e9",
    },
  },
});

export default theme;
