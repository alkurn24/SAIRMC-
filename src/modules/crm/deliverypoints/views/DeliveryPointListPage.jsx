import React, { Component } from "react";
import { Modal, Col } from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import DeliveryPointListComponent from "../components/DeliveryPointListComponent.jsx";
import DeliveryPointFormComponent from "../components/DeliveryPointFormComponent"

class DeliveryPointListPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showDeliveryPointModal: false
		}
	}
	render() {
		return (
			<div className="main-content" style={{ marginTop: "50px" }}>
			<Modal
          show={this.state.showDeliveryPointModal}
          onHide={() => this.setState({ showDeliveryPointModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Add/Update Delivery Point</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DeliveryPointFormComponent 
              deliverypoint={{ }}
              {...this.props}
            />
          </Modal.Body>
        </Modal>
				<Col md={8} mdOffset={2}>
					<Card
						content={
							<div style={{ marginTop: "50px" }}>
								{/* <div style={{ position: "absolute", top: "-23px", right: "20px" }}>
									<Button round bsStyle="primary" fill style={{ height: "45px", width: "45px" }} onClick={() => this.setState({ showDeliveryPointModal: true })}>
										<i className="fa fa-plus" style={{ paddingRight: "8px" }} />
									</Button>
								</div> */}
								<DeliveryPointListComponent {...this.props}></DeliveryPointListComponent>	
							</div>
						}
					/>
				</Col>
			</div>
		);
	}
}

export default DeliveryPointListPage;
