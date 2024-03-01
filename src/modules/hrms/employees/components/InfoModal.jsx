import React from 'react'
import { Modal, Row, ControlLabel, Col, FormGroup, } from "react-bootstrap";
import moment from 'moment';

export default props => {
    return (
        <div>
            <Modal show={props.show}
                onHide={props.handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title> Leave Approval</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12}>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel>Leave Type:&nbsp;&nbsp;&nbsp;{props.infoEvent.title}</ControlLabel>
                                </FormGroup>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel>No of Days:&nbsp;&nbsp;&nbsp;{props.infoEvent.noOfDays}</ControlLabel>
                                </FormGroup>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel>Start Date:&nbsp;&nbsp;&nbsp;{moment(props.infoEvent.start).format("DD-MMM-YYYY")}</ControlLabel>
                                </FormGroup>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel>End Date:&nbsp;&nbsp;&nbsp;{moment(props.infoEvent.end).format("DD-MMM-YYYY")}</ControlLabel>
                                </FormGroup>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel>Supervisor :&nbsp;&nbsp;&nbsp;{props.supervisor}</ControlLabel>
                                </FormGroup>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel >Status:&nbsp;&nbsp;&nbsp;{props.infoEvent.status}</ControlLabel>
                                </FormGroup>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel >Reason:&nbsp;&nbsp;&nbsp;{props.infoEvent.reason}</ControlLabel>
                                </FormGroup>
                            </Col>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    )
}