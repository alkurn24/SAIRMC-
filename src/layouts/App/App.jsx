import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// this is used to create scrollbars on windows devices like the ones from apple devices
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import NotificationSystem from "react-notification-system";
import SweetAlert from "react-bootstrap-sweetalert";
import { getNotificationData } from "../../modules/dashboard/server/DashboardServerComm";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import appRoutes from "routes/app.jsx";
import { style } from "variables/Variables.jsx";
import { socketInit } from "js/socket.io.js"
import cookie from 'react-cookies';

import { Grid, Row } from "react-bootstrap";
import Card from "components/Card/Card.jsx";

var ps;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _notificationSystem: null,
      dispatch: [],
    };
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.handleNotificationDispatch = this.handleNotificationDispatch.bind(this);
    // this.handleNotificationStore = this.handleNotificationStore.bind(this);
    this.notificationAlertDispatch = this.notificationAlertDispatch.bind(this);
    this.notificationAlertStore = this.notificationAlertStore.bind(this);
  }
  componentDidMount() {
    socketInit();
    if (!cookie.load("email")) {
      this.props.history.push('/login');
    }
    this.setState({ _notificationSystem: this.refs.notificationSystem });
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel);
    }
    cookie.save('notificationTime', 1);
    if (cookie.load('role') === "quality") {

      setTimeout(() => this.notificationAlertDispatch(), (10000));
    }
    else if (cookie.load('role') === "stores") {
      setTimeout(() => this.notificationAlertStore(), (10000));

    }
  }
  componentWillReceiveProps(newProps) {
    this.props = newProps
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }

  }
  notificationAlertDispatch() {
    let _this = this;
    let time = cookie.load('notificationTime') - 1
    if (time === 0) {
      cookie.save('notificationTime', 1);
      setTimeout(() => this.notificationAlertDispatch(), (10000));
      getNotificationData(null,
        function success(data) {
          console.log(data)
          if (data.dispatchNotifications.rows.length >= 1) {
            _this.setState({
              dispatch: data.dispatchNotifications.rows.map(prop => {
                return {
                  number: prop.number,
                }
              }),

              loading: false

            })
            let dispatchData = _this.state.dispatch;
            for (var i = 0; i < dispatchData.length; i++) {
              _this.handleNotificationDispatch(dispatchData[i])
            }
          }
        })

    } else {
      cookie.save('notificationTime', time);
    }

  }
  notificationAlertStore() {
    let _this = this;
    let time = cookie.load('notificationTime') - 1
    if (time === 0) {
      cookie.save('notificationTime', 1);
      setTimeout(() => this.notificationAlertStore(), (10000));
      getNotificationData(null,
        function success(data) {
          console.log(data)
          if (data.dispatchNotifications.rows.length >= 1) {
            _this.setState({
              dispatch: data.dispatchNotifications.rows.map(prop => {
                return {
                  number: prop.number,
                }
              }),

              loading: false

            })
            let dispatchData = _this.state.dispatch;
            for (var i = 0; i < dispatchData.length; i++) {
              //    _this.handleNotificationStore(dispatchData[i])
            }
          }
        })

    } else {
      cookie.save('notificationTime', time);
    }

  }
  componentDidUpdate(e) {
    if (navigator.platform.indexOf("Win") > -1) {
      setTimeout(() => {
        ps.update();
      }, 350);
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
    if (
      window.innerWidth < 993 &&
      e.history.action === "PUSH" &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
  }
  componentWillMount() {
    if (document.documentElement.className.indexOf("nav-open") !== -1) {
      document.documentElement.classList.toggle("nav-open");
    }
  }
  // function that shows/hides notifications - it was put here, because the wrapper div has to be outside the main-panel class div
  handleNotificationDispatch(message) {
    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className="fa fa-bell" />,
      message: (
        <div>
          {"Please  BOM verify  for  " + message.number + "."}

        </div>
      ),
      level: "warning",
      position: "tr",
      autoDismiss: 10
    });
  }
  successAlert(message) {
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title={message}
          onConfirm={() => this.setState({ alert: null })}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
        >
        </SweetAlert>
      )
    });
  }
  errorAlert(message) {
    this.setState({
      alert: (
        <SweetAlert
          error
          style={{ display: "block", marginTop: "-100px" }}
          title={message}
          onConfirm={() => this.setState({ alert: null })}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
        >
        </SweetAlert>
      )
    });
  }
  render() {
    return (
      <div className="wrapper">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Sidebar {...this.props} />
        <div
          className={
            "main-panel" +
            (this.props.location.pathname === "/maps/full-screen-maps"
              ? " main-panel-maps"
              : "")
          }
          ref="mainPanel"
        >
          <Header {...this.props} />
          <div className="main-content">
            <Grid fluid>
              <Card
                content={
                  <Row>
                    <Switch>
                      {appRoutes.map((prop, key) => {
                        if (prop.collapse) {
                          return prop.views.map((prop, key) => {
                            if (prop.name === "Notifications") {
                              return (
                                <Route
                                  path={prop.path}
                                  key={key}
                                  render={routeProps => (
                                    <prop.component
                                      {...routeProps}
                                      handleClick={this.handleNotificationDispatch}
                                    />
                                  )}
                                />
                              );
                            } else {
                              return (
                                <Route
                                  path={prop.path}
                                  component={prop.component} v
                                  successAlert={this.successAlert}
                                  errorAlert={this.errorAlert}
                                  key={key}
                                />
                              );
                            }
                          });
                        } else {
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
                        }
                      })}
                    </Switch>

                  </Row>
                }
              />
            </Grid>
          </div>
          <Footer fluid />
        </div>
      </div>
    );
  }
}

export default Dashboard
