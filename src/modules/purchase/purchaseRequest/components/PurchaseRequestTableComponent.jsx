import React, { Component } from "react";
import _ from "lodash";
import cookie from 'react-cookies';
import ReactTable from "react-table";
import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";


import Button from "components/CustomButton/CustomButton.jsx";
import SweetAlert from 'react-bootstrap-sweetalert';

import PurchaseRequestModuleModalComponent from "../components/PurchaseRequestModuleModalComponent.jsx";

class PurchaseRequestTableComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newOrder: {},
      currency: "₹",
      showAddInventoryModal: false,
      editObj: null
    }
    this.handleShowAddInventoryModal = this.handleShowAddInventoryModal.bind(this);
    this.handleCloseAddInventoryModal = this.handleCloseAddInventoryModal.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);

  }
  componentWillReceiveProps(newProps) {
    this.props = newProps
  }
  handleShowAddInventoryModal(data) {
    this.setState({ showAddInventoryModal: true, editObj: data ? data : null });
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
          You will not be able to recover this inventory!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(id) {
    let tempObj = this.props.purchaseRequest;
    tempObj.orderData.splice(id, 1);
    this.setState({ tempObj });
    this.successAlert("inventory deleted successfully!")

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
  handleCloseAddInventoryModal() { this.setState({ showAddInventoryModal: false, editObj: null }); }
  render() {
    const add = (<Tooltip id="edit_tooltip">Add new inventory item</Tooltip>);
    const trash = (<Tooltip id="edit_tooltip">Delete</Tooltip>);
    var srnoCol = { Header: "Sr", id: "sr", Cell: (row) => { return (<div>{row.index + 1}</div>) }, width: 50 }
    var ServicesCol = { Header: "Services Type", accessor: "inventoryType.name", width: 300 }
    var ServicesCategoryCol = { Header: "Services Category", accessor: "inventoryCategory.label", }
    var InventoryStoreCol = { Header: "Inventory type", accessor: "inventoryType.name", }
    var CategoryStoreCol = { Header: "Inventory category", accessor: "inventoryCategory.label", }
    var materialCol = { Header: "Material", accessor: "name", }
    var ServiceNameCol = { Header: "Service Name", accessor: "name", }
    var freeTextCol = { Header: "Scope of Work", accessor: "freeText", }
    var statusCol = {
      Header: "Status", id: "_status",
      Cell: (row => {
        return (
          <div>{
            row.original._status ? row.original._status : "New"
          }
          </div>
        )
      })
    }
    var quantityCol = {
      Header: "Quantity", id: "quantity",
      Cell: (row => {
        return (
          <div>{
            row.original.quantity ? row.original.quantity : 0.00
          }
          </div>
        )
      })
    }

    var actionCol = {
      Header: "", accessor: "_id", width: 30,
      Cell: (row => {
        return (
          <div className="actions-right">
            {cookie.load('role') === "admin" ?
              <OverlayTrigger placement="top" overlay={trash}>
                <Button className="btn-list actions-right"
                  disabled={this.props.purchaseRequest.code === "New" ? false : true}
                  bsStyle="danger" fill icon onClick={() => this.delete(row.index)} ><span className="fa fa-trash text-danger"></span></Button>
              </OverlayTrigger>
              : null
            }
          </div>
        )
      }),
    }

    return (
      <div>
        {this.state.alert}
        <PurchaseRequestModuleModalComponent
          showAddInventoryModal={this.state.showAddInventoryModal}
          handleCloseAddInventoryModal={this.handleCloseAddInventoryModal}
          purchaseRequest={this.props.purchaseRequest}
          inventoryList={this.props.inventoryList}
          assetList={this.props.assetList}
          serviceList={this.props.serviceList}
          orderList={this.props.orderList}
          categoryList={this.props.categoryList}
          inventorySettingList={this.props.inventorySettingList}
          servicesSettingList={this.props.servicesSettingList}
          vendorList={this.props.vendorList}
          purchaseRequestCode={"New"}
          saveInventoryToModule={this.saveInventoryToModule}
          newOrder={this.state.editObj}
          {...this.props}
        />

        {this.props.purchaseRequest.orderData.length ?
          <ReactTable
            data={this.props.purchaseRequest.orderData}
            columns={
              this.props.purchaseRequest.type === "Store" || this.props.purchaseRequest.type === "Asset" ?
                [srnoCol, statusCol, InventoryStoreCol, CategoryStoreCol, materialCol, quantityCol, actionCol]
                :
                [srnoCol, statusCol, ServicesCol, ServicesCategoryCol, ServiceNameCol, freeTextCol, quantityCol, actionCol]

            }
            sortable={false}
            minRows={0}
            showPaginationTop={false}
            showPaginationBottom={false}
            className="-striped -highlight"
          />
          : null

        }
        {
          this.props.purchaseRequest.code === "New" ?
            this.props.purchaseRequest.type !== null ?
              <OverlayTrigger placement="top" overlay={add}>
                <Button
                  bsStyle="primary" fill icon
                  onClick={() => { this.handleShowAddInventoryModal() }}>
                  <span className="fa fa-plus"></span>
                </Button>
              </OverlayTrigger>
              : null
            : null
        }
      </div>
    )
  }
}

export default PurchaseRequestTableComponent;