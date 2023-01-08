import ReactDOM from "react-dom/client";

import { createTheme, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store";

import "./index.css";

const theme = createTheme({
   breakpoints: {
    values: {
      xs: 0,
      sm: 700,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
