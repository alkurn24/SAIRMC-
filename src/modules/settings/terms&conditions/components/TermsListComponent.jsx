import React, { Component } from "react";
import ReactTable from "react-table";
import { Modal, Col, OverlayTrigger, Tooltip, } from "react-bootstrap";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import Moment from "moment";

import Button from "components/CustomButton/CustomButton.jsx";

import { getTermsList, deleteTerms } from "../server/TermsServerComm.jsx";
import TermsAndConditionFormComponent from "../components/TermsAndConditionFormComponent.jsx";
import { getSocket } from "js/socket.io.js"
import loader from "assets/img/loader.gif";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"


class termsListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      termList: [],
      page: 0,
      pageSize: 10,
      pages: 0,
      loading: true,
      alert: null,
      hsnForm: {
        mandatory: [],
        custom: []
      },
      filter: {
        hsn: null,
        updated: false
      },
      socket: getSocket()
    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.handleShowTermsModal = this.handleShowTermsModal.bind(this);
    this.handleCloseTermsModal = this.handleCloseTermsModal.bind(this);
    this.renderTermData = this.renderTermData.bind(this);

  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        this.state.socket.on("temrs", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }

  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer()

  }

  fetchDataFromServer() {
    let _this = this;
    var params = "";
    getTermsList(params,
      function success(data) {
        var tempData = data.rows.map((prop, key) => {
          return {
            code: prop.code ? prop.code : "",
            key: key,
            srNo: key + 1,
            number: prop.number ? prop.number : "",
            date: Moment(prop.createdAt).format("DD MMM YYYY"),
            user: prop.user ? prop.user.name : "",
            terms: prop.terms,

          };
        })
        _this.setState({ termList: tempData, data: tempData, loading: false })
      },
      function error() { _this.setState({ termList: [] }); }
    );
  }

  handleShowTermsModal(index) {
    this.setState({ showTermsModal: true, editObj: index || index === 0 ? this.state.data[index] : null })
  }

  handleCloseTermsModal() {
    this.setState({ showTermsModal: false, editObj: null })
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
          You will not be able to recover this terms and condition!
        </SweetAlert>
      )
    });
  }

  deleteConfirm(code) {
    let _this = this;
    deleteTerms(code,
      function success() {
        _this.successAlert("Terms and condition deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting terms and condition.");
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

  renderTermData(row) {

    return (
      row.original.terms && row.original.terms.length
        ? (
          <Col xs={12} className="react-table-subcomponent">
            <ReactTable
              data={row.original.terms}
              columns={
                [
                  { Header: "Sr", id: "slno", Cell: d => { return <div>{d.index + 1}</div> }, width: 50 },
                  {
                    Header: "",
                    accessor: "isSelected",
                    width: 50,
                    Cell: ({ original }) => {
                      return (
                        original.isSelected
                          ? <div><span className="fa fa-check" style={{ color: "darkgreen" }}></span></div>
                          :
                          <div><span className="fa fa-times" style={{ color: "red" }}></span></div>
                      )
                    },
                  },
                  { Header: "Terms & Conditions", accessor: "term", sortable: false, },
                ]
              }
              minRows={0}
              sortable={false}
              className="-striped -highlight"
              showPaginationTop={false}
              showPaginationBottom={false}

            />
          </Col>
        ) : null
    )
  }
  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
    let table = (
      <Col xs={12}>
        {
          (!this.state.termList || !this.state.termList.length) ? (
            <div>No Terms and condition found.</div>

          ) : (
              <div className="hsnList">
                <ReactTable
                  columns={[
                    { Header: "SR", id: "sr", Cell: (d => { return (<div>{(this.state.page * this.state.pageSize) + d.index + 1}</div>) }), width: 50 },
                    { Header: "Code", accessor: "number", sortable: false, },
                    { Header: "Date", accessor: "date", sortable: false, },
                    { Header: "Create By", accessor: "user", sortable: false, },
                    {
                      Header: "", accessor: "code", width: 60,
                      Cell: (row => {
                        return (
                          <div className="actions-right">
                            <OverlayTrigger placement="top" overlay={edit}>
                              <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.handleShowTermsModal(row.original.key)}><span className="fa fa-edit text-primary"></span></Button>
                            </OverlayTrigger>
                            {cookie.load('role') === "admin" ?
                              < OverlayTrigger placement="top" overlay={trash}>
                                <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.original.code)} ><span className="fa fa-trash text-danger"></span></Button>
                              </OverlayTrigger>
                              : null
                            }
                          </div>
                        )
                      }),
                    }
                  ]}

                  data={this.state.termList}
                  minRows={0}
                  sortable={false}
                  className="-striped -highlight"
                  showPaginationTop={false}
                  showPaginationBottom={true}
                  defaultPageSize={defaultPageSize}
                  pageSizeOptions={pageSizeOptionsList}
                  onFetchData={this.search}
                  SubComponent={this.renderTermData}
                  freezeWhenExpanded={true}
                />
                <center><h5 className="text-danger">{this.state.formError}</h5></center>
              </div>
            )
        }
      </Col>
    );
    let TermsAndConditionModal = (
      <Modal
        dialogClassName="large-modal"
        show={this.state.showTermsModal}>
        <Modal.Header>
          <div className="modal-close">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => this.setState({ showTermsModal: false, editObj: null })}>{null}</a>
          </div>
          <Modal.Title>Add/Edit Terms And Condition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TermsAndConditionFormComponent
            handleCloseTermsModal={this.handleCloseTermsModal}
            settings={false}
            termList={this.state.editObj}
            {...this.props}>
          </TermsAndConditionFormComponent>
        </Modal.Body>
      </Modal>
    );
    let header = (

      <div className="list-header">
        {/* <Col xs={12} sm={6} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="hsn"
              placeholder="Search by HSN code"
              onChange={this.filter}
            />
          </FormGroup>
        </Col> */}
        < Col xs={12} sm={6} md={12} lg={12}>
          <Button pullRight bsStyle="primary" fill
            onClick={() => this.setState({ showTermsModal: true })}>
            <i className="fa fa-plus" /> Add New Terms and condition
						</Button>
        </Col>

      </div>

    )
    return (
      <div>
        {this.state.loading ?
          <div className="modal-backdrop in">
            <img src={loader} alt="loader" className="preLoader" />
          </div>
          :
          <div>
            {this.state.alert}
            {header}
            {TermsAndConditionModal}
            {table}
          </div>
        }
      </div>
    );
  }
}

export default termsListComponent;