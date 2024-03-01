import React, { Component } from "react";
import ReactTable from "react-table";
import { Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import Moment from "moment";

import Button from "components/CustomButton/CustomButton.jsx";

import { getGrnList, } from "../../purchase/grn/server/GrnServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import GrnModalComponent from "modules/purchase/grn/components/GrnModalComponent.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";

class GrnScheduleFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grnList: [],
      filteredList: [],
      loading: true,
      page: 0,
      pageSize: 25,
      pages: 0,
      socket: getSocket(),
      showRecipeModal: false
    };

    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.handleShowGrnModal = this.handleShowGrnModal.bind(this);
    this.handleCloseGrnModal = this.handleCloseGrnModal.bind(this);
  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        console.log(this.state.socket)
        this.state.socket.on("grn", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }
  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer()
  }
  fetchDataFromServer() {
    let _this = this;
    let params = "";
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    params = params + "&status=Planned"
    getGrnList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempData = data.rows.map((prop, key) => {
          return {
            srNo: key + 1,
            date: Moment(prop.createdAt).format("DD MMM YYYY"),
            challanDate: prop.challanDate ? Moment(prop.challanDate).format("DD MMM YYYY") : "",
            status: prop.status ? prop.status : "",
            challanNo: prop.challanNo ? prop.challanNo : null,
            plant: prop.plant ? prop.plant.name : "",
            code: prop.code ? prop.code : "",
            emptyWeight: prop.emptyWeight ? prop.emptyWeight : 0,
            loadedWeight: prop.loadedWeight ? prop.loadedWeight : 0,
            isQa: prop.order ? prop.order.isQa : false,
            number: prop.number ? prop.number : "",
            grnData: prop.grnData ? prop.grnData : "",
            billingAddr: prop.order ? prop.order.billingAddr.name : null,
            order: (<a className="edit-link" href={"#/purchase/orders-edit/" + prop.order.code}>{prop.order.number}</a>),
            vendor: (<a className="edit-link" href={"#/purchase/vendor-edit/" + prop.order.vendor.code}>{prop.order.vendor.name}</a>),

          };
        })
        _this.setState({ grnList: tempData, pages: pages, loading: false })
      },
      function error(error) { _this.setState({ grnList: [], filteredList: [], loading: false }); }
    );
  }
  handleShowGrnModal(order) { this.setState({ showGrnModal: true, order: order }); }
  handleCloseGrnModal() {
    this.setState({ showGrnModal: false, });
    window.location.reload();
  }



  render() {
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
    var srNoCol =
    {
      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
        let base = ((this.state.page) * this.state.pageSize)
        return (<div>{base + d.index + 1}</div>)
      })
    }
    var dateCol = { Header: "Date", accessor: "date", width: 130, sortable: false }
    var statusCol = { Header: "Status", accessor: "status", width: 150, sortable: false }
    var codeCol = { Header: "Code", accessor: "number", width: 120, sortable: false }
    var isQaCol = {
      Header: "ISQA",
      accessor: "isQa", width: 50,
      Cell: ({ original }) => {
        return (
          original.isQa
            ? <div><span className="fa fa-check" style={{ color: "darkgreen" }}></span></div>
            : <div><span className="fa fa-times" style={{ color: "red" }}></span></div>
        )
      },
    }
    var challanCol = { Header: "challan Number", accessor: "challanNo", sortable: false }
    var emptyWeightCol = { Header: "empty Weight", accessor: "emptyWeight", width: 120, sortable: false }
    var loadedWeightCol = { Header: "loaded Weight", accessor: "loadedWeight", width: 120, sortable: false }
    var challanDateCol = {
      Header: "challan Date", accessor: "challanDate", width: 150, sortable: false, Cell: (row => {
        return (
          row.original.challanDate !== null ?
            <div>
              {row.original.challanDate}
            </div>
            :
            <div>--</div>
        )
      })
    }
    var billingAddrCol = {
      Header: "billing Address", accessor: "billingAddr", width: 300, sortable: false, Cell: (row => {
        return (
          row.original.billingAddr !== null ?
            <div>
              {row.original.billingAddr}
            </div>
            :
            <div>--</div>
        )
      })
    }
    var plantCol = { Header: "Location", accessor: "plant", width: 200, sortable: false }
    var orderCol = { Header: "PO Code", accessor: "order", width: 120, sortable: false }
    var vendorCol = { Header: "Vendor", accessor: "vendor", width: 300, sortable: false }
    var actionsCol = {
      Header: "", accessor: "code", width: 30,
      Cell: (row => {
        return (
          <div className="actions-right">
            <OverlayTrigger placement="top" overlay={edit}>
              <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.handleShowGrnModal(row.original.code)} ><span className="fa fa-edit text-primary"></span></Button>
            </OverlayTrigger>

          </div>
        )
      })
    }
    let table = (
      <Col xs={12}>
        {
          this.state.grnList.filter(x => { return x.isQa }).length ?
            <Row>
              <div>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <ReactTable
                    columns={
                      [srNoCol, dateCol, codeCol, statusCol, orderCol, isQaCol, vendorCol, billingAddrCol, challanCol, challanDateCol, loadedWeightCol, emptyWeightCol, plantCol, actionsCol]
                    }
                    data={this.state.grnList.filter(x => { return x.isQa })}
                    minRows={0}
                    sortable={false}
                    className="-striped -highlight"
                    showPaginationTop={false}
                    showPaginationBottom={true}
                    loading={this.state.loading}
                    page={this.state.page}
                    pageSize={this.state.pageSize}
                    pages={this.state.pages}
                    defaultPageSize={defaultPageSize}
                    pageSizeOptions={pageSizeOptionsList}
                    manual
                    onPageChange={(page) => { this.setState({ page: page }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                    onPageSizeChange={(pageSize) => { this.setState({ pageSize: pageSize, page: 0 }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                  />
                </Col>
              </div>
            </Row>
            :
            <div> No GRN found.</div>
        }
      </Col>
    );
    let addEditGrnModal = (
      <GrnModalComponent
        showGrnModal={this.state.showGrnModal}
        handleCloseGrnModal={this.handleCloseGrnModal}
        order={this.state.order}
        {...this.props}
      />
    );

    return (
      <div>
        {this.state.loading ?
          <div className="modal-backdrop in">
            <img src={loader} alt="loader" className="preLoader" />
          </div>
          :
          < div>
            {this.state.alert}
            {addEditGrnModal}
            {table}
          </div>
        }
      </div>

    )
  }
}

export default GrnScheduleFormComponent;
