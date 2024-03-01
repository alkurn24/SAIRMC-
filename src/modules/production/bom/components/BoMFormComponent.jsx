import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from "react-cookies";
import SweetAlert from "react-bootstrap-sweetalert";
import { FormControl, Row, Col, FormGroup, ControlLabel, Tooltip, OverlayTrigger } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import Select from "components/CustomSelect/CustomSelect.jsx";

import { errorColor } from 'variables/Variables.jsx';


import { getCustomerList } from "modules/crm/customers/server/CustomerServerComm.jsx";
import { getProductList } from "modules/inventory/products/server/ProductServerComm.jsx";
import { getInventoryList } from "modules/inventory/stores/server/StoresServerComm.jsx";
import { createBom, getBomSingle, getBomList, updateBom } from "modules/production/bom/server/BoMServerComm.jsx";

class BoMFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: false,
      bom: {
        customer: null,
        product: null,
        bomData: this.props.bomData ? this.props.bomData : [],
      },
      customerList: [],
      productList: [],
      inventory: [],
      bomList: [],
      bomListProduct: [],
      bomForm: {
        mandatory: [],
        custom: []
      },
      customerError: false,
      productError: false,
      customerValid: null,
      productValid: null,


    }
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.addCustomField = this.addCustomField.bind(this);
    this.handleInputChangeCustomer = this.handleInputChangeCustomer.bind(this);
    this.inputConfirmAlert = this.inputConfirmAlert.bind(this);
    this.save = this.save.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.renderText = this.renderText.bind(this);
    this.renderMaterial = this.renderMaterial.bind(this);
    this.renderRate = this.renderRate.bind(this);
  }
  componentWillMount() {
    let _this = this;

    getCustomerList("",
      function success(data) {
        _this.setState({
          customerList: data.rows.map(prop => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name
            }
          })
        });
      },
    )

    getInventoryList("",
      function success(data) {
        _this.setState({
          inventory: data.rows.map(prop => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name,
              rate: prop.rate,
              unit: prop.unit
            }
          })
        });
      },
      function error(data) {
        _this.errorAlert("Error: please try again later");
      }
    )

    if (this.props.match.params.bomcode !== "new") {

      getBomSingle(this.props.match.params.bomcode,
        (data) => {

          _this.setState({ bom: data })
        },
        () => { }
      )
      getProductList("",
        function success(data) {
          _this.setState({
            productList: data.rows.map(prop => {
              return {
                id: prop.id,
                value: prop.id,
                label: prop.name
              }
            })
          });
        },
      )
    }

  }
  fetchCustomerData(id) {
    let _this = this;
    getBomList("view=bom&customer=" + id,
      (boms) => {
        boms = boms.rows.map(x => { return x.product })
        getProductList("",
          function success(data) {
            _this.setState({
              productList: data.rows.filter(x => { return boms.indexOf(x.id) === -1 }).map(prop => {
                return {
                  id: prop.id,
                  value: prop.id,
                  label: prop.name
                }
              })
            });
          },
        );
      },
      () => { }
    );
  }

  handleSettingsChange() {

  }
  handleSelectChange(name, selectedOption) {
    let temp = this.state.bom;
    temp[name] = selectedOption ? selectedOption : null;
    this.setState({ temp })
  }
  handleInputChangeCustomer(e, param) {
    var newObj = this.state.bom;
    if (e === undefined) {
      let temp = this.state.bom;
      temp.customer = e ? e.value : null;
      this.setState({ temp })
    }
    else {
      newObj[param] = e;
      this.setState({ pricing: newObj, formError: null });
      if (param === "customer") {
        this.fetchCustomerData(e.id);
      }
    }
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
          cancelBtnBsStyle="danger"
        />
      )
    });
  }
  inputConfirmAlert(e) {
    this.setState({ alert: null });
    var newObj = this.state.bomForm;
    newObj.custom.push({ name: e.toLowercase(), label: e, value: true });
    this.setState({ bomForm: newObj });
  }
  validationCheck() {
    this.state.bom.customer === null ?
      this.setState({ customerError: "select customer name", customerValid: false }) :
      this.setState({ customerError: "", customerValid: true })
    this.state.bom.product === null ?
      this.setState({ productError: "select product name", productValid: false }) :
      this.setState({ productError: "", productValid: true })
    setTimeout(this.save, 10);
  }
  save() {
    let _this = this;
    if (this.state.customerValid && this.state.productValid) {
      var tempData = JSON.parse(JSON.stringify(this.state.bom));
      tempData.customer = tempData.customer ? tempData.customer.id : null;
      tempData.product = tempData.product ? tempData.product.id : null;
      if (tempData.bomData.length > 0) {
        for (let i = 0; i < tempData.bomData.length; i++) {
          if (tempData.bomData[i].inventory === null) {
            this.setState({ formError: "Please select material name" })
          }
          else {
            this.setState({ formError: "" })
            tempData.bomData[i].inventory = tempData.bomData[i].inventory.id;
            if (i + 1 === tempData.bomData.length) {
              if (this.props.match.params.bomcode === "new") {
                createBom(tempData,
                  function success() {
                    _this.successAlert("Bill of material added successfully!");
                    setTimeout(() => {
                      _this.props.history.push("/production/bom/");
                    }, 2000);
                  },
                  function error() {
                    _this.errorAlert("Error in creating bill of material.");
                  }
                )
              } else {
                let _this = this;
                updateBom(tempData,
                  function success() {
                    _this.successAlert("Bill of material saved successfully!");
                  },
                  function error() {
                    _this.errorAlert("Error in saving bill of material.");
                  }
                )
              }
            }
          }
        }
      }
      else {
        _this.setState({ formError: "Please enter inventory details" })
      }
    }
    else {
      _this.setState({ formError: "Please enter required fields" })
    }
  }
  delete(id) {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.deleteConfirm(id)}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="info"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(id) {
    let tempObj = this.state.bom;
    tempObj.bomData.splice(id, 1);
    this.setState({ tempObj });
    this.successAlert("BOM data deleted successfully!")

  }
  successAlert(message) {
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title={message}
          onConfirm={() => { this.setState({ alert: null }) }}
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
  renderRate(row) {
    return (
      <FormGroup>
        <FormControl
          type="number"
          min={0}
          value={this.state.bom.bomData[row.index].inventory ? this.state.bom.bomData[row.index].inventory.rate : 0}
          onChange={(e) => {
            let tempBom = this.state.bom;
            tempBom.bomData[row.index].inventory.rate = e.target.value;
            this.setState({ tempBom });
          }}
        />
      </FormGroup>
    )
  }
  renderText(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          type="number"
          min={0}
          value={this.state.bom.bomData[cellInfo.index][cellInfo.column.id]}
          onChange={(e) => {
            let tempBom = this.state.bom;
            tempBom.bomData[cellInfo.index][cellInfo.column.id] = e.target.value;
            this.setState({ tempBom });
          }}
        />
      </FormGroup>
    )
  }
  renderMaterial(row) {
    return (
      <FormGroup>
        <Select
          clearable={false}
          options={this.state.inventory}
          value={this.state.bom.bomData[row.index].inventory ? this.state.bom.bomData[row.index].inventory.id : null}
          onChange={(selectedOption) => {
            let tempBom = this.state.bom;
            tempBom.bomData[row.index].inventory = selectedOption;
            this.setState({ tempBom });
          }}
        />
      </FormGroup>
    )
  }
  render() {
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const List = (<Tooltip id="delete_tooltip">BOM list</Tooltip>);
    const add = (<Tooltip id="delete_tooltip">Add new inventory</Tooltip>);
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);


    var adminCondition = (cookie.load("role"));
    var srNoCol = { Header: "Sr", id: "sr", Cell: (row) => { return (<div>{row.index + 1}</div>) }, width: 50, sortable: false };
    var materialCol = { Header: "Material", accessor: "inventory", Cell: this.renderMaterial, sortable: false };
    var priceCol = { Header: "Price", accessor: "rate", sortable: false, Cell: this.renderRate, };
    var stdCol = { Header: "Std. Quantity", accessor: "stdQty", Cell: this.renderText, sortable: false };
    var actCol = { Header: "Act. Quantity", accessor: "actQty", Cell: this.renderText, sortable: false };
    var actionCol = {
      Header: "", accessor: "_id", width: 40, sortable: false,
      Cell: (row => {
        return (
          <div className="actions-right">
            {cookie.load('role') === "admin" ?
              <OverlayTrigger placement="top" overlay={trash}>
                <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.index)} ><span className="fa fa-trash text-danger"></span></Button>
              </OverlayTrigger>
              : null
            }
          </div>
        )
      }),
    }
    let form = (
      <Col xs={12}>
        <Col xs={12} sm={6} md={4} lg={3}>
          {this.props.match.params.bomcode === "new" ?
            <FormGroup>
              <ControlLabel>Customer <span className="star">*</span></ControlLabel>
              <Select
                disabled={this.props.match.params.bomcode === "new" ? false : true}
                clearable={false}
                placeholder="Select customer"
                name="customer"
                value={this.state.bom.customer ? this.state.bom.customer.id : null}
                options={this.state.customerList}
                onChange={(selectedOption) => this.handleInputChangeCustomer(selectedOption, 'customer')}
                style={{ color: this.state.customerValid || this.state.customerValid === null ? "" : errorColor, borderColor: this.state.customerValid || this.state.customerValid === null ? "" : errorColor }}
              />
            </FormGroup>
            :
            <FormGroup>
              <ControlLabel><b>Customer Name:</b><br />{this.state.bom.customer ? this.state.bom.customer.name : null}</ControlLabel>
            </FormGroup>
          }
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          {this.props.match.params.bomcode === "new" ?
            <FormGroup>
              <ControlLabel>Product <span className="star">*</span></ControlLabel>
              <Select
                disabled={this.props.match.params.bomcode === "new" ? false : true}
                clearable={false}
                placeholder="Select product"
                name="product"
                value={this.state.bom.product ? this.state.bom.product.id : null}
                options={this.state.productList}
                onChange={(selectedOption) => this.handleSelectChange("product", selectedOption)}
                style={{ color: this.state.productValid || this.state.productValid === null ? "" : errorColor, borderColor: this.state.productValid || this.state.productValid === null ? "" : errorColor }}
              />
            </FormGroup>
            :
            <FormGroup>
              <ControlLabel><b>Product Name:</b><br />{this.state.bom.product ? this.state.bom.product.name : null}</ControlLabel>
            </FormGroup>
          }
        </Col>

        {
          this.state.bom.bomData.length

            ? (
              <Col xs={12} sm={12} md={12} lg={12}>
                <Row>
                  <h6 className="section-header">Inventory / Assets Details</h6>
                </Row>
                <ReactTable
                  data={this.state.bom.bomData}
                  columns={
                    (adminCondition === "admin") ?
                      (
                        [srNoCol, materialCol, priceCol, stdCol, actCol, actionCol]
                      ) :
                      (
                        [srNoCol, materialCol, priceCol, stdCol, actionCol]
                      )
                  }
                  minRows={0}
                  showPagination={false}
                  className="-striped -highlight"
                />
              </Col>
            ) : (<div></div>)
        }
        <Col xs={12} sm={12} md={12} lg={12}>
          <OverlayTrigger placement="top" overlay={add}>
            <Button bsStyle="primary" fill icon
              onClick={() => {
                let tempBom = this.state.bom;
                tempBom.bomData.push({
                  inventory: null,
                  stdQty: 0,
                  actQty: 0,
                  actions: (
                    <div style={{ textAlign: "right" }}>
                      <a role="button" className="fa fa-save text-success" onClick={() => this.save(this.state.filteredList.length - 1)} />
                      <a role="button" hidden={cookie.load('role') === "admin"} className="fa fa-trash text-danger" onClick={() => this.delete(this.state.filteredList.length - 1)} />
                    </div>
                  )
                });
                this.setState({ tempBom });
              }}
            > <span className="fa fa-plus"></span></Button>
          </OverlayTrigger>
        </Col>
      </Col>
    );
    let actions = (
      <Col xs={12} sm={12} md={12} lg={12}>
        <center><b><h5 className="text-danger">{this.state.formError}</h5></b></center>
        <OverlayTrigger placement="top" overlay={back}>
          <Button bsStyle="warning" fill icon onClick={this.props.history.goBack}><span className="fa fa-arrow-left"></span></Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={List}><Button bsStyle="primary" fill icon disabled={this.state.settings}
          onClick={() => { return this.props.history.push("/production/bom"); }}><span className="fa fa-list"></span>
        </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={save}>
          <Button bsStyle="success" fill icon pullRight onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
        </OverlayTrigger>
      </Col>
    )

    return (
      <Row className="card-content">
        {this.state.alert}
        <div className="card-form dropdown-select">{form}</div>
        <div className="card-footer">{actions}</div>
      </Row>
    );
  }
}

export default BoMFormComponent;