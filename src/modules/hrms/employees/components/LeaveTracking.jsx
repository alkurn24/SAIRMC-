import React, { Component } from 'react';
// import { Modal, Row, ControlLabel, Col, FormGroup, Tooltip, OverlayTrigger } from "react-bootstrap";
import BigCalendar from 'react-big-calendar';
import Moment from 'moment';
import SweetAlert from "react-bootstrap-sweetalert";
import Card from 'components/Card/Card.jsx';
import CalenderModal from "./CalenderModal.jsx";
import InfoModal from "./InfoModal.jsx";

import { getLeaveDetails } from '../server/HrmsServerComm.jsx'
import { createLeaveApllication } from '../server/HrmsServerComm.jsx'
BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(Moment)
);

export default class LeaveTracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: {},
            infoEvent: {},
            events: [],
            leaveModal: false,
            infoModal: false,
            isAlart: false,
            alart: { message: "" },
        };
    }
    componentWillMount() {
        getLeaveDetails(null, this.success, this.error)
    }
    // componentWillReceiveProps({ employee }, state) {
    //     if (employee !== state.employee) {
    //         if (employee.id) {
    //             this.setState({ employee })
    //         }
    //     }
    // }
    success = ({ employee, events: temp = [] }) => {
        const events = temp.map(el => ({
            ...el,
            title: el.title ? el.title : 'Other Leave',
        }))
        this.setState(prev => ({ employee, events }))
    }
    selectedEvent = infoEvent => {
        if (infoEvent) {
            this.setState({ infoModal: true, infoEvent })
        }
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
    handleLeaveSelection = slotInfo => {
        if (!this.state.employee.supervisor) {
            this.setState({
                isAlart: true,
                alart: {
                    onConfirm: () => this.setState({ isAlart: false }),
                    title: "Access denied",
                    cancelBtnBsStyle: "success",
                    confirmBtnText: "Ok",
                    cancelBtnText: "Cancel",
                    showCancel: false,
                    message: `You don't have supervisor assign`,
                    confirmBtnBsStyle: "success",
                    warning: true
                }
            })
        } else {
            this.setState({ leaveModal: true, slotInfo })
        }
    }
    handleModalClose = () => {
        this.setState({ leaveModal: false })
    }

    handleInfoModalClose = () => {
        this.setState({ infoModal: false, infoEvent: {} })
    }
    addNewEvent = ({ selectedLeaveType, endHalfDate, startHalfDate, slotInfo, employee, supervisor, reason, noOfDays, balance }) => {
        const newEvent = {
            employee,
            supervisor,
            leaveType: selectedLeaveType.value,
            reason,
            status: "PENDING",
            start: slotInfo.start,
            end: slotInfo.end,
            startHalfDate,
            endHalfDate,
            noOfDays,
            balance: balance * 10,
            title: selectedLeaveType.label ? selectedLeaveType.label : "No Tiltle"
        }
        const events = this.state.events;
        events.push(newEvent);
        createLeaveApllication(newEvent, () => {
            this.setState({
                events,
                isAlart: true,
                leaveModal: false,
                alart: {
                    onConfirm: () => this.setState({ isAlart: false }),
                    title: "Successful",
                    cancelBtnBsStyle: "success",
                    confirmBtnText: "OK",
                    cancelBtnText: "Cancel",
                    showCancel: false,
                    message: "Leave applied successfully.",
                    confirmBtnBsStyle: "success",
                    success: true
                }
            })
        }, this.props.error)
    }

    handleAlartClose = () => {
        this.setState({ isAlart: false })
    }
    eventColors = (event, start, end, isSelected) => {
        let backgroundColor;
        event.status === "PENDDING" ? (backgroundColor = ".rbc-event.rbc-event-green") : (backgroundColor = ".rbc-event.rbc-event-green");
        return {
            className: backgroundColor
        };
    }
    render() {
        return (
            <div>
                <div className={'padding'} >
                    <Card
                        style
                        calendar
                        content={
                            <BigCalendar
                                onSelectSlot={this.handleLeaveSelection}
                                selectable
                                className={""}
                                onSelectEvent={event => this.selectedEvent(event)}
                                weel={false}
                                events={this.state.events}
                                scrollToTime={new Date(1970, 1, 1, 6)}
                                defaultDate={new Date()}
                                eventPropGetter={this.eventColors}
                                views={['month']}
                            // max={dates.add(new Date(), 1, 'month')}
                            />
                        }
                    />
                </div>
                <CalenderModal
                    employee={this.state.employee}
                    // leaveType={this.props.leaveType}
                    show={this.state.leaveModal}
                    addNewEvent={this.addNewEvent}
                    slotInfo={this.state.slotInfo}
                    events={this.state.events}
                    handleModalClose={this.handleModalClose}
                />
                <InfoModal
                    infoEvent={this.state.infoEvent}
                    supervisor={this.state.employee.supervisor ? this.state.employee.supervisor.name : ''}
                    show={this.state.infoModal}
                    handleModalClose={this.handleInfoModalClose}
                />
                <SweetAlert
                    show={this.state.isAlart} style={{ display: "block", marginTop: "-100px" }}
                    onCancel={() => this.setState({ isAlart: false })}
                    onConfirm={() => this.setState({ isAlart: false })}
                    title=''
                    {...this.state.alart}>
                    {this.state.alart.message}
                </SweetAlert>
            </div >
        );
    }
}