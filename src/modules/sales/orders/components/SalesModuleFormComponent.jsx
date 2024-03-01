import React, { Component } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import _ from "lodash";
import Select from "components/CustomSelect/CustomSelect.jsx";

import Moment from "moment";
import Datetime from "react-datetime";
import { FormGroup, ControlLabel, FormControl, Modal, Row, Col, Nav, NavItem, Tab, Tooltip, OverlayTrigger } from "react-bootstrap";

import Checkbox from 'components/CustomCheckbox/CustomCheckbox.jsx';
import Radio from "components/CustomRadio/CustomRadio.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import UploadComponent from 'components/Upload/UploadComponent.jsx';

import { getUserFormSingle, updateUserForm } from "modules/settings/server/SettingsUserFormServerComm.jsx";
import { createOrder, getOrderSingle, updateOrder, } from "modules/sales/orders/server/OrderServerComm.jsx";

import { getProductList } from "modules/inventory/products/server/ProductServerComm.jsx";
import AddressesListComponent from "modules/common/addresses/components/AddressesListComponent"
import CustomerFormComponent from "modules/crm/customers/components/CustomerFormComponent";
import ContactsListComponent from "modules/common/contacts/components/ContactsListComponent"
import { getCustomerList } from "modules/crm/customers/server/CustomerServerComm.jsx";
import { getAddressList } from "modules/common/addresses/server/AddressesServerComm.jsx";
import { getContactList } from "modules/common/contacts/server/ContactsServerComm.jsx";

import { errorColor } from 'variables/Variables.jsx';
import SalesModuleOrderTableComponent from "./SalesModuleOrderTableComponent";
import { getUserList } from "modules/settings/usermgmt/server/UserServerComm.jsx";
import DispatchScheduleModalComponent from "modules/sales/dispatchschedule/components/DispatchScheduleModalComponent.jsx";
import DispatchListComponent from "modules/sales/dispatches/components/DispatchListComponent.jsx";

class SalesModuleFormComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alert: "",
			radio: "1",
			currency: "₹",
			users: [],
			moduleName: props.moduleName,
			settingsForm: props.settingsForm,
			settings: props.settings,
			edit: !props.settings,
			module: {
				code: "New",
				status: "New",
				salesPerson: null,
				userName: "",
				customer: null,
				contact: null,
				billingAddr: null,
				siteAddress: null,
				deliveryAddr: null,
				date: Moment().format("DD MMM YYYY"),
				DispatchingTime: null,
				approvedTime: null,
				closedTime: null,
				paidTime: null,
				poNumber: "",
				poExpiryDate: Moment().endOf('month'),
				poDate: "",
				poAmount: 0,
				isPoAvailable: "true",
				buildingName: "",
				custom: [],
				orderData: [],
				paymentTerms: [],
				notes: "",
				imagePreviewUrl: "",
				photo: "",
				documents: []
			},
			newOrder: {
				product: {},
				rate: 0,
				hsn: "",
				quantity: 0,
				standardRate: 0,
				dispatched: 0,
				avlQuantity: 0,
				gstType: "gst",
				isPumping: "pumping"

			},
			moduleForm: {
				mandatory: [],
				custom: []
			},
			customerList: [],
			agentList: [],
			addressList: [],
			contactList: [],

			descriptionError: false,
			percentageError: false,
			amountError: false,
			quantityError: false,
			productError: false,
			avlquantityError: false,
			discountError: false,
			rateError: false,
			orderamtError: false,
			salesPersonError: false,
			billingAddrError: false,
			siteAddressError: false,
			poAmountError: false,
			poNumberError: false,
			customerError: false,
			contactError: false,
			poDateError: false,
			poExpiryDateError: false,
			billingAddrValid: null,
			siteAddressValid: null,
			contactValid: null,
			customerValid: null,
			poNumberValid: null,
			poAmountValid: null,
			amountValid: null,
			quantityValid: null,
			productValid: null,
			avlquantityValid: null,
			discountValid: null,
			rateValid: null,
			orderamtValid: null,
			formValid: null,
			salesPersonValid: null,
			descriptionValid: null,
			percentageValid: null,
			poDateValid: null,
			poExpiryDateValid: null
		};
		this.emptyState = this.state;
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleMultipleDocumentChange = this.handleMultipleDocumentChange.bind(this);
		this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
		this.handlePaymentTermInputChange = this.handlePaymentTermInputChange.bind(this);
		this.handleSettingsChange = this.handleSettingsChange.bind(this);

		this.addCustomField = this.addCustomField.bind(this);
		this.inputConfirmAlert = this.inputConfirmAlert.bind(this);
		this.saveProductToModule = this.saveProductToModule.bind(this);
		this.savePaymentTermToModule = this.savePaymentTermToModule.bind(this);

		this.save = this.save.bind(this);
		this.statusChange = this.statusChange.bind(this);
		this.changeOrderStatus = this.changeOrderStatus.bind(this);
		this.createModule = this.createModule.bind(this);
		this.successAlert = this.successAlert.bind(this);
		this.errorAlert = this.errorAlert.bind(this);
		this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
		this.fetchAgents = this.fetchAgents.bind(this);

		this.getContactForCustomer = this.getContactForCustomer.bind(this);
		this.handleShowAddProductModal = this.handleShowAddProductModal.bind(this);
		this.handleCloseAddProductModal = this.handleCloseAddProductModal.bind(this);
		this.handleDropDownChange = this.handleDropDownChange.bind(this);
		this.handleShowDispatchModal = this.handleShowDispatchModal.bind(this);
		this.handleCloseDispatchModal = this.handleCloseDispatchModal.bind(this);

		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.validationCheck = this.validationCheck.bind(this);
		this.getAddressForCustomer = this.getAddressForCustomer.bind(this);
		this.handleCheckedRadioButton = this.handleCheckedRadioButton.bind(this);
	}
	componentWillMount() {
		var _this = this;
		this.fetchDataFromServer();
		getUserList("view=user",
			function success(data) {
				_this.setState({
					users: data.rows
				})
			},
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

	fetchDataFromServer(update) {
		var _this = this;
		if (!this.state.settings) {
			if (_this.props.match.params.code !== 'new') {
				getOrderSingle(_this.props.match.params.code,
					function success(data) {
						let tempSalesOrder = JSON.parse(JSON.stringify(data))
						tempSalesOrder.userName = tempSalesOrder.salesPerson.name;
						tempSalesOrder.salesPerson = tempSalesOrder.salesPerson._id;
						if (tempSalesOrder.isPoAvailable === true) {
							tempSalesOrder.isPoAvailable = "true"
						}
						else {
							tempSalesOrder.isPoAvailable = "false";

						}
						if (update === "customer") {
							let tempObj = _this.state.module;
							tempObj.customer = tempSalesOrder.customer;
							_this.setState({ tempObj });
						} else {
							_this.setState({ module: tempSalesOrder });
							_this.getAddressForCustomer(tempSalesOrder.customer.id);
							_this.getContactForCustomer(tempSalesOrder.customer.id);
							_this.fetchAgents(tempSalesOrder.customer.id);
						}
					},
					function error() {
						_this.errorAlert("Error: please try again later");
					}
				)
			}
		}

		// getBomList("",
		// 	function success(data) {
		// 		_this.setState({
		// 			productList: data.rows.map((prop) => {
		// 				return {
		// 					id: prop.product.id,
		// 					value: prop.product.id,
		// 					label: prop.product.name,
		// 					name: prop.product.name,
		// 					customerId: prop.customer.id,
		// 					rate: prop.product.rate,
		// 					unit: prop.product.unit,
		// 					hsn: prop.product.hsn.hsn,
		// 					gst: prop.product.hsn.gst,
		// 				}
		// 			})
		// 		});
		// 	},
		// 	function error(data) {
		// 	}
		// )
		getProductList("",
			function success(data) {
				_this.setState({
					productList: data.rows.map((prop) => {
						return {
							id: prop.id,
							value: prop.id,
							label: prop.name,
							type: prop.type,
							name: prop.name,
							rate: prop.rate,
							unit: prop.unit,
							hsn: prop.hsn.hsn,
							gst: prop.hsn.gst,
							stock: prop.standardQty - (prop.orderBooking ? prop.orderBooking : 0)
						}
					})
				});
			},
			function error(data) {
			}
		)

		getCustomerList("",
			function success(data) {
				_this.setState({
					customerList: data.rows.map((prop) => {
						return {
							id: prop.id,
							code: prop.code,
							value: prop.id,
							label: prop.name,
							name: prop.name,
							phone: prop.phone,
							email: prop.email
						}
					})
				});

			},
			function error(data) {
			}
		)

		getUserFormSingle(this.state.settingsForm,
			function success(data) {
				_this.setState({ moduleForm: data });
			},
			function error(data) {

			}
		)
	}
	getContactForCustomer(id) {
		var _this = this;
		_this.setState({ contactList: [] })

		getContactList("customer=" + id,
			(res) => {
				_this.setState({
					contactList: res.rows.map(prop => {
						return ({
							id: prop.id,
							value: prop.id,
							label: prop.name,
							email: prop.email,
							phone: prop.phone
						})
					})
				});
				if (_this.state.contactList.length) {
					let tempObj = _this.state.module;
					tempObj.contact = _this.state.contactList[0];
					_this.setState({ module: tempObj })
				}
			},
			() => { }
		)
	}
	getAddressForCustomer(id) {
		var _this = this;
		_this.setState({ addressList: [] })
		getAddressList("customer=" + id,
			(res) => {
				_this.setState({
					addressList: res.rows.map(prop => {
						return ({
							id: prop.id,
							value: prop.id,
							type: prop.type,
							label: prop.name,
							street_address: prop.street_address,
							city: prop.city,
							state: prop.state,
							zipcode: prop.zipcode
						})
					})
				});
				if (_this.state.addressList.length) {
					let tempObj = _this.state.module;
					let billingAddrData = _this.state.addressList.filter(x => { return x.type === "Billing" });
					let siteAddrData = _this.state.addressList.filter(x => { return x.type === "Site" });
					tempObj.billingAddr = billingAddrData[0]
					tempObj.siteAddress = siteAddrData[0];
					_this.setState({ module: tempObj })
				}
			},
			() => { }
		)

	}
	fetchAgents(id) {
		var _this = this;
		_this.setState({ agentList: [] })

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
		var newObj = this.state.moduleForm;
		newObj.custom.push({ name: e.toString().replace(/\s+/g, '').toLowerCase(), label: e, value: true });
		this.setState({ moduleForm: newObj });
		updateUserForm(this.state.moduleForm,
			function success() { },
			function error() { }
		)
	}
	saveProductToModule(newOrder) {
		var temp = this.state.module;
		if (newOrder._id) {
			let index = temp.orderData.indexOf(x => {
				return x._id === newOrder._id
			})
			temp.orderData[index] = newOrder;
		} else {
			let tempModule2 = JSON.parse(JSON.stringify(newOrder));
			tempModule2.gst = newOrder.product.gst;
			tempModule2.hsn = newOrder.product.hsn;
			tempModule2.remainingQty = newOrder.quantity;
			temp.orderData.push(tempModule2)
		}
		this.setState({ module: temp });
		this.handleCloseAddProductModal();
	}
	savePaymentTermToModule() {
		var temp = this.state.module;
		temp.paymentTerms.push(this.state.newPaymentTerm);
		this.setState({ data: temp, showPaymentTermModal: false, formError: null })
	}

	statusChange() {
		let _this = this;
		let tempStatus = this.state.moduleName
		if (tempStatus.status === "Approved") {
			_this.approvedConfirm();
			this.setState({ tempStatus });
		}

	}
	validationCheck(id) {
		if (id === "Save") {
			{
				let tempStatus = this.state.moduleName
				tempStatus = "Sales order saved"
				this.setState({ tempStatus });
			}
		}

		this.state.module.salesPerson === null
			? this.setState({ salesPersonError: "Enter phone number", salesPersonValid: false })
			: this.setState({ salesPersonError: "", salesPersonValid: true });

		this.state.module.poNumber === ""
			? this.setState({ poNumberError: "Enter phone number", poNumberValid: false })
			: this.setState({ poNumberError: "", poNumberValid: true });
		this.state.module.customer === null
			? this.setState({ customerError: "Select Customer", customerValid: false })
			: this.setState({ customerError: "", customerValid: true });

		this.state.module.contact === null
			? this.setState({ contactError: "Select contact", contactValid: false })
			: this.setState({ contactError: "", contactValid: true });

		this.state.module.billingAddr === null
			? this.setState({ billingAddrError: "Select Billing Address", billingAddrValid: false })
			: this.setState({ billingAddrError: "", billingAddrValid: true });

		this.state.module.siteAddress === null
			? this.setState({ siteAddressError: "Select Siet Address", siteAddressValid: false })
			: this.setState({ siteAddressError: "", siteAddressValid: true });
		this.state.module.poExpiryDate === null
			? this.setState({ poExpiryDateError: "Select PoExpiry Date", poExpiryDateValid: false })
			: this.setState({ poExpiryDateError: "", poExpiryDateValid: true });

		this.state.module.poDate === ""
			? this.setState({ poDateError: "Select po date", poDateValid: false })
			: this.setState({ poDateError: "", poDateValid: true });
		this.state.module.poAmount === ""
			? this.setState({ poAmountError: "Select poAmount", poAmountValid: false })
			: this.setState({ poAmountError: "", poAmountValid: true });

		setTimeout(this.save, 10);
	}
	save() {
		let _this = this;
		let validationCheck;
		let tempStatus = this.state.moduleName
		let tempModule = JSON.parse(JSON.stringify(this.state.module));
		if (tempModule.status === "Approved") { tempStatus = "Aprroved sales order" }
		if (tempModule.status === "New") { tempStatus = "Reopen sales order" }
		if (tempModule.status === "Close") { tempStatus = "Close sales order" }
		if (tempModule.isPoAvailable === "true") {
			validationCheck = (_this.state.poNumberValid && _this.state.customerValid && _this.state.contactValid && _this.state.billingAddrValid && _this.state.siteAddressValid && _this.state.poDateValid && _this.state.poAmountValid && _this.state.salesPersonValid)
		}
		else {
			tempModule.poDate = "";
			tempModule.poNumber = "";
			tempModule.poAmount = "";
			validationCheck = (_this.state.customerValid && _this.state.contactValid && _this.state.billingAddrValid && _this.state.siteAddressValid && _this.state.poAmountValid && _this.state.salesPersonValid)
		}
		if (validationCheck === true) {

			tempModule.customer = tempModule.customer.id;
			tempModule.agent = tempModule.agent ? tempModule.agent.id : null;
			tempModule.contact = tempModule.contact ? tempModule.contact.id : null;
			if (tempModule.isPoAvailable === "true") { tempModule.isPoAvailable = tempModule.isPoAvailable ? true : null; }
			else { tempModule.isPoAvailable = tempModule.isPoAvailable ? false : null; }

			tempModule.billingAddr = tempModule.billingAddr ? tempModule.billingAddr.id : null;
			tempModule.siteAddress = tempModule.siteAddress ? tempModule.siteAddress.id : null;
			tempModule.deliveryAddr = tempModule.deliveryAddr ? tempModule.deliveryAddr.id : null;
			for (var i = 0; i < tempModule.orderData.length; i++) {
				tempModule.orderData[i].unit = tempModule.orderData[i].product.unit
				tempModule.orderData[i].product = tempModule.orderData[i].product.id
				tempModule.product = tempModule.orderData[i].product.id
			}

			if (!this.state.module.id) {
				if (tempModule.orderData.length > 0) {
					delete tempModule.code;
					createOrder(tempModule,
						function success(data) {
							_this.successAlert("Order added successfully!");
							setTimeout(() => {
								_this.props.history.push("/sales/orders");
							}, 2000);
						},
						function error() {
							_this.errorAlert("Error in creating order");
						}
					)
				}
				else {
					_this.setState({ formError: "Please enter required order details " })
				}

			} else {
				tempModule.salesPerson = tempModule.salesPerson.id ? tempModule.salesPerson.id : tempModule.salesPerson;
				updateOrder(tempModule,
					function success(data) {
						_this.successAlert("Order saved successfully!");
					},
					function error() {
						_this.errorAlert("Error in saving order");
					}
				)
			}
		}
		else {
			_this.setState({ formError: "Please enter required fields" })
		}
	}
	createOrderFromQuotation() {
		let _this = this;
		createOrder(this.state.module,
			function success(data) {
				_this.successAlert("Order created successfully!");
				_this.props.history.push("/sales/orders-edit/" + data.code);
			},
			function error() {
				_this.errorAlert("Error in creating Order");
			}
		);
	}

	handleSettingsChange(e) {
		var newObj = this.state.moduleForm;
		newObj.custom[parseInt(e.target.name.split("_")[0], 10)].value = e.target.checked;
		this.setState({ moduleForm: newObj });
		updateUserForm(this.state.moduleForm,
			function success() { },
			function error() { }
		)
	}
	handleShowAddProductModal() { this.setState({ showAddProductModal: true }); }
	handleCloseAddProductModal() { this.setState({ showAddProductModal: false }); }
	handleShowDispatchModal() { this.setState({ showDispatchModal: true }); }
	handleCloseDispatchModal() { this.setState({ showDispatchModal: false }); this.fetchDataFromServer() }



	changeOrderStatus(status) {
		let obj = this.state.module;
		obj.status = status;
		this.setState({ module: obj });
		this.save();
	}

	createModule() {
		let _this = this;
		this.setState({
			alert: (
				<SweetAlert
					warning
					style={{ display: "block", marginTop: "-100px" }}
					title="Are you sure?"
					onConfirm={() => {
						createOrder(_this.state.module,
							function success(data) {
								_this.props.history.push("/sales/modules-edit/" + data.code);
							},
							function error(code) {
								_this.errorAlert("Error in creating module.");
							}
						);
					}}
					onCancel={() => this.setState({ alert: null })}
					confirmBtnBsStyle="danger"
					cancelBtnBsStyle="info"
					confirmBtnText="Yes, create module!"
					cancelBtnText="Cancel"
					showCancel
				>
					This will create new module for this module!
        </SweetAlert>
			)
		})
	}

	handleMultipleDocumentChange(newDocument) {
		var modules = this.state.module;
		modules.documents = newDocument.documents;
		this.setState({ modules });
	}
	handleDeleteDocument(key) {
		let modules = this.state.module;
		modules.documents.slice();
		modules.documents.splice(key, 1);
		this.setState({ modules });
	}
	handleCheckedRadioButton(e) {
		let modules = this.state.module;
		modules[e.target.name] = e.target.value;
		this.setState({ modules });
	}
	handleInputChange(e, param) {
		var newObj = this.state.module;
		if (e === undefined) {
			newObj[param] = e !== undefined ? e.target.value : null;
			this.setState({ module: newObj });
		}
		else {
			if (!e.target) {
				newObj[param] = e;
				this.setState({ pricing: newObj, formError: null });
				e.id === "" || null ? this.setState({ rawmaterialValid: false }) : this.setState({ rawmaterialValid: true })
				if (param === "customer") {
					this.getAddressForCustomer(e.id);
					this.getContactForCustomer(e.id);
				}
			} else {
				if (e.target.name.indexOf("custom_") !== -1) {
					var key = parseInt(e.target.name.split("_")[1], 10);
					newObj.custom[key] = e.target.value;
					this.setState({ module: newObj });
				} else if (e.target.name.indexOf("radio_") !== -1) {
					newObj[e.target.name.split("_")[1]] = e.target.value;
					this.setState({ module: newObj });
				} else {
					if (e.target.type === "number") newObj[e.target.name] = parseFloat(e.target.value);
					else newObj[e.target.name] = e.target.value;
					this.setState({ module: newObj });
				}
			}
		}
	}
	handleDateChange(name, date) {
		var moduleTemp = this.state.module;
		moduleTemp[name] = date._d;
		this.setState({ moduleTemp });
	}
	handleDropDownChange(selectOption, type) {
		var newModule = this.state.module;
		newModule[type] = selectOption ? selectOption.value : null;
		this.setState({ module: newModule });
	}
	handleSelectChange(name, selectedOption) {
		let temp = this.state.module;
		temp[name] = selectedOption;
		this.setState({ temp })
	}
	handlePaymentTermInputChange(e) {
		let newObj = this.state.newPaymentTerm;
		newObj[e.target.name] = e.target.value;
		if (e.target.name === "percentage") {
			newObj.amount = e.target.value > 0 ? _.round((this.state.module.total * e.target.value / 100)) : newObj.amount;
		}
		this.setState({ newPaymentTerm: newObj, formError: null });

	}

	handleRadio = event => {
		const target = event.target;
		this.setState({
			[target.name]: target.value
		});
	};
	render() {

		const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
		const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
		const List = (<Tooltip id="delete_tooltip"> Order list</Tooltip>);
		const dispatch = (<Tooltip id="dispatch_tooltip">Add new dispatch schedule</Tooltip>);

		let _this = this;
		let settings = !this.state.settings ? null :
			<Row>
				<Col xs={12} sm={12} md={12} lg={12}>
					<label>Mandatory Fields</label>
					<Col xs={12} sm={12} md={10} lg={10} mdOffset={1} lgOffset={1}>
						{
							this.state.moduleForm.mandatory.map(function (item, key) {
								return (
									<Checkbox disabled key={key} name={item.name} isChecked={true} number={item.name} label={item.label} onChange={_this.handleSettingsChange} />
								)
							})
						}</Col>
					<hr />
					<label>Custom Fields</label>
					<Col xs={12} sm={12} md={10} lg={10} mdOffset={1} lgOffset={1}>
						{
							this.state.moduleForm.custom.map(function (item, key) {
								return (
									<Checkbox key={key} name={key + "_" + item.name} isChecked={item.value} number={item.name} label={item.label} onChange={_this.handleSettingsChange} />
								)
							})
						}</Col>
					<Button className="col-md-8 col-md-offset-2" onClick={this.addCustomField}>Add new custom field</Button>
				</Col>
			</Row>
		let list = this.state.settings ? null : null;

		let sidePanel = this.state.settings ? settings : list;
		let className;
		{ this.state.module.code === "New" ? className = "fa fa-plus" : className = "fa fa-eye" }
		let customerInfo = (
			<Row>
				<Col xs={12}>
					<Col xs={12} sm={6} md={3} lg={3}>

						{this.state.module.status === "New" ?
							<FormGroup>
								<ControlLabel>Customer Name <span className="star" >*</span></ControlLabel>
								<div className="input-group">
									<Select
										clearable={false}
										disabled={this.state.module.status !== "New" ? true : false}
										placeholder="Select customer"
										name="name"
										options={this.state.customerList}
										value={this.state.module.customer ? this.state.module.customer.id : null}
										onChange={(selectedOption) => this.handleInputChange(selectedOption, 'customer')}
										style={{ color: this.state.customerValid || this.state.customerValid === null ? "" : errorColor, borderColor: this.state.customerValid || this.state.customerValid === null ? "" : errorColor }}
									/>
									<span className="input-group-addon">
										<a role="button" className={className} onClick={() => this.setState({ showCustomerModal: true })}>{null}</a>
									</span>
								</div>
							</FormGroup>
							:
							<FormGroup>
								<ControlLabel><b>Customer Name:</b><br /> {this.state.module.customer ? this.state.module.customer.name : null}</ControlLabel>
							</FormGroup>
						}
						<div>
							{
								this.state.module.customer ?
									<div style={{ textTransform: "lowercase" }} class="labelName">
										<ControlLabel> EMAIL: {this.state.module.customer.email}</ControlLabel> <br />
										<ControlLabel pullRight>	 Phone: {this.state.module.customer.phone}</ControlLabel>
									</div>
									: null
							}
						</div>

					</Col>
					{
						this.state.module.customer !== null ?
							<Col xs={12} sm={6} md={3} lg={3}>

								{this.state.module.status === "New" ?
									<FormGroup>
										<ControlLabel>Contact <span className="star" >*</span></ControlLabel>
										<div>
											<span
												className="input-group"
												disabled={this.state.module.customer ? false : true}>
												<Select
													disabled={this.state.module.status !== "New" ? true : false}
													clearable={false}
													placeholder="Select contact" name="contact"
													options={this.state.contactList}
													value={this.state.module.contact ? this.state.module.contact.id : null}
													onChange={(selectedOption) => this.handleInputChange(selectedOption, 'contact')}
													style={{ color: this.state.contactValid || this.state.contactValid === null ? "" : errorColor, borderColor: this.state.contactValid || this.state.contactValid === null ? "" : errorColor }}
												/>
												< span className="input-group-addon">
													<a role="button" className={className} onClick={() => this.setState({ showContactModal: true })} >{null}</a>
												</span>

											</span>
										</div>
									</FormGroup>
									:
									<FormGroup>
										<ControlLabel><b>Contact:</b><br /> {this.state.module.contact ? this.state.module.contact.name : null}</ControlLabel>
									</FormGroup>
								}
								<div>
									{
										this.state.module.contact ?
											<div style={{ textTransform: "lowercase" }} class="labelName">
												<ControlLabel> EMAIL: {this.state.module.contact.email}</ControlLabel><br />
												<ControlLabel pullRight>Phone: {this.state.module.contact.phone}</ControlLabel>
											</div>
											: null
									}
								</div>
							</Col>
							: null
					}
					{
						this.state.module.customer !== null ?
							<Col xs={12} sm={6} md={3} lg={3}>


								{this.state.module.status === "New" ?
									<FormGroup>
										<ControlLabel>Billing Address <span className="star" >*</span></ControlLabel>
										<div>
											<span
												className="input-group"
												disabled={this.state.module.customer ? false : true}>
												<Select
													disabled={this.state.module.status !== "New" ? true : false}
													clearable={false}
													placeholder="Select billing address"
													name="billingAddr"
													options={this.state.addressList.filter(prop => {
														return (prop.type === "Billing")
													})} value={this.state.module.billingAddr ? this.state.module.billingAddr.id : null}
													onChange={(selectedOption) => this.handleInputChange(selectedOption, 'billingAddr')}
													style={{ color: this.state.billingAddrValid || this.state.billingAddrValid === null ? "" : errorColor, borderColor: this.state.billingAddrValid || this.state.billingAddrValid === null ? "" : errorColor }}
												/>
												<span className="input-group-addon">
													<a role="button" className={className} onClick={() => this.setState({ showAddressModal: true })} >{null}</a>
												</span>
											</span>
										</div>
									</FormGroup>
									:
									<FormGroup>
										<ControlLabel><b>Billing Address:</b><br /> {this.state.module.billingAddr ? this.state.module.billingAddr.name : null}</ControlLabel>
									</FormGroup>
								}
								<div>
									{
										this.state.module.billingAddr ?
											<div style={{ textTransform: "lowercase" }} class="labelName">
												<ControlLabel pullRight> {this.state.module.billingAddr.street_address}</ControlLabel><br />
												<ControlLabel pullRight>City: {this.state.module.billingAddr.city}</ControlLabel><br />
												<ControlLabel pullRight>Postal Code: {this.state.module.billingAddr.zipcode}</ControlLabel>
											</div>
											: null
									}
								</div>
							</Col>
							: null
					}
					{
						this.state.module.customer !== null ?
							<Col xs={12} sm={6} md={3} lg={3}>

								{this.state.module.status === "New" ?
									<FormGroup>
										<ControlLabel>Site Address <span className="star" >*</span></ControlLabel>
										<div>
											<span
												className="input-group"
												disabled={this.state.module.customer ? false : true}
											>
												<Select
													disabled={this.state.module.status !== "New" ? true : false}
													clearable={false}
													placeholder="Select site address"
													name="siteAddress"
													options={this.state.addressList.filter(prop => {
														return (prop.type === "Site")
													})} value={this.state.module.siteAddress ? this.state.module.siteAddress.id : null}
													onChange={(selectedOption) => this.handleInputChange(selectedOption, 'siteAddress')}
													style={{ color: this.state.siteAddressValid || this.state.siteAddressValid === null ? "" : errorColor, borderColor: this.state.siteAddressValid || this.state.siteAddressValid === null ? "" : errorColor }}
												/>
												<span className="input-group-addon">
													<a role="button" className={className} onClick={() => this.setState({ showAddressModal: true })} >{null}</a>
												</span>
											</span>
										</div>
									</FormGroup>
									:
									<FormGroup>
										<ControlLabel><b>Site Address:</b><br /> {this.state.module.siteAddress ? this.state.module.siteAddress.name : null}</ControlLabel>
									</FormGroup>
								}
								<div>
									{
										this.state.module.siteAddress ?
											<div style={{ textTransform: "lowercase" }} class="labelName">
												<ControlLabel pullRight>{this.state.module.siteAddress.street_address}</ControlLabel><br />
												<ControlLabel pullRight>City: {this.state.module.siteAddress.city}</ControlLabel><br />
												<ControlLabel pullRight>Postal Code: {this.state.module.siteAddress.zipcode}</ControlLabel>
											</div>
											: null
									}
								</div>
							</Col>
							: null
					}
				</Col>
			</Row >
		);
		let poDetails = (
			<Row>
				<Col xs={12}>
					<Col xs={12} sm={6} md={2} lg={2}>

						{this.state.module.status === "New" ?
							<FormGroup>
								<ControlLabel>Sales Person  <span className="star">*</span></ControlLabel>
								<Select
									disabled={this.state.module.status !== "New" ? true : false}
									clearable={false}
									placeholder="Select sales person"
									name="salesPerson"
									value={this.state.module.salesPerson ? this.state.module.salesPerson : null}
									options={this.state.users}
									onChange={(selectOption) => this.handleDropDownChange(selectOption, "salesPerson")}
									style={{ color: this.state.salesPersonValid || this.state.salesPersonValid === null ? "" : errorColor, borderColor: this.state.salesPersonValid || this.state.salesPersonValid === null ? "" : errorColor }}
								/>
							</FormGroup>
							:
							<FormGroup>
								<ControlLabel><b>Sales Person :</b><br /> {this.state.module.salesPerson ? this.state.module.userName : null}</ControlLabel>
							</FormGroup>
						}

					</Col>
					{this.state.module.isPoAvailable === "true" ?
						<div>
							<Col xs={12} sm={6} md={2} lg={2}>

								{this.state.module.status === "New" ?
									<FormGroup>
										<ControlLabel>Customer PO No <span className="star" >*</span></ControlLabel>
										<FormControl
											disabled={this.state.module.status !== "New" ? true : false}
											type="text"
											placeholder="Customer po number"
											name="poNumber"
											value={this.state.module.poNumber}
											onChange={this.handleInputChange}
											className={this.state.poNumberValid || this.state.poNumberValid === null ? "" : "error"}
										/>
									</FormGroup>
									:
									<FormGroup>
										<ControlLabel><b>Customer PO No :</b><br /> {this.state.module.poNumber ? this.state.module.poNumber : null}</ControlLabel>
									</FormGroup>
								}

							</Col>
							<Col xs={12} sm={6} md={2} lg={2}>

								{this.state.module.status === "New" ?
									<FormGroup>
										<ControlLabel> Customer PO Date  <span className="star" >*</span></ControlLabel>
										<Datetime
											timeFormat={false}
											closeOnSelect={true}
											dateFormat="DD MMM YYYY"
											name="poDate"
											inputProps={{ placeholder: "PO date", style: { color: this.state.poDateValid || this.state.poDateValid === null ? "" : errorColor, borderColor: this.state.poDateValid || this.state.poDateValid === null ? "" : errorColor } }}
											value={this.state.module.poDate ? Moment(this.state.module.poDate).format("DD MMM YYYY") : null}
											onChange={(date) => this.handleDateChange("poDate", date)}
										/>
									</FormGroup>
									:
									<FormGroup>
										<ControlLabel><b>Customer PO Date :</b><br /> {this.state.module.poDate ? Moment(this.state.module.poDate).format("DD MMM YYYY") : null}</ControlLabel>
									</FormGroup>
								}
							</Col>
						</div>
						: null
					}

					<Col xs={12} sm={6} md={2} lg={2}>

						{this.state.module.status === "New" ?
							<FormGroup>
								<ControlLabel> PO Expiry Date </ControlLabel>
								<Datetime
									timeFormat={false}
									closeOnSelect={true}
									dateFormat="DD MMM YYYY"
									name="poExpiryDate"
									inputProps={{ placeholder: " Customer PO expiry date", style: { color: this.state.poExpiryDateValid || this.state.poExpiryDateValid === null ? "" : errorColor, borderColor: this.state.poExpiryDateValid || this.state.poExpiryDateValid === null ? "" : errorColor } }}
									value={this.state.module.poExpiryDate ? Moment(this.state.module.poExpiryDate).format("DD MMM YYYY") : null}
									onChange={(date) => this.handleDateChange("poExpiryDate", date)}
								/>
							</FormGroup>
							:
							<FormGroup>
								<ControlLabel><b>Customer PO Expiry Date :</b><br /> {this.state.module.poExpiryDate ? Moment(this.state.module.poExpiryDate).format("DD MMM YYYY") : null}</ControlLabel>
							</FormGroup>
						}
					</Col>
					{this.state.module.isPoAvailable === "true" ?
						<Col xs={12} sm={6} md={2} lg={2}>

							{this.state.module.status === "New" ?
								<FormGroup>
									<ControlLabel> Customer PO Amount <span className="star" >*</span></ControlLabel>
									<div>
										<span className="input-group">
											<span className="input-group-addon">{this.state.currency}</span>
											<FormControl
												disabled={this.state.module.status !== "New" ? true : false}
												type="number"
												min={0}
												name="poAmount"
												value={this.state.module.poAmount ? this.state.module.poAmount.toFixed(2) : (0).toFixed(2)}
												onChange={this.handleInputChange}
												style={{ color: this.state.poAmountValid || this.state.poAmountValid === null ? "" : errorColor, borderColor: this.state.poAmountValid || this.state.poAmountValid === null ? "" : errorColor }}
											/>
										</span>
									</div>
								</FormGroup>
								:
								<FormGroup>
									<ControlLabel><b>Customer PO Amount :</b><br /> {this.state.module.poAmount ? this.state.module.poAmount.toFixed(2) : null}</ControlLabel>
								</FormGroup>
							}

						</Col>
						: null
					}
					<Col xs={12} sm={6} md={2} lg={2}>

						{this.state.module.status === "New" ?
							<FormGroup>
								<ControlLabel>Building Name</ControlLabel>
								<FormControl
									disabled={this.state.module.status !== "New" ? true : false}
									type="text"
									placeholder="Building name"
									name="buildingName"
									value={this.state.module.buildingName}
									onChange={this.handleInputChange}
								/>
							</FormGroup>
							:
							<FormGroup>
								<ControlLabel><b>Building Name:</b><br /> {this.state.module.buildingName ? this.state.module.buildingName : null}</ControlLabel>
							</FormGroup>
						}
					</Col>
				</Col>
			</Row>
		)
		let customFields = (
			<Row>
				<Col xs={12}>
					{
						_this.state.moduleForm.custom.map(function (item, key) {
							return (
								<Col xs={12} sm={4} md={4} lg={3} key={key} hidden={!item.value}>
									<FormGroup>
										<ControlLabel>{item.label}</ControlLabel>
										<FormControl
											disabled={!_this.state.edit}
											name={"custom_" + key}
											type="text"
											placeholder={item.label}
											value={_this.state.module.custom[key] ? _this.state.module.custom[key] : ""}
											onChange={_this.handleInputChange}
										/>
									</FormGroup>
								</Col>
							)
						})
					}
					<Col xs={12} sm={12} md={12} lg={12}>
						<FormGroup>
							<ControlLabel>Notes:</ControlLabel>
							<textarea
								className="form-control"
								disabled={this.state.module.status === "New" ? false : true}
								name="notes"
								type="text"
								placeholder="Notes"
								value={_this.state.module.notes ? _this.state.module.notes : ""} onChange={_this.handleInputChange}>
							</textarea>
						</FormGroup>
					</Col>
				</Col>
			</Row>
		);
		let dispatches = (
			<DispatchListComponent
				ordercode={this.state.module.id}
			/>
		)
		let actions = (
			<div>
				<h6 className="text-danger text-center">{this.state.formError}</h6>
				<Col xs={12}>
					<OverlayTrigger placement="top" overlay={back}>
						<Button bsStyle="warning" fill icon disabled={this.state.settings} onClick={this.props.history.goBack}><span className="fa fa-arrow-left"></span></Button>
					</OverlayTrigger>
					<OverlayTrigger placement="top" overlay={List}>
						<Button bsStyle="primary" fill icon disabled={this.state.settings} onClick={() => { return this.props.history.push("/sales/orders"); }}><span className="fa fa-list"></span></Button>
					</OverlayTrigger>
					{
						this.state.module.status !== "Approved" ?
							this.state.module.status !== "Dispatching" ?
								< OverlayTrigger placement="top" overlay={save}>
									<Button bsStyle="success" fill pullRight icon disabled={this.state.settings} onClick={this.validationCheck}>	<span className="fa fa-save"></span></Button>
								</OverlayTrigger>
								: null
							: null
					}
					{this.state.module.id && this.state.module.status === "Dispatching" || this.state.module.status === "Approved" ? (
						this.state.module.status !== "Dispatching" ?
							<OverlayTrigger placement="top" overlay={dispatch}>
								<Button bsStyle="default" fill pullRight icon disabled={this.state.settings} onClick={this.handleShowDispatchModal}><span className="fa fa-calendar-check-o text-default"></span>	</Button>
							</OverlayTrigger>

							: null
					) : null
					}


				</Col>
			</div>
		);

		let orderTable = (
			<SalesModuleOrderTableComponent
				order={this.state.module}
				igst={this.state.module.deliveryAddr && this.state.module.deliveryAddr.state === "Madhya Pradesh" ? false : true}
				productList={this.state.productList}
				customer={this.state.module.customer}
				saveProductToModule={this.saveProductToModule}
				{...this.props}
			/>
		);
		let addEditDispatchModal = (
			<DispatchScheduleModalComponent
				showDispatchModal={this.state.showDispatchModal}
				handleCloseDispatchModal={this.handleCloseDispatchModal}
				order={this.state.module}
				{...this.props}
			/>
		);
		let customerModal = (
			<Modal
				dialogClassName="large-modal"
				show={this.state.showCustomerModal}
			// onHide={() => {
			// 	this.setState({ showCustomerModal: false });
			// 	this.fetchDataFromServer("customer");
			// }}
			>
				<Modal.Header class="header1">
					<div className="text-right">
						<a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => { this.setState({ showCustomerModal: false }); this.fetchDataFromServer('customer'); }}>{null}</a>
					</div>
					<Modal.Title>Add/Update Customer</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<CustomerFormComponent {...this.props}
						className={className}
						customer={this.state.module.customer} />
				</Modal.Body>
			</Modal>
		)
		let addressModal = (
			<Modal
				dialogClassName="large-modal"
				show={this.state.showAddressModal}
			// onHide={() => {
			// 	this.setState({ showAddressModal: false });
			// 	this.getAddressForCustomer(this.state.module.customer.id);
			// }}
			>
				<Modal.Header class="header1">
					<div className="text-right">
						<a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => { this.setState({ showAddressModal: false }); this.getAddressForCustomer(this.state.module.customer.id); }}>{null}</a>
					</div>
					<Modal.Title>Add/Update Address</Modal.Title>
				</Modal.Header>
				<Modal.Body className="cardModal">
					<AddressesListComponent {...this.props}
						className={className}
						customer id={this.state.module.customer ? this.state.module.customer.id : null} />
				</Modal.Body>
			</Modal>
		)
		let contactModal = (
			<Modal
				dialogClassName="large-modal"
				show={this.state.showContactModal}
			// onHide={() => {
			// 	this.setState({ showContactModal: false });
			// 	this.getContactForCustomer(this.state.module.customer.id);
			// }}
			>
				<Modal.Header class="header1">
					<div className="text-right">
						<a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => { this.setState({ showContactModal: false }); this.getContactForCustomer(this.state.module.customer.id); }}>{null}</a>
					</div>
					<Modal.Title>Add/Update Contact</Modal.Title>
				</Modal.Header>
				<Modal.Body className="cardModal">
					<ContactsListComponent {...this.props}
						className={className}
						customer id={this.state.module.customer ? this.state.module.customer.id : null} />
				</Modal.Body>

			</Modal>
		)
		let moduleInfoTabs = (
			<Tab.Container defaultActiveKey="products" id="order-details">
				<div className="clearfix">
					<Col xs={12}>
						<Nav bsStyle="tabs">
							<NavItem eventKey="products">
								<i className="fa fa-shopping-cart" /> Products
              </NavItem>
							<NavItem eventKey="custom">
								<i className="fa fa-info" /> Additional Info
              </NavItem>
							{

								(this.state.module.code !== "New") ?
									this.state.module.status !== "Dispatching" ?
										<NavItem eventKey="documents" ><i className="fa fa-file" /> Documents</NavItem>
										: null
									: null
							}
							{
								(this.state.module.code !== "New") ?
									(
										<NavItem eventKey="dispatches">
											<i className="fa fa-truck fa-flip-horizontal" /> Dispatches
                </NavItem>
									) : null
							}
						</Nav>
					</Col>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Tab.Content animation>
							<Tab.Pane eventKey="products">
								{orderTable}
							</Tab.Pane>

							<Tab.Pane eventKey="documents">
								<div hidden={this.state.module.code === "New" ? true : false}>
									<Row>
										<UploadComponent
											disabled={this.state.module.status !== "New" ? true : false}
											document
											type="orders"
											documents={this.state.module.documents}
											details={this.state.module}
											dropText="Drop files or click here"
											handleMultipleDocumentChange={this.handleMultipleDocumentChange}
											handleDeleteDocument={this.handleDeleteDocument}
										/>
									</Row>
								</div>
							</Tab.Pane>
							<Tab.Pane eventKey="custom">
								<Row>	{customFields}</Row>
							</Tab.Pane>
							<Tab.Pane eventKey="dispatches" className="DispatchesPadding">
								<Row>{dispatches}</Row>
							</Tab.Pane>
						</Tab.Content>
					</Col>
				</div>
			</Tab.Container>
		);
		let form = (
			<Row>
				<fieldset>
					<Col xs={12}>
						<Col xs={12}>
							<Col xs={12} sm={4} md={3} lg={3}>
								<FormGroup>
									<ControlLabel><b>Creation Time:</b> <br />{this.state.module.createdAt ? Moment(this.state.module.createdAt).format('DD MMM YYYY hh:mm A') : Moment().format('DD MMM YYYY hh:mm A')}</ControlLabel>
								</FormGroup>
							</Col>
							{this.state.module.code !== "New" ?
								<Col xs={12} sm={4} md={2} lg={3}>
									<FormGroup>
										< ControlLabel ><b>Status:</b> <br /> {this.state.module.status ? this.state.module.status : ""}</ControlLabel>
									</FormGroup>
								</Col>
								: null
							}
							{this.state.module.code !== "New" ?
								<Col xs={12} sm={4} md={3} lg={3}>
									<FormGroup>
										<ControlLabel><b>Created By:</b><br /> {this.state.module.user ? this.state.module.user.name : ""}</ControlLabel>
									</FormGroup>
								</Col>
								: null
							}
							{this.state.module.code !== "New" ?
								<Col xs={12} sm={4} md={3} lg={3}>
									<FormGroup>
										<ControlLabel><b>Sales Order Number:</b><br /> {this.state.module.number ? this.state.module.number : ""}</ControlLabel>
									</FormGroup>
								</Col>
								: null
							}
							{this.state.module.status === "New" ?
								<Col md={2}>
									<Radio
										disabled={this.state.module.status === "New" ? false : true}
										number="2321"
										option="true"
										name="isPoAvailable"
										onChange={this.handleCheckedRadioButton}
										checked={this.state.module.isPoAvailable === "true"}
										label="PO AVAILBALE"
									/>
								</Col>
								: null
							}
							{this.state.module.status === "New" ?
								<Col md={2}>
									<Radio
										disabled={this.state.module.status === "New" ? false : true}
										number="2345"
										option="false"
										name="isPoAvailable"
										onChange={this.handleCheckedRadioButton}
										checked={this.state.module.isPoAvailable === "false"}
										label="PO NOT AVAILBALE"
									/>
								</Col>
								: null
							}
							<div>
							</div>
						</Col>
					</Col>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Col xs={12} sm={4} md={3} lg={2}>
							<div className="text-center"></div>
						</Col>
						<Col xs={12} sm={12} md={12} lg={12}>
							<h6 className="section-header">Customer Information</h6>
							{customerInfo}
						</Col>
						<Col xs={12} sm={12} md={12} lg={12}>
							<h6 className="section-header">Sales Order Details</h6>
							{poDetails}
						</Col>
						<Col xs={12} sm={12} md={12} lg={12}>
							<h6 className="section-header">Order Details</h6>
							{moduleInfoTabs}
						</Col>
					</Col>
				</fieldset>
			</Row>
		);


		return (
			<Row className="card-content">
				{this.state.alert}
				{addEditDispatchModal}
				{customerModal}
				{addressModal}
				{contactModal}
				<div className="card-form">{form}</div>
				<div className="card-footer">{actions}</div>
			</Row>
		);

	}
}

export default SalesModuleFormComponent;
