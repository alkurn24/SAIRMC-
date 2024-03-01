import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

import indexRoutes from "./routes/index.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
// import "./assets/css/black-dashboard-react.css";
import "./assets/sass/light-bootstrap-dashboard.css?v=1.1.1";
//import "./assets/css/style.css";
// import "./assets/css/pe-icon-7-stroke.css";
// import "./assets/css/arrowsoft-erp.css";
import "./assets/css/final_rmc.css";
import "./assets/css/theme.css";
ReactDOM.render(
  <HashRouter>
    <Switch>
      {indexRoutes.map((prop, key) => {
        return <Route path={prop.path} component={prop.component} key={key} />;
      })}
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
