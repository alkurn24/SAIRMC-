import React, { Component } from "react";
import Select from "components/CustomSelect/CustomSelect.jsx";
import { Modal, FormGroup, ControlLabel, FormControl, Tooltip, OverlayTrigger, Row, Col } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { errorColor } from 'variables/Variables.jsx';

class PurchaseRequestModalComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alert: null,
      formError: null,
      categoryList: [],
      inventoryList: [],
      assetList: [],
      serviceList: [],
      inventoryData: [],
      assetData: [],
      serviceData: [],

      currency: "₹",
      newOrder: props.newOrder ? props.newOrder : {
        freeText: "",
        inventoryType: null,
        inventoryCategory: null,
        inventory: null,
        asset: null,
        service: null,
        salesOrder: null,
        name: "",
        quantity: "",
        discount: 0,
        packing: 0,


      },

      inventoryTypeValid: null,
      inventoryCategoryValid: null,
      inventoryValid: null,
      assetValid: null,
      serviceValid: null,
      quantityValid: null,
      rateValid: null,
      name: "",
      inventoryTypeError: false,
      inventoryCategoryError: false,
      inventoryError: false,
      quantiityError: false,
      assetError: false,
      serviceError: false,


    }
    this.emptyState = this.state;
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.validationCheckRequiredFields = this.validationCheckRequiredFields.bind(this);
    this.handleDropDownChangeType = this.handleDropDownChangeType.bind(this);
  }
  componentWillReceiveProps(newProps) {
    this.props = newProps
    newProps.newOrder
      ? this.setState({ newOrder: newProps.newOrder })
      : this.setState({
        newOrder: {
          freeText: "",
          inventoryType: null,
          inventoryCategory: null,
          inventory: null,
          asset: null,
          service: null,
          salesOrder: null,
          quantity: "",
          discount: 0,
          name: "",
          packing: 0,
          categoryList: [],
          inventoryList: [],
          assetList: [],
          serviceList: [],

        }
      })
  }
  handleDropDownChange(selectOption, type) {
    if (type === "inventoryType") {
      var tempInventory = this.state.newOrder;
      tempInventory.inventoryCategory = null;
      tempInventory.inventory = null;
      tempInventory.asset = null;
      tempInventory.service = null;
      if (selectOption !== undefined) {
        if (selectOption.categories.trim() !== "") {
          this.setState({
            categoryList: selectOption.categories.split(",").map(prop => {
              return {
                value: prop,
                label: prop
              }
            })
          })
        } else {
          this.setState({ categoryList: null })
        }
        if (this.props.purchaseRequest.type === "Store") {
          this.setState({
            inventoryData: this.props.inventoryList.filter(x => { return x.type === selectOption.value }).map(prop => {
              return {
                id: prop.value,
                label: prop.label,
                value: prop.value,
                gst: prop.gst,
                hsn: prop.hsn,
                type: prop.type,
                cat: prop.cat,
                rate: prop.vendors ? prop.vendors : 0
              }
            })
          })
        }
        else if (this.props.purchaseRequest.type === "Asset") {
          this.setState({
            assetData: this.props.assetList.filter(x => { return x.type === selectOption.value }).map(prop => {
              return {
                id: prop.value,
                label: prop.label,
                value: prop.value,
                gst: prop.gst,
                hsn: prop.hsn,
                type: prop.type,
                cat: prop.cat,
                rate: prop.vendors ? prop.vendors : 0
              }
            })
          })
        }
        else {
          this.setState({
            serviceData: this.props.serviceList.filter(x => { return x.type === selectOption.value }).map(prop => {
              return {
                id: prop.value,
                label: prop.label,
                value: prop.value,
                gst: prop.gst,
                hsn: prop.hsn,
                type: prop.type,
                cat: prop.cat,
                rate: prop.vendors ? prop.vendors : 0
              }
            })
          })
        }
      }
    }
    var tempInventory = this.state.newOrder;
    tempInventory[type] = selectOption ? selectOption : null;
    if (!this.state.categoryList) tempInventory.category = "";
    this.setState({ newOrder: tempInventory });
  }
  handleDropDownChangeType(selectOption, type) {
    var tempInventory = this.state.newOrder;
    tempInventory.inventory = null;
    tempInventory.asset = null;
    tempInventory.service = null;
    if (this.props.purchaseRequest.type === "Store") {
      this.setState({
        inventoryList: this.state.inventoryData.filter(x => { return x.cat === selectOption.value }).map(prop => {
          return {
            id: prop.value,
            label: prop.label,
            value: prop.value,
            gst: prop.gst,
            hsn: prop.hsn,
            type: prop.type,
            cat: prop.cat,
            rate: prop.rate ? prop.rate : null
          }
        })
      })
    }
    else if (this.props.purchaseRequest.type === "Asset") {
      this.setState({
        assetList: this.state.assetData.filter(x => { return x.cat === selectOption.value }).map(prop => {
          return {
            id: prop.value,
            label: prop.label,
            value: prop.value,
            gst: prop.gst,
            hsn: prop.hsn,
            type: prop.type,
            rate: prop.rate ? prop.rate : null
          }
        })
      })
    }
    else {
      this.setState({
        serviceList: this.state.serviceData.filter(x => { return x.cat === selectOption.value }).map(prop => {
          return {
            id: prop.value,
            label: prop.label,
            value: prop.value,
            gst: prop.gst,
            hsn: prop.hsn,
            type: prop.type,
            rate: prop.rate ? prop.rate : null
          }
        })
      })
    }
    var tempInventory = this.state.newOrder;
    tempInventory[type] = selectOption ? selectOption : null;
    this.setState({ newOrder: tempInventory });
  }
  handleInputChange(e) {
    var tempInventory = this.state.newOrder;
    tempInventory[e.target.name] = e.target.value;
    this.setState({ newOrder: tempInventory, [e.target.name + 'Valid']: true, formError: "" });
  }
  validationCheckRequiredFields() {
    this.state.newOrder.inventoryType === null ?
      this.setState({ inventoryTypeError: "Select Subclass", inventoryTypeValid: false }) :
      this.setState({ inventoryTypeError: "", inventoryTypeValid: true })

    this.state.newOrder.inventoryCategory === null ?
      this.setState({ inventoryCategoryError: "Select type", inventoryCategoryValid: false }) :
      this.setState({ inventoryCategoryError: "", inventoryCategoryValid: true })

    this.state.newOrder.quantity === "" ?
      this.setState({ quantityError: "Enter Quantity", quantityValid: false }) :
      this.setState({ quantityError: "", quantityValid: true })
    this.state.newOrder.inventory === null ?
      this.setState({ inventoryError: "Select discription name", inventoryValid: false }) :
      this.setState({ inventoryError: "", inventoryValid: true })
    this.state.newOrder.asset === null ?
      this.setState({ assetError: "Select discription name", assetValid: false }) :
      this.setState({ assetError: "", assetValid: true })
    this.state.newOrder.service === null ?
      this.setState({ serviceError: "Select discription name", serviceValid: false }) :
      this.setState({ serviceError: "", serviceValid: true })
    setTimeout(this.validationCheck, 10);

  }


  validationCheck() {
    let _this = this;
    let validationCheck = false;
    if (this.props.purchaseRequest.type === "Store") {
      validationCheck = (_this.state.inventoryTypeValid && _this.state.quantityValid && _this.state.inventoryValid)
    }
    else if (this.props.purchaseRequest.type === "Asset") {
      validationCheck = (_this.state.inventoryTypeValid && _this.state.quantityValid && _this.state.assetValid)
    }
    else {
      validationCheck = (_this.state.inventoryTypeValid && _this.state.quantityValid && _this.state.serviceValid)
    }
    if (validationCheck) {
      _this.props.saveInventoryToModule(_this.state.newOrder);
      _this.props.handleCloseAddInventoryModal();
      _this.setState({
        newOrder: {
          freeText: "",
          inventoryType: null,
          inventoryCategory: null,
          inventory: null,
          asset: null,
          service: null,
          salesOrder: null,
          quantity: "",
          discount: 0,
          packing: 0,
          categoryList: [],
          inventoryList: [],
          assetList: [],
          serviceList: [],
        }
      })
    }
    else {
      _this.setState({ formError: "Please enter required fields" })
    }
  }

  render() {
    const save = (<Tooltip id="save_tooltip">Add</Tooltip>);
    return (
      <Modal
        show={this.props.showAddInventoryModal}
      // onHide={() => this.props.handleCloseAddInventoryModal()}
      >
        <Modal.Header>
          <div className="modal-close">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => this.props.handleCloseAddInventoryModal()}>{null}</a>
          </div>
          <Modal.Title>Add/Update Inventory </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {this.state.alert}
            <div className="card-form">
              <Row>
                <Col xs={12}>
                  <Col xs={12}>
                    <FormGroup>
                      {this.props.purchaseRequest.type === "Store" ?
                        <div>
                          <ControlLabel>Inventory type <span className="star">*</span></ControlLabel>
                          <Select
                            clearable={false}
                            placeholder="Select inventory type"
                            name="inventoryType"
                            options={this.props.inventorySettingList.filter(prop => {
                              return (prop.type === "Store")
                            })}
                            value={this.state.newOrder.inventoryType ? this.state.newOrder.inventoryType.value : ""}
                            onChange={(selectOption) => this.handleDropDownChange(selectOption, "inventoryType")}
                            style={{ color: this.state.inventoryTypeValid || this.state.inventoryTypeValid === null ? "" : errorColor, borderColor: this.state.inventoryTypeValid || this.state.inventoryTypeValid === null ? "" : errorColor }}
                          />
                        </div>
                        :
                        this.props.purchaseRequest.type === "Asset" ?
                          <div>
                            <ControlLabel>Inventory type <span className="star">*</span></ControlLabel>
                            <Select
                              clearable={false}
                              placeholder="Select inventory type"
                              name="inventoryType"
                              options={this.props.inventorySettingList.filter(prop => {
                                return (prop.type === "Asset")
                              })}
                              value={this.state.newOrder.inventoryType ? this.state.newOrder.inventoryType.value : ""}
                              onChange={(selectOption) => this.handleDropDownChange(selectOption, "inventoryType")}
                              style={{ color: this.state.inventoryTypeValid || this.state.inventoryTypeValid === null ? "" : errorColor, borderColor: this.state.inventoryTypeValid || this.state.inventoryTypeValid === null ? "" : errorColor }}
                            />
                          </div>
                          :
                          <div>
                            <ControlLabel>Inventory type <span className="star">*</span></ControlLabel>
                            <Select
                              clearable={false}
                              placeholder="Select inventory type"
                              name="inventoryType"
                              options={this.props.inventorySettingList.filter(prop => {
                                return (prop.type === "Service")
                              })}
                              value={this.state.newOrder.inventoryType ? this.state.newOrder.inventoryType.value : ""}
                              onChange={(selectOption) => this.handleDropDownChange(selectOption, "inventoryType")}
                              style={{ color: this.state.inventoryTypeValid || this.state.inventoryTypeValid === null ? "" : errorColor, borderColor: this.state.inventoryTypeValid || this.state.inventoryTypeValid === null ? "" : errorColor }}
                            />
                          </div>
                      }
                    </FormGroup>
                  </Col>
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>Inventory category</ControlLabel>
                      <Select
                        clearable={false}
                        placeholder="Select inventory category"
                        name="inventoryCategory"
                        options={this.state.categoryList}
                        value={this.state.newOrder.inventoryCategory ? this.state.newOrder.inventoryCategory.value : ""}
                        onChange={(selectOption) => this.handleDropDownChangeType(selectOption, "inventoryCategory")}
                      />

                    </FormGroup>
                  </Col>
                  <Col xs={12}>
                    <FormGroup>
                      {this.props.purchaseRequest.type === "Store" ?
                        <div>
                          <ControlLabel>Material Name <span className="star">*</span></ControlLabel>
                          <Select
                            clearable={false}
                            placeholder="Select material"
                            name="inventory"
                            options={this.state.newOrder.inventoryCategory !== null ?
                              this.state.inventoryList
                              :
                              this.state.inventoryData
                            }
                            value={this.state.newOrder.inventory ? this.state.newOrder.inventory.value : ""}
                            onChange={(selectOption) => this.handleDropDownChange(selectOption, "inventory")}
                            style={{ color: this.state.inventoryValid || this.state.inventoryValid === null ? "" : errorColor, borderColor: this.state.inventoryValid || this.state.inventoryValid === null ? "" : errorColor }}

                          />
                        </div>
                        :
                        this.props.purchaseRequest.type === "Asset" ?
                          <div>
                            <ControlLabel>Material Name <span className="star">*</span></ControlLabel>
                            <Select
                              clearable={false}
                              placeholder="Select material"
                              name="asset"
                              options={this.state.newOrder.inventoryCategory !== null ?
                                this.state.assetList
                                :
                                this.state.assetData
                              }
                              value={this.state.newOrder.asset ? this.state.newOrder.asset.value : ""}
                              onChange={(selectOption) => this.handleDropDownChange(selectOption, "asset")}
                              style={{ color: this.state.assetValid || this.state.assetValid === null ? "" : errorColor, borderColor: this.state.assetValid || this.state.assetValid === null ? "" : errorColor }}
                            />
                          </div>
                          :
                          <div>
                            <ControlLabel>Service Name <span className="star">*</span></ControlLabel>
                            <Select
                              clearable={false}
                              placeholder="Select service Name"
                              name="service"
                              options={this.state.newOrder.inventoryCategory !== null ?
                                this.state.serviceList
                                :
                                this.state.serviceData
                              }
                              value={this.state.newOrder.service ? this.state.newOrder.service.value : ""}
                              onChange={(selectOption) => this.handleDropDownChange(selectOption, "service")}
                              style={{ color: this.state.serviceValid || this.state.serviceValid === null ? "" : errorColor, borderColor: this.state.serviceValid || this.state.serviceValid === null ? "" : errorColor }}
                            />
                          </div>
                      }
                    </FormGroup>
                  </Col>
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel> Quantity <span className="star">*</span></ControlLabel>
                      <FormControl
                        name="quantity"
                        type="number"
                        step="1"
                        pattern="^\d+(?:\.\d{1,3})?$"
                        placeholder="0"
                        value={this.state.newOrder ? this.state.newOrder.quantity : ""}
                        onChange={this.handleInputChange}
                        className={this.state.quantityValid || this.state.quantityValid === null ? "" : "error"}
                      />
                    </FormGroup>
                  </Col>
                  {this.props.purchaseRequest.type === "Service" ?
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <FormGroup>
                        <ControlLabel> Scope of Work </ControlLabel>
                        <FormControl
                          componentClass="textarea"
                          rows={3}
                          placeholder=" Enter scope of work"
                          type="text"
                          name="freeText"
                          value={this.state.newOrder ? this.state.newOrder.freeText : ""}
                          onChange={this.handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    :
                    null
                  }
                </Col>
              </Row>
            </div>
            <div className="card-footer">
              <Col xs={12} sm={12} md={12} lg={12}>
                <center>
                  <h6 className="text-danger">{this.state.formError}</h6>

                </center>
                <div style={{ marginBottom: "10px" }} />
                {this.state.newOrder._id === undefined ?
                  <OverlayTrigger placement="top" overlay={save}>
                    <Button bsStyle="primary" fill icon pullRight onClick={this.validationCheckRequiredFields}>
                      <span className="fa fa-plus" />
                    </Button>
                  </OverlayTrigger>
                  : null
                }
              </Col>
            </div>
          </Row>
        </Modal.Body>

      </Modal >

    )
  }
}

export default PurchaseRequestModalComponent;