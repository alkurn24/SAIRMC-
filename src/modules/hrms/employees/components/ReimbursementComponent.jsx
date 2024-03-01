import React, { Component } from 'react';
import Select from "components/CustomSelect/CustomSelect.jsx";
import { getReimbursementList, createExpense, updateExpense, deleteExpense } from '../server/HrmsServerComm';
import { Row, Col, FormGroup, Tooltip, OverlayTrigger } from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import ReactTable from "react-table";
import AddExpenseModal from './AddExpenseModal.jsx';
import SweetAlert from "react-bootstrap-sweetalert";
import { pageSizeOptionsList, defaultPageSize } from "../../../../variables/appVariables.jsx";
import cookie from 'react-cookies';

export default class ReimbursementComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: null,
            editExpense: null,
            listOfEmployee: [],
            listofReimbursement: [],
            selectedEmp: "",
            adddExpense: false,
            error: '',
            isAlart: false,
            isDownload: false,
            alart: { message: "" }
        };
    }
    componentWillMount() {
        getReimbursementList(null, this.fetchDataFromServer, this.error)
    }
    fetchDataFromServer = ({ listOfEmployee, listofReimbursement }) => {
        const state = { listofReimbursement: Array.isArray(listofReimbursement) ? listofReimbursement : [] };
        if (listOfEmployee) {
            state.listOfEmployee = Array.isArray(listOfEmployee) ? listOfEmployee : []
            state.employee = Array.isArray(listOfEmployee) ? listOfEmployee.find(el => el.isSelected).value : ""
        }
        this.setState(state);
    }
    // handleSearchEmployee = val => {
    //     const params = `val=${val}`
    //     getEmployeeList(params, this.setEmployeeList, this.error);
    // }
    // setEmployeeList = ({ rows }) => {
    //     const listOfEmployee = Array.isArray(rows) ? rows.map(el => ({ value: el.id, label: el.name })) : []
    //     this.setState({ listOfEmployee })
    // }
    handleSelectChange = (e) => {
        const employee = e ? e.value : '';
        if (!!employee) {
            getReimbursementList(`id=${employee}`, this.fetchDataFromServer, this.error);
        }
        this.setState({ employee });
    }
    handleAddExpenseSubmit = data => {
        data.employee = this.state.employee
        this.setState({ adddExpense: false });
        data.id ? updateExpense({ ...data, status: "INPROCESS" }, () => this.success("updated"), this.error) : createExpense(data, () => this.success("created"), this.error);
    }
    handleEditExpense = editExpense => {
        this.setState({ editExpense, adddExpense: true })
    }
    handleDeleteExpense = id => {
        this.setState(prev => ({
            isAlart: true,
            alart: {
                onConfirm: () => deleteExpense(id, () => this.success("deleted"), this.error),
                title: "Are you sure?",
                cancelBtnBsStyle: "success",
                confirmBtnText: "Delete",
                cancelBtnText: "Cancel",
                showCancel: true,
                message: `Do you want to delete expense`,
                confirmBtnBsStyle: "danger",
                warning: true
            }
        }))
    }
    success = msg => {
        getReimbursementList(null, this.fetchDataFromServer, this.error)
        this.setState({
            isAlart: true,
            alart: {
                onConfirm: () => this.setState({ isAlart: false }),
                title: "Successful",
                cancelBtnBsStyle: "success",
                confirmBtnText: "OK",
                cancelBtnText: "Cancel",
                showCancel: false,
                message: `Expense ${msg} successfully`,
                confirmBtnBsStyle: "success",
                success: true
            }
        })
    }
    error = err => {
        this.setState({
            isAlart: true,
            alart: {
                onConfirm: () => this.setState({ isAlart: false }),
                cancelBtnBsStyle: "danger",
                confirmBtnText: "OK",
                showCancel: false,
                message: `Something went wrong!`,
                error: true
            }
        })
        console.log("err :", err);
    }
    handleModalClose = () => {
        this.setState({ adddExpense: false, editExpense: {} })
    }
    tableCellButton = row => {
        const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
        const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
        const apply = (<Tooltip id="approve_tooltip">Apply again</Tooltip>);
        return (
            <div className="actions-right">
                {
                    <div>
                        {row.original.status === "PENDING" &&
                            <OverlayTrigger placement="top" overlay={edit}>
                                <a role="button" className="fa fa-edit" onClick={() => this.handleEditExpense(row.original)}>{null}</a>
                            </OverlayTrigger>
                        }
                        {row.original.status === "REJECT" &&
                            <OverlayTrigger placement="top" overlay={apply}>
                                <a role="button" className="fa fa-repeat" onClick={() => this.handleEditExpense(row.original)} >{null}</a>
                            </OverlayTrigger>
                        }
                        {row.original.status === "PENDING" || row.original.status === "REJECT" ?
                            <OverlayTrigger placement="top" overlay={trash}>
                                <a role="button" className="fa fa-trash" onClick={() => this.handleDeleteExpense(row.original.id)} >{null}</a>
                            </OverlayTrigger> : null
                        }
                        {/* {
                    // {cookie.load('role') === "Admin" && cookie.load("username").toString() !== row.original.empId.toString() &&
                    cookie.load('role') === "Admin" &&
                } */}
                    </div>
                }
            </div>
        )
    }
    tableCellAmount = row => {
        let rate = (parseFloat(row.original.amount))
        return (
            <div class="text-right">
                {" ₹ " + rate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
        )
    }
    render() {
        return (
            <Row>
                {this.state.alert}
                <Col xs={12}>
                    <div className="list-header">
                        <Col xs={12} sm={3} md={3} lg={3}>
                            {cookie.load("role") === "Admin" ?
                                <FormGroup>
                                    <Select
                                        value={this.state.employee}
                                        options={this.state.listOfEmployee}
                                        onChange={this.handleSelectChange}
                                    // onInputChange={this.handleSearchEmployee}
                                    />
                                </FormGroup>
                                : null
                            }
                        </Col>

                        <Col xs={12} sm={9} md={9} lg={9}>
                            <Button pullRight bsStyle="primary" fill onClick={() => this.setState({ adddExpense: true })} ><i className="fa fa-plus" /> Add New Expense </Button>
                        </Col>
                    </div>
                    <Col xs={12}>
                        {this.state.listofReimbursement.length === 0 ? <div>No salary details found</div> :
                            <ReactTable
                                data={this.state.listofReimbursement}
                                columns={[
                                    { Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => <div>{d.index + 1}</div>) },
                                    { Header: "Created Date", width: 120, accessor: "createdAt" },
                                    { Header: "expence Date", width: 120, accessor: "expenceDate" },
                                    { Header: "Status", width: 100, accessor: "status" },
                                    { Header: "amount", width: 100, accessor: "amount", Cell: this.tableCellAmount },
                                    { Header: "description", accessor: "description" },
                                    { Header: "remark", accessor: "remark" },
                                    { Header: "", accessor: "id", width: 60, Cell: this.tableCellButton }
                                ]}
                                pageSizeOptions={pageSizeOptionsList}
                                defaultPageSize={defaultPageSize}
                                className="-striped -highlight"
                                showPaginationBottom={true}
                                showPaginationTop={false}
                                sortable={false}
                                minRows={0}
                                manual
                            />
                        }
                    </Col>
                </Col>
                <AddExpenseModal
                    show={this.state.adddExpense}
                    handleModalClose={this.handleModalClose}
                    expense={this.state.editExpense}
                    handleFormSubmit={this.handleAddExpenseSubmit} />
                <SweetAlert
                    show={this.state.isAlart} style={{ display: "block", marginTop: "-100px" }}
                    onCancel={() => this.setState({ isAlart: false })}
                    onConfirm={() => this.setState({ isAlart: false })}
                    title=''
                    {...this.state.alart}>
                    {this.state.alart.message}
                </SweetAlert>
            </Row>
        )
    }
}
