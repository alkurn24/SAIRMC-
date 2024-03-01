import React, { Component } from 'react'

import { Col, OverlayTrigger, Row, FormGroup, Tooltip, ControlLabel, FormControl } from "react-bootstrap";
import SweetAlert from 'react-bootstrap-sweetalert';
import cookie from 'react-cookies';
import ReactTable from "react-table";

import Select from "components/CustomSelect/CustomSelect.jsx";

import { getEmployeeDetails, changeApplicationStatus } from '../server/HrmsServerComm';
import { defaultPageSize } from "variables/appVariables.jsx"
import { pageSizeCommon } from "variables/appVariables.jsx";
import Moment from 'moment';

export default class EmployeeDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: {},
            events: [],
            isDownload: false,
            isAlert: false,
            alert: { message: "" },
            table: {
                page: 0,
                pageSize: 25,
                pages: 1,
            }
        }
    }
    componentWillMount() {
        getEmployeeDetails(null, this.fetchDataFromServer, this.error)
    }
    fetchDataFromServer = ({ employee, events = [] }) => {
        Array.isArray(employee.leaves) ? employee.leaves = employee.leaves.map(el => ({ ...el, balance: el.balance / 10 })) : null
        this.setState({ employee, events });
    }
    error = err => {
        this.setState({
            isAlert: true,
            alert: {
                onConfirm: () => this.setState({ isAlert: false }),
                cancelBtnBsStyle: "danger",
                confirmBtnText: "OK",
                showCancel: false,
                message: `Something went wrong!`,
                error: true
            }
        })
        console.log("err :", err);
    }
    handleApplication = (event, id) => {
        let msg = "apply again";
        let status = event === "CANCEL" ? "CANCEL" : "PENDING";
        event === "CANCEL" ? msg = "cancel" : null;
        this.setState({
            isAlert: true,
            alert: {
                onConfirm: () => this.submiteApplication(status, id),
                title: "Are you sure",
                cancelBtnBsStyle: "success",
                confirmBtnText: 'Ok',
                cancelBtnText: "Cancel",
                showCancel: true,
                message: `Do you want to ${msg} ?`,
                confirmBtnBsStyle: "danger",
                warning: true
            }
        });
    }
    submiteApplication = (status, id) => {
        this.setState({ isAlert: false })
        changeApplicationStatus({ status, id },
            () => {
                getEmployeeDetails(null, this.fetchDataFromServer, this.error)
                if (status === "CANCEL") {
                    this.successAlert("Application cancelled")
                }
                if (status === "PENDING") {
                    this.successAlert("Applied sucessfully")
                }
                this.setState()
            }, this.error)
    }
    successAlert = message => {
        this.setState({
            isAlert: true,
            alert: {
                onConfirm: () => this.setState({ isAlert: false }),
                title: "Successful",
                cancelBtnBsStyle: "success",
                confirmBtnText: "OK",
                cancelBtnText: "Cancel",
                showCancel: false,
                message,
                confirmBtnBsStyle: "success",
                success: true
            }
        })
    }
    tableCellActions = row => {
        const apply = (<Tooltip id="approve_tooltip">Apply again</Tooltip>);
        const cancel = (<Tooltip id="reject_tooltip">Cancel</Tooltip>);
        return (
            <div className="actions-right">
                {row.original.status === "CANCEL" || row.original.status === "REJECT" ?
                    <OverlayTrigger placement="top" overlay={apply}>
                        <a role="button" className="fa fa-repeat" onClick={() => this.handleApplication("REAPPLY", row.original._id)} >{null}</a>
                    </OverlayTrigger> : null
                }
                {row.original.status === "APPROVE" || row.original.status === "PENDING" ?
                    <OverlayTrigger placement="top" overlay={cancel}>
                        <a role="button" className="fa fa-close " onClick={() => this.handleApplication("CANCEL", row.original._id)}>{null}</a>
                    </OverlayTrigger> : null
                }
            </div>
        )
    }
    render() {
        let leaves = (
            <Col xs={12}>
                <Col xs={12} sm={12} md={12} lg={12}>
                    {
                        this.state.events.length === 0 ? <div>You don't have applied any leaves</div> :
                            <ReactTable
                                columns={[
                                    { Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => <div>{d.index + 1}</div>) },
                                    { Header: "type Of Leave", accessor: "leaveType" },
                                    { Header: "status", accessor: "status" },
                                    { Header: "start Date", accessor: "start" },
                                    { Header: "end Date", accessor: "end" },
                                    { Header: "no Of Days", accessor: "noOfDays" },
                                    { Header: "reason", accessor: "reason" },
                                    { Header: "", accessor: "_id", width: 40, Cell: this.tableCellActions }
                                ]}
                                className="-striped -highlight"
                                manual
                                minRows={0}
                                sortable={false}
                                showPaginationTop={false}
                                showPaginationBottom={true}
                                data={this.state.events}
                                defaultPageSize={defaultPageSize}
                                pageSizeOptions={pageSizeCommon}
                            />
                    }
                </Col>
            </Col>
        );
        let header = (
            <div>
                <div>
                    <Col xs={12}>
                        <Col xs={12} sm={4} md={2} lg={2}>
                            <FormGroup>
                                <ControlLabel>Employee Code</ControlLabel>
                                <FormControl
                                    disabled
                                    value={this.state.employee.username ? this.state.employee.username : cookie.load('username')}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={4} md={2} lg={2}>
                            <FormGroup>
                                <ControlLabel>Title </ControlLabel>
                                <Select
                                    disabled
                                    value={this.state.employee.title ? this.state.employee.title : ''}
                                    options={[
                                        { value: "Mr.", label: "Mr." },
                                        { value: "Mrs.", label: "Mrs." },
                                        { value: "Miss.", label: "Miss." },
                                        { value: "Ms.", label: "Ms." },
                                    ]
                                    }
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={4} md={3} lg={3}>
                            <FormGroup>
                                <ControlLabel>Full Name </ControlLabel>
                                <FormControl
                                    disabled
                                    value={this.state.employee.name}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                                <ControlLabel>Phone </ControlLabel>
                                <FormControl
                                    disabled
                                    value={this.state.employee.phone ? this.state.employee.phone : ""}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                                <ControlLabel>PAN No</ControlLabel>
                                <FormControl
                                    disabled
                                    value={this.state.employee.bankDetails !== undefined ? this.state.employee.bankDetails.panNo : ""}
                                />
                            </FormGroup>
                        </Col >
                        <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                                <ControlLabel>email </ControlLabel>
                                <FormControl
                                    disabled
                                    value={this.state.employee.email ? this.state.employee.email : ""}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                                <ControlLabel>Joining Date </ControlLabel>
                                <FormControl
                                    disabled
                                    value={Moment(this.state.employee.joiningDate) ? Moment(this.state.employee.joiningDate).format("YYYY-MMM-DD") : "-"}
                                />
                            </FormGroup>
                        </Col>

                        <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                                <ControlLabel>Supervisor </ControlLabel>
                                <FormControl
                                    disabled
                                    value={this.state.employee.supervisor ? this.state.employee.supervisor.name : this.state.employee.supervisor}
                                />
                            </FormGroup>
                        </Col>

                        <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                                <ControlLabel>department </ControlLabel>
                                <FormControl
                                    disabled
                                    value={this.state.employee.department ? this.state.employee.department : ""}
                                />
                            </FormGroup>
                        </Col>

                        <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                                <ControlLabel>designation</ControlLabel>
                                <FormControl
                                    disabled
                                    value={this.state.employee.designation ? this.state.employee.designation.name : ""}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                                <ControlLabel>bank Name </ControlLabel>
                                <FormControl
                                    disabled
                                    value={this.state.employee.bankDetails ? this.state.employee.bankDetails.bankName : "-"}
                                />
                            </FormGroup>
                        </Col>

                    </Col >
                    {/* </div>
                <div style={{ marginTop: 5, marginBottom: 5 }} > */}

                    <Col xs={12}>
                        <Row>
                            <Col xs={12}>
                                {Array.isArray(this.state.employee.leaves) && this.state.employee.leaves.map(el => {
                                    if (el.isApllicable) {
                                        return (
                                            <Col xs={12} sm={4} md={3} lg={3}>
                                                <FormGroup>
                                                    < ControlLabel > {el.leaveType.leaveType} </ControlLabel>
                                                    <FormControl
                                                        disabled
                                                        value={el.balance ? el.balance : "-"}
                                                    />
                                                </FormGroup>
                                            </Col >)
                                    }
                                })
                                }
                            </Col>
                        </Row>
                    </Col>
                </div>
            </div>
        )
        return (
            <Row className="card-content">
                {header}
                {leaves}

                <SweetAlert
                    show={this.state.isAlert} style={{ display: "block", marginTop: "-100px" }}
                    onCancel={() => this.setState({ isAlert: false })}
                    onConfirm={() => this.setState({ isAlert: false })}
                    title=''
                    {...this.state.alert}>
                    {this.state.alert.message}
                </SweetAlert>
            </Row>
        );
    }
}