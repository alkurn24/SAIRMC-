import React, { Component } from "react";
import "react-select/dist/react-select.css";
import SweetAlert from "react-bootstrap-sweetalert";
import { Row, Col, Tooltip, OverlayTrigger, FormGroup, ControlLabel, FormControl, } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
// import UploadComponent from 'components/Upload/UploadComponent.jsx';

import { updateUserForm } from "modules/settings/server/SettingsUserFormServerComm.jsx";
import { createTestMaterial, getTestMaterialSingle, updateTestMaterial, } from "modules/testmgmt/testmaterial/server/TestMaterialServerComm.jsx";
import { getTestCaseList } from "modules/testmgmt/testcase/server/TestCaseServerComm.jsx";

class TestMaterialFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testCaseList: [],
      settings: props.settings,
      material: {
        name: "",
        displayName: "",
        description: "",
        code: null,
        photo: "",
        imagePreviewUrl: "",
        tests: []
      },
      materialForm: {
        mandatory: [],
        custom: []
      },
      nameError: false,
      displayNameError: false,
      DiscriptionError: false,
      nameValid: null,
      displayNameValid: null,
      DiscriptionValid: null,
    }
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.create = this.create.bind(this);
    this.save = this.save.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDiciplineChange = this.handleDiciplineChange.bind(this);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCheckedTestCaseChange = this.handleCheckedTestCaseChange.bind(this);
    this.checkedvalidity = this.checkedvalidity.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
  }
  componentWillMount() {
    getTestCaseList("",
      function success(data) {
        _this.setState({
          testCaseList: data.rows.map((prop, key) => {
            return {
              id: prop.id,
              srNo: key + 1,
              code: prop.code ? prop.code : "",
              name: (<a role="button" href={"#/test/cases-edit/" + prop.code} style={{ color: "blue", borderBottom: "1px solid blue" }}>{prop.name}</a>),
              standardPrice: prop.standardPrice ? prop.standardPrice : "",
              offerPrice: prop.offerPrice ? prop.offerPrice : "",
              accredation: prop.accredation ? prop.accredation : ""
            };
          })
        })
      },
      function error(error) { _this.setState({ testCaseList: [] }); }
    );

    let _this = this;
    if (_this.props.match.params.testmaterialcode !== 'new') {
      getTestMaterialSingle(_this.props.match.params.testmaterialcode,
        (res) => {
          _this.setState({ material: res })
        },
        () => { }
      )
    }
  }
  handleSettingsChange(e) {
    var newObj = this.state.materialForm;
    newObj.custom[parseInt(e.target.name.split("_")[0], 10)].value = e.target.checked;
    this.setState({ materialForm: newObj });
    updateUserForm(this.state.materialForm,
      function success() { },
      function error() { }
    )
  }
  create() {
    let _this = this;
    createTestMaterial(this.state.material,
      function success() {
        _this.successAlert("Test material added successfully!");
        setTimeout(() => {
          _this.props.history.push("/test/material");
        }, 2000);
      },
      function error() {
        _this.successAlert("Error in creating test material.");
      }
    )
  }
  validationCheck() {
    this.state.material.name === "" ?
      this.setState({ nameError: "Enter name", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })
    this.state.material.displayName === "" ?
      this.setState({ displayNameError: "Enter display name", displayNameValid: false }) :
      this.setState({ displayNameError: "", displayNameValid: true })

    setTimeout(this.save, 10);
  }
  save() {
    let _this = this;
    if (this.state.nameValid && this.state.displayNameValid) {
      if (this.props.match.params.testmaterialcode !== 'new') {
        updateTestMaterial(this.state.material,
          function success() {
            _this.successAlert("Material updated successfully!");
          },
          function error() {
            _this.successAlert("Error in saving material.");
          }
        )

      } else {
        this.create();
      }
    }
    else {
      _this.setState({ formError: "Please enter required fields" })
    }
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
  handleInputChange(e) {
    var newmaterial = this.state.material;
    newmaterial[e.target.name] = e.target.value;
    this.setState({ material: newmaterial });
  }
  handleDropDownChange(selectOption, type) {
    var newmaterial = this.state.material;
    newmaterial[type] = selectOption ? selectOption.value : null;
    this.setState({ material: newmaterial });
  }
  handleImageChange(img) {
    var newmaterial = this.state.material;
    newmaterial.imagePreviewUrl = img;
    this.setState({ material: newmaterial });
  }
  handleDiciplineChange(e) {
    var newmaterial = this.state.material;
    newmaterial.diciplines[e.target.name] = e.target.checked;
    this.setState({ newmaterial });
  }
  handleCheckedChange(e) {
    var newmaterial = this.state.material;
    newmaterial[e.target.name] = e.target.checked;
    this.setState({ material: newmaterial, [e.target.name + 'Valid']: true, formError: "" });
  }
  handleCheckedTestCaseChange(e) {
    var material = this.state.material;
    if (e.target.checked) {
      material.tests.push(e.target.name)
    } else {
      material.tests.splice(this.state.material.tests.indexOf(e.target.name), 1)
    }
    this.setState({ material })
  }
  handleDateChange(name, date) {
    var newtestcaseDetails = this.state.material;
    newtestcaseDetails[name] = date._d;
    this.setState({ material: newtestcaseDetails });
  }
  checkedvalidity(e) {
    var flag = false;
    for (let i = 0; i < this.state.material.testcase && this.state.material.testCases.length; i++) {
      if (e === this.state.material.testCases[i]._id) {
        flag = true;
      }
    }
    return flag;
  }
  render() {
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    // const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const list = (<Tooltip id="list_tooltip">Test material list</Tooltip>);

    let form = (
      <Row>
        <Col xs={12}>
          <Col xs={12} sm={12} md={12} lg={12}>
            {this.props.match.params.testmaterialcode !== 'new' ?
              <Col xs={12} >
                <FormGroup>
                  <ControlLabel>Code:{this.state.material.number ? this.state.material.number : this.state.material.code} </ControlLabel>
                </FormGroup>
              </Col>
              : null
            }
            {/* {
              this.props.match.params.testmaterialcode !== 'new' ?
                (
                  <Col xs={12} sm={3} md={2} lg={2}>
                    <UploadComponent
                      picture
                      type="testmaterials"
                      photo={this.state.material.photo}
                      details={this.state.material}
                      handleImageChange={this.handleImageChange}
                    />
                  </Col>
                ) : null
            } */}
            <Col xs={12} sm={6} md={5} lg={5}>
              <FormGroup>
                <ControlLabel>Test Material Name <span className="star">*</span> </ControlLabel>
                <FormControl
                  placeholder="Material name"
                  type="text"
                  name="name"
                  value={this.state.material.name}
                  onChange={this.handleInputChange}
                  className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={5} lg={5}>
              <FormGroup>
                <ControlLabel>display Name (Goes to Test Report) <span className="star">*</span></ControlLabel>
                <FormControl
                  placeholder="Display name"
                  type="text"
                  name="displayName"
                  value={this.state.material.displayName}
                  onChange={this.handleInputChange}
                  className={this.state.displayNameValid || this.state.displayNameValid === null ? "" : "error"}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={12} md={10} lg={10}>
              <FormGroup>
                <ControlLabel>Descirption</ControlLabel>
                <FormControl componentClass="textarea" name="description" value={this.state.material.description} placeholder="Discription" onChange={this.handleInputChange} />
              </FormGroup>
            </Col>
          </Col>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <h6 className="section-header" style={{ marginBottom: "10px" }}>Select  Tests</h6>
            {
              this.state.testCaseList.sort().map((test, key) => {
                return (
                  <div className="col-xs-12 col-md-6 col-lg-4">
                    <input
                      key={key}
                      type="checkbox"
                      name={test.id}
                      onChange={this.handleCheckedTestCaseChange}
                      checked={this.state.material.tests.indexOf(test.id) === -1 ? false : true}
                    /> {test.name}
                  </div>
                )
              })
            }
          </Col>
        </Col>
      </Row>
    );
    let actions = (
      <div>
        <center><b><h5 className="text-danger">{this.state.formError}</h5></b></center>
        <Col xs={12} sm={12} md={12} lg={12}>
          <OverlayTrigger placement="top" >
            <Button bsStyle="warning" fill icon onClick={this.props.history.goBack} ><span className="fa fa-arrow-left"></span></Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={list}>
            <Button bsStyle="primary" fill icon onClick={() => this.props.history.push('/test/material')} ><span className="fa fa-list"></span></Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={save}>
            <Button bsStyle="success" fill icon pullRight onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
          </OverlayTrigger>
        </Col>
      </div>
    )
    return (
      <Row className="card-content">
        {this.state.alert}
        <div className="card-form">{form}</div>
        <div className="card-footer">{actions}</div>
      </Row>
    );
  }
}

export default TestMaterialFormComponent;