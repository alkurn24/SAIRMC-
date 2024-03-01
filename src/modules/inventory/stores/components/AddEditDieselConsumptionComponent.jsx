import React, { Component } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "components/CustomSelect/CustomSelect.jsx";
import "react-select/dist/react-select.css";

import { Row, Col, FormControl, FormGroup, ControlLabel, Tooltip, OverlayTrigger } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { errorColor } from 'variables/Variables.jsx';
import { getVehicleList } from "../../../transportermgmt/vehicle/server/VehicleServerComm.jsx";
import { getVendorList } from "modules/purchase/vendor/server/VendorServerComm.jsx";
import { getAssetList } from "../../../assetsmgmt/assets/server/AssetsServerComm.jsx";
import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import { getInventoryList } from "../server/StoresServerComm.jsx";
import { createMovement, getMovementSingle, updateMovement, } from "modules/movement/server/MovementServerComm.jsx";

class AddEditDieselConsumptionComponent extends Component {
  constructor() {
    super()
    this.state = {

      inventory: {
        notes: "",
        plantFrom: null,
        owner: null,
        invType: "",
        category: "Diesel",
        outQty: "",
        dieselCategory: "",
        material: "",
        vehicle: null,
        assetCategory: null,
        StoreCategory: null,
        description: "",
        status: "Open",
        movementType: "Outward",
        pumpCategory: "",
        code: "New",
        moduleName: "",
        customer: null,
        site: null,
        documents: [],
        inventoryData: []

      },
      assetList: [],
      vendorList: [],
      categoryList: [],
      inventorySettingList: [],
      plantList: [],
      inventoryData: [],
      vehicleList: [],
      alert: null,
      formError: null,
      materialError: false,
      plantFromError: false,
      categoryError: false,
      nameError: false,
      dieselCategoryError: false,
      outQtyError: false,
      materialValid: null,
      categoryValid: null,
      nameValid: null,
      dieselCategoryValid: null,
      plantFromValid: null,
      outQtyValid: null,

    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.handleShowResponse = this.handleShowResponse.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.save = this.save.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);

    ;
  }
  componentWillMount() {
    var _this = this;
    if (this.props.match.params.movementcode !== "new") {
      getMovementSingle(
        this.props.match.params.movementcode,
        (data) => {
          let tempMovement = JSON.parse(JSON.stringify(data));
          if (tempMovement.driver !== null) tempMovement.vehicle.driver = tempMovement.driver ? tempMovement.driver : "";

          if (tempMovement.assetCategory !== null) tempMovement.assetCategory.categories = tempMovement.pumpCategory ? tempMovement.pumpCategory : "";
          if (tempMovement.inventoryData.length) {
            for (var i = 0; i < tempMovement.inventoryData.length; i++) {
              tempMovement.material = tempMovement.inventoryData[i].inventory
              tempMovement.outQty = tempMovement.inventoryData[i].outQty
              tempMovement.notes = tempMovement.inventoryData[i].notes
            }
          }
          _this.setState({ inventory: tempMovement })
        },
        () => { }
      )
    }
    getVehicleList("",
      (data) => _this.setState({
        vehicleList: data.rows.map(prop => {
          return {
            id: prop.id,
            label: prop.vehicleNumber,
            value: prop.id,
            transpoter: prop.transpoter,
            driver: prop.driver.name
          }
        })
      }),
      () => _this.errorAlert("Something went wrong!")
    )
    getPlantList("",
      (data) => {
        _this.setState({
          plantList: data.rows.map(prop => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name
            }
          })
        })
      }
    );
    getAssetList("view=pump",
      (data) => _this.setState({
        assetList: data.rows.map(prop => {
          return {
            id: prop.id,
            label: prop.name,
            value: prop.id,
            categories: prop.category,
          }
        })
      }),
      () => _this.errorAlert("Something went wrong!")
    )
    getInventoryList("view=dg",
      (data) => _this.setState({
        categoryList: data.rows.map(prop => {
          return {
            id: prop.id,
            label: prop.name,
            value: prop.id,
          }
        })
      }),
      () => _this.errorAlert("Something went wrong!")
    )
    getInventoryList("view=consumable",
      (data) => _this.setState({
        inventorySettingList: data.rows.map(prop => {
          return {
            id: prop.id,
            label: prop.name,
            value: prop.id,
            unit: prop.unit
          }
        })
      }),
      () => _this.errorAlert("Something went wrong!")
    )
    getVendorList(
      "view=dropdown",
      (data) => _this.setState({ vendorList: data.rows }),
      () => { }
    )
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
  validationCheck() {
    this.state.inventory.material === "" ?
      this.setState({ materialError: "Select material type", materialValid: false }) :
      this.setState({ materialError: "", materialValid: true })
    this.state.inventory.plantFrom === null ?
      this.setState({ plantFromError: "Select source plant", plantFromValid: false }) :
      this.setState({ plantFromError: "", plantFromValid: true })
    this.state.inventory.dieselCategory === "" ?
      this.setState({ dieselCategoryError: "Select  diesel category", dieselCategoryValid: false }) :
      this.setState({ dieselCategoryError: "", dieselCategoryValid: true })
    this.state.inventory.outQty === "" ?
      this.setState({ outQtyError: "Enter liter", outQtyValid: false }) :
      this.setState({ outQtyError: "", outQtyValid: true })
    setTimeout(this.save, 10);
  }
  save() {
    var _this = this;
    let tempModule = JSON.parse(JSON.stringify(this.state.inventory));
    if (_this.state.materialValid && _this.state.dieselCategoryValid && _this.state.outQtyValid) {
      tempModule.inventoryData.push({
        inQty: 0,
        outQty: tempModule.outQty ? tempModule.outQty : "",
        notes: tempModule.notes ? tempModule.notes : "",
        unit: tempModule.material ? tempModule.material.unit : null,
        inventory: tempModule.material ? tempModule.material.id : null,
        inventoryType: "Store",
        stock: true,
      })
      tempModule.pumpCategory = tempModule.assetCategory ? tempModule.assetCategory.categories : null;
      tempModule.assetCategory = tempModule.assetCategory ? tempModule.assetCategory.id : null;
      tempModule.StoreCategory = tempModule.StoreCategory ? tempModule.StoreCategory.id : null;
      tempModule.driver = tempModule.vehicle ? tempModule.vehicle.driver : null;
      tempModule.vehicle = tempModule.vehicle ? tempModule.vehicle.id : null;
      tempModule.plantFrom = tempModule.plantFrom ? tempModule.plantFrom.id : null;

      if (tempModule.code !== "New") {
        updateMovement(tempModule,
          function success() {
            _this.successAlert("Diesel issued successfully!");
          },
          function error() {
            _this.errorAlert("Error in saving issue diesel.");
          }
        )
      }
      else {
        delete tempModule.code;
        delete tempModule.invType;
        delete tempModule.notes;
        delete tempModule.outQty;
        createMovement(tempModule,
          function success() {
            _this.successAlert("Diesel added successfully!");
            setTimeout(() => {
              _this.props.history.push("/inventory/stores");
            }, 2000);
          },
          function error(res) {
            if (res.message === 'Request failed with status code 701') { _this.errorAlert("Something went wrong!"); }
            else {
              _this.errorAlert("Something went wrong!")
            }
          }
        )
      }
    }
    else { this.setState({ formError: "Please enter required fields" }) }


  }

  handleCheckedChange(e) {
    var tempInventory = this.state.inventory;
    tempInventory[e.target.name] = e.target.checked;
    this.setState({ inventory: tempInventory, });
  }
  handleShowResponse() { this.setState({ showResponseModal: true }); }
  handleDropDownChange(selectOption, type) {
    var tempInventory = this.state.inventory;
    tempInventory[type] = selectOption ? selectOption : null;
    if (!this.state.categoryList) tempInventory.category = "";
    this.setState({ inventory: tempInventory });
  }

  handleCheckbox(e) {
    var newdata = this.state.inventory;
    newdata[e.target.name] = e.target.checked;
    this.setState({ inventory: newdata });
  }
  handleDateChange(name, date) {
    var inventory = this.state.inventory;
    inventory[name] = date._d;
    this.setState({ inventory });
  }
  handleInputChange(e) {
    var tempInventory = this.state.inventory;
    tempInventory[e.target.name] = e.target.value;
    this.setState({ inventory: tempInventory, [e.target.name + 'Valid']: true, formError: "" });
  }
  handleDropDownChangeHsn(e, param) {
    var newObj = this.state.inventory;
    if (!e.target) {
      newObj[param] = e;
      this.setState({ pricing: newObj, formError: null });
      e.id === "" || null ? this.setState({ assetsDetailsValid: false }) : this.setState({ assetsDetailsValid: true })
      if (param === "hsn") {

      }
    } else {
      if (e.target.name.indexOf("custom_") !== -1) {
        var key = parseInt(e.target.name.split("_")[1], 10);
        newObj.custom[key] = e.target.value;
        this.setState({ inventory: newObj });
      } else if (e.target.name.indexOf("radio_") !== -1) {
        newObj[e.target.name.split("_")[1]] = e.target.value;
        this.setState({ inventory: newObj });
      } else {
        if (e.target.type === "number") newObj[e.target.name] = parseFloat(e.target.value);
        else newObj[e.target.name] = e.target.value;
        this.setState({ inventory: newObj });
      }
    }
  }



  render() {
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const list = (<Tooltip id="list_tooltip">Movement list</Tooltip>);

    let form = (
      <Col xs={12}>
        <Col xs={12}>
          <Row>
            <Col xs={12} hidden={!this.state.inventory.code}>
              <FormGroup>
                {this.state.inventory.code !== "New" ?
                  <ControlLabel><b>Code:</b> {this.state.inventory ? this.state.inventory.number : null}</ControlLabel>
                  : null
                }
              </FormGroup>
            </Col>
            <Col xs={12} sm={4} md={3} lg={2}>
              {this.state.inventory.code === "New" ?
                <FormGroup>
                  <ControlLabel>Inventory Type<span className="star">*</span></ControlLabel>
                  <Select
                    disabled={this.state.inventory.code !== "New" ? true : false}
                    clearable={false}
                    placeholder="Select Inventory type"
                    name="material"
                    value={this.state.inventory.material ? this.state.inventory.material.id : null}
                    options={this.state.inventorySettingList}
                    onChange={(selectOption) => this.handleDropDownChange(selectOption, "material")}
                    style={{ color: this.state.materialValid || this.state.materialValid === null ? "" : errorColor, borderColor: this.state.materialValid || this.state.materialValid === null ? "" : errorColor }}
                  />
                </FormGroup>
                :
                <FormGroup>
                  <ControlLabel><b>Inventory Type:</b><br /> {this.state.inventory ? this.state.inventory.material.name : null}</ControlLabel>
                </FormGroup>
              }
            </Col>
            <Col xs={12} sm={6} md={2} lg={2}>
              {this.state.inventory.code === "New" ?
                <FormGroup>
                  <ControlLabel>Source Plant <span className="star">*</span></ControlLabel>
                  <Select
                    disabled={this.state.inventory.code !== "New" ? true : false}
                    clearable={false}
                    placeholder="Select source plant"
                    name="plantFrom"
                    value={this.state.inventory.plantFrom ? this.state.inventory.plantFrom.id : null}
                    options={this.state.plantList}
                    onChange={(selectOption) => this.handleDropDownChange(selectOption, "plantFrom")}
                    style={{ color: this.state.plantFromValid || this.state.plantFromValid === null ? "" : errorColor, borderColor: this.state.plantFromValid || this.state.plantFromValid === null ? "" : errorColor }}
                  />
                </FormGroup>
                :
                <FormGroup>
                  <ControlLabel><b>Source Plant:</b><br /> {this.state.inventory ? this.state.inventory.plantFrom.name : null}</ControlLabel>
                </FormGroup>
              }
            </Col>
            <Col xs={12} sm={6} md={2} lg={2} className="top">
              {this.state.inventory.code === "New" ?
                <FormGroup>
                  <ControlLabel> Issue To <span className="star">*</span> </ControlLabel>
                  <Select
                    disabled={this.state.inventory.code !== "New" ? true : false}
                    clearable={false}
                    placeholder="Select issue To"
                    name="dieselCategory"
                    value={this.state.inventory.dieselCategory ? this.state.inventory.dieselCategory : null}
                    options={
                      [
                        { value: "Vehicle", label: "Vehicle" },
                        { value: "Pump", label: "Pump" },
                        { value: "DG", label: "DG" },
                        { value: "Miscellaneous", label: "Miscellaneous" },
                      ]
                    }
                    onChange={(selectOption) => {
                      var tempInventory = this.state.inventory;
                      tempInventory.dieselCategory = selectOption ? selectOption.value : null;
                      this.setState({ tempInventory });
                    }}
                    style={{ color: this.state.dieselCategoryValid || this.state.dieselCategoryValid === null ? "" : errorColor, borderColor: this.state.dieselCategoryValid || this.state.dieselCategoryValid === null ? "" : errorColor }}

                  />
                </FormGroup>
                :
                <FormGroup>
                  <ControlLabel><b>Issue To:</b><br /> {this.state.inventory.dieselCategory ? this.state.inventory.dieselCategory : null}</ControlLabel>
                </FormGroup>
              }

            </Col>
            {this.state.inventory.dieselCategory === "Vehicle" ?
              <Col xs={12} sm={4} md={3} lg={3} >
                {this.state.inventory.code === "New" ?
                  <FormGroup>
                    <ControlLabel> Select Vehicle</ControlLabel>
                    <Select
                      disabled={this.state.inventory.code !== "New" ? true : false}
                      clearable={false}
                      placeholder="Select vehicle"
                      name="vehicle"
                      value={this.state.inventory.vehicle ? this.state.inventory.vehicle.id : null}
                      options={this.state.vehicleList}
                      onChange={(selectOption) => this.handleDropDownChange(selectOption, "vehicle")}
                    />
                  </FormGroup>
                  :
                  <FormGroup>
                    <ControlLabel><b>Vehicle:</b>  <br />{this.state.inventory.vehicle ? this.state.inventory.vehicle.vehicleNumber : null}</ControlLabel>
                  </FormGroup>
                }
              </Col>
              : null
            }
            {this.state.inventory.dieselCategory === "Vehicle" ?
              this.state.inventory.vehicle !== null ?
                <Col xs={12} sm={4} md={2} lg={2} >
                  {this.state.inventory.code === "New" ?
                    <FormGroup>
                      <ControlLabel>Driver</ControlLabel>
                      <FormControl
                        value={this.state.inventory.vehicle ? this.state.inventory.vehicle.driver : ""}
                      ></FormControl>
                    </FormGroup>
                    :
                    <FormGroup>
                      <ControlLabel><b>Driver:</b><br /> {this.state.inventory.vehicle ? this.state.inventory.vehicle.driver : ""}</ControlLabel>
                    </FormGroup>
                  }
                </Col>
                : null
              : null
            }
            {this.state.inventory.dieselCategory === "Pump" ?
              <div>
                <Col xs={12} sm={4} md={3} lg={3}>
                  {this.state.inventory.code === "New" ?
                    <FormGroup>
                      <ControlLabel>Select Pump</ControlLabel>
                      <Select
                        disabled={this.state.inventory.code !== "New" ? true : false}
                        clearable={false}
                        placeholder="Select pump"
                        name="assetCategory"
                        value={this.state.inventory.assetCategory ? this.state.inventory.assetCategory.id : ""}
                        options={this.state.assetList}
                        onChange={(selectOption) => this.handleDropDownChange(selectOption, "assetCategory")}
                      />
                    </FormGroup>
                    :
                    <FormGroup>
                      <ControlLabel><b>Pump:</b> <br /> {this.state.inventory.assetCategory ? this.state.inventory.assetCategory.name : ""}</ControlLabel>
                    </FormGroup>
                  }
                </Col>
                <Col xs={12} sm={4} md={2} lg={2}>
                  {this.state.inventory.code === "New" ?
                    this.state.inventory.assetCategory !== "" ?
                      <FormGroup>
                        <ControlLabel>Category</ControlLabel>
                        <FormControl
                          disabled
                          placeholder="Enter category"
                          value={this.state.inventory.assetCategory ? this.state.inventory.assetCategory.categories : ""}
                        ></FormControl>
                      </FormGroup>
                      : null
                    :
                    <FormGroup>
                      <ControlLabel><b>Category:</b> <br />{this.state.inventory.assetCategory ? this.state.inventory.assetCategory.categories : ""} </ControlLabel>

                    </FormGroup>
                  }
                </Col>
              </div>
              :
              null
            }
            {this.state.inventory.dieselCategory === "DG" ?
              <Col xs={12} sm={4} md={3} lg={3}>
                {this.state.inventory.code === "New" ?
                  <FormGroup>
                    <ControlLabel>Select DG</ControlLabel>
                    <Select
                      disabled={this.state.inventory.code !== "New" ? true : false}
                      clearable={false}
                      placeholder="Select Dg"
                      name="StoreCategory"
                      value={this.state.inventory.StoreCategory ? this.state.inventory.StoreCategory.id : ""}
                      options={this.state.categoryList}
                      onChange={(selectOption) => this.handleDropDownChange(selectOption, "StoreCategory")}
                    />
                  </FormGroup>
                  :
                  <FormGroup>
                    <ControlLabel><b>DG:</b> <br /> {this.state.inventory.StoreCategory ? this.state.inventory.StoreCategory.name : ""}</ControlLabel>
                  </FormGroup>
                }
              </Col>
              : null
            }
            <Col xs={12} sm={4} md={2} lg={2}>
              {this.state.inventory.code === "New" ?
                <FormGroup>
                  <ControlLabel>LTR <span className="star">*</span></ControlLabel>
                  <FormControl
                    disabled={this.state.inventory.code !== "New" ? true : false}
                    name="outQty"
                    type="text"
                    placeholder="Enter LTR"
                    value={this.state.inventory.outQty}
                    onChange={this.handleInputChange}
                    className={this.state.outQtyValid || this.state.outQtyValid === null ? "" : "error"}
                  />
                </FormGroup>
                :
                <FormGroup>
                  <ControlLabel><b>LTR: </b> <br />{this.state.inventory.outQty}</ControlLabel>
                </FormGroup>
              }
            </Col>
            {this.state.inventory.dieselCategory === "Miscellaneous" ?
              <Col xs={12} sm={12} md={6} lg={6}>
                {this.state.inventory.code === "New" ?
                  <FormGroup>
                    <ControlLabel>Description:</ControlLabel>
                    <textarea
                      disabled={this.state.inventory.code !== "New" ? true : false}
                      className="form-control"
                      name="description"
                      type="text"
                      placeholder="Description"
                      value={this.state.inventory.Description}
                      onChange={this.handleInputChange}
                    >
                    </textarea>
                  </FormGroup>
                  :
                  <FormGroup>
                    <ControlLabel><b> Description:</b><br /> {this.state.inventory.Description}</ControlLabel>
                  </FormGroup>
                }
              </Col>
              : null
            }
            <Col xs={12} sm={12} md={this.state.inventory.dieselCategory === "Vehicle" || this.state.inventory.dieselCategory === "Pump" ? 4 : 6} lg={this.state.inventory.dieselCategory === "Vehicle" || this.state.inventory.dieselCategory === "Pump" ? 4 : 6}>
              {this.state.inventory.code === "New" ?
                <FormGroup>
                  <ControlLabel>Notes:</ControlLabel>
                  <textarea
                    disabled={this.state.inventory.code !== "New" ? true : false}
                    className="form-control"
                    name="notes"
                    type="text"
                    placeholder="Notes"
                    value={this.state.inventory.Notes}
                    onChange={this.handleInputChange}
                  >
                  </textarea>
                </FormGroup>
                :
                <FormGroup>
                  <ControlLabel><b> Notes:</b><br /> {this.state.inventory.Notes}</ControlLabel>
                </FormGroup>
              }
            </Col>

          </Row>
        </Col>

      </Col>
    );
    let actions = (
      <Col xs={12}>
        <center><h5 className="text-danger">{this.state.formError}</h5></center>
        <OverlayTrigger placement="top" overlay={back}>
          <Button bsStyle="warning" fill icon onClick={() => this.props.history.push('/inventory/stores')} ><span className="fa fa-arrow-left"></span></Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={list}>
          <Button bsStyle="primary" fill icon onClick={() => this.props.history.push('/inventory/stores')}><span className="fa fa-list"></span></Button>
        </OverlayTrigger>
        {this.state.inventory.code === "New" ?
          <OverlayTrigger placement="top" overlay={save}>
            <Button bsStyle="success" fill icon pullRight onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
          </OverlayTrigger>
          : null
        }
      </Col>
    )

    return (
      <Row className="card-content">
        {this.state.alert}
        <div className="card-form ">{form}</div>
        <div className="card-footer">{actions}</div>
      </Row>
    );
  }
}

export default AddEditDieselConsumptionComponent;