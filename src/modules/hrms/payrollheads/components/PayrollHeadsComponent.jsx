import React, { Component } from 'react'
import { FormControl, Row, Col, FormGroup, Tooltip, OverlayTrigger } from "react-bootstrap";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import cookie from "react-cookies";
import ReactTable from "react-table";
import SweetAlert from 'react-bootstrap-sweetalert';
import { getPayrollHeads, deletePayrollHeads, createPayrollHeads, updatePayrollHeads } from '../server/PayrollHeadsServerComm.jsx'
import { pageSizeOptionsList, defaultPageSize } from "../../../../variables/appVariables.jsx";


export default class PayrollHeadsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNew: false,
            listOfPayrollHeads: [],
            payrollHeads: "",
            income: false,
            deduction: false,
            searchByPayroll: '',
            error: '',
            isAlart: false,
            alart: { message: "" },
            table: {
                page: 0,
                pageSize: defaultPageSize,
                pages: 1,
            }
        };
    }
    componentWillMount() {
        getPayrollHeads(null, this.fetchDataFromServer, this.error);
    }
    fetchDataFromServer = ({ count, listOfPayrollHeads }) => {
        const pages = Math.ceil(count / this.state.table.pageSize);
        this.setState(prev => ({ table: { ...prev.table, pages }, listOfPayrollHeads, isNew: false }))
    }
    handleSearchByPayroll = e => {
        const searchByPayroll = e.target.value;
        getPayrollHeads(`limit=${this.state.table.pageSize}&page=${this.state.table.page}&val=${searchByPayroll}`, this.fetchDataFromServer, this.error)
        this.setState({ searchByPayroll })
    }
    handlePageSizeChange = pageSize => {
        getPayrollHeads(`limit=${pageSize}&page=${this.state.table.page}&val=${this.state.searchByPayroll}`, this.fetchDataFromServer, this.error)
        this.setState(prev => ({ table: { ...prev.table, pageSize } }));
    }
    handlePageChange = page => {
        getPayrollHeads(`limit=${this.state.table.pageSize}&page=${page}&val=${this.state.searchByPayroll}`, this.fetchDataFromServer, this.error)
        this.setState(prev => ({ table: { ...prev.table, page } }));
    }
    handleAddButton = e => {
        if (!this.state.isNew) {
            const listOfPayrollHeads = this.state.listOfPayrollHeads;
            listOfPayrollHeads.unshift({
                name: "",
                income: false,
                deduction: false
            })
            this.setState({ listOfPayrollHeads, isNew: true })
        }
    }
    error = res => {
        console.log(res);
        this.setState(prev => ({
            isAlart: true,
            alart: {
                onConfirm: () => this.setState({ isAlart: false }),
                title: "Error",
                cancelBtnBsStyle: "success",
                confirmBtnText: "OK",
                cancelBtnText: "Cancel",
                showCancel: false,
                message: `Something went wrong try again later.`,
                confirmBtnBsStyle: "success",
                error: true
            }
        }))
    }
    handleDeleteButton = ({ index, original: { code } }) => {
        const listOfPayrollHeads = this.state.listOfPayrollHeads;
        if (!code) {
            listOfPayrollHeads.splice(index, 1);
            this.setState({ listOfPayrollHeads, isNew: false });
        } else {
            this.setState(prev => ({
                isAlart: true,
                alart: {
                    onConfirm: () => deletePayrollHeads(code, this.handleDeleteSucess, this.error),
                    title: "Are you sure?",
                    cancelBtnBsStyle: "success",
                    confirmBtnText: "Delete",
                    cancelBtnText: "Cancel",
                    showCancel: true,
                    message: `Do you want to delete `,
                    confirmBtnBsStyle: "danger",
                    warning: true
                }
            }))
        }
    }
    handleDeleteSucess = () => {
        this.setState({ isAlart: false });
        getPayrollHeads(null, this.fetchDataFromServer, this.error);
        const alart = {
            onConfirm: () => this.setState({ isAlart: false }),
            title: "Successful",
            cancelBtnBsStyle: "success",
            confirmBtnText: "OK",
            cancelBtnText: "Cancel",
            showCancel: false,
            message: 'Payroll head deleted sucessfully',
            confirmBtnBsStyle: "success",
            success: true
        }
        this.setState({ isAlart: true, alart });
    }
    handleSaveButton = original => {
        if (!original.name) {
            return this.setState({ error: "Please enter valid name." })
        }
        if (!original.income && !original.deduction) {
            return this.setState({ error: "Please select Income/Deduction type." })
        }
        if (!original.code) {
            createPayrollHeads(original, this.handleAddSuccess, this.error)
        } else {
            updatePayrollHeads(original, this.handleAddSuccess, this.error)
        }
    }
    handleAddSuccess = res => {
        getPayrollHeads(null, this.fetchDataFromServer, this.error);
        const alart = {
            onConfirm: () => this.setState({ isAlart: false }),
            title: "Successful",
            cancelBtnBsStyle: "success",
            confirmBtnText: "OK",
            cancelBtnText: "Cancel",
            showCancel: false,
            message: 'Payroll head saved successfully',
            confirmBtnBsStyle: "success",
            success: true
        }
        this.setState({ error: '', isNew: false, alart, isAlart: true });
    }
    tabelCellTextbox = row => {
        return (
            <FormGroup>
                <FormControl
                    type="text"
                    value={this.state.listOfPayrollHeads[row.index][row.column.id]}
                    onChange={(e) => {
                        const listOfPayrollHeads = this.state.listOfPayrollHeads;
                        listOfPayrollHeads[row.index][row.column.id] = e.target.value;
                        this.setState({ listOfPayrollHeads });
                    }}
                />
            </FormGroup>
        )
    }
    tabelCellIncome = row => {
        return (
            <FormGroup>
                <Checkbox inline
                    number={row.index + "1"}
                    checked={this.state.listOfPayrollHeads[row.index][row.column.id]}
                    onChange={(e) => {
                        const listOfPayrollHeads = this.state.listOfPayrollHeads;
                        listOfPayrollHeads[row.index][row.column.id] = e.target.checked;
                        this.setState({ listOfPayrollHeads });
                    }}
                />
            </FormGroup>
        )
    }
    tabelCellDeduction = row => {
        return (
            <FormGroup>
                <Checkbox inline
                    number={row.index + "2"}
                    checked={this.state.listOfPayrollHeads[row.index][row.column.id]}
                    onChange={(e) => {
                        const listOfPayrollHeads = this.state.listOfPayrollHeads;
                        listOfPayrollHeads[row.index][row.column.id] = e.target.checked;
                        this.setState({ listOfPayrollHeads });
                    }}
                />
            </FormGroup>
        )
    }
    tabelCellQuntity = row => {
        return (
            <FormGroup>
                <FormControl
                    type="text"
                    value={this.state.listOfPayrollHeads[row.index][row.column.id]}
                    onChange={(e) => {
                        const listOfPayrollHeads = this.state.listOfPayrollHeads;
                        listOfPayrollHeads[row.index][row.column.id] = e.target.value;
                        this.setState({ listOfPayrollHeads });
                    }}
                />
            </FormGroup>
        )
    }
    tableCellButton = row => {
        const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
        const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);

        return (
            <div className="actions-right">
                <OverlayTrigger placement="top" overlay={save}>
                    <Button className="btn-list" fill icon onClick={() => this.handleSaveButton(row.original)}> <span className="fa fa-save text-success"></span></Button>
                </OverlayTrigger>
                {cookie.load('role') === "Admin" &&
                    <OverlayTrigger placement="top" overlay={trash}>
                        <Button className="btn-list" fill icon onClick={() => this.handleDeleteButton(row)} ><span className="fa fa-trash text-danger"></span></Button>
                    </OverlayTrigger>
                }
            </div>
        )
    }
    render() {
        return (
            <Row>
                <Col xs={12}>
                    <div className="list-header">
                        <Col xs={6} sm={6} md={3} lg={3}>
                            <FormGroup>
                                <FormControl
                                    type="text"
                                    value={this.state.SearchByPayroll}
                                    placeholder="Search by payroll"
                                    onChange={this.handleSearchByPayroll}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={6} md={3} lg={3}></Col>
                        <Col xs={6} sm={6} md={6} lg={6}>
                            <Button pullRight bsStyle="primary" fill onClick={this.handleAddButton}><i className="fa fa-plus" /> Add New Payroll</Button>
                        </Col>
                    </div>
                    <Col xs={12}>
                        {
                            this.state.listOfPayrollHeads.length === 0 ? <div>No Record found.</div> :
                                <ReactTable
                                    data={this.state.listOfPayrollHeads}
                                    columns={[
                                        { Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => <div>{d.index + 1}</div>) },
                                        { Header: "Payroll Heads", accessor: "name", Cell: this.tabelCellTextbox },
                                        { Header: "Income", width: 100, accessor: "income", Cell: this.tabelCellIncome },
                                        { Header: "Deduction", width: 100, accessor: "deduction", Cell: this.tabelCellDeduction },
                                        // { Header: "qty", accessor: "qty", Cell: this.tabelCellQuntity },
                                        { Header: "", accessor: "code", width: 60, Cell: this.tableCellButton }
                                    ]}
                                    onPageSizeChange={this.handlePageSizeChange}
                                    onPageChange={this.handlePageChange}
                                    pageSizeOptions={pageSizeOptionsList}
                                    defaultPageSize={defaultPageSize}
                                    className="-striped -highlight"
                                    showPaginationBottom={true}
                                    showPaginationTop={false}
                                    pages={this.state.pages}
                                    sortable={false}
                                    minRows={0}
                                    manual
                                />
                        }
                    </Col>
                    <Col xs={12}>
                        <div className="text-danger text-center" >{this.state.error}</div>
                    </Col>
                    <SweetAlert
                        show={this.state.isAlart}
                        style={{ display: "block", marginTop: "-100px" }}
                        onCancel={() => this.setState({ isAlart: false })}
                        onConfirm={() => this.setState({ isAlart: false })}
                        title=''
                        {...this.state.alart}>
                        {this.state.alart.message}
                    </SweetAlert>
                </Col>
            </Row>
        )

    }
}
