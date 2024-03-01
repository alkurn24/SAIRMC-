import React, { Component } from "react";
import { FormGroup, ControlLabel, FormControl, Row, Col } from "react-bootstrap";
import axios from 'axios';
import cookie from 'react-cookies';
import UploadComponent from 'components/Upload/UploadComponent.jsx';
import { backendURL } from 'variables/appVariables.jsx';

class EditProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        id: cookie.load("id"),
        name: "",
        email: "",
        password: "",
        photo: "",
        role: "",
        signature: ""
      },
      obj: {},
      nameError: false,
      middleNameError: false,
      emailError: false,
      phoneError: false,
      roleError: false,
      addressError: false,
      cityError: false,
      stateError: false,
      zipcodeError: false,
      nameValid: null,
      middleNameValid: null,
      emailValid: null,
      phoneValid: null,
      roleValid: null,
      addressValid: null,
      cityValid: null,
      stateValid: null,
      zipcodeValid: null,
      formError: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  handleInputChange(e) {
    var newUser = this.state.user;
    newUser[e.target.name] = e.target.value;
    this.setState({ user: newUser });
  }


  handleSignatureChange(img) {
    var user = this.state.user;
    user.signature = img;
    this.setState({ user });
  }
  handleImageChange(img) {
    var user = this.state.user;
    user.photo = img;
    this.setState({ user });
  }
  validationCheck() {
    this.state.user.name === "" ?
      this.setState({ nameError: "Enter the name", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })

    setTimeout(this.updateProfile, 10)
  }

  updateProfile() {
    var _this = this;
    var url = backendURL + "users/";

    axios.put(url + cookie.load("id"), _this.state.user, { headers: { Authorization: "Bearer " + cookie.load("token") } })
      .then(function (res) {
        console.log(res.data);
        if (res.status === 200) {
          _this.successAlert("Profile saved successfully!");
          setTimeout(() => {
            _this.props.handleCloseModal(res.data);
          }, 2000);

        }
      })
  }

  render() {

    const editProfile = (
      <Col xs={12}>
        <Col md={8}>
          <Col md={12}>
            <FormGroup>
              <ControlLabel>User Name</ControlLabel>
              <FormControl
                disabled
                name="name"
                type="text"
                value={cookie.load('user') ? cookie.load('user') : "USERNAME"}
                onChange={this.handleInputChange}
                className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>
          <Col md={8}>
            <FormGroup>
              <ControlLabel>Email</ControlLabel>
              <FormControl
                disabled
                name="email"
                type="text"
                value={cookie.load('email') ? cookie.load('email') : "email"}
                onChange={this.handleInputChange}
                className={this.state.emailValid || this.state.emailValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <ControlLabel>Role</ControlLabel>
              <FormControl
                disabled
                name="role"
                type="text"
                value={cookie.load('role') ? cookie.load('role') : "role"}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
        </Col>
        <Col md={4}>
          <Col md={12}>
            <ControlLabel>Profile Picture</ControlLabel>
            <UploadComponent
              picture
              type="user"
              photo={this.state.user.photo}
              details={this.state.user}
              handleImageChange={this.handleImageChange}
            />
          </Col>
        </Col>
      </Col>

    );
    return (
      <Row className="card-content">
        {this.state.alert}
        <div>{editProfile}</div>
      </Row>
    )
  }

}

export default EditProfilePage;
