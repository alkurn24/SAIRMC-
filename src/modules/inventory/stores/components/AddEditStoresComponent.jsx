import React, { Component } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "components/CustomSelect/CustomSelect.jsx";
import "react-select/dist/react-select.css";
import Datetime from "react-datetime";
// import QRcode from "qrcode.react";
import Moment from "moment";
import cookie from 'react-cookies';
import ReactTable from 'react-table';
import { Modal, Row, Col, FormControl, FormGroup, Nav, NavItem, Tab, ControlLabel, Tooltip, OverlayTrigger } from "react-bootstrap";

import UploadComponent from 'components/Upload/UploadComponent.jsx';
import Button from "components/CustomButton/CustomButton.jsx";

import { errorColor } from 'variables/Variables.jsx';
import { getInventorySettingList } from "modules/settings/inventory/server/InventoryServerComm.jsx";
import { getHsnList } from "modules/settings/hsn/server/HsnServerComm.jsx";
import HsnListComponent from "../../../settings/hsn/components/HsnListComponent.jsx";
import { createInventory, getInventorySingle, updateInventory } from "../server/StoresServerComm.jsx";
import { getUserList } from "modules/settings/usermgmt/server/UserServerComm.jsx";
import { getVendorList } from "modules/purchase/vendor/server/VendorServerComm.jsx";
import { selectOptionsMaintenaceStatus, unitList } from "variables/appVariables.jsx";


class AddEditStoresComponent extends Component {
	constructor() {
		super()
		this.state = {
			userList: [],
			vendorList: [],
			hsnList: [],
			plantList: [],
			inventorySettingList: [],
			inventory: {
				invType: "",
				category: "",
				code: "New",
				name: "",
				model: "",
				srno: "",
				location: "",
				status: null,
				value: 0,
				actualQty: 0,
				size: "",
				drawingNo: "",
				unit: "",
				rate: "",
				hsn: null,
				manufacturingDate: null,
				purchaseDate: null,
				lastCalibrationDate: null,
				nextCalibrationDate: null,
				lastMaintenanceDate: null,
				nextMaintenanceDate: null,
				lastServiceDate: null,
				nextServiceDate: null,
				endOfWarrantyDate: null,
				endOfInsuranceDate: null,
				owner: null,
				quantity: 1,
				imagePreviewUrl: "",
				photo: "",
				documents: [],
				stock: [],
				vendors: [],
			},
			alert: null,
			formError: null,
			invTypeError: false,
			categoryError: false,
			nameError: false,
			modelError: false,
			srnoError: false,
			statusError: false,
			valueError: false,
			ownerError: false,
			unitError: false,
			rateError: false,
			hsnError: false,
			locationError: false,
			invTypeValid: null,
			categoryValid: null,
			nameValid: null,
			modelValid: null,
			srnoValid: null,
			statusValid: null,
			valueValid: null,
			ownerValid: null,
			unitValid: null,
			rateValid: null,
			hsnValid: null,
			locationValid: null,
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleDropDownChangeHsn = this.handleDropDownChangeHsn.bind(this);
		this.handleDropDownChangeStatus = this.handleDropDownChangeStatus.bind(this);
		this.handleCheckedChange = this.handleCheckedChange.bind(this);
		this.handleShowResponse = this.handleShowResponse.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleCheckbox = this.handleCheckbox.bind(this);
		this.handleDropDownChange = this.handleDropDownChange.bind(this);
		this.handleMultipleDocumentChange = this.handleMultipleDocumentChange.bind(this);
		this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
		this.validationCheck = this.validationCheck.bind(this);
		this.save = this.save.bind(this);
		this.saveItem = this.saveItem.bind(this);
		this.delete = this.delete.bind(this);
		this.deleteConfirm = this.deleteConfirm.bind(this);
		this.successAlert = this.successAlert.bind(this);
		this.errorAlert = this.errorAlert.bind(this);
		this.handleImageChange = this.handleImageChange.bind(this);
		this.renderDropDown = this.renderDropDown.bind(this);
		this.renderNumber = this.renderNumber.bind(this);
		this.renderStockNumber = this.renderStockNumber.bind(this);
		this.renderStockStandarQty = this.renderStockStandarQty.bind(this);
		this.renderEditableStockName = this.renderEditableStockName.bind(this);


	}
	componentWillMount() {
		var _this = this;
		if (_this.props.match.params.itemcode !== "new") {
			getInventorySingle(_this.props.match.params.itemcode,
				function success(data) {
					let inventoryData = JSON.parse(JSON.stringify(data));
					inventoryData.manufacturingDate = Moment(inventoryData.manufacturingDate);
					inventoryData.purchaseDate = Moment(inventoryData.purchaseDate);
					inventoryData.lastCalibrationDate = Moment(inventoryData.lastCalibrationDate);
					inventoryData.nextCalibrationDate = Moment(inventoryData.nextCalibrationDate);
					inventoryData.lastServiceDate = Moment(inventoryData.lastServiceDate);
					inventoryData.nextServiceDate = Moment(inventoryData.nextServiceDate);
					inventoryData.lastMaintenanceDate = Moment(inventoryData.lastMaintenanceDate);
					inventoryData.nextMaintenanceDate = Moment(inventoryData.nextMaintenanceDate);
					inventoryData.endOfWarrantyDate = Moment(inventoryData.endOfWarrantyDate);
					inventoryData.endOfInsuranceDate = Moment(inventoryData.endOfInsuranceDate);
					inventoryData.actualQty = inventoryData.stock[0].actualQty
					if (inventoryData.stock.length) {
						for (var i = 0; i < inventoryData.stock.length; i++) {
							inventoryData.stock[i].name = inventoryData.stock[i].plant.name;
							inventoryData.stock[i].standardQty = inventoryData.stock[i].standardQty ? inventoryData.stock[i].standardQty.toFixed(2) : 0.00;
							inventoryData.stock[i].actualQty = inventoryData.stock[i].actualQty ? inventoryData.stock[i].actualQty.toFixed(2) : 0.00;
							inventoryData.stock[i].minStockQty = inventoryData.stock[i].minStockQty ? inventoryData.stock[i].minStockQty.toFixed(2) : 0.00;
						}
					}
					inventoryData.owner.id = inventoryData.owner ? inventoryData.owner._id : "";
					if (inventoryData.invType.categories.trim() !== "") {
						_this.setState({
							categoryList: data.invType.categories.split(",").map(prop => {
								return {
									value: prop,
									label: prop
								}
							})
						})
					} else {
						_this.setState({ categoryList: null })
					}
					_this.setState({ inventory: inventoryData })
				},
				() => { }
			)
		}


		getVendorList(
			"view=dropdown",
			(data) => _this.setState({ vendorList: data.rows }),
			() => { }
		)

		getHsnList(
			"",
			function success(data) {
				_this.setState({
					hsnList: data.rows.map((prop) => {
						return {
							id: prop.id,
							value: prop.id,
							label: prop.hsn,
							gst: prop.gst,
						}
					})
				});
			})
		getUserList("view=user",
			function success(data) {
				_this.setState({
					userList: data.rows
				})
			},
		)
		getInventorySettingList("type=Store",
			(data) => _this.setState({
				inventorySettingList: data.rows.filter(x => { return !x.isUnique }).map(prop => {
					prop.value = prop.id;
					prop.label = prop.name;
					return prop;
				})
			}),
			() => _this.errorAlert("Something went wrong!")
		)
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
					You will not be able to recover this vendor!
        </SweetAlert>
			)
		});
	}
	deleteConfirm(id) {
		let tempObj = this.state.inventory;
		tempObj.vendors.splice(id, 1);
		this.setState({ tempObj });
		this.successAlert("Vendor deleted successfully!")

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
	validationCheck() {
		this.state.inventory.invType === "" ?
			this.setState({ invTypeError: "Select inventory type", invTypeValid: false }) :
			this.setState({ invTypeError: "", invTypeValid: true })
		this.state.inventory.category === "" ?
			this.setState({ categoryError: "Select category", categoryValid: false }) :
			this.setState({ categoryError: "", categoryValid: true })
		this.state.inventory.name === "" ?
			this.setState({ nameError: "Enter name", nameValid: false }) :
			this.setState({ nameError: "", nameValid: true })
		this.state.inventory.srno === "" ?
			this.setState({ srnoError: "Enter srno", srnoValid: false }) :
			this.setState({ srnoError: "", srnoValid: true })
		this.state.inventory.model === "" ?
			this.setState({ modelError: "Enter model name", modelValid: false }) :
			this.setState({ modelError: "", modelValid: true })
		this.state.inventory.unit === "" ?
			this.setState({ unitError: "enter unit", unitValid: false }) :
			this.setState({ unitError: "", unitValid: true })
		this.state.inventory.rate === "" ?
			this.setState({ rateError: "enter rate", rateValid: false }) :
			this.setState({ rateError: "", rateValid: true })
		this.state.inventory.value === "" ?
			this.setState({ valueError: "enter  Value", valueValid: false }) :
			this.setState({ valueError: "", valueValid: true })
		this.state.inventory.owner === null ?
			this.setState({ ownerError: "Select owner", ownerValid: false }) :
			this.setState({ ownerError: "", ownerValid: true })
		this.state.inventory.status === null ?
			this.setState({ statusError: "Select owner", statusValid: false }) :
			this.setState({ statusError: "", statusValid: true })
		this.state.inventory.hsn === null ?
			this.setState({ hsnError: "Select hsn", hsnValid: false }) :
			this.setState({ hsnError: "", hsnValid: true })
		setTimeout(this.save, 10);
	}
	save() {
		var _this = this;
		let tempModule = JSON.parse(JSON.stringify(this.state.inventory));
		if (_this.state.invTypeValid && _this.state.ownerValid && _this.state.hsnValid && _this.state.statusValid && _this.state.rateValid && _this.state.nameValid) {
			tempModule.invType = tempModule.invType ? tempModule.invType.id : null;
			if (tempModule.category !== undefined) {
				tempModule.category = tempModule.category.value ? tempModule.category.value : tempModule.category;
			}
			tempModule.hsn = tempModule.hsn ? tempModule.hsn.id : null;
			tempModule.owner = tempModule.owner.id ? tempModule.owner.id : tempModule.owner;
			if (tempModule.vendors.length > 0) {
				if (tempModule.vendors.length) {
					for (let i = 0; i < tempModule.vendors.length; i++) {
						if (tempModule.vendors[i].vendor === null) {
							this.setState({ formError: "Please select vendor name" })
						}
						else {
							this.setState({ formError: "" })
							tempModule.vendors[i].vendor = tempModule.vendors[i].vendor.id;
							if (i + 1 === tempModule.vendors.length) {
								this.saveItem(tempModule);
							}
						}
					}
				} else {
					this.saveItem(tempModule);
				}
			}

			else {
				this.setState({ formError: "Please enter vendor details" })
			}
		}
		else { this.setState({ formError: "Please enter required fields" }) }


	}
	saveItem(tempModule) {
		let _this = this;
		if (_this.props.match.params.itemcode !== "new") {
			if (tempModule.stock.length) {
				for (var i = 0; i < tempModule.stock.length; i++) {
					tempModule.stock[i].plant = tempModule.stock[i].plant.id
				}
			}
			updateInventory(tempModule,
				function success() {
					_this.successAlert("Store item saved successfully!");
					setTimeout(() => {
						_this.props.history.push("/inventory/stores");
					}, 2000);
				},
				function error() {
					_this.errorAlert("Error in saving inventory item.");
				}
			)
		}
		else {
			createInventory(tempModule,
				function success() {
					_this.successAlert("Store item added successfully!");
					setTimeout(() => {
						_this.props.history.push("/inventory/stores");
					}, 2000);
				},
				function error(res) {
					if (res.message === 'Request failed with status code 701') { _this.errorAlert("Duplicate inventory name"); }
					else {
						_this.errorAlert("Something went wrong!")
					}
				}
			)
		}
	}
	handleCheckedChange(e) {
		var tempInventory = this.state.inventory;
		tempInventory[e.target.name] = e.target.checked;
		this.setState({ inventory: tempInventory, });
	}
	handleShowResponse() { this.setState({ showResponseModal: true }); }
	handleDropDownChange(selectOption, type) {
		if (selectOption !== undefined) {
			if (type === "invType") {
				if (selectOption.categories.trim() !== "") {
					this.setState({
						categoryList: selectOption.categories.split(",").map(prop => {
							return {
								value: prop,
								label: prop
							}
						})
					})
				} else {
					this.setState({ categoryList: null })
				}
			}
			var tempInventory = this.state.inventory;
			tempInventory[type] = selectOption ? selectOption : null;
			if (!this.state.categoryList) tempInventory.category = "";
			this.setState({ inventory: tempInventory });
		}
	}
	handleDropDownChangeStatus(selectOption, type) {
		var newInventory = this.state.inventory;
		newInventory[type] = selectOption ? selectOption.value : null;
		this.setState({ inventory: newInventory });
	}
	handleDateChange(name, date) {
		var inventory = this.state.inventory;
		inventory[name] = date._d;
		this.setState({ inventory });
	}
	handleCheckbox(e) {
		var newdata = this.state.inventory;
		newdata[e.target.name] = e.target.checked;
		this.setState({ inventory: newdata });
	}

	handleInputChange(e) {
		var tempInventory = this.state.inventory;
		tempInventory[e.target.name] = e.target.value;
		this.setState({ inventory: tempInventory, [e.target.name + 'Valid']: true, formError: "" });
	}
	handleDropDownChangeHsn(e, param) {
		var newObj = this.state.inventory;
		if (e === undefined) {
			newObj.hsn = e !== undefined ? e.target.value : null;
			this.setState({ product: newObj });
		}
		else {
			if (!e.target) {
				newObj[param] = e;
				this.setState({ pricing: newObj, formError: null });
				e.id === "" || null ? this.setState({ assetsDetailsValid: false }) : this.setState({ assetsDetailsValid: true })
				if (param === "hsn") {

				}
			} else {
				if (e.target.name.indexOf("custom_") !== -1) {
					var key = parseInt(e.target.name.split("_")[1], 10);
					newObj.custom[key] = e.target.value;
					this.setState({ inventory: newObj });
				} else if (e.target.name.indexOf("radio_") !== -1) {
					newObj[e.target.name.split("_")[1]] = e.target.value;
					this.setState({ inventory: newObj });
				} else {
					if (e.target.type === "number") newObj[e.target.name] = parseFloat(e.target.value);
					else newObj[e.target.name] = e.target.value;
					this.setState({ inventory: newObj });
				}
			}
		}
	}
	handleImageChange(img) {
		var inventory = this.state.inventory;
		inventory.photo = img;
		this.setState({ inventory });
	}
	handleMultipleDocumentChange(newDocument) {
		var inventory = this.state.inventory;
		inventory.documents = newDocument.documents;
		this.setState({ inventory });
	}
	handleDeleteDocument(key) {
		let inventory = this.state.inventory;
		inventory.documents.slice();
		inventory.documents.splice(key, 1);
		this.setState({ inventory });
	}
	renderDropDown(cellInfo) {
		let options = [];
		switch (cellInfo.column.id) {
			case "vendor": options = this.state.vendorList; break;
			default: options = []
		}
		return (
			<FormGroup>
				<Select
					clearable={false}
					placeholder="Select"
					name={cellInfo.column.id}
					value={this.state.inventory.vendors[cellInfo.index][cellInfo.column.id] ? this.state.inventory.vendors[cellInfo.index][cellInfo.column.id].id : null}
					options={options}
					onChange={(selectOption) => {
						var tempInventory = this.state.inventory;
						tempInventory.vendors[cellInfo.index][cellInfo.column.id] = selectOption;
						this.setState({ tempInventory });
					}}
				/>
			</FormGroup>
		);
	}
	renderNumber(cellInfo) {
		return (
			<FormGroup>
				<FormControl
					type="number"
					step="1"
					minLength="0"
					min="0"
					pattern="^\d+(?:\.\d{1,2})?$"

					value={this.state.inventory.vendors[cellInfo.index] ? this.state.inventory.vendors[cellInfo.index][cellInfo.column.id] : 0}
					onChange={(e) => {
						var tempInventory = this.state.inventory;
						tempInventory.vendors[cellInfo.index][cellInfo.column.id] = e.target.value;
						this.setState({ tempInventory });
					}}
				/>
			</FormGroup>
		)
	}
	renderStockNumber(cellInfo) {
		return (
			<FormGroup>
				<FormControl
					type="number"
					step="1"
					minLength="0"
					min="0"
					pattern="^\d+(?:\.\d{1,2})?$"

					value={this.state.inventory.stock[cellInfo.index] ? this.state.inventory.stock[cellInfo.index][cellInfo.column.id] : 0}
					onChange={(e) => {
						var tempInventory = this.state.inventory;
						tempInventory.stock[cellInfo.index][cellInfo.column.id] = e.target.value;
						this.setState({ tempInventory });
					}}
				/>
			</FormGroup>
		)
	}
	renderStockStandarQty(cellInfo) {
		return (
			<FormGroup>
				<FormControl
					type="number"
					step="1"
					minLength="0"
					min="0"
					pattern="^\d+(?:\.\d{1,2})?$"
					value={this.state.inventory.stock[cellInfo.index] ? this.state.inventory.stock[cellInfo.index][cellInfo.column.id] : 0}
					onChange={(e) => {
						var tempInventory = this.state.inventory;
						tempInventory.stock[cellInfo.index][cellInfo.column.id] = e.target.value;
						this.setState({ tempInventory });
					}}
					className={this.state.inventory.stock.standardQty < this.state.inventory.stock.minStockQty ? "value-danger" : "value-success"}
				/>
			</FormGroup>
		)
	}
	renderEditableStockName(cellInfo) {
		return (
			<div>
				<Col xs={2}>
					<FormGroup>
						<input
							type="checkbox"
							checked={this.state.inventory.stock[cellInfo.index].isSelected}
							onChange={(e) => {
								let tempObj = this.state.inventory.stock;
								tempObj[cellInfo.index].isSelected = e.target.checked;
								this.setState({ tempObj });
							}}
						/>
					</FormGroup>
				</Col>
				<Col xs={10}>
					<FormGroup>
						<ControlLabel> {this.state.inventory.stock[cellInfo.index].name}</ControlLabel>
					</FormGroup>
				</Col>
			</div>
		);
	}


	render() {
		var adminCondition = (cookie.load("role"));
		const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
		const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
		const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
		const list = (<Tooltip id="list_tooltip">Store list</Tooltip>);
		const add = (<Tooltip id="list_tooltip">Add new vendor</Tooltip>);

		var srNoCol = { Header: "Sr", id: "slno", Cell: d => { return <div>{d.index + 1}</div> }, width: 50 };
		var locationCol = { Header: "Location", accessor: "name", Cell: this.renderEditableStockName, };
		var createByCol = { Header: "Last Update By", accessor: "lastUpdatedBy" };
		var updatedDateCol = { Header: "Date", accessor: "date" };

		var minStockQtyCol = { Header: "Min Stock Qty", accessor: "minStockQty", Cell: this.renderStockNumber };
		var actualQtyCol = { Header: "Actual Qty", accessor: "actualQty", Cell: this.renderStockNumber };
		var standardQtyCol = { Header: "Qty In Stock", accessor: "standardQty", Cell: this.renderStockStandarQty };

		let className;
		{ this.state.inventory.code === "New" ? className = "fa fa-plus" : className = "fa fa-eye" }
		let form = (
			<Col xs={12}>
				<div>
					{/* <UploadComponent
								picture
								type="stores"
								photo={this.state.inventory.photo}
								details={this.state.inventory}
								handleImageChange={this.handleImageChange}
							/> */}
				</div>
				{/* <br />
						<div id="qrcode1">
							<QRcode
								value={
									"inventory Code: " + this.state.inventory.code
								}
								size={100}
								level="H"
							/>
						</div> */}
				<Col xs={12}>
					<Row>
						<Col xs={12} hidden={!this.state.inventory.code}>
							<FormGroup>
								{this.state.inventory.code !== "New" ?
									<ControlLabel>Code: {this.state.inventory ? this.state.inventory.number : null}</ControlLabel>
									: null
								}
							</FormGroup>
						</Col>
						<Col xs={12} sm={4} md={3} lg={3}>
							<FormGroup>
								<ControlLabel>Inventory Type<span className="star">*</span></ControlLabel>
								<Select
									clearable={false}
									placeholder="Select type"
									name="invType"
									value={this.state.inventory.invType.id}
									options={this.state.inventorySettingList}
									onChange={(selectOption) => this.handleDropDownChange(selectOption, "invType")}
									style={{ color: this.state.invTypeValid || this.state.invTypeValid === null ? "" : errorColor, borderColor: this.state.invTypeValid || this.state.invTypeValid === null ? "" : errorColor }}
								/>
							</FormGroup>
						</Col>
						{
							(this.state.categoryList)
								? <Col xs={12} sm={4} md={2} lg={2}>
									<FormGroup>
										<ControlLabel>Category </ControlLabel>
										<Select
											clearable={false}
											placeholder="Select category"
											name="category"
											value={this.state.inventory.category}
											options={this.state.categoryList}
											onChange={(selectOption) => {
												var tempInventory = this.state.inventory;
												tempInventory.category = selectOption ? selectOption.value : null;
												this.setState({ tempInventory });
											}}
										/>
									</FormGroup>
								</Col>
								: null
						}
						<Col xs={12} sm={4} md={2} lg={2}>
							<FormGroup>
								<ControlLabel>Status <span className="star">*</span> </ControlLabel>
								<Select
									clearable={false}
									placeholder="Select status"
									name="status"
									value={this.state.inventory.status}
									options={selectOptionsMaintenaceStatus}
									onChange={(selectOption) => this.handleDropDownChangeStatus(selectOption, "status")}
									style={{ color: this.state.statusValid || this.state.statusValid === null ? "" : errorColor, borderColor: this.state.statusValid || this.state.statusValid === null ? "" : errorColor }}
								/>
							</FormGroup>
						</Col>
						<Col xs={12} sm={4} md={2} lg={2}>
							<FormGroup>
								<ControlLabel>Owner <span className="star">*</span> </ControlLabel>
								<Select
									clearable={false}
									placeholder="Select owner"
									name="owner"
									value={this.state.inventory.owner ? this.state.inventory.owner.id : null}
									options={this.state.userList}
									onChange={(selectOption) => this.handleDropDownChange(selectOption, "owner")}
									style={{
										color: this.state.ownerValid || this.state.ownerValid === null ? "" : errorColor,
										borderColor: this.state.ownerValid || this.state.ownerValid === null ? "" : errorColor
									}}
								/>
							</FormGroup>
						</Col>
						<Col xs={12} sm={4} md={this.state.categoryList ? 3 : 4} lg={3}>
							<FormGroup>
								<ControlLabel>HSN Code <span className="star">*</span> </ControlLabel>
								<div>
									<span className="input-group">
										{/* <span className="input-group-addon">
										<a role="button" className={className} onClick={() => this.setState({ showHsnModal: true })} />
									</span> */}
										<Select
											clearable={false}
											placeholder="Select hsn code"
											name="hsn"
											options={this.state.hsnList}
											value={this.state.inventory.hsn ? this.state.inventory.hsn.id : null}
											onChange={(selectedOption) => this.handleDropDownChangeHsn(selectedOption, 'hsn')}
											style={{ color: this.state.hsnValid || this.state.hsnValid === null ? "" : errorColor, borderColor: this.state.hsnValid || this.state.hsnValid === null ? "" : errorColor }}
										/>
										<span className="input-group-addon"> {this.state.inventory.hsn ? this.state.inventory.hsn.gst : 0.0} %</span>
									</span>
								</div>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs={12} sm={4} md={3} lg={3}>
							<FormGroup>
								<ControlLabel>Name <span className="star">*</span> </ControlLabel>
								<FormControl
									placeholder="Enter name"
									type="text"
									name="name"
									value={this.state.inventory.name}
									onChange={this.handleInputChange}
									className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
								/>
							</FormGroup>
						</Col>
						<Col xs={12} sm={4} md={2} lg={2}>
							<FormGroup>
								<ControlLabel>Model </ControlLabel>
								<FormControl
									placeholder="Enter model"
									type="text"
									name="model"
									value={this.state.inventory.model}
									onChange={this.handleInputChange}
								/>
							</FormGroup>
						</Col>
						<Col xs={12} sm={4} md={2} lg={2}>
							<FormGroup>
								<ControlLabel>Serial number  </ControlLabel>
								<FormControl
									placeholder="Enter serial number"
									type="text"
									name="srno"
									value={this.state.inventory.srno}
									onChange={this.handleInputChange}
								//	className={this.state.srnoValid || this.state.srnoValid === null ? "" : "error"}
								/>
							</FormGroup>
						</Col>
						<Col xs={12} sm={4} md={2} lg={2}>
							<FormGroup>
								<ControlLabel>Unit </ControlLabel>
								<Select
									clearable={false}
									placeholder="Select unit"
									name="unit"
									value={this.state.inventory.unit}
									options={unitList}
									onChange={(selectOption) => {
										var newInventory = this.state.inventory;
										newInventory.unit = selectOption ? selectOption.value : null;
										this.setState({ inventory: newInventory });
									}}
								/>
							</FormGroup>
						</Col>
						{
							this.state.inventory.invType && this.state.inventory.invType.isUnique
								?
								<Col xs={12} sm={4} md={3} lg={3}>
									<FormGroup>
										<ControlLabel>Value</ControlLabel>
										<FormControl
											placeholder="Enter value"
											type="number"
											min={0}
											name="value"
											value={this.state.inventory.value}
											onChange={this.handleInputChange}
											className={this.state.valueValid || this.state.valueValid === null ? "" : "error"}
										/>
									</FormGroup>
								</Col>
								: null
						}
						<Col xs={12} sm={4} md={3} lg={3}>
							<FormGroup>
								<ControlLabel>Standard Rate <span className="star">*</span></ControlLabel>
								<div>
									<span className="input-group">
										<span className="input-group-addon">₹</span>
										<FormControl
											placeholder="0"
											name="rate"
											min="0"
											type="number"
											step="0.05" pattern="^\d+(?:\.\d{1,2})?$"
											value={this.state.inventory.rate ? this.state.inventory.rate : ""}
											onChange={this.handleInputChange}
											className={this.state.rateValid || this.state.rateValid === null ? "" : "error"}
										/>
									</span>
								</div>
							</FormGroup>
						</Col>
					</Row>
					<div>
						<Row>
							{
								(this.state.inventory.invType.isManufacturing === true) ?
									(
										<Col xs={12} sm={4} md={3} lg={2}>
											<FormGroup>
												<ControlLabel>Manufacturing Date</ControlLabel>
												<Datetime
													timeFormat={false}
													closeOnSelect={true}
													dateFormat="DD-MMM-YYYY"
													name="manufacturingDate"
													inputProps={{ placeholder: "Select manufacturing date" }}
													value={this.state.inventory.manufacturingDate}
													onChange={(date) => this.handleDateChange("manufacturingDate", date)}
													style={{ color: this.state.manufacturingDateValid || this.state.manufacturingDateValid === null ? "" : errorColor, borderColor: this.state.manufacturingDateValid || this.state.manufacturingDateValid === null ? "" : errorColor }}
												/>
											</FormGroup>
										</Col>
									) : null
							}
							{
								(this.state.inventory.invType.isPurchase === true) ?
									(
										<Col xs={12} sm={4} md={3} lg={2}>
											<FormGroup>
												<ControlLabel>Purchase Date</ControlLabel>
												<Datetime
													timeFormat={false}
													closeOnSelect={true}
													dateFormat="DD-MMM-YYYY"
													name="purchaseDate"
													inputProps={{ placeholder: "Select purchase date" }}
													value={this.state.inventory.purchaseDate}
													onChange={(date) => this.handleDateChange("purchaseDate", date)}
													style={{ color: this.state.purchaseDateValid || this.state.purchaseDateValid === null ? "" : errorColor, borderColor: this.state.purchaseDateValid || this.state.purchaseDateValid === null ? "" : errorColor }}
												/>
											</FormGroup>
										</Col>
									) : null
							}
							{
								(this.state.inventory.invType.isCalibration === true) ?
									(
										<Col xs={12} sm={4} md={3} lg={2}>
											<FormGroup>
												<ControlLabel>Last Calibration Date</ControlLabel>
												<Datetime
													timeFormat={false}
													closeOnSelect={true}
													dateFormat="DD-MMM-YYYY"
													name="lastCalibrationDate"
													inputProps={{ placeholder: "Select last calibration date" }}
													value={this.state.inventory.lastCalibrationDate}
													onChange={(date) => this.handleDateChange("lastCalibrationDate", date)}
													style={{ color: this.state.lastCalibrationDateValid || this.state.lastCalibrationDateValid === null ? "" : errorColor, borderColor: this.state.lastCalibrationDateValid || this.state.lastCalibrationDateValid === null ? "" : errorColor }}
												/>
											</FormGroup>
										</Col>
									) : null
							}
							{
								(this.state.inventory.invType.isCalibration === true) ?
									(
										<Col xs={12} sm={4} md={3} lg={2}>
											<FormGroup>
												<ControlLabel>Next Calibration Date</ControlLabel>
												<Datetime
													timeFormat={false}
													closeOnSelect={true}
													dateFormat="DD-MMM-YYYY"
													name="nextCalibrationDate"
													inputProps={{ placeholder: "Select next calibration date" }}
													value={this.state.inventory.nextCalibrationDate}
													onChange={(date) => this.handleDateChange("nextCalibrationDate", date)}
													style={{ color: this.state.nextCalibrationDateValid || this.state.nextCalibrationDateValid === null ? "" : errorColor, borderColor: this.state.nextCalibrationDateValid || this.state.nextCalibrationDateValid === null ? "" : errorColor }}
												/>
											</FormGroup>
										</Col>
									) : null
							}
							{
								(this.state.inventory.invType.isService === true) ?
									(
										<Col xs={12} sm={4} md={3} lg={2}>
											<FormGroup>
												<ControlLabel>Last Service Date</ControlLabel>
												<Datetime
													timeFormat={false}
													closeOnSelect={true}
													dateFormat="DD-MMM-YYYY"
													name="lastServiceDate"
													inputProps={{ placeholder: "Select last service date" }}
													value={this.state.inventory.lastServiceDate}
													onChange={(date) => this.handleDateChange("lastServiceDate", date)}
													style={{ color: this.state.lastServiceDateValid || this.state.lastServiceDateValid === null ? "" : errorColor, borderColor: this.state.lastServiceDateValid || this.state.lastServiceDateValid === null ? "" : errorColor }}
												/>
											</FormGroup>
										</Col>
									) : null
							}
							{
								(this.state.inventory.invType.isService === true) ?
									(
										<Col xs={12} sm={4} md={3} lg={2}>
											<FormGroup>
												<ControlLabel>Next Service Date</ControlLabel>
												<Datetime
													timeFormat={false}
													closeOnSelect={true}
													dateFormat="DD-MMM-YYYY"
													name="nextServiceDate"
													inputProps={{ placeholder: "Select next service date" }}
													value={this.state.inventory.nextServiceDate}
													onChange={(date) => this.handleDateChange("nextServiceDate", date)}
													style={{ color: this.state.nextServiceDateValid || this.state.nextServiceDateValid === null ? "" : errorColor, borderColor: this.state.nextServiceDateValid || this.state.nextServiceDateValid === null ? "" : errorColor }}
												/>
											</FormGroup>
										</Col>
									) : null
							}
							{
								(this.state.inventory.invType.isMaintenance === true) ?
									(<div>
										<Col xs={12} sm={4} md={3} lg={2}>
											<FormGroup>
												<ControlLabel>Next Maintenance Date</ControlLabel>
												<Datetime
													timeFormat={false}
													closeOnSelect={true}
													dateFormat="DD-MMM-YYYY"
													name="nextMaintenanceDate"
													inputProps={{ placeholder: "Select next maintenance date" }}
													value={this.state.inventory.nextMaintenanceDate}
													onChange={(date) => this.handleDateChange("nextMaintenanceDate", date)}
												/>
											</FormGroup>
										</Col>
										<Col xs={12} sm={4} md={3} lg={2}>
											<FormGroup>
												<ControlLabel>Last Maintenance Date</ControlLabel>
												<Datetime
													timeFormat={false}
													closeOnSelect={true}
													dateFormat="DD-MMM-YYYY"
													name="lastMaintenanceDate"
													inputProps={{ placeholder: "Select last maintenance date" }}
													value={this.state.inventory.lastMaintenanceDate}
													onChange={(date) => this.handleDateChange("lastMaintenanceDate", date)}
												/>
											</FormGroup>
										</Col>
									</div>
									) : null
							}

							{
								(this.state.inventory.invType.isWarranty === true) ?
									(
										<Col xs={12} sm={4} md={3} lg={2}>
											<FormGroup>
												<ControlLabel>End of Warranty Date</ControlLabel>
												<Datetime
													timeFormat={false}
													closeOnSelect={true}
													dateFormat="DD-MMM-YYYY"
													name="endOfWarrantyDate"
													inputProps={{ placeholder: "Select warranty date" }}
													value={this.state.inventory.endOfWarrantyDate}
													onChange={(date) => this.handleDateChange("endOfWarrantyDate", date)}
													style={{ color: this.state.endOfWarrantyDateValid || this.state.endOfWarrantyDateValid === null ? "" : errorColor, borderColor: this.state.endOfWarrantyDateValid || this.state.endOfWarrantyDateValid === null ? "" : errorColor }}
												/>
											</FormGroup>
										</Col>
									) : null
							}
							{
								(this.state.inventory.invType.isInsurance === true) ?
									(
										<Col xs={12} sm={4} md={3} lg={2}>
											<FormGroup>
												<ControlLabel>End of Insurance Date</ControlLabel>
												<Datetime
													timeFormat={false}
													closeOnSelect={true}
													dateFormat="DD-MMM-YYYY"
													name="endOfInsuranceDate"
													inputProps={{ placeholder: "Select insurance date" }}
													value={this.state.inventory.endOfInsuranceDate}
													onChange={(date) => this.handleDateChange("endOfInsuranceDate", date)}
													style={{ color: this.state.endOfInsuranceDateValid || this.state.endOfInsuranceDateValid === null ? "" : errorColor, borderColor: this.state.endOfInsuranceDateValid || this.state.endOfInsuranceDateValid === null ? "" : errorColor }}
												/>
											</FormGroup>
										</Col>
									) : null
							}
						</Row>
					</div>
				</Col>

				<Col xs={12}>
					<Tab.Container id="transporter-details" defaultActiveKey="vendor">
						<div className="clearfix">
							<Nav bsStyle="tabs">
								<NavItem eventKey="vendor"><i className="fa fa-user" /> Vendor</NavItem>
								{this.props.match.params.itemcode !== "new" ?
									(<NavItem eventKey="stock"><i className="fa fa-suitcase" /> Stock</NavItem>
									) : null
								}

								{this.props.match.params.itemcode !== "new" ?
									(<NavItem eventKey="documents" ><i className="fa fa-file" /> Documents</NavItem>
									) : null
								}
							</Nav>
							<Row>
								<Col xs={12}>
									<Tab.Content animation>
										<Tab.Pane eventKey="vendor">
											{
												this.state.inventory.vendors.length
													? (
														<ReactTable
															data={this.state.inventory.vendors}
															columns={[
																{ Header: "Sr", id: "slno", Cell: d => { return <div>{d.index + 1}</div> }, width: 50 },
																{ Header: "Vendor", accessor: "vendor", Cell: this.renderDropDown },
																{ Header: "List Price (₹)", accessor: "listPrice", Cell: this.renderNumber },
																{ Header: "Discount (%)", accessor: "discount", Cell: this.renderNumber },
																{ Header: "Lead Time (days)", accessor: "leadTime", Cell: this.renderNumber },
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
															minRows={0}
															sortable={false}
															className="-striped -highlight"
															showPaginationTop={false}
															showPaginationBottom={false}
														/>
													) : (
														<Col xs={12}>No vendor selected.</Col>
													)
											}
											<OverlayTrigger placement="top" overlay={add}>
												<Button bsStyle="primary" fill icon
													onClick={() => {
														let tempInventory = this.state.inventory;
														tempInventory.vendors.push({
															vendor: null,
															listPrice: 0,
															discount: 0,
															leadTime: 0
														});
														this.setState({ tempInventory });
													}}
												><span className="fa fa-plus"></span></Button>
											</OverlayTrigger>
										</Tab.Pane>
										<Tab.Pane eventKey="stock">
											{
												this.state.inventory.stock.length
													? (
														<ReactTable
															data={this.state.inventory.stock}
															columns={
																(adminCondition === "admin") ?
																	(
																		[srNoCol, locationCol, minStockQtyCol, standardQtyCol, actualQtyCol]
																	) : (
																		[srNoCol, locationCol, minStockQtyCol, standardQtyCol]
																	)
															}
															minRows={0}
															sortable={false}
															className="-striped -highlight"
															showPaginationTop={false}
															showPaginationBottom={false}
														/>
													) : (
														<div>Please enter stock details.</div>
													)
											}
										</Tab.Pane>
										<Tab.Pane eventKey="documents">
											<Row>
												<UploadComponent
													document
													type="stores"
													documents={this.state.inventory.documents}
													details={this.state.inventory}
													dropText="Drop files or click here"
													handleMultipleDocumentChange={this.handleMultipleDocumentChange}
													handleDeleteDocument={this.handleDeleteDocument}
												/>
											</Row>
										</Tab.Pane>
									</Tab.Content>
								</Col>
							</Row>
						</div>
					</Tab.Container>
				</Col>
			</Col>
		);
		let actions = (
			<Col xs={12}>
				<center><h5 className="text-danger">{this.state.formError}</h5></center>
				<OverlayTrigger placement="top" overlay={back}>
					<Button bsStyle="warning" fill icon onClick={() => this.props.history.push('/inventory/stores')} ><span className="fa fa-arrow-left"></span></Button>
				</OverlayTrigger>
				<OverlayTrigger placement="top" overlay={list}>
					<Button bsStyle="primary" fill icon onClick={() => this.props.history.push('/inventory/stores')}><span className="fa fa-list"></span></Button>
				</OverlayTrigger>
				<OverlayTrigger placement="top" overlay={save}>
					<Button bsStyle="success" fill icon pullRight onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
				</OverlayTrigger>


			</Col>
		)
		let hsnModal = (
			<Modal
				dialogClassName="large-modal card"
				show={this.state.showHsnModal}
				onHide={() => {
					this.setState({ showHsnModal: false });
				}}>
				<Modal.Header class="header1" closeButton>
					<Modal.Title>Add/Update HSN Code</Modal.Title>
				</Modal.Header>
				<Modal.Body className="cardModal">
					<HsnListComponent {...this.props}
						className={className}
						id={this.state.inventory ? this.state.inventory.id : null} />
				</Modal.Body>
			</Modal>
		)
		return (
			<Row className="card-content">
				{this.state.alert}
				{hsnModal}
				<div className="card-form ">{form}</div>
				<div className="card-footer">{actions}</div>
			</Row>
		);
	}
}

export default AddEditStoresComponent;