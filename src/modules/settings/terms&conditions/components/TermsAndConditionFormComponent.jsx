import React, { Component } from "react";
import cookie from 'react-cookies';
import { Grid, Row, Col, OverlayTrigger, Tooltip, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactTable from "react-table";

import Button from "components/CustomButton/CustomButton.jsx";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";

import { createTerms, updateTerms } from "../server/TermsServerComm";

class TermsAndConditionFormComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: props.settings,
			termList: props.termList ? props.termList : {
				code: null,
				terms: [],
			},
			users: [],
			alert: null,


		};
		this.renderEditableTerms = this.renderEditableTerms.bind(this);
		this.renderIsSelectedCheckBox = this.renderIsSelectedCheckBox.bind(this);
		this.save = this.save.bind(this);
		this.delete = this.delete.bind(this);
		this.deleteConfirm = this.deleteConfirm.bind(this);
		this.successAlert = this.successAlert.bind(this);
		this.errorAlert = this.errorAlert.bind(this);
	}
	componentWillMount() {
		var _this = this;


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
					You will not be able to recover this terms and condition!
        </SweetAlert>
			)
		});
	}
	deleteConfirm(id) {
		let tempObj = this.state.termList;
		tempObj.terms.splice(id, 1);
		this.setState({ tempObj });
		this.successAlert("Terms and condition deleted successfully!")

	}
	save() {
		let _this = this;
		let tempData = JSON.parse(JSON.stringify(this.state.termList))
		if (tempData.terms.length) {
			(tempData.code !== null) ? (
				updateTerms(tempData,
					function success(res) {
						_this.successAlert("Terms & condition  saved successfully!");
						setTimeout(() => {
							_this.props.handleCloseTermsModal();
						}, 2000);
					},
					function error(res) {
						_this.errorAlert("Something went wrong!")

					}

				)
			) : (

					createTerms(tempData,
						function success(res) {
							_this.successAlert("Terms & condition added successfully!");
							setTimeout(() => {
								_this.props.handleCloseTermsModal();
							}, 2000);

						},
						function error(res) {
							_this.errorAlert("Something went wrong!")

						}
					)
				)
		}
		else {
			_this.setState({ formError: "Please Enter Terms and conditions. " })
		}
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
	renderEditableTerms(row) {
		return (
			<FormGroup>
				<FormControl
					type="text"
					placeholder="Enter term and condition"
					value={this.state.termList.terms[row.index] ? this.state.termList.terms[row.index].term : 0}
					onChange={(e) => {
						var tempData = this.state.termList;
						tempData.terms[row.index].term = e.target.value;
						this.setState({ tempData });
					}}
				/>
			</FormGroup>
		)
	}
	renderIsSelectedCheckBox(row) {
		return (
			<div>
				<Col xs={1}>
					<FormGroup>
						<Checkbox
							inline
							number={"isSelectd" + row.index}
							name={"isSelectd"}
							checked={this.state.termList.terms[row.index].isSelected}
							onChange={(e) => {
								let tempObj = this.state.termList.terms;
								tempObj[row.index].isSelected = e.target.checked;
								this.setState({ tempObj });
							}}
						/>
					</FormGroup>
				</Col>
			</div>
		);
	}

	render() {
		const save = <Tooltip id="save_tooltip">Save</Tooltip>;
		const add = <Tooltip id="save_tooltip">Add</Tooltip>;
		const trash = <Tooltip id="save_tooltip">Delete</Tooltip>;
		let form = (
			<Row>
				{
					this.state.termList.terms.length
						? (
							<ReactTable
								data={this.state.termList.terms}
								columns={[
									{ Header: "Sr", id: "slno", Cell: d => { return <div>{d.index + 1}</div> }, width: 50 },
									{ Header: "", accessor: "isSelected", width: 50, Cell: this.renderIsSelectedCheckBox },
									{ Header: "Terms & Condition", accessor: "terms", sortable: false, Cell: this.renderEditableTerms },
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
							<Col xs={12}>No terms and condition selected.</Col>
						)
				}
				<OverlayTrigger placement="top" overlay={add}>
					<Button bsStyle="primary" fill icon
						onClick={() => {
							let tempData = this.state.termList;
							tempData.terms.push({
								term: "",
								isSelected: false,
							});
							this.setState({ tempData });
						}}
					><span className="fa fa-plus"></span></Button>
				</OverlayTrigger>
				<Col xs={12} sm={12} md={12} lg={12}>
					<div className="section-header" style={{ marginBottom: "10px" }} />
					<OverlayTrigger placement="top" overlay={save}>
						<Button bsStyle="success" fill icon pullRight style={{ marginLeft: "15px" }} onClick={this.save}>
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

export default TermsAndConditionFormComponent;