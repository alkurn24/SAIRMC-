import React, { Component } from 'react';
import { Row, Col, Modal } from "react-bootstrap";
import BigCalendar from 'react-big-calendar';
import dates from 'react-big-calendar/lib/utils/dates';
import SweetAlert from "react-bootstrap-sweetalert";
import Moment from 'moment';
import Card from 'components/Card/Card.jsx';

import MaintenanceLogComponents from "../../maintenance/components/MaintenanceLogComponents.jsx";
import AddMaintenanceModal from '../components/MaintenanceCalendarModal.jsx';

import { getMaintenaceLogList } from "../../maintenance/server/MaintenanceLogServerComm.jsx";
import { getSocket } from "js/socket.io.js"

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(Moment) // or globalizeLocalizer

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(Moment)
);
class MaintenanceCalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      alert: null,
      maintenance: [],
      MaintanceLogModal: false,
      socket: getSocket()
    };

    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.selectedEvent = this.selectedEvent.bind(this);
    this.addNewEventAlert = this.addNewEventAlert.bind(this);
    this.addNewEvent = this.addNewEvent.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.handleShowMaintenanceModal = this.handleShowMaintenanceModal.bind(this);
    this.handleCloseMaintenanceModal = this.handleCloseMaintenanceModal.bind(this);
    this.handleShowMaintanceModal = this.handleShowMaintanceModal.bind(this);
    this.handleShowMaintanceLogModal = this.handleShowMaintanceLogModal.bind(this);
    this.handleCloseMaintanceLogModal = this.handleCloseMaintanceLogModal.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
  }
  handleShowMaintanceLogModal(code) { this.setState({ showMaintanceLogModal: true, code: code }); }
  handleCloseMaintanceLogModal() { this.setState({ showMaintanceLogModal: false }); }
  handleShowMaintanceModal(code) {
    this.setState({ showMaintanceModal: true, code: code })
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
    getMaintenaceLogList(params,
      function success(data) {
        _this.setState({ events: data.rows, loading: false })
      }
    );
  }

  selectedEvent(event) {
    this.handleShowMaintanceLogModal(event.code)
  }

  addNewEventAlert(slotInfo) {
    this.handleShowMaintenanceModal(slotInfo.start, slotInfo.end)
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

  handleShowMaintenanceModal(maintenanceDate) {
    this.setState({ showAddMaintenanceModal: true, maintenanceDate: maintenanceDate })
  }

  handleCloseMaintenanceModal() {
    this.fetchDataFromServer()
    this.setState({ showAddMaintenanceModal: false, maintenanceDate: null })
  }

  render() {
    return (
      <Row>
        {this.state.alert}
        <Col md={12}>
          <Modal
            dialogClassName="large-modal"
            show={this.state.showMaintanceLogModal}
          >
            <Modal.Header class="header1">
              <div className="modal-close">
                <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => this.setState({ showMaintanceLogModal: false, editObj: null })}>{null}</a>
              </div>
              <Modal.Title>Update Maintenance Log</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <MaintenanceLogComponents
                {...this.props}
                showMaintanceLogModal={this.state.showMaintanceLogModal}
                handleCloseMaintanceLogModal={this.handleCloseMaintanceLogModal}
                code={this.state.code}
              />
            </Modal.Body>
          </Modal>
        </Col>
        <Col md={12}>
          {/* <Modal
            show={this.state.showAddMaintenanceModal}
            onHide={this.handleCloseMaintenanceModal}>
            <Modal.Header closeButton>
              <Modal.Title>Create Maintenance</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddMaintenanceModal
                maintenanceDate={this.state.maintenanceDate}
                handleCloseMaintenanceModal={this.handleCloseMaintenanceModal}
              />
            </Modal.Body>
          </Modal> */}
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
                views={['month', 'week', 'day', 'agenda']}
                // max={dates.add(new Date(), 1, 'month')}
                onNavigate={(date, view, action) => {
                  this.setState({ startDate: dates.firstVisibleDay(date), endDate: dates.lastVisibleDay(date) });
                }}
                onView={(view) => {
                  console.log(view)
                }}
              />
            }
          />
        </Col>
      </Row>
    );
  }
}

export default MaintenanceCalendarPage