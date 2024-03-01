import React, { Component } from "react";
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Modal } from "react-bootstrap";
import cookie from 'react-cookies';
import axios from 'axios';
import ForgotPasswordModal from 'views/User/ForgotPasswordModal.jsx';
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import CustomSweetAlert from 'components/CustomAlert/CustomAlert.component.jsx';
import { errors } from 'js/errors.js';
import CryptoJS from 'crypto-js'
import { backendURL, encdec } from 'variables/appVariables.jsx';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: "1",
      username: "",
      password: "",
      passwordType: "password",
      cardHidden: true,

      alert: null,

      //Validations
      usernameValid: null,
      passwordValid: null,
      // formError: null,
      usernameError: false,
      passwordError: false,
    };

    this.onLogin = this.onLogin.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleShowForgotPassword = this.handleShowForgotPassword.bind(this);
    this.handleCloseForgotPassword = this.handleCloseForgotPassword.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
  }

  handleShowForgotPassword() { this.setState({ showForgotPasswordModal: true }); }
  handleCloseForgotPassword() { this.setState({ showForgotPasswordModal: false }); }


  onLogin() {
    var creds = {
      // username: this.state.username,
      // password: this.state.password,
      otp: this.state.otp
    },
      url = backendURL + 'auth/local',
      _this = this,
      uname = this.state.username,
      // uname = "001",
      pass = this.state.password;

    _this.setState({ formError: "" });
    var encData = CryptoJS.AES.encrypt(JSON.stringify(creds), encdec);
    (_this.state.usernameValid && _this.state.passwordValid) ? (
      // axios.post(url, {}, { "headers": { "authorization": "Basic " + encoded }, auth: {  } }).then(function (res) {
      axios.post(url, { data: encData.toString() }, {
        auth: {
          username: uname,
          password: pass
        }
      }).then(function (res) {
        var bytes = CryptoJS.AES.decrypt(res.data.toString(), encdec);
        res.data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const expires = new Date(Date.now() + 86400000); // expires in 1 day
        cookie.save('user', res.data.user.name, { path: '/', expires });
        cookie.save('role', res.data.user.role, { path: '/', expires });
        cookie.save('id', res.data.user.id, { path: '/', expires });
        cookie.save('email', res.data.user.email, { path: '/', expires });
        cookie.save('username', res.data.user.username, { path: '/', expires });
        cookie.save('photo', res.data.user.photo, { path: '/', expires });
        cookie.save('userAvatar', res.data.user.photo, { path: '/', expires });
        cookie.save('token', res.data.token, { path: '/', expires });
        cookie.save('loginStatus', true, { path: '/', expires });
        // Minimize the sidebar on login. This will help to show maximum screen area.
        if (!document.body.classList.value.includes("sidebar-mini")) {
          document.body.classList.toggle("sidebar-mini");
        }
        _this.props.history.push('/dashboard');
      }).catch(function (error) {
        _this.setState({ formError: !error.response ? errors("Network error") : (error.response ? errors(error.response.status) : errors(error)) })
      })
    ) : _this.setState({ formError: "Please fill the required fields" })
  }

  handleInputChange(e) {
    if (e.target.name === "password") {
      let tempObj = this.state;
      tempObj.passwordType = "password";
      this.setState({ tempObj })
    }
    this.setState({ [e.target.name]: e.target.value, [e.target.name + 'Valid']: true, formError: "" });
  }

  validationCheck() {

    this.state.username === "" ?
      this.setState({ usernameError: "Enter Employee code", usernameValid: false }) :
      this.setState({ usernameError: "", usernameValid: true })

    this.state.password === "" ?
      this.setState({ passwordError: "Enter Password", passwordValid: false }) :
      this.setState({ passwordError: "", passwordValid: true })

    setTimeout(this.onLogin, 10);
  }


  forgotPassword(usernameObj) {
    this.handleCloseForgotPassword();
    var _this = this;
    // var url = backendURL + 'users/password';
    axios.post(backendURL, usernameObj, { 'headers': { 'Authorization': 'Bearer ' + cookie.load('token') } }).then(function (res) {
      // console.log(res);
      if (res.status === 200) {
        _this.setState({
          alert: (
            <CustomSweetAlert
              success
              message={"An username has been sent to reset your password"}
              onConfirm={() => _this.setState({ alert: "" })}
            />
          )
        });
        // setTimeout(() => _this.setState({ alert: "" }), 3000);
      }
    }).catch(function (error) {
      console.error(error);
      _this.setState({
        alert: (
          <CustomSweetAlert
            error
            message={!error.response ? errors("Network error") : (error.response ? errors(error.response.status) : errors(error))}
            onConfirm={() => _this.setState({ alert: "" })}
          />
        )
      })
    });
  }


  componentDidMount() {
    setTimeout(
      function () {
        this.setState({ cardHidden: false });
      }.bind(this),
      700
    );
  }

  render() {
    return (
      <Grid>
        {this.state.alert}
        <Row>
          <Col md={4} sm={6} mdOffset={8} smOffset={2}>
            <form>
              <Card
                closeButton
                hidden={this.state.cardHidden}
                textCenter
                title="Login"
                content={
                  <div>
                    <FormGroup>
                      <ControlLabel>Company Code</ControlLabel>
                      <FormControl
                        disabled={true}
                        placeholder="Enter company code"
                        type="text"
                        name="company"
                        value={this.state.company}
                        onChange={this.handleInputChange}
                      // className={this.state.usernameValid || this.state.usernameValid === null ? "" : "error"}
                      />
                      {/* <small className="text-danger">{this.state.usernameError}</small> */}
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>user name</ControlLabel>
                      <FormControl
                        placeholder="Enter user name"
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                        className={this.state.usernameValid || this.state.usernameValid === null ? "" : "error"}
                        onKeyPress={event => {
                          if (event.key === "Enter") {
                            this.validationCheck();
                          }
                        }}
                      />
                      {/* <small className="text-danger">{this.state.usernameError}</small> */}
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Password</ControlLabel>
                      <span className="input-group">
                        <FormControl
                          placeholder="Password"
                          type={this.state.passwordType}
                          name="password"
                          value={this.state.password}
                          onChange={this.handleInputChange}
                          className={this.state.passwordValid || this.state.passwordValid === null ? "" : "error"}
                          onKeyPress={event => {
                            if (event.key === "Enter") {
                              this.validationCheck();
                            }
                          }}
                        />

                        <span className="input-group-addon"><i id="pass-status" class={this.state.passwordType === "password" ? "fa fa-eye-slash" : "fa fa-eye"} aria-hidden="true"
                          onClick={(e) => {
                            let tempObj = this.state;
                            tempObj.passwordType = this.state.passwordType === "password" ? "text" : "password"
                            this.setState({ tempObj })
                          }}></i></span>
                      </span>
                      {/* <small className="text-danger">{this.state.passwordError}</small> */}
                    </FormGroup>
                    <h6 className="text-danger">{this.state.formError}</h6>
                  </div>
                }
                legend={
                  <div>

                    <Button bsStyle="info" fill wd onClick={this.validationCheck}>Login</Button>
                    <br /><a role="button" onClick={this.handleShowForgotPassword}>Forgot Password</a>
                    {/* <br /><a role="button" onClick={this.handleShowTermsConditions}>Terms and Conditions</a> */}
                  </div>
                }
                ftTextCenter
              />
              <Modal show={this.state.showForgotPasswordModal} onHide={this.handleCloseForgotPassword} >
                <ForgotPasswordModal
                  handleCloseForgotPassword={this.handleCloseForgotPassword}
                />
              </Modal>
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default LoginPage;
