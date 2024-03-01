import React, { Component } from "react";
import { When } from 'react-if'

import SweetAlert from "react-bootstrap-sweetalert";
import { Row, Col, FormGroup, ControlLabel, FormControl, Nav, NavItem, Tab, Tooltip, OverlayTrigger } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import UploadComponent from "components/Upload/UploadComponent";
import Select from "components/CustomSelect/CustomSelect.jsx";
import History from "components/History/History.jsx";

import { errorColor } from 'variables/Variables.jsx';
import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import { getHsnList } from "modules/settings/hsn/server/HsnServerComm.jsx";
import { getUserFormSingle, updateUserForm } from "modules/settings/server/SettingsUserFormServerComm.jsx";
import { createProduct, getProductSingle, updateProduct, deleteProduct } from "../server/ProductServerComm.jsx";
import { unitList } from "variables/appVariables.jsx"

class ProductFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: props.settings,
      edit: !props.settings,
      product: {
        id: null,
        code: "New",
        name: "",
        hsn: null,
        unit: "",
        rate: "",
        standardQty: 0,
        actualQty: 0,
        custom: [],
        imagePreviewUrl: "",
        photo: "",
        documents: [],
        plantsInfo: {
          plant: null,
          standardQty: 0,
          actualQty: 0,
        },
      },
      productForm: {
        mandatory: [],
        custom: []
      },
      hsnList: [],
      codeValid: null,
      nameValid: null,
      hsnValid: null,
      unitValid: null,
      rateValid: null,
      alert: null,
      nameError: false,
      hsnError: false,
      unitError: false,
      rateError: false
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleMultipleDocumentChange = this.handleMultipleDocumentChange.bind(this);
    this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.addCustomField = this.addCustomField.bind(this);
    this.inputConfirmAlert = this.inputConfirmAlert.bind(this);
    this.emptyState = this.state;
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
  }
  componentDidMount() {
    var _this = this;
    this.fetchData()
    getUserFormSingle("productForm",
      function success(data) {
        _this.setState({ productForm: data });
        this.fetchData();
      },
      function error(data) {
        _this.errorAlert("Error please try again later");
      }
    )

    if (_this.props.match.params.productcode !== 'new') {
      getProductSingle(_this.props.match.params.productcode,
        (res) => {
          _this.setState({ product: res })
        },
        () => { }
      )
    }
  }

  delete() {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => {
            this.deleteConfirm();
            setTimeout(() => {
              this.props.history.push('/inventory/product')
            }, 3000);
          }}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="info"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this product!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteProduct(this.state.product.code,
      function success() {
        _this.successAlert("Product deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting product.");
      }
    )
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
  fetchData() {
    var _this = this;
    getHsnList("",
      function success(data) {
        _this.setState({
          hsnList: data.rows.map((prop) => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.hsn,
              gst: prop.gst,
            }
          })
        });

      })
    getPlantList("",
      function success(data) {
        _this.setState({
          plantList: data.rows.map((s) => {
            return {
              _id: s.id,
              value: s.id,
              label: s.plantName,
            }
          })
        });
      })

  }

  addCustomField() {
    this.setState({
      alert: (
        <SweetAlert
          input
          showCancel
          style={{ display: "block", marginTop: "-100px" }}
          title="Enter Title"
          onConfirm={e => this.inputConfirmAlert(e)}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="info"
        />
      )
    });
  }
  inputConfirmAlert(e) {
    this.setState({ alert: null });
    var newObj = this.state.productForm;
    newObj.custom.push({ name: e.toLowercase(), label: e, value: true });
    this.setState({ productForm: newObj });
  }
  validationCheck() {
    this.state.product.name === "" ?
      this.setState({ nameError: "ENTER NAME", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })
    this.state.product.unit === "" ?
      this.setState({ unitError: "ENTER Unit", unitValid: false }) :
      this.setState({ unitError: "", unitValid: true })
    this.state.product.rate === "" ?
      this.setState({ rateError: "ENTER rate", rateValid: false }) :
      this.setState({ rateError: "", rateValid: true })
    this.state.product.hsn === null ?
      this.setState({ hsnError: "ENTER hsn Code", hsnValid: false }) :
      this.setState({ hsnError: "", hsnValid: true })
    setTimeout(this.save, 10);
  }

  save() {
    var _this = this;
    let tempModule = JSON.parse(JSON.stringify(this.state.product));
    _this.state.nameValid && _this.state.hsnValid && _this.state.unitValid && _this.state.rateValid && _this.state.hsnValid ? (
      tempModule.plantsInfo.plant = this.state.product.plantsInfo.plant,
      tempModule.plantsInfo.standardQty = this.state.product.standardQty,
      tempModule.plantsInfo.actualQty = this.state.product.actualQty,
      tempModule.hsn = this.state.product.hsn.id,
      (this.state.product.code === "New") ? (
        delete tempModule.code,
        createProduct(tempModule,
          function success() {
            _this.successAlert(" Product added successfully!");
            setTimeout(() => {
              _this.props.history.push('/inventory/product')
            }, 2000);
          },
          function error(res) {
            if (res.message === 'Request failed with status code 701') { _this.errorAlert("Duplicate product name"); }
            else {
              _this.errorAlert("Something went wrong!")
            }
          }
        )

      ) :
        (updateProduct(tempModule,
          function success() {
            _this.successAlert("Product saved successfully!");
            setTimeout(() => {
              _this.props.history.push('/inventory/product')
            }, 2000);
          },
          function error() {
            _this.errorAlert("Error in saving product");
          }
        )
        )

    ) : _this.setState({ formError: "Please enter required fields" })
  }
  handleDropDownChange(e, param) {
    var newObj = this.state.product;
    if (e === undefined) {
      newObj.hsn = e !== undefined ? e.target.value : null;
      this.setState({ product: newObj });
    }
    else {
      if (!e.target) {
        newObj[param] = e;
        this.setState({ pricing: newObj, formError: null });
        e.id === "" || null ? this.setState({ productValid: false }) : this.setState({ productValid: true })
        if (param === "hsn") {

        }
        else if (param === "unit") {
          newObj[e.target.name] = e.target.value;
          this.setState({ product: newObj });
        }
      } else {
        if (e.target.name.indexOf("custom_") !== -1) {
          var key = parseInt(e.target.name.split("_")[1], 10);
          newObj.custom[key] = e.target.value;
          this.setState({ product: newObj });
        } else if (e.target.name.indexOf("radio_") !== -1) {
          newObj[e.target.name.split("_")[1]] = e.target.value;
          this.setState({ product: newObj });
        } else {
          newObj[e.target.name] = e.target.value;
          this.setState({ product: newObj });
        }
      }
    }
  }
  handleDropDownChangeUnit(type, selectOption) {
    var newVendor = this.state.product;
    newVendor[type] = selectOption ? selectOption.value : null;
    this.setState({ product: newVendor });
  }
  handleImageChange(img) {
    var product = this.state.product;
    product.photo = img;
    this.setState({ product });
  }
  handleMultipleDocumentChange(newDocument) {
    var product = this.state.product;
    product.documents = newDocument.documents;
    this.setState({ product });
  }
  handleDeleteDocument(key) {
    let product = this.state.product;
    product.documents.slice();
    product.documents.splice(key, 1);
    this.setState({ product });
  }
  handleInputChange(e, ) {
    var newObj = this.state.product;
    if (e.target.name.indexOf("custom_") !== -1) {
      var key = parseInt(e.target.name.split("_")[1], 10);
      newObj.custom[key] = e.target.value;
      this.setState({ product: newObj });
    } else if (e.target.name.indexOf("radio_") !== -1) {
      newObj[e.target.name.split("_")[1]] = e.target.value;
      this.setState({ product: newObj });
    } else {
      newObj[e.target.name] = e.target.value;
      this.setState({ product: newObj });
    }

  }
  handleSettingsChange(e) {
    var newObj = this.state.productForm;
    newObj.custom[parseInt(e.target.name.split("_")[0], 10)].value = e.target.checked;
    this.setState({ productForm: newObj });
    updateUserForm(this.state.productForm,
      function success() { },
      function error() { }
    )
  }
  render() {

    var deleteCondition = true;
    if (this.state.product.code === "New") {
      deleteCondition = true;
    } else {
      deleteCondition = false;
    }
    let _this = this;

    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const trash = (<Tooltip id="trash_tooltip">Trash</Tooltip>);
    const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const list = (<Tooltip id="list_tooltip">Product list</Tooltip>);

    let customFields = (
      <div>
        {
          _this.state.productForm.custom.map(function (item, key) {
            return (
              <Col md={4} key={key} hidden={!item.value}>
                <FormGroup>
                  <ControlLabel>{item.label}</ControlLabel>
                  <FormControl disabled={!_this.state.edit} name={"custom_" + key} type="text" placeholder={item.label} value={_this.state.product.custom[key]} onChange={_this.handleInputChange} />
                </FormGroup>
              </Col>
            )
          })
        }
        <Col xs={12} sm={12} md={12} lg={12}>
          <FormGroup>
            <ControlLabel>Notes:</ControlLabel>
            <textarea
              className="form-control"
              disabled={!_this.state.edit}
              name="notes"
              type="text"
              placeholder="Notes"
              value={_this.state.product.notes ? _this.state.product.notes : ""} onChange={_this.handleInputChange}>
            </textarea>
          </FormGroup>
        </Col>
      </div>
    );

    let productInfo = (
      <Col xs={12}>
        <Tab.Container id="tabs-with-dropdown" defaultActiveKey="documents">
          <Row className="clearfix">
            <Col xs={12}>
              <Nav bsStyle="tabs">
                <NavItem eventKey="documents">
                  <i className="fa fa-file" /> Documents
              </NavItem>
              </Nav>
            </Col>
            <Col xs={12}>
              <Tab.Content animation>
                <Tab.Pane eventKey="custom">
                  {customFields}
                </Tab.Pane>
                <Tab.Pane eventKey="documents">
                  <Row>
                    <UploadComponent
                      document
                      type="products"
                      documents={this.state.product.documents}
                      details={this.state.product}
                      dropText="Drop files or click here"
                      handleMultipleDocumentChange={this.handleMultipleDocumentChange}
                      handleDeleteDocument={this.handleDeleteDocument}
                    />
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey="history">
                  <Col xs={12} sm={12} md={12} lg={12}><History history={this.state.product.history ? this.state.product.history : []} /></Col>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Col>
    );
    let form = (
      <Row>
        {/* {this.props.match.params.productcode !== "new" ?
          (
            <Col xs={12} md={this.state.product.code ? 2 : 0}>
              <UploadComponent
                picture
                type="products"
                photo={this.state.product.photo}
                details={this.state.product}
                handleImageChange={this.handleImageChange}
              />
            </Col>
          ) : null

        } */}
        <Col xs={12}>
          <Col xs={12}>
            <FormGroup>
              {this.props.match.params.productcode !== "new" ?
                <ControlLabel>Product Code: {this.state.product.number}</ControlLabel>
                : null
              }
            </FormGroup>
          </Col>
          <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Product Name <span className="star">*</span> </ControlLabel>
              <FormControl
                disabled={!this.state.edit}
                name="name"
                type="text"
                placeholder="Enter name"
                value={this.state.product.name ? this.state.product.name : ""}
                onChange={this.handleInputChange}
                className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>HSN Code <span className="star">*</span> </ControlLabel>
              <div>
                <span className="input-group">
                  <Select
                    clearable={false}
                    placeholder="Select HSN code"
                    name="hsn"
                    options={this.state.hsnList}
                    value={this.state.product.hsn ? this.state.product.hsn.id : null}
                    onChange={(selectedOption) => this.handleDropDownChange(selectedOption, "hsn")}
                    style={{ color: this.state.hsnValid || this.state.hsnValid === null ? "" : errorColor, borderColor: this.state.hsnValid || this.state.hsnValid === null ? "" : errorColor }}
                  />
                  <span className="input-group-addon"> {this.state.product.hsn ? this.state.product.hsn.gst : 0.0} %</span>
                </span>
              </div>
            </FormGroup>
          </Col>
          <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Unit of Sell <span className="star">*</span> </ControlLabel>
              <Select
                clearable={false}
                placeholder="Select unit"
                name="unit"
                value={this.state.product.unit}
                options={unitList}
                onChange={(selectOption) => {
                  var newProduct = this.state.product;
                  newProduct.unit = selectOption ? selectOption.value : null;
                  this.setState({ product: newProduct });
                }}
                style={{ color: this.state.unitValid || this.state.unitValid === null ? "" : errorColor, borderColor: this.state.unitValid || this.state.unitValid === null ? "" : errorColor }}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Rate <span className="star">*</span> </ControlLabel>
              <div>
                <span className="input-group">
                  <span className="input-group-addon">₹</span>
                  <FormControl
                    disabled={!this.state.edit}
                    name="rate"
                    type="number"
                    placeholder="0"
                    step="0.05" pattern="^\d+(?:\.\d{1,2})?$"
                    value={this.state.product.rate ? this.state.product.rate : ""}
                    onChange={this.handleInputChange}
                    className={this.state.rateValid || this.state.rateValid === null ? "" : "error"}

                  />
                  <span className="input-group-addon">/ {this.state.product.unit ? this.state.product.unit : ""}</span>
                </span>
              </div>
            </FormGroup>
          </Col>
        </Col>
        <Col xs={12}>
          {this.props.match.params.productcode !== "new" ? productInfo : null}
        </Col>
      </Row>
    );
    let actions = (
      <Col xs={12}>
        <center><h5 className="text-danger">{this.state.formError}</h5></center>
        <OverlayTrigger placement="top" overlay={back}>
          <Button bsStyle="warning" fill icon onClick={() => this.props.history.push('/inventory/product')}><span className="fa fa-arrow-left"></span></Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={list}>
          <Button bsStyle="primary" fill icon onClick={() => this.props.history.push('/inventory/product')}><span className="fa fa-list"></span></Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={save}>
          <Button bsStyle="success" fill icon pullRight onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
        </OverlayTrigger>
        <When condition={deleteCondition === false}>
          <OverlayTrigger placement="top" overlay={trash}>
            <Button bsStyle="danger" fill icon pullRight onClick={() => _this.delete(this.state.product.code)}><span className="fa fa-trash"></span></Button>
          </OverlayTrigger>
        </When>

      </Col>
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

export default ProductFormComponent;