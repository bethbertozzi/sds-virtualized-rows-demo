import ReactDOM from "react-dom";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "czifui";
import { StrictMode } from "react";

import App from "./main";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={defaultTheme}>
        <EmotionThemeProvider theme={defaultTheme}>
          <App />
        </EmotionThemeProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
  rootElement
);
