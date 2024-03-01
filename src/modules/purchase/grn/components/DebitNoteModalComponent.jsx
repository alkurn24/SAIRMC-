import React, { Component } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import ReactToPrint from "react-to-print";
//import RupeesToWords from "convert-rupees-into-words";
import RupeesToWords from "number2text"
import Moment from "moment";

import Button from 'components/CustomButton/CustomButton.jsx';

import { getGrnSingle, } from "modules/purchase/grn/server/GrnServerComm.jsx";
var code = null;

class ComponentToPrint extends Component {
	constructor(props) {
		super(props);
		this.state = {
			subTotal: 0,
			debitNoteAmount: 0,
			debitNoteTotal: 0,
			debitNoteGst: 0,
			igstdebitNoteGst: 0,
			cgstDebitNoteGst: 0,
			sgstDebitNoteGst: 0,
			debitNoteDiscount: 0,
			igst: 0,
			sgst: 0,
			cgst: 0,
			gstType: "",
			invoice: { grnData: [] },
			list: []
		}
		this.fetchDataFromServer = this.fetchDataFromServer.bind(this)
	}
	componentDidMount() {
		this.fetchDataFromServer()
	}
	fetchDataFromServer() {
		if (!code) return;
		console.log(this.state.invoice);
		var _this = this;

		getGrnSingle(code,
			(data => {

				var subTotal = 0;
				var debitNoteAmount = 0;
				var debitNoteTotal = 0;
				var debitNoteGst = 0;
				var igstdebitNoteGst = 0;
				var sgstDebitNoteGst = 0;
				var cgstDebitNoteGst = 0;
				var debitNoteDiscount = 0;
				var gstType = "";
				var igst = 0;
				var sgst = 0;
				var cgst = 0;
				data.grnData.map((prop) => {
					return (
						subTotal += prop.amount,
						debitNoteAmount = prop.debitNoteAmount,
						debitNoteTotal += prop.debitNoteTotal,
						sgst += ((prop.gst / 2)),
						cgst += ((prop.gst / 2)),
						igst += prop.gst,
						gstType = prop.gstType,
						igstdebitNoteGst += prop.debitNoteGst,
						cgstDebitNoteGst += prop.debitNoteCgst,
						sgstDebitNoteGst += prop.debitNoteCgst,
						debitNoteDiscount += prop.debitNoteDiscount
					)
				})
				_this.setState({
					invoice: data,
					subTotal: subTotal,
					igst: igst,
					cgst: cgst,
					sgst: sgst,
					gstType: gstType,
					debitNoteTotal: debitNoteTotal,
					debitNoteAmount: debitNoteAmount,
					debitNoteGst: debitNoteGst,
					igstdebitNoteGst: igstdebitNoteGst,
					cgstDebitNoteGst: cgstDebitNoteGst,
					sgstDebitNoteGst: sgstDebitNoteGst,
					debitNoteDiscount: debitNoteDiscount,
					list: [data]
				})
			}),
			(() => { })
		)
	}
	render() {
		return (
			<div>
				{
					this.state.list.map(prop => {
						return (
							< div style={{ paddingTop: "40px", paddingLeft: "40px", paddingBottom: "40px", paddingRight: "40px", pageBreakAfter: "always" }}>
								<Row style={{ border: "1px solid black", fontSize: "11px", marginTop: "20px" }}>
									<Col sm={12} style={{ height: " 25px" }}>
										<Col sm={2}>
										</Col>
										<Col sm={8}>
											<center><h6>DEBIT NOTE</h6></center>
										</Col>
									</Col>
									<Col sm={12}>
										<Table style={{ borderTop: "1px solid #bfb2b2", marginTop: "10px" }}>
											<tbody class="table1">
												<tr>
													<td colspan="4" style={{ borderBottom: "1px solid #bfb2b2", borderRight: "1px solid #bfb2b2", borderLeft: "1px solid #bfb2b2", }}>
														<Table >
															<tr><td><b>Sai Readymix Concrete</b></td></tr>
															<tr><td>Sr.No.20/1/4, Katewasti,</td></tr>
															<tr><td>Sai Readymix Concrete</td></tr>
															<tr><td>Near DSK Kunjban, Punawale,</td></tr>
															<tr><td>Dist-Pune-411033,</td></tr>
															<tr><td>GSTIN/UIN: 27ACDFS8755R1Z2</td></tr>
															<tr><td>State Name: Maharashtra, CODE:27</td></tr>
															<tr><td>E-mail: billing@sairmcindia.com</td></tr>
															<tr style={{ borderTop: "1px solid #bfb2b2" }}>
																<td><b>Party:</b> </td>
															</tr>
															<tr><td><b> {prop.order.vendor && prop.order.vendor ? (prop.order.vendor.name) : ""}</b></td></tr>
															<tr rolSpan={2}><td>Billing Address: {prop.order.billingAddr && prop.order.billingAddr ? (prop.order.billingAddr.street_address) : ""}</td></tr>
															<tr><td>GSTIN/UIN: {prop.order.vendor.gstin}</td></tr>
															<tr><td>Contact No: +91-{prop.order.contact.phone && prop.order.contact.phone ? (prop.order.contact.phone) : ""}</td></tr>
															<tr><td>State Name:{prop.order.billingAddr.state && prop.order.billingAddr.state ? (prop.order.billingAddr.state) : ""}</td></tr>
															<tr></tr>
														</Table>
													</td>
													<td colspan="3" style={{ padding: "0px", }} >
														<Table style={{ borderBottom: "1px solid #bfb2b2", marginLeft: "3px", }}>
															<tr>
																<td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Debit Note No.<br /><b>{prop.debitNumber}</b></td>
																<td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Dated<br /><b>{prop.order && prop.order ? (Moment(prop.order.date).format("DD-MMM-YYYY")) : ""}</b></td>
															</tr>
															<tr><td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Supplier's Ref.<br /><b>{prop.order.number}</b></td>
																<td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Other Reference(s)<br /><b>{prop.otherRef}</b></td>
															</tr>
															<tr style={{ height: "183px" }}>
																<td colSpan={2} rowSpan={8} style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2" }}></td>
															</tr>

														</Table>
													</td>
												</tr>
											</tbody>
										</Table>
									</Col>
									<Col sm={12}>
										<table className="invoice-table" style={{ width: "100%", fontSize: "11px", border: "1px solid #bfb2b2" }}>
											<thead style={{ borderBottom: "1px solid #bfb2b2" }}>
												<tr>
													<th className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>Sr</th>
													<th className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>Description of Goods</th>
													<th className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>Rate</th>
													<th className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>Quantity</th>
													<th className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>Per</th>
													<th className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>Amount</th>
												</tr>
											</thead>
											<tbody>
												{
													prop.grnData.filter(x => { return x.rejectedQty > 0 }).map((prop, key) => {
														return (
															<tr key={key} style={{ width: "100%", borderBottom: "1px solid #bfb2b2" }}>
																<td className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>{key + 1}</td>
																<td className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>{prop.inventory ? prop.inventory.name : ""}<br /></td>
																<td className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>{prop.rate ? prop.rate : ""}</td>
																<td className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>{prop.rejectedQty ? prop.rejectedQty : ""}  {prop.inventory ? prop.inventory.unit : ""}</td>
																<td className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>{prop.inventory ? prop.inventory.unit : ""}</td>
																<td className="text-right" style={{ borderRight: "1px solid #bfb2b2" }}>{(prop.debitNoteAmount ? prop.debitNoteAmount : "").toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
															</tr>
														)
													})
												}
												{(this.state.gstType === 'igst') ?
													(
														<tr style={{ width: "100%" }}>
															<td colSpan={3}></td>
															<td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">IGST ({this.state.igst}%)</td>
															<td style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">{
																(this.state.igstdebitNoteGst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
															}</td>
														</tr>
													) :
													(
														<tr style={{ width: "100%" }}>
															<td colSpan={3}></td>
															<td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">SGST<br />CGST</td>
															<td style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">{
																(this.state.sgstDebitNoteGst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
															}<br />{
																	(this.state.cgstDebitNoteGst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
																}</td>
														</tr>
													)

												}
												{/* <tr style={{ width: "100%" }}>
													<td colSpan={3}></td>
													<td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right"> OTHER CHARGES</td>
													<td style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">{((this.state.invoice.insuranceCharges + this.state.invoice.frieghtCharges + this.state.invoice.insuranceCharges).toFixed(2))}</td>
												</tr> */}
												<tr style={{ width: "100%" }}>
													<td colSpan={3}></td>
													<td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">ROUNDED OFF TOTAL (INC. TAX)</td>
													<td style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">{
														(Math.ceil((this.state.debitNoteTotal + this.state.debitNoteGst))).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
													}</td>
												</tr>
												<tr style={{ width: "100%", borderTop: "1px solid #bfb2b2" }}>
													<td className="invoice-label1" colSpan={7}>AMOUNT IN WORDS: {RupeesToWords((Math.ceil(((this.state.debitNoteTotal + this.state.debitNoteGst)))), '', true)}</td>
												</tr>
											</tbody>
										</table>
									</Col>
									<Col md={5} style={{ marginTop: "10px" }}>
										<table className="invoice-table" style={{ width: "100%", fontSize: "11px", marginLeft: "-1%" }}>
											<tbody>
												<tr style={{ width: "100%" }}>
													<td><b> Company PAN :ACDFS8755R</b></td>
												</tr>
											</tbody>
										</table>
									</Col>
									<Col md={5} style={{ marginTop: "10px", textAlign: "right" }}>
										<table className="invoice-table" style={{ width: "100%", fontSize: "11px", marginLeft: "-1%" }}>
											<tbody>
												<tr style={{ width: "100%", textAlign: "right" }}>
													<td><b>for Sai Readymix concrete</b></td>
												</tr>
												<br />
												<tr style={{ width: "100%", textAlign: "right" }}>
													<td> Authorised Signatory</td>
												</tr>
											</tbody>
										</table>
									</Col>
									<hr></hr>
									<Col md={12} style={{ marginTop: "10px" }}>
										<table className="invoice-table" style={{ width: "100%", fontSize: "11px", marginLeft: "-1%" }}>
											<tbody>
												<tr style={{ width: "100%", textAlign: "center" }}>
													<td>This is a Computer Generated Document</td>
												</tr>
											</tbody>
										</table>
									</Col>
								</Row>
							</ div>
						)
					})
				}
			</div>
		)
	}
}

class DebitNoteModalComponent extends React.Component {
	constructor(props) {
		super(props)
		code = props.code
	}
	render() {
		return (
			<div>
				<ReactToPrint
					trigger={() => <Button>Print Invoice</Button>}
					content={() => this.componentRef}
				/>
				<ComponentToPrint ref={el => (this.componentRef = el)} />
			</div>
		);
	}
}

export default DebitNoteModalComponent;