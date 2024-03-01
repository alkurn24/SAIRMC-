import React, { Component } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';


class CustomSweetAlert extends Component {

  render() {
    const { t } = this.props;
    return (
      <SweetAlert
        success={this.props.success ? "success" : ""}
        warning={this.props.warning ? "warning" : ""}
        danger={this.props.error ? "danger" : ""}

        showCancel={this.props.showCancel}
        confirmBtnText={this.props.confirmBtnText ? t(this.props.confirmBtnText) : "OK"}
        confirmBtnBsStyle={this.props.confirmBtnBsStyle ? "danger" : ""}
        cancelBtnBsStyle={this.props.cancelBtnBsStyle ? "default" : ""}
        onCancel={this.props.onCancel}
        cancelBtnText={this.props.cancelBtnText ? t(this.props.cancelBtnText) : ""}


        style={{ display: "block", marginTop: "-100px", width: "50%" }}
        title={(this.props.message)}
        onConfirm={this.props.onConfirm}
        showConfirm={true}
      >
      </SweetAlert>
    )
  }
}

export default CustomSweetAlert;