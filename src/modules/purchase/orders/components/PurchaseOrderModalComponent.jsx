import React, { Component } from "react";
import { Modal } from "react-bootstrap";

import PurchaseModuleFormComponent from "./PurchaseModuleFormComponent";

class PurchaseOrderModalComponent extends Component {
  componentWillReceiveProps(newProps) {
    this.props = newProps
  }
  render() {
    return (
      <Modal
        dialogClassName="large-modal"
        show={this.props.showPurchaseOrderModal}>
        <Modal.Header >
          <div className="modal-close">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => this.props.handleClosePurchaseOrderModal()}>{null}</a>
          </div>
          <Modal.Title>Create New Purchase Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PurchaseModuleFormComponent {...this.props} modal />
        </Modal.Body>
      </Modal>
    )
  }
}

export default PurchaseOrderModalComponent;