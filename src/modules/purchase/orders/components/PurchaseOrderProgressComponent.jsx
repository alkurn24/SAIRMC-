import React, { Component } from "react";
import Moment from "moment";

class SalesModuleProgressComponent extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ul className="request-progress">
        <li className={this.props.module.createdAt ? "active" : ""}>
          Created<br />
          <div className="progress-detail">{this.props.module.createdAt ? Moment(this.props.module.createdAt).format("DD MMM YYYY hh:mm A") : null}</div>
        </li>
        <li className={this.props.module.receivingTime ? "active" : ""}>
          Receiving<br />
          <div className="progress-detail">{this.props.module.receivingTime ? Moment(this.props.module.receivingTime).format("DD MMM YYYY hh:mm A") : null}</div>
        </li>
        {/* <li className={this.props.module.approvedTime ? "active" : ""}>
          Approved<br />
          <div className="progress-detail">{this.props.module.approvedTime ? Moment(this.props.module.approvedTime).format("DD MMM YYYY hh:mm A") : null}</div>
        </li> */}
        <li className={this.props.module.closedTime ? "active" : ""}>
          Closed<br />
          <div className="progress-detail">{this.props.module.closedTime ? Moment(this.props.module.closedTime).format("DD MMM YYYY hh:mm A") : null}</div>
        </li>
        {/* <li className={this.props.module.paidTime ? "active" : ""}>
          Paid<br />
          {this.props.module.status === "Paid" ?
            <div className="progress-detail">{this.props.module.paidTime ? Moment(this.props.module.paidTime).format("DD MMM YYYY hh:mm A") : null}</div>
            : null
          }
        </li> */}

      </ul>
    )
  }
}

export default SalesModuleProgressComponent;
