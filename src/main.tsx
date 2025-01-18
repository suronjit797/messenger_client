import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { ApolloProvider } from "@apollo/client";
import { gqlClient } from "./graphql.js";

// check root element is exist
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ApolloProvider client={gqlClient}>
      <App />
    </ApolloProvider>
  </Provider>
  // </React.StrictMode>
);
