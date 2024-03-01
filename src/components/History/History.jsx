import React, { Component } from "react";
// import { Col } from "react-bootstrap";
import ReactTable from "react-table";
import Moment from "moment";

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: []
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ history: (nextProps && nextProps !== undefined) ? nextProps.history : [] });
  }
  render() {
    return (
      <div>
        <ReactTable
          data={this.state.history}
          columns={[
            {
              Header: "Sr",
              id: "slno",
              Cell: d => { return <div>{d.index + 1}</div> },
              width: 50
            },
            {
              Header: "Date",
              id: "date",
              Cell: d => { return <div>{Moment.utc(d.original.createdAt).format("DD/MM/YYYY")}</div> },
              width: 200
            },
            {
              Header: "Info",
              accessor: "info"
            }
          ]}
          minRows={0}
          maxRows={10}
          sortable={false}
          defaultPageSize={10}
          showPaginationTop={false}
          showPaginationBottom={false}
          className="-striped -highlight"
          style={{ maxHeight: "70vh" }}
        />
      </div>
    );
  }
}

export default History;