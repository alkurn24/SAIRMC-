import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import CryptoJS from 'crypto-js';
import SweetAlert from "react-bootstrap-sweetalert";
import { Row, Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import Button from 'components/CustomButton/CustomButton.jsx';

import { backendURL, encdec } from 'variables/appVariables.jsx';

class ChangePassword extends Component {
  constructor() {
    super()
    this.state = {
      alert: null,
      pictures: [],
      details: {
        oldPassword: "",
        password: "",
        cfpassword: "",
        user: cookie.load("id"),
      },
      oldPasswordError: "",
      passwordError: "",
      cfpasswordError: "",
      passwordMatchError: "",
      oldPasswordValid: null,
      passwordValid: null,
      cfpasswordValid: null,
      passwordMatch: null
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.passwordValidationCheck = this.passwordValidationCheck.bind(this);
    this.resetData = this.resetData.bind(this);
    this.successAlert = this.successAlert.bind(this);
  }

  handleInputChange(e) {
    var newDetails = this.state.details;
    newDetails[e.target.name] = e.target.value.trim();
    this.setState({ details: newDetails });
  }
  passwordValidationCheck() {
    this.state.details.oldPassword === "" ?
      this.setState({ oldPasswordError: "ENTER oldPassword", oldPasswordValid: false }) :
      this.setState({ oldPasswordError: "", oldPasswordValid: true })

    this.state.details.password === "" ?
      this.setState({ passwordError: "ENTER password", passwordValid: false }) :
      this.setState({ passwordError: "", passwordValid: true })
    this.state.details.cfpassword === "" ?
      this.setState({ cfpasswordError: "ENTER cfpassword", cfpasswordValid: false }) :
      this.setState({ cfpasswordError: "", cfpasswordValid: true })
    this.state.details.password !== this.state.details.cfpassword ? (
      this.setState({ passwordMatchError: "Passwords do not match", passwordMatch: false })) :
      this.setState({ passwordMatchError: "", passwordMatch: true })
    setTimeout(this.handleSave, 10);
  }
  handleSave() {
    var _this = this;
    var url = backendURL + 'users/' + cookie.load('id') + '/password';
    var encData = CryptoJS.AES.encrypt(JSON.stringify(this.state.details), encdec);
    _this.state.oldPasswordValid && _this.state.passwordValid && _this.state.cfpasswordValid ?
      (
        _this.setState({ formError: "" }),
        _this.state.details.password === _this.state.details.cfpassword ?
          (
            axios.put(url, { data: encData.toString() }, { auth: { username: cookie.load('email'), password: this.state.details.oldPassword } })
	    .then(function (res) {
              if (res.status === 200) {
                _this.setState({
                  alert: (
                    <SweetAlert
                      success
                      style={{ display: "block", marginTop: "-100px" }}
                      title="Password changed successfully!"
                      onConfirm={() => { _this.setState({ alert: null }) }}
                      // onCancel={() => _this.setState({ alert: null })}
                      confirmBtnBsStyle="info"
                    />
                  ),
                  buttonChange: false
                })
                cookie.remove('user');
                cookie.remove('role');
                cookie.remove('code')
                cookie.remove('email');
                cookie.remove('photo');
                cookie.remove('userAvatar');
                cookie.remove('token');
                setTimeout(() => _this.props.history.push('/'), 3000)
              }
            }).catch(function (error) {
              _this.setState({
                alert: (
                  <SweetAlert
                    error
                    style={{ display: "block", marginTop: "-100px" }}
                    title="Current password is incorrect."
                    onConfirm={() => _this.setState({ alert: null })}
                    onCancel={() => _this.setState({ alert: null })}
                    confirmBtnBsStyle="info"
                  />
                )
              })
            })
          ) : _this.setState({ formError: "New password and confirm password are mismatch." })
      ) : _this.setState({ formError: "Please enter required fields" })
  }


  resetData() {
    let details = this.state.details;
    details.oldPassword = "";
    details.password = "";
    details.cfpassword = "";
    this.setState({ details });
  }

  successAlert(message) {
    this.setState({
      showaccessoriesModal: false,
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
  render() {
    const changePasswordPanel = (
      <Col xs={12}>
        <Col xs={12} sm={12} md={8} lg={8}>
          <FormGroup>
            <ControlLabel>CURRENT PASSWORD</ControlLabel>
            <FormControl
              placeholder="Enter current password"
              type="password"
              name="oldPassword"
              value={this.state.details.oldPassword}
              onChange={this.handleInputChange}
              className={this.state.oldPasswordValid || this.state.oldPasswordValid === null ? "" : "error"}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={12} md={8} lg={8}>
          <FormGroup>
            <ControlLabel>NEW PASSWORD</ControlLabel>
            <FormControl
              placeholder="Enter new password"
              type="password"
              name="password"
              minLength="6"
              maxLength="12"
              value={this.state.details.password}
              onChange={this.handleInputChange}
              className={this.state.passwordValid || this.state.passwordValid === null ? "" : "error"}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={12} md={8} lg={8}>
          <FormGroup>
            <ControlLabel>CONFIRM PASSWORD</ControlLabel>
            <FormControl
              placeholder="Confirm new password"
              type="password"
              name="cfpassword"
              minLength="6"
              maxLength="12"
              value={this.state.details.cfpassword}
              onChange={this.handleInputChange}
              className={this.state.cfpasswordValid || this.state.cfpasswordValid === null ? "" : "error"}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={12} md={8} lg={8} className="text-center">
          <div className="text-danger text-center" style={{ marginLeft: "15px" }}>{this.state.formError}</div>
        </Col>
        <Col xs={12} sm={12} md={8} lg={8} className="text-center">
          <Button bsStyle="info" wd fill simple style={{ marginRight: "10px", marginBottom: "5px" }} onClick={this.resetData}>Clear</Button>
          <Button bsStyle="success" wd fill simple style={{ marginBottom: "5px" }} onClick={this.passwordValidationCheck}>Update</Button>
        </Col>
      </Col>

    )
    return (
      <Row className="card-content">
        {this.state.alert}
        <Col xs={12} sm={12} md={8} lg={8} mdOffset={3} lgOffset={3}>

          <div>{changePasswordPanel}</div>
        </Col>
      </Row>
    )

  }
}
export default ChangePassword;