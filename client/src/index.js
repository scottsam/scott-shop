import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "../src/index.css";

import store from "./Store/store.js";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
