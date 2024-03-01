import React, { Component } from "react";
import ReactTable from "react-table";
import Pagination from "jw-react-pagination";
import { Modal } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import DeliveryPointFormComponent from "../components/DeliveryPointFormComponent"

import { getDeliveryPointList } from "../server/DeliveryPointServerComm.jsx";
import { paginationLabels, paginationStylesList } from 'variables/Variables.jsx';

class DeliveryPointListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryPointList: [],
      showDeliveryPointModal: false,
      editObj: null
    };
    this.onChangePage = this.onChangePage.bind(this);
    this.handleShowDeliveryPointModal = this.handleShowDeliveryPointModal.bind(this);
    this.handleCloseDeliveryPointModal = this.handleCloseDeliveryPointModal.bind(this);
  }

  onChangePage(pageOfItems) {
    this.setState({ dataPaginated: pageOfItems });
  }

  componentWillMount() {
    let _this = this;
    getDeliveryPointList("deliverypoint=true",
      function success(data) {
        var tempData = data.rows.map((prop, key) => {
          return {
            code: prop.code,
            srNo: key + 1,
            editLink: (<a className="edit-link" onClick={() => _this.handleShowDeliveryPointModal(key)}>{prop.name}</a>),
            type: prop.type,
            name: prop.name,
            street_address: prop.street_address
          };
        })
        _this.setState({ deliveryPointList: tempData })
      },
      function error(error) { _this.setState({ deliveryPointList: [] }); }
    );
  }

  handleShowDeliveryPointModal (index) {
    this.setState({ showDeliveryPointModal: true, editObj: index || index === 0 ? this.state.deliveryPointList[index] : null })
  }

  handleCloseDeliveryPointModal (data) {
    var newObj = this.state.deliveryPointList;
    newObj.push(data);
    this.setState({ showDeliveryPointModal: false, newObj })
  }

  render() {
    return (
      <div>
        <div style={{ position: "absolute", top: "-23px", right: "20px" }}>
          <Button round bsStyle="primary" fill style={{ height: "45px", width: "45px" }} onClick={() => this.setState({ showDeliveryPointModal: true })}>
            <i className="fa fa-plus" style={{ paddingRight: "8px" }} />
          </Button>
        </div>
        <Modal
          show={this.state.showDeliveryPointModal}
          onHide={() => this.setState({ showDeliveryPointModal: false, editObj: null })}>
          <Modal.Header closeButton>
            <Modal.Title>Add/Update Delivery Point</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DeliveryPointFormComponent 
              handleCloseModal={this.handleCloseDeliveryPointModal}
              deliveryPoint={this.state.editObj}
              {...this.props}
            />
          </Modal.Body>
        </Modal>
        {
          (!this.state.deliveryPointList || !this.state.deliveryPointList.length) ? (
            <div>No delivery point found. <a onClick={() => this.handleShowDeliveryPointModal()}>click here</a> to create one.</div>
          ) : (
              <div>
                <ReactTable
                  columns={[
                    { Header: "Sr", accessor: "srNo", width: 50, sortable: false },
                    { Header: "Name", accessor: "editLink", width: 300, sortable: true },
                    { Header: "Address", accessor: "street_address", sortable: false }
                  ]}
                  data={this.state.dataPaginated}
                  minRows={0}
                  className="-striped -highlight"
                  showPaginationTop={false}
                  showPaginationBottom={false}
                />
                <center>
                  <Pagination
                    items={this.state.deliveryPointList}
                    onChangePage={this.onChangePage}
                    labels={paginationLabels}
                    styles={paginationStylesList}
                  // pageSize="1"
                  />
                </center>
              </div>
            )
        }
      </div>
    )
  }
}

export default DeliveryPointListComponent;