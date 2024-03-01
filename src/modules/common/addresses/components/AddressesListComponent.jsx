import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Col, FormGroup, FormControl, OverlayTrigger, Tooltip, } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import Select from "components/CustomSelect/CustomSelect.jsx";
import { stateList } from 'variables/appVariables.jsx';

import { getSocket } from "js/socket.io.js"
import { createAddress, updateAddress, deleteAddress, getAddressList } from "modules/common/addresses/server/AddressesServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";


class AddressesListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: getSocket(),
      addressList: [],
      editObj: null,
      page: 0,
      pageSize: 25,
      pages: 0,
      loading: true,
      filter: {
        name: "",
        type: "",
        city: "",
        postCode: "",
        vendor: null,
        customer: null,
        email: "",
        updated: false
      },
      vendor: props.vendor ? this.props.id : this.props.id,
      customer: props.customer ? this.props.id : this.props.id,
      nameError: false,
      alert: null,
      typeError: false,
      cityError: false,
      stateError: false,
      street_addressError: false,
      zipcodeError: null,
      nameValid: null,
      typeValid: null,
      cityValid: null,
      stateValid: null,
      street_addressValid: null,
      zipcodeValid: null,
    }

    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.renderEditableDataType = this.renderEditableDataType.bind(this);
    this.renderEditableName = this.renderEditableName.bind(this);
    this.renderEditableCity = this.renderEditableCity.bind(this);
    this.renderEditableState = this.renderEditableState.bind(this);
    this.renderEditableZipcode = this.renderEditableZipcode.bind(this);
    this.renderEditableAddress = this.renderEditableAddress.bind(this);
    this.renderEditableLatitude = this.renderEditableLatitude.bind(this);
    this.renderEditableLongitude = this.renderEditableLongitude.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.filter = this.filter.bind(this);
  }
  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        this.state.socket.on("Address", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }
  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer();
  }
  componentWillReceiveProps(newProps) {
    this.props = newProps
    this.fetchDataFromServer();
  }
  delete(code) {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.deleteConfirm(code)}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="info"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this address!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteAddress(code,
      function success() {
        _this.successAlert("Address deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting contact.");
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
          onConfirm={() => { this.setState({ alert: null }); this.fetchDataFromServer() }}
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
  fetchDataFromServer() {
    let _this = this;
    var params = "";
    if ((!this.props.id && !this.props.list)) return;
    if (this.props.customer && this.props.id) params = "customer=" + this.props.id;
    if (this.props.vendor && this.props.id) params = "vendor=" + this.props.id;
    if (this.props.view) params = "view=" + this.props.view;
    if (this.state.filter.name) { params = params + "&name=" + this.state.filter.name.trim() }
    if (this.state.filter.postCode) { params = params + "&postCode=" + this.state.filter.postCode.trim() }
    if (this.state.filter.customer) { params = params + "&customer=" + this.state.filter.customer.trim() }
    if (this.state.filter.vendor) { params = params + "&vendor=" + this.state.filter.vendor.trim() }
    if (this.state.filter.type) { params = params + "&type=" + this.state.filter.type.trim() }
    if (this.state.filter.city) { params = params + "&city=" + this.state.filter.city.trim() }
    if (this.props.list) {
      params = params + "&page=" + this.state.page;
      params = params + "&pageSize=" + this.state.pageSize;
    }
    getAddressList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        var tempData = data.rows.map((prop, key) => {
          return {
            srNo: key + 1,
            code: prop.code ? prop.code : "",
            name: prop.name ? prop.name : "",
            type: prop.type ? prop.type : "",
            customer: prop.customer ? prop.customer : "",
            vendor: prop.vendor ? prop.vendor : "",
            street_address: prop.street_address ? prop.street_address : "",
            city: prop.city ? prop.city : "",
            state: prop.state ? prop.state : "",
            zipcode: prop.zipcode ? prop.zipcode : "",
            latitude: prop.latitude ? prop.latitude : "",
            longitude: prop.longitude ? prop.longitude : "",
          };
        })
        _this.setState({ addressList: tempData, pages: pages, loading: false })

      },
      function error(error) { _this.setState({ addressList: [] }); }
    );
  }
  validationCheck(obj) {
    obj.name === "" ?
      this.setState({ nameError: "ENTER NAME", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })
    obj.type === "" ?
      this.setState({ typeError: "ENTER ADDRESS", typeValid: false }) :
      this.setState({ typeError: "", typeValid: true })
    obj.city === "" ?
      this.setState({ cityError: "ENTER city", cityValid: false }) :
      this.setState({ cityError: "", cityValid: true })
    obj.state === "" ?
      this.setState({ stateError: "ENTER state", stateValid: false }) :
      this.setState({ stateError: "", stateValid: true })
    obj.street_address === "" ?
      this.setState({ street_addressError: "ENTER Address", street_addressValid: false }) :
      this.setState({ street_addressError: "", street_addressValid: true })
    obj.zipcode === "" ?
      this.setState({ zipcodeError: "ENTER zipcode", zipcodeValid: false }) :
      this.setState({ zipcodeError: "", zipcodeValid: true })
    setTimeout(this.save(obj), 10);
  }
  save(obj) {
    var _this = this;
    var pattern = /^(([0-9]{6,6}))$/;
    let tempAddress;
    if (this.props.view) {
      tempAddress = JSON.parse(JSON.stringify(obj))
      tempAddress.customer = tempAddress.customer ? tempAddress.customer.id : null;
      tempAddress.vendor = tempAddress.vendor ? tempAddress.vendor.id : null;
    }
    else {
      var index = this.state.addressList.indexOf(obj)
      tempAddress = JSON.parse(JSON.stringify(this.state.addressList[index]))
    }
    if (this.props.vendor) {
      tempAddress.vendor = _this.props.id;
      delete tempAddress.customer;
    }
    if (this.props.customer) {
      tempAddress.customer = _this.props.id;
      delete tempAddress.vendor;
    }

    if (tempAddress.type === "" && tempAddress.name === "" && tempAddress.city === "" && tempAddress.state === "" && tempAddress.zipcode === "") {
      _this.setState({ formError: "Please enter required fields" })
    }
    else if (tempAddress.type === "") { _this.setState({ formError: "Please select type" }) }
    else if (tempAddress.name === "") { _this.setState({ formError: "Please enter name " }) }
    else if (tempAddress.street_address === "") { _this.setState({ formError: "Please enter address" }) }
    else if (tempAddress.city === "") { _this.setState({ formError: "Please enter city" }) }
    else if (tempAddress.state === "") { _this.setState({ formError: "Please select state name" }) }
    else if (tempAddress.zipcode === "") { _this.setState({ formError: "Please enter postal code" }) }
    else if (pattern.test(obj.zipcode) === false) { _this.setState({ formError: "Postal code should be 6 digits" }) }

    else {
      (!tempAddress.code) ? (
        createAddress(tempAddress,
          function success() {
            _this.successAlert("Address added successfully!");
          },
          function error(res) {
            if (res.message === 'Request failed with status code 701') { _this.errorAlert("Duplicate name"); }
            else {
              _this.errorAlert("Something went wrong!")
            }
          }
        )
      ) :

        (updateAddress(tempAddress,
          function success() {
            _this.successAlert("Address saved successfully!");
          },
          function error() {
            _this.errorAlert("Error in creating address.");
          }
        )
        )
      _this.setState({ formError: "" })
    }
  }

  renderEditableDataType(cellInfo) {
    return (
      <FormGroup>
        <Select
          clearable={false}
          name="type"
          options={[
            { value: "Primary", label: "Primary" },
            { value: "Delivery Address", label: "Delivery Address" },
            { value: "Billing", label: "Billing" },
            { value: "Site", label: "Site" }
          ]}
          value={this.state.addressList[cellInfo.index].type}
          onChange={(option) => {
            let tempObj = this.state.addressList;
            tempObj[cellInfo.index].type = option ? option.value : null;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }

  renderEditableName(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          name="name"
          type="text"
          placeholder="Name"
          value={this.state.addressList[cellInfo.index].name}
          onChange={(e) => {
            let tempObj = this.state.addressList;
            tempObj[cellInfo.index].name = e.target.value;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }
  renderEditableCity(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          name="city"
          type="text"
          placeholder="City"
          value={this.state.addressList[cellInfo.index].city}
          onChange={(e) => {
            let tempObj = this.state.addressList;
            tempObj[cellInfo.index].city = e.target.value;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }

  renderEditableState(cellInfo) {
    return (
      <FormGroup>
        <Select
          clearable={false}
          name="State"
          options={stateList}
          value={this.state.addressList[cellInfo.index].state}
          onChange={(option) => {
            let tempObj = this.state.addressList;
            tempObj[cellInfo.index].state = option ? option.value : null;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }
  renderEditableZipcode(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          name="zipcode"
          type="text"
          minLength={6}
          maxLength={6}
          placeholder="Postal code"
          value={this.state.addressList[cellInfo.index].zipcode}
          onChange={(e) => {
            const re = /^[0-9\b]+$/;
            let tempObj = this.state.addressList;
            if (e.target.value === '' || re.test(e.target.value)) {
              tempObj[cellInfo.index].zipcode = e.target.value;
            }
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }
  renderEditableAddress(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          componentClass="textarea"
          name="street_address"
          type="text"
          rows={3}
          placeholder="Address"
          value={this.state.addressList[cellInfo.index].street_address}
          onChange={(e) => {
            let tempObj = this.state.addressList;
            tempObj[cellInfo.index].street_address = e.target.value;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }


  renderEditableLatitude(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          name="latitude"
          type="number"
          placeholder="Latitude"
          value={this.state.addressList[cellInfo.index].latitude}
          onChange={(e) => {
            let tempObj = this.state.addressList;
            tempObj[cellInfo.index].latitude = e.target.value;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }

  renderEditableLongitude(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          name="longitude"
          type="number"
          placeholder="Longitude"
          value={this.state.addressList[cellInfo.index].longitude}
          onChange={(e) => {
            let tempObj = this.state.addressList;
            tempObj[cellInfo.index].longitude = e.target.value;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }
  filter(e, name) {
    let tempFilter = this.state.filter;
    // tempFilter[name] = (name === "name" || name === "customer") ? e.target.value : e.value
    tempFilter[name] = e.target.value;
    this.setState({ tempFilter });
    setTimeout(() => this.fetchDataFromServer(), 100);
  }
  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const save = (<Tooltip id="edit_tooltip">Save</Tooltip>);
    const add = (<Tooltip id="edit_tooltip">Add new address</Tooltip>);
    var srNoCol = {
      Header: "Sr", accessor: "key", width: 50, sortable: false, Cell: (row => {
        let base = (this.state.page) * this.state.pageSize
        return (<div>{row.index + base + 1}</div>)
      })
    };
    var nameCol = { Header: "Name", accessor: "name", width: 250, Cell: this.renderEditableName };
    var customerCol = { Header: "Customer", accessor: "customer.name", width: 250 };
    var vendorCol = { Header: "Vendor", accessor: "vendor.name", width: 250 };
    var typeCol = { Header: "Type", accessor: "type", width: 150, Cell: this.renderEditableDataType };
    var addressCol = { Header: "Address", accessor: "street_address", width: 400, Cell: this.renderEditableAddress };
    var cityCol = { Header: "City", accessor: "city", Cell: this.renderEditableCity };
    var stateCol = { Header: "State", accessor: "state", width: 200, Cell: this.renderEditableState };
    var postalCodeCol = { Header: "Postal Code", accessor: "zipcode", width: 100, Cell: this.renderEditableZipcode };
    var latitudeCol = { Header: "Latitude", accessor: "latitude", show: (this.props.view ? false : true), width: 150, Cell: this.renderEditableLatitude };
    var longitudeCol = { Header: "Longitude", accessor: "longitude", show: (this.props.view ? false : true), width: 150, Cell: this.renderEditableLongitude };
    var actionCol = {
      Header: "", id: "code", width: 60, Cell: (row => {
        return (
          <div className="actions-right form-group">
            <OverlayTrigger placement="top" overlay={save}>
              <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.validationCheck(row.original)} ><span className="fa fa-save text-success"></span></Button>
            </OverlayTrigger>
            {cookie.load('role') === "admin" ?
              <OverlayTrigger placement="top" overlay={trash}>
                <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.original.code)} ><span className="fa fa-trash text-danger"></span></Button>
              </OverlayTrigger>
              : null
            }
          </div>
        )
      })
    };
    let table = (
      <Col xs={12}>
        {this.state.alert}
        {this.state.addressList.length
          ? (
            <ReactTable
              data={this.state.addressList}
              columns={
                this.props.vendor || this.props.view === "vendor" ?
                  [srNoCol, typeCol, nameCol, vendorCol, addressCol, cityCol, stateCol, postalCodeCol, latitudeCol, longitudeCol, actionCol]
                  :
                  [srNoCol, typeCol, nameCol, customerCol, addressCol, cityCol, stateCol, postalCodeCol, latitudeCol, longitudeCol, actionCol]
              }
              minRows={0}
              sortable={false}
              className="-striped -highlight"
              showPaginationTop={false}
              showPaginationTop={false}
              showPaginationBottom={this.props.view ? true : false}
              sortable={false}
              page={this.state.page}
              pageSize={this.state.pageSize}
              pages={this.state.pages}
              defaultPageSize={defaultPageSize}
              pageSizeOptions={pageSizeOptionsList}
              manual
              // onFetchData={this.fetchDataFromServer}
              onPageChange={(page) => { this.setState({ page: page }); setTimeout(() => this.fetchDataFromServer(), 100) }}
              onPageSizeChange={(pageSize) => { this.setState({ pageSize: pageSize, page: 0 }); setTimeout(() => this.fetchDataFromServer(), 100) }}
            />
          ) : (
            <div>No address list found.</div>
          )
        }
        <center><h5 className="text-danger">{this.state.formError}</h5></center>
        {this.props.className === "fa fa-plus" || this.props.className === undefined || this.props.view || this.props.customer || this.props.vendor ?
          this.props.view === undefined ?
            <OverlayTrigger placement="top" overlay={add}>
              <Button bsStyle="primary" fill icon
                onClick={() => {
                  var tempObj = this.state.addressList;
                  tempObj.push({ code: null, type: "", name: "", city: "", state: "", zipcode: "", street_address: "", latitude: "0", longitude: "0" })
                  this.setState({ tempObj })
                }}>
                <span className="fa fa-plus"></span>
              </Button>
            </OverlayTrigger>
            : null
          : null
        }
      </Col>

    );
    let header = (
      <div className="list-header">
        <Col xs={12} sm={4} md={2} lg={2}>
          <FormGroup>
            <FormControl
              type="text"
              name="type"
              placeholder="Search by type"
              onChange={(e) => this.filter(e, "type")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="name"
              placeholder="Search by name"
              onChange={(e) => this.filter(e, "name")}
            />
          </FormGroup>
        </Col>
        {
          this.props.view === "customer" || this.props.customer !== undefined ?
            <Col xs={12} sm={6} md={3} lg={3}>
              <FormGroup>
                <FormControl
                  type="text"
                  name="customer"
                  placeholder="Search by customer"
                  onChange={(e) => this.filter(e, "customer")}
                />
              </FormGroup>
            </Col>
            :
            <Col xs={12} sm={6} md={3} lg={3}>
              <FormGroup>
                <FormControl
                  type="text"
                  name="vendor"
                  placeholder="Search by vendor"
                  onChange={(e) => this.filter(e, "vendor")}
                />
              </FormGroup>
            </Col>
        }
        <Col xs={12} sm={4} md={2} lg={2}>
          <FormGroup>
            <FormControl
              type="text"
              name="city"
              placeholder="Search by city"
              onChange={(e) => this.filter(e, "city")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={4} md={2} lg={2}>
          <FormGroup>
            <FormControl
              type="text"
              name="postalCode"
              placeholder="Search by postal code"
              onChange={(e) => this.filter(e, "postalCode")}
            />
          </FormGroup>
        </Col>

      </div>
    );
    return (
      <div>
        {this.state.loading ?
          <div className="modal-backdrop in">
            <img src={loader} alt="loader" className="preLoader" />
          </div>
          :

          <div>
            {this.state.alert}
            {this.props.view ? header : null}
            {table}
          </div>
        }
      </div>
    );
  }
}




export default AddressesListComponent;
