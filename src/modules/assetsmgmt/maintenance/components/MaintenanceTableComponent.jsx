import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from "react-bootstrap-sweetalert";
import { Col, FormGroup, FormControl, Tooltip, OverlayTrigger } from "react-bootstrap";

import Select from "components/CustomSelect/CustomSelect.jsx";

import Button from "components/CustomButton/CustomButton.jsx";

class MaintenanceTableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      log: props.log,

    };
    this.renderType = this.renderType.bind(this);
    this.renderInventory = this.renderInventory.bind(this);
    this.renderPlant = this.renderPlant.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.renderNumberQty = this.renderNumberQty.bind(this);
    this.renderNumberAmount = this.renderNumberAmount.bind(this);
    this.renderText = this.renderText.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.state.order !== newProps.log) {
      this.setState({ log: newProps.log });
    }
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
          You will not be able to recover this material data!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(id) {
    let tempObj = this.state.log;
    tempObj.maintenanceData.splice(id, 1);
    this.setState({ tempObj });
    this.successAlert("Material data deleted successfully!")

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
  renderType(row) {
    return (
      <FormGroup>
        <Select
          options={[
            { value: "Stores", label: "Stores" },
            { value: "Other", label: "Other" }
          ]}
          value={this.state.log.maintenanceData[row.index].type ? this.state.log.maintenanceData[row.index].type : null}
          onChange={(option) => {
            let tempObj = this.state.log.maintenanceData;
            tempObj[row.index].type = option ? option.value : null;
            this.setState({ tempObj });
          }}
        />
      </FormGroup>
    )
  }

  renderInventory(row) {
    return (
      <FormGroup>
        <Select
          disabled={this.state.log.maintenanceData[row.index].type === "Stores" ? false : true}
          options={this.props.storesList}
          value={this.state.log.maintenanceData[row.index].store ? this.state.log.maintenanceData[row.index].store.id : null}
          onChange={(option) => {
            let tempObj = this.state.log;
            tempObj.maintenanceData[row.index].store = option ? option : null;
            this.setState({ tempObj });
          }}
        />
      </FormGroup>
    )
  }

  renderPlant(row) {
    return (
      <FormGroup>
        <Select
          disabled={this.state.log.maintenanceData[row.index].type === "Stores" ? false : true}
          options={this.props.plantList}
          value={this.state.log.maintenanceData[row.index].plant ? this.state.log.maintenanceData[row.index].plant.id : null}
          onChange={(option) => {
            let tempObj = this.state.log;
            tempObj.maintenanceData[row.index].plant = option ? option : null;
            this.setState({ tempObj });
          }}
        />
      </FormGroup>
    )
  }

  renderNumberQty(row) {
    return (
      <FormGroup>
        <FormControl
          type="number"
          placeholder="Enter quantity"
          min={0}
          value={this.state.log.maintenanceData[row.index].quantity ? this.state.log.maintenanceData[row.index].quantity : null}
          onChange={(e) => {
            let tempObj = this.state.log;
            tempObj.maintenanceData[row.index].quantity = e.target.value;
            this.setState({ tempObj });
          }}
        />
      </FormGroup>
    )
  }
  renderNumberAmount(row) {
    return (
      <FormGroup>
        <FormControl
          type="number"
          placeholder="Enter amount"
          min={0}
          value={this.state.log.maintenanceData[row.index].amount ? this.state.log.maintenanceData[row.index].amount : null}
          onChange={(e) => {
            let tempObj = this.state.log;
            tempObj.maintenanceData[row.index].amount = e.target.value;
            this.setState({ tempObj });
          }}
        />
      </FormGroup>
    )
  }
  renderText(row) {
    return (
      <FormGroup>
        <FormControl
          placeholder="Enter description"
          type="text"
          value={this.state.log.maintenanceData[row.index][row.column.id] ? this.state.log.maintenanceData[row.index][row.column.id] : null}
          onChange={(e) => {
            let tempObj = this.state.log;
            tempObj.maintenanceData[row.index][row.column.id] = e.target.value;
            this.setState({ tempObj });
          }}
        />
      </FormGroup>
    )
  }

  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const add = (<Tooltip id="edit_tooltip">Add new material</Tooltip>);

    let table = (
      <Col xs={12}>
        {
          !this.state.log.maintenanceData.length
            ? (
              <div>No maintenance data found.</div>
            ) : (
              <ReactTable
                columns={[
                  { Header: "Sr", accessor: "sr", Cell: (row => { return (<div>{row.index + 1}</div>) }), width: 50 },
                  { Header: "Type", accessor: "type", Cell: this.renderType },
                  { Header: "Store Item", accessor: "store", Cell: this.renderInventory },
                  { Header: "Plant", accessor: "plant", Cell: this.renderPlant },
                  { Header: "Description", accessor: "description", Cell: this.renderText },
                  { Header: "Quantity", accessor: "quantity", Cell: this.renderNumberQty },
                  { Header: "Amount", accessor: "amount", Cell: this.renderNumberAmount },
                  {
                    Header: "", accessor: "_id", width: 30,
                    Cell: (row => {
                      return (
                        <div className="actions-right">
                          {cookie.load('role') === "admin" ?
                            <OverlayTrigger placement="top" overlay={trash}>
                              <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.index)} ><span className="fa fa-trash text-danger"></span></Button>
                            </OverlayTrigger>
                            : null
                          }
                        </div>
                      )
                    }),
                  }
                ]}
                data={this.state.log.maintenanceData}
                minRows={0}
                sortable={false}
                className="-striped -highlight"
                showPaginationTop={false}
                showPaginationBottom={false}
              />
            )
        }
        <OverlayTrigger placement="top" overlay={add}>
          <Button bsStyle="primary" fill icon
            onClick={() => {
              let tempObj = this.state.log;
              tempObj.maintenanceData.push({
                type: "",
                store: null,
                plant: null,
                description: "",
                quantity: 0,
                amount: 0
              });
              this.setState({ tempObj });
            }}
          ><span className="fa fa-plus"></span></Button>
        </OverlayTrigger>
      </Col>
    )
    return (
      <div>
        {this.state.alert}
        {table}
      </div>
    )
  }
}

export default MaintenanceTableComponent;
