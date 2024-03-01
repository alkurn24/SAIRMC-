import React, { Component } from "react";
import ReactTable from "react-table";
import SweetAlert from 'react-bootstrap-sweetalert';
import cookie from 'react-cookies';
import Select from "react-select";
import Moment from "moment";
import { FormGroup, Col, OverlayTrigger, Tooltip, FormControl } from 'react-bootstrap';

import Button from "components/CustomButton/CustomButton.jsx";

import { getDispatchList, deleteDispatch, downloadDispatchReport, downloadDispatchChallanReport } from "../server/DispatchServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import loader from "assets/img/loader.gif";

class DispatchListComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			page: 0,
			pageSize: 25,
			pages: 0,
			socket: getSocket(),
			dispatchList: [],
			plantList: [],
			dispatchListData: [],
			plantDataList: [
				{ value: "All", label: "All" },
			],
			filter: {
				status: "All",
				dispatchingPlant: null,
				customer: null,
				assetPumpType: null,
				billingAddr: null
			},
			showInvoiceModal: false,
			dispatchCode: null
		};
		this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
		this.delete = this.delete.bind(this);
		this.deleteConfirm = this.deleteConfirm.bind(this);
		this.successAlert = this.successAlert.bind(this);
		this.errorAlert = this.errorAlert.bind(this);

		this.fetchDataServerPlant = this.fetchDataServerPlant.bind(this);
		this.handleDropDownChange = this.handleDropDownChange.bind(this);
		this.getSocketConnection = this.getSocketConnection.bind(this);
		this.printReport = this.printReport.bind(this);
		this.printChallanReport = this.printChallanReport.bind(this);

		this.filter = this.filter.bind(this);


	}
	getSocketConnection() {
		if (getSocket()) {
			this.setState({ socket: getSocket() })
			setTimeout(() => {
				console.log(this.state.socket)
				this.state.socket.on("Dispatch", () => this.fetchDataFromServer())
			}, 100)
		} else setTimeout(this.getSocketConnection, 2000)
	}

	componentWillReceiveProps(newProps) {
		this.getSocketConnection();
		this.props = newProps
		this.fetchDataFromServer()

	}

	componentWillMount() {
		this.fetchDataFromServer()
		this.fetchDataServerPlant();
	}
	fetchDataFromServer() {
		var _this = this;
		let params = "";
		params = params + "&page=" + this.state.page;
		params = params + "&pageSize=" + this.state.pageSize;
		if (this.state.filter.status !== "All") { params = params + "&status=" + this.state.filter.status.trim() }
		if (this.state.filter.customer) { params = params + "&customerName=" + this.state.filter.customer.trim() }
		if (this.state.filter.dispatchingPlant) { params = params + "&dispatchingPlant=" + this.state.filter.dispatchingPlant.trim() }
		if (this.state.filter.assetPumpType) { params = params + "&assetPumpType=" + this.state.filter.assetPumpType.trim() }
		if (this.state.filter.buildingName) { params = params + "&building=" + this.state.filter.buildingName.trim() }


		if (this.props.code) params += "&order=" + this.props.code
		if (this.props.customercode) params += "&customer=" + this.props.customercode
		getDispatchList(params,
			function success(data) {
				let pages = Math.ceil(data.count / _this.state.pageSize)
				let tempData = data.rows.map((prop) => {
					return {
						date: Moment(prop.dispatchDate).format("DD MMM YYYY"),
						status: prop.status ? prop.status : "",
						plant: prop.dispatchingPlant ? prop.dispatchingPlant.name : "",
						code: prop.code ? prop.code : "",
						pump: prop.assetPumpType ? prop.assetPumpType : null,
						number: prop.number ? prop.number : "",
						buildingName: prop.order ? prop.order.buildingName : "",
						grade: prop.dispatchData[0].product.name,
						order: (
							<a role="button" className="edit-link" href={"#/sales/orders-edit/" + prop.order.code}>{prop.order ? prop.order.number : ""}</a>
						),
						dispatchSchedule: prop.dispatchSchedule ? prop.dispatchSchedule.number : "",
						// dispatchSchedule: (
						// 	<a role="button" className="edit-link" href={"#/sales/schedule-edit/" + prop.dispatchSchedule.code ? prop.dispatchSchedule.code : null}>{prop.dispatchSchedule ? prop.dispatchSchedule.number : ""}</a>
						// ),
						customer: (
							<a role="button" className="edit-link" href={"#/crm/customers-edit/" + prop.order.customer.code}>{prop.order.customer ? prop.order.customer.name : ""}</a>),
					};
				})
				_this.setState({ dispatchListData: tempData, pages: pages, loading: false })
			},
			function error() { _this.setState({ dispatchListData: [], loading: false }); }
		)

	}

	fetchDataServerPlant() {
		let _this = this;
		getPlantList(null,
			function success(data) {
				_this.setState({
					plantList: data.rows.map((s) => {
						return {
							value: s.id,
							label: s.name,
						}
					})
				});
				if (_this.state.plantList.length) {
					_this.state.plantList = _this.state.plantDataList.concat(_this.state.plantList)
				}
			})
	}
	filter(e, name) {
		let tempFilter = this.state.filter;
		tempFilter[name] = e.target.value;
		this.setState({ tempFilter, page: 0 });
		setTimeout(() => this.fetchDataFromServer(), 100);
	}
	printReport(code) {
		downloadDispatchReport(code,
			null,
			(res) => {
				// DO NOT DELETE - method 1
				// const url = window.URL.createObjectURL(new Blob([res.data]));
				// const link = document.createElement('a');
				// link.href = url;
				// link.setAttribute('download', code + '.pdf');
				// document.body.appendChild(link);
				// link.click();

				// DO NOT DELETE - method 2
				// Create a Blob from the PDF Stream
				const file = new Blob([res.data], { type: 'application/pdf' });

				// Build a URL from the file
				const fileURL = URL.createObjectURL(file);
				// Open the URL on new Window
				window.open(fileURL, '_blank');
			},
			(error) => {
			}
		)
	}
	printChallanReport(code) {
		downloadDispatchChallanReport(code,
			null,
			(res) => {
				// DO NOT DELETE - method 1
				// const url = window.URL.createObjectURL(new Blob([res.data]));
				// const link = document.createElement('a');
				// link.href = url;
				// link.setAttribute('download', code + '.pdf');
				// document.body.appendChild(link);
				// link.click();

				// DO NOT DELETE - method 2
				// Create a Blob from the PDF Stream
				const file = new Blob([res.data], { type: 'application/pdf' });

				// Build a URL from the file
				const fileURL = URL.createObjectURL(file);
				// Open the URL on new Window
				window.open(fileURL, '_blank');
			},
			(error) => {
			}
		)
	}
	handleDropDownChange(selectOption, type) {
		var newFilter = this.state.dispatchOrder;
		newFilter[type] = selectOption ? selectOption.value : null;
		this.fetchDataFromServer();
		this.setState({ dispatchOrder: newFilter });
		this.setState({ plantDataList: [] });
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
					You will not be able to recover this dispatch!
        </SweetAlert>
			)
		});
	}

	deleteConfirm(code) {
		let _this = this;
		deleteDispatch(code,
			function success() {
				_this.successAlert("Dispatch deleted successfully!")
			},
			function error() {
				_this.errorAlert("Error in deleting dispatch.");
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

	render() {
		const print = (<Tooltip id="print_tooltip">Invoice</Tooltip>);
		const deliveryChallan = (<Tooltip id="delivery_tooltip"> Delivery challan</Tooltip>);
		const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
		const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
		const view = (<Tooltip id="edit_tooltip">View</Tooltip>);

		var srNoCol =
		{
			Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
				let base = ((this.state.page) * this.state.pageSize)
				return (<div>{base + d.index + 1}</div>)
			})
		}
		// var srCol =
		// {
		// 	Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
		// 		return (<div>{d.index + 1}</div>)
		// 	})
		// }
		var dateCol = { Header: "Dispatch Date", accessor: "date", width: 120, sortable: false }
		var statusCol = {
			Header: "Status", accessor: "", width: 150, sortable: false, Cell: (row => {
				return (
					<div>
						{row.original.status}
					</div>
				)
			})
		}
		var codeCol = { Header: "dispatch number", accessor: "number", width: 120, sortable: false }
		var orderCol = { Header: "Order number", width: 120, accessor: "order", sortable: false }
		var gradeCol = { Header: "Product name", accessor: "grade", width: 120, sortable: false };
		var dispatchScheduleCol = { Header: "dis scd number", width: 200, accessor: "dispatchSchedule", sortable: false }
		var customerCol = { Header: "Customer name", accessor: "customer", width: 250, sortable: false }
		var plantCol = { Header: "Plant Name", accessor: "plant", sortable: false }
		var pumpCol = {
			Header: "Pump", accessor: "pump", width: 150, sortable: false, Cell: (row => {
				return (
					row.original.pump !== null ?
						<div>
							{row.original.pump}
						</div>
						:
						<div>--</div>
				)
			})
		}
		var buildingNameCol = {
			Header: "Building Name", accessor: "buildingName", width: 300, sortable: false, Cell: (row => {
				return (
					row.original.buildingName !== "" ?
						<div>
							{row.original.buildingName}
						</div>
						:
						<div>--</div>
				)
			})
		}
		var actionsCol = {
			Header: "", accessor: "code", width: 120,
			Cell: (row => {
				return (
					<div className="actions-right">
						{row.original.status === "Dispatched" || row.original.status === "Approved" ?
							<OverlayTrigger placement="top" overlay={print}>
								<Button className="btn-list" bsStyle="success" fill icon onClick={() => this.printReport(row.original.code)} ><span className="fa fa-download"></span></Button>
							</OverlayTrigger>
							: null
						}
						{row.original.status === "Dispatched" || row.original.status === "Approved" ?
							<OverlayTrigger placement="top" overlay={deliveryChallan}>
								<Button className="btn-list" bsStyle="success" fill icon onClick={() => this.printChallanReport(row.original.code)} ><span className="fa fa-reorder text-default"></span></Button>
							</OverlayTrigger>
							: null
						}
						{row.original.status !== "Approved" ?
							row.original.status !== "Rejected" ?
								<OverlayTrigger placement="top" overlay={edit}>
									<Button className="btn-list" bsStyle="success" fill icon href={"#/sales/dispatch-edit/" + row.original.code} ><span className="fa fa-edit text-primary"></span></Button>
								</OverlayTrigger>
								:
								<OverlayTrigger placement="top" overlay={view}>
									<Button className="btn-list" bsStyle="success" fill icon href={"#/sales/dispatch-edit/" + row.original.code} ><span className="fa fa-eye text-primary"></span></Button>
								</OverlayTrigger>
							:
							<OverlayTrigger placement="top" overlay={view}>
								<Button className="btn-list" bsStyle="success" fill icon href={"#/sales/dispatch-edit/" + row.original.code} ><span className="fa fa-eye text-primary"></span></Button>
							</OverlayTrigger>
						}

						{cookie.load('role') === "admin" ?
							<OverlayTrigger placement="top" overlay={trash}>
								<Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.original.code)} ><span className="fa fa-trash text-danger"></span></Button>
							</OverlayTrigger>
							: null
						}
					</div>
				)
			})
		}
		let table = (
			<div>
				{!this.state.dispatchListData || !this.state.dispatchListData.length
					? (
						<Col xs={12}>No dispatch list found. </Col>
					) : (
						<Col xs={12} sm={12} md={12} lg={12}>
							<ReactTable
								data={this.state.dispatchListData}
								columns={
									[srNoCol, dateCol, codeCol, statusCol, orderCol, gradeCol, dispatchScheduleCol, customerCol, buildingNameCol, plantCol, pumpCol, actionsCol]
									// [srNoCol, dateCol, codeCol, statusCol, orderCol, dispatchScheduleCol, customerCol, plantCol, actionsCol]


								}
								minRows={0}
								sortable={false}
								className="-striped -highlight"
								showPaginationTop={false}
								showPaginationBottom={this.props.view ? false : true}
								loading={this.state.loading}
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
						</Col>

					)
				}
			</div>
		);
		let header = (
			<div className="list-header">
				<Col xs={12} sm={4} md={2} lg={2}>
					<FormGroup>
						<Select
							clearable={false}
							placeholder="Select status"
							name="status"
							value={this.state.filter.status}
							options={
								[
									{ value: "All", label: "All" },
									{ value: "Planned", label: "Planned" },
									{ value: "BOM-Verified", label: "BOM-Verified" },
									{ value: "Dispatched", label: "Dispatched" },
									{ value: "Approved", label: "Approved" },
									{ value: "Paid", label: "Paid" },
									{ value: "Rejected", label: "Rejected" },

								]
							}
							onChange={(selectOption) => {
								var tempStatus = this.state.filter;
								tempStatus.status = selectOption.value;
								this.fetchDataFromServer();
								this.setState({ tempStatus });
							}}
						/>
					</FormGroup>
				</Col>
				<Col xs={12} sm={4} md={3} lg={3}>
					<FormGroup>
						<FormControl
							type="text"
							name="customer"
							placeholder="Search by customer name"
							onChange={(e) => this.filter(e, "customer")}
						/>
					</FormGroup>
				</Col>
				<Col xs={12} sm={4} md={3} lg={3}>
					<FormGroup>
						<FormControl
							type="text"
							name="buildingName"
							placeholder="Search by building name"
							onChange={(e) => this.filter(e, "buildingName")}
						/>
					</FormGroup>
				</Col>
				<Col xs={12} sm={4} md={2} lg={2}>
					<FormGroup>
						<FormControl
							type="text"
							name="dispatchingPlant"
							placeholder="Search by plant"
							onChange={(e) => this.filter(e, "dispatchingPlant")}
						/>
					</FormGroup>
				</Col>
				{/* <Col xs={12} sm={4} md={2} lg={2}>
					<FormGroup>
						<FormControl
							type="text"
							name="assetPumpType"
							placeholder="Search by pump"
							onChange={(e) => this.filter(e, "assetPumpType")}
						/>
					</FormGroup>
				</Col> */}

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
						{this.props.view ? null : header}
						{table}
					</div>
				}
			</div>

		)
	}
}

export default DispatchListComponent;