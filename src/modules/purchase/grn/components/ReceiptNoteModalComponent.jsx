import React, { Component } from 'react';
import ReactToPrint from "react-to-print";
//import RupeesToWords from "convert-rupees-into-words";
import RupeesToWords from "number2text"
import Moment from "moment";
import { Row, Col, Table } from 'react-bootstrap';

import Button from 'components/CustomButton/CustomButton.jsx';
import { getGrnSingle, } from "modules/purchase/grn/server/GrnServerComm.jsx";
var code = null;

class ComponentToPrint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      subTotal: 0,
      receiptNoteAmount: 0,
      receiptNoteTotal: 0,
      receiptNoteGst: 0,
      igstReceiptNoteGst: 0,
      cgstReceiptNoteGst: 0,
      sgstReceiptNoteGst: 0,
      receiptNoteDiscount: 0,
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
        var receiptNoteAmount = 0;
        var receiptNoteTotal = 0;
        var receiptNoteGst = 0;
        var igstReceiptNoteGst = 0;
        var sgstReceiptNoteGst = 0;
        var cgstReceiptNoteGst = 0;
        var receiptNoteDiscount = 0;
        var gstType = "";
        var igst = 0;
        var sgst = 0;
        var cgst = 0;
        data.grnData.map((prop, key) => {
          return (
            subTotal += (prop.amount),
            receiptNoteAmount += prop.receiptNoteAmount,
            receiptNoteTotal += prop.receiptNoteTotal,
            sgst += ((prop.gst / 2)),
            cgst += ((prop.gst / 2)),
            igst += prop.gst,
            gstType += prop.gstType,
            igstReceiptNoteGst += prop.receiptNoteGst,
            cgstReceiptNoteGst += prop.receiptNoteCgst,
            sgstReceiptNoteGst += prop.receiptNoteCgst,
            receiptNoteDiscount += prop.receiptNoteDiscount
          )
        })
        _this.setState({
          invoice: data,
          subTotal: subTotal,
          igst: igst,
          cgst: cgst,
          sgst: sgst,
          gstType: gstType,
          receiptNoteTotal: receiptNoteTotal,
          receiptNoteAmount: receiptNoteAmount,
          receiptNoteGst: receiptNoteGst,
          igstReceiptNoteGst: igstReceiptNoteGst,
          cgstReceiptNoteGst: cgstReceiptNoteGst,
          sgstReceiptNoteGst: sgstReceiptNoteGst,
          receiptNoteDiscount: receiptNoteDiscount,
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
                      <center><h6>RECEIPT NOTE</h6></center>
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
                                <td><b>Supplier:</b> </td>
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
                            <Table style={{ borderBottom: "1px solid #bfb2b2", }}>
                              <tr>
                                <td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}> Receipt Note No.<br /><b> {prop.number}</b></td>
                                <td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}> Dated<br /> <b>{prop.order && prop.order ? (Moment(prop.order.date).format("DD-MMM-YYYY")) : ""}</b></td>

                              </tr>
                              <tr><td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}> Supplier's Ref.<br /> <b>{prop.order.number}</b></td>
                                <td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}> Other Reference(s)<br /><b>{prop.otherRef}</b></td>
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
                          <th className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>Discount(%)</th>
                          <th className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          prop.grnData.map((prop, key) => {
                            return (
                              <tr key={key} style={{ width: "100%", borderBottom: "1px solid #bfb2b2" }}>
                                <td className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>{key + 1}</td>
                                <td className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>{prop.inventory ? prop.inventory.name : ""}<br /></td>
                                <td className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>{prop.rate ? prop.rate : ""}</td>
                                <td className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>{prop.actualQty >= prop.quantity ? prop.actualQty : prop.quantity} {prop.inventory ? prop.inventory.unit : ""} </td>
                                <td className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>{prop.inventory ? prop.inventory.unit : ""}</td>
                                <td className="text-left" style={{ borderRight: "1px solid #bfb2b2" }}>{prop.discount ? prop.discount : ""}</td>
                                <td className="text-right" style={{ borderRight: "1px solid #bfb2b2" }}>{(prop.receiptNoteAmount - prop.receiptNoteDiscount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              </tr>
                            )
                          })
                        }
                        {(this.state.gstType === 'igst') ?
                          (
                            <tr style={{ width: "100%" }}>
                              <td colSpan={4}></td>
                              <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">IGST ({this.state.igst}%)</td>
                              <td style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">{
                                (this.state.igstReceiptNoteGst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                              }</td>
                            </tr>
                          ) :
                          (
                            <tr style={{ width: "100%" }}>
                              <td colSpan={4}></td>
                              <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">SGST ({this.state.sgst}%)<br />CGST ({this.state.cgst}%)</td>
                              <td style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">{
                                (this.state.sgstReceiptNoteGst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                              }<br />{
                                  (this.state.cgstReceiptNoteGst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                }</td>
                            </tr>
                          )

                        }

                        <tr style={{ width: "100%" }}>
                          <td colSpan={4}></td>
                          <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right"> OTHER CHARGES</td>
                          <td style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">{((this.state.invoice.insuranceCharges + this.state.invoice.frieghtCharges + this.state.invoice.insuranceCharges).toFixed(2))}</td>
                        </tr>
                        <tr style={{ width: "100%" }}>
                          <td colSpan={4}></td>
                          <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">ROUNDED OFF TOTAL (INC. TAX)</td>
                          <td style={{ borderBottom: "1px solid #bfb2b2" }} className="invoice-label1 text-right">{
                            (Math.ceil((this.state.receiptNoteTotal))).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          }</td>
                        </tr>
                        <tr style={{ width: "100%", borderTop: "1px solid #bfb2b2" }}>
                          <td className="invoice-label1" colSpan={7}>AMOUNT IN WORDS:{RupeesToWords((Math.ceil(((this.state.receiptNoteTotal)))), '', true)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                  <Col md={6} style={{ marginTop: "10px" }}>
                    <table className="invoice-table" style={{ width: "100%", fontSize: "11px", marginLeft: "-1%" }}>
                      <tbody>
                        <tr style={{ width: "100%" }}>
                          <td> Buyer's PAN :<b>{prop.order.vendor.pan}</b></td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                  <Col md={6} style={{ marginTop: "10px" }}>
                    <table className="invoice-table" style={{ width: "100%", fontSize: "11px", marginLeft: "-1%" }}>
                      <tbody>
                        <tr style={{ width: "100%", textAlign: "right" }}>
                          <td><b>for Sai Readymix Concrete</b></td>
                        </tr>
                        <br />
                        <tr style={{ width: "100%", textAlign: "right" }}>
                          <td> Authorised Signatory</td>
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

class ReceiptNoteModalComponent extends React.Component {
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

export default ReceiptNoteModalComponent;