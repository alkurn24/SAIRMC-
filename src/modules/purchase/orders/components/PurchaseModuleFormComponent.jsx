import React, { Component } from "react";
import _ from "lodash";
import Select from "components/CustomSelect/CustomSelect.jsx";

import "react-select/dist/react-select.css";
import cookie from 'react-cookies';
import ReactTable from 'react-table';
import SweetAlert from "react-bootstrap-sweetalert";
import Moment from "moment";

import { Modal, FormGroup, ControlLabel, Row, Col, Nav, NavItem, Tab, Tooltip, OverlayTrigger } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import UploadComponent from 'components/Upload/UploadComponent.jsx';
import PurchaseOrderTableComponent from "./PurchaseOrderTableComponent";
import GrnModalComponent from "modules/purchase/grn/components/GrnModalComponent.jsx";
import GrnListComponent from "modules/purchase/grn/components/GrnListComponent.jsx";

import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import { getTermsList } from "modules/settings/terms&conditions/server/TermsServerComm.jsx";
import { createPurchaseOrder, getPurchaseOrderSingle, updatePurchaseOrder, deletePurchaseOrder, getPurchaseOrderList } from "modules/purchase/orders/server/OrderServerComm.jsx";
import AddressesListComponent from "modules/common/addresses/components/AddressesListComponent"
import ContactsListComponent from "modules/common/contacts/components/ContactsListComponent"
import VendorsFormComponent from "modules/purchase/vendor/components/VendorsFormComponent";
import { getVendorList } from "modules/purchase/vendor/server/VendorServerComm.jsx";
import { getAddressList } from "modules/common/addresses/server/AddressesServerComm.jsx";
import { getContactList } from "modules/common/contacts/server/ContactsServerComm.jsx";
import { getPurchaseRequestList } from "modules/purchase/purchaseRequest/server/PurchaseRequestServerComm.jsx";
import { getInventoryList } from "modules/inventory/stores/server/StoresServerComm.jsx";
import { getServiceList } from "modules/inventory/services/server/ServiceServerComm.jsx";
import { getAssetList } from "../../../assetsmgmt/assets/server/AssetsServerComm.jsx";
import { errorColor } from 'variables/Variables.jsx';

class PurchaseModuleFormComponent extends Component {
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
      vendorList: [],
      module: {
        status: "New",
        code: "New",
        number: "New",
        vendor: null,
        type: "",
        poType: "",
        plant: null,
        contact: null,
        billingAddr: null,
        deliveryAddr: null,
        isQa: false,
        date: Moment().format("DD MMM YYYY"),
        DispatchingTime: null,
        ReceivingTime: null,
        closedTime: null,
        paidTime: null,
        custom: [],
        terms: [],
        orderData: [],
        priceData: [],
        purchaseData: [],
        notes: "",
        // photo: "",
        documents: [],
      },
      newOrder: {
        inventory: null,
        packingWt: 0,
        noOfBags: 0,
        rate: 0,
        gst: 0,
        hsn: "",
        quantity: 0,
        discount: 0,
      },
      moduleForm: {
        mandatory: [],
        custom: []
      },
      customerList: [],
      agentList: [],
      addressList: [],
      serviceList: [],
      assetList: [],
      contactList: [],
      plantList: [],
      vendorStockData: [],
      purchaseRequestList: [],
      inventoryList: [],
      vendorHistory: [],
      vendorValid: null,
      billingAddrValid: null,
      plantValid: null,
      contactValid: null,
      typeValid: null,
      poTypeValid: null,
      vendorError: false,
      billingAddrError: false,
      contactError: false,
      plantError: false,
      typeError: false,
      poTypeError: false,
      descriptionError: false,
      percentageError: false,
      amountError: false,
      quantityError: false,
      productError: false,
      avlquantityError: false,
      discountError: false,
      rateError: false,
      orderamtError: false,
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
    this.saveConfirm = this.saveConfirm.bind(this);
    this.saveCheck = this.saveCheck.bind(this);

    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.fetchVendorData = this.fetchVendorData.bind(this);
    this.fetchInventoryData = this.fetchInventoryData.bind(this)
    this.getAddressForVendor = this.getAddressForVendor.bind(this);
    this.fetchHistory = this.fetchHistory.bind(this);

    this.getContactForVendor = this.getContactForVendor.bind(this);
    this.handleShowAddRawMaterialModal = this.handleShowAddRawMaterialModal.bind(this);
    this.handleCloseAddRawMaterialModal = this.handleCloseAddRawMaterialModal.bind(this);

    this.handleShowGrnModal = this.handleShowGrnModal.bind(this);
    this.handleCloseGrnModal = this.handleCloseGrnModal.bind(this);
    this.validationCheck = this.validationCheck.bind(this);

    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.renderIsSelectedCheckBox = this.renderIsSelectedCheckBox.bind(this);
    this.handleDropDownChangeType = this.handleDropDownChangeType.bind(this)
    this.handleDropDownChange = this.handleDropDownChange.bind(this)
  }
  componentWillMount() {
    this.fetchDataFromServer();

  }

  fetchDataFromServer(update) {
    var _this = this;
    if (this.state.module.code === "New") {
      getVendorList("view=dropdown",
        function success(data) {
          _this.setState({
            vendorList: data.rows.map((prop) => {
              return {
                id: prop.id,
                value: prop.id,
                code: prop.code ? prop.code : "",
                number: prop.number ? prop.number : "",
                label: prop.name ? prop.name : "",
                email: prop.email ? prop.email : "",
                phone: prop.phone ? prop.phone : "",
              }
            })
          })
        })
      if (_this.props.match.params.pocode !== 'new') {
        getPurchaseOrderSingle(_this.props.match.params.pocode,
          function success(data) {
            let total = 0;
            let grnCondition = 0;
            data.total = _.round(total, 0);
            data.grnCondition = grnCondition;
            if (update === "vendor") {
              let tempObj = _this.state.module;
              tempObj.vendor = data.vendor;
              _this.setState({ tempObj });
            } else {
              let tempObj = _this.state.module;
              data.orderData.map(prop1 => {
                tempObj.orderData.push({
                  _id: prop1._id,
                  number: prop1.purchaseRequest ? prop1.purchaseRequest.number : 0,
                  purchaseRequest: prop1.purchaseRequest ? prop1.purchaseRequest.id : 0,
                  discount: prop1.discount,
                  finalAmount: prop1.finalAmount ? prop1.finalAmount.toFixed(2) : 0.00,
                  packing: prop1.packing ? prop1.packing.toFixed(2) : 0.00,
                  gst: prop1.gst,
                  hsn: prop1.hsn,
                  description: prop1.description,
                  isSelected: prop1.isSelected,
                  inventory: prop1.inventory ? prop1.inventory : "",
                  asset: prop1.asset ? prop1.asset : "",
                  service: prop1.service ? prop1.service : "",
                  unit: prop1.inventory ? prop1.inventory.unit : "",
                  requestQuantity: prop1.requestQuantity,
                  orderQuantity: prop1.orderQuantity ? prop1.orderQuantity : 0,
                  rate: prop1.rate.toFixed(2),
                  remainingQty: prop1.remainingQty ? prop1.remainingQty : 0,
                })
              })
              _this.setState({ tempObj });
              _this.setState({ module: data });
              _this.fetchVendorData(data.vendor.id);
              _this.fetchHistory(data.id);
              _this.getAddressForVendor(data.vendor.id);
              _this.getContactForVendor(data.vendor.id);

            }
          },
        )
      }
    }
    getInventoryList("view=po",
      (data) => _this.setState({ inventoryList: data.rows }),
      () => _this.errorAlert("Error: please try again later")
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
    if (_this.props.match.path === "/purchase/purchaserequest") {
      getTermsList("",
        function success(data) {
          let tempData = [];
          data.rows.map((prop) => {
            prop.terms.map(s => {
              tempData.push({

                term: s.term,
                isSelected: s.isSelected
              })
            })
          });
          _this.state.module.terms = tempData;
        }
      )
    }
  }

  fetchInventoryData() {
    var _this = this;
    _this.state.purchaseRequestList = [];
    getPurchaseRequestList("type=" + this.state.module.type,
      function success(data) {
        data.rows.map((prop) => {
          // let tempData = _this.state.module;
          if (prop.status !== "Closed") {
            if (prop.orderData.length) {
              prop.orderData.map(x => {
                if (x._status !== "Closed") {
                  _this.state.purchaseRequestList.push({
                    purchaseRequest: prop ? prop : 0,
                    number: prop.number ? prop.number : "",
                    status: prop.status ? prop.status : "",
                    discount: x.discount ? x.discount.toFixed(2) : 0.00,
                    finalAmount: x.finalAmount ? x.finalAmount.toFixed(2) : 0.00,
                    packing: x.packing ? x.packing.toFixed(2) : 0.00,
                    gst: x.gst,
                    _id: x._id,
                    hsn: x.hsn,
                    inventory: x.inventory ? x.inventory : "",
                    inventoryType: x.inventoryType ? x.inventoryType : "",
                    asset: x.asset ? x.asset : "",
                    service: x.service ? x.service : "",
                    unit: x.inventory ? x.inventory.unit : 0,
                    requestQuantity: x.quantity,
                    orderQuantity: x.orderQuantity ? x.orderQuantity : 0,
                    rate: x.rate ? x.rate : 0,
                    isSelected: x.isSelected,
                    remainingQty: x.remainingQty
                  })
                  return
                }
              })
              return
            }
          }
        })
        return
        //    _this.setState({ purchaseRequestList })
      })
    getVendorList("view=dropdown",
      function success(data) {
        if (_this.state.module.type === "Store") {
          getInventoryList("",
            function success(inventoryData) {
              let tempData2 = [];
              let tempData = [];
              inventoryData.rows.filter(x => { return x.vendors.length > 0 }).map(prop2 => {
                if (prop2.vendors.length) {
                  for (var i = 0; i < prop2.vendors.length; i++) {
                    tempData2.push({
                      id: prop2.vendors[i].vendor ? prop2.vendors[i].vendor.id : null
                    })
                  }
                }
              })

              tempData = ([...new Set(tempData2.map(x => {
                return x.id
              }))])
              _this.setState({ tempData })
              let vendorData = _this.state.vendorList
              data.rows.map(prop => {
                if (tempData.length) {
                  for (var i = 0; i < tempData.length; i++) {
                    if (prop.id === tempData[i]) {
                      vendorData.push({
                        id: prop.id,
                        code: prop.code,
                        value: prop.id,
                        label: prop.name,
                        name: prop.name,
                        phone: prop.phone,
                        email: prop.email
                      })
                      return
                    }
                  }
                }
              })
              _this.setState({ vendorData })
            },
            () => { }
          )
        } else if (_this.state.module.type === "Asset") {
          getAssetList("",
            function success(assetList) {
              let tempData2 = [];
              let tempData = [];
              assetList.rows.filter(x => { return x.vendors.length > 0 }).map(prop2 => {
                if (prop2.vendors.length) {
                  for (var i = 0; i < prop2.vendors.length; i++) {
                    tempData2.push({
                      id: prop2.vendors[i].vendor ? prop2.vendors[i].vendor.id : null
                    })
                  }
                }
              })

              tempData = ([...new Set(tempData2.map(x => {
                return x.id
              }))])
              _this.setState({ tempData })
              let vendorData = _this.state.vendorList
              data.rows.map(prop => {
                if (tempData.length) {
                  for (var i = 0; i < tempData.length; i++) {
                    if (prop.id === tempData[i]) {
                      vendorData.push({
                        id: prop.id,
                        code: prop.code,
                        value: prop.id,
                        label: prop.name,
                        name: prop.name,
                        phone: prop.phone,
                        email: prop.email
                      })
                      return
                    }
                  }
                }
              })
              _this.setState({ vendorData })
            },
            () => { }
          )
        } else if (_this.state.module.type === "Service") {
          getServiceList("",
            function success(serviceList) {
              let tempData2 = [];
              let tempData = [];
              serviceList.rows.filter(x => { return x.vendors.length > 0 }).map(prop2 => {
                if (prop2.vendors.length) {
                  for (var i = 0; i < prop2.vendors.length; i++) {
                    tempData2.push({
                      id: prop2.vendors[i].vendor ? prop2.vendors[i].vendor.id : null
                    })
                    return
                  }
                }
              })

              tempData = ([...new Set(tempData2.map(x => {
                return x.id
              }))])
              _this.setState({ tempData })
              let vendorData = _this.state.vendorList
              data.rows.map(prop => {
                if (tempData.length) {
                  for (var i = 0; i < tempData.length; i++) {
                    if (prop.id === tempData[i]) {
                      vendorData.push({
                        id: prop.id,
                        code: prop.code,
                        value: prop.id,
                        label: prop.name,
                        name: prop.name,
                        phone: prop.phone,
                        email: prop.email
                      })
                      return
                    }
                  }
                }
              })
              _this.setState({ vendorData })
            },
            () => { }
          )
        } else { return }
      },
    )
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
    deletePurchaseOrder(_this.state.module,
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
            createPurchaseOrder(_this.state.module,
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
  saveConfirm() {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => {
            this.save()
          }}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="info"
          confirmBtnText="Yes!"
          cancelBtnText="Cancel"
          showCancel
        >
          Do you want to create purchase order?
        </SweetAlert>
      )
    });
  }
  getContactForVendor(id) {
    var _this = this;
    _this.setState({ contactList: [] })

    getContactList("vendor=" + id,
      (res) => {
        _this.setState({
          contactList: res.rows.map(prop => {
            return ({
              id: prop.id,
              value: prop.id,
              label: prop.name,
              email: prop.email,
              phone: prop.phone
            })
          })
        });
        if (_this.state.contactList.length) {
          let tempObj = _this.state.module;
          tempObj.contact = _this.state.contactList[0];
          _this.setState({ module: tempObj })
        }
      },
      () => { }
    )
  }
  getAddressForVendor(id) {
    var _this = this;
    _this.setState({ addressList: [] })
    getAddressList("vendor=" + id,
      (res) => {
        _this.setState({
          addressList: res.rows.map(prop => {
            return ({
              id: prop.id,
              value: prop.id,
              type: prop.type,
              label: prop.name,
              street_address: prop.street_address,
              city: prop.city,
              state: prop.state,
              zipcode: prop.zipcode,
            })
          })
        });
        if (_this.state.addressList.length) {
          let tempObj = _this.state.module;
          tempObj.billingAddr = _this.state.addressList[0];
          _this.setState({ module: tempObj })
        }
      },
      () => { }
    )
  }
  fetchVendorData(vendorId) {
    var _this = this;
    if (_this.state.module.code === "New") {
      _this.setState({ vendorStockData: [], })
      let tempObj;
      let purchaseData = []
      purchaseData = _this.state.purchaseRequestList

      let tempModule = JSON.parse(JSON.stringify(purchaseData));
      var i = 0;
      if (this.state.module.type === "Store") {
        for (i = 0; i < purchaseData.length; i++) {
          tempModule[i].id = tempModule[i].inventory ? tempModule[i].inventory.id : ""
          tempModule[i].unit = tempModule[i].inventory ? tempModule[i].inventory.unit : ""
          this.setState({ tempModule })
        }
      } else if (this.state.module.type === "Asset") {
        for (i = 0; i < purchaseData.length; i++) {
          tempModule[i].id = tempModule[i].asset ? tempModule[i].asset.id : ""
          tempModule[i].unit = tempModule[i].asset ? tempModule[i].asset.unit : ""
          this.setState({ tempModule })
        }
      } else if (this.state.module.type === "Service") {
        for (i = 0; i < purchaseData.length; i++) {
          tempModule[i].id = tempModule[i].service ? tempModule[i].service.id : ""
          tempModule[i].unit = tempModule[i].service ? tempModule[i].service.unit : ""
          this.setState({ tempModule })
        }
      } else { return }
      let tempData = this.state.module;
      tempData.orderData = [];
      tempObj = _this.state;
      if (tempData.type === "Store") {
        getInventoryList("view=po&vendor=" + vendorId,
          function success(data) {
            tempModule.map((prop1) => {
              if (data.rows.length) {
                for (var i = 0; i < data.rows.length; i++) {
                  if (data.rows[i].id === prop1.id) {
                    tempData.orderData.push({
                      purchaseRequest: prop1.purchaseRequest,
                      _id: prop1._id,
                      vendorId: vendorId,
                      number: prop1.number,
                      discount: prop1.discount,
                      finalAmount: prop1.finalAmount,
                      packing: prop1.packing ? prop1.packing : 0.00,
                      gst: prop1.gst,
                      hsn: prop1.hsn,
                      description: prop1.description,
                      inventory: prop1.inventory ? prop1.inventory : null,
                      unit: prop1.unit,
                      isSelected: prop1.isSelected,
                      requestQuantity: prop1.requestQuantity ? prop1.requestQuantity.toFixed(2) : 0.00,
                      orderQuantity: prop1.requestQuantity ? prop1.requestQuantity.toFixed(2) : 0,
                      rate: prop1.rate,
                      remainingQty: prop1.remainingQty ? prop1.remainingQty.toFixed(2) : 0.00,
                    })
                    return
                  }
                }
              }

              return
            })
            _this.setState({ module: tempData });
            _this.state.module.orderData.map(x => {
              x.rate.map(s => {
                if (_this.state.module.vendor.id === s.vendorId && x.inventory.id === s.inventory) {
                  x.rate = s.listPrice
                }
              })
              return
            })
            _this.setState({ module: tempData });
            _this.setState({ vendorStockData: _this.state.module.priceData });
          })
      } else if (this.state.module.type === "Asset") {
        getAssetList("view=po&vendor=" + vendorId,
          function success(data) {
            tempModule.map((prop1) => {
              if (data.rows.length) {
                for (var i = 0; i < data.rows.length; i++) {
                  if (data.rows[i].id === prop1.id) {
                    tempData.orderData.push({
                      purchaseRequest: prop1.purchaseRequest,
                      _id: prop1._id,
                      vendorId: vendorId,
                      number: prop1.number,
                      discount: prop1.discount,
                      finalAmount: prop1.finalAmount,
                      packing: prop1.packing ? prop1.packing : 0.00,
                      gst: prop1.gst,
                      hsn: prop1.hsn,
                      description: prop1.description,
                      asset: prop1.asset ? prop1.asset : null,
                      inventoryType: prop1.inventoryType ? prop1.inventoryType : null,
                      unit: prop1.unit,
                      isSelected: prop1.isSelected,
                      requestQuantity: prop1.requestQuantity ? prop1.requestQuantity.toFixed(2) : 0.00,
                      orderQuantity: prop1.requestQuantity ? prop1.requestQuantity.toFixed(2) : 0,
                      rate: prop1.rate,
                      remainingQty: prop1.remainingQty ? prop1.remainingQty.toFixed(2) : 0.00,
                    })
                    return
                  }
                }
              }

              return
            })
            _this.setState({ module: tempData });
            _this.state.module.orderData.map(x => {
              x.rate.map(s => {
                if (_this.state.module.vendor.id === s.vendorId && x.asset.id === s.asset) {
                  x.rate = s.listPrice
                }
              })
              return
            })
            _this.setState({ module: tempData });
            _this.setState({ vendorStockData: _this.state.module.priceData });
          })
      } else if (this.state.module.type === "Service") {
        getServiceList("view=po&vendor=" + vendorId,
          function success(data) {
            tempModule.map((prop1) => {
              if (data.rows.length) {
                for (var i = 0; i < data.rows.length; i++) {
                  if (data.rows[i].id === prop1.id) {
                    tempData.orderData.push({
                      purchaseRequest: prop1.purchaseRequest,
                      _id: prop1._id,
                      vendorId: vendorId,
                      number: prop1.number,
                      discount: prop1.discount,
                      finalAmount: prop1.finalAmount,
                      packing: prop1.packing ? prop1.packing : 0.00,
                      gst: prop1.gst,
                      hsn: prop1.hsn,
                      description: prop1.description,
                      service: prop1.service ? prop1.service : null,
                      unit: prop1.unit,
                      isSelected: prop1.isSelected,
                      requestQuantity: prop1.requestQuantity ? prop1.requestQuantity.toFixed(2) : 0.00,
                      orderQuantity: prop1.requestQuantity ? prop1.requestQuantity.toFixed(2) : 0,
                      rate: prop1.rate,
                      _id: prop1._id,
                      remainingQty: prop1.remainingQty ? prop1.remainingQty.toFixed(2) : 0.00,
                    })
                    return
                  }
                }
              }

              return
            })
            _this.setState({ module: tempData });
            _this.state.module.orderData.map(x => {
              x.rate.map(s => {
                if (_this.state.module.vendor.id === s.vendorId && x.service.id === s.service) {
                  x.rate = s.listPrice
                }
              })
              return
            })
            _this.setState({ module: tempData });
            _this.setState({ vendorStockData: _this.state.module.priceData });
          })
      } else { return }
    }
  }
  fetchHistory(id) {
    let _this = this;
    getPurchaseOrderList("history=" + id,
      function success(data) {
        let tempData = data.rows.map((prop, key) => {
          return ({
            prop: prop,
            date: prop.createdAt ? Moment(prop.createdAt).format('DD-MMM-YYYY') : "",
            code: (<a role="button" className="edit-link" href={"#/purchase/orders-edit/" + prop.code}>{prop.number}</a>),
            vendor: (
              <a role="button" className="edit-link" href={"#/purchase/vendor-edit/" + prop.vendor.code}>{prop.vendor ? prop.vendor.name : ""}</a>

            ),
          });
        })
        _this.setState({ vendorHistory: tempData, })
      },

    );

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
    this.state.module.vendor === null ?
      this.setState({ vendorError: "Select vendor name", vendorValid: false }) :
      this.setState({ vendorError: "", vendorValid: true })

    this.state.module.billingAddr === null ?
      this.setState({ billingAddrError: "Select billing address", billingAddrValid: false }) :
      this.setState({ billingAddrError: "", billingAddrValid: true })

    this.state.module.contact === null ?
      this.setState({ contactError: "Select contact", contactValid: false }) :
      this.setState({ contactError: "", contactValid: true })
    this.state.module.type === "" ?
      this.setState({ typeError: "Select type", typeValid: false }) :
      this.setState({ typeError: "", typeValid: true })
    this.state.module.poType === "" ?
      this.setState({ poTypeError: "Select po type", poTypeValid: false }) :
      this.setState({ poTypeError: "", poTypeValid: true })
    this.state.module.plant === null ?
      this.setState({ plantError: "Select plant name", plantValid: false }) :
      this.setState({ plantError: "", plantValid: true })
    setTimeout(this.saveCheck, 10);
  }

  saveCheck() {
    let _this = this;
    if (_this.state.vendorValid && _this.state.billingAddrValid && _this.state.plantValid && _this.state.contactValid && _this.state.typeValid) {
      if (this.state.module.orderData.length > 0) {
        let tempModule = JSON.parse(JSON.stringify(this.state.module));
        if (tempModule.type === "Service") {
          if (this.state.module.code === "New") {
            setTimeout(this.saveConfirm, 10);
          }
          else {
            setTimeout(this.save, 10);
          }
        }
        else {
          if (tempModule.orderData.filter(x => { return x.isSelected > 0 }).length > 0) {
            if (tempModule.orderData.filter(x => { return x.orderQuantity > 0 }).length > 0) {
              if (this.state.module.code === "New") {
                _this.setState({ formError: "" })
                setTimeout(this.saveConfirm, 10);
              }
              else {
                setTimeout(this.save, 10);
              }
            }
            else {
              _this.setState({ formError: "Please enter order QTY." })

            }
          }
          else {
            _this.setState({ formError: "Please select minmum one material." })

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
  save() {
    let _this = this;
    let tempStatus = tempStatus;
    let tempModule = JSON.parse(JSON.stringify(this.state.module));
    if (tempModule.isQa === false) { tempModule.status === "Receiving" }
    if (tempModule.status === "Approved") { tempStatus = "Purchase order approved" }
    else if (tempModule.status === "New" || tempModule.status === "Receiving") { tempStatus = "Purchase order saved" }
    else if (tempModule.status === "Closed") { tempStatus = "Purchase order closed" }
    if (_this.state.vendorValid && _this.state.billingAddrValid && _this.state.plantValid && _this.state.contactValid && _this.state.typeValid) {

      tempModule.vendor = tempModule.vendor ? tempModule.vendor.id : "";
      tempModule.plant = tempModule.plant ? tempModule.plant.id : null;
      tempModule.contact = tempModule.contact ? tempModule.contact.id : null;
      tempModule.billingAddr = tempModule.billingAddr ? tempModule.billingAddr.id : null;
      tempModule.deliveryAddr = tempModule.deliveryAddr ? tempModule.deliveryAddr.id : null;
      if (tempModule.orderData.length > 0) {
        tempModule.orderData.map(x => {
          x._id = x._id ? x._id : null;
          x.inventoryType = x.inventoryType ? x.inventoryType : null;
          if (x.purchaseRequest._id !== undefined) {
            x.purchaseRequest = x.purchaseRequest ? x.purchaseRequest._id : null;
          }
          else {
            x.purchaseRequest = x.purchaseRequest ? x.purchaseRequest.id : null;
          }
          x.inventory = x.inventory ? x.inventory.id : null;
          x.assetName = x.asset ? x.asset.name : null;
          x.asset = x.asset ? x.asset.id : null;
          x.service = x.service ? x.service.id : null;
        })

        if (tempModule.orderData.filter(x => { return x.orderQuantity > 0 }).length > 0) {
          if (this.state.module.code === "New") {
            delete tempModule.code;
            createPurchaseOrder(tempModule,
              function success(data) {
                _this.successAlert(" Purchase order added successfully!");
                setTimeout(() => {
                  _this.props.handleClosePurchaseOrderModal();
                  _this.props.history.push("/purchase/orders");
                }, 2000);
              },
              function error(data) {
                _this.errorAlert("Error in creating purchase order");
              }
            )
          } else {
            if (tempModule.purchaseHistory.length > 0) {
              for (var i = 0; i < tempModule.purchaseHistory.length; i++) {
                tempModule.purchaseHistory[i].vendor = tempModule.purchaseHistory[i].vendor ? tempModule.purchaseHistory[i].vendor.id : null;
                tempModule.purchaseHistory[i].po = tempModule.purchaseHistory[i].po ? tempModule.purchaseHistory[i].po.id : null;
              }
            }
            updatePurchaseOrder(tempModule,
              function success(data) {
                _this.successAlert(tempStatus + " " + "successfully!");
              },
              function error(data) {
                _this.errorAlert("Error in saving purchase order");
              }
            )
          }
        }
        else {
          _this.setState({ formError: "Please enter order QTY." })
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
  changeOrderStatus(status) {
    let obj = this.state.module;
    obj.status = status;
    this.setState({ module: obj });
    this.save();
  }
  handleCheckedRadioButton(e) {
    var moduleRadio = this.state.module;
    moduleRadio[e.target.name] = e.target.value;
    this.setState({ module: moduleRadio });
  }
  handleMultipleDocumentChange(newDocument) {
    var modules = this.state.module;
    modules.documents = newDocument.documents;
    this.setState({ modules });
  }
  handleDeleteDocument(key) {
    let modules = this.state.module;
    modules.documents.slice();
    modules.documents.splice(key, 1);
    this.setState({ modules });
  }
  handleCheckbox(e) {
    var newdata = this.state.module;
    newdata[e.target.name] = e.target.checked;
    this.setState({ module: newdata });
  }
  handleDropDownChangeType(selectOption, type) {
    var newPurchaseRequest = this.state.module;
    newPurchaseRequest[type] = selectOption ? selectOption.value : null;
    this.setState({ module: newPurchaseRequest, vendorList: [], contactList: [], addressList: [] });
    this.fetchInventoryData();
  }
  handleDropDownChange(selectOption, type) {
    var newPurchaseRequest = this.state.module;
    newPurchaseRequest[type] = selectOption ? selectOption.value : null;
    this.setState({ module: newPurchaseRequest });
  }
  handleTextInputChange(e) {
    var tempModule = this.state.module;
    tempModule[e.target.name] = e.target.value;
    this.setState({ inventory: tempModule, [e.target.name + 'Valid']: true, formError: "" });
  }

  handleInputChange(e, param) {
    var newObj = this.state.module;
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
        this.setState({ module: newObj });
      } else if (e.target.name.indexOf("radio_") !== -1) {
        newObj[e.target.name.split("_")[1]] = e.target.value;
        this.setState({ module: newObj });
      } else {
        if (e.target.type === "number") newObj[e.target.name] = parseFloat(e.target.value);
        else newObj[e.target.name] = e.target.value;
        this.setState({ module: newObj });
      }
    }
  }
  handleDateChange(name, date) {
    var moduleTemp = this.state.module;
    moduleTemp[name] = date._d;
    this.setState({ moduleTemp });
  }

  handleShowAddRawMaterialModal() { this.setState({ showAddRawMaterialModal: true }); }
  handleCloseAddRawMaterialModal() { this.setState({ showAddRawMaterialModal: false }); }
  handleShowGrnModal() { this.setState({ showGrnModal: true }); }
  handleCloseGrnModal() { this.setState({ showGrnModal: false }); this.fetchDataFromServer() }


  renderIsSelectedCheckBox(row) {
    return (
      <div>
        <Col xs={1}>
          <FormGroup>
            {this.state.module.terms[row.index].isSelected === false ?
              <Checkbox
                inline
                number={"isChecked" + row.index}
                name={"isChecked"}
                checked={this.state.module.terms[row.index].isSelected}
                onChange={(e) => {
                  let tempObj = this.state.module.terms;
                  tempObj[row.index].isSelected = e.target.checked;
                  this.setState({ tempObj });
                }}
              />
              :
              <div><span className="fa fa-check" style={{ color: "darkgreen" }}></span></div>
            }
          </FormGroup>
        </Col>
      </div>
    );
  }
  handleRadio = event => {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  };
  render() {
    const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const list = (<Tooltip id="save_tooltip"> Purchase order list</Tooltip>);
    const grn = (<Tooltip id="GRN_tooltip">Create new GRN</Tooltip>);
    const vendor = (<Tooltip id="open_tooltip">Vendor wise price</Tooltip>);

    let _this = this;
    let className;
    { this.state.module.code === "New" ? className = "fa fa-plus" : className = "fa fa-eye" }
    let vendorInfo = (
      <div>
        <Row>
          <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              {this.state.module.code === "New" ?

                <div>
                  <ControlLabel>Request type <span className="star">*</span></ControlLabel>
                  <Select
                    disabled={this.state.module.code !== "New" ? true : false}
                    clearable={false}
                    placeholder="Select type"
                    name="type"
                    value={this.state.module.type}
                    options={[
                      { value: "Store", label: "Store" },
                      { value: "Asset", label: "Asset" },
                      { value: "Service", label: "Service" },
                    ]}
                    onChange={(selectOption) => this.handleDropDownChangeType(selectOption, "type")}
                    style={{ color: this.state.typeValid || this.state.typeValid === null ? "" : errorColor, borderColor: this.state.typeValid || this.state.typeValid === null ? "" : errorColor }}
                  />
                </div>
                :
                <ControlLabel><b>Request type:</b><br />{this.state.module.type ? this.state.module.type : ""}</ControlLabel>

              }
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              {this.state.module.code === "New" ?
                <div>
                  <ControlLabel>Vendor Name <span className="star">*</span> </ControlLabel>
                  <Select
                    disabled={this.state.module.code !== "New" ? true : false}
                    clearable={false}
                    placeholder="Select vendor"
                    name="name"
                    options={this.state.vendorList}
                    value={this.state.module.vendor ? this.state.module.vendor.id : null}
                    onChange={(selectedOption) => this.handleInputChange(selectedOption, 'vendor')}
                    style={{ color: this.state.vendorValid || this.state.vendorValid === null ? "" : errorColor, borderColor: this.state.vendorValid || this.state.vendorValid === null ? "" : errorColor }}
                  />
                </div>
                :
                <ControlLabel><b>Vendor Name :</b><br />{this.state.module.vendor ? this.state.module.vendor.name : null}</ControlLabel>

              }
              <div>
                {
                  this.state.module.vendor ?
                    <small>
                      Email: {this.state.module.vendor.email}<br />
                      Phone: {this.state.module.vendor.phone}<br />
                    </small>
                    : null
                }
              </div>
            </FormGroup>
          </Col>

          {
            this.state.module.vendor !== null ?
              <Col xs={12} sm={6} md={3} lg={3}>
                <FormGroup>
                  {this.state.module.code === "New" ?
                    <div>
                      <ControlLabel>Contact <span className="star">*</span> </ControlLabel>
                      <div >
                        <span
                          className="input-group"
                          disabled={this.state.module.vendor ? false : true}
                        >
                          <Select
                            disabled={this.state.module.code !== "New" ? true : false}
                            clearable={false}
                            placeholder="Select contact"
                            name="contact"
                            options={this.state.contactList}
                            value={this.state.module.contact ? this.state.module.contact.id : null}
                            onChange={(selectedOption) => this.handleInputChange(selectedOption, 'contact')}
                            style={{ color: this.state.contactValid || this.state.contactValid === null ? "" : errorColor, borderColor: this.state.contactValid || this.state.contactValid === null ? "" : errorColor }}
                          />
                          <span className="input-group-addon">
                            <a role="button" className={className} onClick={() => this.setState({ showContactModal: true })} >{null}</a>
                          </span>
                        </span>
                      </div>
                    </div>
                    :
                    <ControlLabel><b>Contact :</b><br />{this.state.module.contact ? this.state.module.contact.name : null}</ControlLabel>

                  }
                  <div>
                    {
                      this.state.module.contact ?
                        <small>
                          Email: {this.state.module.contact ? this.state.module.contact.email : null}<br />
                          Phone: {this.state.module.contact ? this.state.module.contact.phone : null}<br />
                        </small>
                        : null
                    }
                  </div>
                </FormGroup>
              </Col>
              : null
          }
          {
            this.state.module.vendor !== null ?
              <Col xs={12} sm={6} md={3} lg={3}>
                <FormGroup>
                  {this.state.module.code === "New" ?
                    <div>
                      <ControlLabel>Billing Address<span className="star">*</span> </ControlLabel>
                      <div>
                        <span
                          className="input-group"
                          disabled={this.state.module.vendor ? false : true}
                        >
                          <Select
                            disabled={this.state.module.code !== "New" ? true : false}
                            clearable={false}
                            placeholder="Select billing address"
                            name="billingAddr"
                            options={this.state.addressList.filter(prop => {
                              return (prop.type === "Billing")
                            })}
                            value={this.state.module.billingAddr ? this.state.module.billingAddr.id : null}
                            onChange={(selectedOption) => this.handleInputChange(selectedOption, 'billingAddr')}
                            style={{ color: this.state.billingAddrValid || this.state.billingAddrValid === null ? "" : errorColor, borderColor: this.state.billingAddrValid || this.state.billingAddrValid === null ? "" : errorColor }}
                          />
                          <span className="input-group-addon">
                            <a role="button" className={className} onClick={() => this.setState({ showAddressModal: true })}  >{null}</a>
                          </span>
                        </span>
                      </div>
                    </div>
                    :
                    <ControlLabel><b>Billing Address :</b><br />{this.state.module.billingAddr ? this.state.module.billingAddr.name : null}</ControlLabel>

                  }
                  <div>
                    {
                      this.state.module.billingAddr ?
                        <div style={{ textTransform: "lowercase" }} class="labelName">
                          <ControlLabel pullRight> {this.state.module.billingAddr.street_address}</ControlLabel><br />
                          <ControlLabel pullRight>City: {this.state.module.billingAddr.city}</ControlLabel><br />
                          <ControlLabel pullRight>Postal Code: {this.state.module.billingAddr.zipcode}</ControlLabel>
                        </div>
                        : null
                    }

                  </div>

                </FormGroup>
              </Col>
              : null
          }
        </Row>
      </div>
    );
    let plantDetails = (
      <div>
        <Row>
          <Col xs={12} sm={6} md={2} lg={2}>
            <FormGroup>
              {this.state.module.code === "New" ?
                <div>
                  <ControlLabel>Plant <span className="star">*</span></ControlLabel>
                  <div>
                    <Select
                      disabled={this.state.module.code !== "New" ? true : false}
                      clearable={false}
                      placeholder="Select plant"
                      name="plant"
                      options={this.state.plantList}
                      value={this.state.module.plant ? this.state.module.plant.id : null}
                      onChange={(selectedOption) => this.handleInputChange(selectedOption, 'plant')}
                      style={{ color: this.state.plantValid || this.state.plantValid === null ? "" : errorColor, borderColor: this.state.plantValid || this.state.plantValid === null ? "" : errorColor }}
                    />
                  </div>
                </div>
                :
                <ControlLabel><b>Plant Name :</b><br />{this.state.module.plant ? this.state.module.plant.name : null}</ControlLabel>

              }
            </FormGroup>

          </Col>
          <Col md={2}>
            <FormGroup><div>
              <Checkbox inline
                number="432"
                name="isQa"
                label="QA Approval"
                onChange={this.handleCheckbox}
                checked={this.state.module.isQa}
              />
            </div>
            </FormGroup>
          </Col>
        </Row>
      </div>
    )
    // let customFields = (
    //   <div>
    //     <Col xs={12}>
    //       <Row>
    //         {
    //           _this.state.moduleForm.custom.map(function (item, key) {
    //             return (
    //               <Col xs={12} sm={6} md={4} lg={4} key={key} hidden={!item.value}>
    //                 <FormGroup>
    //                   <ControlLabel>{item.label}</ControlLabel>
    //                   <FormControl
    //                     disabled={this.state.module.code !== "New" ? true : false}
    //                     name={"custom_" + key}
    //                     type="text"
    //                     placeholder={item.label}
    //                     value={_this.state.module.custom[key] ? _this.state.module.custom[key] : ""}
    //                     onChange={_this.handleInputChange}
    //                   />
    //                 </FormGroup>
    //               </Col>
    //             )
    //           })
    //         }
    //         <Col xs={12} sm={12} md={12} lg={12}>
    //           <FormGroup>
    //             <ControlLabel>Terms and Coditions:</ControlLabel>
    //             <textarea
    //               className="form-control"
    //               disabled={this.state.module.code !== "New" ? true : false}
    //               name="notes"
    //               type="text"
    //               placeholder="Terms and coditions"
    //               value={_this.state.module.notes ? _this.state.module.notes : ""}
    //               onChange={_this.handleInputChange}>
    //             </textarea>
    //           </FormGroup>
    //         </Col>
    //       </Row>
    //     </Col>
    //   </div>
    // );

    let actions = (
      <div>
        <center><h5 className="text-danger">{this.state.formError}</h5></center>
        <Col xs={12} sm={6} md={3} lg={3}>
          {this.props.match.path !== "/purchase/purchaserequest" ?
            <OverlayTrigger placement="top" overlay={back}>
              <Button bsStyle="warning" fill icon disabled={this.state.settings} onClick={this.props.history.goBack}><span className="fa fa-arrow-left"></span></Button>
            </OverlayTrigger>
            : null
          }
          {this.props.match.path !== "/purchase/purchaserequest" ?
            <OverlayTrigger placement="top" overlay={list}>
              <Button bsStyle="primary" fill icon disabled={this.state.settings} onClick={() => { return this.props.history.push("/purchase/orders"); }}><span className="fa fa-list"></span></Button>
            </OverlayTrigger>
            : null
          }
        </Col>
        <Col md={6} lg={6} sm={12} xs={12}>
        </Col>
        <Col xs={12} sm={6} md={3} lg={3}>
          {this.state.module.code === "New" ?
            this.state.module.status !== "Closed" ?
              <OverlayTrigger placement="top" overlay={save}>
                <Button bsStyle="success" fill pullRight icon disabled={this.state.settings} onClick={this.validationCheck}> <span className="fa fa-save"></span>
                </Button>
              </OverlayTrigger>
              : null
            : null
          }

          {this.state.module.type !== "Asset" ?
            this.state.module.id && (this.state.module.status !== "Closed") ? (
              <OverlayTrigger placement="top" overlay={grn}>
                <Button bsStyle="primary" fill pullRight icon disabled={this.state.settings} onClick={this.handleShowGrnModal}> <span className="fa fa-truck"></span>
                </Button>
              </OverlayTrigger>
            ) : null
            : null
          }


        </Col>
      </div>
    );
    let orderTable = (
      <PurchaseOrderTableComponent
        order={this.state.module}
        purchaseRequestList={this.state.purchaseRequestList}
        inventoryList={this.state.inventoryList}
        assetList={this.state.assetList}
        serviceList={this.state.serviceList}
        saveRawMaterialToModule={this.saveRawMaterialToModule}
        {...this.props}
      />

    );
    let addEditGrnModal = (
      <GrnModalComponent
        showGrnModal={this.state.showGrnModal}
        handleCloseGrnModal={this.handleCloseGrnModal}
        order={this.state.module}
        {...this.props}
      />
    );
    let printModal = (
      <Modal
        show={this.state.showPrintModal}
        onHide={() => this.setState({ showPrintModal: false })}>
        <Modal.Footer>
          <Button simple onClick={() => this.setState({ showPrintModal: false })} >Close</Button>
          <Button bsStyle="success" fill onClick={() => { }} >Add to module</Button>
        </Modal.Footer>
      </Modal>
    );
    let vendorWiseStockModal = (
      <Modal
        dialogClassName="large-modal"
        show={this.state.showVendorWiseStockModal}
        onHide={() => {
          this.setState({ showVendorWiseStockModal: false });
          this.fetchDataFromServer("vendor");
        }}>

        <Modal.Body className="cardModal">
          <Col xs={12}>
            {
              this.state.vendorStockData.length
                ? (
                  <ReactTable
                    data={this.state.vendorStockData}
                    columns={[
                      { Header: "Sr", id: "slno", Cell: d => { return <div>{d.index + 1}</div> }, width: 50 },
                      { Header: "Vendor", accessor: "vendorName", },
                      { Header: "Material Name", accessor: "material", },
                      { Header: " Rate", accessor: "price" },
                    ]}
                    minRows={0}
                    sortable={false}
                    className="-striped -highlight"
                    showPaginationTop={false}
                    showPaginationBottom={false}
                  />
                ) : (
                  <Col xs={12}>No vendor selected.</Col>
                )
            }
          </Col>
        </Modal.Body>
      </Modal>
    )
    let vendorModal = (
      <Modal
        dialogClassName="large-modal"
        show={this.state.showVendorModal}>
        <Modal.Header class="header1">
          <div className="text-right">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => {
              this.setState({ showVendorModal: false }); this.fetchDataFromServer("vendor");
            }}>{null}</a>
          </div>
          <Modal.Title>Add/Update Vendor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VendorsFormComponent {...this.props}
            className={className}
            vendor={this.state.module.vendor} />
        </Modal.Body>
      </Modal>
    )
    let addressModal = (
      <Modal
        dialogClassName="large-modal"
        show={this.state.showAddressModal}>
        <Modal.Header class="header1" >
          <div className="text-right">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => {
              this.setState({ showAddressModal: false }); this.getAddressForVendor(this.state.module.vendor.id);
            }}>{null}</a>
          </div>
          <Modal.Title>Add/Update Address</Modal.Title>
        </Modal.Header>
        <Modal.Body className="cardModal">
          <Col xs={12}>
            <AddressesListComponent {...this.props}
              className={className}
              vendor id={this.state.module.vendor ? this.state.module.vendor.id : null} />
          </Col>
        </Modal.Body>
      </Modal>
    )
    let contactModal = (
      <Modal
        dialogClassName="large-modal"
        show={this.state.showContactModal}>
        <Modal.Header class="header1" >
          <div className="text-right">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => {
              this.setState({ showContactModal: false }); this.getContactForVendor(this.state.module.vendor.id);
            }}>{null}</a>
          </div>
          <Modal.Title>Add/Update Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body className="cardModal">
          <Col xs={12}>
            <ContactsListComponent {...this.props}
              className={className}
              vendor id={this.state.module.vendor ? this.state.module.vendor.id : null} />
          </Col>
        </Modal.Body>
      </Modal>
    )
    let moduleInfoTabs = (
      <Tab.Container defaultActiveKey="materials" id="order-details">
        <div className="clearfix">
          <Nav bsStyle="tabs">
            <NavItem className="" eventKey="materials"> <i className="fa fa-suitcase" /> Inventory Details
              </NavItem>

            {this.state.module.type === "Service"
              ?
              <NavItem className="" eventKey="subject">Subject Details </NavItem>
              : null
            }
            {this.props.match.params.pocode !== "new"
              ?
              <NavItem className="" eventKey="terms">Terms and Coditions </NavItem>
              : null
            }
            {this.props.match.path !== "/purchase/purchaserequest" ?
              this.props.match.params.pocode !== "new"
                ? (<NavItem className="" eventKey="documents"><i className="fa fa-file" />  Documents
                    </NavItem>
                ) : null
              : null
            }
            {this.props.match.path !== "/purchase/purchaserequest" ?
              this.props.match.params.pocode !== "new"
                ? (<NavItem className="" eventKey="GRN"> <i className="fa fa-truck text-default" /> GRN
                    </NavItem>
                ) : null
              : null
            }
          </Nav>
          <Col xs={12}>
            <Tab.Content animation>
              <Tab.Pane eventKey="materials">
                <Row> {orderTable}</Row>
              </Tab.Pane>
              <Tab.Pane eventKey="documents">
                <div hidden={this.props.match.params.pocode === "new" ? true : false}>
                  <Row>
                    <Row>
                      <UploadComponent
                        document
                        type="purchaseorders"
                        documents={this.state.module.documents}
                        details={this.state.module}
                        dropText="Drop files or click here"
                        handleMultipleDocumentChange={this.handleMultipleDocumentChange}
                        handleDeleteDocument={this.handleDeleteDocument}
                      />
                    </Row>
                  </Row>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="history">
                <Row>
                  {
                    this.state.vendorHistory.length
                      ? (
                        <ReactTable
                          data={this.state.vendorHistory}
                          columns={[
                            { Header: "Sr", id: "slno", Cell: d => { return <div>{d.index + 1}</div> }, width: 50 },
                            { Header: "Date", accessor: "date", },
                            { Header: "PO Number", accessor: "code", },
                            { Header: "Vendor", accessor: "vendor" },]}
                          minRows={0}
                          sortable={false}
                          className="-striped -highlight"
                          showPaginationTop={false}
                          showPaginationBottom={false}
                        />
                      ) : (
                        <div>No history found.</div>
                      )
                  }
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="subject">
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <FormGroup>
                      <ControlLabel>Subject Details:</ControlLabel>
                      <textarea
                        className="form-control"
                        disabled={this.state.module.code !== "New" ? true : false}
                        name="notes"
                        type="text"
                        placeholder=""
                        value={_this.state.module.notes ? _this.state.module.notes : ""}
                        onChange={_this.handleInputChange}>
                      </textarea>
                    </FormGroup>
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="terms">
                <Row>

                  {
                    this.state.module.terms.length ?
                      < ReactTable
                        data={this.state.module.terms}
                        columns={[
                          { Header: "SR", id: "sr", Cell: (d => { return (<div>{d.index + 1}</div>) }), width: 50 },
                          { Header: "", accessor: "isSelected", width: 50, Cell: this.renderIsSelectedCheckBox },
                          { Header: "Terms & Conditions", accessor: "term", sortable: false, },
                        ]
                        }

                        minRows={0}
                        sortable={false}
                        className="-striped -highlight"
                        showPaginationTop={false}
                        showPaginationBottom={false}
                      />
                      :
                      <div>No terms and conditions found.</div>
                  }
                </Row>

              </Tab.Pane>
              <Tab.Pane eventKey="GRN">
                <Row>
                  <Row>
                    {this.state.module.id !== undefined ?
                      <GrnListComponent ordercode={this.state.module.id} {...this.props}>
                      </GrnListComponent>
                      : null
                    }
                  </Row>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </div>
      </Tab.Container>
    );
    let form = (
      <Row>
        <fieldset>
          <Col xs={12}>
            <Col xs={12}>
              <Col xs={12} sm={3} md={3} lg={3}>
                {this.props.match.path !== "/purchase/purchaserequest" ?
                  <FormGroup>
                    <ControlLabel><b>Status:</b><br /> {this.state.module.status ? this.state.module.status : ""}</ControlLabel>
                  </FormGroup>
                  : null
                }
              </Col>
              {this.props.match.path !== "/purchase/purchaserequest" ?
                <Col xs={12} sm={3} md={3} lg={3}>
                  <FormGroup>
                    <ControlLabel><b> PO Number:</b><br /> {this.state.module.code ? this.state.module.number : "new"}</ControlLabel>
                  </FormGroup>
                </Col>
                : null
              }
              <Col xs={12} sm={3} md={3} lg={3}>
                <FormGroup>
                  <ControlLabel> <b>Created By:</b><br /> {this.state.module.user ? this.state.module.user.name : cookie.load('user')}</ControlLabel>
                </FormGroup>
              </Col>
              <Col xs={12} sm={3} md={3} lg={3}>
                <FormGroup>
                  <ControlLabel><b>Creation Time:</b><br /> {this.state.module.createdAt ? Moment(this.state.module.createdAt).format('DD MMM YYYY hh:mm A') : Moment().format('DD MMM YYYY hh:mm A')}</ControlLabel>
                </FormGroup>
              </Col>
            </Col>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Col xs={12} sm={4} md={3} lg={3}>
              <div className="text-center"></div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              {this.props.modal ? <Col xs={12}><h6 className="section-header">Vendor Information</h6></Col> : <h6 className="section-header">Vendor Information</h6>}
              {this.props.modal ? <Col xs={12}>{vendorInfo}</Col> : <Col xs={12}>{vendorInfo}</Col>}
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              {this.props.modal ? <Col xs={12}><h6 className="section-header">plant Details</h6></Col> : <h6 className="section-header">plant Details</h6>}
              {this.props.modal ? <Col xs={12}>{plantDetails}</Col> : <Col xs={12}>{plantDetails}</Col>}
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              {this.props.modal ? <Col xs={12}>{moduleInfoTabs}</Col> : <Col xs={12}>{moduleInfoTabs}</Col>}
            </Col>
          </Col>
        </fieldset>
      </Row >
    );
    return (
      <Row className="card-content">
        {this.state.alert}
        {addEditGrnModal}
        {printModal}
        {vendorWiseStockModal}
        {addressModal}
        {vendorModal}
        {contactModal}
        {this.props.modal ? <div>{form}</div> : <div className="card-form" style={{ display: "block" }}>{form}</div>}
        {this.props.modal ? <div className="card-footer">{actions}</div> : <div className="card-footer">{actions}</div>}
      </Row>
    );

  }
}

export default PurchaseModuleFormComponent;
