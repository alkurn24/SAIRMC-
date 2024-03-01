import React, { Component } from "react";
import { Collapse } from "react-bootstrap";
import { NavLink } from "react-router-dom";
// this is used to create scrollbars on windows devices like the ones from apple devices
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import cookie from 'react-cookies';
// import avatar from "assets/img/default-avatar.jpeg";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
// logo for sidebar
import logo from "../../assets/img/arrowsoft.png";
import erp_name_logo from "../../assets/img/ERP_LOGO.png";
// backgroundImage for Sidebar
import image from "assets/img/full-screen-image-3.jpg";
// image for avatar in Sidebar
// import avatar from "assets/img/default-avatar.jpeg";
// logo for sidebar
// import logo from "arrowsoft.png";

import appRoutes from "routes/app.jsx";

// const bgImage = { backgroundImage: "url(" + image + ")" };

var ps;

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAvatar: false,
      openSettings: this.activeRoute("/settings") !== "" ? true : false,
      openCrm: this.activeRoute("/crm") !== "" ? true : false,
      openHrms: this.activeRoute("/hrms") !== "" ? true : false,
      openInventory: this.activeRoute("/inventory") !== "" ? true : false,
      openProduction: this.activeRoute("/production") !== "" ? true : false,
      openPurchase: this.activeRoute("/purchase") !== "" ? true : false,
      openSales: this.activeRoute("/sales") !== "" ? true : false,
      openAssets: this.activeRoute("/assets") !== "" ? true : false,
      openTestMgmt: this.activeRoute("/test") !== "" ? true : false,
      openWorklist: this.activeRoute("/worklist") !== "" ? true : false,
      openTransporter: this.activeRoute("/transporter") !== "" ? true : false,
      openMovement: this.activeRoute("/movements") !== "" ? true : false,
      openReports: this.activeRoute("/reports") !== "" ? true : false,
      isWindows: navigator.platform.indexOf("Win") > -1 ? true : false,
      width: window.innerWidth
    };
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  // if the windows width changes CSS has to make some changes
  // this functions tell react what width is the window
  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }
  componentDidMount() {
    this.updateDimensions();
    // add event listener for windows resize
    window.addEventListener("resize", this.updateDimensions.bind(this));
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.sidebarWrapper, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
  }
  componentDidUpdate() {
    if (navigator.platform.indexOf("Win") > -1) {
      setTimeout(() => {
        ps.update();
      }, 350);
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  render() {
    return (
      <div className="sidebar" data-color="black" data-image={image}>
        {/* <div className="sidebar-background" style={bgImage} /> */}
        <div className="logo">
          <a
            // href="https://www.creative-tim.com"
            className="simple-text logo-mini"
          >
            <div className="logo-img">
              <img src={logo} alt="react-logo" />
            </div>
          </a>
          <a
            className="simple-text logo-normal"
          >
            <img src={erp_name_logo} alt="erp-logo" style={{ width: "180px" }} />
          </a>
        </div>
        <div className="sidebar-wrapper" ref="sidebarWrapper">
          {/* <div className="user">
            <div className="photo">
              <img src={avatar} alt="Avatar" />
            </div>
            <div className="info">
              <a
                onClick={() =>
                  this.setState({ openAvatar: !this.state.openAvatar })
                }
              >
                <span>
                  {cookie.load('user') ? cookie.load('user') : "USERNAME"}<br />
                  <small>{cookie.load('role') ? cookie.load('role') : "ROLE"}</small>
                  <b
                    className={
                      this.state.openAvatar ? "caret rotate-180" : "caret"
                    }
                  />
                </span>
              </a>
              <Collapse in={this.state.openAvatar}>
                <ul className="nav">
                  <li>
                    <a onClick={() => {
                      // TODO: Fetch current user data from cookies
                      let obj = { code: 'E001' };
                      this.props.history.push('/hrms/edit-employee/' + obj.code);
                    }}>
                      <span className="sidebar-mini">EP</span>
                      <span className="sidebar-normal">Edit Profile</span>
                    </a>
                  </li>
                  <li className={this.activeRoute("/logout")} >
                    <NavLink
                      to="/"
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className="fa fa-sign-out" style={{ marginRight: "30px", marginLeft: "3px" }} />
                      <p onClick={this.logout}>Logout</p>
                    </NavLink>
                  </li>
                </ul>
              </Collapse>
            </div>
          </div> */}

          <ul className="nav">
            {/* If we are on responsive, we want both links from navbar and sidebar
                            to appear in sidebar, so we render here HeaderLinks */}
            {this.state.width <= 992 ? <HeaderLinks /> : null}
            {/*
                            here we render the links in the sidebar
                            if the link is simple, we make a simple link, if not,
                            we have to create a collapsible group,
                            with the speciffic parent button and with it's children which are the links
                        */}
            {appRoutes.map((prop, key) => {
              var st = {};
              st[prop["state"]] = !this.state[prop.state];
              if (prop.roles && prop.roles.indexOf(cookie.load("role")) === -1) return null;
              if (prop.collapse) {
                return (
                  <li className={this.activeRoute(prop.path)} key={key}>
                    <a onClick={() => this.setState(st)}>
                      <i className={prop.icon} />
                      <p>
                        {prop.name}
                        <b
                          className={
                            this.state[prop.state]
                              ? "caret rotate-180"
                              : "caret"
                          }
                        />
                      </p>
                    </a>
                    <Collapse in={this.state[prop.state]}>
                      <ul className="nav">
                        {prop.views.map((prop, key) => {
                          if (prop.subpage || (prop.roles && prop.roles.indexOf(cookie.load("role")) === -1)) {
                            return null;
                          } else {
                            return (
                              <li
                                className={this.activeRoute(prop.path)}
                                key={key}
                              >
                                <NavLink
                                  to={prop.path}
                                  className="nav-link"
                                  activeClassName="active"
                                >
                                  <span className="sidebar-mini">
                                    {prop.mini}
                                  </span>
                                  <span className="sidebar-normal">
                                    {prop.name}
                                  </span>
                                </NavLink>
                              </li>
                            );
                          }
                        })}
                      </ul>
                    </Collapse>
                  </li>
                );
              } else {
                if (prop.redirect) {
                  return null;
                } else {
                  return (
                    <li className={this.activeRoute(prop.path)} key={key}>
                      <NavLink
                        to={prop.path}
                        className="nav-link"
                        activeClassName="active"
                      >
                        <i className={prop.icon} />
                        <p>{prop.name}</p>
                      </NavLink>
                    </li>
                  );
                }
              }
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;
