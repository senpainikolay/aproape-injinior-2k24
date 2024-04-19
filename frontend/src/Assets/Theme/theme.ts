  import { createTheme } from "@mui/material/styles";
import backgroundImage from "../Icons/site-background.jpg";

const themeDetails = {
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        contained: {
          opacity: 1,
          ":hover": {
            backgroundColor: "rgba(250, 184, 76, 1)",
            color: "#0A2435",
            boxShadow: "0px 4px 4px rgba(255, 177, 170, 0.48)",
          },
        },
        outlined: {
          color: "#0A2435",
          ":disabled": {
            color: "#0A2435",
            opacity: 0.4,
          },
        },
        text: {
          color: "#0A2435",
        },
      },
    },

    FormControl: {
      styleOverrides: {
        root: {
          backgroundColor: "red",
        },
      },
    }
  },
  palette: {
    common: { black: "#000", white: "#fff" },
    background: { paper: "#fff", default: "#fff" },
    primary: {
      main: "#4997C4",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#3A98B9",
      contrastText: "#FFF",
    },
    error: {
      light: "#FF8185",
      main: "#EA6858",
      dark: "#C5483C",
      contrastText: "#FFF5F1",
    },
    text: {
      primary: "#333333",
      secondary: "rgba(10, 36, 53, 0.6)",
      disabled: "#6F5955",
      hint: "#574142",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          background: `url("${backgroundImage}")`,
          backgroundSize: "100%",
        },
      },
    },
  },
};

const theme = createTheme(themeDetails);

export default theme;
