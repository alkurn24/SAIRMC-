import React, { Component } from 'react';
import { Row, Col, Modal } from "react-bootstrap";
import BigCalendar from 'react-big-calendar';
import dates from 'react-big-calendar/lib/utils/dates';
import SweetAlert from "react-bootstrap-sweetalert";
import Moment from 'moment';
import Card from 'components/Card/Card.jsx';

import LeaveTrackingCalendarModal from "../components/LeaveTrackingCalendarModal.jsx";

import { createLeaveTracking, getLeaveTrackingList } from "../server/EmployeeServerComm";
import { getSocket } from "js/socket.io.js"
import StatsCard from "components/Card/StatsCard.jsx";

const localizer = BigCalendar.momentLocalizer(Moment)

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(Moment)
)
class LeaveTrackingFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      alert: null,
      slotInfo: {},
      supervisor: "",
      balanceLeaves: "10",
      penddingLeaves: "5",
      totalLeaves: "15",
      leaveModal: false,
      socket: getSocket()

    };

    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.selectedEvent = this.selectedEvent.bind(this);
    this.addNewEventAlert = this.addNewEventAlert.bind(this);
    this.addNewEvent = this.addNewEvent.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.handleShowLeaveTrackingModal = this.handleShowLeaveTrackingModal.bind(this);
    this.handleCloseLeaveTrackingModal = this.handleCloseLeaveTrackingModal.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
  }

  handleShowLeaveTrackingModal(code) {
    this.setState({ showLeaveTrackingModal: true, code: code })
  }
  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        console.log(this.state.socket)
        this.state.socket.on("List updated", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }

  componentWillMount() {
    this.fetchDataFromServer();
  }

  handleDateChange(name, date) {
    var newData = this.state.reviews;
    newData[name] = date._d;
    this.setState({ reviews: newData });
  }
  handleSelectChange(name, selectedOption) {
    let temp = this.state.reviews;
    temp[name] = selectedOption;
    this.setState({ temp })
  }
  handleDropDownChange(name, selectedOption) {
    var newreviews = this.state.reviews;
    newreviews[name] = selectedOption.value;
    this.setState({ reviews: newreviews, [name + "Valid"]: true, });
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
        >
        </SweetAlert>
      )
    });
  }
  validationCheck() {
    setTimeout(this.save, 10);

  }
  fetchDataFromServer() {
    var _this = this;
    this.setState({ loading: true });
    let params = "view=calendar";
    getLeaveTrackingList(params,
      function success(data) {
        _this.setState({ events: data.rows, loading: false })
      }
    );
  }

  selectedEvent(event) {
    this.handleShowMaintanceLogModal(event.code)
  }

  addNewEventAlert(slotInfo) {
    this.setState({ leaveModal: true, slotInfo })
  }

  addNewEvent(e, slotInfo) {
    var newEvents = this.state.events;
    newEvents.push({
      'title': e,
      'start': slotInfo.start,
      'end': slotInfo.end
    })
    this.setState({
      alert: null,
      events: newEvents
    })
  }

  hideAlert() { this.setState({ alert: null }); }

  handleShowLeaveTrackingModal(slotInfo) {
    console.log(slotInfo);

    this.setState({ leaveModal: true, slotInfo })
  }

  handleCloseLeaveTrackingModal() {
    this.setState({ leaveModal: false, slotInfo: {} })
  }

  render() {
    return (
      <Row>
        {this.state.alert}
        <Col md={12}>
          <Modal
            show={this.state.leaveModal}
            onHide={this.handleCloseLeaveTrackingModal}>
            <Modal.Header closeButton>Leave Application</Modal.Header>
            <Modal.Body>
              <LeaveTrackingCalendarModal
                slotInfo={this.state.slotInfo}
              />
            </Modal.Body>
          </Modal>
          <div className={'padding'} >
            <Card
              calendar
              content={
                <BigCalendar
                  localizer={localizer}
                  selectable
                  weel={false}
                  events={this.state.events}
                  scrollToTime={new Date(1970, 1, 1, 6)}
                  defaultDate={new Date()}
                  onSelectEvent={event => this.selectedEvent(event)}
                  onSelectSlot={(slotInfo) => this.addNewEventAlert(slotInfo)}
                  views={['month']}
                  // max={dates.add(new Date(), 1, 'month')}
                  onNavigate={(date, view, action) => {
                    this.setState({ startDate: dates.firstVisibleDay(date), endDate: dates.lastVisibleDay(date) });
                  }}
                  onView={(view) => {
                    console.log(view)
                  }}
                // eventPropGetter={this.eventColors}
                />
              }
            />
          </div>
        </Col>
      </Row>
    );
  }
}

export default LeaveTrackingFormComponent