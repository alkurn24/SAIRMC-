import React, { Component } from "react";
import ReactTable from "react-table";
import Moment from "moment";
import Select from "components/CustomSelect/CustomSelect.jsx";
import "react-select/dist/react-select.css";
import _ from "lodash";

import moment from "moment";
import Datetime from "react-datetime";
import SweetAlert from "react-bootstrap-sweetalert";
import { Modal, Row, Col, Tab, Nav, NavItem, OverlayTrigger, Tooltip, ControlLabel, FormGroup, FormControl } from "react-bootstrap";

import UploadComponent from 'components/Upload/UploadComponent.jsx';
import Button from "components/CustomButton/CustomButton.jsx";
import { errorColor } from 'variables/Variables.jsx';

import ReceiptNoteModalComponent from "./ReceiptNoteModalComponent.jsx"
import DebitNoteModalComponent from "./DebitNoteModalComponent"
import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import { createGrn, getGrnSingle, updateGrn, deleteGrn } from "modules/purchase/grn/server/GrnServerComm.jsx";
import { getDeliveryPointList } from "modules/crm/deliverypoints/server/DeliveryPointServerComm.jsx";
import { getTransporterList } from "modules/transportermgmt/transporters/server/TransporterServerComm.jsx"
class GrnFormComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: props.settings,
			moduleName: props.moduleName,
			currency: "₹",
			grn: {
				imagePreviewUrl: "",
				photo: "",
				documents: [],
				code: "New",
				status: "New",
				plant: props.order ? props.order.plant.id : null,
				location: "",
				rejectedAndApproved: false,
				order: props.modal ? props.order : {
					vendor: null,
					orderData: []
				},
				grnData: props.modal ? props.order.orderData : [],
				eWaybillNo: "",
				vehicleNo: "",
				challanNo: "",
				challanQty: "",
				challanDate: "",
				materialInwardDate: "",
				billtyNo: "",
				packingCharges: "",
				insuranceCharges: "",
				frieghtCharges: "",
				gstAmount: "",
				loadedWeight: "",
				emptyWeight: "",
				insuranceNo: "",
				notes: ""
			},
			grnForm: {
				mandatory: [],
				custom: []
			},
			plantList: [],
			plantError: false,
			challanNoError: false,
			challanQtyError: false,
			challanDateError: false,
			materialInwardDateError: false,
			plantValid: null,
			challanNoValid: null,
			challanQtyValid: null,
			challanDateValid: null,
			materialInwardDateValid: null,
		}
		this.setGrnData = this.setGrnData.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleSettingsChange = this.handleSettingsChange.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.addCustomField = this.addCustomField.bind(this);
		this.inputConfirmAlert = this.inputConfirmAlert.bind(this);
		this.save = this.save.bind(this);
		this.delete = this.delete.bind(this);
		this.deleteConfirm = this.deleteConfirm.bind(this);
		this.successAlert = this.successAlert.bind(this);
		this.receivedConfirm = this.receivedConfirm.bind(this);
		this.approvedConfirm = this.approvedConfirm.bind(this);
		this.inProgressConfirm = this.inProgressConfirm.bind(this);
		this.rejectedConfirm = this.rejectedConfirm.bind(this);
		this.errorAlert = this.errorAlert.bind(this);
		this.handleMultipleDocumentChange = this.handleMultipleDocumentChange.bind(this);
		this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
		this.renderEditable = this.renderEditable.bind(this);
		this.renderEditableQty = this.renderEditableQty.bind(this);
		this.renderEditableRate = this.renderEditableRate.bind(this);
		this.handleDropDownChange = this.handleDropDownChange.bind(this);


		this.validationCheck = this.validationCheck.bind(this);
		this.setGrnData();
	}
	componentWillMount() {
		let _this = this;
		let params = "";
		if (this.props.match.path === "/my-worklist") {
			params = this.props.order;
		}
		else {
			params = _this.props.match.params.grncode;
		}
		getGrnSingle(params,
			(data => {
				let tempGrn = JSON.parse(JSON.stringify(data))
				tempGrn.challanDate = moment(tempGrn.challanDate);
				tempGrn.location = tempGrn.plant ? tempGrn.plant.name : null;
				tempGrn.plant = tempGrn.plant ? tempGrn.plant.id : null;
				if (tempGrn.grnData.length) {
					for (var i = 0; i < tempGrn.grnData.length; i++) {
						tempGrn.grnData[i].qty = tempGrn.grnData[i].quantity
					}
				}
				_this.setState({ grn: tempGrn })
			}),
			(() => { })
		)


		getDeliveryPointList("grn=true",
			(data => {
				_this.setState({
					deliveryPointList: data.rows.map(prop => {
						return ({
							id: prop.id,
							value: prop.id,
							label: prop.name,
							street_address: prop.street_address
						})
					})
				})
			}),
			(() => { })
		)
		getPlantList("",
			function success(data) {
				_this.setState({
					plantList: data.rows.map((s) => {
						return {
							_id: s.id,
							value: s.id,
							label: s.name,
						}
					})
				});
			})
		getTransporterList("",
			(data => {
				_this.setState({
					transporterList: data.rows.map(prop => {
						return ({
							id: prop.id,
							value: prop.id,
							label: prop.name,
							gstin: prop.gstin
						})
					})
				})
			}),
			(() => { })
		)
	}
	componentWillReceiveProps(newProps) {
		this.props = newProps;
		this.setGrnData();
	}
	delete() {
		this.setState({
			alert: (
				<SweetAlert
					warning
					style={{ display: "block", marginTop: "-100px" }}
					title="Are you sure?"
					onConfirm={() => this.deleteConfirm()}
					onCancel={() => this.setState({ alert: null })}
					confirmBtnBsStyle="info"
					cancelBtnBsStyle="danger"
					confirmBtnText="Yes, delete it!"
					cancelBtnText="Cancel"
					showCancel
				>
					You will not be able to recover this raw material!
        </SweetAlert>
			)
		});
	}
	deleteConfirm() {
		let _this = this;
		deleteGrn(_this.state.rawMaterial,
			function success(data) {
				_this.props.history.push("/module/xyz");
			},
			function error(code) {
				_this.errorAlert("Error in deleting GRN.");
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
					onConfirm={() => this.setState({ alert: null })}
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
	approvedConfirm() {
		this.setState({
			alert: (
				<SweetAlert
					warning
					style={{ display: "block", marginTop: "-100px" }}
					title="Are you sure?"
					onConfirm={() => {
						let tempModule = this.state.grn;
						tempModule.status = "Approved";
						this.setState({ tempModule })
						this.validationCheck()
					}}
					onCancel={() => this.setState({ alert: null })}
					confirmBtnBsStyle="danger"
					cancelBtnBsStyle="info"
					confirmBtnText="Yes, approve it!"
					cancelBtnText="Cancel"
					showCancel
				>
					Do you want to approve this?
        </SweetAlert>
			)
		});
	}
	rejectedConfirm() {
		this.setState({
			alert: (
				<SweetAlert
					warning
					style={{ display: "block", marginTop: "-100px" }}
					title="Are you sure?"
					onConfirm={() => {
						let tempModule = this.state.grn;
						tempModule.status = "Rejected";
						this.setState({ tempModule })
						this.validationCheck()
					}}
					onCancel={() => this.setState({ alert: null })}
					confirmBtnBsStyle="danger"
					cancelBtnBsStyle="info"
					confirmBtnText="Yes, reject it!"
					cancelBtnText="Cancel"
					showCancel
				>
					Do you want to reject this?
        </SweetAlert>
			)
		});
	}
	inProgressConfirm() {
		this.setState({
			alert: (
				<SweetAlert
					warning
					style={{ display: "block", marginTop: "-100px" }}
					title="Are you sure?"
					onConfirm={() => {
						let tempModule = this.state.grn;
						tempModule.status = "Approved";
						this.setState({ tempModule })
						this.validationCheck()
					}}
					onCancel={() => this.setState({ alert: null })}
					confirmBtnBsStyle="danger"
					cancelBtnBsStyle="info"
					confirmBtnText="Yes,"
					cancelBtnText="Cancel"
					showCancel
				>
					Do you want to In-Progress this?
        </SweetAlert>
			)
		});
	}
	receivedConfirm() {
		this.setState({
			alert: (
				<SweetAlert
					warning
					style={{ display: "block", marginTop: "-100px" }}
					title="Are you sure?"
					onConfirm={() => {
						let tempModule = this.state.grn;
						tempModule.status = "Received";
						this.setState({ tempModule })
						this.validationCheck()
					}}
					onCancel={() => this.setState({ alert: null })}
					confirmBtnBsStyle="danger"
					cancelBtnBsStyle="info"
					confirmBtnText="Yes, receive it!"
					cancelBtnText="Cancel"
					showCancel
				>
					Do you want to receive this? After receiving this you will not be able to make any changes.
        </SweetAlert>
			)
		});
	}
	setGrnData() {

	}
	addCustomField() {
		this.setState({
			alert: (
				<SweetAlert
					input
					showCancel
					style={{ display: "block", marginTop: "-100px" }}
					title="Enter Title"
					onConfirm={e => this.inputConfirmAlert(e)}
					onCancel={() => this.setState({ alert: null })}
					confirmBtnBsStyle="info"
					cancelBtnBsStyle="danger"
				/>
			)
		});
	}
	inputConfirmAlert(e) {
		this.setState({ alert: null });
		var newGrn = this.state.grnForm;
		newGrn.custom.push({ name: e.toLowercase(), label: e, value: true });
		this.setState({ grnForm: newGrn });
	}

	validationCheck() {
		this.state.grn.plant === null ?
			this.setState({ plantError: "Select Plant", plantValid: false }) :
			this.setState({ plantError: "", plantValid: true })
		this.state.grn.challanNo === "" ?
			this.setState({ challanNoError: "", challanNoValid: false }) :
			this.setState({ challanNoError: "", challanNoValid: true })
		this.state.grn.challanDate === "" ?
			this.setState({ challanDateError: "Select challan date.", challanDateValid: false }) :
			this.setState({ challanDateError: "Select challan date.", challanDateValid: true })
		this.state.grn.materialInwardDate === "" ?
			this.setState({ materialInwardDateError: "Select material inward date.", materialInwardDateValid: false }) :
			this.setState({ materialInwardDateError: "Select material inward date.", materialInwardDateValid: true })
		setTimeout(this.save, 10);
	}
	save() {
		let _this = this;
		let tempGrn = JSON.parse(JSON.stringify(this.state.grn))
		let tempStatus = this.state.moduleName;
		if (this.props.match.path === "/my-worklist") { tempGrn.rejectedAndApproved = true }
		if ((tempGrn.status === "Approved" || tempGrn.status === "Planned")) {
			tempStatus = "Weight saved"
			tempGrn.status = "In-Progress"
		}
		else {
			if (tempGrn.status === "Approved") { tempStatus = "GRN approved" }
			else if (tempGrn.status === "Planned") { tempStatus = "GRN saved" }
			else if (tempGrn.status === "Closed") { tempStatus = "GRN closed" }
			else if (tempGrn.status === "Rejected") { tempStatus = "GRN rejected" }
			else if (tempGrn.status === "In-Progress") { tempStatus = "GRN saved" }
			else if (tempGrn.status === "Received") { tempStatus = "GRN received" }
		}
		if (_this.state.plantValid && _this.state.challanNoValid && _this.state.challanDateValid && _this.state.materialInwardDateValid) {

			if (tempGrn.order.orderData.length) {
				for (let i = 0; i < tempGrn.order.orderData.length; i++) {
					tempGrn.grnData[i].remainingQty = tempGrn.order.orderData[i].remainingQty;
					tempGrn.grnData[i]._id = tempGrn.order.orderData[i]._id;
				}
			}
			tempGrn.order = tempGrn.order.id;
			tempGrn.deliveryAddr = tempGrn.deliveryAddr ? tempGrn.deliveryAddr.id : null;
			if (tempGrn.grnData.length) {
				for (let i = 0; i < tempGrn.grnData.length; i++) {
					tempGrn.grnData[i].inventory = tempGrn.grnData[i].inventory.id;
					tempGrn.grnData[i].quantity = tempGrn.grnData[i].qty;
					tempGrn.grnData[i].received = tempGrn.grnData[i].received ? tempGrn.grnData[i].received : 0
				}
			}
			tempGrn.grnData.map(s => { if (s.qty === "") { s.qty = 0; } return })
			tempGrn.grnData.map(s => { if (s.rejectedQty === "") { s.rejectedQty = 0; } return })
			if (tempGrn.grnData.filter(x => { return x.qty === 0 })) {
				if (tempGrn.grnData.filter(x => { return x.qty > 0 }).length > 0) {
					if (this.state.grn.code === "New") {
						tempGrn.status = "Planned"
						createGrn(tempGrn,
							function success(data) {
								_this.successAlert("GRN added successfully!");
								setTimeout(() => {
									_this.props.handleCloseGrnModal();
								}, 2000);
							},

							function error(res) {
								if (res.message === 'Request failed with status code 701') { _this.errorAlert("Error"); }
								else {
									_this.errorAlert("Something went wrong!")
								}
							}
						)
					}
					else {
						tempGrn.plant = tempGrn.plant.id ? tempGrn.plant.id : tempGrn.plant;
						if ((_this.state.grn.emptyWeight > 0 || _this.state.grn.loadedWeight > 0) && (_this.state.grn.status === "Approved" || _this.state.grn.status === "Planned")) {
							tempGrn.status = "In-Progress";
						}
						updateGrn(tempGrn,
							function success() {
								_this.successAlert(tempStatus + " successfully!")
								if (_this.props.modal) setTimeout(() => { _this.props.handleCloseGrnModal(); }, 2000);
								_this.props.history.push("purchase/grn");
							},
							function error() {
								_this.errorAlert("Error in saving GRN.");
							}
						)
					}
				}
				else {
					_this.setState({ formError: "Please enter recevied QTY." })
				}
			}

			else {
				_this.setState({ formError: "Received quantity should not be empty." })
			}
		}
		else {
			_this.setState({ formError: "Please enter required fields" })
		}
	}
	handleDropDownChange(selectOption, type) {
		var newGrn = this.state.grn;
		newGrn[type] = selectOption ? selectOption.value : null;
		this.setState({ grn: newGrn });
	}
	handleDateChange(name, date) {
		var moduleTemp = this.state.grn;
		moduleTemp[name] = date._d;
		this.setState({ moduleTemp });
	}
	handleMultipleDocumentChange(newDocument) {
		var grn = this.state.grn;
		grn.documents = newDocument.documents;
		this.setState({ grn });
	}
	handleDeleteDocument(key) {
		let grn = this.state.grn;
		grn.documents.slice();
		grn.documents.splice(key, 1);
		this.setState({ grn });
	}
	handleSettingsChange() {

	}
	handleInputChange(e, param) {
		var newObj = this.state.grn;
		if (!e.target) {
			newObj[param] = e;
			this.setState({ pricing: newObj, formError: null });
		} else {
			if (e.target.name.indexOf("custom_") !== -1) {
				var key = parseInt(e.target.name.split("_")[1], 10);
				newObj.custom[key] = e.target.value;
				this.setState({ grn: newObj });
			} else if (e.target.name.indexOf("radio_") !== -1) {
				newObj[e.target.name.split("_")[1]] = e.target.value;
				this.setState({ grn: newObj });
			} else if (e.target.name.indexOf("grn_") !== -1) {
				newObj.grnData[e.target.name.split("_")[1]][e.target.name.split("_")[2]] = e.target.value;
				this.setState({ grn: newObj });
			} else {
				newObj[e.target.name] = e.target.value;
				this.setState({ grn: newObj });
			}
		}
	}
	renderEditableQty(row) {
		return (
			<FormGroup>
				{this.state.grn.code === "New" ?
					<div>
						<FormControl
							disabled={this.state.grn.code !== "New" ? true : false}
							type="number"
							min={0}
							value={this.state.grn.grnData[row.index].rejectedQty ? this.state.grn.grnData[row.index].rejectedQty : 0}
							onChange={(e) => {
								const grn = this.state.grn;
								if (grn.grnData) {
									grn.grnData[row.index].rejectedQty = e.target.value;
									this.setState({ grn });
								}
							}}
						/>
					</div>
					:
					<ControlLabel>{this.state.grn.grnData[row.index] ? this.state.grn.grnData[row.index].rejectedQty : 0}</ControlLabel>

				}
			</FormGroup>
		)
	}
	renderEditable(row) {
		return (
			<FormGroup>
				{this.state.grn.code === "New" ?
					<div>
						<FormControl
							disabled={this.state.grn.code !== "New" ? true : false}
							type="number"
							min={0}
							value={this.state.grn.grnData[row.index].qty ? this.state.grn.grnData[row.index].qty : 0}
							onChange={(e) => {
								if (this.state.grn.grnData) {
									const grn = this.state.grn;
									grn.grnData[row.index].qty = e.target.value;
									this.setState({ grn });
								}
							}}
						/>
					</div>
					:
					<ControlLabel>{this.state.grn.grnData[row.index] ? this.state.grn.grnData[row.index].qty : 0}</ControlLabel>
				}
			</FormGroup>
		)
	}
	renderEditableRate(row) {
		return (
			<FormGroup>
				{this.state.grn.code === "New" ?
					<div>
						<FormControl
							disabled={this.state.grn.code !== "New" ? true : false}
							type="number"
							min={0}
							value={this.state.grn.grnData[row.index] ? this.state.grn.grnData[row.index].rate : 0}
							onChange={(e) => {
								const grn = this.state.grn;
								if (grn.grnData) {
									grn.grnData[row.index].rate = e.target.value;
									this.setState({ grn });
								}
							}}
						/>
					</div>
					:
					<div class="text-right">{this.state.grn.grnData[row.index] ? this.state.grn.grnData[row.index].rate.toFixed(2) : 0}</div>
				}
			</FormGroup>
		)
	}
	render() {
		const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
		const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
		const list = (<Tooltip id="list_tooltip">GRN list</Tooltip>);
		const debitNote = (<Tooltip id="print_tooltip">Debit note</Tooltip>);
		const receiptNote = (<Tooltip id="print_tooltip">Receipt note</Tooltip>);
		const approve = (<Tooltip id="approve">Approve GRN</Tooltip>);
		const rejectAndReceive = (<Tooltip id="approve"> Reject or receive GRN</Tooltip>);
		const receive = (<Tooltip id="approve">Receive GRN</Tooltip>);
		const reject = (<Tooltip id="reject">Reject GRN</Tooltip>);

		var orderData = this.state.grn.order.orderData;
		var grnData = this.state.grn.grnData;
		var srCol = { Header: "Sr", width: 50, Cell: (row => { return (<div>{row.index + 1}</div>) }) };
		var inventoryCol = {
			Header: "Material", id: "Material",
			Cell: (row => {
				return (
					<div>
						{this.state.grn.order.type === "Store" ?
							row.original.inventory ? row.original.inventory.name : null
							:
							row.original.service ? row.original.service.name : null
						}</div>
				)
			})
		};
		var orderQtyCol = {
			Header: "Order Qty", id: "orderQty",
			Cell: (row => {
				return (
					<div>{orderData[row.index].orderQuantity + " " + grnData[row.index].inventory.unit}</div>
				)
			})
		};
		var remainingQtyCol = {
			Header: "Remaining Qty", id: "remainingQty",
			Cell: (row => {
				return (
					<div>{orderData[row.index].remainingQty + " " + grnData[row.index].inventory.unit}</div>
				)
			})
		};
		var rateCol;
		if (this.state.grn.order.type === "Store") {
			rateCol = {
				Header: "(₹) Rate", id: "rate",
				Cell: (row => {
					return (
						<div class="text-right">
							{orderData[row.index].rate ? (orderData[row.index].rate).toFixed(2) : 0}
						</div>
					)
				})
			};
		}
		else {
			rateCol = { Header: "(₹) Rate", width: 300, accessor: "rate", Cell: this.renderEditableRate }
		};
		var qtyCol = { Header: "Received Qty ", accessor: "qty", Cell: this.renderEditable };
		var rejectedQty = {
			Header: "Rejected Qty", accessor: "rejectedQty", Cell: this.renderEditableQty,
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
		};


		var amountCol = {
			Header: "Total Amount (Ex. TAX)",
			id: "value",
			width: 200,
			Cell: (row => {
				let total = parseFloat(orderData[row.index].rate * (row.original.qty ? row.original.qty : 0));
				return <div className="text-right">{(total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
			}),
			Footer: () => {
				let subTotal = _.sum(this.state.grn.grnData.map(row => {
					let total = (row.rate ? row.rate : 0) * (row.qty ? row.qty : 0);
					return (total);
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

		let grnInfo = (
			<Row>
				<Col xs={12}>
					<Col xs={12} sm={4} md={3} lg={3}>
						{this.state.grn.code !== "New" ?
							<FormGroup>
								<ControlLabel><b>GRN code:</b><br /> {this.state.grn ? this.state.grn.number : null}</ControlLabel>
							</FormGroup>
							: null
						}
						<br />
						<FormGroup>
							<ControlLabel><b>PO Code:</b><br /> <a className="edit-link" href={"#/purchase/orders-edit/" + this.state.grn.order.code}>{this.state.grn.order.number}</a></ControlLabel>
						</FormGroup>
					</Col>
					{this.state.grn.code !== "New" ?
						<Col xs={12} sm={4} md={3} lg={3}>
							<FormGroup>
								<ControlLabel pullRight><b>Status:</b><br /> {this.state.grn.status}</ControlLabel>
							</FormGroup>
						</Col>
						: null
					}
					{this.state.grn.code !== "New" ?
						<Col xs={12} sm={4} md={3} lg={3}>
							<FormGroup>
								<ControlLabel><b>Created By:</b><br />{this.state.grn.user ? this.state.grn.user.name : null}</ControlLabel>
							</FormGroup>
						</Col>
						: null
					}
					<Col xs={12} sm={4} md={3} lg={3}>
						<FormGroup>
							<ControlLabel><b>Creation Time:</b><br /> {this.state.grn.createdAt ? Moment(this.state.grn.createdAt).format('DD MMM YYYY hh:mm A') : Moment().format('DD MMM YYYY hh:mm A')}</ControlLabel>
						</FormGroup>
					</Col>
				</Col>
			</Row>
		);
		let vendorInfo = (
			<Row>
				<Col xs={12}>
					<Col xs={12} sm={3} md={3} lg={3}>
						<FormGroup>
							<ControlLabel><b>vendor Name:</b></ControlLabel>< br />
							<small>
								{
									this.state.grn.order.vendor ? (
										<div>
											{this.state.grn.order.vendor.name}<br />
											Primary Email: {this.state.grn.order.vendor.email}<br />
											Primary Phone: {this.state.grn.order.vendor.phone}< br />
											GSTIN: {this.state.grn.order.vendor.gstin}
										</div>
									) : null
								}
							</small>
						</FormGroup>
					</Col>
					<Col xs={12} sm={3} md={3} lg={3}>
						<FormGroup>
							<ControlLabel><b>Contact:</b></ControlLabel><br />

							<small>
								{
									this.state.grn.order.contact ? (
										<div>
											{this.state.grn.order.contact.name}<br />
											{this.state.grn.order.contact.email}<br />
											{this.state.grn.order.contact.phone}
										</div>
									) : null
								}
							</small>
						</FormGroup>
					</Col>
					<Col xs={12} sm={3} md={3} lg={3}>
						<FormGroup>
							<ControlLabel><b>Billing Address:</b></ControlLabel><br />
							<small>
								{
									this.state.grn.order.billingAddr ? (
										<div>
											{this.state.grn.order.billingAddr.name}<br />
											{this.state.grn.order.billingAddr.street_address}, {this.state.grn.order.billingAddr.city}, {this.state.grn.order.billingAddr.state}, {this.state.grn.order.billingAddr.zipcode}
										</div>
									) : null
								}
							</small>
						</FormGroup>
					</Col>
				</Col>
			</Row>
		);
		let grnDetailsInfo = (
			<Row>
				<Col xs={12}>
					<Col xs={12} sm={4} md={2} lg={2}>
						{this.state.grn.status !== "Received" ?
							<FormGroup>
								<ControlLabel>Location <span className="star">*</span></ControlLabel>
								<Select
									disabled
									clearable={false}
									placeholder="Select location"
									name="plant"
									options={this.state.plantList}
									value={this.state.grn.plant ? this.state.grn.plant : null}
									onChange={(selectOption) => this.handleDropDownChange(selectOption, "plant")}
									style={{ color: this.state.plantValid || this.state.plantValid === null ? "" : errorColor, borderColor: this.state.plantValid || this.state.plantValid === null ? "" : errorColor }}
								/>
							</FormGroup>
							:
							<FormGroup>
								<ControlLabel><b>Location Name:</b><br /> {this.state.grn.plant ? this.state.grn.location : null}</ControlLabel>
							</FormGroup>
						}
					</Col>
					<Col xs={12} sm={4} md={2} lg={2}>
						{this.state.grn.status !== "Received" ?
							<FormGroup>
								<ControlLabel>Challan Number <span className="star">*</span></ControlLabel>
								<FormControl
									disabled={this.state.grn.code !== "New" ? true : false}
									type="text"
									placeholder="0"
									name="challanNo"
									value={this.state.grn.challanNo}
									onChange={this.handleInputChange}
									className={this.state.challanNoValid || this.state.challanNoValid === null ? "" : "error"}

								/>
							</FormGroup>
							:
							<FormGroup>
								<ControlLabel><b>Challan Number :</b><br />{this.state.grn.challanNo ? this.state.grn.challanNo : null}</ControlLabel>
							</FormGroup>
						}
					</Col>

					<Col xs={12} sm={4} md={2} lg={2}>

						{this.state.grn.status !== "Received" ?
							this.state.grn.code === "New" ?
								<FormGroup>
									<ControlLabel>Challan Date <span className="star">*</span></ControlLabel>
									<Datetime
										disabled={this.state.grn.code !== "New" ? true : false}
										timeFormat={false}
										closeOnSelect={true}
										dateFormat="DD MMM YYYY"
										name="challanDate"
										inputProps={{ placeholder: "Challan date", style: { color: this.state.challanDateValid || this.state.challanDateValid === null ? "" : errorColor, borderColor: this.state.challanDateValid || this.state.challanDateValid === null ? "" : errorColor } }}
										value={this.state.grn.challanDate ? Moment(this.state.grn.challanDate).format("DD MMM YYYY") : null}
										onChange={(date) => this.handleDateChange("challanDate", date)}
									/>
								</FormGroup>
								:
								<FormGroup>
									<ControlLabel>Challan Date<span className="star">*</span> </ControlLabel>
									<FormControl
										disabled
										value={this.state.grn.challanDate ? Moment(this.state.grn.challanDate).format("DD MMM YYYY") : null}>
									</FormControl>
								</FormGroup>
							:
							<ControlLabel><b>Challan Date  :</b><br />{this.state.grn.challanDate ? Moment(this.state.grn.challanDate).format("DD MMM YYYY") : null}</ControlLabel>
						}
					</Col>
					<Col xs={12} sm={4} md={2} lg={2}>
						<FormGroup>
							{this.state.grn.status !== "Received" ?
								< div >
									<ControlLabel>Material Inward Date <span className="star">*</span></ControlLabel>
									<Datetime
										timeFormat={false}
										closeOnSelect={true}
										dateFormat="DD MMM YYYY"
										name="materialInwardDate"
										inputProps={{ placeholder: "Material inward date", style: { color: this.state.materialInwardDateValid || this.state.materialInwardDateValid === null ? "" : errorColor, borderColor: this.state.materialInwardDateValid || this.state.materialInwardDateValid === null ? "" : errorColor } }}
										value={this.state.grn.materialInwardDate ? Moment(this.state.grn.materialInwardDate).format("DD MMM YYYY") : null}
										onChange={(date) => this.handleDateChange("materialInwardDate", date)}
									/>
								</div>
								:
								<ControlLabel><b>Material Inward Date :</b><br />{this.state.grn.materialInwardDate ? Moment(this.state.grn.materialInwardDate).format("DD MMM YYYY") : null}</ControlLabel>
							}
						</FormGroup>
					</Col>

					<Col xs={12} sm={4} md={2} lg={2}>
						{this.state.grn.status !== "Received" ?
							<FormGroup>
								<ControlLabel>Vehicle Number</ControlLabel>

								<FormControl
									disabled={this.state.grn.code !== "New" ? true : false}
									type="text"
									placeholder="Enter vehicle number"
									name="vehicleNo"
									value={this.state.grn.vehicleNo}
									onChange={this.handleInputChange}
								/>
							</FormGroup>
							:
							<FormGroup>
								<ControlLabel><b>Vehicle Number  :</b><br />{this.state.grn.vehicleNo ? this.state.grn.vehicleNo : null}</ControlLabel>
							</FormGroup>
						}
					</Col>
					<Col xs={12} sm={4} md={2} lg={2}>
						{this.state.grn.status !== "Received" ?
							<FormGroup>
								<ControlLabel>Insurance Number</ControlLabel>
								<FormControl
									disabled={this.state.grn.code !== "New" ? true : false}
									type="text"
									placeholder="0"
									name="insuranceNo"
									value={this.state.grn.insuranceNo ? this.state.grn.insuranceNo : 0.00}
									onChange={this.handleInputChange}
								/>
							</FormGroup>
							:
							<FormGroup>
								<ControlLabel><b>Insurance Number  :</b><br />{this.state.grn.insuranceNo}</ControlLabel>
							</FormGroup>
						}
					</Col>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12}>
					<Col xs={12} sm={4} md={2} lg={2}>
						{this.state.grn.status !== "Received" ?
							<FormGroup>
								<ControlLabel>E-Way Bill Number</ControlLabel>
								<FormControl
									disabled={this.state.grn.code !== "New" ? true : false}
									placeholder="E-Way bill number"
									name="eWaybillNo"
									value={this.state.grn.eWaybillNo}
									onChange={this.handleInputChange}
								/>
							</FormGroup>
							:
							<FormGroup>
								<ControlLabel><b>E-Way Bill Number :</b><br />{this.state.grn.eWaybillNo}</ControlLabel>
							</FormGroup>
						}
					</Col>
					{
						this.state.grn.status !== "New" ?
							(
								<Col xs={12} sm={4} md={2} lg={2}>
									{this.state.grn.status !== "Received" ?
										<FormGroup>
											<ControlLabel>Loaded Weight</ControlLabel>
											<FormControl
												disabled={this.props.match.path === "/my-worklist" || this.state.grn.status === "Planned" || this.state.grn.status === "Approved" ? false : true}
												type="text"
												placeholder="0"
												name="loadedWeight"
												value={this.state.grn.loadedWeight}
												onChange={this.handleInputChange}
											/>
										</FormGroup>
										:
										<FormGroup>
											<ControlLabel><b>Loaded Weight :</b><br />{this.state.grn.loadedWeight}</ControlLabel>
										</FormGroup>
									}
								</Col>
							) : null
					}
					{
						this.state.grn.status !== "New" ?
							(<Col xs={12} sm={4} md={2} lg={2}>
								{this.state.grn.status !== "Received" ?
									<FormGroup>
										<ControlLabel>Empty Weight</ControlLabel>
										<FormControl
											disabled={this.props.match.path === "/my-worklist" || this.state.grn.status === "Planned" || this.state.grn.status === "Approved" ? false : true}
											type="text"
											placeholder="0"
											name="emptyWeight"
											value={this.state.grn.emptyWeight}
											onChange={this.handleInputChange}
										/>
									</FormGroup>
									:
									<FormGroup>
										<ControlLabel><b>Empty Weight :</b><br />{this.state.grn.emptyWeight}</ControlLabel>
									</FormGroup>
								}
							</Col>
							) : null
					}
					<Col xs={12} sm={4} md={2} lg={2}>
						{this.state.grn.status !== "Received" ?
							<FormGroup>
								<ControlLabel>Packing Charges (₹) </ControlLabel>
								<FormControl
									disabled={this.state.grn.code !== "New" ? true : false}
									type="number"
									placeholder="0"
									min={0}
									name="packingCharges"
									value={this.state.grn.packingCharges ? this.state.packingCharges : 0.00}
									onChange={this.handleInputChange}
								/>
							</FormGroup>
							:
							<FormGroup>
								<ControlLabel><b>Packing Charges (₹) :</b><br />{this.state.grn.packingCharges}</ControlLabel>
							</FormGroup>
						}
					</Col>
					<Col xs={12} sm={4} md={2} lg={2}>
						{this.state.grn.status !== "Received" ?
							<FormGroup>
								<ControlLabel>Insurance Charges (₹)</ControlLabel>
								<FormControl
									disabled={this.state.grn.code !== "New" ? true : false}
									type="number"
									placeholder="0"
									min={0}
									name="insuranceCharges"
									value={this.state.grn.insuranceCharges}
									onChange={this.handleInputChange}
								/>
							</FormGroup>
							:
							<FormGroup>
								<ControlLabel><b>Insurance Charges (₹):</b><br />{this.state.grn.insuranceCharges}</ControlLabel>
							</FormGroup>
						}
					</Col>
					<Col xs={12} sm={4} md={2} lg={2}>
						{this.state.grn.status !== "Received" ?
							<FormGroup>
								<ControlLabel>Frieght Charges (₹)</ControlLabel>
								<FormControl
									disabled={this.state.grn.code !== "New" ? true : false}
									type="number"
									placeholder="0"
									min={0}
									name="frieghtCharges"
									value={this.state.grn.frieghtCharges}
									onChange={this.handleInputChange}
								/>
							</FormGroup>
							:
							<FormGroup>
								<ControlLabel><b>Frieght Charges (₹):</b><br />{this.state.grn.frieghtCharges}</ControlLabel>
							</FormGroup>
						}
					</Col>
				</Col>
			</Row>
		);
		let grnDataInfo = (
			<Col xs={12}>
				<Tab.Container defaultActiveKey="GRN">
					<div className="">
						<Col xs={12} sm={12} md={12} lg={12}>
							<Row>
								<Nav bsStyle="tabs">
									<NavItem eventKey="GRN"><i className="fa fa-truck" />GRN</NavItem>
									{this.state.grn.code !== "New" ?
										<NavItem eventKey="documents"><i className="fa fa-file" /> Documents</NavItem>
										: null}
								</Nav>
							</Row>
						</Col>
						<Row>
							<Tab.Content animation>
								<Tab.Pane eventKey="GRN">
									{
										(!this.state.grn.grnData || !this.state.grn.grnData.length) ? (
											<div></div>
										) : (<div style={{ padding: "2px" }}>
											{this.state.grn.code !== "New" ?
												<Col xs={12}>	<small>Note: Click on "Received QTY" column to enter value.</small></Col>
												: null
											}
											<Col xs={12}>
												<ReactTable
													data={this.state.grn.grnData}
													columns={
														this.state.grn.order.type === "Store" ?
															[srCol, inventoryCol, rateCol, orderQtyCol, remainingQtyCol, qtyCol, rejectedQty, amountCol]
															:
															[srCol, inventoryCol, rateCol, qtyCol, amountCol]

													}
													minRows={0}
													sortable={false}
													className="-striped -highlight"
													showPaginationTop={false}
													showPaginationBottom={false}
												/>
											</Col>
										</div>
											)
									}

								</Tab.Pane>
								<Tab.Pane eventKey="documents">
									<UploadComponent
										document
										type="grns"
										documents={this.state.grn.documents}
										details={this.state.grn}
										dropText="Drop files or click here"
										handleMultipleDocumentChange={this.handleMultipleDocumentChange}
										handleDeleteDocument={this.handleDeleteDocument}
									/>
								</Tab.Pane>
							</Tab.Content>
						</Row>
					</div>
				</Tab.Container>
			</Col>

		);
		let form = (
			<Row>
				<fieldset>
					<Col xs={12} sm={12} md={12} lg={12}>
						{this.props.modal ? <Col xs={12}>{grnInfo}</Col> : <Col xs={12}>{grnInfo}</Col>}
					</Col>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Col xs={12}><h6 className="section-header">Vendor Information</h6> </Col>
						{this.props.modal ? <Col xs={12}>{vendorInfo}</Col> : <Col xs={12}>{vendorInfo}</Col>}
					</Col>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Col xs={12}><h6 className="section-header">GRN Details</h6></Col>
						{this.props.modal ? <Col xs={12}>{grnDetailsInfo}</Col> : <Col xs={12}>{grnDetailsInfo}</Col>}
					</Col>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Col xs={12}>{grnDataInfo}</Col>
					</Col>
				</fieldset>
			</Row >
		);
		let actions = (
			<Col xs={12} sm={12} md={12} lg={12}>
				<center><h5 className="text-danger">{this.state.formError}</h5></center>
				{
					(this.props.match.path !== "/my-worklist") ?
						<OverlayTrigger placement="top" overlay={back}>
							<Button bsStyle="warning" fill icon onClick={this.props.history.goBack} ><span className="fa fa-arrow-left"></span></Button>
						</OverlayTrigger>
						: null

				}
				{
					(this.props.match.path !== "/my-worklist") ?
						<OverlayTrigger placement="top" overlay={list}>
							<Button bsStyle="primary" fill icon onClick={() => this.props.history.push('/purchase/grn')} ><span className="fa fa-list"></span></Button>
						</OverlayTrigger>
						: null

				}
				{this.state.grn.code === "New" || this.state.grn.status === "Approved" || this.state.grn.status !== "In-Progress" || this.state.grn.order.isQa === false ?
					(this.state.grn.status !== "Received" ?
						this.props.match.path !== "/my-worklist" ?
							<OverlayTrigger placement="top" overlay={save}>
								<Button bsStyle="success" fill icon pullRight onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
							</OverlayTrigger>
							: null
						: null
					) : null

				}

				{
					this.state.grn.order.isQa && this.state.grn.status === "Planned" && this.props.match.path === "/my-worklist" ?
						<OverlayTrigger placement="top" overlay={reject}>
							<Button bsStyle="danger" fill pullRight icon disabled={this.state.settings} onClick={this.rejectedConfirm}>	<span className="fa fa-times"></span>
							</Button>
						</OverlayTrigger>
						: null
				}
				{
					this.state.grn.order.isQa && this.state.grn.status === "Planned" && this.props.match.path === "/my-worklist" ?
						<OverlayTrigger placement="top" overlay={approve}>
							<Button bsStyle="success" fill pullRight icon disabled={this.state.settings} onClick={this.approvedConfirm}><span className="fa fa-check"></span>
							</Button>
						</OverlayTrigger>
						: null
				}
				{(this.props.match.path === "/my-worklist") ?
					this.state.grn.status === "Planned"
						? (
							<OverlayTrigger placement="top" overlay={rejectAndReceive}>
								<Button bsStyle="primary" style={{ marginTop: "0", marginRight: "15px" }} fill pullRight icon disabled={this.state.settings} onClick={this.inProgressConfirm}>	<span className="fa fa-hourglass-start"></span>
								</Button>
							</OverlayTrigger>
						) : null
					: null
				}
				{(this.props.match.path !== "/my-worklist") ?
					this.state.grn.status === "In-Progress"
						? (
							<OverlayTrigger placement="top" overlay={receive}>
								<Button bsStyle="primary" fill pullRight icon disabled={this.state.settings} onClick={this.receivedConfirm}><span className="fa fa-envelope"></span>
								</Button>
							</OverlayTrigger>
						) : null
					: null
				}
				{
					this.state.grn.code !== "New" && this.state.grn.status === "Received"
						? (
							<OverlayTrigger placement="top" overlay={receiptNote}>
								<Button bsStyle="primary" fill icon pullRight onClick={() => { this.setState({ showReceiptNoteInvoiceModal: true }) }}>	<span className="fa fa-print text-default"></span>
								</Button>
							</OverlayTrigger>
						) : null
				}

				{(this.props.match.path !== "/my-worklist") ?
					(this.state.grn.grnData.filter(x => { return x.rejectedQty > 0 }).length > 0) ?
						(
							this.state.grn.code !== "New" && this.state.grn.status === "Received"
								? (
									<OverlayTrigger placement="top" overlay={debitNote}>
										<Button bsStyle="primary" fill icon pullRight onClick={() => { this.setState({ showInvoiceDebitNoteModal: true }) }}>	<span className="fa fa-reorder"></span>
										</Button>
									</OverlayTrigger>
								) : null
						) : null
					: null
				}
			</Col>
		)

		var receiptNoteModal = (
			<Modal
				dialogClassName="large-modal print"
				show={this.state.showReceiptNoteInvoiceModal}
				onHide={() => this.setState({ showReceiptNoteInvoiceModal: false })}>
				<Modal.Body>
					<ReceiptNoteModalComponent
						code={this.state.grn.code}
						{...this.props}
					/>
				</Modal.Body>
			</Modal>
		)
		var debitNoteModal = (
			<Modal
				dialogClassName="large-modal print"
				show={this.state.showInvoiceDebitNoteModal}
				onHide={() => this.setState({ showInvoiceDebitNoteModal: false })}>
				<Modal.Body>
					<DebitNoteModalComponent
						code={this.state.grn.code}
						{...this.props}
					/>
				</Modal.Body>
			</Modal>
		)
		return (
			<Row className="card-content">
				{this.state.alert}
				{receiptNoteModal}
				{debitNoteModal}
				{this.props.modal ? <Row className="card-form">{form}</Row> : <div className="card-form">{form}</div>}
				{this.props.modal ? <div className="card-footer">{actions}</div> : <div className="card-footer">{actions}</div>}

			</Row>
		);
	}
}

export default GrnFormComponent;