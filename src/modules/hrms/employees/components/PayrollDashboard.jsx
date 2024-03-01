import React, { Component } from 'react';
import Select from "components/CustomSelect/CustomSelect.jsx";
import { getSalaryListSlips, downloadSalarySlip } from '../server/HrmsServerComm';
import Button from "components/CustomButton/CustomButton.jsx";
import ReactTable from "react-table";
import { pageSizeOptionsList, defaultPageSize } from "../../../../variables/appVariables.jsx";
import { Row, Col, FormGroup, Tooltip, OverlayTrigger } from "react-bootstrap";
import moment from 'moment';
import cookie from 'react-cookies';

export default class PayrollDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: null,
            listOfEmployee: [],
            listofSalarySlips: [],
            selectedEmp: "",
            error: '',
            isAlart: false,
            alart: { message: "" }
        };
    }
    componentWillMount() {
        getSalaryListSlips(null, this.fetchDataFromServer, this.error)
    }
    fetchDataFromServer = ({ listOfEmployee, listofSalarySlips }) => {
        const state = { listofSalarySlips };
        if (listOfEmployee) {
            state.listOfEmployee = listOfEmployee
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
            getSalaryListSlips(`id=${employee}`, this.fetchDataFromServer, this.error);
        }
        this.setState({ employee });
    }
    downloadPayslip = id => {
        if (id) {
            downloadSalarySlip(id, this.handleDownloadSalarySlip, this.error);
        }
    }
    handleDownloadSalarySlip = res => {
        const file = new Blob([res.data], { type: res.data.type });
        // Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        // Open the URL on new Window
        window.open(fileURL, '_blank');
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
    tableCellButton = row => {
        const download = (<Tooltip id="trash_tooltip">Download</Tooltip>);
        return (
            <div className="actions-right">
                <OverlayTrigger placement="top" overlay={download}>
                    <Button className="btn-list" onClick={() => this.downloadPayslip(row.original.id)} fill icon  ><span className="fa fa-download"></span></Button>
                </OverlayTrigger>
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
                    </div>
                    <Col xs={12}>
                        {this.state.listofSalarySlips.length === 0 ? <div>No salary details found</div> :
                            <ReactTable
                                data={this.state.listofSalarySlips}
                                columns={[
                                    { Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => <div>{d.index + 1}</div>) },
                                    { Header: "Month", accessor: "month" },
                                    { Header: "", accessor: "id", width: 50, Cell: this.tableCellButton }
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
            </Row>
        )
    }
}
