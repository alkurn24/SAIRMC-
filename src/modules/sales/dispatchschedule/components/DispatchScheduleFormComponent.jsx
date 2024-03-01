import React, { Component } from "react";
import ReactTable from "react-table";
import Moment from "moment";
import Select from "components/CustomSelect/CustomSelect.jsx";
import cookie from 'react-cookies';
import Datetime from "react-datetime";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import { Modal, Row, Col, Tab, Nav, NavItem, OverlayTrigger, Tooltip, ControlLabel, FormGroup, FormControl } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import Radio from "components/CustomRadio/CustomRadio.jsx";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import UploadComponent from 'components/Upload/UploadComponent.jsx';
import { errorColor } from 'variables/Variables.jsx';
import { errors } from 'js/errors.js';

import { getDeliveryPointList } from "modules/crm/deliverypoints/server/DeliveryPointServerComm.jsx";
import { getTransporterList } from "modules/transportermgmt/transporters/server/TransporterServerComm.jsx";
import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import { getContactList } from "modules/common/contacts/server/ContactsServerComm.jsx";
import ContactsListComponent from "modules/common/contacts/components/ContactsListComponent"
import { getInventorySettingList } from "../../../settings/inventory/server/InventoryServerComm";
import { getUserList } from "modules/settings/usermgmt/server/UserServerComm.jsx";
import { getVehicleList } from "../../../transportermgmt/vehicle/server/VehicleServerComm.jsx";
import { createDispatchSchedule, getDispatchScheduleSingle, updateDispatchSchedule, deleteDispatchSchedule } from "../server/DispatchScheduleServerComm.jsx";


class DispatchScheduleFormComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: props.settings,
			moduleName: props.moduleName,
			currency: "₹",
			plantList: [],
			pumpList: [],
			userList: [],
			driverList: [],
			vehicleList: [],
			phoneList: [],
			productList: [],
			dispatch: {
				phone: null,
				id: null,
				code: "New",
				notes: "",
				status: "Schedule",
				dispatchingPlant: "",
				supervisorName: null,
				userName: "",
				pumping: false,
				dumping: false,
				customer: false,
				productName: null,
				pumpType: null,
				assetPumpType: null,
				dispatchDate: Moment().format("DD MMM YYYY hh:mm A"),
				order: props.modal ? props.order : {
					customer: null,
					orderData: [],
					imagePreviewUrl: "",
					photo: "",
					documents: []
				},
				orderData: [],
				dispatchData: [],
				eWaybillNo: "",
				transporter: null,
				vehicle: null,
				billtyNo: "",
				packingCharges: "",
				insuranceCharges: "",
				transporterCharges: "",
				// pumpCharges: "",
				frieghtCharges: "",
				gstAmount: "",
				loadedWeight: "",
				emptyWeight: "",
				prePostGst: "postGst",
				destinationAddress: "",
				insuranceNo: "",
				driver: null,
				supplierRef: "",
				otherRef: "",
				landingBill: "",
				documents: [],
				challanDocument: []
			},
			dispatchForm: {
				mandatory: [],
				custom: []
			},
			dispatchingPlantValid: null,
			transporterValid: null,
			productNameValid: null,
			vehicleValid: null,
			dispatchingPlantError: false,
			productNameError: false,
			transporterError: false,
			vehicleError: false,

		}
		this.setDispatchData = this.setDispatchData.bind(this);
		this.handleDropDownChangeProduct = this.handleDropDownChangeProduct.bind(this);
		this.handleSettingsChange = this.handleSettingsChange.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.addCustomField = this.addCustomField.bind(this);
		this.inputConfirmAlert = this.inputConfirmAlert.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);

		this.save = this.save.bind(this);
		this.delete = this.delete.bind(this);
		this.deleteConfirm = this.deleteConfirm.bind(this);
		this.successAlert = this.successAlert.bind(this);
		this.errorAlert = this.errorAlert.bind(this);

		this.handleDropDownChange = this.handleDropDownChange.bind(this);
		this.renderEditable = this.renderEditable.bind(this);
		this.handleChecked = this.handleChecked.bind(this);
		this.fetchVehicle = this.fetchVehicle.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);

		this.handleMultipleDocumentChange = this.handleMultipleDocumentChange.bind(this);
		this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
		this.validationCheck = this.validationCheck.bind(this);
		this.handleCheckbox = this.handleCheckbox.bind(this);
		this.fetchContactList = this.fetchContactList.bind(this);
		this.renderEditablePumpCharge = this.renderEditablePumpCharge.bind(this);
		this.handleDeliveryDocumentChange = this.handleDeliveryDocumentChange.bind(this);
		this.handleDeliveryDeleteDocument = this.handleDeliveryDeleteDocument.bind(this);

	}
	componentDidMount() {
		let _this = this;
		this.fetchContactList();
		let params;
		let dispatchData;
		if (!this.props.modal) {
			getDispatchScheduleSingle(_this.props.match.params.code,
				(data => {
					console.log(data);
					getContactList("customer=" + data.order.customer.id,
						function success(data) {
							_this.setState({
								phoneList: data.rows.map(prop => {
									return {
										id: prop.id,
										value: prop.id,
										label: prop.phone,
										type: prop.type
									}
								})
							})
						},
					)
					if (data.transporter === null) { params = null; }
					else {
						params = "transporter=" + (data.transporter ? data.transporter.id : "");
					}
					getVehicleList(params,
						(data => {
							_this.setState({
								vehicleList: data.rows.map(prop => {
									return ({
										id: prop.id,
										value: prop.id,
										label: prop.vehicleNumber,
										driver: prop.driver.name,
										driverId: prop.driver._id
									})
								})
							})
						}),
						(() => { })
					)
					dispatchData = JSON.parse(JSON.stringify(data));
					dispatchData.dispatchDate = moment(dispatchData.dispatchDate);
					dispatchData.userName = dispatchData.supervisorName ? (dispatchData.supervisorName.name) : null;
					dispatchData.supervisorName = dispatchData.supervisorName ? (dispatchData.supervisorName._id) : null;
					dispatchData.assetPumpType = dispatchData.assetPumpType ? (dispatchData.assetPumpType) : null;
					if (dispatchData.bomData.length) {

					}
					_this.setState({ dispatch: dispatchData })
				}),
			)
		}
		getInventorySettingList("name=pump",
			function success(data) {
				data.rows.map(prop => {
					return _this.setState({
						pumpList: prop.categories.split(",").map(s => {
							return {
								value: s,
								label: s
							}
						})
					})
				})
			},
		)
		getDeliveryPointList("dispatch=true",
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
		_this.setState({
			productList: this.state.dispatch.order.orderData.map((prop) => {
				return {
					id: prop.product.id,
					value: prop.product.id,
					label: prop.product.name,
				}
			})
		});
		getTransporterList(null,
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
		getPlantList("",
			(data => {
				_this.setState({
					plantList: data.rows.map(prop => {
						return ({
							id: prop.id,
							value: prop.id,
							label: prop.name,

						})
					})
				})
			}),
			(() => { })
		)
		getUserList("view=user",
			function success(data) {
				_this.setState({
					userList: data.rows
				})
			},
		)

	}
	fetchVehicle(id) {
		var _this = this;
		getVehicleList("transporter=" + id,
			(data => {
				_this.setState({
					vehicleList: data.rows.map(prop => {
						return ({
							id: prop.id,
							value: prop.id,
							label: prop.vehicleNumber,
							driver: prop.driver.name,
							driverId: prop.driver._id
						})
					})
				})
			}),
			(() => { })
		)
	}
	fetchContactList() {
		let _this = this;
		getContactList("customer=" + (this.state.dispatch.order.customer ? this.state.dispatch.order.customer.id : null),
			function success(data) {
				_this.setState({
					phoneList: data.rows.map(prop => {
						return {
							id: prop.id,
							value: prop.id,
							label: prop.phone,
							type: prop.type
						}
					})
				})
			},
		)
	}
	componentWillReceiveProps(newProps) {
		this.props = newProps;
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
	deleteConfirm() {
		let _this = this;
		deleteDispatchSchedule(_this.state.product,
			function success(data) {
				_this.props.history.push("/module/xyz");
			},
			function error(code) {
				_this.errorAlert("Error in deleting Dispatch schedule.");
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
	errorAlert(errorMessege) {
		this.setState({
			alert: (
				<SweetAlert
					error
					style={{ display: "block", marginTop: "-100px" }}
					title={errorMessege}
					onConfirm={() => this.setState({ alert: null })}
					onCancel={() => this.setState({ alert: null })}
					confirmBtnBsStyle="info"
				>
				</SweetAlert>
			)
		});
	}


	setDispatchData(index) {
		var _this = this;

		let tempDispatch = this.state.dispatch;
		tempDispatch.dispatchData = [];
		tempDispatch.dispatchData.push({
			product: _this.state.dispatch.order.orderData[index].product.id,
			name: _this.state.dispatch.order.orderData[index].product.name,
			unit: _this.state.dispatch.order.orderData[index].product.unit,
			hsn: _this.state.dispatch.order.orderData[index].product.hsn.hsn,
			gst: _this.state.dispatch.order.orderData[index].product.hsn.gst,
			stdRate: _this.state.dispatch.order.orderData[index].product.rate,
			pumpType: _this.state.dispatch.order.orderData[index].pumpType,
			isPumpApplicable: _this.state.dispatch.order.orderData[index].isPumpApplicable,
			pumpCharges: _this.state.dispatch.order.orderData[index].pumpCharges,
			rate: _this.state.dispatch.order.orderData[index].rate,
			quantity: _this.state.dispatch.order.orderData[index].quantity,
			remainingQty: _this.state.dispatch.order.orderData[index].remainingQty,
			_id: _this.state.dispatch.order.orderData[index]._id,
			qty: 0
		})
		_this.setState({ dispatch: tempDispatch });
	}
	handleSettingsChange() {
	}

	handleCheckbox(e) {
		var newdata = this.state.dispatch;
		newdata[e.target.name] = e.target.checked;
		this.setState({ dispatch: newdata });
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
					cancelBtnBsStyle="info"
				/>
			)
		});
	}

	inputConfirmAlert(e) {
		this.setState({ alert: null });
		var newdispatch = this.state.dispatchForm;
		newdispatch.custom.push({ name: e.toLowercase(), label: e, value: true });
		this.setState({ dispatchForm: newdispatch });
	}

	validationCheck() {

		this.state.dispatch.dispatchingPlant === "" ?
			this.setState({ dispatchingPlantError: "", dispatchingPlantValid: false }) :
			this.setState({ dispatchingPlantError: "", dispatchingPlantValid: true })
		this.state.dispatch.productName === null ?
			this.setState({ productNameError: "", productNameValid: false }) :
			this.setState({ productNameError: "", productNameValid: true })
		this.state.dispatch.vehicle === null ?
			this.setState({ vehicleError: "", vehicleValid: false }) :
			this.setState({ vehicleError: "", vehicleValid: true })
		setTimeout(this.save, 10);
	}
	save() {
		let _this = this;
		let tempDispatch = JSON.parse(JSON.stringify(this.state.dispatch))
		let tempStatus = this.state.moduleName;
		if (tempDispatch.status === "Schedule") { tempStatus = " Dispatch schedule saved" }
		if (_this.state.dispatchingPlantValid && _this.state.productNameValid) {
			if (tempDispatch.dispatchData[0].qty > 0) {
				if (tempDispatch.dispatchData[0].qty <= tempDispatch.dispatchData[0].remainingQty) {
					tempDispatch.deliveryAddr = tempDispatch.order.siteAddress ? tempDispatch.order.siteAddress.id : null;
					tempDispatch.customer = tempDispatch.order ? tempDispatch.order.customer.id : null;
					tempDispatch.order = tempDispatch.order ? tempDispatch.order.id : null;
					tempDispatch.transporter = tempDispatch.transporter ? tempDispatch.transporter.id : null;
					if (tempDispatch.code === "New") {
						tempDispatch.driver = tempDispatch.vehicle ? tempDispatch.vehicle.driverId : null;
					}
					else {
						tempDispatch.driver = tempDispatch.vehicle ? tempDispatch.vehicle.driver._id : null;
					}
					tempDispatch.vehicle = tempDispatch.vehicle ? tempDispatch.vehicle.id : null;
					tempDispatch.phone = tempDispatch.phone ? tempDispatch.phone.id : null;
					tempDispatch.assetPumpType = tempDispatch.assetPumpType ? (tempDispatch.assetPumpType) : null
					tempDispatch.dispatchingPlant = tempDispatch.dispatchingPlant ? tempDispatch.dispatchingPlant.id : null;
					if (tempDispatch.status === "Schedule") {
						delete tempDispatch.code;
						createDispatchSchedule(tempDispatch,
							function success(data) {
								_this.successAlert("Dispatch schedule added successfully!");
								setTimeout(() => {
									_this.props.handleCloseDispatchModal();
									_this.props.history.push("/sales/schedule");
								}, 2000);

							},
							function error(res) {
								let errorMessege = errors(res.response.status)
								_this.errorAlert(errorMessege);

							}
						)

					}
					else {
						if (tempDispatch.bomData.length) {
							for (var i = 0; i < tempDispatch.bomData.length; i++) {
								tempDispatch.bomData[i].inventory = tempDispatch.bomData[i].inventory.id ? tempDispatch.bomData[i].inventory.id : tempDispatch.bomData[i].inventory;
							}
						}
						tempDispatch.customer = this.state.dispatch.order.customer;
						for (i = 0; i < tempDispatch.dispatchData.length; i++) {
							tempDispatch.dispatchData[i].product = tempDispatch.dispatchData[i].product.id
							if (i + 1 === tempDispatch.dispatchData.length) {
								tempDispatch.assetPumpType = tempDispatch.assetPumpType ? (tempDispatch.assetPumpType) : null
								tempDispatch.customer = tempDispatch.customer ? (tempDispatch.customer.id) : null
								tempDispatch.user = tempDispatch.user ? (tempDispatch.user.id) : null
								updateDispatchSchedule(tempDispatch,
									function success() {
										_this.successAlert(tempStatus + " successfully!")
										setTimeout(() => {
											_this.props.history.push("/sales/schedule");
										}, 2000);
									},
									function error(data) {
										console.log(data)
										_this.errorAlert("Error in saving dispatch schedule");
									}
								)
							}
						}
					}
				}
				else {
					_this.setState({ formError: "Planned quantity must be less than or equal to remaining quantity." })
				}
			}
			else {
				_this.setState({ formError: "Please enter Planned quantity Minimum 1." })
			}
		}
		else {
			_this.setState({ formError: "Please enter required fields" })
		}

	}
	handleDropDownChange(selectOption, type) {
		var newDispatch = this.state.dispatch;
		newDispatch[type] = selectOption ? selectOption.value : null;
		this.setState({ dispatch: newDispatch });
	}
	handleDropDownChangeProduct(selectOption, type) {
		var newDispatch = this.state.dispatch;
		newDispatch[type] = selectOption ? selectOption.value : null;
		if (selectOption === undefined) {
			newDispatch.dispatchData = [];
			this.setState({ dispatch: newDispatch });
		}
		else {
			var index = this.state.productList.indexOf(selectOption)
			this.setDispatchData(index)
		}
		this.setState({ dispatch: newDispatch });
	}
	handleChecked() {
		this.setState({ isChecked: !this.state.isChecked });
	}
	handleMultipleDocumentChange(newDocument) {
		var dispatch = this.state.dispatch;
		dispatch.documents = newDocument.documents;
		this.setState({ dispatch });
	}
	handleDeleteDocument(key) {
		let dispatch = this.state.dispatch;
		dispatch.documents.slice();
		dispatch.documents.splice(key, 1);
		this.setState({ dispatch });
	}

	handleDeliveryDocumentChange(newDocument) {
		var dispatch = this.state.dispatch;
		dispatch.challanDocument = newDocument.challanDocument;
		this.setState({ dispatch });
	}
	handleDeliveryDeleteDocument(key) {
		let dispatch = this.state.dispatch;
		dispatch.challanDocument.slice();
		dispatch.challanDocument.splice(key, 1);
		this.setState({ dispatch });
	}

	handleDateChange(name, date) {
		var newDispatch = this.state.dispatch;
		newDispatch[name] = date._d;
		this.setState({ dispatch: newDispatch });
	}
	handleSelectChange(name, selectedOption) {
		let temp = this.state.dispatch;
		temp[name] = selectedOption;
		this.setState({ temp })
	}
	handleInputChange(e, param) {
		var newObj = this.state.dispatch;
		if (!e.target) {
			newObj[param] = e;
			this.setState({ pricing: newObj, formError: null });
			if (param === "transporter") {
				this.fetchVehicle(e.id);
			}
		} else {
			if (e.target.name.indexOf("custom_") !== -1) {
				var key = parseInt(e.target.name.split("_")[1], 10);
				newObj.custom[key] = e.target.value;
				this.setState({ dispatch: newObj });
			} else if (e.target.name.indexOf("radio_") !== -1) {
				newObj[e.target.name.split("_")[1]] = e.target.value;
				this.setState({ dispatch: newObj });
			} else {
				if (e.target.type === "number") newObj[e.target.name] = parseFloat(e.target.value);
				else newObj[e.target.name] = e.target.value;
				this.setState({ dispatch: newObj });
			}
		}
	}
	renderEditable(cellInfo) {
		return (
			<FormGroup>
				{this.state.dispatch.code === "New" ?
					<div>
						<FormControl
							disabled={this.state.dispatch.code !== "New" ? true : false}
							type="number"
							min={0}
							value={this.state.dispatch.dispatchData[cellInfo.index] ? this.state.dispatch.dispatchData[cellInfo.index][cellInfo.column.id] : 0}
							onChange={(e) => {
								if (this.state.dispatch.dispatchData) {
									const dispatch = this.state.dispatch;
									dispatch.dispatchData[cellInfo.index][cellInfo.column.id] = e.target.value;
									this.setState({ dispatch });
								}
							}}
						/>
					</div>
					:
					<ControlLabel>{this.state.dispatch.dispatchData[cellInfo.index] ? this.state.dispatch.dispatchData[cellInfo.index][cellInfo.column.id] : 0} </ControlLabel>

				}
			</FormGroup>
		)
	}
	renderEditablePumpCharge(cellInfo) {
		return (
			<FormGroup>
				{this.state.dispatch.code === "New" ?
					<div class="text-right">
						<FormControl
							disabled={this.state.dispatch.code !== "New" ? true : false}
							type="number"
							min={0}
							value={this.state.dispatch.dispatchData[cellInfo.index] ? this.state.dispatch.dispatchData[cellInfo.index].pumpCharges : 0.00}
							onChange={(e) => {
								if (this.state.dispatch.dispatchData) {
									const dispatch = this.state.dispatch;
									dispatch.dispatchData[cellInfo.index].pumpCharges = e.target.value;
									this.setState({ dispatch });
								}
							}}
						/>
					</div>
					:
					<div class="text-right">{this.state.dispatch.dispatchData[cellInfo.index] ? this.state.dispatch.dispatchData[cellInfo.index].pumpCharges.toFixed(2) : 0.00} </div>

				}
			</FormGroup>
		)
	}

	render() {
		var adminCondition = (cookie.load("role"));

		const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
		const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
		const list = (<Tooltip id="list_tooltip">Dispatch list</Tooltip>);



		var orderData1 = this.state.dispatch.order.orderData;
		var orderData = this.state.dispatch.dispatchData;
		var dispatchData = this.state.dispatch.dispatchData;
		for (var i = 0; i < orderData.length; i++) {
		}
		const srCol = { Header: "Sr", width: 75, Cell: (row => { return (<div>{row.index + 1}</div>) }) },
			productCol = {
				Header: "Product", id: "product",
				Cell: (row => {
					return (
						<div>
							{this.props.modal ? (
								orderData[row.index].name
							) : (
									dispatchData[row.index].product.name
								)
							}<br />
						</div>)
				})
			},
			sandredRateCol = {
				Header: "Standard Rate (₹)", id: "productRate",
				Cell: (row => {
					return (
						<div class="text-right">
							{this.props.modal ? (
								orderData[row.index].stdRate.toFixed(2)
							) : (
									dispatchData[row.index].product.rate.toFixed(2)
								)
							}<br />

						</div>
					)
				})
			},
			orderQty = {
				Header: "Order Qty", id: "orderQty",
				Cell: (row => {
					return (
						<div>
							{
								orderData[row.index].quantity + " " +
								(
									this.props.modal
										? orderData[row.index].unit
										: dispatchData[row.index].product.unit
								)
							}
						</div>
					)
				})
			},
			remainingQtyCol = {
				Header: "Remaining Qty", id: "remainingQty",
				Cell: (row => {
					return (
						<div className={(orderData[row.index].remainingQty <= 0) ? "value-danger" : ""}>
							{
								(
									this.props.modal
										? orderData[row.index].remainingQty + " " + orderData[row.index].unit
										: orderData1[row.index].remainingQty + " " + dispatchData[row.index].product.unit
								)
							}
						</div>
					)
				})
			},
			rateCol = {
				Header: "Booking Rate (₹)", id: "rate",
				Cell: (row => {
					return (
						<div class="text-right">
							{this.props.modal ? (
								orderData[row.index].rate.toFixed(2)
							) : (
									dispatchData[row.index].rate.toFixed(2)
								)
							}<br />

						</div>
					)
				})
			},
			pumpTypeCol = {
				Header: "Pump Type", id: "pumpType",
				Cell: (row => {
					return (
						<div>
							{this.props.modal ? (
								orderData[row.index].pumpType === 'pumping' ? "Pumping" : "Dumping"
							) : (
									dispatchData[row.index].pumpType === 'pumping' ? "Pumping" : "Dumping"
								)
							}<br />
						</div>
					)
				})
			},

			pumpChargesCol = { Header: "Pump Charges (₹) ", accessor: "pumpCharges", Cell: this.renderEditablePumpCharge },

			schedulingQtyCol = { Header: "Planned Qty", accessor: "qty", Cell: this.renderEditable },
			amountCol = {
				Header: "Amount (INR)", id: "amount",
				Cell: (row => {
					var totalAmount = (parseFloat(row.original.qty ? row.original.qty : 0) * (orderData[row.index].rate))
					return (
						<div style={{ textAlign: "right" }}>
							{" ₹" + totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
						</div>
					)
				})
			};
		let className;
		{ this.state.dispatch.code === "New" ? className = "fa fa-plus" : className = "fa fa-eye" }

		let dispatchDateInfo = (
			<Row>
				<Col xs={12}>
					<Col xs={12} sm={4} md={3} lg={3}>
						{this.state.dispatch.code === "New" ?
							<div>
								<ControlLabel pullRight>Schedule Date: </ControlLabel>
								<Datetime
									timeFormat={true}
									closeOnSelect={true}
									dateFormat="DD-MMM-YYYY"
									name="dispatchDate"
									inputProps={{ placeholder: "Select Dispatch Date" }}
									value={this.state.dispatch.dispatchDate}
									onChange={(date) => this.handleDateChange("dispatchDate", date)}
								/>
							</div>
							:
							<FormGroup>
								<ControlLabel pullRight><b>Dispatch Date:</b><br />{this.state.dispatch.dispatchDate ? Moment(this.state.dispatch.dispatchDate).format("DD MMM YYYY") : null} </ControlLabel>
							</FormGroup>
						}
					</Col>
					{this.state.dispatch.code !== "New" ?
						<Col xs={12} sm={4} md={3} lg={3}>
							<FormGroup>
								<ControlLabel><b>Code:</b><br /> {this.state.dispatch.number}</ControlLabel>
							</FormGroup>

						</Col>
						: null
					}

					<Col xs={12} sm={4} md={3} lg={3}>
						<FormGroup>
							<ControlLabel><b> Sales Order Number: </b><br /><a className="edit-link" href={"#/sales/orders-edit/" + this.state.dispatch.order.number}>{this.state.dispatch.order.number}</a></ControlLabel>
						</FormGroup>
					</Col>

					<Col xs={12} sm={4} md={3} lg={3}>
						{this.state.dispatch.code === "New" ?
							<FormGroup>
								<ControlLabel pullRight><b>Status:</b><br /> {this.state.dispatch.status}</ControlLabel>
							</FormGroup>
							: null
						}
					</Col>
				</Col>
			</Row>
		)
		let customerInfo = (
			<Row>
				<Col xs={12}>
					<Col xs={12} sm={4} md={3} lg={3}>
						<FormGroup>
							<ControlLabel><b>Customer Name:</b></ControlLabel>< br />
							<small>
								{
									this.state.dispatch.order.customer ? (
										<div>
											{this.state.dispatch.order.customer.name}<br />
											Email: {this.state.dispatch.order.customer.email}<br />
											Phone: {this.state.dispatch.order.customer.phone}< br />
											GSTIN: {this.state.dispatch.order.customer.gstin}
										</div>
									) : null
								}
							</small>
						</FormGroup>
					</Col>
					<Col xs={12} sm={4} md={3} lg={3}>
						<FormGroup>
							<ControlLabel><b>Contact:</b></ControlLabel><br />
							<small>
								{
									this.state.dispatch.order.contact ? (
										<div>
											{this.state.dispatch.order.contact.name}<br />
											{this.state.dispatch.order.contact.email}<br />
											{this.state.dispatch.order.contact.phone}
										</div>
									) : null
								}
							</small>
						</FormGroup>
					</Col>
					<Col xs={12} sm={4} md={3} lg={3}>
						<FormGroup>
							<ControlLabel><b>Billing Address:</b></ControlLabel><br />
							<small>
								{
									this.state.dispatch.order.billingAddr ? (
										<div>
											{this.state.dispatch.order.billingAddr.name}<br />
											{this.state.dispatch.order.billingAddr.street_address}, {this.state.dispatch.order.billingAddr.city}, {this.state.dispatch.order.billingAddr.state}, {this.state.dispatch.order.billingAddr.zipcode}
										</div>
									) : null
								}
							</small>
						</FormGroup>
					</Col>
					<Col xs={12} sm={4} md={3} lg={3}>
						<FormGroup>
							<ControlLabel><b>Site Address:</b></ControlLabel><br />
							<small>
								{
									this.state.dispatch.order.siteAddress ? (
										<div>
											{this.state.dispatch.order.siteAddress.name}<br />
											{this.state.dispatch.order.siteAddress.street_address}, {this.state.dispatch.order.siteAddress.city}, {this.state.dispatch.order.siteAddress.state}, {this.state.dispatch.order.siteAddress.zipcode}
										</div>
									) : null
								}
							</small>
						</FormGroup>
					</Col>
				</Col>
			</Row>
		)
		let salesOrderInfo = (
			<Row>
				<Col xs={12}>
					<Col xs={12} sm={4} md={3} lg={3}>
						<FormGroup>
							<ControlLabel><b>Customer PO Number:</b></ControlLabel><br />
							<small>
								{this.state.dispatch.order.poNumber}
							</small>
						</FormGroup>
					</Col>
					<Col xs={12} sm={4} md={2} lg={2}>
						<FormGroup>
							<ControlLabel><b>PO Date:</b></ControlLabel><br />
							<small>
								{this.state.dispatch.order.poDate ? Moment(this.state.dispatch.order.poDate).format("DD MMM YYYY") : ""}
							</small>
						</FormGroup>
					</Col>
					<Col xs={12} sm={4} md={2} lg={2}>
						<FormGroup>
							<ControlLabel><b>PO Expiry Date:</b></ControlLabel><br />
							<small>
								{this.state.dispatch.order.poExpiryDate ? Moment(this.state.dispatch.order.poExpiryDate).format("DD MMM YYYY") : ""}
							</small>
						</FormGroup>
					</Col>
					<Col xs={12} sm={4} md={2} lg={2}>
						<FormGroup>
							<ControlLabel><b>PO Amount:</b></ControlLabel><br />
							<small>
								{this.state.currency} {this.state.dispatch.order.poAmount ? this.state.dispatch.order.poAmount.toFixed(2) : 0}
							</small>
						</FormGroup>
					</Col>
					<Col xs={12} sm={4} md={3} lg={3}>
						<FormGroup>
							<ControlLabel><b>Building Name:</b></ControlLabel><br />
							<small>
								{this.state.dispatch.order.buildingName ? this.state.dispatch.order.buildingName : null}
							</small>
						</FormGroup>
					</Col>
				</Col>
			</Row>
		)
		let dispatchDetailsInfo = (
			<Row>
				<Col xs={12} sm={12} md={12} lg={12}>
					<Col xs={12} sm={4} md={2} lg={2}>
						{this.state.dispatch.code === "New" ?
							< FormGroup >
								<ControlLabel>Dispatching Plant <span className="star">*</span></ControlLabel>
								<Select
									clearable={false}
									placeholder="Select dispatch plant"
									name="dispatchingPlant"
									value={this.state.dispatch.dispatchingPlant ? this.state.dispatch.dispatchingPlant.id : null}
									options={this.state.plantList}
									onChange={(selectedOption) => this.handleSelectChange("dispatchingPlant", selectedOption)}
									style={{ color: this.state.dispatchingPlantValid || this.state.dispatchingPlantValid === null ? "" : errorColor, borderColor: this.state.dispatchingPlantValid || this.state.dispatchingPlantValid === null ? "" : errorColor }}
								/>
							</FormGroup>
							:
							< FormGroup>
								<ControlLabel><b>Dispatching Plant:</b><br />{this.state.dispatch.dispatchingPlant ? this.state.dispatch.dispatchingPlant.name : null} </ControlLabel>
							</FormGroup>
						}

					</Col>
					<Col xs={12} sm={6} md={2} lg={2}>
						<FormGroup>
							{this.state.dispatch.code === "New" ?
								<div>
									<ControlLabel> Shipping Contact </ControlLabel>
									<div>
										<span
											className="input-group"
											disabled={this.state.dispatch.status === "Schedule" ? false : true}
										>
											<Select
												disabled={this.state.dispatch.status === "Schedule" ? false : true}
												clearable={false}
												placeholder="Select shipping contact"
												name="phone"
												options={this.state.phoneList.filter(prop => {
													return (prop.type === "Shipping")
												})}
												value={this.state.dispatch.phone ? this.state.dispatch.phone.id : null}
												onChange={(selectedOption) => this.handleSelectChange("phone", selectedOption)}
											/>
											< span className="input-group-addon">
												<a role="button" className={className} onClick={() => this.setState({ showContactModal: true })} />
											</span>

										</span>
									</div>
								</div>
								:
								<ControlLabel ><b>Shipping Contact:</b><br />{this.state.dispatch.phone ? this.state.dispatch.phone.name : null} </ControlLabel>
							}
						</FormGroup>
					</Col>

					<Col xs={12} sm={3} md={2} lg={2}>
						<FormGroup>
							{this.state.dispatch.code === "New" ?
								<div>
									<ControlLabel>Supervisor Name</ControlLabel>
									<Select
										disabled={this.state.dispatch.status === "Schedule" ? false : true}
										clearable={false}
										placeholder="Select supervisor name"
										name="supervisorName"
										value={this.state.dispatch.supervisorName ? this.state.dispatch.supervisorName : null}
										options={this.state.userList}
										onChange={(selectOption) => this.handleDropDownChange(selectOption, "supervisorName")}
									/>
								</div>
								:
								<ControlLabel><b>Supervisor Name:</b><br />{this.state.dispatch.supervisorName ? this.state.dispatch.userName : null} </ControlLabel>
							}
						</FormGroup>
					</Col>
					<Col xs={12} sm={3} md={2} lg={2}>
						<FormGroup>
							{this.state.dispatch.code === "New" ?
								<div>
									<ControlLabel>E-Way Bill Number</ControlLabel>
									<FormControl
										disabled={this.state.dispatch.status === "Schedule" ? false : true}
										type="text"
										placeholder="Enter e-way bill number"
										name="eWaybillNo"
										value={this.state.dispatch.eWaybillNo}
										onChange={this.handleInputChange}
									/>
								</div>
								:
								<ControlLabel><b>E-Way Bill Number:</b><br />{this.state.dispatch.eWaybillNo ? this.state.dispatch.eWaybillNo : null} </ControlLabel>
							}
						</FormGroup>
					</Col>
					<Col xs={12} sm={3} md={2} lg={2}>
						<FormGroup>
							{this.state.dispatch.code === "New" ?
								<div>
									<ControlLabel>Insurance Number</ControlLabel>
									<FormControl
										disabled={this.state.dispatch.status === "Schedule" ? false : true}
										type="text"
										placeholder="0"
										name="insuranceNo"
										value={this.state.dispatch.insuranceNo}
										onChange={this.handleInputChange}
									/>
								</div>
								:
								<ControlLabel><b>Insurance Number:</b><br />{this.state.dispatch.insuranceNo ? this.state.dispatch.insuranceNo : null} </ControlLabel>
							}
						</FormGroup>
					</Col>
					<Col xs={12} sm={3} md={2} lg={2}>
						<FormGroup>
							{this.state.dispatch.code === "New" ?
								<div>
									<ControlLabel>Destination Address</ControlLabel>
									<FormControl
										disabled={this.state.dispatch.status === "Schedule" ? false : true}
										type="text"
										placeholder="Destination address"
										min={0}
										name="destinationAddress"
										value={this.state.dispatch.destinationAddress}
										onChange={this.handleInputChange}
									/>
								</div>
								:
								<ControlLabel><b>Destination Address:</b><br />{this.state.dispatch.destinationAddress ? this.state.dispatch.destinationAddress : null} </ControlLabel>
							}
						</FormGroup>
					</Col>

				</Col>
				<Col xs={12} sm={12} md={12} lg={12}>
					<Col xs={12} sm={3} md={2} lg={2}>
						<FormGroup>
							{this.state.dispatch.code === "New" ?
								<div>
									<ControlLabel>Packing Charges (₹)</ControlLabel>
									<FormControl
										disabled={this.state.dispatch.status !== "Dispatched" || this.state.dispatch.status === "Schedule" ? false : true}
										type="number"
										placeholder="Packing charges"
										min={0}
										name="packingCharges"
										value={this.state.dispatch.packingCharges ? this.state.dispatch.packingCharges.toFixed(2) : 0.00}
										onChange={this.handleInputChange}
									/>
								</div>
								:
								<ControlLabel><b>Packing Charges (₹):</b><br />{this.state.dispatch.packingCharges ? this.state.dispatch.packingCharges.toFixed(2) : 0.00} </ControlLabel>
							}
						</FormGroup>
					</Col>
					<Col xs={12} sm={3} md={2} lg={2}>
						<FormGroup>
							{this.state.dispatch.code === "New" ?
								<div>
									<ControlLabel>Insurance Charges (₹)</ControlLabel>
									<FormControl
										disabled={this.state.dispatch.status !== "Dispatched" || this.state.dispatch.status === "Schedule" ? false : true}
										type="number"
										placeholder="Insurance charges"
										min={0}
										name="insuranceCharges"
										value={this.state.dispatch.insuranceCharges ? this.state.dispatch.insuranceCharges.toFixed(2) : 0.00}
										onChange={this.handleInputChange}
									/>
								</div>
								:
								<ControlLabel><b>Insurance Charges (₹):</b><br />{this.state.dispatch.insuranceCharges ? this.state.dispatch.insuranceCharges.toFixed(2) : 0.00} </ControlLabel>
							}
						</FormGroup>
					</Col>
					<Col xs={12} sm={3} md={2} lg={2}>
						<FormGroup>
							{this.state.dispatch.code === "New" ?
								<div>
									<ControlLabel>Transport Charges (₹)</ControlLabel>
									<FormControl
										disabled={this.state.dispatch.status !== "Dispatched" || this.state.dispatch.status === "Schedule" ? false : true}
										type="number"
										placeholder="Transport charges"
										min={0}
										name="transporterCharges"
										value={this.state.dispatch.transporterCharges ? this.state.dispatch.transporterCharges.toFixed(2) : 0.00}
										onChange={this.handleInputChange}
									/>
								</div>
								:
								<ControlLabel><b>Transport Charges (₹):</b><br />{this.state.dispatch.transporterCharges ? this.state.dispatch.transporterCharges.toFixed(2) : 0.00} </ControlLabel>
							}
						</FormGroup>
					</Col>
					<Col xs={12} sm={3} md={2} lg={2}>
						<FormGroup>
							{this.state.dispatch.code === "New" ?
								<div>
									<ControlLabel>Supplier Reference</ControlLabel>
									<FormControl
										disabled={this.state.dispatch.status === "Schedule" ? false : true}
										type="text"
										placeholder="Supplier reference"
										min={0}
										name="supplierRef"
										value={this.state.dispatch.supplierRef}
										onChange={this.handleInputChange}
									/>
								</div>
								:
								<ControlLabel><b>Supplier Reference:</b><br />{this.state.dispatch.supplierRef ? this.state.dispatch.supplierRef : null} </ControlLabel>
							}
						</FormGroup>
					</Col>
					<Col xs={12} sm={3} md={2} lg={2}>
						<FormGroup>
							{this.state.dispatch.code === "New" ?
								<div>
									<ControlLabel>Other Reference</ControlLabel>
									<FormControl
										disabled={this.state.dispatch.status === "Schedule" ? false : true} type="text"
										placeholder="Other reference"
										min={0}
										name="otherRef"
										value={this.state.dispatch.otherRef}
										onChange={this.handleInputChange}
									/>
								</div>
								:
								<ControlLabel><b>Other Reference:</b><br />{this.state.dispatch.otherRef ? this.state.dispatch.otherRef : null} </ControlLabel>
							}
						</FormGroup>
					</Col>
					<Col xs={12} sm={3} md={2} lg={2}>
						<FormGroup>
							{this.state.dispatch.code === "New" ?
								<div>
									<ControlLabel>Bill Of Landing</ControlLabel>
									<FormControl
										disabled={this.state.dispatch.status === "Schedule" ? false : true}
										type="text"
										placeholder="Bill of landing"
										min={0}
										name="landingBill"
										value={this.state.dispatch.landingBill}
										onChange={this.handleInputChange}
									/>
								</div>
								:
								<ControlLabel><b>Bill Of Landing:</b><br />{this.state.dispatch.landingBill ? this.state.dispatch.landingBill : null} </ControlLabel>
							}
						</FormGroup>
					</Col>
					<Col xs={12} sm={3} md={2} lg={2}>
						<div>{null}</div>
					</Col>
				</Col>
				<Col xs={12}>
					<Col xs={12} sm={3} md={2} lg={1}>
						<Radio
							disabled={this.state.dispatch.status === "Schedule" ? false : true}
							number="radio4"
							option="postGst"
							name="prePostGst"
							onChange={this.handleInputChange}
							checked={this.state.dispatch.prePostGst === 'postGst'}
							label="PostGST"
						/></Col>
					<Col xs={12} sm={3} md={2} lg={1}>
						<Radio
							disabled={this.state.dispatch.status === "Schedule" ? false : true}
							number="radio3"
							option="preGst"
							name="prePostGst"
							onChange={this.handleInputChange}
							checked={this.state.dispatch.prePostGst === 'preGst'}
							label="PreGST"
						/></Col>
					<Col xs={12} sm={4} md={2} lg={1}>
						<Checkbox inline
							disabled={this.state.dispatch.status === "Schedule" ? false : true}
							number="2145"
							name="pumping"
							label="Pumping"
							onChange={this.handleCheckbox}
							checked={this.state.dispatch.pumping}
						/>
					</Col>
					{
						(this.state.dispatch.pumping === true) ?
							(
								<div>
									<Col xs={12} sm={3} md={2} lg={2}>
										<FormGroup>
											{this.state.dispatch.code === "New" ?
												<div>
													<ControlLabel>Select Pump</ControlLabel>
													<Select
														disabled={this.state.dispatch.status === "Planned" || this.state.dispatch.status === "Schedule" ? false : true}
														clearable={false}
														placeholder="Select pump"
														name="assetPumpType"
														value={this.state.dispatch.assetPumpType ? this.state.dispatch.assetPumpType : null}
														options={this.state.pumpList}
														onChange={(selectOption) => this.handleDropDownChange(selectOption, "assetPumpType")}
													/>
												</div>
												:
												<ControlLabel><b>Pump:</b><br />{this.state.dispatch.assetPumpType ? this.state.dispatch.assetPumpType : null} </ControlLabel>
											}
										</FormGroup>
									</Col>

								</div>
							) : null
					}
				</Col>

			</Row>
		)
		let dispatchDataInfo = (
			<Row style={{ padding: "12px" }}>
				<Col xs={12} sm={12} md={12} lg={12}>
					<Tab.Container id="stock-details" defaultActiveKey="dispatches">
						<div className="">
							<Col xs={12}>
								<Nav bsStyle="tabs">
									<NavItem eventKey="dispatches" ><i className="fa fa-truck fa-flip-horizontal" /> Dispatch Schedule</NavItem>

									{this.state.dispatch.code === "New" ?
										<NavItem eventKey="documents" ><i className="fa fa-file" /> Documents</NavItem>
										: null}
									<NavItem eventKey="custom">	<i className="fa fa-comment" /> Remarks</NavItem>
								</Nav>
							</Col>
							<Col xs={12} sm={12} md={12} lg={12}>
								<Tab.Content animation>
									<Tab.Pane eventKey="dispatches">
										<Col xs={12} sm={4} md={2} lg={2} hidden={this.state.dispatch.code === "New" ? false : true} className="list-header">
											<FormGroup>
												<ControlLabel>Select Product <span className="star">*</span></ControlLabel>
												<Select
													disabled={this.state.dispatch.status === "In-Progress" || this.state.dispatch.status === "Schedule" ? false : true}
													clearable={false}
													placeholder="Select Product"
													name="productName"
													value={this.state.dispatch.productName ? this.state.dispatch.productName : null}
													options={this.state.productList}
													onChange={(selectOption) => this.handleDropDownChangeProduct(selectOption, "productName")}
													style={{ color: this.state.productNameValid || this.state.productNameValid === null ? "" : errorColor, borderColor: this.state.productNameValid || this.state.productNameValid === null ? "" : errorColor }}
												/>
											</FormGroup>
										</Col>
										<Col xs={12}>
											{this.state.dispatch.code === "Schedule" ?
												<Col xs={12} sm={12} md={12} lg={12}><small>Note: Click on "DISPATCHING QTY" column to enter value.</small></Col>
												: null
											}
										</Col>
										{
											(!this.state.dispatch.dispatchData || !this.state.dispatch.dispatchData.length) ? (
												<div></div>
											) : (
													<Col xs={12}>
														<ReactTable
															data={this.state.dispatch.dispatchData}
															columns={
																this.state.dispatch.code !== "New" ?
																	[srCol, productCol, pumpTypeCol, pumpChargesCol, sandredRateCol, rateCol, orderQty, remainingQtyCol, schedulingQtyCol, amountCol]
																	:
																	[srCol, productCol, pumpTypeCol, pumpChargesCol, sandredRateCol, rateCol, orderQty, remainingQtyCol, schedulingQtyCol, amountCol]

															}
															minRows={0}
															sortable={false}
															className="-striped -highlight"
															showPaginationTop={false}
															showPaginationBottom={false}
														/>
													</Col>
												)
										}
									</Tab.Pane>
									<Tab.Pane eventKey="documents">
										{
											<Row>
												<Col xs={12} sm={12} md={6} lg={6}>
													<h6 className="section-header">Documents Details</h6>
													<Row>
														<UploadComponent
															document
															type="despatches"
															documents={this.state.dispatch.documents}
															details={this.state.dispatch}
															dropText="Drop files or click here"
															handleMultipleDocumentChange={this.handleMultipleDocumentChange}
															handleDeleteDocument={this.handleDeleteDocument}
														/>
													</Row>
												</Col>
												<Col xs={12} sm={12} md={6} lg={6}>
													<h6 className="section-header">Delivery challan details</h6>
													<UploadComponent
														document
														type="challanDocument"
														documents={this.state.dispatch.challanDocument}
														details={this.state.dispatch}
														dropText="Drop files or click here"
														handleMultipleDocumentChange={this.handleDeliveryDocumentChange}
														handleDeleteDocument={this.handleDeliveryDeleteDocument}
													/>
												</Col>
											</Row>
										}
									</Tab.Pane>
									<Tab.Pane eventKey="custom">
										<FormGroup>
											<ControlLabel>Remarks:</ControlLabel>
											<textarea
												className="form-control"
												name="notes"
												type="text"
												placeholder="Remarks"
												value={this.state.dispatch.notes ? this.state.dispatch.notes : ""} onChange={this.handleInputChange}>
											</textarea>
										</FormGroup>
									</Tab.Pane>
								</Tab.Content>
							</Col>
						</div>
					</Tab.Container>
				</Col>
			</Row>
		);
		let form = (
			<Row>
				<fieldset>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Col xs={12}>{dispatchDateInfo}</Col>
					</Col>
					<Col xs={12} sm={12} md={12} lg={12}>
						{this.props.modal ? <Col xs={12}><Col xs={12}><h6 className="section-header">Customer Information</h6></Col></Col> : <Col xs={12}><h6 className="section-header">Customer Information</h6></Col>}
						<Col xs={12}>{customerInfo}</Col>
					</Col>
					<Col xs={12} sm={12} md={12} lg={12}>
						{this.props.modal ? <Col xs={12}><Col xs={12}><h6 className="section-header">Sales Order Details</h6></Col></Col> : <Col xs={12}><h6 className="section-header">Sales Order Details</h6></Col>}
						<Col xs={12}>{salesOrderInfo}</Col>
					</Col>
					<Col xs={12} sm={12} md={12} lg={12}>
						{this.props.modal ? <Col xs={12}><Col xs={12}><h6 className="section-header">Dispatch Details</h6></Col></Col> : <Col xs={12}><h6 className="section-header">Dispatch Details</h6></Col>}
						<Col xs={12}>{dispatchDetailsInfo}</Col>
					</Col>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Row>{dispatchDataInfo}</Row>
					</Col>
				</fieldset>
			</Row >
		);
		let actions = (
			<Col xs={12} sm={12} md={12} lg={12}>
				<center><h5 className="text-danger">{this.state.formError}</h5></center>
				{this.props.match.path !== "/sales/orders" ?
					<OverlayTrigger placement="top" overlay={back}>
						<Button bsStyle="warning" fill icon onClick={this.props.history.goBack} ><span className="fa fa-arrow-left"></span></Button>
					</OverlayTrigger>
					: null
				}
				{this.props.match.path !== "/sales/orders" ?
					<OverlayTrigger placement="top" overlay={list}>
						<Button bsStyle="primary" fill icon onClick={() => this.props.history.push('/sales/schedule')} ><span className="fa fa-list"></span></Button>
					</OverlayTrigger>
					:
					null
				}

				{this.state.dispatch.code === "New" ?
					<OverlayTrigger placement="top" overlay={save}>
						<Button bsStyle="success" fill icon pullRight onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
					</OverlayTrigger>
					: null
				}
			</Col>
		);

		let contactModal = (
			<Modal
				dialogClassName="large-modal"
				show={this.state.showContactModal}
			// onHide={() => {
			// 	this.setState({ showContactModal: false });
			// }}
			>
				<Modal.Header class="header1">
					<div className="modal-close">
						<a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => { this.setState({ showContactModal: false }); this.fetchContactList() }}>{null}</a>
					</div>
					<Modal.Title>Add/Update Contact</Modal.Title>
				</Modal.Header>
				<Modal.Body className="cardModal">
					<ContactsListComponent {...this.props}
						dispatchSchedule={true}
						id={this.state.dispatch.order.customer ? this.state.dispatch.order.customer.id : null} />
				</Modal.Body>

			</Modal>
		)
		return (
			<Row className="card-content">
				{this.state.alert}
				{contactModal}
				{this.props.modal ? <div>{form}</div> : <div className="card-form">{form}</div>}
				{this.props.modal ? <div className="card-footer">{actions}</div> : <div className="card-footer">{actions}</div>}

			</Row>
		);
	}
}

export default DispatchScheduleFormComponent;