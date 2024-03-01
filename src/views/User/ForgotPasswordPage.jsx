import React, { Component } from "react";
import { FormGroup, FormControl, Col } from "react-bootstrap";
import SweetAlert from 'react-bootstrap-sweetalert';
import Button from "components/CustomButton/CustomButton.jsx";
import avatar from "assets/img/default-avatar.png";

import { getResetToken, updatePassword } from "../../modules/settings/usermgmt/server/UserServerComm.jsx";

class ResetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      photo: avatar,
      name: "",
      password: "",
      cnfPassword: ""
    }
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.validate = this.validate.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.save = this.save.bind(this);
  }
  componentWillMount() {
    let _this = this;
    getResetToken(this.props.match.params.token,
      (data) => {
        _this.setState({ id: data.id, photo: data.picture, name: data.name })
      },
      () => {
        _this.errorAlert("Invalid token, please request a new link by clicking on forgot password in login window.");

        this.props.history.push("/login");
      }
    )
  }
  handlePasswordChange(e) {
    this.setState({ [e.target.name]: e.target.value })
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

  validate() {
    setTimeout(this.save, 10);
  }
  save() {
    updatePassword({
      id: this.state.id,
      password: this.state.password
    },
      () => {
        this.successAlert("Password reset is successfull!");
        this.props.history.push("/login")
      },
      () => {

      }
    )

  }
  render() {
    return (

      <form className="ng-untouched ng-pristine ng-valid">
        <div className="user-profile">
          <Col md={4} sm={6} mdOffset={4} smOffset={3} className="text-center">
            <div className="author">
              <img alt="..." className="avatar" src={avatar} />
            </div>
          </Col>
          <h4>{this.state.name}</h4>
          <Col md={4} sm={6} mdOffset={4} smOffset={3}>
            <FormGroup>
              <FormControl name="password" type="password" placeholder="Enter Password" onChange={this.handlePasswordChange} />
            </FormGroup>
          </Col>
          <Col md={4} sm={6} mdOffset={4} smOffset={3}>
            <FormGroup>
              <FormControl name="cnfPassword" type="password" placeholder="Re-enter Password" onChange={this.handlePasswordChange} />
            </FormGroup>
          </Col>
          <Col md={4} sm={6} mdOffset={4} smOffset={3} className="text-center">
            <Button wd fill neutral round onClick={this.validate}>
              Reset
          </Button>
          </Col>
        </div>
      </form>
    );
  }
}

export default ResetPasswordPage;
