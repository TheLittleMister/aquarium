import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    // Tell MUI what's the font-size on the html element is.
    htmlFontSize: 10,
    allVariants: {
      color: "#3d6b99",
    },
  },

  /////////////////////////////////

  palette: {
    primary: {
      main: "#3d6b99",
    },
    secondary: {
      main: "#8c0d97",
    },
    blue: {
      main: "#66b2ff",
      light: "#e0f0ff",
      font: "#3d6b99",
    },
    pink: {
      main: "#e455e6",
      light: "#fceafc",
      font: "#8c0d97",
    },
    red: {
      main: "#dc143c",
      // light: "#",
      font: "#8b0000",
    },
    green: {
      main: "#28a745",
      // light: "#",
      font: "#008000",
    },
    yellow: {
      main: "#ed6c02",
      // light: "#",
      font: "#cc3700",
    },
    disabled: {
      main: "#0000001f",
      // light: "#",
      font: "#00000042",
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
