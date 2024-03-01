import React, { Component } from "react";
import Select from "react-select";
import ReactTable from "react-table";
import { parseTwoDigitYear } from "moment";
import { Parser } from "expr-eval"
import { Row, Col, FormGroup, ControlLabel } from "react-bootstrap";

class TestResultFormComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTest: null,
      selectedTestIndex: 0,
      tests: []
    }
    this.renderEditable = this.renderEditable.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.calculateResults = this.calculateResults.bind(this);
  }
  componentDidMount() {
    this.setState({
      tests: this.props.samples[this.props.index].tests
      // tests: this.props.tests.map(prop => {
      //   return {
      //     testcase: prop.id,
      //     result: {
      //       sample: this.props.sample.code,
      //       values: prop.steps.map(() => {
      //         return 0
      //       })
      //     }
      //   }
      // })
    })
  }
  handleDropDownChange(type, selectOption) {
    if (selectOption) {
      var temp = this.state.selectedTest;
      var tests = this.state.tests;
      var index = tests.indexOf(selectOption)
      this.setState({ selectedTest: tests[index] });
    } else {
      this.setState({ selectedTest: null })
    }
  }
  renderEditable(cellInfo) {
    let index = this.state.selectedTest.testData.indexOf(this.state.selectedTest.testData.filter(x => { return x.name === cellInfo.column.id })[0])
    if (this.state.selectedTest.testData[index].inputType !== "Observation") {
      return (<div>{this.state.selectedTest.result[cellInfo.index][index]}</div>)
    } else {
      return (
        <div
          style={{ border: "1px lightgrey solid", paddingLeft: "5px" }}
          contentEditable
          suppressContentEditableWarning
          onBlur={e => {
            let tempObj = this.state.selectedTest;
            tempObj.result[cellInfo.index][index] = e.target.innerHTML
            this.setState({ tempObj })
            this.calculateResults();
          }}
          dangerouslySetInnerHTML={{
            __html: this.state.selectedTest.result[cellInfo.index][index]
          }}
        />
        
      );
    }
  }
  
  calculateResults() {
    let tempObj = this.state.selectedTest;
    tempObj.steps.map((step, key) => {
      tempObj.testData.map((data, key1) => {
        if (data.inputType === "Calculation") {
          let formula = tempObj.result[key][key1] = step.formula[key1]
          if (!formula || formula.trim() === "") return
          let pattern = /\[([^\]]*)]/g;
          let vars = [], result = []
          while ((result = pattern.exec(formula)) != null) {
            vars.push(result[1])
          }
          vars.map(var1 => {
            let rowCol = var1.split('-')
            let rowIndex = parseInt(rowCol[0] - 1)
            let colIndex = parseInt(rowCol[1] - 1)
            let value = tempObj.result[rowIndex][colIndex] !== "" ? tempObj.result[rowIndex][colIndex] : 0
            formula = formula.replace("[" + var1 + "]", value)
          })
          try {
            var expr = Parser.evaluate(formula)
          } catch (err) {
            return;
          }
          return tempObj.result[key][key1] = expr.toFixed(2)
        } else if (data.inputType === "Constant") {
          return tempObj.result[key][key1] = step.formula[key1]
        } else return
      })
    })
    this.setState({ tempObj })
  }
  render() {
    let colDefs = [
      { Header: "SR", id: "slno", Cell: d => { return <div>{d.index + 1}</div> }, width: 50 },
      { Header: "Description", accessor: "description", width: 350 }
    ];
    if (this.state.selectedTest) {
      this.state.selectedTest.testData.map((prop, key) => {
        let colName = prop.name + " [" + parseInt(key + 1) + "]"
        colDefs.push({
          Header: colName, id: prop.name, Cell: this.renderEditable
          // Cell: (row) => { 
          //   return (<div>{this.state.steps[row.index].formula[key]}</div>)
          // }
        })
      })
    }

    return (
      <Row>
        <Col md={12}>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Select Test</ControlLabel>
              <Select
                placeholder="Select test"
                name="test"
                value={this.state.selectedTest && this.state.selectedTest.value ? this.state.selectedTest.value : this.state.selectedTest}
                options={this.state.tests}
                onChange={(selectOption) => this.handleDropDownChange("selectedTest", selectOption)}
              />
            </FormGroup>
          </Col>
        </Col>
        <Col md={12}>
          {
            this.state.selectedTest
              ? (
                <ReactTable
                  data={this.state.selectedTest.steps}
                  columns={colDefs}
                  minRows={0}
                  sortable={false}
                  className="-striped -highlight"
                  showPaginationTop={false}
                  showPaginationBottom={false}
                />
              ) : null
          }

        </Col>
      </Row>
    );
  }
}

export default TestResultFormComponent;
