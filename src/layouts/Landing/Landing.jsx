import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Footer from "components/Footer/Footer.jsx";
import LandingHeader from "components/Header/LandingHeader.jsx";

// dinamically create users routes
import landingRoutes from "routes/landing.jsx";
import bgImage from "assets/img/login-bg.jpg";

class Pages extends Component {
  getPageClass() {
    var pageClass = "";
    var temp = this.props.location.pathname.split("/")[1]
    switch (temp) {
      case "login":
        pageClass = " login-page";
        break;
      case "register":
        pageClass = " register-page";
        break;
      case "lock-screen":
        pageClass = " lock-page";
        break;
      case "forgot-password":
        pageClass = " lock-page";
        break;
      default:
        pageClass = "";
        break;
    }
    return pageClass;
  }
  componentWillMount() {
    if (document.documentElement.className.indexOf("nav-open") !== -1) {
      document.documentElement.classList.toggle("nav-open");
    }
  }
  render() {
    return (
      <div>
        <LandingHeader />
        <div className="wrapper wrapper-full-page">
          <div
            className={"full-page" + this.getPageClass()}
            data-color="black"
            data-image={bgImage}
          >
            <div className="content">
              <Switch>
                {landingRoutes.map((prop, key) => {
                  if (prop.redirect)
                    return (
                      <Redirect from={prop.path} to={prop.pathTo} key={key} />
                    );
                  else
                    return (
                      <Route
                        path={prop.path}
                        component={prop.component}
                        key={key}
                      />
                    );
                })}
              </Switch>
            </div>
            <Footer transparent />
            <div
              className="full-page-background"
              style={{ backgroundImage: "url(" + bgImage + ")" }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Pages;



// WEBPACK FOOTER //
// src/layouts/Landing/Landing.jsx