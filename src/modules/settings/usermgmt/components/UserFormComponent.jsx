import React, { Component } from "react";
import { Grid, Row, Col, OverlayTrigger, Tooltip, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Select from "components/CustomSelect/CustomSelect.jsx";
import SweetAlert from "react-bootstrap-sweetalert";
import cookie from "react-cookies";
import axios from "axios";
import UploadComponent from 'components/Upload/UploadComponent.jsx';

import Button from "components/CustomButton/CustomButton.jsx";

import { selectOptionsUserRoles, backendURL } from "variables/appVariables.jsx";
import { errorColor } from 'variables/Variables.jsx';

import { createUser, deleteUser, getUserList } from "modules/settings/usermgmt/server/UserServerComm.jsx";



class UserFormComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: props.settings,
			user: props.user ? props.user : {
				code: "New",
				name: "",
				email: "",
				photo: "",
				phone: "",
				supervisorName: null,
				role: ""
			},
			users: [],
			alert: null,
			nameError: false,
			emailError: false,
			roleError: false,
			supervisorNameError: false,
			nameValid: null,
			emailValid: null,
			roleValid: null,
			supervisorNameValid: null,

			userForm: {
				mandatory: [],
				custom: []
			}
		};
		this.handleDropDownChange = this.handleDropDownChange.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.create = this.create.bind(this);
		this.save = this.save.bind(this);
		this.delete = this.delete.bind(this);
		this.deleteConfirm = this.deleteConfirm.bind(this);
		this.successAlert = this.successAlert.bind(this);
		this.errorAlert = this.errorAlert.bind(this);
		this.validationCheck = this.validationCheck.bind(this);
		this.handleImageChange = this.handleImageChange.bind(this);
	}
	componentWillMount() {
		var _this = this;

		getUserList("view=user",
			function success(data) {
				_this.setState({
					users: data.rows.filter(x => { return x.email !== _this.state.user.email })
				})
			},
		)
	}
	handleInputChange(e) {
		var newUser = this.state.user;
		newUser[e.target.name] = e.target.value;
		this.setState({ user: newUser });
	}

	handleDropDownChange(name, selectedOption) {
		var newData = this.state.user;
		newData[name] = selectedOption ? selectedOption.value : null;
		this.setState({ user: newData });
	}

	handleImageChange(img) {
		var user = this.state.user;
		user.photo = img;
		this.setState({ user });
	}

	validationCheck() {
		this.state.user.name === ""
			? this.setState({ nameError: "Enter User Name", nameValid: false })
			: this.setState({ nameError: "", nameValid: true });
		this.state.user.supervisorName === null
			? this.setState({ supervisorNameError: "Enetr Supervisor Name", supervisorNameValid: false })
			: this.setState({ supervisorNameError: "", supervisorNameValid: true });
		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		re.test(this.state.user.email) === false ?
			this.setState({ emailError: "EMAIL_IS_REQUIRED", emailValid: false })
			: this.setState({ emailError: "", emailValid: true });
		this.state.user.role === ""
			? this.setState({ roleError: "Enter User Role", roleValid: false })
			: this.setState({ roleError: "", roleValid: true });
		setTimeout(this.save, 10);
	}

	create() {
		let _this = this;
		createUser(
			this.state.user,
			function success(data) {
				_this.successAlert("User added successfully!");
				setTimeout(() => {
					_this.props.handleCloseModal(data);
				}, 2000);
			},
			function error(res) {
				if (res.message === 'Request failed with status code 701') {
					_this.errorAlert("Duplicate User name");
				}
				else {
					_this.errorAlert("Something went wrong!")
				}
			}
		);
	}

	save() {
		var _this = this;
		var url = backendURL + "users/";
		_this.state.nameValid && _this.state.roleValid ?
			!_this.state.user.id ?
				this.create() :
				axios.put(url + _this.state.user.id, _this.state.user, { headers: { Authorization: "Bearer " + cookie.load("token") } })
					.then(function (res) {
						console.log(res.data);
						if (res.status === 200) {
							_this.successAlert("User saved successfully!");
							setTimeout(() => {
								_this.props.handleCloseModal(res.data);
							}, 2000);
						}
						function error(res) {
							if (res.message === 'Request failed with status code 701') { _this.errorAlert("Duplicate user name"); }
							else {
								_this.errorAlert("Something went wrong!")
							}
							_this.props.handleCloseModal(res.data);
						}

					})
			:
			_this.setState({ formError: "Please enter required fields" });
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
					You will not be able to recover this user!
        </SweetAlert>
			)
		});
	}

	deleteConfirm() {
		let _this = this;
		deleteUser(
			_this.state.user,
			function success() {
				_this.props.history.push("/module/xyz");
			},
			function error(code) {
				_this.errorAlert("Error in deleting User.");
			}
		);
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
				/>
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
				/>
			)
		});
	}
	render() {
		const save = <Tooltip id="save_tooltip">Save</Tooltip>;

		let form = (
			<Row>
				<Col xs={12} sm={12} md={12} lg={12}>
					<ControlLabel>Profile Picture</ControlLabel>
					<UploadComponent
						picture
						type="users"
						photo={this.state.user.photo}
						details={this.state.user}
						handleImageChange={this.handleImageChange}
					/>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12}>
					<FormGroup>
						<ControlLabel>Name<span className="star">*</span></ControlLabel>
						<FormControl
							name="name"
							type="text"
							placeholder="Enter name"
							value={this.state.user.name}
							onChange={this.handleInputChange}
							className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
						/>
					</FormGroup>
				</Col>
				{this.state.user.code !== "New" ?
					<Col md={12} lg={12} sm={12} xs={12}>
						{this.state.user.code === "New" ?
							<FormGroup>
								<ControlLabel> Employee code</ControlLabel>
								<FormControl
									disabled
									name="username"
									type="text"
									placeholder="Enter User name/ employee id"
									value={this.state.user.username}
									onChange={this.handleInputChange}
								/>
							</FormGroup>
							:
							<FormGroup>
								<ControlLabel> Employee ID:{this.state.user.username}</ControlLabel>
							</FormGroup>
						}
					</Col>
					: null
				}
				<Col md={12} lg={12} sm={12} xs={12}>
					<FormGroup>
						<ControlLabel>Email<span className="star">*</span></ControlLabel>
						<FormControl
							name="email"
							type="email"
							placeholder="Enter email"
							value={this.state.user.email}
							onChange={this.handleInputChange}
							className={this.state.emailValid || this.state.emailValid === null ? "" : "error"}
						/>
					</FormGroup>

				</Col>
				<Col md={12} lg={12} sm={12} xs={12}>
					<FormGroup>
						<ControlLabel>Phone </ControlLabel>
						<div className="input-group">
							<span className="input-group-addon">+91</span>
							<FormControl
								name="phone"
								type="text"
								minLength="10"
								maxLength="10"
								pattern="[0-9]{10}"
								placeholder="Enter phone"
								value={this.state.user.phone}
								onChange={this.handleInputChange}
							/>
						</div>
					</FormGroup>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12}>
					<FormGroup>
						<ControlLabel>Supervisor</ControlLabel>
						<Select
							disabled={cookie.load('email') === this.state.user.email}
							clearable={false}
							placeholder="Select ..."
							name="supervisorName"
							options={this.state.users}
							value={this.state.user.supervisorName}
							onChange={(selectOption) => this.handleDropDownChange("supervisorName", selectOption)}
						/>
					</FormGroup>
				</Col>

				<Col xs={12} sm={12} md={12} lg={12}>
					<FormGroup>
						<ControlLabel>Role<span className="star">*</span></ControlLabel>

						<Select
							disabled={cookie.load('email') === this.state.user.email || this.state.user.role === "driver"}
							clearable={false}
							placeholder="Select role"
							options={selectOptionsUserRoles}
							value={this.state.user.role}
							onChange={selectOption => this.handleDropDownChange("role", selectOption)}
							style={{ color: this.state.roleValid || this.state.roleValid === null ? "" : errorColor, borderColor: this.state.roleValid || this.state.roleValid === null ? "" : errorColor }}
						/>
					</FormGroup>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12}>
					<center>
						<h5 className="text-danger">{this.state.formError}</h5>
					</center>
					<div className="section-header" style={{ marginBottom: "10px" }} />
					<OverlayTrigger placement="top" overlay={save}>
						<Button
							bsStyle="success"
							fill
							icon
							pullRight
							style={{ marginLeft: "15px" }}
							onClick={this.validationCheck}
						>
							<span className="fa fa-save" />
						</Button>
					</OverlayTrigger>
				</Col>
			</Row>
		);
		return (
			<Grid fluid>
				{this.state.alert}
				<div>{form}</div>
			</Grid>
		);
	}
}

export default UserFormComponent;