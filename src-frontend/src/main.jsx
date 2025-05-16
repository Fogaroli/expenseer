import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import store from "./store/store.jsx";
import "./main.css";
import App from "./App.jsx";
import theme from "./Theme.jsx";
import { ThemeProvider } from "@emotion/react";

/** Main react component
 * Loads Redux store
 */
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <StrictMode>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </StrictMode>
    </Provider>
  </BrowserRouter>
);
