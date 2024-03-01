import React, { Component } from 'react'
import { FormControl, Row, Col, FormGroup, Tooltip, OverlayTrigger } from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import cookie from "react-cookies";
import ReactTable from "react-table";
import Select from "components/CustomSelect/CustomSelect.jsx";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import SweetAlert from 'react-bootstrap-sweetalert';
import { pageSizeOptionsList, defaultPageSize, listOfFrequency, policyList } from "variables/appVariables.jsx";
import { getLeaveTypes, createLeaveType, updateLeaveType, deleteLeaveType } from "../server/LeaveTypeServerComm.jsx"

export default class leaveTypesListComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNew: false,
            listOfLeaveType: [],
            isAlart: false,
            searchByLeaveType: '',
            error: '',
            alart: { message: "" },
            table: {
                page: 0,
                pageSize: defaultPageSize,
                pages: 1,
            }
        };
    }
    componentWillMount() {
        getLeaveTypes(null, this.fetchDataFromServer, this.error)
    }
    fetchDataFromServer = ({ count, rows: listOfLeaveType }) => {
        const pages = Math.ceil(count / this.state.table.pageSize);
        this.setState(prev => ({ table: { ...prev.table, pages }, listOfLeaveType }))
    }
    handleSearchByLeaveType = e => {
        const searchByLeaveType = e.target.value;
        getLeaveTypes(`val=${searchByLeaveType}&pageSize=${this.state.table.pageSize}&page=${this.state.table.page}`, this.fetchDataFromServer, this.error)
        this.setState({ searchByLeaveType })
    }
    handlePageChange = page => {
        getLeaveTypes(`val=${this.state.searchByLeaveType}&pageSize=${this.state.table.pageSize}&page=${page}`, this.fetchDataFromServer, this.error)
        this.setState(prev => ({ table: { ...prev.table, page } }));
    }
    handlePageSizeChange = pageSize => {
        getLeaveTypes(`val=${this.state.searchByLeaveType}&pageSize=${pageSize}&page=${this.state.table.page}`, this.fetchDataFromServer, this.error)
        this.setState(prev => ({ table: { ...prev.table, pageSize } }));
    }
    handleAddButton = e => {
        if (!this.state.isNew) {
            const listOfLeaveType = this.state.listOfLeaveType;
            listOfLeaveType.unshift({
                leaveType: "",
                policy: "",
                totalLeaves: "",
                frequency: "",
                prorated: true,
            })
            this.setState({ listOfLeaveType, isNew: false })
        }
    }
    handleSaveButton = data => {
        !data.leaveType || !data.policy || !data.totalLeaves || !data.frequency ? this.setState({ error: " Please enter required fields" }) :
            !data.id ? createLeaveType(data, this.handleAddSuccess, this.error) : updateLeaveType(data, this.handleAddSuccess, this.error)
    }
    handleAddSuccess = res => {
        getLeaveTypes(null, this.fetchDataFromServer, this.error)
        const alart = {
            onConfirm: () => this.setState({ isAlart: false }),
            title: "Successful",
            cancelBtnBsStyle: "success",
            confirmBtnText: "OK",
            cancelBtnText: "Cancel",
            showCancel: false,
            message: 'Leave lype saved sucessfully',
            confirmBtnBsStyle: "success",
            success: true
        }
        this.setState({ error: '', isNew: false, alart, isAlart: true });
    }
    handleDeleteButton = ({ index, original: { id, leaveType } }) => {
        this.setState(prev => ({
            isAlart: true,
            alart: {
                onConfirm: () => this.handleDeleteConfirm(index, id),
                title: "Are you sure?",
                cancelBtnBsStyle: "success",
                confirmBtnText: "Delete",
                cancelBtnText: "Cancel",
                showCancel: true,
                message: `Do you want to delete ${leaveType}`,
                confirmBtnBsStyle: "danger",
                warning: true
            }
        }))
    }
    handleDeleteConfirm = (index, id) => {
        const listOfLeaveType = this.state.listOfLeaveType;
        if (!id) {
            listOfLeaveType.splice(index, 1);
            this.setState({ listOfLeaveType, isNew: false, isAlart: false });
        } else {
            deleteLeaveType(id, this.handleDeleteSucess, this.error)
            this.setState({ isAlart: false })
        }
    }
    handleDeleteSucess = () => {
        getLeaveTypes(null, this.fetchDataFromServer, this.error)
        this.setState({
            isAlart: true,
            alart: {
                onConfirm: () => this.setState({ isAlart: false }),
                title: "Successful",
                cancelBtnBsStyle: "success",
                confirmBtnText: "OK",
                cancelBtnText: "Cancel",
                showCancel: false,
                message: 'leave type deleted sucessfully',
                confirmBtnBsStyle: "success",
                success: true
            }
        })
    }
    error = res => {
        this.setState(prev => ({ isAlart: false, }))
        if (res.response.status === 800) {
            this.handleAddSuccess()
        } else {
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
    }
    tabelCellTextbox = row => {
        return (
            <FormGroup>
                <FormControl
                    type="text"
                    value={this.state.listOfLeaveType[row.index][row.column.id]}
                    onChange={(e) => {
                        const listOfLeaveType = this.state.listOfLeaveType;
                        listOfLeaveType[row.index][row.column.id] = e.target.value;
                        this.setState({ listOfLeaveType });
                    }}
                />
            </FormGroup>
        )
    }
    tabelCellQuantity = row => {
        return (
            <FormGroup>
                <FormControl
                    type="number"
                    value={this.state.listOfLeaveType[row.index][row.column.id]}
                    onChange={(e) => {
                        const qty = e.target.value;
                        if (!qty || qty.match(/^\d{1,3}(\.\d{0,1})?$/)) {
                            const listOfLeaveType = this.state.listOfLeaveType;
                            listOfLeaveType[row.index][row.column.id] = qty;
                            this.setState({ listOfLeaveType });
                        }
                    }}
                />
            </FormGroup>
        )
    }
    renderCheckBox = row => {
        return (
            <FormGroup>
                <Checkbox inline
                    number={row.index + "1"}
                    checked={this.state.listOfLeaveType[row.index][row.column.id]}
                    onChange={(e) => {
                        const listOfLeaveType = this.state.listOfLeaveType;
                        listOfLeaveType[row.index][row.column.id] = e.target.checked;
                        this.setState({ listOfLeaveType });
                        console.log(row);
                    }}
                />
            </FormGroup>
        )
    }
    tabelCellPolicy = row => {
        return (
            <FormGroup>
                <Select
                    value={this.state.listOfLeaveType[row.index][row.column.id]}
                    options={policyList ? policyList : []}
                    onChange={opt => {
                        const listOfLeaveType = this.state.listOfLeaveType;
                        listOfLeaveType[row.index][row.column.id] = opt.value;
                        this.setState({ listOfLeaveType });
                    }}
                />
            </FormGroup>
        )
    }
    tabelCellFrequency = row => {
        return (
            <FormGroup>
                <Select
                    value={this.state.listOfLeaveType[row.index][row.column.id]}
                    options={listOfFrequency ? listOfFrequency : []}
                    onChange={opt => {
                        const listOfLeaveType = this.state.listOfLeaveType;
                        listOfLeaveType[row.index][row.column.id] = opt.value;
                        this.setState({ listOfLeaveType });
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
                    <Button className="btn-list" fill icon onClick={() => this.handleSaveButton(row.original)} ><span className="fa fa-save text-success"></span></Button>
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
                {this.state.alert}
                <Col xs={12}>
                    <div className="list-header">
                        <Col xs={6} sm={6} md={3} lg={3}>
                            <FormGroup>
                                <FormControl
                                    type="text"
                                    value={this.state.searchByLeaveType}
                                    placeholder="Search by name"
                                    onChange={this.handleSearchByLeaveType}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={6} md={3} lg={3}></Col>
                        <Col xs={6} sm={6} md={6} lg={6}>
                            <Button pullRight bsStyle="primary" fill onClick={this.handleAddButton}><i className="fa fa-plus" /> Add Leave Type</Button>
                        </Col>
                    </div>
                    <Col xs={12}>
                        {
                            this.state.listOfLeaveType.length === 0 ? <div>No record found </div> :
                                <ReactTable
                                    data={this.state.listOfLeaveType}
                                    columns={[
                                        { Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => <div>{d.index + 1}</div>) },
                                        { Header: "Name", accessor: "leaveType", Cell: this.tabelCellTextbox },
                                        { Header: "Policy", accessor: "policy", Cell: this.tabelCellPolicy },
                                        { Header: "Quantity", accessor: "totalLeaves", Cell: this.tabelCellQuantity },
                                        { Header: "Frequency", accessor: "frequency", Cell: this.tabelCellFrequency },
                                        { Header: "Prorated", accessor: "prorated", Cell: this.renderCheckBox },
                                        { Header: "", accessor: "id", width: 60, Cell: this.tableCellButton }
                                    ]}
                                    pageSizeOptions={pageSizeOptionsList}
                                    defaultPageSize={1}
                                    className="-striped -highlight"
                                    showPaginationBottom={true}
                                    onPageChange={this.handlePageChange}
                                    onPageSizeChange={this.handlePageSizeChange}
                                    showPaginationTop={false}
                                    // pages={this.state.pages}
                                    sortable={false}
                                    minRows={1}
                                    manual
                                />
                        }
                    </Col>
                    <Col xs={12}>
                        <div className="text-danger text-center" >{this.state.error}</div>
                    </Col>
                    <SweetAlert
                        show={this.state.isAlart} style={{ display: "block", marginTop: "-100px" }}
                        onCancel={() => this.setState({ isAlart: false })}
                        onConfirm={() => this.setState({ isAlart: false })}
                        title=''
                        {...this.state.alart} >
                        {this.state.alart.message}
                    </SweetAlert>
                </Col>
            </Row>
        )

    }
}
