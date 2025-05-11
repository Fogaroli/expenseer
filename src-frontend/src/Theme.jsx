import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50", // your primary color
      light: "#a5d6a7", // lighter shade
      dark: "#1b5e20", // darker shade
    },
    secondary: {
      main: "#cddc39", // your secondary color
    },
    // You can also customize other colors
    background: {
      default: "#c8e6c9",
      paper: "#e8f5e9",
    },
  },
});

export default theme;
