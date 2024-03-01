import React, { Component } from "react";
import ReactTable from "react-table";
import _ from "lodash";
import { FormGroup, FormControl, ControlLabel, Tooltip } from "react-bootstrap";

import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";




class PurchaseOrderTableComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      order: props.order,
      currency: "₹",
      editObj: null,
      showHistoryModal: false,
      historyList: [],
    };
    this.renderText = this.renderText.bind(this);
    this.renderRequestQuantity = this.renderRequestQuantity.bind(this);
    this.renderOrderQty = this.renderOrderQty.bind(this);
    this.renderRate = this.renderRate.bind(this);
    this.renderMaterial = this.renderMaterial.bind(this);
    this.renderAssetMaterial = this.renderAssetMaterial.bind(this);
    this.renderServiceMaterial = this.renderServiceMaterial.bind(this);
    this.renderDescription = this.renderDescription.bind(this);
    this.renderCheckBox = this.renderCheckBox.bind(this);
    this.handleShowHistoryModal = this.handleShowHistoryModal.bind(this);
    this.handleCloseHistoryModal = this.handleCloseHistoryModal.bind(this);
  }
  componentWillReceiveProps(newProps) {
    if (this.state.order !== newProps.order) {
      this.setState({ order: newProps.order });
    }
  }
  handleCloseHistoryModal() {
    this.setState({ showHistoryModal: false, editObj: null })
    // this.fetDataFromServer();
  }
  handleShowHistoryModal(code) {
    let historyData = this.state.order.orderData
    if (historyData.length) {
      for (var i = 0; i < historyData.length; i++) {
        historyData.orderData = historyData[i].purchaseRequest ? historyData[i].purchaseRequest.orderData : null
      }
      this.setState({ historyData })
      if (historyData.orderData.length) {
        for (var i = 0; i < historyData.orderData.length; i++) {
          historyData.lineItemHis = historyData.orderData[i].lineItemHis ? historyData.orderData[i].lineItemHis : null
        }
        this.setState({ orderData: historyData })
      }
    }
    this.setState({ showHistoryModal: true, code: code })
  }
  renderText(cellInfo) {
    return (
      <FormGroup>
        {this.state.order.code === "New" ?
          <div>
            <FormControl
              disabled={this.state.order.code !== "New" ? true : false}
              type="number"
              min={0}
              max={cellInfo.column.id !== "requestQuantity" ? 100 : 10000}
              value={this.state.order.orderData[cellInfo.index][cellInfo.column.id]}
              onChange={(e) => {
                let tempOrder = this.state.order;
                tempOrder.orderData[cellInfo.index][cellInfo.column.id] = e.target.value;
                this.setState({ tempOrder });
              }}
            />
          </div>
          :
          <ControlLabel>{this.state.order.orderData[cellInfo.index][cellInfo.column.id]}</ControlLabel>
        }
      </FormGroup>
    )
  }
  renderDescription(cellInfo) {
    return (
      <FormGroup>
        {this.state.order.code === "New" ?
          <div>
            <FormControl
              type="text"
              value={this.state.order.orderData[cellInfo.index][cellInfo.column.id]}
              onChange={(e) => {
                let tempOrder = this.state.order;
                tempOrder.orderData[cellInfo.index][cellInfo.column.id] = e.target.value;
                this.setState({ tempOrder });
              }}
            />
          </div>
          :
          <ControlLabel>{this.state.order.orderData[cellInfo.index][cellInfo.column.id]}</ControlLabel>
        }
      </FormGroup>
    )
  }
  renderRequestQuantity(cellInfo) {
    return (
      <FormGroup>
        <ControlLabel>{this.state.order.orderData[cellInfo.index].requestQuantity ? this.state.order.orderData[cellInfo.index].requestQuantity : ""}</ControlLabel>
      </FormGroup>
    )
  }
  renderOrderQty(cellInfo) {
    return (
      <FormGroup>
        {this.state.order.code === "New" ?
          <div>
            <span className="input-group">
              <FormControl
                type="number"
                min={0}
                max={cellInfo.column.id !== "requestQuantity" ? 100 : 10000}
                value={this.state.order.orderData[cellInfo.index].orderQuantity}
                onChange={(e) => {
                  let tempOrder = this.state.order;
                  tempOrder.orderData[cellInfo.index].orderQuantity = e.target.value;
                  this.setState({ tempOrder })
                }}
              />
              <span disabled className="input-group-addon">/ {this.state.order.orderData[cellInfo.index].unit}</span>
            </span>
          </div>
          :
          <ControlLabel>{this.state.order.orderData[cellInfo.index].orderQuantity}</ControlLabel>
        }
      </FormGroup>
    )
  }
  renderCheckBox(row) {
    return (
      <FormGroup>
        <Checkbox
          inline
          number={"isSelectd" + row.index}
          name={"isSelectd"}
          disabled={this.state.order.code !== "New" ? true : false}
          checked={this.state.order.orderData[row.index].isSelected}
          onChange={(e) => {
            let tempOrder = this.state.order;
            tempOrder.orderData[row.index].isSelected = e.target.checked;
            this.setState({ tempOrder });
          }}
        />
      </FormGroup>
    )
  }
  renderRate(cellInfo) {
    return (
      <FormGroup>
        {this.state.order.code === "New" ?
          <div>
            <FormControl
              type="number"
              min={0}
              max={cellInfo.column.id !== "requestQuantity" ? 100 : 10000}
              value={this.state.order.orderData[cellInfo.index].rate}
              onChange={(e) => {
                let tempOrder = this.state.order;
                tempOrder.orderData[cellInfo.index].rate = e.target.value;
                this.setState({ tempOrder })
              }}
            />
          </div>
          :
          <div class="text-right">{this.state.order.orderData[cellInfo.index].rate ? this.state.order.orderData[cellInfo.index].rate.toFixed(2) : 0.00}</div>
        }
      </FormGroup>
    )
  }
  renderMaterial(cellInfo) {
    return (
      <FormGroup>
        <ControlLabel>{this.state.order.orderData[cellInfo.index][cellInfo.column.id] ? this.state.order.orderData[cellInfo.index][cellInfo.column.id].name : null}</ControlLabel>
      </FormGroup>

    )
  }
  renderAssetMaterial(cellInfo) {
    return (
      <FormGroup>
        <ControlLabel>{this.state.order.orderData[cellInfo.index][cellInfo.column.id] ? this.state.order.orderData[cellInfo.index][cellInfo.column.id].name : null}</ControlLabel>
      </FormGroup>
    )
  }
  renderServiceMaterial(cellInfo) {
    return (
      <FormGroup>
        <ControlLabel>{this.state.order.orderData[cellInfo.index][cellInfo.column.id] ? this.state.order.orderData[cellInfo.index][cellInfo.column.id].name : null}</ControlLabel>
      </FormGroup>
    )
  }

  render() {

    if (this.state.order.number === "New" && this.state.order.vendor === null) {
      this.state.order.orderData = this.props.purchaseRequestList;
    }
    var srCol = { Header: "Sr", id: "sr", Cell: (row) => { return (<div>{row.index + 1}</div>) }, width: 75 }
    var isSelectedCol = { Header: "", accessor: "isSelected", width: 75, sortable: false, Cell: this.renderCheckBox }
    var purchaseRequsetNumberCol = { Header: "Code", accessor: "purchaseRequest.number", }
    var numberCol = { Header: "Code", accessor: "number", }
    var inventoryCol = { Header: "Material", width: 140, accessor: "inventory", Cell: this.renderMaterial, }
    var assetCol = { Header: "Asset Name", width: 140, accessor: "asset", Cell: this.renderAssetMaterial, }

    var serviceCol = { Header: "Service Name", width: 140, accessor: "service", Cell: this.renderServiceMaterial, }
    var hsnCol = { Header: "HSN", accessor: "hsn", width: 150 }
    var gstCol = { Header: "GST (%)", accessor: "gst" }
    var rateCol = { Header: "(₹) Rate", accessor: "rate", Cell: this.renderRate }
    var remainingQtyCol = { Header: "Remaining Qty", accessor: "remainingQty", width: 140 }
    var requserQtyCol = { Header: "Request Quantity", width: 140, accessor: "requestQuantity", Cell: this.renderRequestQuantity }
    var orderQtyCol = { Header: "Order Quantity", width: 140, accessor: "orderQuantity", Cell: this.renderOrderQty }
    var discountCol = { Header: "Discount (%)", accessor: "discount", Cell: this.renderText }
    var descriptionCol = { Header: "description", accessor: "description", width: 300, Cell: this.renderDescription }
    var packingCol = { Header: "Packing(%)", accessor: "packing", Cell: this.renderText }

    var discountCol = {
      Header: "Discount (%)", accessor: "discount", Cell: this.renderText,
      Footer: () => {
        return (
          <div>
            <FormGroup>
              Sub Total
        </FormGroup>
            <FormGroup>
              Total
        </FormGroup>
          </div>
        );
      }
    }
    var totalCol = {
      Header: "Total Amount (Ex. TAX)",
      id: "value",
      width: 200,
      Cell: (row => {
        let total = parseFloat((row.original.rate ? row.original.rate : 0) * (row.original.orderQuantity ? row.original.orderQuantity : 0));
        let discount = (total * (row.original.discount / 100))
        let rateAfterDiscount = total - discount
        let packing = (rateAfterDiscount * (row.original.packing / 100))
        let rateAfterPacking = rateAfterDiscount + packing
        let gst = (rateAfterPacking * (row.original.gst / 100))
        let finalAmount = rateAfterPacking + gst
        return <div className="text-right">{(finalAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
      }),
      Footer: () => {
        let subTotal = _.sum(this.state.order.orderData.map(row => {
          let total = (row.rate ? row.rate : 0) * (row.orderQuantity ? row.orderQuantity : 0);
          let discount = (total * (row.discount / 100))
          let rateAfterDiscount = total - discount
          let packing = (rateAfterDiscount * (row.packing / 100))
          let rateAfterPacking = rateAfterDiscount + packing
          let gst = (rateAfterPacking * (row.gst / 100))
          let finalAmount = rateAfterPacking + gst
          return (finalAmount);
        }));
        let total = subTotal;
        return (
          <div>
            <div className="text-right">
              {subTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-right">
              {total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>
        );
      }
    }

    return (
      <div>

        {
          this.state.order.orderData.length ?
            (this.state.order.type === "Store") ?
              (
                <ReactTable
                  data={this.state.order.orderData}
                  columns={
                    this.state.order.code === "New" ?
                      [srCol, isSelectedCol, numberCol, inventoryCol, descriptionCol, hsnCol, gstCol, rateCol, requserQtyCol, remainingQtyCol, orderQtyCol, discountCol, packingCol, totalCol]
                      :
                      [srCol, isSelectedCol, purchaseRequsetNumberCol, inventoryCol, descriptionCol, hsnCol, gstCol, rateCol, requserQtyCol, remainingQtyCol, orderQtyCol, discountCol, packingCol, totalCol]

                  }

                  sortable={false}
                  minRows={0}
                  showPaginationTop={false}
                  showPaginationBottom={false}
                  className="-striped -highlight"
                />
              ) :
              (this.state.order.type === "Asset") ?
                (
                  <ReactTable
                    data={this.state.order.orderData}
                    columns={
                      this.state.order.code === "New" ?
                        [srCol, isSelectedCol, numberCol, assetCol, descriptionCol, hsnCol, gstCol, rateCol, requserQtyCol, remainingQtyCol, orderQtyCol, discountCol, packingCol, totalCol,]
                        :
                        [srCol, isSelectedCol, purchaseRequsetNumberCol, assetCol, descriptionCol, hsnCol, gstCol, rateCol, requserQtyCol, remainingQtyCol, orderQtyCol, discountCol, packingCol, totalCol]
                    }

                    sortable={false}
                    minRows={0}
                    showPaginationTop={false}
                    showPaginationBottom={false}
                    className="-striped -highlight"
                  />
                ) :
                (
                  <ReactTable
                    data={this.state.order.orderData}
                    columns={
                      this.state.order.code === "New" ?
                        [srCol, isSelectedCol, numberCol, serviceCol, descriptionCol, hsnCol, gstCol, rateCol, requserQtyCol, orderQtyCol, discountCol, packingCol, totalCol]
                        :
                        [srCol, isSelectedCol, purchaseRequsetNumberCol, serviceCol, descriptionCol, hsnCol, gstCol, rateCol, requserQtyCol, orderQtyCol, discountCol, packingCol, totalCol]
                    }

                    sortable={false}
                    minRows={0}
                    showPaginationTop={false}
                    showPaginationBottom={false}
                    className="-striped -highlight"
                  />
                )
            : null
        }

      </div>
    )
  }
}

export default PurchaseOrderTableComponent;