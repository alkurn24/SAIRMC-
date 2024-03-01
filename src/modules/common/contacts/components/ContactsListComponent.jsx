import React, { Component } from "react";
import ReactTable from "react-table";
import Select from "components/CustomSelect/CustomSelect.jsx";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Col, FormGroup, FormControl, OverlayTrigger, Tooltip, } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getContactList, deleteContact, createContact, updateContact, } from "../server/ContactsServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";

class ContactsListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: getSocket(),
      contactList: [],
      editObj: null,
      page: 0,
      pageSize: 25,
      pages: 0,
      loading: true,
      filter: {
        name: "",
        type: "",
        email: "",
        vendor: null,
        customer: null,
        updated: false
      },
      vendor: props.vendor ? this.props.id : this.props.id,
      customer: props.customer ? this.props.id : this.props.id,
      nameError: false,
      emailError: false,
      phoneError: false,
      typeError: false,

      //Validation
      nameValid: null,
      emailValid: null,
      phoneValid: null,
      typeValid: null,
      formError: null
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
    this.renderEditableEmail = this.renderEditableEmail.bind(this);
    this.renderEditablePhone = this.renderEditablePhone.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.filter = this.filter.bind(this);

  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        this.state.socket.on("Contact", () => this.fetchDataFromServer())
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
          You will not be able to recover this contact!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteContact(code,
      function success() {
        _this.successAlert("Contact deleted successfully!")
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
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;

    if (this.props.customer && this.props.id) params = "customer=" + this.props.id;
    if (this.props.vendor && this.props.id) params = "vendor=" + this.props.id;
    if (this.props.match.path === "/sales/orders" || this.props.match.path === "/sales/schedule") params = "customer=" + this.props.id;
    if (this.props.view) params = "view=" + this.props.view;
    if (this.state.filter.name) { params = params + "&name=" + this.state.filter.name.trim() }
    if (this.state.filter.type) { params = params + "&type=" + this.state.filter.type.trim() }
    if (this.state.filter.email) { params = params + "&email=" + this.state.filter.email.trim() }
    if (this.state.filter.customer) { params = params + "&customer=" + this.state.filter.customer.trim() }
    if (this.state.filter.vendor) { params = params + "&vendor=" + this.state.filter.vendor.trim() }

    getContactList(params,
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
            email: prop.email ? prop.email : "",
            phone: prop.phone ? prop.phone : "",
          };
        })
        _this.setState({ contactList: tempData, pages: pages, loading: false })
      },
      function error(error) { _this.setState({ contactList: [] }); }
    );
  }
  validationCheck(obj) {
    obj.name === "" ?
      this.setState({ nameError: "Enter  name", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })
    obj.type === "" ?
      this.setState({ typeError: "Enter type", typeValid: false }) :
      this.setState({ typeError: "", typeValid: true })

    obj.phone === "" ?
      this.setState({ phoneError: "Enter contact no", phoneValid: false }) :
      this.setState({ phoneError: "", phoneValid: true })

    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    re.test(obj.email) === false ?
      this.setState({ emailError: "Email is required", emailValid: false }) :
      this.setState({ emailError: "", emailValid: true })

    var pattern = /^(([0-9]{10,10}))$/;
    pattern.test(obj.phone) === false ?
      this.setState({ phoneError: ("Mobile number should be 10 digits"), phoneValid: false }) :
      this.setState({ phoneError: "", phoneValid: true })
    setTimeout(this.save(obj), 10);
  }

  save(obj) {
    var _this = this;
    let tempContact;

    if (this.props.view) {
      tempContact = JSON.parse(JSON.stringify(obj))
      tempContact.customer = tempContact.customer ? tempContact.customer.id : null;
      tempContact.vendor = tempContact.vendor ? tempContact.vendor.id : null;
    }
    else {
      var index = _this.state.contactList.indexOf(obj)
      tempContact = JSON.parse(JSON.stringify(this.state.contactList[index]))
    }
    if (this.props.match.path === "/sales/orders" || this.props.match.path === "/sales/schedule") tempContact.customer = this.props.id
    if (this.props.customer) { tempContact.customer = _this.props.id }
    if (this.props.vendor) {
      tempContact.vendor = _this.props.id;
      delete tempContact.customer;
    }
    if (this.props.customer) {
      tempContact.customer = _this.props.id;
      delete tempContact.vendor;
    }
    if (tempContact.type === "" && tempContact.name === "") {
      _this.setState({ formError: "Please enter required fields" })
    }
    else if (tempContact.type === "") { _this.setState({ formError: "Please select type" }) }
    else if (tempContact.name === "") { _this.setState({ formError: "Please enter name " }) }
    else {
      (!tempContact.code) ? (
        createContact(tempContact,
          function success(data) {
            _this.successAlert("Contact added successfully!");
          },
          function error(res) {
            if (res.message === 'Request failed with status code 701') { _this.errorAlert("Duplicate name"); }
            else {
              _this.errorAlert("Something went wrong!")
            }
          }
        )
      ) :

        updateContact(tempContact,
          function success(data) {
            _this.successAlert("Contact saved successfully!");
          },
          function error(data) {
            _this.errorAlert("Error in creating contact.");
          }
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
            { value: "Shipping", label: "Shipping" },
            { value: "Finance", label: "Finance" },
            { value: "Site", label: "Site" }
          ]}
          value={this.state.contactList[cellInfo.index].type}
          onChange={(option) => {
            let tempObj = this.state.contactList;
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
          placeholder="Enter name"
          value={this.state.contactList[cellInfo.index].name}
          onChange={(e) => {
            let tempObj = this.state.contactList;
            tempObj[cellInfo.index].name = e.target.value;
            this.setState({ tempObj })

          }}
        />
      </FormGroup>
    );
  }
  renderEditableEmail(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          name="email"
          type="email"
          placeholder="Enter email"
          value={this.state.contactList[cellInfo.index].email}
          onChange={(e) => {
            let tempObj = this.state.contactList;
            tempObj[cellInfo.index].email = e.target.value.toLowerCase();
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }

  renderEditablePhone(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          name="phone"
          type="text"
          minLength={10}
          maxLength={10}
          placeholder="Enter phone"
          value={this.state.contactList[cellInfo.index].phone}
          onChange={(e) => {
            const re = /^[0-9\b]+$/;
            let tempObj = this.state.contactList;
            if (e.target.value === '' || re.test(e.target.value)) {
              tempObj[cellInfo.index].phone = e.target.value;
            }
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
    const add = (<Tooltip id="edit_tooltip">Add new contact</Tooltip>);
    var srNoCol = {
      Header: "Sr", accessor: "key", width: 50, sortable: false, Cell: (row => {
        let base = (this.state.page) * this.state.pageSize
        return (<div>{row.index + 1 + base}</div>)
      })
    }
    var typeCol = { Header: "Type", accessor: "type", Cell: this.renderEditableDataType };
    var customerCol = { Header: "Customer", accessor: "customer.name", width: 250 };
    var vendorCol = { Header: "Vendor", accessor: "vendor.name", width: 250 };
    var nameCol = { Header: "Name", accessor: "name", Cell: this.renderEditableName }
    var emailCol = { Header: "Email", accessor: "email", Cell: this.renderEditableEmail }
    var phoneCol = { Header: "Phone", accessor: "phone", Cell: this.renderEditablePhone }
    var actionCol = {
      Header: "", id: "actions", width: 60, Cell: (row => {
        return <div className="actions-right form-group">
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
      })
    }
    let table = (
      <Col xs={12}>
        {this.state.alert}
        {this.state.contactList.length
          ? (
            <ReactTable
              data={this.state.contactList}
              columns={
                this.props.vendor || this.props.view === "vendor" ?
                  [srNoCol, typeCol, nameCol, vendorCol, emailCol, phoneCol, actionCol]
                  :
                  [srNoCol, typeCol, nameCol, customerCol, emailCol, phoneCol, actionCol]
              }
              minRows={0}
              sortable={false}
              className="-striped -highlight"
              showPaginationTop={false}
              showPaginationBottom={this.props.view ? true : false}
              loading={this.state.loading}
              pageSize={this.state.pageSize}
              page={this.state.page}
              pages={this.state.pages}
              defaultPageSize={defaultPageSize}
              pageSizeOptions={pageSizeOptionsList}
              onPageChange={(page) => { this.setState({ page: page }); setTimeout(() => this.fetchDataFromServer(), 100) }}
              onPageSizeChange={(pageSize) => { this.setState({ pageSize: pageSize, page: 0 }); setTimeout(() => this.fetchDataFromServer(), 100) }}
              manual
            />
          ) : (
            <div>No contact list found.</div>
          )
        }
        <center><h5 className="text-danger">{this.state.formError}</h5></center>
        {this.props.className === "fa fa-plus" || this.props.className === undefined ?
          this.props.view === undefined ?
            <OverlayTrigger placement="top" overlay={add}>
              <Button bsStyle="primary" fill icon
                onClick={() => {
                  var tempObj = this.state.contactList;
                  tempObj.push({ code: null, type: "", name: "", email: "", phone: "" })
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
        <Col xs={12} sm={6} md={3} lg={3}>
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
        <Col xs={12} sm={6} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="email"
              placeholder="Search by email"
              onChange={(e) => this.filter(e, "email")}
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
export default ContactsListComponent;
