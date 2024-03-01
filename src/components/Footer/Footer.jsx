import React, { Component } from "react";
import { version } from "variables/appVariables.jsx";


class Footer extends Component {
  render() {
    return (
      <footer
        className={
          "footer Main-footer" +
          (this.props.transparent !== undefined ? " footer-transparent" : "")
        }
      >
        <div
          className={
            "container" + (this.props.fluid !== undefined ? "-fluid" : "")
          }
        >
          {/* <nav className="pull-left">
            <ul>
              <li>
                <a href="#pablo">Home</a>
              </li>
              <li>
                <a href="#pablo">Company</a>
              </li>
              <li>
                <a href="#pablo">Portfolio</a>
              </li>
              <li>
                <a href="#pablo">Blog</a>
              </li>
            </ul>
          </nav> */}
          <p className="copyright pull-left">
            Version: {version}
          </p>
          <p className="copyright pull-right">
            &copy; {1900 + new Date().getYear()}{" "}
            <a href="http://www.arrowsoft.in" target="_blank" rel="noopener noreferrer">Arrowsoft Consultancy Pvt. Ltd.</a>
          </p>
        </div>
      </footer>
    );
  }
}
export default Footer;
