import React, { Component } from 'react';
import { Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import Button from 'components/CustomButton/CustomButton.jsx';
import { errors } from 'js/errors.js';
import CustomSweetAlert from 'components/CustomAlert/CustomAlert.component.jsx';
import { backendURL } from 'variables/appVariables.jsx';
import axios from 'axios';
import cookie from 'react-cookies';
// import SweetAlert from "react-bootstrap-sweetalert"



class ForgotPasswordModal extends Component {
  constructor() {
    super()
    this.state = {
      alert: null,
      emailValid: null,
      email: null,
      emailError: false,
      forgotPassword: {
        email: null
      },
    }
    this.handleChange = this.handleChange.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(e) {
    var newForgotPassword = this.state.forgotPassword;
    newForgotPassword[e.target.name] = e.target.value;
    this.setState({ forgotPassword: newForgotPassword, [e.target.name + 'Valid']: true, formError: "" });
  }


  validationCheck() {
    if (this.state.forgotPassword.email || this.state.forgotPassword.email === null) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      // console.log(re.test(this.state.forgotPassword.email));
      (re.test(this.state.forgotPassword.email) === false) ?
        this.setState({ emailError: "Email is required", emailValid: false }) :
        this.setState({ emailError: "", emailValid: true })
      setTimeout(this.submit, 10);
    }
  }

  submit() {
    // console.log(this.state.forgotPassword);
    var url = backendURL + 'users/password',
      _this = this;

    _this.setState({ formError: "" });

    if (_this.state.emailValid) {
      axios.post(url, _this.state.forgotPassword, { 'headers': { 'Authorization': 'Bearer ' + cookie.load('token') } }).then(function (res) {
        // console.log(res);
        if (res.status === 200) {
          _this.setState({
            alert: (
              <CustomSweetAlert
                modal
                success
                message={"An email has been sent to reset your password"}
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
      })
    }
    else {
      _this.setState({ formError: "Please fill the required fields" })
    }
  }

  render() {
    return (
      <div>
        {this.state.alert}
        <Modal.Header closeButton style={{ borderBottom: "0px" }}>
          <Modal.Title bsClass="text-center">ACCOUNT RECOVERY</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <FormGroup>
              <ControlLabel>Enter email address</ControlLabel>
              <FormControl
                placeholder="Enter email address"
                name="email"
                value={this.state.forgotPassword.email}
                onChange={this.handleChange}
                className={this.state.emailValid || this.state.emailValid === null ? "" : "error"}
              />
            </FormGroup>
            <h4 className="text-danger">{this.state.formError}</h4>
          </div>
        </Modal.Body>
        <Modal.Footer closeButton style={{ borderTop: "0px" }}>

          <Button bsStyle="info" round wd fill style={{ backgroundColor: "#ef7f20", border: "none" }} onClick={this.validationCheck}>Send</Button>
        </Modal.Footer>
      </div>
    )
  }
}
export default ForgotPasswordModal;