import React, { Component } from "react";

export class StatsCard extends Component {
  render() {
    return (
      <div className="card card-stats">
        <div className="content">
          <div className="row">
            <div className="col-xs-3">
              <div className="icon-big text-center icon-warning">
                {this.props.bigIcon}
              </div>
            </div>
            <div className="col-xs-9">
              <div className="numbers">
                <p>{this.props.statsText}</p>
                {this.props.statsValue}
                <br />
                {this.props.statsValue2}
              </div>
            </div>
          </div>
        </div>
        <div className="stateCard-footer">
          <hr />
          <div className="stats">
            {this.props.statsIcon} {this.props.statsIconText}
          </div>
        </div>
      </div>
    );
  }
}

export default StatsCard;
