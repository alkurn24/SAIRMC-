import React, { Component } from "react";
import _ from "lodash";
import "react-select/dist/react-select.css";
import cookie from "react-cookies";
import SweetAlert from "react-bootstrap-sweetalert";
import Moment from "moment";
import { Modal, FormGroup, ControlLabel, Row, Col, Nav, NavItem, Tab, Tooltip, OverlayTrigger } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import Select from "components/CustomSelect/CustomSelect.jsx";
import UploadComponent from 'components/Upload/UploadComponent.jsx';
import PurchaseOrderTableComponent from "./PurchaseRequestTableComponent";


import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import AddressesListComponent from "modules/common/addresses/components/AddressesListComponent"
import ContactsListComponent from "modules/common/contacts/components/ContactsListComponent"

import { getVendorList } from "modules/purchase/vendor/server/VendorServerComm.jsx";
import { getAddressList } from "modules/common/addresses/server/AddressesServerComm.jsx";
import { getContactList } from "modules/common/contacts/server/ContactsServerComm.jsx";
import { getInventoryList } from "modules/inventory/stores/server/StoresServerComm.jsx";
import { getServiceList } from "modules/inventory/services/server/ServiceServerComm.jsx";
import { getAssetList } from "../../../assetsmgmt/assets/server/AssetsServerComm.jsx";
// import { getOrderList } from "../../../sales/orders/server/OrderServerComm";
import { getInventorySettingList } from "modules/settings/inventory/server/InventoryServerComm.jsx";
import { createPurchaseRequest, getPurchaseRequestSingle, updatePurchaseRequest, deletePurchaseRequest } from "modules/purchase/purchaseRequest/server/PurchaseRequestServerComm.jsx";
import { errorColor } from 'variables/Variables.jsx';

class PurchaseRequestFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: "",
      radio: "1",
      currency: "₹",
      moduleName: props.moduleName,
      settingsForm: props.settingsForm,
      edit: !props.settings,
      moduleList: [],
      purchaseRequest: {
        status: "New",
        code: "New",
        vendor: null,
        plant: null,
        contact: null,
        billingAddr: null,
        deliveryAddr: null,
        date: Moment().format("DD MMM YYYY"),
        custom: [],
        orderData: [],
        notes: "",
        // photo: "",
        documents: [],
        type: null

      },
      newOrder: {
        freeText: "",
        inventoryType: null,
        inventoryCategory: null,
        inventory: null,
        asset: null,
        service: null,
        salesOrder: null,
        quantity: 0,
        discount: 0,
        packing: 0,
        categoryList: [],
        inventoryList: [],
        assetList: [],
        serviceList: [],

      },
      moduleForm: {
        mandatory: [],
        custom: []
      },
      customerList: [],
      agentList: [],
      orderList: [],
      addressList: [],
      contactList: [],
      plantList: [],
      inventoryList: [],
      categoryList: [],
      serviceList: [],
      assetList: [],
      inventorySettingList: [],
      servicesSettingList: [],
      vendorList: [],
      vendorValid: null,
      billingAddrValid: null,
      plantValid: null,
      contactValid: null,
      typeValid: null,
      vendorError: false,
      billingAddrError: false,
      contactError: false,
      plantError: false,
      descriptionError: false,
      percentageError: false,
      amountError: false,
      quantityError: false,
      productError: false,
      avlquantityError: false,
      discountError: false,
      rateError: false,
      orderamtError: false,
      type: false
    }
    this.emptyState = this.state;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCheckedRadioButton = this.handleCheckedRadioButton.bind(this);
    this.handleMultipleDocumentChange = this.handleMultipleDocumentChange.bind(this);
    this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
    this.save = this.save.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.changeOrderStatus = this.changeOrderStatus.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.createModule = this.createModule.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.fetchVendorData = this.fetchVendorData.bind(this);
    this.getAddressForVendor = this.getAddressForVendor.bind(this);
    this.getContactForVendor = this.getContactForVendor.bind(this);
    this.handleShowAddRawMaterialModal = this.handleShowAddRawMaterialModal.bind(this);
    this.handleCloseAddRawMaterialModal = this.handleCloseAddRawMaterialModal.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.handleCloseOrder = this.handleCloseOrder.bind(this);
    this.handleOpenOrder = this.handleOpenOrder.bind(this);
    this.saveInventoryToModule = this.saveInventoryToModule.bind(this);
    this.handleDropDownChangeType = this.handleDropDownChangeType.bind(this);
    this.handleShowAddInventoryModal = this.handleShowAddInventoryModal.bind(this);
    this.handleCloseAddInventoryModal = this.handleCloseAddInventoryModal.bind(this);

  }
  componentWillMount() {
    this.fetchDataFromServer();
  }
  fetchDataFromServer() {
    var _this = this;
    if (_this.props.match.params.code !== 'new') {
      getPurchaseRequestSingle(_this.props.match.params.code,
        function success(data) {
          let tempData = JSON.parse(JSON.stringify(data));
          if (data.customer) {
            _this.getLocationForCustomer(data.customer.id)
          }
          let total = 0;
          let grnCondition = 0;
          tempData.orderData.map(d => {
            let amount = d.rate * d.quantity;
            total += amount - (amount * d.discount / 100);
            return total;
          });
          tempData.orderData.map(d => {
            grnCondition = d.quantity - d.received;
            return grnCondition;
          });
          tempData.total = _.round(total, 0);
          tempData.grnCondition = grnCondition;
          tempData.orderData.map(x => {
            if (tempData.type === "Store") {
              if (x.inventoryCategory !== null) x.inventoryCategory.label = x ? x.inventoryCategory[0] : null;
              x.name = x.inventory.name ? x.inventory.name : null;
            }
            else if ((tempData.type === "Asset")) {
              if (x.inventoryCategory !== null) x.inventoryCategory.label = x ? x.inventoryCategory[0] : null;
              x.name = x.asset.name ? x.asset.name : null;
            }
            else {
              if (x.inventoryCategory !== null) x.inventoryCategory.label = x ? x.inventoryCategory[0] : null;
              x.name = x.service.name ? x.service.name : null;
            }
            if (x.inventoryCategory !== null) {
              _this.setState({
                categoryList: x.inventoryCategory.map(prop => {
                  return {
                    value: prop,
                    label: prop
                  }
                })
              })
            } else {
              _this.setState({ categoryList: null })
            }
          })
          _this.setState({ purchaseRequest: tempData });
        },
      )
    }

    getVendorList("",
      function success(data) {
        _this.setState({
          vendorList: data.rows.map((prop) => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name,
              name: prop.name,
              phone: prop.phone,
              email: prop.email
            }
          })
        });

      },
    )

    getPlantList("",
      function success(data) {
        _this.setState({
          plantList: data.rows.map((prop) => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name,
              email: prop.email,
              contactNo: prop.contactNo,
              address: prop.address,
            }
          })
        });

        () => { }
      }
    )
    getInventoryList("view=invtyp",
      (data) => _this.setState({ inventoryList: data.rows.filter(x => { return x.vendors.length > 0 }) }),

      () => _this.errorAlert("Error: please try again later")
    )
    getAssetList("view=invtyp",
      (data) => _this.setState({ assetList: data.rows.filter(x => { return x.vendors.length > 0 }) }),

      () => _this.errorAlert("Error: please try again later")
    )
    getServiceList("view=invtyp",
      (data) => _this.setState({ serviceList: data.rows.filter(x => { return x.vendors.length > 0 }) }),

      () => _this.errorAlert("Error: please try again later")
    )
    getInventorySettingList("",
      (data) => _this.setState({
        inventorySettingList: data.rows.map(prop => {
          prop.value = prop.id;
          prop.label = prop.name;
          return prop;
        })
      }),
      () => _this.errorAlert("Something went wrong!")
    )


  }

  fetchVendorData(id) {
    var _this = this;
    _this.setState({ contactList: [], addressList: [] })

  }
  handleShowAddInventoryModal() { this.setState({ showAddInventoryModal: true }); }
  handleCloseAddInventoryModal() { this.setState({ showAddInventoryModal: false }); }
  saveInventoryToModule(newOrder) {
    var temp = this.state.purchaseRequest;
    if (newOrder._id) {
      let index = temp.orderData.indexOf(x => {
        return x._id === newOrder._id
      })
      temp.orderData[index] = newOrder;
    } else {
      let tempModule = JSON.parse(JSON.stringify(newOrder));
      if (this.state.purchaseRequest.type === "Store") {
        tempModule.name = tempModule.inventory.label;
      }
      else if (this.state.purchaseRequest.type === "Asset") {
        tempModule.name = tempModule.asset.label;
      }
      else {
        tempModule.name = tempModule.service.label;
      }
      temp.orderData.push(tempModule)
    }
    this.setState({ purchaseRequest: temp });
    this.handleCloseAddInventoryModal();
  }
  handleCloseOrder() {
    this.setState({
      alert: (
        <SweetAlert
          warningIn
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => {
            let tempModule = this.state.purchaseRequest;
            let tempStatus = this.state.moduleName;
            tempModule.status = "Closed";
            tempStatus = "Purchase request closed"
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
          This will close the purchase request and no more purchase order can be done!
        </SweetAlert>
      )
    });
  }
  handleOpenOrder() {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => {
            let tempModule = this.state.purchaseRequest;
            let tempStatus = this.state.moduleName;
            tempModule.status = "New";
            tempStatus = "Purchase request open"
            tempModule.notes += "\n" + Moment().format("DD MMM YYYY hh:mm:ss A") + ": " + cookie.load('user') + " reopened the order."
            this.setState({ tempModule })
            this.setState({ tempStatus })
            this.validationCheck();
          }}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="info"
          confirmBtnText="Yes, reopen it!"
          cancelBtnText="Cancel"
          showCancel
        >
          This will reopen the purchase request and purchase order can be done!
        </SweetAlert>
      )
    });
  }
  delete() {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.deleteConfirm()}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this module!
        </SweetAlert>
      )
    });
  }
  deleteConfirm() {
    let _this = this;
    deletePurchaseRequest(_this.state.module,
      function success() {
        _this.props.history.push("/module/xyz");
      },
      function error(code) {
        _this.errorAlert("Error in deleting module.");
      }
    )
  }
  createModule() {
    let _this = this;
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => {
            createPurchaseRequest(_this.state.purchaseRequest,
              function success(data) {
                _this.props.history.push("/purchase/modules-edit/" + data.code);
              },
              function error(code) {
                _this.errorAlert("Error in creating module.");
              }
            );
          }}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, create module!"
          cancelBtnText="Cancel"
          showCancel
        >
          This will create new module for this module!
        </SweetAlert>
      )
    })
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
  getContactForVendor(id) {
    var _this = this;
    _this.setState({ contactList: [] })

    getContactList("vendor=" + id,
      (res) => _this.setState({
        contactList: res.rows.map(prop => {
          return ({
            id: prop.id,
            value: prop.id,
            label: prop.name,
            email: prop.email,
            phone: prop.phone
          })
        })
      }),
      () => { }
    )
  }
  getAddressForVendor(id) {
    var _this = this;
    _this.setState({ addressList: [] })
    getAddressList("vendor=" + id,
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

  validationCheck() {
    this.state.purchaseRequest.vendor === null ?
      this.setState({ vendorError: "Select vendor name", vendorValid: false }) :
      this.setState({ vendorError: "", vendorValid: true })

    this.state.purchaseRequest.billingAddr === null ?
      this.setState({ billingAddrError: "Select billing address", billingAddrValid: false }) :
      this.setState({ billingAddrError: "", billingAddrValid: true })

    this.state.purchaseRequest.contact === null ?
      this.setState({ contactError: "Select contact", contactValid: false }) :
      this.setState({ contactError: "", contactValid: true })

    this.state.purchaseRequest.plant === null ?
      this.setState({ plantError: "Select Store name", plantValid: false }) :
      this.setState({ plantError: "", plantValid: true })

    this.state.purchaseRequest.type === null ?

      this.setState({ typeError: "Select request type", typeValid: false }) :
      this.setState({ typeError: "", typeValid: true })

    setTimeout(this.save, 10);


  }
  save() {
    let _this = this;
    let tempModule = JSON.parse(JSON.stringify(this.state.purchaseRequest));
    let tempStatus = this.state.moduleName;
    if (tempModule.status === "New") { tempStatus = "Purchase request saved" }
    if (tempModule.status === "Closed") { tempStatus = "Purchase request closed" }
    tempModule.plant = tempModule.plant ? tempModule.plant.id : null;
    tempModule.type = tempModule.type ? tempModule.type : null;
    tempModule.contact = tempModule.contact ? tempModule.contact.id : null;
    tempModule.billingAddr = tempModule.billingAddr ? tempModule.billingAddr.id : null;
    tempModule.deliveryAddr = tempModule.deliveryAddr ? tempModule.deliveryAddr.id : null;
    if (_this.state.plantValid) {
      tempModule.orderData.map(x => {
        if (tempModule.type === "Store") {
          x.gst = x.inventory ? x.inventory.gst : null;
          x.hsn = x.inventory ? x.inventory.hsn : null;
          if (tempModule.code === "New") {
            x.rate = x.inventory ? x.inventory.rate : null;
          }
          x.inventory = x.inventory ? x.inventory.id : null;
        }
        else if (tempModule.type === "Asset") {
          x.gst = x.asset ? x.asset.gst : null;
          x.hsn = x.asset ? x.asset.hsn : null;
          x.assetName = x.asset ? x.asset.label : null;
          if (tempModule.code === "New") {
            x.rate = x.asset ? x.asset.rate : null;
          }
          x.asset = x.asset ? x.asset.id : null;
        }
        else {
          x.gst = x.service ? x.service.gst : null;
          x.hsn = x.service ? x.service.hsn : null;
          if (tempModule.code === "New") {
            x.rate = x.service ? x.service.rate : null;
          }
          x.service = x.service ? x.service.id : null;
        }

        if (tempModule.code === "New") {
          x.inventoryCategory = x.inventoryCategory ? x.inventoryCategory.value : null;
        }
        else {
          x.inventoryCategory = x.inventoryCategory ? x.inventoryCategory[0] : null;
        }
        x.inventoryType = x.inventoryType ? x.inventoryType.id : null;
        x.servicesCategory = x.servicesCategory ? x.servicesCategory.label : null;
      })
      if (tempModule.orderData.length > 0) {
        if (tempModule.code === "New") {
          delete tempModule.code;
          createPurchaseRequest(tempModule,
            function success(data) {
              _this.successAlert("Purchase request added successfully!");
              setTimeout(() => {
                _this.props.history.push("/purchase/purchaserequest");
              }, 2000);
            },
            function error(data) {
              _this.errorAlert("Error in creating purchase request");
            }
          )
        } else {

          updatePurchaseRequest(tempModule,
            function success(data) {
              _this.successAlert(tempStatus + "  successfully!");
              setTimeout(() => {
                _this.props.history.push("/purchase/purchaserequest");
              }, 2000);
            },
            function error(data) {
              _this.errorAlert("Error in saving purchase request");
            }
          )
        }
      } else {
        _this.setState({ formError: "Please enter inventory details" })
      }
    } else {
      _this.setState({ formError: "Please enter required fields" })
    }
  }
  changeOrderStatus(status) {
    let obj = this.state.purchaseRequest;
    obj.status = status;
    this.setState({ purchaseRequest: obj });
    this.save();
  }
  handleCheckedRadioButton(e) {
    var moduleRadio = this.state.purchaseRequest;
    moduleRadio[e.target.name] = e.target.value;
    this.setState({ purchaseRequest: moduleRadio });
  }
  handleMultipleDocumentChange(newDocument) {
    var modules = this.state.purchaseRequest;
    modules.documents = newDocument.documents;
    this.setState({ modules });
  }
  handleDeleteDocument(key) {
    let modules = this.state.purchaseRequest;
    modules.documents.slice();
    modules.documents.splice(key, 1);
    this.setState({ modules });
  }
  handleCheckbox(e) {
    var newdata = this.state.purchaseRequest;
    newdata[e.target.name] = e.target.checked;
    this.setState({ purchaseRequest: newdata });
  }

  handleDropDownChangeType(selectOption, type) {
    var newPurchaseRequest = this.state.purchaseRequest;
    newPurchaseRequest[type] = selectOption ? selectOption.value : null;
    this.setState({ purchaseRequest: newPurchaseRequest });
  }

  handleInputChange(e, param) {
    var newObj = this.state.purchaseRequest;
    if (!e.target) {
      newObj[param] = e;
      this.setState({ pricing: newObj, formError: null });
      e.id === "" || null ? this.setState({ rawmaterialValid: false }) : this.setState({ rawmaterialValid: true })
      if (param === "vendor") {
        this.fetchVendorData(e.id);
        this.getAddressForVendor(e.id);
        this.getContactForVendor(e.id);
      }
    } else {
      if (e.target.name.indexOf("custom_") !== -1) {
        var key = parseInt(e.target.name.split("_")[1], 10);
        newObj.custom[key] = e.target.value;
        this.setState({ purchaseRequest: newObj });
      } else if (e.target.name.indexOf("radio_") !== -1) {
        newObj[e.target.name.split("_")[1]] = e.target.value;
        this.setState({ purchaseRequest: newObj });
      } else {
        if (e.target.type === "number") newObj[e.target.name] = parseFloat(e.target.value);
        else newObj[e.target.name] = e.target.value;
        this.setState({ purchaseRequest: newObj });
      }
    }
  }
  handleDateChange(name, date) {
    var moduleTemp = this.state.purchaseRequest;
    moduleTemp[name] = date._d;
    this.setState({ moduleTemp });
  }

  handleShowAddRawMaterialModal() { this.setState({ showAddRawMaterialModal: true }); }
  handleCloseAddRawMaterialModal() { this.setState({ showAddRawMaterialModal: false }); }

  handleRadio = event => {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  };
  render() {
    const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const list = (<Tooltip id="save_tooltip"> Purchase request list</Tooltip>);
    const close = (<Tooltip id="close_tooltip">Close purchase request</Tooltip>);
    const open = (<Tooltip id="open_tooltip">Reopen purchase request</Tooltip>);


    let _this = this;
    let plantDetails = (
      <Row>
        <Col xs={12}>
          <Col xs={12} sm={6} md={4} lg={3}>
            {this.state.purchaseRequest.code === "New" ?
              <FormGroup>
                <ControlLabel>Plant <span className="star">*</span></ControlLabel>
                <div>
                  <Select
                    clearable={false}
                    placeholder="Select plant"
                    name="plant"
                    options={this.state.plantList}
                    value={this.state.purchaseRequest.plant ? this.state.purchaseRequest.plant.id : null}
                    onChange={(selectedOption) => this.handleInputChange(selectedOption, 'plant')}
                    style={{ color: this.state.plantValid || this.state.plantValid === null ? "" : errorColor, borderColor: this.state.plantValid || this.state.plantValid === null ? "" : errorColor }}
                  />
                </div>
              </FormGroup>
              :
              <FormGroup>
                <ControlLabel><b>Plant Name:</b><br />{this.state.purchaseRequest.plant.name} </ControlLabel>
              </FormGroup>
            }
          </Col>

          <Col xs={12} sm={6} md={4} lg={3}>
            {this.state.purchaseRequest.code === "New" ?
              <FormGroup>
                <ControlLabel>Request type <span className="star">*</span> </ControlLabel>
                <Select
                  disabled={this.state.purchaseRequest.orderData.length ? true : false}
                  clearable={false}
                  placeholder="Select type"
                  name="type"
                  value={this.state.purchaseRequest.type}
                  options={[
                    { value: "Store", label: "Store" },
                    { value: "Asset", label: "Asset" },
                    { value: "Service", label: "Service" },
                  ]}
                  onChange={(selectOption) => this.handleDropDownChangeType(selectOption, "type")}
                  style={{ color: this.state.typeValid || this.state.typeValid === null ? "" : errorColor, borderColor: this.state.typeValid || this.state.typeValid === null ? "" : errorColor }}
                />
              </FormGroup>
              :
              <FormGroup>
                <ControlLabel><b>Request type:</b><br />{this.state.purchaseRequest.type} </ControlLabel>
              </FormGroup>
            }
          </Col>
        </Col>
      </Row>
    )
    // let customFields = (
    //   <Row>
    //     <Col xs={12}>
    //       {
    //         _this.state.moduleForm.custom.map(function (item, key) {
    //           return (
    //             <Col xs={12} sm={6} md={4} lg={3} key={key} hidden={!item.value}>
    //               <FormGroup>
    //                 <ControlLabel>{item.label}</ControlLabel>
    //                 <FormControl
    //                   disabled={!_this.state.edit}
    //                   name={"custom_" + key}
    //                   type="text"
    //                   placeholder={item.label}
    //                   value={_this.state.purchaseRequest.custom[key] ? _this.state.purchaseRequest.custom[key] : ""}
    //                   onChange={_this.handleInputChange}
    //                 />
    //               </FormGroup>
    //             </Col>
    //           )
    //         })
    //       }

    //     </Col>
    //   </Row>
    // );

    let actions = (
      <div>
        <center><h5 className="text-danger">{this.state.formError}</h5></center>
        <Col xs={12}>
          {this.props.match.path !== "/inventory/stores" ?
            <OverlayTrigger placement="top" overlay={back}>
              <Button bsStyle="warning" fill icon style={{ marginLeft: "10px" }} disabled={this.state.settings} onClick={this.props.history.goBack}><span className="fa fa-arrow-left"></span></Button>
            </OverlayTrigger>
            : null
          }
          {this.props.match.path !== "/inventory/stores" ?
            <OverlayTrigger placement="top" overlay={list}>
              <Button bsStyle="primary" fill icon disabled={this.state.settings} onClick={() => { return this.props.history.push("/purchase/purchaserequest"); }}><span className="fa fa-list"></span></Button>
            </OverlayTrigger>
            : null
          }
          {this.state.purchaseRequest.code === "New" ?
            this.state.purchaseRequest.status !== "Closed" ?
              <OverlayTrigger placement="top" overlay={save}>
                <Button bsStyle="success" fill pullRight icon disabled={this.state.settings} onClick={this.validationCheck}> <span className="fa fa-save"></span>
                </Button>
              </OverlayTrigger>
              : null
            : null
          }
          {/* {
            this.state.purchaseRequest.id && (this.state.purchaseRequest.status === "New" || this.state.purchaseRequest.status === "Dispatching") ? (

              <OverlayTrigger placement="top" overlay={close}>
                <Button bsStyle="danger" fill pullRight icon disabled={this.state.settings} onClick={this.handleCloseOrder}><span className="fa fa-times"></span>	</Button>
              </OverlayTrigger>

            ) : null
          }
          {
            this.state.purchaseRequest.status === "Closed" ? (
              <OverlayTrigger placement="top" overlay={open}>
                <Button bsStyle="info" fill pullRight icon disabled={this.state.settings} onClick={this.handleOpenOrder}><span className="fa fa-refresh"></span>	</Button>
              </OverlayTrigger>
            ) : null
          } */}
        </Col>
      </div>
    );
    let orderTable = (
      <PurchaseOrderTableComponent
        purchaseRequest={this.state.purchaseRequest}
        inventoryList={this.state.inventoryList}
        assetList={this.state.assetList}
        serviceList={this.state.serviceList}
        orderList={this.state.orderList}
        categoryList={this.state.categoryList}
        inventorySettingList={this.state.inventorySettingList}
        servicesSettingList={this.state.servicesSettingList}
        vendorList={this.state.vendorList}
        purchaseRequestCode={"New"}
        saveInventoryToModule={this.saveInventoryToModule}
        {...this.props}
      />
    );

    let addressModal = (
      <Modal
        dialogClassName="large-modal card"
        show={this.state.showAddressModal}
        onHide={() => {
          this.setState({ showAddressModal: false });
          this.getAddressForVendor(this.state.purchaseRequest.vendor.id);
        }}
      >
        <Modal.Body className="cardModal">
          <AddressesListComponent {...this.props} vendor id={this.state.purchaseRequest.vendor ? this.state.purchaseRequest.vendor.id : null} />
        </Modal.Body>
      </Modal>
    )
    let contactModal = (
      <Modal
        dialogClassName="large-modal card"
        show={this.state.showContactModal}
        onHide={() => {
          this.setState({ showContactModal: false });
          this.getContactForVendor(this.state.purchaseRequest.vendor.id);
        }}
      >
        <Modal.Body className="cardModal">
          <ContactsListComponent {...this.props} vendor id={this.state.purchaseRequest.vendor ? this.state.purchaseRequest.vendor.id : null} />
        </Modal.Body>
      </Modal>
    )
    let moduleInfoTabs = (
      <Col xs={12}>
        <Tab.Container defaultActiveKey="materials" id="order-details">
          <div className="clearfix">
            <Nav bsStyle="tabs">
              <NavItem eventKey="materials"><i className="fa fa-suitcase" /> Inventory/Services List
              </NavItem>
              {/* <NavItem  eventKey="custom">  Additional Information
              </NavItem> */}
              {this.props.match.path !== "/inventory/stores" ?
                this.props.match.params.code !== "new"
                  ? (<NavItem eventKey="documents"><i className="fa fa-file" />  Documents
                    </NavItem>
                  ) : null
                : null
              }
              <NavItem eventKey="notes">	<i className="fa fa-comment" /> Notes</NavItem>
            </Nav>
            <Col xs={12}>
              <Tab.Content animation>
                <Tab.Pane eventKey="materials">
                  <Row>{orderTable}</Row>
                </Tab.Pane>
                <Tab.Pane eventKey="documents">
                  <div hidden={this.props.match.params.code === "new" ? true : false}>
                    <Row>
                      <Row>
                        <UploadComponent
                          document
                          type="purchaserequests"
                          documents={this.state.purchaseRequest.documents}
                          details={this.state.purchaseRequest}
                          dropText="Drop files or click here"
                          handleMultipleDocumentChange={this.handleMultipleDocumentChange}
                          handleDeleteDocument={this.handleDeleteDocument}
                        />
                      </Row>
                    </Row>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="notes">
                  <Row>
                    <FormGroup>
                      <ControlLabel>Notes:</ControlLabel>
                      <textarea
                        disabled={this.state.purchaseRequest.code === "New" ? false : true}
                        className="form-control"
                        name="notes"
                        type="text"
                        placeholder="Notes"
                        value={this.state.purchaseRequest.notes ? this.state.purchaseRequest.notes : ""} onChange={this.handleInputChange}>
                      </textarea>
                    </FormGroup>
                  </Row>
                </Tab.Pane>

              </Tab.Content>
            </Col>
          </div>

        </Tab.Container>
      </Col>

    );
    let form = (
      <Row>
        <fieldset>
          <Col xs={12}>
            <Col xs={12}>
              {this.state.purchaseRequest.code !== 'New' ?
                <Col xs={12} sm={4} md={3} lg={3}>
                  <FormGroup>
                    <ControlLabel><b>Code:</b><br /> {this.state.purchaseRequest.code ? this.state.purchaseRequest.number : null}</ControlLabel>
                  </FormGroup>
                </Col>
                : null
              }
              <Col xs={12} sm={4} md={3} lg={3}>
                <FormGroup>
                  <ControlLabel><b>Created By:</b><br /> {this.state.purchaseRequest.user ? this.state.purchaseRequest.user.name : cookie.load('user')}</ControlLabel>
                </FormGroup>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <FormGroup>
                  <ControlLabel><b>Status:</b><br /> {this.state.purchaseRequest.status}</ControlLabel>
                </FormGroup>
              </Col>
              <Col xs={12} sm={4} md={3} lg={3}>
                <FormGroup>
                  <ControlLabel><b>Purchase Request Date:</b><br /> {this.state.purchaseRequest.purchaseDate ? Moment(this.state.purchaseRequest.purchaseDate).format('DD MMM YYYY ') : Moment().format('DD MMM YYYY')}</ControlLabel>
                </FormGroup>
              </Col>
            </Col>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Col xs={12} sm={4} md={3} lg={3}>
              <div className="text-center"></div>
            </Col>

            <Col xs={12} sm={12} md={12} lg={12}>
              <h6 className="section-header" style={{ marginBottom: "10px" }}>Plant Details</h6>
              {plantDetails}
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              {moduleInfoTabs}
            </Col>
          </Col>
        </fieldset>
      </Row >
    );
    return (
      <Row className="card-content">
        {this.state.alert}
        {addressModal}
        {contactModal}
        <div className="card-form" style={{ display: "block" }}>{form}</div>
        <div className="card-footer">{actions}</div>
      </Row>
    );

  }
}

export default PurchaseRequestFormComponent;
