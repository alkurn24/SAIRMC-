import React, { Component } from "react";
import Select from "components/CustomSelect/CustomSelect.jsx";
import { Modal, FormGroup, ControlLabel, FormControl, Tooltip, OverlayTrigger, Row, Col } from "react-bootstrap";

import Radio from "components/CustomRadio/CustomRadio.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

import { errorColor } from 'variables/Variables.jsx';

class SalesModuleOrderModalComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alert: null,
      formError: null,
      currency: "₹",
      newOrder: props.newOrder ? props.newOrder : {
        product: "",
        rate: "",
        hsn: "",
        gst: 0,
        quantity: 1,
        standardRate: 0,
        dispatched: 0,
        avlQuantity: 0,
        gstType: "gst",
        pumpType: "pumping",
        pumpCharges: 0,
      },

      productValid: null,
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
    this.handleCheckedRadioButton = this.handleCheckedRadioButton.bind(this);
    this.handleInputChangePumpType = this.handleInputChangePumpType.bind(this);
    this.validationCheckRequiredFields = this.validationCheckRequiredFields.bind(this);
  }
  componentWillReceiveProps(newProps) {
    this.props = newProps
    newProps.newOrder
      ? this.setState({ newOrder: newProps.newOrder })
      : this.setState({
        newOrder: {
          product: "",
          rate: "",
          hsn: "",
          gst: 0,
          quantity: 1,
          standardRate: 0,
          dispatched: 0,
          avlQuantity: 0,
          gstType: "gst",
          pumpType: "pumping",
          pumpCharges: 0,
        }
      })
  }
  handleInputChange(e, ) {
    let newObj = this.state.newOrder;

    if (!e.target) {
      newObj.product = e;
      newObj.product.id = e.id;
      this.setState({ newOrder: newObj, formError: null });
      e.id === "" ? this.setState({ productValid: false }) : this.setState({ productValid: true })
    } else {
      newObj[e.target.name] = parseFloat(e.target.value);
      this.setState({ newOrder: newObj, formError: null });
      (e.target.value === "") ?
        this.setState({ [e.target.name + "Valid"]: false }) : this.setState({ [e.target.name + "Valid"]: true })
    }
  }

  handleInputChangePumpType(selectOption, type) {
    var newOrder = this.state.newOrder;
    newOrder[type] = selectOption ? selectOption.value : null;
    this.setState({ newOrder: newOrder });
  }
  validationCheckRequiredFields() {
    this.state.newOrder.product === "" ?
      this.setState({ productError: "Select Product", productValid: false }) :
      this.setState({ productError: "", productValid: true })
    this.state.newOrder.quantity === "" ?
      this.setState({ quantityError: "Enter Quantity", quantityValid: false }) :
      this.setState({ quantityError: "", quantityValid: true })
    this.state.newOrder.rate === "" ?
      this.setState({ rateError: "Enter rate", rateValid: false }) :
      this.setState({ rateError: "", rateValid: true })
    setTimeout(this.validationCheck, 10);

  }


  validationCheck() {
    let _this = this;
    if (_this.state.productValid && _this.state.quantityValid && _this.state.rateValid) {
      _this.props.saveProductToModule(_this.state.newOrder);
      _this.props.handleCloseAddProductModal();
      _this.setState({
        newOrder: {
          product: "",
          rate: "",
          hsn: "",
          gst: 0,
          quantity: 1,
          standardRate: 0,
          dispatched: 0,
          avlQuantity: 0,
          gstType: "gst",
          pumpType: "pumping",
          pumpCharges: 0,
        }
      })
    }
    else {
      _this.setState({ formError: "Please enter required fields" })
    }
  }

  handleCheckedRadioButton(e) {
    var newOrderRadio = this.state.newOrder;
    newOrderRadio[e.target.name] = e.target.value;
    this.setState({ newOrder: newOrderRadio });
  }
  render() {
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);

    return (
      <Modal

        show={this.props.showAddProductModal}>
        <Modal.Header >
          <div className="modal-close">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => this.props.handleCloseAddProductModal()}>{null}</a>
          </div>
          <Modal.Title>Add/Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Row>
            {this.state.alert}
            <div className="card-form">
              <Row>
                <Col xs={12}>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <FormGroup>
                      {this.state.newOrder._id === undefined ?
                        <div>
                          <ControlLabel>Product <span className="star">*</span></ControlLabel>
                          <Select
                            clearable={false}
                            disabled={this.state.newOrder._id === undefined ? false : true}
                            placeholder="Select product"
                            name="product"
                            options={this.props.productList}
                            value={this.state.newOrder ? this.state.newOrder.product.id : ""}
                            onChange={(selectedOption) => { selectedOption !== undefined ? this.handleInputChange(selectedOption) : null }}
                            style={{ color: this.state.productValid || this.state.productValid === null ? "" : errorColor, borderColor: this.state.productValid || this.state.productValid === null ? "" : errorColor }}
                          />
                        </div>
                        :
                        <ControlLabel>Product Name:{this.state.newOrder.product.name}</ControlLabel>
                      }
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <FormGroup>
                      <ControlLabel>Required Quantity <span className="star">*</span></ControlLabel>
                      <div>
                        <span className="input-group">
                          <FormControl
                            disabled={this.state.newOrder._id === undefined ? false : true}
                            name="quantity"
                            type="number"
                            step="0.001"
                            pattern="^\d+(?:\.\d{1,3})?$"
                            placeholder="0"
                            value={this.state.newOrder ? this.state.newOrder.quantity : ""}
                            onChange={this.handleInputChange}
                            className={this.state.quantityValid || this.state.quantityValid === null ? "" : "error"}
                          />
                          <span className="input-group-addon"> {this.state.newOrder ? this.state.newOrder.product.unit : ""}</span>
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                </Col>
                <Col xs={12}>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <FormGroup>
                      <ControlLabel>Standard Rate</ControlLabel>
                      <div>
                        <span className="input-group">
                          <span className="input-group-addon">₹</span>
                          <FormControl
                            disabled={this.state.newOrder._id === undefined ? false : true}
                            name="standardRate"
                            type="number"
                            step="0.25"
                            pattern="^\d+(?:\.\d{1,2})?$"
                            placeholder="0"
                            value={this.state.newOrder.product ? this.state.newOrder.product.rate : ""}
                            onChange={this.handleInputChange}
                          />
                          <span className="input-group-addon">{this.state.newOrder.product ? this.state.newOrder.product.unit : ""}</span>
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <FormGroup>
                      <ControlLabel>Booking Rate <span className="star">*</span> </ControlLabel>
                      <div>
                        <span className="input-group">
                          <span className="input-group-addon">{this.state.currency}</span>
                          <FormControl
                            disabled={this.state.newOrder._id === undefined ? false : true}

                            name="rate"
                            type="number"
                            min={0}
                            step="1"
                            pattern="^\d+(?:\.\d{1,2})?$"
                            placeholder="0"
                            value={this.state.newOrder.rate ? this.state.newOrder.rate : ""}
                            onChange={this.handleInputChange}
                            className={this.state.rateValid || this.state.rateValid === null ? "" : "error"}
                          />
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                </Col>
                <Col xs={12}>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <FormGroup>
                      <ControlLabel>Pump Type</ControlLabel>
                      <Select
                        disabled={this.state.newOrder._id === undefined ? false : true}
                        clearable={false}
                        placeholder="Select pump type"
                        name="pumpType"
                        value={this.state.newOrder.pumpType}
                        options={[
                          { value: "pumping", label: "Pumping" },
                          { value: "dumping", label: "Dumping" },

                        ]}
                        onChange={(selectOption) => this.handleInputChangePumpType(selectOption, "pumpType")}

                      />
                    </FormGroup>
                  </Col>
                  {
                    this.state.newOrder.pumpType === "pumping" ?
                      <Col xs={12} sm={12} md={6} lg={6}>
                        <FormGroup>
                          <ControlLabel>Pump Charges</ControlLabel>
                          <div>
                            <span className="input-group">
                              <span className="input-group-addon">{this.state.currency}</span>
                              <FormControl
                                name="pumpCharges"
                                type="number"
                                min={0}
                                step="0.25"
                                pattern="^\d+(?:\.\d{1,2})?$"
                                placeholder="0"
                                value={this.state.newOrder.pumpCharges ? this.state.newOrder.pumpCharges : ""}
                                onChange={this.handleInputChange}
                              />
                            </span>
                          </div>
                        </FormGroup>
                      </Col>
                      : null
                  }

                </Col>
                <Col xs={12}>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <FormGroup>
                      <ControlLabel>HSN Code</ControlLabel>
                      {this.state.newOrder._id === undefined ?
                        (<div>
                          <span className="input-group">
                            <FormControl className={this.state.newOrder ? (this.state.newOrder.hsn < 0 ? "text-danger" : "text-primary") : ""}
                              disabled
                              name="hsn"
                              type="number"
                              placeholder="HSN code"
                              value={this.state.newOrder.product ? this.state.newOrder.product.hsn : 0}
                            />
                            <span className="input-group-addon"> {this.state.newOrder.product ? this.state.newOrder.product.gst : 0}%</span>
                          </span>
                        </div>) :
                        (<div>
                          <span className="input-group">
                            <FormControl className={this.state.newOrder ? (this.state.newOrder.hsn < 0 ? "text-danger" : "text-primary") : ""}
                              value={this.state.newOrder.hsn} />
                            <span className="input-group-addon"> {this.state.newOrder.gst}%</span>
                          </span>
                        </div>)
                      }
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={3} md={3} lg={3} style={{ marginTop: "22px" }}>
                    <Radio
                      number="76"
                      option="gst"
                      name="gstType"
                      onChange={this.handleCheckedRadioButton}
                      checked={this.state.newOrder.gstType === "gst"}
                      label="CGST/SGST"
                    />
                  </Col>
                  <Col xs={12} sm={3} md={3} lg={3} style={{ marginTop: "22px" }}>
                    <Radio
                      number="4"
                      option="igst"
                      name="gstType"
                      onChange={this.handleCheckedRadioButton}
                      checked={this.state.newOrder.gstType === "igst"}
                      label="IGST"
                    />
                  </Col>
                </Col>
                <Col xs={12}>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <FormGroup>
                      <ControlLabel>Order Value</ControlLabel>
                      <div>
                        <span className="input-group">
                          <span className="input-group-addon">{this.state.currency}</span>
                          <FormControl
                            disabled
                            name="orderamt"
                            type="number"
                            step="1"
                            pattern="^\d+(?:\.\d{1,2})?$"
                            placeholder="Order amount"
                            value={this.state.newOrder ? (this.state.newOrder.quantity * this.state.newOrder.rate) : 0}
                          />
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
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
                    <Button bsStyle="success" fill icon pullRight onClick={this.validationCheckRequiredFields}>
                      <span className="fa fa-save" />
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

export default SalesModuleOrderModalComponent;