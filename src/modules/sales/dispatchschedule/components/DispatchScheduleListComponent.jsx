import React, { Component } from "react";
import ReactTable from "react-table";
import SweetAlert from 'react-bootstrap-sweetalert';
import cookie from 'react-cookies';
import Moment from "moment";
import { FormGroup, Col, Row, OverlayTrigger, Tooltip, FormControl } from 'react-bootstrap';

import Button from "components/CustomButton/CustomButton.jsx";

import DispatchModalComponent from "../../dispatches/components/DispatchModalComponent.jsx";

import { getDispatchScheduleList, deleteDispatchSchedule, } from "../server/DispatchScheduleServerComm";
import { getSocket } from "js/socket.io.js"
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import loader from "assets/img/loader.gif";

class DispatchScheduleListComponent extends Component {
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
		this.handleShowInvoice = this.handleShowInvoice.bind(this);
		this.delete = this.delete.bind(this);
		this.deleteConfirm = this.deleteConfirm.bind(this);
		this.successAlert = this.successAlert.bind(this);
		this.errorAlert = this.errorAlert.bind(this);

		this.fetchDataServerPlant = this.fetchDataServerPlant.bind(this);
		this.handleDropDownChange = this.handleDropDownChange.bind(this);
		this.getSocketConnection = this.getSocketConnection.bind(this);
		this.filter = this.filter.bind(this);
		this.handleShowDispatchModal = this.handleShowDispatchModal.bind(this);
		this.handleCloseDispatchModal = this.handleCloseDispatchModal.bind(this);


	}
	getSocketConnection() {
		if (getSocket()) {
			this.setState({ socket: getSocket() })
			setTimeout(() => {
				console.log(this.state.socket)
				this.state.socket.on("Dispatch Schedule", () => this.fetchDataFromServer())
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
		params = params + "&status=Schedule";
		if (this.state.filter.status !== "All") { params = params + "&status=" + this.state.filter.status.trim() }
		if (this.state.filter.customer) { params = params + "&customer=" + this.state.filter.customer.trim() }
		if (this.state.filter.dispatchingPlant) { params = params + "&dispatchingPlant=" + this.state.filter.dispatchingPlant.trim() }
		if (this.state.filter.assetPumpType) { params = params + "&assetPumpType=" + this.state.filter.assetPumpType.trim() }
		if (this.state.filter.buildingName) { params = params + "&building=" + this.state.filter.buildingName.trim() }

		getDispatchScheduleList(params,
			function success(data) {
				let pages = Math.ceil(data.count / _this.state.pageSize)
				let tempData = data.rows.map((prop) => {
					return {
						prop: prop,
						date: Moment(prop.dispatchDate).format("DD MMM YYYY"),
						status: prop.status ? prop.status : "",
						plant: prop.dispatchingPlant ? prop.dispatchingPlant.name : "",
						pump: prop.assetPumpType ? prop.assetPumpType : null,
						code: prop.code ? prop.code : "",
						number: prop.number ? prop.number : "",
						buildingName: prop.order ? prop.order.buildingName : "",
						grade: prop.dispatchData[0].product.name,
						order: (
							<a role="button" className="edit-link" href={"#/sales/orders-edit/" + prop.order.code}>{prop.order ? prop.order.number : ""}</a>
						),

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
	handleShowDispatchModal(dispatch) { this.setState({ showDispatchModal: true, dispatch: dispatch }); }
	handleCloseDispatchModal() { this.setState({ showDispatchModal: false }); this.fetchDataFromServer() }

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
					You will not be able to recover this dispatch schedule!
        </SweetAlert>
			)
		});
	}

	deleteConfirm(code) {
		let _this = this;
		deleteDispatchSchedule(code,
			function success() {
				_this.successAlert("Dispatch schedule deleted successfully!")
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



	handleShowInvoice(code) {
		this.setState({ showInvoiceModal: true, dispatchCode: code })
	}
	handleShowDeliveryChallanInvoice(code) {
		this.setState({ showInvoiceDeliveryChallanModal: true, dispatchCode: code })
	}

	render() {
		const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
		const view = (<Tooltip id="edit_tooltip">View</Tooltip>);
		const dispatch = (<Tooltip id="print_tooltip">Add new dispatch</Tooltip>);
		let tempDispatchSchedule = [];
		if (this.state.dispatch !== undefined) {
			tempDispatchSchedule = JSON.parse(JSON.stringify(this.state.dispatch))
			tempDispatchSchedule.code = "New";
			tempDispatchSchedule.status = "New";
			tempDispatchSchedule.dispatchDate = Moment().format("DD MMM YYYY hh:mm A")
			tempDispatchSchedule.dispatchData[0].qty = 0;
		}
		var srNoCol =
		{
			Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
				let base = ((this.state.page) * this.state.pageSize)
				return (<div>{base + d.index + 1}</div>)
			})
		}
		var dateCol = { Header: "Schedule Date", accessor: "date", width: 120, sortable: false }
		var statusCol = {
			Header: "Status", accessor: "", width: 150, sortable: false, Cell: (row => {
				return (
					<div>
						{row.original.status}
					</div>
				)
			})
		}
		var codeCol = { Header: "dis scd number", accessor: "number", width: 120, sortable: false }
		var orderCol = { Header: "Order number", width: 120, accessor: "order", sortable: false }
		var gradeCol = { Header: "Product name", accessor: "grade", width: 120, sortable: false };

		var customerCol = { Header: "Customer Name", accessor: "customer", width: 250, sortable: false }
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
		var plantCol = { Header: "Plant", accessor: "plant", sortable: false }
		var actionsCol = {
			Header: "", accessor: "code", width: 90,
			Cell: (row => {
				return (
					<div className="actions-right">
						<OverlayTrigger placement="top" overlay={dispatch}>
							<Button className="btn-list" bsStyle="success" fill icon onClick={() => this.handleShowDispatchModal(row.original.prop)} ><span className="fa fa-truck fa-flip-horizontal"></span></Button>
						</OverlayTrigger>
						<OverlayTrigger placement="top" overlay={view}>
							<Button className="btn-list" bsStyle="success" fill icon href={"#/sales/schedule-edit/" + row.original.code} ><span className="fa fa-eye"></span></Button>
						</OverlayTrigger>

						{cookie.load('role') === "admin" ?
							<OverlayTrigger placement="top" overlay={trash}>
								<Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.original.code)} ><span className="fa fa-trash"></span></Button>
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
						<Col xs={12}>No dispatch schedule list found. </Col>
					) : (
						<Col xs={12} sm={12} md={12} lg={12}>
							<ReactTable
								data={this.state.dispatchListData}
								columns={
									[srNoCol, dateCol, codeCol, statusCol, orderCol, gradeCol, customerCol, buildingNameCol, plantCol, pumpCol, actionsCol]

								}
								minRows={0}
								sortable={false}
								className="-striped -highlight"
								showPaginationTop={false}
								showPaginationBottom={true}
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
			<Row xs={12} className="list-header">
				<Col xs={12}>
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
								placeholder="Search by building Name"
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

				</Col>
			</Row>
		)

		let addEditDispatchModal = (
			<DispatchModalComponent
				showDispatchModal={this.state.showDispatchModal}
				handleCloseDispatchModal={this.handleCloseDispatchModal}
				dispatchSchedule={tempDispatchSchedule}
				{...this.props}
			/>
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
						{header}
						{table}
						{addEditDispatchModal}
					</div>
				}
			</div>
		)
	}
}

export default DispatchScheduleListComponent;