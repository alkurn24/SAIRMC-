import React, { Component } from "react";
import { Modal, FormGroup, ControlLabel, FormControl, Tooltip, OverlayTrigger, Row, Col } from "react-bootstrap";
import Radio from "components/CustomRadio/CustomRadio.jsx";
import Select from "react-select";
import { When } from 'react-if'

import Button from "components/CustomButton/CustomButton.jsx";
import errorColor from 'variables/Variables.jsx';
class PurchaseModuleOrderModalComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alert: null,
      formError: null,
      currency: "₹",
      gstList: [],
      newOrder: props.newOrder ? props.newOrder : {
        rawMaterial: {},
        consumable: {},
        asset: {},
        accessory: {},
        rate: 0,
        quantity: 0,
        discount: 0,
        avlQuantity: 0,
        received: 0,
        packing: 0,
        gstType: "igst",
        gst: 0,
        hsn: "",
      },

      rawMaterialValid: null,
      diaValid: null,
      guageValid: null,
      gsmValid: null,
      slValid: null,
      packingWtValid: null,
      noOfBagsValid: null,
      quantityValid: null,
      rateValid: null
    }
    this.emptyState = this.state;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.handleCheckedRadioButton = this.handleCheckedRadioButton.bind(this);
    this.handleInputChangeConsumable = this.handleInputChangeConsumable.bind(this);
    this.handleInputChangeAsset = this.handleInputChangeAsset.bind(this);
    this.handleInputChangeAccessory = this.handleInputChangeAccessory.bind(this)
  }
  componentWillReceiveProps(newProps) {
    this.props = newProps
    newProps.newOrder
      ? this.setState({ newOrder: newProps.newOrder })
      : this.setState({
        newOrder: {
          rawMaterial: {},
          consumable: {},
          asset: {},
          accessory: {},
          rate: 0,
          quantity: 0,
          discount: 0,
          avlQuantity: 0,
          received: 0,
          packing: 0,
          gstType: "igst",
          gst: 0,
          hsn: "",
        }
      })
  }

  handleCheckedChange(e) {
    var newNewOrder = this.state.newOrder;
    newNewOrder[e.target.name] = e.target.checked;
    this.setState({ newOrder: newNewOrder, [e.target.name + 'Valid']: true, formError: "" });

  }
  handleCheckedRadioButton(e) {
    var newOrderRadio = this.state.newOrder;
    newOrderRadio[e.target.name] = e.target.value;
    this.setState({ newOrder: newOrderRadio });
  }
  handleInputChange(e) {
    let newObj = this.state.newOrder;
    if (!e.target) {
      newObj.consumable = null;
      newObj.asset = null;
      newObj.accessory = null;
      newObj.rawMaterial = e;
      newObj.rawMaterial.id = e.id;

      // newObj1.consumable = e;
      // newObj1.consumable.id = e.id;
      this.setState({ newOrder: newObj, formError: null });
      e.id === "" ? this.setState({ rawMaterialValid: false }) : this.setState({ rawMaterialValid: true })
    } else {
      newObj[e.target.name] = parseFloat(e.target.value);
      this.setState({ newOrder: newObj, formError: null });
      (e.target.value === "") ?
        this.setState({ [e.target.name + "Valid"]: false }) : this.setState({ [e.target.name + "Valid"]: true })
    }
  }
  handleInputChangeConsumable(e) {
    let newObj = this.state.newOrder;
    if (!e.target) {
      newObj.rawMaterial = null;
      newObj.asset = null;
      newObj.accessory = null;
      newObj.consumable = e;
      newObj.consumable.id = e.id;

      this.setState({ newOrder: newObj, formError: null });
      e.id === "" ? this.setState({ rawMaterialValid: false }) : this.setState({ rawMaterialValid: true })
    } else {
      newObj[e.target.name] = parseFloat(e.target.value);
      this.setState({ newOrder: newObj, formError: null });
      (e.target.value === "") ?
        this.setState({ [e.target.name + "Valid"]: false }) : this.setState({ [e.target.name + "Valid"]: true })
    }
  }
  handleInputChangeAsset(e) {
    let newObj = this.state.newOrder;
    if (!e.target) {
      newObj.consumable = null;
      newObj.rawMaterial = null;
      newObj.accessory = null;
      newObj.asset = e;
      newObj.asset.id = e.id;

      this.setState({ newOrder: newObj, formError: null });
      e.id === "" ? this.setState({ rawMaterialValid: false }) : this.setState({ rawMaterialValid: true })
    } else {
      newObj[e.target.name] = parseFloat(e.target.value);
      this.setState({ newOrder: newObj, formError: null });
      (e.target.value === "") ?
        this.setState({ [e.target.name + "Valid"]: false }) : this.setState({ [e.target.name + "Valid"]: true })
    }
  }
  handleInputChangeAccessory(e) {
    let newObj = this.state.newOrder;
    if (!e.target) {
      newObj.consumable = null;
      newObj.asset = null;
      newObj.rawMaterial = null;
      newObj.accessory = e;
      newObj.accessory.id = e.id;

      this.setState({ newOrder: newObj, formError: null });
      e.id === "" ? this.setState({ rawMaterialValid: false }) : this.setState({ rawMaterialValid: true })
    } else {
      newObj[e.target.name] = parseFloat(e.target.value);
      this.setState({ newOrder: newObj, formError: null });
      (e.target.value === "") ?
        this.setState({ [e.target.name + "Valid"]: false }) : this.setState({ [e.target.name + "Valid"]: true })
    }
  }
  validationCheck() {
    this.props.saveRawMaterialToModule(this.state.newOrder);
    this.props.handleCloseAddMaterialModal();
    this.setState({
      newOrder: {
        rawMaterial: {},
        consumable: {},
        asset: {},
        accessory: {},
        noOfBags: 0,
        rate: 0,
        quantity: 0,
        discount: 0,
        avlQuantity: 0,
        received: 0,
        packing: 0,
        gstType: "igst",
        gst: 0,
        hsn: "",
      }
    })
  }
  render() {
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    var CheckGst = false;
    var materialCondition = false
    if (this.state.newOrder.gst === 'igst') {
      CheckGst = false;
    } else {
      CheckGst = true;
    }
    return (
      <Modal
        show={this.props.showAddMaterialModal}
        onHide={() => this.props.handleCloseAddMaterialModal()}>
        <Modal.Header closeButton>
          <When condition={materialCondition == false}>
            <Modal.Title>Add/Update Materials</Modal.Title>
          </When>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {this.state.alert}
            <Col md={12} mdOffset={0}>
              {
                this.props.inventoryType === "rawMaterial"
                  ? (
                    <FormGroup>
                      <ControlLabel> Select Material</ControlLabel>
                      <Select
                        clearable={false}
                        placeholder="Select material"
                        name="rawMaterial"
                        options={this.props.rawMaterialList}
                        value={this.state.newOrder ? this.state.newOrder.rawMaterial.id : ""}
                        onChange={(selectedOption) => this.handleInputChange(selectedOption)}
                        style={{
                          color: this.state.rawMaterialValid || this.state.rawMaterialValid === null ? "" : errorColor,
                          borderColor: this.state.rawMaterialValid || this.state.rawMaterialValid === null ? "" : errorColor
                        }}
                      />
                    </FormGroup>
                  ) : null
              }
              {
                this.props.inventoryType === "consumable"
                  ? (
                    <FormGroup>
                      <ControlLabel> Select consumable</ControlLabel>
                      <Select
                        clearable={false}
                        placeholder="Select consumable"
                        name="consumable"
                        options={this.props.consumableList}
                        value={this.state.newOrder ? this.state.newOrder.consumable.id : ""}
                        onChange={(selectedOption) => this.handleInputChangeConsumable(selectedOption)}
                        style={{
                          color: this.state.rawMaterialValid || this.state.rawMaterialValid === null ? "" : errorColor,
                          borderColor: this.state.rawMaterialValid || this.state.rawMaterialValid === null ? "" : errorColor
                        }}
                      />
                    </FormGroup>
                  ) : null
              }
              {
                this.props.inventoryType === "asset"
                  ? (
                    <FormGroup>
                      <ControlLabel> Select Asset</ControlLabel>
                      <Select
                        clearable={false}
                        placeholder="Select asset"
                        name="Asset"
                        options={this.props.assetList}
                        value={this.state.newOrder ? this.state.newOrder.asset.id : ""}
                        onChange={(selectedOption) => this.handleInputChangeAsset(selectedOption)}
                        style={{
                          color: this.state.rawMaterialValid || this.state.rawMaterialValid === null ? "" : errorColor,
                          borderColor: this.state.rawMaterialValid || this.state.rawMaterialValid === null ? "" : errorColor
                        }}
                      />
                    </FormGroup>
                  ) : null
              }
              {
                this.props.inventoryType === "accessory"
                  ? (
                    <FormGroup>
                      <ControlLabel> Select Accessory</ControlLabel>
                      <Select
                        clearable={false}
                        placeholder="Select accessory"
                        name="accessory"
                        options={this.props.accessoryList}
                        value={this.state.newOrder ? this.state.newOrder.accessory.id : ""}
                        onChange={(selectedOption) => this.handleInputChangeAccessory(selectedOption)}
                        style={{
                          color: this.state.rawMaterialValid || this.state.rawMaterialValid === null ? "" : errorColor,
                          borderColor: this.state.rawMaterialValid || this.state.rawMaterialValid === null ? "" : errorColor
                        }}
                      />
                    </FormGroup>
                  ) : null
              }
            </Col>
            <Col md={6} mdOffset={0}>

              <FormGroup>
                <ControlLabel>Required Quantity</ControlLabel>
                <div>
                  <span className="input-group">
                    <FormControl
                      name="quantity"
                      type="number"
                      step="0.001"
                      pattern="^\d+(?:\.\d{1,3})?$"
                      placeholder="Enter Quantiry"
                      value={this.state.newOrder ? this.state.newOrder.quantity : ""}
                      onChange={this.handleInputChange}
                      className={this.state.quantityValid || this.state.quantityValid === null ? "" : "error"}
                    />
                    {
                      this.props.inventoryType === "rawMaterial"
                        ? (
                          <span className="input-group-addon"> {this.state.newOrder ? this.state.newOrder.rawMaterial.unit : ""}</span>
                        ) : null
                    }
                    {
                      this.props.inventoryType === "consumable"
                        ? (
                          <span className="input-group-addon"> {this.state.newOrder ? this.state.newOrder.consumable.unit : ""}</span>
                        ) : null
                    }
                    {
                      this.props.inventoryType === "asset"
                        ? (
                          <span className="input-group-addon"> {this.state.newOrder ? this.state.newOrder.asset.unit : ""}</span>
                        ) : null
                    }
                    {
                      this.props.inventoryType === "accessory"
                        ? (
                          <span className="input-group-addon"> {this.state.newOrder ? this.state.newOrder.accessory.unit : ""}</span>
                        ) : null
                    }
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md={6} mdOffset={0}>
              <FormGroup>
                <ControlLabel>Available Quantity</ControlLabel>
                {
                  this.props.inventoryType === "rawMaterial"
                    ? (
                      <div>
                        <span className="input-group">
                          <FormControl className={this.state.newOrder ? (this.state.newOrder.standardQty < 0 ? "text-danger" : "text-success") : ""}
                            disabled
                            name="avlQuantity"
                            type="number"
                            placeholder="Available quantiry"
                            value={this.state.newOrder ? this.state.newOrder.rawMaterial.standardQty : 0}
                          // onChange={this.handleInputChange}
                          />

                          <span className="input-group-addon"> {this.state.newOrder ? this.state.newOrder.rawMaterial.unit : ""}</span>
                        </span>
                      </div>
                    ) : null
                }
                {
                  this.props.inventoryType === "consumable"
                    ? (
                      <div>
                        <span className="input-group">
                          <FormControl className={this.state.newOrder ? (this.state.newOrder.standardQty < 0 ? "text-danger" : "text-success") : ""}
                            disabled
                            name="avlQuantity"
                            type="number"
                            placeholder="Available Quantiry"
                            value={this.state.newOrder ? this.state.newOrder.consumable.standardQty : 0}
                          // onChange={this.handleInputChange}
                          />
                          <span className="input-group-addon"> {this.state.newOrder ? this.state.newOrder.consumable.unit : ""}</span>
                        </span>
                      </div>
                    ) : null
                }
                {
                  this.props.inventoryType === "asset"
                    ? (
                      <div>
                        <span className="input-group">
                          <FormControl className={this.state.newOrder ? (this.state.newOrder.actualQty < 0 ? "text-danger" : "text-success") : ""}
                            disabled
                            name="avlQuantity"
                            type="number"
                            placeholder="Available quantiry"
                            value={this.state.newOrder ? this.state.newOrder.asset.actualQty : 0}
                          // onChange={this.handleInputChange}
                          />
                          <span className="input-group-addon"> {this.state.newOrder ? this.state.newOrder.asset.unit : ""}</span>
                        </span>
                      </div>
                    ) : null
                }
                {
                  this.props.inventoryType === "accessory"
                    ? (
                      <div>
                        <span className="input-group">
                          <FormControl className={this.state.newOrder ? (this.state.newOrder.actualQty < 0 ? "text-danger" : "text-success") : ""}
                            disabled
                            name="avlQuantity"
                            type="number"
                            placeholder="Available Quantiry"
                            value={this.state.newOrder ? this.state.newOrder.accessory.actualQty : 0}
                          // onChange={this.handleInputChange}
                          />
                          <span className="input-group-addon"> {this.state.newOrder ? this.state.newOrder.accessory.unit : ""}</span>
                        </span>
                      </div>
                    ) : null
                }
              </FormGroup>
            </Col>
            <Col md={6} mdOffset={0}>
              <FormGroup>
                <ControlLabel>Packing(%)</ControlLabel>
                <div>
                  <span className="input-group">
                    <FormControl
                      name="packing"
                      type="number"
                      min={0}
                      step="0.25"
                      pattern="^\d+(?:\.\d{1,2})?$"
                      placeholder="Packing(%)"
                      value={this.state.newOrder.packing ? this.state.newOrder.packing : 0}
                      onChange={this.handleInputChange}
                    />
                    <span className="input-group-addon"> %</span>
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md={6} mdOffset={0}>
              <FormGroup>
                <ControlLabel>HSN Code</ControlLabel>
                {
                  this.props.inventoryType === "rawMaterial"
                    ? (
                      <span className="input-group">
                        <FormControl className={this.state.newOrder ? (this.state.newOrder.hsn < 0 ? "text-danger" : "text-primary") : ""}
                          disabled
                          name="hsn"
                          type="number"
                          placeholder="HSN code"
                          value={this.state.newOrder ? this.state.newOrder.rawMaterial.hsn : 0}
                        // onChange={this.handleInputChange}
                        />
                        <span className="input-group-addon"> {this.state.newOrder.rawMaterial.gst ? this.state.newOrder.rawMaterial.gst : 0}%</span>
                      </span>
                    ) : null
                }
                {
                  this.props.inventoryType === "consumable"
                    ? (
                      <span className="input-group">
                        <FormControl className={this.state.newOrder ? (this.state.newOrder.hsn < 0 ? "text-danger" : "text-primary") : ""}
                          disabled
                          name="hsn"
                          type="number"
                          placeholder="HSN Code"
                          value={this.state.newOrder ? this.state.newOrder.consumable.hsn : 0}
                        // onChange={this.handleInputChange}
                        />
                        <span className="input-group-addon"> {this.state.newOrder.consumable.gst ? this.state.newOrder.consumable.gst : 0}%</span>
                      </span>
                    ) : null
                }
                {
                  this.props.inventoryType === "asset"
                    ? (
                      <span className="input-group">
                        <FormControl className={this.state.newOrder ? (this.state.newOrder.hsn < 0 ? "text-danger" : "text-primary") : ""}
                          disabled
                          name="hsn"
                          type="number"
                          placeholder="HSN code"
                          value={this.state.newOrder ? this.state.newOrder.asset.hsn : 0}
                        // onChange={this.handleInputChange}
                        />
                        <span className="input-group-addon"> {this.state.newOrder.asset.gst ? this.state.newOrder.asset.gst : 0}%</span>
                      </span>
                    ) : null
                }
                {
                  this.props.inventoryType === "accessory"
                    ? (
                      <span className="input-group">
                        <FormControl className={this.state.newOrder ? (this.state.newOrder.hsn < 0 ? "text-danger" : "text-primary") : ""}
                          disabled
                          name="hsn"
                          type="number"
                          placeholder="HSN code"
                          value={this.state.newOrder ? this.state.newOrder.accessory.hsn : 0}
                        // onChange={this.handleInputChange}
                        />
                        <span className="input-group-addon"> {this.state.newOrder.accessory.gst ? this.state.newOrder.accessory.gst : 0}%</span>
                      </span>
                    ) : null
                }
              </FormGroup>
            </Col>

            <Col md={4} mdOffset={0}>
              <FormGroup>
                <ControlLabel>Discount</ControlLabel>
                <div>
                  <span className="input-group">
                    <FormControl
                      name="discount"
                      type="number"
                      step="0.25"
                      pattern="^\d+(?:\.\d{1,2})?$"
                      placeholder="Enter discount"
                      value={this.state.newOrder.discount ? this.state.newOrder.discount : 0}
                      onChange={this.handleInputChange}
                    // className={this.state.discountValid || this.state.discountValid === null ? "" : "error"}
                    />
                    <span className="input-group-addon">%</span>
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md={4} mdOffset={0}>
              <FormGroup>
                <ControlLabel>Rate</ControlLabel>
                <div>
                  <span className="input-group">
                    <span className="input-group-addon">{this.state.currency}</span>
                    <FormControl
                      name="rate"
                      type="number"
                      min={0}
                      step="0.25"
                      pattern="^\d+(?:\.\d{1,2})?$"
                      placeholder="Rate"
                      value={this.state.newOrder.rate.filter(prop => {
                        return (prop.type === prop.inventoryType)
                      })
                         }
                      onChange={this.handleInputChange}
                      className={this.state.rateValid || this.state.rateValid === null ? "" : "error"}
                    />
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md={4} mdOffset={0}>
              <FormGroup>
                <ControlLabel>Order Value</ControlLabel>
                <div>
                  <span className="input-group">
                    <span className="input-group-addon">{this.state.currency}</span>
                    <FormControl
                      disabled
                      name="orderamt"
                      type="number"
                      step="0.01"
                      placeholder="Order amount"
                      value={this.state.newOrder ?
                        ((this.state.newOrder.quantity * this.state.newOrder.rate) -
                          ((this.state.newOrder.quantity * this.state.newOrder.rate) *
                            this.state.newOrder.discount / 100)).toFixed(2) : 0}
                    />
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md={2} mdOffset={0} >
              <Radio
                checked
                number="54"
                option="igst"
                name="gstType"
                onChange={this.handleCheckedRadioButton}
                checked={this.state.newOrder.gstType === "igst"}
                label="IGST"
              />
            </Col>
            <Col md={3} mdOffset={0} >
              <Radio
                number="98"
                option="gst"
                name="gstType"
                onChange={this.handleCheckedRadioButton}
                checked={this.state.newOrder.gstType === "gst"}
                label="CGST/SGST"
              />
            </Col>
            {
              this.state.quantityError ? <small className="text-danger">{this.state.quantityError}<br /></small> : null
            }
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <h6 className="text-danger">{this.state.formError}</h6>
          <OverlayTrigger placement="top" overlay={save}>
            <Button bsStyle="success" fill icon pullRight style={{ marginLeft: "15px" }} onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
          </OverlayTrigger>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default PurchaseModuleOrderModalComponent;