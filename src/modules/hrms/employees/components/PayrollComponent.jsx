import React, { Component } from 'react'
import { FormControl, Row, Col, FormGroup, Tooltip, OverlayTrigger, ControlLabel } from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import cookie from "react-cookies";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import { getPayrollHeadsList, getPayrollData, createPayrollData } from '../server/HrmsServerComm.jsx'
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from "components/CustomSelect/CustomSelect.jsx";
import { pageSizeOptionsList, defaultPageSize } from "../../../../variables/appVariables.jsx";


export default class PayrollComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: {},
            payrollData: [],
            payrollHeads: [],
            listOfPayrollHeads: [],
            incomes: [],
            deductions: [],
            isAlart: false,
            searchByPayroll: '',
            error: '',
            alart: { message: "" },
            revision: 0,
            isValid: {
                isIncome: null,
                isDeduction: null
            }
        };
    }
    componentWillReceiveProps({ employee }, state) {
        if (employee) {
            getPayrollHeadsList(null, this.fetchDataFromServer, this.error);
            const revision = employee.payroll ? employee.payroll.revision : 0;
            if (employee !== state.employee) {
                this.setState({ employee, revision })
            }
        }
    }
    fetchDataFromServer = ({ listOfPayrollHeads: temp }) => {
        const { employee } = this.state;
        const incomes = [];
        const deductions = [];
        temp.forEach(el => {
            let inc = null
            let dec = null
            if (employee.payroll) {
                inc = employee.payroll.incomes.find(include => include.head.toString() === el.id.toString())
                dec = employee.payroll.deductions.find(declude => declude.head.toString() === el.id.toString())
            }
            el.selected = false;
            el.value = "";
            if (el.income) {
                let incom = { ...el, head: el.id }
                if (inc) { incom = { ...incom, ...inc } }
                incomes.push(incom)
            }
            if (el.deduction) {
                let deduct = { ...el, head: el.id }
                if (dec) { deduct = { ...deduct, ...dec } }
                deductions.push(deduct)
            }
        })
        this.setState({ incomes, deductions });
    }
    handleSaveButton = () => {
        const { incomes, deductions, revision } = this.state;
        let isIncome = true
        let isDeduction = true
        incomes.forEach(el => el.selected && !el.value ? isIncome = false : null)
        deductions.forEach(el => el.selected && !el.value ? isDeduction = false : null)
        let error = !isIncome ? "Enter value in Income" : !isDeduction ? "Enter value in Deduction" : '';
        !isIncome || !isDeduction ? this.setState(prev => ({ error, isValide: { ...prev.isValide, isDeduction, isIncome } })) :
            createPayrollData({ employee: this.state.employee.id, revision, incomes, deductions }, this.saved, this.error)
    }
    saved = res => {
        this.setState(prev => ({
            isAlart: true,
            alart: {
                onConfirm: () => this.setState({ isAlart: false }),
                title: "Successful",
                cancelBtnBsStyle: "success",
                confirmBtnText: "OK",
                cancelBtnText: "Cancel",
                showCancel: false,
                message: `Payroll data saved sucessfully`,
                confirmBtnBsStyle: "success",
                success: true
            }
        }))
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
    render() {
        const save = (<Tooltip id="trash_tooltip">Save payroll heads</Tooltip>);
        return (
            <div>
                <Row>
                    <Col xs={6} sm={6} md={6} lg={6}>
                        <Col xs={12}><ControlLabel> Income </ControlLabel></Col>
                        {this.state.incomes.map((el, key) => {
                            return (
                                <Row key={'inc' + key}>
                                    <Col xs={4} sm={4} md={4} lg={4}>
                                        <FormGroup>
                                            <Checkbox inline
                                                label={el.name}
                                                number={el.name + "1"}
                                                checked={this.state.incomes[key].selected}
                                                onChange={(e) => {
                                                    const incomes = this.state.incomes;
                                                    incomes[key].selected = e.target.checked;
                                                    this.setState({ incomes })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={7} sm={7} md={7} lg={7}>
                                        <FormGroup>
                                            <FormControl
                                                type="text"
                                                value={this.state.incomes[key].value}
                                                onChange={(e) => {
                                                    if (!e.target.value || e.target.value.match(/^\d{1,8}(\.\d{0,2})?$/)) {
                                                        const incomes = this.state.incomes;
                                                        incomes[key].value = e.target.value;
                                                        this.setState({ incomes })
                                                    }
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            )
                        })}
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                        <Col xs={12}><ControlLabel> Deduction </ControlLabel></Col>
                        {this.state.deductions.map((el, key) => {
                            return (
                                <Row key={'dec' + key}>
                                    <Col xs={4} sm={4} md={4} lg={4}>
                                        <FormGroup>
                                            <Checkbox inline
                                                label={el.name}
                                                number={el.name + "2"}
                                                checked={this.state.deductions[key].selected}
                                                onChange={(e) => {
                                                    const deductions = this.state.deductions;
                                                    deductions[key].selected = e.target.checked;
                                                    this.setState({ deductions })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={7} sm={7} md={7} lg={7}>
                                        <FormGroup>
                                            <FormControl
                                                type="text"
                                                value={this.state.deductions[key].value}
                                                onChange={(e) => {
                                                    if (!e.target.value || e.target.value.match(/^\d{1,8}(\.\d{0,2})?$/)) {
                                                        const deductions = this.state.deductions;
                                                        deductions[key].value = e.target.value;
                                                        this.setState({ deductions })
                                                    }
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            )
                        })}
                    </Col>
                </Row>
                <Col xs={12}>
                    <div className="">
                        < OverlayTrigger placement="top" overlay={save}>
                            <Button fill bsStyle="success" pullRight icon tooltip="Save" onClick={this.handleSaveButton}><span className="fa fa-save"></span></Button>
                        </OverlayTrigger>
                    </div>
                </Col>
                <Col xs={12}>
                    <div className="text-danger text-center" >{this.state.error}</div>
                </Col>
                <SweetAlert
                    show={this.state.isAlart} style={{ display: "block", marginTop: "-100px" }}
                    onCancel={() => this.setState({ isAlart: false })}
                    onConfirm={() => this.setState({ isAlart: false })}
                    title=''
                    {...this.state.alart}>
                    {this.state.alart.message}
                </SweetAlert>
            </div >
        )
    }
}
