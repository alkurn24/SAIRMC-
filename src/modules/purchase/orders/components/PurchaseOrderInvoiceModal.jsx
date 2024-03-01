import React, { Component } from 'react';
import { Modal, Row, Col } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import { Table } from 'react-bootstrap';
import Moment from "moment";
// import RupeesToWords from "convert-rupees-into-words";
import RupeesToWords from "number2text"

import Button from 'components/CustomButton/CustomButton.jsx';

import { getPurchaseOrderSingle } from "modules/purchase/orders/server/OrderServerComm.jsx";
var code = null;

class ComponentToPrint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discount: 0,
      sgst: 0,
      roundOff: 0,
      checkCondition: "",
      subTotal: 0,
      amount: 0,
      discountAmount: 0,
      packingAmount: 0,
      GstAmount: 0,
      IgstAmount: 0,
      gst: "",
      //   date: Moment().format("DD MMM YYYY"),
      total: 0,
      invoice: { orderData: [] },
      list: [],
      cgst: 0,
    }
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this)
  }
  componentDidMount() {
    this.fetchDataFromServer()
  }

  fetchDataFromServer() {
    if (!code) return;
    var _this = this;
    getPurchaseOrderSingle(code,
      (data => {
        var subTotal = 0;
        var amount = 0;
        var discountAmount = 0;
        var packingAmount = 0;
        var GstAmount = 0;
        var IgstAmount = 0;
        var discount = 0;
        var packing = 0;
        var gst = "";
        var sgst = 0;
        var cgst = 0;
        var createdAt = "";
        data.orderData.map((prop) => {
          return (
            subTotal += prop.finalAmount,
            amount += ((prop.amount)),
            discountAmount = prop.discountRate,
            packingAmount = prop.packingRate,
            discount = prop.discount,
            GstAmount += ((prop.gstRate)),
            packing = prop.packing,
            gst = prop.gstType,
            IgstAmount = prop.gstRate,
            sgst += (prop.gstRate / 2),
            cgst += (prop.gstRate / 2)
          )
        })
        _this.setState({
          createdAt: createdAt,
          invoice: data,
          subTotal: subTotal,
          amount: amount,
          sgst: sgst,
          cgst: cgst,
          gst: gst,
          discount: discount,
          IgstAmount: IgstAmount,
          GstAmount: GstAmount,
          packing: packing,
          discountAmount: discountAmount,
          packingAmount: packingAmount,
          total: subTotal + data.packingCharges + data.insuranceCharges + data.frieghtCharges,
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
              < div style={{ fontFamily: "arial", paddingTop: "40px", paddingLeft: "40px", paddingBottom: "40px", paddingRight: "40px", pageBreakAfter: "always" }}>
                <Modal.Body style={{ background: "#fff" }}>
                  <Row >
                    <Col md={12} style={{ padding: "25px" }}>
                      <h5 class="text-center"><b>STONE CRUSHER | READY MIX CONCRETE | INFRASTUCTURE</b></h5>
                      <h6 class="text-center"><b> GSTN:27ACDFS8755R122,VAT NO:27330952840V,CST NO:27330952840C,PAN NO:ACDFS8755R</b></h6>
                      <Table>
                        <tbody class="table1">
                          <tr>
                            <td colspan="7"><hr></hr><h6 class="text-center"><b>Purchase Order</b></h6><hr></hr></td>
                          </tr>
                          <tr>
                            <td colspan="4" style={{ borderBottom: "1px solid black" }}>
                              <Table >
                                <tr><td style={{ borderTop: "0px solid black" }}><b> PO No.: {this.state.invoice.number}</b> <br /></td></tr>
                                <tr><td style={{ borderTop: "0px solid black" }}><b>To: {this.state.invoice && this.state.invoice.vendor ? (this.state.invoice.vendor.name) : ""}</b></td></tr>
                                <tr><td style={{ borderTop: "0px solid black" }}>{this.state.invoice && this.state.invoice.billingAddr ? (this.state.invoice.billingAddr.street_address) : ""}
                                  , <br />{this.state.invoice && this.state.invoice.billingAddr ? (this.state.invoice.billingAddr.city) : ""},
                                 {this.state.invoice && this.state.invoice.billingAddr ? (this.state.invoice.billingAddr.state) : ""}.</td></tr>
                                <tr><td style={{ borderTop: "0px solid black" }}><b>Phone No: </b>{this.state.invoice && this.state.invoice.vendor ? (this.state.invoice.vendor.phone) : ""}</td></tr>
                                <tr><td style={{ borderTop: "0px solid black" }}><b>Email :</b>{this.state.invoice && this.state.invoice.vendor ? (this.state.invoice.vendor.email) : ""}</td></tr>
                                <tr><td style={{ borderTop: "0px solid black" }}><b>Mobile No:</b>+91 {this.state.invoice && this.state.invoice.contact ? (this.state.invoice.contact.phone) : ""}</td></tr>
                              </Table>
                            </td>
                            <td colspan="3" style={{ borderBottom: "1px solid black" }}>
                              <Table style={{ marginTop: "-14px" }} >
                                <tr><td style={{ borderTop: "0px solid black" }}><b>Date:</b>{this.state.invoice.date ? Moment(this.state.invoice.date).format("DD-MMM-YYYY") : ""} </td></tr>
                                <tr><td style={{ borderTop: "0px solid black" }}><b>Delivery Address:</b></td></tr>
                                <tr><td style={{ borderTop: "0px solid black" }}><b>{this.state.invoice && this.state.invoice.plant ? (this.state.invoice.plant.name) : ""}</b></td></tr>
                                <tr><td style={{ borderTop: "0px solid black" }}>{this.state.invoice && this.state.invoice.plant ? (this.state.invoice.plant.address) : ""}</td></tr>
                                <tr><td></td></tr>
                                <tr><td><b>Contact No:</b> {this.state.invoice && this.state.invoice.plant ? (this.state.invoice.plant.contactNo) : ""}</td></tr>
                              </Table>
                            </td>
                          </tr>
                          <tr class="text-center">
                            <td className="text-left" style={{ borderTop: "1px solid black", borderBottom: "1px solid black" }}><b>Part Number</b></td>
                            <td className="text-left" style={{ borderTop: "1px solid black", borderBottom: "1px solid black" }}><b>Material</b></td>
                            <td className="text-left" style={{ borderTop: "1px solid black", borderBottom: "1px solid black" }}><b>HSN Code</b></td>
                            <td className="text-left" style={{ borderTop: "1px solid black", borderBottom: "1px solid black" }}><b>Discount</b></td>
                            <td className="text-left" style={{ borderTop: "1px solid black", borderBottom: "1px solid black" }}><b>Rate(INR)</b></td>
                            <td className="text-left" style={{ borderTop: "1px solid black", borderBottom: "1px solid black" }}><b>Qty</b></td>
                            <td className="text-right" style={{ borderTop: "1px solid black", borderBottom: "1px solid black" }}><b>Amount(INR)</b></td>
                          </tr>
                          {this.state.invoice.orderData.map((prop, key) => {

                            return (
                              <tr key={key} class="text-center">
                                <td className="text-left" >{prop.inventory ? prop.inventory.number : ""}</td>
                                <td className="text-left" >{prop.inventory ? prop.inventory.name : ""}</td>
                                <td className="text-left" >{prop.hsn ? prop.hsn : ""}</td>
                                <td className="text-left" >{prop.discount ? prop.discount : ""}</td>
                                <td className="text-left" >{prop.rate ? prop.rate : ""}</td>
                                <td className="text-left" >{prop.orderQuantity ? prop.orderQuantity : ""}</td>
                                <td className="text-right">{(prop.amount ? prop.amount : "").toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              </tr>
                            )
                          })
                          }
                          {/* <tr class="border1">

                            <td class="text-right" style="padding: 0px;"><hr></hr><b></b></td>
                          </tr> */}
                          <tr class="border1">
                            <td colSpan="6" class="text-right"><hr></hr><b>Net Goods Price</b></td>
                            <td class="text-right"><hr></hr><b>{(this.state.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></td>

                          </tr>
                          <tr class="border1">
                            <td colSpan="6" class="text-right"><b>Discount {this.state.discount} %</b></td>
                            <td class="text-right"><b>{(this.state.discountAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></td>
                          </tr>
                          <tr class="border1">
                            <td colSpan="6" class="text-right"><b>Packing  {this.state.packing}%</b></td>
                            <td class="text-right"><b>{(this.state.packingAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></td>
                          </tr>
                          {(this.state.gst === 'igst') ?
                            (

                              <tr class="border1">
                                <td colSpan="6" class="text-right"><b>IGST</b></td>
                                <td class="text-right"><b>{(this.state.IgstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></td>
                              </tr>

                            ) :
                            (
                              <tr class="border1">
                                <td colSpan="6" class="text-right"><b>SGST<br />CGST</b></td>
                                <td class="text-right"><b>{(this.state.sgst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br />
                                  {(this.state.cgst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></td>
                              </tr>

                            )
                          }
                          <tr class="border1">
                            <td colSpan="6" class="text-right"><b>Round Off</b></td>
                            <td class="text-right"><b>
                              {
                                (this.state.subTotal) > Math.ceil((this.state.subTotal))
                                  ? <div>(-) {((this.state.subTotal) - Math.ceil((this.state.subTotal))).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                  : <div>(+) {(Math.ceil((this.state.subTotal)) - (this.state.subTotal)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                              }</b></td>
                          </tr>
                          <tr class="border1">
                            <td colSpan="6" class="text-right"> <hr id="hrLine1"></hr><b>Gross Amount (INR) </b></td>
                            <td class="text-right"><hr></hr><b>{(Math.ceil(this.state.amount) + (this.state.GstAmount)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></td>
                          </tr>
                          <tr class="border1">
                            <td colSpan="7" class="text-left"> <hr></hr><b>AMOUNT IN WORDS: {RupeesToWords((Math.ceil((this.state.subTotal))), '', true)}</b></td>
                          </tr>
                          <tr class="border1">
                            <td colSpan="7" class="text-left"><b>Payment Terms:30 Days Credit From The Date of Invoice Received.</b></td>
                          </tr>
                          <tr>
                            <td colSpan="7" class="text-left "><hr></hr><p class="p31"><b>Terms & Coditions :</b></p>
                              <p class="p1">1. Material will be received subject to verification of quantity at our plant.</p>
                              <p class="p1">2. Invoice/Bills to be submitted to Head office strictly within 2 days after material supply/received at Plant.</p>
                              <p class="p1">3. Please mention Purchase order No., Plant name on Challan/Invoice strictly.</p>
                              <p class="p1">4. Delivery at site is accepted on all working days.</p>
                              <p class="p1">5. Please send Test certificate attached with the delivery challan.</p>
                              <p class="p1">6. Subject To Pune Jurisdiction.</p>
                              <p class="p1">7. All applicable tax paid receipts should be attached with the invoice.</p>
                              <p class="p1">8. All rights reserved with Authorised signatory.</p>
                              <p class="p1">9. Stricty adhere to delivery schedule mentioned in Purchase order.</p>
                              <p class="p1">10.Breakage, Pilferage, Shortage of material due to bad packing will be at your account.</p>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="7">
                              <hr></hr>
                              <p class="p31">Remarks:</p>
                              <p class="p1"><b>Above Amount Inclusive Of All Taxes,</b></p>
                              <p class="p1 text-right"><b>For SAI READYMIX CONCRETE,</b></p>
                              <p class="p1"><b>Delivery Immediate.</b></p></td>
                          </tr>

                          <tr class="p11" >
                            <th colspan="2">PrePared By</th>
                            <th colspan="2">Verified By</th>
                            <th >Checked By</th>
                            <th colspan="2" class="text-right">Authorised Signatory</th>
                          </tr>
                        </tbody>
                      </Table>
                      <hr></hr>
                      <h5 class="text-center" style={{ fontFamily: "arial" }}><b>SAI READYMIX CONCRETE</b></h5>
                      <p class="p21">Ho Plant N0-I,Sr.No 20/1/14, Katewasti, Near DSk Kunjbhn, Punawale,Tal:Mulshi,Pune-411033 </p>
                      <p class="p21">Plant-II Sr.No.55 , Hissa No.7/K/3, Mhalunge, Tal:Mulshi, Pune-411045.</p>
                      <p class="p21">Plant-III Symbiosis International College, At /Po:Lavale , Tal:Mulshi, Pune-412115.</p>
                      <p class="p21">Email Id: admin@sairmcindia.com.</p>
                    </Col>
                  </Row>
                </Modal.Body>
              </div>
            )
          })
        }
      </div>
    )
  }
}
class PurchaseOrderInvoiceModal extends React.Component {
  constructor(props) {
    super(props)
    code = props.code
  }
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => <Button bsStyle="primary">
            <span bsStyle="primary" fill pullRight> <a href="#/purchase/orders">  Print </a></span></Button>}
          content={() => this.componentRef}
        />
        <ComponentToPrint ref={el => (this.componentRef = el)} />
      </div>
    );
  }
}
export default PurchaseOrderInvoiceModal;