import moment from 'moment';
import Select from "react-select";
import Datetime from "react-datetime";
import React, { Component } from 'react';
import UploadComponent from 'components/Upload/UploadComponent.jsx';
import { errorColor } from 'variables/Variables.jsx';
import { getExpenseSingle } from '../server/HrmsServerComm.jsx'
import { listofReimbursementType } from 'variables/appVariables.jsx';
import Button from "components/CustomButton/CustomButton.jsx";
import { Modal, Row, ControlLabel, Col, FormGroup, Tooltip, OverlayTrigger, FormControl } from "react-bootstrap";

export default class AddEditExpenseModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            expense: {},
            isValid: {
                isCategory: null,
                isExpenseDate: null,
                isAmount: null
            }
        };
    }
    componentWillReceiveProps({ expense }) {
        if (expense) {
            this.setState({ expense })
        } else {
            this.setState({ expense: {} })
        }
    }
    handleMultipleDocumentChangeForDrawing = (newDocument) => {
        let tempObj = this.state.expense;
        tempObj.drawings[newDocument.split("/")[1].split("_")[2]].attachments.push(newDocument);
        this.setState({ expense: tempObj });
    }
    handleDeleteDocument = (key) => {
        let expense = this.state.expense;
        expense.documents.slice();
        expense.documents.splice(key, 1);
        this.setState({ expense });
    }
    handleMultipleDocumentChange = (newDocument) => {
        getExpenseSingle(this.state.expense._id, (documents) => {
            this.setState(prev => ({ ...prev, expense: { ...prev.expense, documents } }))
        })
    }
    handleSaveButton = () => {
        const { expense } = this.state;
        let isCategory = !expense.category ? false : true;
        let isExpenseDate = !expense.expenceDate ? false : true;
        let isAmount = !expense.amount ? false : true;
        expense.amount = expense.amount * 100;
        let error = !isCategory ? "select expense type" : !isExpenseDate ? "Select Expense date" : !isAmount ? "Enter amount" : ''
        !isCategory || !isExpenseDate || !isAmount ? this.setState(prev => ({ isValid: { ...prev.isValid, isCategory, isExpenseDate, isAmount }, error })) :
            this.props.handleFormSubmit(expense)
    }
    render() {
        const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
        return (
            <Modal show={this.props.show}
                onHide={this.props.handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title> Reimbursement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col xs={12}>
                        <Row>
                            <Col xs={12}>
                                <ControlLabel>Expense Type</ControlLabel>
                                <FormGroup>
                                    <Select
                                        type="text"
                                        placeholder="Select leave type"
                                        value={this.state.expense.category}
                                        options={listofReimbursementType}
                                        onChange={e => this.setState(prev => ({ ...prev, expense: { ...prev.expense, category: e.value } }))}
                                        style={{ color: this.state.isValid.isCategory === false ? errorColor : '', borderColor: this.state.isValid.isCategory === false ? errorColor : '' }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <FormGroup>
                                    <ControlLabel>Expense Date</ControlLabel>
                                    <Datetime
                                        closeOnSelect={true}
                                        inputProps={{ placeholder: "Select expense date", style: { color: this.state.isValid.isCategory === false ? errorColor : '', borderColor: this.state.isValid.isCategory === false ? errorColor : '' } }}
                                        value={this.state.expense.expenceDate ? moment(this.state.expense.expenceDate).format("DD-MMM-YYYY") : ""}
                                        onChange={e => this.setState(prev => ({ ...prev, expense: { ...prev.expense, expenceDate: e } }))}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <FormGroup>
                                    <ControlLabel>Amount</ControlLabel>
                                    <FormControl
                                        type="text"
                                        placeholder="Enter amount"
                                        value={this.state.expense.amount ? this.state.expense.amount : ""}
                                        onChange={(e) => {
                                            const amount = e.target.value;
                                            if (!amount || amount.match(/^\d{1,5}(\.\d{0,2})?$/)) {
                                                this.setState(prev => ({ ...prev, expense: { ...prev.expense, amount } }))
                                            }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <ControlLabel>Description</ControlLabel>
                                <FormGroup>
                                    <FormControl
                                        placeholder="Add description here..."
                                        componentClass="textarea"
                                        rows="3"
                                        className="calender-modal__reason"
                                        value={this.state.expense.description}
                                        onChange={({ target }) => this.setState(prev => ({ ...prev, expense: { ...prev.expense, description: target.value } }))}
                                    // onChange={e => this.setState({ description: e.target.value })}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        {/* <Col xs={12} sm={6} md={6} lg={6} style={{ marginTop: "15px" }}>
                            <UploadComponent
                                document
                                drawings
                                type="reimbursement"
                                documents={this.state.expense.documents}
                                details={this.state.expense}
                                dropText="Drop files or click here"
                                handleMultipleDocumentChange={this.handleMultipleDocumentChangeForDrawing}
                                handleDeleteDocument={this.handleDeleteDocument}
                            />
                        </Col> */}
                        {
                            !this.state.expense.code ? null :
                                <Row>
                                    <UploadComponent
                                        document
                                        type="reimbursement"
                                        documents={this.state.expense.documents}
                                        details={this.state.expense}
                                        dropText="Drop files or click here"
                                        handleMultipleDocumentChange={this.handleMultipleDocumentChange}
                                        handleDeleteDocument={this.handleDeleteDocument}
                                    />
                                </Row>
                        }
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
