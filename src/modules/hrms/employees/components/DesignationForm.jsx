import React, { Component } from "react";
import { Row, Col, OverlayTrigger, Tooltip, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Select from "components/CustomSelect/CustomSelect.jsx";
import SweetAlert from "react-bootstrap-sweetalert";
import cookie from "react-cookies";
import UploadComponent from 'components/Upload/UploadComponent.jsx';
import Button from "components/CustomButton/CustomButton.jsx";
import { selectOptionsUserRoles } from "variables/appVariables.jsx";
import { errorColor } from 'variables/appVariables.jsx';



export default class DesignationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.employee ? props.employee.name : '',
            parent: props.parent,
            employee: props.employee,
            id: props.employee ? props.employee.id : '',
            picture: "",
            error: "",
            isValid: {
                isDesignation: null,
                isParent: null
            }
        }
    }
    // static getDerivedStateFromProps = (props, state) => {
    //     const obj = {}
    //     if (props.employee !== state.employee || props.parent !== state.parent) {
    //         if (props.employee) { obj.name = props.employee.name, obj.id = props.employee.id }
    //         if (props.employee !== state.employee) { obj.employee = props.employee; }
    //         if (props.parent !== state.parent) { obj.parent = props.parent; }
    //         return obj;
    //     } else {
    //         return null
    //     }
    // }
    handleFormSubmit = () => {
        const { name, parent, id } = this.state;
        const _parent = parent ? parent.id : null;
        const level = parent ? parent.level + 1 : null;
        const isDesignation = !name ? false : true;
        // const isParent = !level ? !_parent ? false : true : true
        // !isDesignation || !isParent ? this.setState(prev => ({ error: "Enter required fields", isValid: { ...prev.isValid, isDesignation, isParent } })) :
        !isDesignation ? this.setState(prev => ({ error: "Please enter required fields", isValid: { ...prev.isValid, isDesignation } })) :
            this.props.handleFormSubmit({ name, _parent, level, id })
    }
    handleInputChange = (val, key) => {
        this.setState({ [key]: val })
    }
    render() {
        const save = <Tooltip id="save_tooltip">Save</Tooltip>;
        let form = (
            <Col xs={12}>
                <Col xs={12} sm={12} md={12} lg={12}>
                    <FormGroup>
                        <ControlLabel>Designation<span className="star">*</span></ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Enter designation"
                            value={this.state.name}
                            onChange={e => this.handleInputChange(e.target.value, "name")}
                            className={this.state.isValid.isDesignation || this.state.isValid.isDesignation === null ? "" : "error"}
                        />
                    </FormGroup>
                </Col>
                {/* <Col md={12} lg={12} sm={12} xs={12}>
                    <FormGroup>
                        <ControlLabel>successor<span className="star">*</span></ControlLabel>
                        <Select
                            placeholder="Select parent"
                            options={this.state.listOfEmployees}
                            value={this.state.parent ? this.state.parent._parent : ""}
                            onChange={({ value }) => this.handleDropDownChange(value, "_parent")}
                        />
                    </FormGroup>
                </Col> */}
            </Col>
        );
        let actions = (
            <Col xs={12} sm={12} md={12} lg={12}>
                <center>
                    <h6 className="text-danger">{this.state.error}</h6>
                </center>
                <OverlayTrigger placement="top" overlay={save}>
                    <Button
                        bsStyle="success" fill icon pullRight style={{ marginLeft: "15px" }} onClick={this.handleFormSubmit}>
                        <span className="fa fa-save" />
                    </Button>
                </OverlayTrigger>
            </Col>
        );
        return (
            <Row className="card-content">
                <div className="card-form ">{form}</div>
                <div className="card-footer">{actions}</div>
            </Row>
        );
    }
}
