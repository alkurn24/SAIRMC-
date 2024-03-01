import React, { Component } from "react";
import Select from "components/CustomSelect/CustomSelect.jsx";
import Switch from "react-switch";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from "react-bootstrap-sweetalert";
import { Row, Col, FormGroup, FormControl, ControlLabel, Tooltip, OverlayTrigger } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import { errorColor } from 'variables/appVariables.jsx';

import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import { getAssetList } from "modules/assetsmgmt/assets/server/AssetsServerComm.jsx";
import { getInventoryList } from "modules/inventory/stores/server/StoresServerComm.jsx";
import { getCustomerList } from "modules/crm/customers/server/CustomerServerComm.jsx";
import { getAddressList } from "modules/common/addresses/server/AddressesServerComm.jsx";
import { getUserList } from "modules/settings/usermgmt/server/UserServerComm.jsx";
import { getDispatchList } from "../../sales/dispatches/server/DispatchServerComm";
import { createMovement, getMovementSingle, updateMovement, getMovementList, downloadMovementReport } from "modules/movement/server/MovementServerComm.jsx";


class AddEditMovementComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movement: {
        status: "Open",
        movementType: "Outward",
        code: "New",
        moduleName: "",
        category: null,
        owner: null,
        _movement: null,
        plantFrom: null,
        dispatch: null,
        plantTo: null,
        customer: null,
        site: null,
        inventoryData: []
      },
      plantList: [],
      movementList: [],
      addressList: [],
      inventoryList: [],
      assetList: [],
      plantData: [],
      dispatchList: [],
      customerList: [],
      userList: [],
      categoryError: false,
      ownerError: false,
      plantFromError: false,
      plantToError: false,
      customerError: false,
      siteError: false,
      dispatchError: false,
      categoryValid: null,
      plantFromValid: null,
      plantToValid: null,
      customerValid: null,
      siteValid: null,
      dispatchVaild: null,
      ownerValid: null,

    }
    this.validationCheck = this.validationCheck.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleDropDownChangeMovement = this.handleDropDownChangeMovement.bind(this);
    this.handleInputChangeCustomer = this.handleInputChangeCustomer.bind(this);
    this.renderDropDown = this.renderDropDown.bind(this);
    this.renderDropDownInward = this.renderDropDownInward.bind(this);
    this.handleCloseMovement = this.handleCloseMovement.bind(this);
    this.renderText = this.renderText.bind(this);
    this.renderNumber = this.renderNumber.bind(this);
    this.renderCheckbox = this.renderCheckbox.bind(this);
    this.renderDropDownType = this.renderDropDownType.bind(this);
    this.printReport = this.printReport.bind(this);
  }
  componentWillMount() {
    let _this = this;
    //this.fetchAddresses();
    if (this.props.match.params.movementcode !== "new") {
      getMovementSingle(
        this.props.match.params.movementcode,
        (data) => {
          let tempMovement = JSON.parse(JSON.stringify(data));

          tempMovement.owner.id = tempMovement.owner._id;
          if (tempMovement.plantFrom.id !== undefined) {
            for (var i = 0; i < tempMovement.inventoryData.length; i++) {
              tempMovement.inventoryData[i].inventory.stdQty = tempMovement.inventoryData[i].inventory.stock[0].standardQty
            }
          }
          else {
            this.fetchPlantData(tempMovement.plantFrom.id)
          }
          if (tempMovement.customer !== undefined) {
            this.fetchAddresses(tempMovement.customer.id)
          }
          _this.setState({ movement: tempMovement })
        },
        () => { }
      )
    }

    getPlantList(
      "",
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
    getDispatchList("",
      (data) => {
        _this.setState({
          dispatchList: data.rows.map(prop => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.number
            }
          })
        })
      }
    );
    getCustomerList("",
      (data) => {
        _this.setState({
          customerList: data.rows.map(prop => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name
            }
          })
        })
      }
    );
    getInventoryList(
      "",
      (data) => {
        _this.setState({
          inventoryList: data.rows.map(prop => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name,
              stdQty: prop.stock ? prop.stock[0].standardQty : "",
            }
          })
        })
      }
    );
    getAssetList("",
      (data) => {
        _this.setState({
          assetList: data.rows.map(prop => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name,
              stdQty: prop.stock ? prop.stock[0].standardQty : "",
            }
          })
        })
      }
    );

    getUserList("view=user",
      function success(data) {
        _this.setState({
          userList: data.rows
        })
      },
    )
    getMovementList(("movementType=Outward&returnable=true"),
      (data) => {
        let tempData = data.rows.map(prop => {
          return {
            id: prop.id,
            value: prop.id,
            label: prop.number,

          }
        })
        _this.setState({ movementList: tempData, })
      }
    );
    getMovementList(("movementType=Outward&returnable=true"),
      (data) => {
        let tempData = data.rows.map(prop => {
          return {
            id: prop.id,
            value: prop.id,
            label: prop.number,
          }
        })
        _this.setState({ movementList: tempData, })
      }
    );
  }

  fetchPlantData(plantId) {
    let _this = this;
    getInventoryList(
      "",
      (data => {
        let tempData = [];
        tempData = data.rows.map(prop => {
          return {
            id: prop.id,
            value: prop.id,
            label: prop.name,
            stdQty: prop.stock ? prop.stock : "",
          }
        })
        tempData.map(s => {
          for (var i = 0; i < s.stdQty.length; i++) {
            if (plantId === s.stdQty[i].plant.id) {
              s.stdQty = s.stdQty[i].standardQty
            }
          }
        })
        _this.setState({ plantData: tempData })
      }),


    );
  }
  fetchAddresses(id) {
    var _this = this;
    _this.setState({ addressList: [] })
    getAddressList("customer=" + id,
      (res) => _this.setState({
        addressList: res.rows.map(prop => {
          return ({
            id: prop.id,
            value: prop.id,
            type: prop.type,
            label: prop.name,
            street_address: prop.street_address,
            city: prop.city,
            state: prop.state
          })
        })
      }),
      () => { }
    )

  }
  printReport(code) {
    downloadMovementReport(code,
      null,
      (res) => {
        // DO NOT DELETE - method 1
        // const url = window.URL.createObjectURL(new Blob([res.data]));
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', code + '.pdf');
        // document.body.appendChild(link);
        // link.click();

        // DO NOT DELETE - method 2
        // Create a Blob from the PDF Stream
        const file = new Blob([res.data], { type: 'application/pdf' });

        // Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        // Open the URL on new Window
        window.open(fileURL, '_blank');
      },
      (error) => {
      }
    )
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
    let tempObj = this.state.movement;
    tempObj.inventoryData.splice(id, 1);
    this.setState({ tempObj });
    this.successAlert("Material deleted successfully!")

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


  handleCloseMovement() {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => {
            let tempModule = this.state.movement;
            let tempStatus = this.state.moduleName;
            tempModule.status = "Close";
            tempStatus = "Movement closed"
            this.setState({ tempModule })
            this.setState({ tempStatus })
            this.validationCheck();
          }}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="info"
          confirmBtnText="Yes, close it!"
          cancelBtnText="Cancel"
          showCancel
        >
          Do you want to close this?
        </SweetAlert>
      )
    });
  }
  validationCheck() {

    this.state.movement.category === null ?
      this.setState({ categoryError: "Select catergory name", categoryValid: false }) :
      this.setState({ categoryError: "", categoryValid: true })
    this.state.movement.owner === null ?
      this.setState({ ownerError: "Select owner name", ownerValid: false }) :
      this.setState({ ownerError: "", ownerValid: true })
    this.state.movement.plantFrom === null ?
      this.setState({ plantFromError: "Select source plant", plantFromValid: false }) :
      this.setState({ plantFromError: "", plantFromValid: true })
    this.state.movement.plantTo === null ?
      this.setState({ plantToError: "Select destination plant", plantToValid: false }) :
      this.setState({ plantToError: "", plantToValid: true })
    this.state.movement.customer === null ?
      this.setState({ customerError: "Select customer name", customerValid: false }) :
      this.setState({ customerError: "", customerValid: true })
    this.state.movement.site === null ?
      this.setState({ siteError: "Select  site address", siteValid: false }) :
      this.setState({ siteError: "", siteValid: true })
    this.state.movement.dispatch === null ?
      this.setState({ dispatchError: "Select dispatch ", dispatchVaild: false }) :
      this.setState({ dispatchError: "", dispatchVaild: true })
    setTimeout(this.save, 10);
  }
  save() {
    let _this = this;
    let checkValidation;
    let tempMovement = JSON.parse(JSON.stringify(this.state.movement));
    let tempStatus = this.state.moduleName;
    if (tempMovement.status === "Close") { tempStatus = "Colse Movement saved" }
    if (_this.state.categoryValid && _this.state.ownerValid) {
      if (tempMovement.category === "Move to Plant") {
        checkValidation = (_this.state.categoryValid && _this.state.ownerValid && _this.state.plantFromValid && _this.state.plantToValid)
      }
      else if (tempMovement.category === "Move to Site") {
        checkValidation = (_this.state.categoryValid && _this.state.ownerValid && _this.state.customerValid && _this.state.siteValid && _this.state.plantFromValid)
      }
      else if (tempMovement.category === "Move to Self") {
        checkValidation = (_this.state.categoryValid && _this.state.ownerValid && _this.state.plantFromValid)
      }
      else if (tempMovement.category === "Move to Self" || tempMovement.category === "Wastage" || tempMovement.category === "Move to Plant" || tempMovement.category === "Move From Plant" || tempMovement.category === "Move From Site") {
        checkValidation = (_this.state.categoryValid && _this.state.ownerValid && _this.state.plantFromValid)
      }
      else if (tempMovement.category === "SAIRMC Issue") {
        checkValidation = (_this.state.categoryValid && _this.state.ownerValid && _this.state.plantFromValid && _this.state.dispatchVaild)
      }
      else if (tempMovement.category === "Vendor to Plant") {
        checkValidation = (_this.state.categoryValid && _this.state.ownerValid && _this.state.plantToValid)
      }
      if (checkValidation) {
        tempMovement.owner = tempMovement.owner ? tempMovement.owner.id : null;
        tempMovement._movement = tempMovement._movement ? tempMovement._movement.id : null;
        tempMovement.plantFrom = tempMovement.plantFrom ? tempMovement.plantFrom.id : null;
        tempMovement.dispatch = tempMovement.dispatch ? tempMovement.dispatch.id : null;
        tempMovement.plantTo = tempMovement.plantTo ? tempMovement.plantTo.id : null;
        tempMovement.customer = tempMovement.customer ? tempMovement.customer.id : null;
        tempMovement.site = tempMovement.site ? tempMovement.site.id : null;

        if (tempMovement.inventoryData.length > 0) {
          for (let i = 0; i < tempMovement.inventoryData.length; i++) {
            if (tempMovement.inventoryData[i].inventory === null) {
              this.setState({ formError: "Please select material name" })
            }
            else {
              this.setState({ formError: "" })
              tempMovement.inventoryData[i].inventory = tempMovement.inventoryData[i].inventory ? tempMovement.inventoryData[i].inventory.id : null;
              tempMovement.inventoryData[i].asset = tempMovement.inventoryData[i].asset ? tempMovement.inventoryData[i].asset.id : null;

              tempMovement.inventoryData[i].inventoryType = tempMovement.inventoryData[i].inventoryType ? tempMovement.inventoryData[i].inventoryType.label : null;
              if (i + 1 === tempMovement.inventoryData.length) {

                if (this.props.match.params.movementcode === "new") {
                  delete tempMovement.code;
                  createMovement(tempMovement,
                    function success(res) {
                      console.log("status=" + res);
                      _this.successAlert("Movement added successfully!");
                      setTimeout(() => {
                        _this.props.history.push("/movements/movement");
                      }, 2000);
                    },
                    function error(res) {
                      if (res.message === 'Request failed with status code 701') { _this.errorAlert("Error"); }
                      else {
                        _this.errorAlert("Something went wrong!")
                      }
                    }
                  )
                } else {
                  updateMovement(tempMovement,
                    function success(data) {
                      _this.successAlert(tempStatus + " successfully!");
                      setTimeout(() => {
                        _this.props.history.push("/movements/movement");
                      }, 2000);
                    },
                    function error(data) {
                      _this.errorAlert("Error in saving movement.");
                    }
                  )
                }

              }
            }
          }
        }
        else {
          _this.setState({ formError: "Please enter material details" })
        }
      }
      else {
        _this.setState({ formError: "Please enter required fields" })
      }
    }
    else {
      _this.setState({ formError: "Please enter required fields" })
    }
  }
  handleDropDownChangeMovement(selectOption, type) {
    var tempMovement = this.state.movement;
    tempMovement[type] = selectOption;
    this.setState({ tempMovement });
  }

  handleDropDownPlantChange(selectOption, type) {
    var tempMovement = this.state.movement;
    tempMovement[type] = selectOption ? selectOption : null;
    if (selectOption !== undefined) this.fetchPlantData(selectOption.id);
    this.setState({ tempMovement });
  }
  handleDropDownChange(selectOption, type) {
    var tempMovement = this.state.movement;
    tempMovement[type] = selectOption;
    this.setState({ tempMovement });
  }
  handleInputChangeCustomer(e, param) {
    var newObj = this.state.movement;
    if (!e.target) {
      newObj[param] = e;
      this.setState({ pricing: newObj, formError: null });
      if (param === "customer") {
        this.fetchAddresses(e.id);
      }
      else if ((param === "plantTo")) {
        this.fetchInventoryData(e.id);
      }
    }
  }
  renderDropDownType(row) {
    return (
      <FormGroup>
        {this.state.movement.code === "New" ?
          <Select
            disabled={this.props.match.params.movementcode !== "new" ? true : false}
            clearable={false}
            placeholder="Select Inventory Type"
            name="inventoryType"
            value={this.state.movement.inventoryData[row.index].inventoryType ? this.state.movement.inventoryData[row.index].inventoryType : null}
            options={[
              { value: "Store", label: "Store" },
              { value: "Asset", label: "Asset" },
            ]}
            onChange={(selectOption) => {
              var tempMovement = this.state.movement;
              tempMovement.inventoryData[row.index].inventoryType = selectOption ? selectOption.value : null;
              tempMovement.inventoryData[row.index].inventory = "";
              this.setState({ tempMovement });
            }}
          />
          :
          <ControlLabel> {this.state.movement.inventoryData[row.index].inventoryType ? this.state.movement.inventoryData[row.index].inventoryType : null} </ControlLabel>
        }
      </FormGroup>
    )
  }
  renderDropDown(row) {
    if (this.state.movement.inventoryData[row.index].inventoryType !== undefined) {
      return (
        <FormGroup>
          {this.state.movement.inventoryData[row.index].inventoryType === "Store" ?
            this.state.movement.code === "New" ?
              (<Select
                disabled={this.props.match.params.movementcode !== "new" ? true : false}
                clearable={false}
                placeholder="Select material"
                name="inventoty"
                value={this.state.movement.inventoryData[row.index].inventory ? this.state.movement.inventoryData[row.index].inventory.id : null}
                options={this.state.inventoryList}
                onChange={(selectOption) => {
                  var tempMovement = this.state.movement;
                  tempMovement.inventoryData[row.index].inventory = selectOption ? selectOption : null;
                  this.setState({ tempMovement });
                }}
              />)
              :
              <ControlLabel> {this.state.movement.inventoryData[row.index].inventory ? this.state.movement.inventoryData[row.index].inventory.name : null} </ControlLabel>
            :
            this.state.movement.code === "New" ?
              (<Select
                disabled={this.props.match.params.movementcode !== "new" ? true : false}
                clearable={false}
                placeholder="Select material"
                name="asset"
                value={this.state.movement.inventoryData[row.index].asset ? this.state.movement.inventoryData[row.index].asset.id : null}
                options={this.state.assetList}
                onChange={(selectOption) => {
                  var tempMovement = this.state.movement;
                  tempMovement.inventoryData[row.index].asset = selectOption ? selectOption : null;
                  this.setState({ tempMovement });
                }}
              />)
              :
              <ControlLabel> {this.state.movement.inventoryData[row.index].asset ? this.state.movement.inventoryData[row.index].asset.name : null} </ControlLabel>

          }
        </FormGroup>
      )
    }
    else {
      return (<div>-</div>)
    }
  }
  renderDropDownInward(row) {
    return (
      <FormGroup>
        {this.state.movement.inventoryData[row.index].inventoryType.label === "Store" ?
          this.state.movement.code === "New" ?
            <Select
              disabled={this.props.match.params.movementcode !== "new" ? true : false}
              clearable={false}
              placeholder="Select material"
              name="inventoty"
              value={this.state.movement.inventoryData[row.index].inventory ? this.state.movement.inventoryData[row.index].inventory.id : null}
              options={
                this.props.match.params.movementcode !== "new" ?
                  this.state.inventoryList
                  :
                  this.state.plantData}
              onChange={(selectOption) => {
                var tempMovement = this.state.movement;
                tempMovement.inventoryData[row.index].inventory = selectOption ? selectOption : null;
                this.setState({ tempMovement });
              }}
            />
            :
            <ControlLabel> {this.state.movement.inventoryData[row.index].inventory ? this.state.movement.inventoryData[row.index].inventory.name : null} </ControlLabel>
          :
          this.state.movement.code === "New" ?
            <Select
              disabled={this.props.match.params.movementcode !== "new" ? true : false}
              clearable={false}
              placeholder="Select material"
              name="asset"
              value={this.state.movement.inventoryData[row.index].asset ? this.state.movement.inventoryData[row.index].asset.id : null}
              options={this.state.assetList}
              onChange={(selectOption) => {
                var tempMovement = this.state.movement;
                tempMovement.inventoryData[row.index].asset = selectOption ? selectOption : null;
                this.setState({ tempMovement });
              }}
            />
            :
            <ControlLabel> {this.state.movement.inventoryData[row.index].asset ? this.state.movement.inventoryData[row.index].asset.name : null} </ControlLabel>

        }
      </FormGroup>
    )
  }
  renderText(cellInfo) {
    return (
      <FormGroup>
        {this.state.movement.code === "New" ?
          <FormControl
            disabled={this.props.match.params.movementcode !== "new" ? true : false}
            componentClass="textarea"
            name="notes"
            type="text"
            rows={2}
            placeholder="Enter notes"
            value={this.state.movement.inventoryData[cellInfo.index] ? this.state.movement.inventoryData[cellInfo.index][cellInfo.column.id] : ""}
            onChange={(e) => {
              var tempMovement = this.state.movement;
              tempMovement.inventoryData[cellInfo.index][cellInfo.column.id] = e ? e.target.value : null;
              this.setState({ tempMovement });
            }}
          />
          :
          <ControlLabel> {this.state.movement.inventoryData[cellInfo.index] ? this.state.movement.inventoryData[cellInfo.index][cellInfo.column.id] : ""} </ControlLabel>
        }
      </FormGroup>
    )
  }

  renderNumber(cellInfo) {
    return (
      <div>
        {this.state.movement.code === "New" ?
          <FormGroup>
            <FormControl
              disabled={this.props.match.params.movementcode !== "new" ? true : false}
              type="number"
              min={0}
              value={this.state.movement.inventoryData[cellInfo.index] ? this.state.movement.inventoryData[cellInfo.index][cellInfo.column.id] : 0}
              onChange={(e) => {
                var tempMovement = this.state.movement;
                tempMovement.inventoryData[cellInfo.index][cellInfo.column.id] = e ? e.target.value : null;
                this.setState({ tempMovement });
              }}
            />
          </FormGroup>
          :
          <FormGroup>
            <ControlLabel> {this.state.movement.inventoryData[cellInfo.index] ? this.state.movement.inventoryData[cellInfo.index][cellInfo.column.id] : 0}</ControlLabel>
          </FormGroup>
        }
      </div>
    )
  }
  renderCheckbox(cellInfo) {
    return (
      <FormGroup className="text-center">
        <input
          type="checkBox"
          disabled={this.props.match.params.movementcode !== "new" ? true : false}
          checked={this.state.movement.inventoryData[cellInfo.index] ? this.state.movement.inventoryData[cellInfo.index][cellInfo.column.id] : null}
          onChange={(e) => {
            var tempMovement = this.state.movement;
            tempMovement.inventoryData[cellInfo.index][cellInfo.column.id] = e ? e.target.checked : null;
            this.setState({ tempMovement });
          }}
        />
      </FormGroup>
    )
  }
  render() {
    var adminCondition = (cookie.load("role"));
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const close = (<Tooltip id="close_tooltip">Close movement</Tooltip>);
    const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const add = (<Tooltip id="back_tooltip">Add new material</Tooltip>);
    const trash = (<Tooltip id="edit_tooltip">Delete</Tooltip>);
    const list = (<Tooltip id="list_tooltip">Movement list</Tooltip>);
    const print = (<Tooltip id="edit_tooltip">Print</Tooltip>);

    var srNoCol = { Header: "Sr", accessor: "sr", width: 50, Cell: (row) => { return (<div>{row.index + 1}</div>) } };
    var inventoryTypeCol = { Header: "Inventory Type", accessor: "inventoryType", Cell: this.renderDropDownType };
    var materialCol = { Header: "Material", accessor: "inventory", Cell: this.renderDropDown };
    var materialInwardCol = { Header: "Material", accessor: "inventory", Cell: this.renderDropDownInward };
    var notesCol = { Header: "Notes", accessor: "notes", width: 300, Cell: this.renderText };
    var outQtyCol = { Header: "Out Qty", accessor: "outQty", width: 150, Cell: this.renderNumber };
    var inQtyCol = { Header: "In Qty", accessor: "inQty", width: 150, Cell: this.renderNumber };
    var actualQtyCol = { Header: "Qty In Stock", accessor: "inventory.stdQty", width: 150, };
    var returnableCol = { Header: "Returnable", accessor: "returnable", width: 100, Cell: this.renderCheckbox };
    var stockUpdateCol = { Header: "Stock Update", accessor: "stock", width: 100, Cell: this.renderCheckbox };
    var actionsCol = {
      Header: "", accessor: "_id", width: 30,
      Cell: (row => {
        return (
          <div className="actions-right">
            {/* {this.props.match.params.movementcode !== "new" ?
              <OverlayTrigger placement="top" overlay={print}>
                <Button className="btn-list" bsStyle="primary" fill icon pullRight onClick={() => this.printReport(this.state.movement.code)}><span className="fa fa-download text-default"></span></Button>
              </OverlayTrigger>
              : null
            } */}
            {cookie.load('role') === "admin" ?
              <OverlayTrigger placement="top" overlay={trash}>
                <Button className="btn-list actions-right" bsStyle="danger"
                  disabled={this.props.match.params.movementcode !== "new" ? true : false}
                  fill icon onClick={() => this.delete(row.index)} ><span className="fa fa-trash text-danger"></span></Button>
              </OverlayTrigger>
              : null
            }
          </div>
        )
      }),
    }

    let form = (
      <Col xs={12}>
        <Col xs={12} sm={6} md={4} lg={2}>
          {this.state.movement.code === "New" ?
            <FormGroup>
              <ControlLabel>Movement Type</ControlLabel><br />
              <Switch
                disabled={this.props.match.params.movementcode !== "new" ? true : false}
                onChange={(checked) => {
                  var tempMovement = this.state.movement;
                  tempMovement.movementType = checked ? "Outward" : "Inward";
                  this.setState({ tempMovement });

                }}
                checked={this.state.movement.movementType === "Outward" ? true : false}
                className="react-switch"
                width={125}
                uncheckedIcon={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      fontSize: 14,
                      color: "white",
                      paddingRight: 50
                    }}>Inward
                </div>
                }
                checkedIcon={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      fontSize: 14,
                      color: "white",
                      paddingLeft: 50
                    }}>Outward
                </div>
                }
              />
            </FormGroup>
            :
            <FormGroup>
              <ControlLabel><b>Movement Type:</b> <br />{this.state.movement.movementType ? this.state.movement.movementType : ""}</ControlLabel>
            </FormGroup>
          }
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          {this.state.movement.code === "New" ?
            <FormGroup>
              <ControlLabel>Category <span className="star">*</span> </ControlLabel>
              <Select
                disabled={this.props.match.params.movementcode !== "new" ? true : false}
                clearable={false}
                placeholder="Select category"
                name="category"
                value={this.state.movement.category ? this.state.movement.category : null}
                options={
                  this.state.movement.movementType === "Inward"
                    ? [
                      { value: "Move From Plant", label: "Move From Plant" },
                      { value: "Vendor to Plant", label: "Vendor to Plant" },
                      { value: "Move From Site", label: "Move From Site" },
                      { value: "SAIRMC Issue", label: "SAIRMC Issue" },
                    ] : [
                      { value: "Move to Plant", label: "Move to Plant" },
                      { value: "Move to Site", label: "Move to Site" },
                      { value: "Move to Self", label: "Move to Self" },
                      { value: "Wastage", label: "Wastage" },
                      { value: "SAIRMC Issue", label: "SAIRMC Issue" },
                    ]
                }
                onChange={(selectOption) => {
                  var tempMovement = this.state.movement;
                  tempMovement.category = selectOption.value;
                  this.setState({ tempMovement });
                }}
                style={{ color: this.state.categoryValid || this.state.categoryValid === null ? "" : errorColor, borderColor: this.state.categoryValid || this.state.categoryValid === null ? "" : errorColor }}

              />
            </FormGroup>
            :
            <FormGroup>
              <ControlLabel><b> Category:</b><br />{this.state.movement.category ? this.state.movement.category : ""}</ControlLabel>
            </FormGroup>
          }
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          {this.state.movement.code === "New" ?
            <FormGroup>
              <ControlLabel>Owner <span className="star">*</span> </ControlLabel>
              <Select
                disabled={this.props.match.params.movementcode !== "new" ? true : false}
                clearable={false}
                placeholder="Select owner"
                name="owner"
                value={this.state.movement.owner ? this.state.movement.owner.id : null}
                options={this.state.userList}
                onChange={(selectOption) => this.handleDropDownChange(selectOption, "owner")}
                style={{ color: this.state.ownerValid || this.state.ownerValid === null ? "" : errorColor, borderColor: this.state.ownerValid || this.state.ownerValid === null ? "" : errorColor }}
              />
            </FormGroup>
            :
            <FormGroup>
              <ControlLabel><b> Owner:</b><br />{this.state.movement.owner ? this.state.movement.owner.name : ""}</ControlLabel>
            </FormGroup>
          }

        </Col>
        {this.state.movement.code !== "New" ?
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel><b> Status:</b><br />{this.state.movement.status ? this.state.movement.status : ""}</ControlLabel>
            </FormGroup>
          </Col>
          : null
        }
        {
          this.state.movement.category === "SAIRMC Issue"
            ? (
              <Col xs={12} sm={6} md={3} lg={3}>
                {this.state.movement.code === "New" ?
                  <FormGroup>
                    <ControlLabel>Dispatch <span className="star">*</span></ControlLabel>
                    <Select
                      disabled={this.props.match.params.movementcode !== "new" ? true : false}
                      clearable={false}
                      placeholder="Select dispatch"
                      name="dispatch"
                      value={this.state.movement.dispatch ? this.state.movement.dispatch.id : null}
                      options={this.state.dispatchList}
                      onChange={(selectOption) => this.handleDropDownChange(selectOption, "dispatch")}
                      style={{ color: this.state.ownerValid || this.state.ownerValid === null ? "" : errorColor, borderColor: this.state.ownerValid || this.state.ownerValid === null ? "" : errorColor }}

                    />
                  </FormGroup>
                  :
                  <FormGroup>
                    <ControlLabel><b>Dispatch:</b><br /> {this.state.movement.dispatch ? this.state.movement.dispatch.number : null}</ControlLabel>
                  </FormGroup>
                }
              </Col>
            ) : null
        }
        <Row>
          <Col xs={12}>
            {
              this.state.movement.category && this.state.movement.category !== "Vendor to Plant"
                ? (
                  <Col xs={12} sm={6} md={2} lg={2}>
                    {this.state.movement.code === "New" ?
                      <FormGroup>
                        <ControlLabel>Source Plant <span className="star">*</span></ControlLabel>
                        <Select
                          disabled={this.props.match.params.movementcode !== "new" ? true : false}
                          clearable={false}
                          placeholder="Select source plant"
                          name="plantFrom"
                          value={this.state.movement.plantFrom ? this.state.movement.plantFrom.id : null}
                          options={this.state.plantList}
                          onChange={(selectOption) => this.handleDropDownPlantChange(selectOption, "plantFrom")}
                          style={{ color: this.state.plantFromValid || this.state.plantFromValid === null ? "" : errorColor, borderColor: this.state.plantFromValid || this.state.plantFromValid === null ? "" : errorColor }}

                        />
                      </FormGroup>
                      :

                      <FormGroup>
                        <ControlLabel><b>Source Plant:</b> <br /> {this.state.movement.plantFrom ? this.state.movement.plantFrom.name : null}</ControlLabel>
                      </FormGroup>
                    }
                  </Col>
                ) : null
            }
            {
              this.state.movement.category && (this.state.movement.category === "Move to Plant" || this.state.movement.category === "Vendor to Plant")
                ? (
                  <Col xs={12} sm={6} md={3} lg={3}>
                    {this.state.movement.code === "New" ?
                      <FormGroup>
                        <ControlLabel>Destination Plant <span className="star">*</span></ControlLabel>
                        <Select
                          disabled={this.props.match.params.movementcode !== "new" ? true : false}
                          clearable={false}
                          placeholder="Select destination plant"
                          name="plantTo"
                          value={this.state.movement.plantTo ? this.state.movement.plantTo.id : null}
                          options={this.state.plantList.filter(x => { return this.state.movement.plantFrom ? x.value !== this.state.movement.plantFrom.value : true })}
                          onChange={(selectOption) => this.handleDropDownPlantChange(selectOption, "plantTo")}
                          style={{ color: this.state.plantToValid || this.state.plantToValid === null ? "" : errorColor, borderColor: this.state.plantToValid || this.state.plantToValid === null ? "" : errorColor }}

                        />
                      </FormGroup>
                      :
                      <FormGroup>
                        <ControlLabel><b>Destination Plant :</b><br />  {this.state.movement.plantTo ? this.state.movement.plantTo.name : null}</ControlLabel>
                      </FormGroup>
                    }
                  </Col>
                ) : null
            }
            {
              this.state.movement.category && this.state.movement.category === "Move to Site"
                ? (
                  <Col xs={12} sm={6} md={3} lg={3}>
                    {this.state.movement.code === "New" ?
                      <FormGroup>
                        <ControlLabel>Customer <span className="star">*</span></ControlLabel>
                        <Select
                          disabled={this.props.match.params.movementcode !== "new" ? true : false}
                          clearable={false}
                          placeholder="Select customer"
                          name="customer"
                          value={this.state.movement.customer ? this.state.movement.customer.id : null}
                          options={this.state.customerList}
                          onChange={(selectedOption) => this.handleInputChangeCustomer(selectedOption, 'customer')}
                          style={{ color: this.state.customerValid || this.state.customerValid === null ? "" : errorColor, borderColor: this.state.customerValid || this.state.customerValid === null ? "" : errorColor }}

                        />
                      </FormGroup>
                      :
                      <FormGroup>
                        <ControlLabel><b>Customer Name :</b><br />  {this.state.movement.customer ? this.state.movement.customer.name : null}</ControlLabel>
                      </FormGroup>
                    }
                  </Col>
                ) : null
            }
            {
              this.state.movement.category && this.state.movement.category === "Move to Site"
                ? (
                  <Col xs={12} sm={6} md={3} lg={3}>
                    {this.state.movement.code === "New" ?
                      <FormGroup>
                        <ControlLabel>Site Address <span className="star">*</span> </ControlLabel>
                        <Select
                          disabled={this.props.match.params.movementcode !== "new" ? true : false}
                          clearable={false}
                          placeholder="Select site address"
                          name="site"
                          value={this.state.movement.site ? this.state.movement.site.id : null}
                          options={this.state.addressList.filter(prop => {
                            return (prop.type === "Site")
                          })}
                          onChange={(selectOption) => this.handleDropDownChange(selectOption, "site")}
                          style={{ color: this.state.siteValid || this.state.siteValid === null ? "" : errorColor, borderColor: this.state.siteValid || this.state.siteValid === null ? "" : errorColor }}

                        />
                      </FormGroup>
                      :
                      <FormGroup>
                        <ControlLabel><b>Site Address :</b><br />  {this.state.movement.site ? this.state.movement.site.name : null}</ControlLabel>
                      </FormGroup>
                    }
                  </Col>
                ) : null
            }
          </Col>
        </Row>
        <Col xs={12} className="dropdown-select">

          {
            this.state.movement.inventoryData.length
              ? (
                <ReactTable
                  data={this.state.movement.inventoryData}
                  columns={
                    (adminCondition === "admin") ?
                      (
                        this.state.movement.movementType === "Outward" ?
                          [srNoCol, inventoryTypeCol, materialCol, notesCol, outQtyCol, actualQtyCol, returnableCol, stockUpdateCol, actionsCol]
                          :
                          [srNoCol, inventoryTypeCol, materialInwardCol, notesCol, inQtyCol, actualQtyCol, returnableCol, stockUpdateCol, actionsCol]
                      ) :
                      (
                        this.state.movement.movementType === "Outward" ?
                          [srNoCol, inventoryTypeCol, materialCol, notesCol, outQtyCol, returnableCol, stockUpdateCol, actionsCol]
                          :
                          [srNoCol, inventoryTypeCol, materialInwardCol, notesCol, inQtyCol, returnableCol, stockUpdateCol, actionsCol]
                      )
                  }
                  minRows={0}
                  sortable={false}
                  className="-striped -highlight"
                  showPaginationTop={false}
                  showPaginationBottom={false}
                />
              ) : (<div>No items found.</div>)
          }
          <Col xs={12}>
            {this.state.movement.code === "New" ?
              <OverlayTrigger placement="top" overlay={add}>
                <Button bsStyle="primary" fill icon
                  onClick={() => {
                    let tempMovement = this.state.movement;
                    tempMovement.inventoryData.push({
                      inventory: null,
                      inQty: 0,
                      outQty: 0,
                      actyQty: 0,
                      returnable: false,
                      stock: true,
                      notes: "",

                    });
                    this.setState({ tempMovement });
                  }}
                > <span className="fa fa-plus"></span></Button>
              </OverlayTrigger>
              : null
            }
          </Col>
        </Col>
      </Col>
    );
    let actions = (
      <Col xs={12}>
        <center><h5 className="text-danger">{this.state.formError}</h5></center>
        <OverlayTrigger placement="top" overlay={back}>
          <Button bsStyle="warning" fill icon onClick={this.props.history.goBack}><span className="fa fa-arrow-left"></span></Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={list}>
          <Button bsStyle="primary" fill icon onClick={() => this.props.history.push('/movements/movement')}><span className="fa fa-list"></span></Button>
        </OverlayTrigger>
        {this.props.match.params.movementcode === "new" ?
          <OverlayTrigger placement="top" overlay={save}>
            <Button bsStyle="success" fill icon pullRight onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
          </OverlayTrigger>
          : null
        }
        {this.props.match.params.movementcode !== "new" ?
          this.state.movement.status !== "Close" ?
            <OverlayTrigger placement="top" overlay={close}>
              <Button bsStyle="danger" fill pullRight icon disabled={this.state.settings} onClick={this.handleCloseMovement}><span className="fa fa-times"></span>  </Button>
            </OverlayTrigger>
            : null
          : null
        }

      </Col>
    )

    return (
      <Row className="card-content">

        {this.state.alert}
        <Row className="card-form ">{form}</Row>
        <div className="card-footer">{actions}</div>
      </Row>
    );
  }
}

export default AddEditMovementComponent;
