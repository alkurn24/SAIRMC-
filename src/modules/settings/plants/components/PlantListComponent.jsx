import React, { Component } from "react";
import ReactTable from "react-table";
import { Modal, Col, OverlayTrigger, Tooltip, } from "react-bootstrap";

import SweetAlert from 'react-bootstrap-sweetalert';

import Button from "components/CustomButton/CustomButton.jsx";
import PlantFormComponent from "../components/PlantFormComponent"
import { getPlantList, deletePlant } from "../server/PlantServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import loader from "assets/img/loader.gif";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"


class plantListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plantList: [],
      showPlantModal: false,
      loading: true,
      editObj: null,
      plantDetails: null,
      socket: getSocket()
    };
    this.fetDataFromServer = this.fetDataFromServer.bind(this);
    this.handleShowPlantModal = this.handleShowPlantModal.bind(this);
    this.handleClosePlantModal = this.handleClosePlantModal.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        console.log(this.state.socket)
        this.state.socket.on("Plant", () => this.fetDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }
  componentWillMount() {
    this.getSocketConnection();
    this.fetDataFromServer()
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
          You will not be able to recover this plant!
        </SweetAlert>
      )
    });
  }

  deleteConfirm(code) {
    let _this = this;
    deletePlant(code,
      function success() {
        _this.successAlert("Plant deleted successfully!")
      },
      function error() {
        _this.errorAlert("Error in deleting plant.");
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
          onConfirm={() => { this.setState({ alert: null }); this.fetDataFromServer() }}
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
  fetDataFromServer() {
    let _this = this;
    var params = "";
    getPlantList(params,
      function success(data) {
        var tempData = data.rows.map((prop, key) => {
          return {
            key: key,
            srNo: key + 1,
            code: prop.code ? prop.code : "",
            number: prop.number ? prop.number : "",
            name: prop.name ? prop.name : "",
            address: prop.address ? prop.address : "",
            suffix: prop.suffix ? prop.suffix : "",
            contactNo: prop.contactNo ? prop.contactNo : "",
            telephone: prop.telephone ? prop.telephone : "",
            latitude: prop.latitude ? prop.latitude : "",
            longitude: prop.longitude ? prop.longitude : "",
          };
        })
        _this.setState({ plantList: tempData, loading: false })
      },
      function error() { _this.setState({ plantList: [] }); }
    );
  }

  handleShowPlantModal(index) {
    this.setState({ showPlantModal: true, editObj: index || index === 0 ? this.state.plantList[index] : null })
  }

  handleClosePlantModal() {
    this.setState({ showPlantModal: false, editObj: null })
    this.fetDataFromServer()

  }

  render() {
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);

    let table = (
      <Col xs={12}>
        {
          (!this.state.plantList || !this.state.plantList.length) ? (
            <div>No   plant found. <a onClick={() => this.handleShowPlantModal()}>click here</a> to create one.</div>
          ) : (
              <div>
                <ReactTable
                  data={this.state.plantList}
                  columns={[
                    { Header: "SR", accessor: "srNo", width: 50, Cell: (row => { return (<div>{row.index + 1}</div>) }) },
                    { Header: "Plant name", accessor: "name", },
                    { Header: "Plant address", accessor: "address", },
                    { Header: "Contact NO", accessor: "contactNo", },
                    {
                      Header: "", accessor: "code", width: 30,
                      Cell: (row => {
                        return (
                          <div className="actions-right">
                            <OverlayTrigger placement="top" overlay={edit}>
                              <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.handleShowPlantModal(row.original.key)} ><span className="fa fa-edit text-primary"></span></Button>
                            </OverlayTrigger>
                            {/* {cookie.load('role') === "admin" ?
                              < OverlayTrigger placement="top" overlay={trash}>
                                <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.original.code)} ><span className="fa fa-trash text-danger"></span></Button>
                              </OverlayTrigger>
                              : null
                            } */}
                          </div>
                        )
                      }),
                    },
                  ]}
                  minRows={0}
                  defaultPageSize={defaultPageSize}
                  pageSizeOptions={pageSizeOptionsList}
                  className="-striped -highlight"
                  showPaginationTop={false}
                  showPaginationBottom={true}
                  sortable={false}
                />
              </div>
            )
        }
      </Col>
    );
    let header = (
      <div className="list-header">

        <Col xs={12} sm={12} md={12} lg={12} pullRight>
          <Button pullRight bsStyle="primary" fill onClick={() => this.setState({ showPlantModal: true })}>
            <i className="fa fa-plus" /> Add New Plant
						</Button>
        </Col>
      </div>
    );
    let plantModal = (
      <Modal
        className="default-modal"
        show={this.state.showPlantModal}>
        <Modal.Header >
          <div className="text-right">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => this.setState({ showPlantModal: false, editObj: null })}>{null}</a>
          </div>
          <Modal.Title>Add/Update Plant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PlantFormComponent
            handleCloseModal={this.handleClosePlantModal}
            plantDetails={this.state.editObj}
            {...this.props}
          />
        </Modal.Body>
      </Modal>
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
            {plantModal}
            {header}
            {table}
          </div>
        }
      </div>
    )
  }
}

export default plantListComponent;