import React, { Component } from 'react';
import { Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import Button from 'components/CustomButton/CustomButton.jsx';
import { generateResetToken } from "modules/settings/usermgmt/server/UserServerComm.jsx";




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
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
  }

  handleChange(e) {
    var newForgotPassword = this.state.forgotPassword;
    newForgotPassword[e.target.name] = e.target.value;
    this.setState({ forgotPassword: newForgotPassword, [e.target.name + 'Valid']: true, formError: "" });
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
    let _this = this;
    if (_this.state.emailValid) {
      generateResetToken(
        this.state.forgotPassword.email,
        alert("An email has been sent to reset your password!"),
        true,
        () => {
          // alert("An email has been sent to reset your password!");
        },
        () => {

        })
    }
    else {
      _this.setState({ formError: "Please enter required fields" })
    }

  }

  render() {
    return (
      <div>
        {this.state.alert}
        <Modal.Header closeButton >
          <Modal.Title>ACCOUNT RECOVERY</Modal.Title>
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
              <small className="text-danger">{this.state.emailError}</small>
            </FormGroup>

          </div>
        </Modal.Body>
        <Modal.Footer closeButton>

          <Button bsStyle="info" round wd fill style={{ backgroundColor: "#ef7f20", border: "none" }} onClick={this.validationCheck}>Send</Button>
        </Modal.Footer>
      </div>
    )
  }
}
export default ForgotPasswordModal;