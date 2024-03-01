import React, { Component } from "react";
import { Modal, FormGroup, ControlLabel, Tooltip, OverlayTrigger, FormControl, Row, Col } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert"; import ReactTable from "react-table";

import Button from "components/CustomButton/CustomButton.jsx";

class TestStepsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: "",
      steps: props.steps ? props.steps : [],
      testSteps: {
        code: null,
        refNo: "",
        description: "",
        parameter: null,
        stepInput: [],
        formula: [],
        testEquipment: null,
        estMan: 0,
        estMachine: 0,
        estMaterial: 0,
        estMethod: 0,
        estMoney: 0
      },
      showTestStepsModal: false,
      assets: []
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
    this.create = this.create.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.moveStep = this.moveStep.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
    this.renderEditableFormulaMaster = this.renderEditableFormulaMaster.bind(this);
    this.renderEditableStepInputMaster = this.renderEditableStepInputMaster.bind(this);
    this.renderEditableFormula = this.renderEditableFormula.bind(this);
    this.renderEditableStepInput = this.renderEditableStepInput.bind(this);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.steps !== this.state.steps) {
      this.setState({ steps: newProps.steps })
    }
  }
  handleRadio(e) {
    var newObj = this.state.testSteps;
    newObj[e.target.name] = e.target.value
    this.setState({ newObj })
  };
  handleInputChange(e) {
    var newObj = this.state.testSteps;
    if (e.target) {
      newObj[e.target.name] = e.target.value;
      this.setState({ testSteps: newObj });
    } else {
      newObj.type = e.value;
      this.setState({ testSteps: newObj, formError: null });
      (e.value === "") ?
        this.setState({ [e.target.name + "Valid"]: false }) :
        this.setState({ [e.target.name + "Valid"]: true })
    }
  }
  create() {

  }
  validationCheck() {
    this.save()
  }
  save() {
    if (!this.state.testSteps._id) {
      let temp = this.state.testSteps
      temp._id = "dummy"
      this.setState({ temp })
      this.state.steps.push(this.state.testSteps)
    }
    this.props.handleTestStepChange(this.state.steps)
    this.setState({
      showTestStepsModal: false, testSteps: {
        description: "",
        parameter: null,
        stepInput: [],
        formula: [],
        testEquipment: null,
        estMan: 0,
        estMachine: 0,
        estMaterial: 0,
        estMethod: 0,
        estMoney: 0
      }
    })
  }
  delete(id) {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.deleteConfirm(id)}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this test step!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(id) {
    let tempObj = this.state.log;
    tempObj.maintenanceData.splice(id, 1);
    this.setState({ tempObj });
    this.successAlert("Test step deleted successfully!")

  }
  successAlert(message) {
    this.setState({
      showTestStepsModal: false,
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
  errorAlert(message) {
    this.setState({
      showTestStepsModal: false,
      alert: (
        <SweetAlert
          error
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
  handleCheckedChange(e) {
    var newtestSteps = this.state.testSteps;
    newtestSteps[e.target.name] = e.target.checked;
    this.setState({ testSteps: newtestSteps, [e.target.name + 'Valid']: true, formError: "" });
  }
  handleDropDownChange(type, selectOption) {
    var newtestSteps = this.state.testSteps;
    newtestSteps[type] = selectOption ? selectOption : null;
    this.setState({ testSteps: newtestSteps, [type + "Valid"]: true });
  }
  moveStep(from, to) {
    let temp = this.state.steps
    temp.splice(to, 0, temp.splice(from, 1)[0]);
    this.setState({ temp })
    this.props.handleTestStepChange(this.state.steps)
  }
  renderEditable(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          type="text"
          min={0}
          value={this.state.steps[cellInfo.index] ? this.state.steps[cellInfo.index][cellInfo.column.id] : 0}
          onChange={(e) => {
            let tempObj = this.state.steps;
            tempObj[cellInfo.index][cellInfo.column.id] = e.target.value;
            this.setState({ tempObj });

          }}
        />
      </FormGroup>
    );
  }
  renderEditableFormulaMaster(cellInfo) {
    let index = this.props.testData.indexOf(this.props.testData.filter(x => { return x.name === cellInfo.column.id })[0])
    if (this.props.testData[index].inputType === "Observation") {
      return (<div>Input</div>)

    } else {
      return (
        <FormGroup>
          <FormControl
            type="text"
            min={0}
            value={this.state.steps[cellInfo.index] ? this.state.steps[cellInfo.index][cellInfo.column.id] : 0}
            onChange={(e) => {
              let tempObj = this.state.steps;
              tempObj[cellInfo.index][cellInfo.column.id] = e.target.value;
              this.setState({ tempObj });

            }}
          />
        </FormGroup>
      );
    }
  }
  renderEditableStepInputMaster(cellInfo) {
    // let index = this.props.testData.indexOf(this.props.testData.filter(x => { return x.name === cellInfo.column.id })[0])
    if (!this.state.steps[cellInfo.index].stepInput) {
      return null
    } else {
      return (
        <input
          type="checkbox"
          number="stepInput"
          name="stepInput"
          checked={this.state.steps[cellInfo.index].stepInput[cellInfo.index]}
          onChange={(e) => {
            let tempObj = this.state.steps;
            tempObj[cellInfo.index].stepInput[cellInfo.index] = e.target.checked;
            this.setState({ tempObj })
          }} />
      );
    }
  }
  renderEditableFormula(cellInfo) {
    if (cellInfo.original.inputType === "Observation") {
      return null
    } else {
      return (
        <div
          style={{ border: "1px lightgrey solid", paddingLeft: "5px" }}
          contentEditable
          suppressContentEditableWarning
          onBlur={e => {
            let tempObj = this.state.testSteps;
            tempObj.formula[cellInfo.index] = e.target.innerHTML;
            this.setState({ tempObj })
          }}
          dangerouslySetInnerHTML={{
            __html: this.state.testSteps.formula[cellInfo.index]
          }}
        />
      );
    }
  }
  renderEditableStepInput(cellInfo) {
    if (cellInfo.original.inputType !== "Observation") {
      return null
    } else {
      return (
        <input
          type="checkbox"
          number="stepInput"
          name="stepInput"
          checked={this.state.testSteps.stepInput[cellInfo.index]}
          onChange={(e) => {
            let tempObj = this.state.testSteps;
            tempObj.stepInput[cellInfo.index] = e.target.checked;
            this.setState({ tempObj })
          }}
        />
      );
    }
  }
  render() {
    const add = (<Tooltip id="edit_tooltip">Add new test step</Tooltip>);
    let testStepsModal = (
      <Modal
        dialogClassName="large-modal"
        show={this.state.showTestStepsModal}
        onHide={() => this.setState({ showTestStepsModal: false })}>
        <Modal.Header closeButton>
          <Modal.Title>Add/Edit Test Step</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Col xs={12} sm={3} md={2} lg={2}>
                <FormGroup>
                  <ControlLabel>Ref No</ControlLabel>
                  <FormControl
                    name="refNo"
                    type="number"
                    placeholder=""
                    default={this.state.testSteps.length + 1}
                    value={this.state.testSteps.refNo}
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={10} lg={10}>
                <FormGroup>
                  <ControlLabel>Description</ControlLabel>
                  <FormControl
                    name="description"
                    type="text"
                    placeholder="Enter description"
                    value={this.state.testSteps.description}
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Col>

            <Col xs={12} sm={12} md={12} lg={12}>
              <FormGroup>
                <ControlLabel>Define Test Data</ControlLabel>
              </FormGroup>
              <ReactTable
                data={this.props.testData}
                minRows={0}
                className="-striped -highlight"
                showPaginationTop={false}
                showPaginationBottom={false}
                sortable={false}
                columns={[
                  { Header: "Sr", width: 50 },
                  { Header: "Step Input", accessor: "stepInput", width: 100, Cell: this.renderEditableStepInput },
                  { Header: "Name", accessor: "name" },
                  { Header: "Type", accessor: "dataType" },
                  { Header: "Input Type", accessor: "inputType" },
                  { Header: "Formula", accessor: "formula", Cell: this.renderEditableFormula },
                ]}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Col xs={12} sm={12} md={12} lg={12}>
          <small className="text-danger">{this.state.formError}</small>
        </Col>
        <Modal.Footer>
          <Button bsStyle="success" fill onClick={this.validationCheck}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
    let colDefs = [
      { Header: "Sr", id: "slno", Cell: d => { return <div>{d.index + 1}</div> }, width: 50 },
      { Header: "Ref", accessor: "refNo", width: 50, Cell: this.renderEditable },
      {
        Header: "Move", id: "position", width: 50, Cell: (row) => {
          return (
            <div>
              {
                row.index >= 1
                  ? <a className="fa fa-arrow-up" onClick={() => this.moveStep(row.index, row.index - 1)} />
                  : <a className="fa" />
              }
              {
                row.index < this.state.steps.length - 1
                  ? <a className="fa fa-arrow-down" onClick={() => this.moveStep(row.index, row.index + 1)} />
                  : null
              }

            </div>
          )
        }
      },
      { Header: "Description", accessor: "description", width: 300, Cell: this.renderEditable }
    ];
    this.props.testData.map((prop, key) => {
      let colName = prop.name + " [" + parseInt(key + 1) + "]"
      colDefs.push({
        Header: colName, id: prop.name, Cell: this.renderEditableFormulaMaster
        // Cell: (row) => { 
        //   return (<div>{this.state.steps[row.index].formula[key]}</div>)
        // }
      })
    })


    let testStepsTable = (
      <div>
        <Col xs={12}>
          {
            this.state.steps.length ?
              (
                <ReactTable
                  data={this.state.steps}
                  sortable={false}
                  minRows={0}
                  showPaginationTop={false}
                  showPaginationBottom={false}
                  className="-striped -highlight"
                  columns={colDefs}
                />
              )
              : <div>No test steps found.</div>
          }
        </Col>
      </div>
    );
    return (
      <div>
        {this.state.alert}
        {testStepsModal}
        {testStepsTable}
        <Col md={12}>
          <OverlayTrigger placement="top" overlay={add}>
            <Button bsStyle="primary" fill icon
              disabled={!this.props.testData.length}
              onClick={() => {
                let tempObj = this.state.steps;
                tempObj.push({
                  code: null,
                  refNo: parseInt(this.state.steps.length + 1),
                  description: "",
                  parameter: null,
                  stepInput: [],
                  formula: [],
                  testEquipment: null,
                  estMan: 0,
                  estMachine: 0,
                  estMaterial: 0,
                  estMethod: 0,
                  estMoney: 0
                })
                this.setState({ tempObj })
              }}>
              <span className="fa fa-plus"></span>
            </Button>
          </OverlayTrigger>
          <div hidden={this.props.testData.length > 0}>Please add atleast one test data.</div>
        </Col>
      </div>
    )
  }
}

export default TestStepsComponent;