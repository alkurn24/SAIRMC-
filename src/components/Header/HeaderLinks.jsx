import React, { Component } from "react";
import { getDashboardData } from "../../modules/dashboard/server/DashboardServerComm";
import { Modal } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import axios from 'axios'

import { backendURL } from 'variables/appVariables.jsx';
import avatar from "assets/img/default-avatar.png";
import help from "assets/img/help.png";

import MaintenanceLogComponents from "../../modules/assetsmgmt/maintenance/components/MaintenanceLogComponents.jsx";
import cookie from 'react-cookies';
import Moment from "moment";
import UploadComponent from 'components/Upload/UploadComponent.jsx';
import {
  // Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  // FormGroup,
  // FormControl,
  // InputGroup
} from "react-bootstrap";


class HeaderLinks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      availableMaintenances: null,
      maintenanceDate: null,
      maintenanceDate: [],
      maintenanceList: []
    }
    this.logout = this.logout.bind(this)
    this.handleShowMaintanceLogModal = this.handleShowMaintanceLogModal.bind(this);
    this.handleCloseMaintanceLogModal = this.handleCloseMaintanceLogModal.bind(this);
    this.fetchData = this.fetchData
  }
  handleShowMaintanceLogModal(code) { this.setState({ showMaintanceLogModal: true, code: code }); }
  handleCloseMaintanceLogModal() {
    this.setState({ showMaintanceLogModal: false });
    this.fetchData();
  }
  componentWillMount() {
    this.fetchData();
  }
  fetchData() {
    var _this = this
    axios.get(backendURL + "dashboard")
      .then(function (res) {
        if (res.data.availableMaintenances.maintenance.length) {
          for (var i = 0; i < res.data.availableMaintenances.maintenance.length; i++) {
            var maintenanceList = res.data.availableMaintenances.maintenance[i].asset
          }
        }
        _this.setState({
          availableMaintenances: res.data.availableMaintenances.count,
          maintenanceDate: res.data.availableMaintenances.maintenance.maintenanceDate,
          maintenanceList: res.data.availableMaintenances.maintenance
        })
      })

  }
  createTableData() {
    var tableRows = [];
    return tableRows;
  }
  logout() {
    cookie.remove('user');
    cookie.remove('role');
    cookie.remove('code')
    cookie.remove('email');
    cookie.remove('photo');
    cookie.remove('userAvatar');
    cookie.remove('token');
    // this.props.history.push("/")
  }
  changePassword() {

    this.props.history.push("/settings/change-password-edit/new")
  }
  render() {
    var maintanceLogModel = (
      <Modal
        dialogClassName="large-modal"
        show={this.state.showMaintanceLogModal}
        onHide={() => this.setState({ showMaintanceLogModal: false })}>
        <Modal.Header class="header1" closeButton>
          <Modal.Title>Update Maintenance Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MaintenanceLogComponents
            {...this.props}
            showMaintanceLogModal={this.state.showMaintanceLogModal}
            handleCloseMaintanceLogModal={this.handleCloseMaintanceLogModal}
            code={this.state.code}
          />
        </Modal.Body>
      </Modal>
    )
    return (
      <div>
        {maintanceLogModel}

        <Nav pullRight>
          <NavDropdown
            eventKey={2}
            title={
              <div>
                <img src={help} alt="" style={{ height: "25px", width: "25px", borderRadius: "25px", marginTop: "13px" }} />
                <p className="hidden-md hidden-lg">
                  Actions
                  <b className="caret" />
                </p>
              </div>
            }
            noCaret
            id="basic-nav-dropdown-1"
          >
            <MenuItem eventKey={3.1}><i className="fa fa-phone" /> + 917887886462 </MenuItem>
            <MenuItem eventKey={3.2}><i className="fa fa-envelope" /> support@arrowsofterp.com</MenuItem>
          </NavDropdown>
          {/* <NavDropdown
            eventKey={3}
            title={
              <div>
                <i className="fa fa-question" />
                <p> Help </p>
              </div>
            }
            id="basic-nav-dropdown-4"
          >
            <MenuItem eventKey={3.1}>+ 91 7887886462 <br />support@arrowsofterp.com</MenuItem>
          </NavDropdown> */}
          <NavDropdown
            eventKey={3}
            title={
              <div>
                <i className="fa fa-wrench" style={{ font: "25px" }} />
                <span className="notification">{this.state.availableMaintenances}</span>
                <p className="hidden-md hidden-lg">
                  maintenance log
                  <b className="caret" />
                </p>
              </div>
            }
            noCaret
            id="basic-nav-dropdown-2"
          >
            {!this.state.maintenanceList || !this.state.maintenanceList.length
              ? (
                <MenuItem eventKey={3.1}>No maintenance log found.</MenuItem>
              ) : (

                this.state.maintenanceList.map((prop, key) => {
                  return (
                    <MenuItem eventKey={3.1}>{key + 1}. <a onClick={() => this.handleShowMaintanceLogModal(prop.code)}> {prop.maintenanceDate ? Moment(prop.maintenanceDate).format("DD-MMM-YYYY") : null}-{prop.asset.name ? prop.asset.name : ""}</a></MenuItem>
                  )
                })
              )
            }

          </NavDropdown>
          {/* <NavDropdown
            eventKey={3}
            title={
              <div>
                <i className="fa fa-bell-o" />
                <span className=""></span>
                <p className="hidden-md hidden-lg">
                  <b className="caret" />
                </p>
              </div>
            }
            noCaret
            id="basic-nav-dropdown-2"
          >
          </NavDropdown> */}
          <NavDropdown
            className="user"
            eventKey={4}
            title={
              <div className="photo">
                {cookie.load('photo') ?
                  <img src={backendURL + cookie.load('photo')} alt="" style={{ height: "50px", width: "50px", borderRadius: "25px" }} />
                  :
                  <img src={avatar} alt="" style={{ height: "50px", width: "50px", borderRadius: "50px" }} />
                }
              </div>
            }
            noCaret
            id="basic-nav-dropdown-3"
            bsClass="dropdown-with-icons dropdown"
          >
            <MenuItem eventKey={4.1} href="#/settings/user-edit/" >
              <i className="fa fa-user" />
              {cookie.load('user') ? cookie.load('user') : "USERNAME"}
              {/* <br /><small>{cookie.load('role') ? cookie.load('role') : "ROLE"}</small> */}
              <NavLink
                // to={"/settings/userManagement-edit/"+cookie.load("id")}
                to={"/settings/user-edit/"}
                className="nav-link"
                activeClassName="active"
              >
              </NavLink>
            </MenuItem>
            <MenuItem eventKey={4.3} >
              <i className="fa fa-male" href="#" />
              Role: {cookie.load('user') ? cookie.load('role') : "ROLE"}
              <NavLink
                to={"#"}
                className="nav-link"
                activeClassName="active"
              >
              </NavLink>
            </MenuItem>
            <MenuItem eventKey={4.3} >
              <i className="fa fa-lock" href="#/settings/change-password-edit/new" />
              <NavLink
                to={"/settings/change-password-edit/new"}
                className="nav-link"
                activeClassName="active"
              >
                Change Password
               </NavLink>
            </MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={4.5} href="#/" onClick={this.logout}>
              <i style={{ color: 'Red' }} className="fa fa-power-off fa-4x" />
              <NavLink style={{ color: 'Red' }}
                to="/"
                className="nav-link"
                activeClassName="active"
              >
                Log out
                     </NavLink>
            </MenuItem>
          </NavDropdown>

          {/* <NavDropdown
            eventKey={5}
            title={
              <div>
                <i className="fa fa-list" />
                <p className="hidden-md hidden-lg">
                  More
                  <b className="caret" />
                </p>
              </div>
            }
            noCaret
            id="basic-nav-dropdown-3"
            bsClass="dropdown-with-icons dropdown"
          >
            <MenuItem eventKey={5.1}>
              <i className="fa fa-envelope" /> My Worklist
            </MenuItem>
            <MenuItem eventKey={5.2}>
              <i className="fa fa-question-circle" /> Help Center
            </MenuItem>
          </NavDropdown> */}
        </Nav>
      </div>
    );
  }
}

export default HeaderLinks;
