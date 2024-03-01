import React, { Component } from "react";
import _ from "lodash";
import cookie from 'react-cookies';
import ReactTable from "react-table";
import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";


import Button from "components/CustomButton/CustomButton.jsx";
import SweetAlert from 'react-bootstrap-sweetalert';

import SalesModuleOrderModalComponent from "./SalesModuleOrderModalComponent";

class SalesModuleOrderTableComponent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			newOrder: {},
			currency: "₹",
			showAddProductModal: false,
			editObj: null
		}
		this.handleShowAddProductModal = this.handleShowAddProductModal.bind(this);
		this.handleCloseAddProductModal = this.handleCloseAddProductModal.bind(this);
		this.delete = this.delete.bind(this);
		this.deleteConfirm = this.deleteConfirm.bind(this);
		this.successAlert = this.successAlert.bind(this);

	}
	componentWillReceiveProps(newProps) {
		this.props = newProps
	}
	handleShowAddProductModal(data) {
		this.setState({ showAddProductModal: true, editObj: data ? data : null });
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
					You will not be able to recover this product!
        </SweetAlert>
			)
		});
	}
	deleteConfirm(id) {
		let tempObj = this.props.order;
		tempObj.orderData.splice(id, 1);
		this.setState({ tempObj });
		this.successAlert("Product deleted successfully!")

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
	handleCloseAddProductModal() { this.setState({ showAddProductModal: false, editObj: null }); }
	render() {
		const add = (<Tooltip id="edit_tooltip">Add new product</Tooltip>);
		const edit = (<Tooltip id="edit_tooltip">View</Tooltip>);
		const trash = (<Tooltip id="edit_tooltip">Delete</Tooltip>);

		var headerCol = { Header: "Sr", id: "slno", Cell: d => { return <div>{d.index + 1}</div> }, width: 75 },
			productCol = { Header: "Product", id: "product", accessor: d => (<div>{d.product.name}</div>) },
			standardRateCol = { Header: "Standard Rate", id: "productRate", accessor: d => (<div class="text-right">{this.state.currency} {d.product.rate} / {d.product.unit}</div>) },
			rateCol = { Header: "Booking Rate", id: "rate", accessor: d => (<div class="text-right">{this.state.currency} {d.rate} / {d.product.unit}</div>) },
			gstCol = { Header: "Gst", id: "gstType", accessor: d => (<div>{d.gstType === 'gst' ? "CGST/SGST" : "IGST"}</div>) },
			pumpTypeCol = {
				Header: "Pump Type", id: "pumpType", accessor: d => (<div>{d.pumpType === "" ? "_" : d.pumpType === 'pumping' ? "Pumping" : "Dumping"}</div>)
			},
			pumpChargesCol = { Header: "Pump Charges", id: "pumpCharges", accessor: d => (<div class="text-right">{this.state.currency} {d.pumpCharges}</div>) },
			reqQtyCol = { Header: "Required Qty", id: "reqQty", accessor: d => (<div>{d.quantity} {d.product.unit}</div>), width: 150, },
			remainingQtyCol = {
				Header: "Remaining Qty", id: "remainingQty", accessor: d => (
					<div className={d.remainingQty <= 0 ? "value-danger" : "value-success"}>{d.remainingQty} {d.product.unit}</div>
				),
			},
			dispatchQtyCol = {
				Header: "Dispatched Qty", id: "dispatchQty", accessor: d => (<div>{d.dispatched}</div>),

			},
			actionCol = {
				Header: "", accessor: "_id", width: 60,
				Cell: (row => {
					return (
						<div className="actions-right">
							{
								this.props.order.status === "New" ?
									<OverlayTrigger placement="top" overlay={edit}>
										<Button className="btn-list" bsStyle="" fill icon onClick={() => { this.handleShowAddProductModal(row.original) }} ><span className="fa fa-eye"></span></Button>
									</OverlayTrigger>
									: null
							}
							{cookie.load('role') === "admin" ?
								this.props.order.status !== "Approved" ?
									this.props.order.status !== "Dispatching" ?
										<OverlayTrigger placement="top" overlay={trash}>
											<Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.index)} ><span className="fa fa-trash text-danger"></span></Button>
										</OverlayTrigger>
										: null
									: null
								: null
							}
						</div>
					)
				}),
			}
		return (
			<Row>
				{this.state.alert}
				<SalesModuleOrderModalComponent
					showAddProductModal={this.state.showAddProductModal}
					handleCloseAddProductModal={this.handleCloseAddProductModal}
					productList={this.props.productList}
					saveProductToModule={this.saveProductToModule}
					newOrder={this.state.editObj}
					{...this.props}
				/>
				{
					this.props.order.orderData.length ?
						<Col xs={12}>
							<ReactTable
								data={this.props.order.orderData}

								columns={
									[headerCol, productCol, standardRateCol, rateCol, gstCol, reqQtyCol, pumpTypeCol, pumpChargesCol, dispatchQtyCol, remainingQtyCol, actionCol]
								}
								sortable={false}
								minRows={0}
								showPaginationTop={false}
								showPaginationBottom={false}
								className="-striped -highlight"
							/>
						</Col>
						: null
				}
				{
					this.props.order.status === "New" ?
						<Col xs={12}>
							<OverlayTrigger placement="top" overlay={add}>
								<Button
									bsStyle="primary" fill icon
									onClick={() => { this.handleShowAddProductModal() }}>
									<span className="fa fa-plus"></span>
								</Button>
							</OverlayTrigger>
						</Col>
						: null
				}
			</Row>
		)
	}
}

export default SalesModuleOrderTableComponent;