import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Col, FormGroup } from "react-bootstrap";
import moment from "moment";
import Datetime from "react-datetime";
import Moment from 'moment';
import Select from "components/CustomSelect/CustomSelect.jsx";
import axios from "axios";

import Button from "components/CustomButton/CustomButton.jsx";
import { backendURL } from "variables/appVariables.jsx";

// import { getCustomerList, deleteCustomer } from "modules/crm/customers/server/CustomerServerComm.jsx";
import { getGRNReport } from "../server/ReportsServerComm"
import { getSocket } from "js/socket.io.js"
import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";

class grnReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      plantList: [],
      report: [],
      page: 0,
      pageSize: 10,
      pages: 0,
      loading: false,
      reportsFilter: {
        startDate: Moment().startOf('month'),
        endDate: Moment().endOf('month'),
        plant: null
      },
      socket: getSocket()
    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.search = this.search.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.clearSearchDate = this.clearSearchDate.bind(this);
    this.downloadExcleReport = this.downloadExcleReport.bind(this);
    this.exportToExcel = this.exportToExcel.bind(this);
    this.JSONToCSVConvertor = this.JSONToCSVConvertor.bind(this);
  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        this.state.socket.on("Reports", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }

  componentWillMount() {
    let _this = this;
    this.getSocketConnection();
    this.fetchDataFromServer();
    getPlantList("",
      function success(data) {
        _this.setState({
          plantList: data.rows.map((s) => {
            return {
              _id: s.id,
              value: s.id,
              label: s.name,
            }
          })
        });
        if (_this.state.plantList.length) {
          _this.handleDropDownChange(_this.state.plantList[0], "plant")
        }

      })
  }

  fetchDataFromServer() {
    this.search();
  }

  search(state) {
    let _this = this;
    let params = "";
    if (_this.state.plantList.length) {
      let tempReports = JSON.parse(JSON.stringify(this.state.reportsFilter))
      params += "&plant=" + tempReports.plant
      params += "&startDate=" + Moment(tempReports.startDate).format("DD-MM-YYYY")
      params += "&endDate=" + Moment(tempReports.endDate).format("DD-MM-YYYY")
      getGRNReport(params,
        function success(data) {
          console.log(data);
          var columns = [
            { Header: "Sr", accessor: "srNo", width: 50, Cell: (row => { return (<div>{row.index + 1}</div>) }) },
            { Header: "Date", accessor: "date", width: 150 },

          ]
          let tempData = data.grnReport.map((prop, key) => {
            if (key === 0) {
              prop.stores.map(grn => {
                columns.push({ Header: grn.name, accessor: grn.name })
                return true
              });
            }

            var row = { date: prop.date };
            prop.stores.map((grn) => {
              row[grn.name] = grn.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })
              // Footer: () => {
              //   var sum = _.sum(_.map(this.state.stores, (prop) => { return parseFloat(prop.total) }))
              //   return (
              //     <div className="actions-right">
              //       <strong>{parseFloat(sum).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              //     </div>
              //   )
              // }
              return true
            })
            return row;

          })
          _this.setState({ report: tempData, filteredData: tempData, columns: columns, loading: false })
        },
        function error(error) { _this.setState({ data: [], filteredData: [], loading: false }); }
      );
    }
  }
  successAlert(message) {
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title={message}
          onConfirm={() => { this.setState({ alert: null }); this.fetchDataFromServer() }}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
        >
        </SweetAlert>
      )
    });
  }
  errorAlert(message) {
    this.setState({
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

  handleDateChange(name, date) {
    var reportsFilter = this.state.reportsFilter;
    reportsFilter[name] = date._d;
    this.setState({ reportsFilter });
    this.search();
  }
  handleDropDownChange(selectOption, type) {
    var newFilter = this.state.reportsFilter;
    newFilter[type] = selectOption ? selectOption.value : null;
    this.fetchDataFromServer();
    this.setState({ reportsFilter: newFilter });
  }
  clearSearchDate() {
    var reportsFilter = this.state.reportsFilter;
    reportsFilter.startDate = Moment().startOf("month");
    reportsFilter.endDate = Moment().endOf("month");

    this.setState({ reportsFilter });
    this.search();
  }


  downloadExcleReport() {

    var reportsFilter = this.state.reportsFilter;
    this.setState({ reportsFilter });

    var _this = this;
    _this.setState({
      alert: (
        <SweetAlert
          info
          style={{ display: "block", marginTop: "-100px" }}
          // title="Download"
          onConfirm={() => { this.setState({ alert: null }); this.exportToExcel() }}
          onCancel={() => { this.setState({ alert: null }) }}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          confirmBtnText="Download"
          cancelBtnText="Cancel"
          showCancel
        >
          Download report from date <br />{moment(_this.state.reportsFilter.startDate).format("DD-MM-YYYY")} to {moment(_this.state.reportsFilter.endDate).format("DD-MM-YYYY")}.
        </SweetAlert>
      )
    });
  }



  exportToExcel() {

    var _this = this;
    _this.search();

    var url = backendURL
      + 'reports?startDate=' + Moment(_this.state.reportsFilter.startDate).format("DD-MM-YYYY")
      + '&endDate=' + Moment(_this.state.reportsFilter.endDate).format("DD-MM-YYYY");
    axios.get(url, { 'headers': { 'Authorization': 'Bearer ' + cookie.load('token') } })
      .then(function (res) {
        _this.JSONToCSVConvertor(_this.state.report, "Report", true)
      })
  }

  JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    var arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    var row = "";
    if (ShowLabel) {
      row = "";

      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {

        //Now convert each value to string and comma-seprated
        row += index + ',';
      }

      row = row.slice(0, -1);

      //append Label row with line break
      CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
      row = "";

      //2nd loop will extract each column and convert it in string comma-seprated
      for (var index2 in arrData[i]) {
        row += '"' + arrData[i][index2] + '",';
      }

      row.slice(0, row.length - 1);

      //add a line break after each row
      CSV += row + '\r\n';
    }

    if (CSV === '') {
      alert("Invalid data");
      return;
    }

    var fileName = "Grn Report";

    fileName += ReportTitle.replace(/ /g, "_");

    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var link = document.createElement("a");
    link.href = uri;

    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  render() {
    let table = (

      <Col xs={12}>
        {
          (!this.state.filteredData || !this.state.filteredData.length) ? (
            <div>No List found.</div>
          ) : (
              <div>
                <ReactTable
                  data={this.state.filteredData}
                  columns={this.state.columns}
                  minRows={0}
                  sortable={false}
                  className="-striped -highlight"
                  showPaginationTop={false}
                  showPaginationBottom={true}
                  loading={this.state.loading}
                  pages={this.state.pages}
                  defaultPageSize={defaultPageSize}
                  pageSizeOptions={pageSizeOptionsList}
                  manual
                //  onFetchData={this.fetchDataFromServer}
                />
              </div>
            )
        }
      </Col>
    );
    let header = (
      <div className="list-header">
        <Col xs={12} sm={6} md={3} lg={3} className="drop">
          <FormGroup>
            <Select
              clearable={false}
              placeholder="Select Location"
              name="plant"
              value={this.state.reportsFilter.plant ? this.state.reportsFilter.plant : null}
              options={this.state.plantList}
              onChange={(selectOption) => this.handleDropDownChange(selectOption, "plant")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={3} lg={2} className="date">
          <FormGroup>
            <Datetime
              timeFormat={false}
              closeOnSelect={true}
              dateFormat="DD-MM-YYYY"
              name="startDate"
              inputProps={{ placeholder: "Start Date" }}
              value={this.state.reportsFilter.startDate}
              // defaultValue={new Date()}
              // defaultValue={this.state.searchTripDetails.startDate}
              onChange={(date) => this.handleDateChange("startDate", date)}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={3} lg={2} className="date">
          <FormGroup>
            <Datetime
              timeFormat={false}
              closeOnSelect={true}
              dateFormat="DD-MM-YYYY"
              name="endDate"
              inputProps={{ placeholder: "End Date" }}
              value={this.state.reportsFilter.endDate}
              // defaultValue={this.state.searchTripDetails.endDate}
              onChange={(date) => this.handleDateChange("endDate", date)}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={12} md={3} lg={5}>
          <Button pullRight bsStyle="primary" fill style={{ backgroundColor: "#007233", border: "none" }} onClick={this.downloadExcleReport}>
            <i className=" fa fa-file-excel-o" /> Download Report
						</Button>
        </Col>
      </div>
    )
    return (
      <div>
        {this.state.loading ?
          <div className="modal-backdrop in">
            <img src={loader} alt="loader" className="preLoader" />
          </div>
          :
          <div>
            {this.state.alert}
            {header}
            {table}
          </div>
        }
      </div>
    );
  }
}

export default grnReport;