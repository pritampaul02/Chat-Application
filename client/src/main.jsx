import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketContextProvider } from "./context/socketContext";
import { CallContextProvider } from "./context/CallContext";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <SocketContextProvider>
                    <CallContextProvider>
                        <App />
                    </CallContextProvider>
                </SocketContextProvider>
            </ThemeProvider>
        </Provider>
    </StrictMode>
);
