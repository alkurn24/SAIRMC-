import React, { Component } from "react";
import { Modal, Col, OverlayTrigger, Tooltip, } from "react-bootstrap";
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import DesignationForm from "./DesignationForm"

import { getDesignationOrgChart, createOrgChart } from "../server/OrgchartServerComm.jsx";

export default class DesignationOrgChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employees: {},
            parent: null,
            employee: null,
            isAlart: false,
            alart: { message: "" },
            showEmployeeModal: false,
        }
    }
    componentWillMount() {
        getDesignationOrgChart("view=org", this.fetchDataFromServer, this.error);
    }
    fetchDataFromServer = employees => {
        this.setState({ employees })
    }
    error = err => {
        this.setState({
            showEmployeeModal: false,
            isAlart: true,
            alart: {
                onConfirm: () => this.setState({ isAlart: false }),
                cancelBtnBsStyle: "danger",
                confirmBtnText: "OK",
                showCancel: false,
                message: `Something Went Wrong.`,
                error: true
            }
        })
        console.log("err :", err);
    }
    nodeComponent = (node) => {
        const add = (<Tooltip id="add_tooltip">Add</Tooltip>);
        const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
        return (
            // <div className={node.node.creditLimit >= node.node.ledgerBalance ? "initechNode value-success" : "initechNode value-danger"}>
            <div className={"initechNode value-success"}>
                <Col xs={12} sm={12} md={12} lg={12}>
                    {/* <div className="" onClick={() => this.handleShowEmployeeModal(node, "edit")}>{node.node.name}</div> */}
                    <div>{node.node.name}</div>
                    {node.node.name === undefined ?
                        null
                        :
                        <OverlayTrigger placement="top" overlay={edit}>
                            <a role="button" className="fa fa-edit text-primary" style={{ marginLeft: "10px" }} onClick={() => this.handleShowEmployeeModal(node, "edit")}  >{null}</a>
                        </OverlayTrigger>
                    }

                    <OverlayTrigger placement="top" overlay={add}>
                        <a role="button" className="fa fa-plus text-primary" style={{ marginLeft: "10px" }} onClick={() => this.handleShowEmployeeModal(node, "new")}  >{null}</a>
                    </OverlayTrigger>
                    {/* {
                node.node.children && node.node.children.length === 0
                ? <a className="fa fa-trash" style={{ marginRight: "5px" }} onClick={() => this.handleDeleteEmployee(node)}>{null}</a>
                : null
              } */}

                </Col>
            </div>
        );
    }

    handleShowEmployeeModal = ({ node }, type) => {
        this.setState({
            parent: type === "new" ? node : null,
            level: type === "new" ? node.level : null,
            employee: type === "new" ? null : node,
            showEmployeeModal: true
        });
    }
    handleFormSubmit = data => {
        createOrgChart(data, this.handleSuccess, this.error);
    }
    handleSuccess = res => {
        getDesignationOrgChart("view=org", this.fetchDataFromServer, this.error);
        this.setState({
            showEmployeeModal: false,
            isAlart: true,
            alart: {
                onConfirm: () => this.setState({ isAlart: false }),
                title: "Sucessful",
                cancelBtnBsStyle: "success",
                confirmBtnText: "OK",
                cancelBtnText: "Cancel",
                showCancel: false,
                message: "Node added successfully.",
                confirmBtnBsStyle: "success",
                success: true
            }
        })
    }
    handleHideEmployeeModal = () => {
        this.setState({
            parent: null,
            employee: null,
            showEmployeeModal: false
        });
        getDesignationOrgChart("view=org", this.fetchDataFromServer, this.error);
    }
    handleDeleteEmployee = (node) => {

    }
    render() {
        let employeeViewModal = (
            <Modal
                show={this.state.showEmployeeModal}
                onHide={this.handleHideEmployeeModal}
            >
                <Modal.Header closeButton>Add/Edit Designation</Modal.Header>
                <Modal.Body>
                    <DesignationForm
                        handleFormSubmit={this.handleFormSubmit}
                        parent={this.state.parent}
                        employee={this.state.employee ? this.state.employee : null} />
                </Modal.Body>
                {/* <Modal.Footer></Modal.Footer> */}
            </Modal>
        )
        return (
            <div>
                <Col xs={12} sm={12} md={12} lg={12}>
                    {employeeViewModal}
                    <OrgChart tree={this.state.employees} NodeComponent={this.nodeComponent} />
                </Col>
                <SweetAlert
                    show={this.state.isAlart} style={{ display: "block", marginTop: "-100px" }}
                    onCancel={() => this.setState({ isAlart: false })}
                    onConfirm={() => this.setState({ isAlart: false })}
                    title=''
                    {...this.state.alart}>
                    {this.state.alart.message}
                </SweetAlert>
            </div>
        )
    }
}