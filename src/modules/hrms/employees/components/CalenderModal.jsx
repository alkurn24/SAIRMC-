import moment from 'moment';
import Select from "components/CustomSelect/CustomSelect.jsx";
import Datetime from "react-datetime";
import React, { Component } from 'react';
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import { errorColor } from 'variables/Variables.jsx';
import Button from "components/CustomButton/CustomButton.jsx";
import { Modal, Row, ControlLabel, Col, FormGroup, Tooltip, OverlayTrigger, FormControl } from "react-bootstrap";

export default class CalenderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leaveType: [],
            selectedLeaveType: '',
            balance: 0,
            employee: {},
            startHalfDate: false,
            endHalfDate: false,
            error: '',
            reason: '',
            slotInfo: { start: null, end: null, startHalfDate: null, endHalfDate: null },
            isValid: {
                isType: null,
                isStartDate: null,
                isEndDate: null
            }
        };
    }
    // componentWillMount() {
    //     getLeaveType(null, this.fetchDataFromServer, this.props.error)
    // }
    // fetchDataFromServer = ({ leaveType }) => {
    //     this.setState({ leaveType })
    // }
    componentWillReceiveProps({ slotInfo, employee, events }) {
        const obj = {};
        if (this.props.events !== events) { obj.events = events; }
        if (this.props.slotInfo !== slotInfo) {
            obj.slotInfo = slotInfo;
            obj.reason = "";
            obj.error = "";
            obj.startHalfDate = false;
            obj.endHalfDate = false;
        }
        if (this.props.employee !== employee) {
            if (employee && employee.leaves) { employee.leaves = employee.leaves.filter(el => !!el.isApllicable) }
            obj.employee = employee;
        }
        this.setState(obj);
    }
    handleSaveButton = () => {
        const { selectedLeaveType, endHalfDate, startHalfDate, slotInfo, reason, events } = this.state;
        let isType = !selectedLeaveType ? false : true;
        let isStartDate = !slotInfo.start ? false : true;
        let isEndDate = !slotInfo.end ? false : true;
        let isCurrentDate = moment(slotInfo.start).isSameOrAfter(moment(), 'day');
        let isValidDate = moment(slotInfo.end).isSameOrAfter(slotInfo.start, 'day');
        let noOfDays = slotInfo.slots.length * 10;
        let isBalance = noOfDays < (selectedLeaveType.balance * 10) ? true : false;
        let isReason = !reason ? false : true;
        endHalfDate ? (noOfDays = noOfDays - 5) : null;
        startHalfDate ? (noOfDays = noOfDays - 5) : null;
        const employee = this.state.employee.id;
        const supervisor = this.state.employee.supervisor.id;
        Array.isArray(events) ? events.map(date => {

        }) : null
        let error = !isType ? "select leave type" : !isBalance ? "You don't have leave balance" : !isCurrentDate ? "Date should be geater than equal to same date" : !isStartDate ? "Select start date" : !isEndDate ? "Select end date" : !isValidDate ? "Date should be greater than start date" : !isReason ? "Please enter reason." : ''
        if (!isBalance || !isCurrentDate || !isReason || !isType || !isEndDate || !isStartDate || !isValidDate) {
            this.setState(prev => ({ isValid: { ...prev.isValid, isType, isStartDate, isEndDate }, error }))
        } else {
            this.props.addNewEvent({ noOfDays, selectedLeaveType, endHalfDate, startHalfDate, slotInfo, reason, employee, supervisor })
            this.setState({
                selectedLeaveType: '',
                startHalfDate: false,
                endHalfDate: false,
                error: '',
                reason: ''
            })
        }
    }
    handleLeaveType = selectedLeaveType => {
        this.setState({ selectedLeaveType })
        // const leaves = this.state.employee.leaves
        // if (leaves) {
        // if (leavInfo) {
        // const leavInfo = leaves.find(el => (el.leaveType.id ? el.leaveType.id.toString() : el.leaveType.toString()) === selectedLeaveType.value.toString())
        //     this.setState({ selectedLeaveType, balance: (leavInfo.balance / 10) })
        // } else {
        //     this.setState({ selectedLeaveType, balance: 0 })
        // }
    }

    render() {
        const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
        return (
            <Modal show={this.props.show}
                onHide={this.props.handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title> Leave Approval</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col xs={12}>
                        <Row>
                            <Col xs={12} sm={6} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel> date: {moment().format('DD-MMM-YYYY')}</ControlLabel>
                                </FormGroup>
                            </Col>
                            <Col xs={12} sm={6} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel> Supervisor: {this.state.employee.supervisor ? this.state.employee.supervisor.name : ''}</ControlLabel>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <ControlLabel>Leave type</ControlLabel>
                                <FormGroup>
                                    <Select
                                        type="text"
                                        placeholder="Select leave type"
                                        value={this.state.selectedLeaveType}
                                        options={this.state.employee.leaves ? this.state.employee.leaves : null}
                                        onChange={this.handleLeaveType}
                                        style={{ color: this.state.isValid.isType === false ? errorColor : '', borderColor: this.state.isValid.isType === false ? errorColor : '' }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col style={{ marginTop: 18 }} xs={6} sm={6} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel>Available Leave: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{!this.state.selectedLeaveType ? 0 : this.state.selectedLeaveType.balance}</ControlLabel>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel>Start Date</ControlLabel>
                                    <Datetime
                                        closeOnSelect={true}
                                        dateFormat="DD/MMM/YYYY"
                                        isValidDate={(current) => current.isSameOrAfter(new Date())}
                                        inputProps={{ placeholder: "Select start date" }}
                                        value={moment(this.state.slotInfo.start).format("DD/MMM/YYYY")}
                                        onChange={e => this.setState(prev => ({ slotInfo: { ...prev.slotInfo, start: e } }))}
                                        className={this.state.isValid.isStartDate || this.state.isValid.isStartDate === null ? "" : "errorColor"}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel>End Date</ControlLabel>
                                    <Datetime
                                        closeOnSelect={true}
                                        isValidDate={(current) => current.isSameOrAfter(this.state.slotInfo.start)}
                                        dateFormat="DD/MMM/YYYY"
                                        inputProps={{ placeholder: "Select end date" }}
                                        value={moment(this.state.slotInfo.end).format("DD/MMM/YYYY")}
                                        onChange={e => this.setState(prev => ({ slotInfo: { ...prev.slotInfo, end: e } }))}
                                        className={this.state.isValid.isEndDate || this.state.isValid.isEndDate === null ? "" : "errorColor"}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={6} md={6} lg={6}>
                                <FormGroup>
                                    <Checkbox inline
                                        number="432"
                                        label="Start Half Day"
                                        checked={this.state.startHalfDate}
                                        onChange={e => this.setState({ startHalfDate: e.target.checked })}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                {!moment(this.state.slotInfo.start).isSame(this.state.slotInfo.end) &&
                                    <FormGroup>
                                        <Checkbox inline
                                            number="2321"
                                            name="endHalfDate"
                                            label="End Half Day"
                                            checked={this.state.endHalfDate}
                                            onChange={e => this.setState({ endHalfDate: e.target.checked })}
                                        />
                                    </FormGroup>
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <Row>
                            <Col xs={12}>
                                <ControlLabel>Reason</ControlLabel>
                                {/* <div className="section-header" style={{ marginTop: "5px", marginBottom: "5px" }}>reason</div> */}
                                <FormGroup>
                                    <FormControl
                                        placeholder="Add reason here..."
                                        componentClass="textarea"
                                        rows="2"
                                        className="calender-modal__reason"
                                        value={this.state.reason}
                                        onChange={e => this.setState({ reason: e.target.value })}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <center>
                            <h6 className="text-danger">{this.state.error}</h6>
                        </center>
                        <OverlayTrigger placement="top" overlay={save}>
                            <Button
                                bsStyle="success" fill icon pullRight style={{ marginLeft: "15px" }} onClick={this.handleSaveButton}>
                                <span className="fa fa-save" />
                            </Button>
                        </OverlayTrigger>
                    </Col>
                </Modal.Footer>
            </Modal >
        )
    }
}
