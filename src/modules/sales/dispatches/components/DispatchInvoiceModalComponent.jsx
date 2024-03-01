import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import ReactToPrint from "react-to-print";
import { Table } from 'react-bootstrap';
import Moment from "moment";

import Button from 'components/CustomButton/CustomButton.jsx';
import RupeesToWords from "number2text"
import { getDispatchSingle } from "../server/DispatchServerComm";
var code = null;

class ComponentToPrint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subTotal: 0,
      amount: 0,
      discount: 0,
      packing: 0,
      preGstAmount: 0,
      postGstAmount: 0,
      preGstSubAmount: 0,
      postGstSubAmount: 0,
      discountAmount: 0,
      IgstAmount: 0,
      prePostGst: "",
      packingAmount: 0,
      pumpCharges: 0,
      GstAmount: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      gst: "",
      invoice: { dispatchData: [] },
      list: []
    }
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this)
  }
  componentDidMount() {
    this.fetchDataFromServer()
  }

  fetchDataFromServer() {
    if (!code) return;
    var _this = this;
    getDispatchSingle(code,
      (data => {
        var subTotal = 0;
        var amount = 0;
        var igst = 0;
        var cgst = 0;
        var sgst = 0;
        var preGstAmount = 0;
        var postGstAmount = 0;
        var preGstSubAmount = 0;
        var postGstSubAmount = 0;
        var prePostGst = data.prePostGst;
        var GstAmount = 0;
        var pumpCharges = 0;
        var IgstAmount = 0;
        var igstPreGst = 0;
        var igstPostGst = 0;
        var preGst = 0;
        var postGst = 0;
        var discount = 0;
        var packing = 0;
        var gst = "";
        data.dispatchData.map((prop, key) => {
          return (subTotal = prop.finalRate,
            preGstAmount = prop.totalForPreGst,
            postGstAmount = prop.totalForPostgst,
            preGstSubAmount = prop.subTotalForPreGst,
            postGstSubAmount = prop.subTotalForPostGst,
            pumpCharges = prop.pumpCharges,
            discount = prop.discount,
            igst = prop.igst,
            cgst = prop.cgst,
            sgst = prop.cgst,
            igstPostGst = prop.gstOnAmount,
            igstPreGst = prop.gstOnSubTotalForPreGst,
            preGst = ((prop.gstOnSubTotalForPreGst / 2)),
            postGst = ((prop.gstOnAmount / 2)),
            packing = prop.packing,
            IgstAmount = prop.gstRate)
        })
        data.order.orderData.map((prop) => {
          return (
            gst = prop.gstType,
            IgstAmount = prop.rateAfterGst)
        })
        _this.setState({
          invoice: data,
          subTotal: subTotal,
          amount: amount,
          gst: gst,
          igst: igst,
          cgst: cgst,
          sgst: sgst,
          prePostGst: prePostGst,
          discount: discount,
          igstPostGst: igstPostGst,
          igstPreGst: igstPreGst,
          preGst: preGst,
          postGst: postGst,
          GstAmount: GstAmount,
          packing: packing,
          preGstAmount: preGstAmount,
          pumpCharges: pumpCharges,
          postGstAmount: postGstAmount,
          preGstSubAmount: preGstSubAmount,
          postGstSubAmount: postGstSubAmount,
          list: [data]
        })
      }),
      (() => { })
    )
  }
  render() {
    let _this = this;
    return (
      <div>
        {
          this.state.list.map(prop => {
            return (
              < div style={{ paddingTop: "40px", paddingLeft: "40px", paddingBottom: "40px", paddingRight: "40px", pageBreakAfter: "always" }}>
                <Row style={{ border: "1px solid black", fontSize: "11px", marginTop: "20px" }}>
                  <Col sm={12} style={{ height: " 25px", borderBottom: "1px solid #bfb2b2" }}>
                    <Col sm={2}>
                    </Col>
                    <Col sm={8}>
                      <center><h6>TAX INVOICE</h6></center>
                    </Col>
                  </Col>
                  <Col sm={12} >
                    <Table style={{ marginTop: "10px" }}>
                      <tbody class="table" >
                        <tr>
                          <td colspan="4" style={{ borderBottom: "1px solid #bfb2b2", borderRight: "1px solid #bfb2b2", borderLeft: "1px solid #bfb2b2", }}>
                            <Table>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}><b>Sai Readymix Concrete</b></td></tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}>Sr.No.20/1/4, Katewasti,</td></tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}>Sai Readymix Concrete</td></tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}>Near DSK Kunjban,Punawale,</td></tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}>Dist-Pune-411033,</td></tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}>GSTIN/UIN: 27ACDFS8755R1Z2</td></tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}>State Name: Maharashtra, CODE:27</td></tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}>E-MAIL: billing@sairmcindia.com</td></tr>
                              <tr style={{ borderTop: "1px solid #bfb2b2" }}>
                                <td style={{ fontFamily: "arial", paddingLeft: "5px" }}><b>Buyer:</b> </td>
                              </tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}><b>{prop.order.customer.name}</b></td></tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}> {prop.order.customer.city}</td></tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}>GSTIN/UIN :{prop.order.customer.gstin}</td></tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}>State Name:{prop.order.customer.state},CODE:27</td></tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}><b>Site Address:</b></td></tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}>Site Name:{prop.order.siteAddress && prop.order.siteAddress ? (prop.order.siteAddress.name) : ""}</td></tr>
                              <tr rolSpan={2}><td style={{ fontFamily: "arial", paddingLeft: "5px" }}>Site Address:{prop.order.siteAddress && prop.order.siteAddress ? (prop.order.siteAddress.siteAddress) : ""}</td></tr>
                              <tr><td style={{ fontFamily: "arial", paddingLeft: "5px" }}>Contact No: {prop.phone && prop.phone ? (prop.phone.phone) : ""}</td></tr>

                              <tr></tr>
                            </Table>
                          </td>
                          <td colspan="3" style={{ padding: "0px", }} >
                            <Table style={{ borderBottom: "1px solid #bfb2b2", marginTop: "-19px" }}>
                              <tr><td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Invoice No.<br /><b>{prop.order.number}</b></td>
                                <td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Dated.<br /><b>{prop.order.createdAt ? Moment(prop.order.createdAt).format('DD MMM YYYY') : Moment().format('DD MMM YYYY')}</b></td>
                              </tr>
                              <tr><td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Delivery Note<br /><b>{prop.challanNumber}</b></td>
                                <td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Dated.<br /><b>{prop.order.createdAt ? Moment(prop.order.createdAt).format('DD MMM YYYY') : Moment().format('DD MMM YYYY')}</b></td>
                              </tr>
                              <tr><td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Buyer's Order No.<br /><b>{prop.order.poNumber}</b></td>
                                <td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Buyer's Order Date.<br /><b>1-{prop.order.poDate ? Moment(prop.order.poDate).format('DD MMM YYYY') : Moment().format('DD MMM YYYY')}</b></td>
                              </tr>
                              <tr><td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Model/Terms Of Payment<br /><b>{prop.order.customer.paymentTerm}</b></td>
                                <td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Buillding Name<br /><b>{prop.order.buildingName}</b></td>
                              </tr>
                              <tr><td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Dispatched Through<br /><b>Transit Mixer</b></td>
                                <td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Vehicle No.<br /><b>{prop.vehicle ? prop.vehicle.vehicleNumber : ""}</b></td>
                              </tr>
                              <tr><td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Dispatched Time<br /><b>{(Moment(prop.dispatchDate).format(" hh:mm A"))}</b></td>
                                <td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Driver Name<br /><b>{prop.vehicle ? prop.vehicle.driver.name : ""}</b></td>
                              </tr>
                              <tr><td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>PUMP/DUMP<br /><b>{prop.orderStatus ? prop.orderStatus : ""}</b></td>
                                <td style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}>Pump No.<br /><b>{
                                  (prop.pumping === false) ?
                                    (<div></div>) :
                                    (<div>{prop.assetPumpType ? prop.assetPumpType.name : " "}</div>)
                                }
                                </b></td>
                              </tr>
                              <tr><td colSpan={2} style={{ borderRight: "1px solid #bfb2b2", paddingLeft: "5px" }}>Delivery Address/Terms of Delivery</td>
                              </tr>
                              <tr><td colSpan={2} style={{ borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", paddingLeft: "5px" }}><br /><br /></td></tr>
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
                          <th className="text-left" style={{ borderRight: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}>Sr</th>
                          <th className="text-left" style={{ borderRight: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}>DESCRIPTION OF GOODS</th>
                          <th className="text-left" style={{ borderRight: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}>HSN/SAC</th>
                          <th className="text-left" style={{ borderRight: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}>QUNTITY(UNIT)</th>
                          <th className="text-left" style={{ borderRight: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}>RATE</th>
                          <th className="text-left" style={{ borderRight: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}>PER</th>
                          <th className="text-left" style={{ borderRight: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}>AMOUNT (INR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.invoice.dispatchData.map((prop, key) => {
                            return (
                              <tr key={key} style={{ width: "100%", borderBottom: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}>
                                <td className="text-left" style={{ borderRight: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}> {key + 1}</td>
                                <td className="text-left" style={{ borderRight: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}>{prop.product ? prop.product.name : ""}</td>
                                <td className="text-left" style={{ borderRight: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}>{prop.product.hsn ? prop.product.hsn.hsn : ""}</td>
                                <td className="text-left" style={{ borderRight: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}> {parseFloat(prop.qty ? prop.qty : "").toFixed(3)}  {prop.product.unit}</td>
                                <td className="text-left" style={{ borderRight: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}> {parseFloat(prop.rate ? prop.rate : "").toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="text-left" style={{ borderRight: "1px solid #bfb2b2", fontFamily: "arial", paddingLeft: "5px" }}>{prop.product ? prop.product.unit : ""}</td>
                                <td className="text-right" style={{ paddingRight: "5px" }}>{(prop.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              </tr>
                            )
                          })
                        }
                        {(_this.state.prePostGst === "preGst") ?
                          parseFloat(this.state.invoice.packingCharges) > 0 ? (
                            <tr style={{ width: "100%" }}>
                              <td colSpan={4}></td>
                              <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">PACKING CHARGES</td>
                              <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{this.state.invoice.packingCharges ? this.state.invoice.packingCharges.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          ) : null
                          : null
                        }
                        {(_this.state.prePostGst === "preGst") ?
                          parseFloat(this.state.invoice.insuranceCharges) > 0 ? (
                            <tr style={{ width: "100%" }}>
                              <td colSpan={4}></td>
                              <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">INSURANCE CHARGES</td>
                              <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{this.state.invoice.insuranceCharges ? this.state.invoice.insuranceCharges.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          ) : null
                          : null
                        }
                        {(_this.state.prePostGst === "preGst") ?
                          parseFloat(this.state.invoice.frieghtCharges) > 0 ? (
                            <tr style={{ width: "100%" }}>
                              <td colSpan={4}></td>
                              <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">FRIEGHT CHARGES</td>
                              <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{this.state.invoice.frieghtCharges ? this.state.invoice.frieghtCharges.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          ) : null
                          : null
                        }
                        {(_this.state.prePostGst === "preGst") ?
                          parseFloat(this.state.invoice.transporterCharges) > 0 ? (
                            <tr style={{ width: "100%" }}>
                              <td colSpan={4}></td>
                              <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">TRANSPORTER CHARGES</td>
                              <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{this.state.invoice.transporterCharges ? this.state.invoice.transporterCharges.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          ) : null
                          : null
                        }
                        {(this.state.prePostGst === "preGst") ?
                          parseFloat(this.state.pumpCharges) > 0 ? (
                            <tr style={{ width: "100%" }}>
                              <td colSpan={4}></td>
                              <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">PUMP CHARGES</td>
                              <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{this.state.pumpCharges ? this.state.pumpCharges.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          ) : null
                          : null
                        }


                        {(_this.state.gst === 'igst') ?
                          (
                            (this.state.invoice.prePostGst === "postGst") ?
                              (
                                <tr style={{ width: "100%" }}>
                                  <td colSpan={4}></td>
                                  <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">TOTAL (INC. TAX)</td>
                                  <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{
                                    (_this.state.postGstSubAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                  }</td>
                                </tr>

                              ) : null
                          ) : null
                        }
                        {(_this.state.gst !== 'igst') ?
                          (
                            (_this.state.invoice.prePostGst === "preGst") ?
                              (
                                <tr style={{ width: "100%" }}>
                                  <td colSpan={4}></td>
                                  <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">TOTAL (INC. TAX)</td>
                                  <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{
                                    (this.state.preGstSubAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                  }</td>
                                </tr>
                              ) : null
                          ) : null
                        }
                        {(_this.state.gst === 'igst') ? (
                          (this.state.invoice.prePostGst === "postGst") ? (
                            <tr style={{ width: "100%" }}>
                              <td colSpan={4}></td>
                              <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">IGST ({this.state.igst}%)</td>
                              <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{
                                (this.state.igstPostGst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                              }</td>
                            </tr>
                          ) :
                            (
                              <tr style={{ width: "100%" }}>
                                <td colSpan={4}></td>
                                <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">IGST ({this.state.igst}%)</td>
                                <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{
                                  (this.state.igstPreGst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                }</td>
                              </tr>
                            )
                        ) : null
                        }
                        {(this.state.gst === 'gst') ? (
                          (this.state.prePostGst === "postGst") ?
                            (
                              <tr style={{ width: "100%" }}>
                                <td colSpan={4}></td>
                                <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", fontFamily: "arial", paddingRight: "5px" }} className="invoice-label1 text-right">SGST ({this.state.sgst}%)<br />CGST ({this.state.cgst}%)</td>
                                <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{
                                  (this.state.postGst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                }<br />{
                                    (this.state.postGst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                  }</td>
                              </tr>
                            ) :
                            (
                              <tr style={{ width: "100%" }}>
                                <td colSpan={4}></td>
                                <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", fontFamily: "arial", paddingRight: "5px" }} className="invoice-label1 text-right">SGST ({this.state.sgst}%)<br />CGST ({this.state.cgst}%)</td>
                                <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{
                                  (this.state.preGst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                }<br />{
                                    (this.state.preGst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                  }</td>
                              </tr>
                            )
                        ) : null
                        }
                        {(this.state.gst === 'gst') ?
                          (
                            (this.state.prePostGst === "postGst") ?
                              (
                                <tr style={{ width: "100%" }}>
                                  <td colSpan={4}></td>
                                  <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", fontFamily: "arial", paddingRight: "5px" }} className="invoice-label1 text-right">TOTAL (INC. TAX)</td>
                                  <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{
                                    (this.state.postGstSubAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                  }</td>
                                </tr>
                              ) : null
                          ) : null
                        }
                        {(_this.state.prePostGst === "postGst") ?
                          parseFloat(this.state.invoice.packingCharges) > 0 ? (
                            <tr style={{ width: "100%" }}>
                              <td colSpan={4}></td>
                              <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">PACKING CHARGES</td>
                              <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{this.state.invoice.packingCharges ? this.state.invoice.packingCharges.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          ) : null
                          : null
                        }
                        {(_this.state.prePostGst === "postGst") ?
                          parseFloat(this.state.invoice.insuranceCharges) > 0 ? (
                            <tr style={{ width: "100%" }}>
                              <td colSpan={4}></td>
                              <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">INSURANCE CHARGES</td>
                              <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{this.state.invoice.insuranceCharges ? this.state.invoice.insuranceCharges.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          ) : null
                          : null
                        }
                        {(_this.state.prePostGst === "postGst") ?
                          parseFloat(this.state.invoice.frieghtCharges) > 0 ? (
                            <tr style={{ width: "100%" }}>
                              <td colSpan={4}></td>
                              <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">FRIEGHT CHARGES</td>
                              <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{this.state.invoice.frieghtCharges ? this.state.invoice.frieghtCharges.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          ) : null
                          : null
                        }
                        {(_this.state.prePostGst === "postGst") ?
                          parseFloat(this.state.invoice.transporterCharges) > 0 ? (
                            <tr style={{ width: "100%" }}>
                              <td colSpan={4}></td>
                              <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">TRANSPORTER CHARGES</td>
                              <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{this.state.invoice.transporterCharges ? this.state.invoice.transporterCharges.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          ) : null
                          : null
                        }
                        {(this.state.prePostGst === "postGst") ?
                          parseFloat(this.state.pumpCharges) > 0 ? (
                            <tr style={{ width: "100%" }}>
                              <td colSpan={4}></td>
                              <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">PUMP CHARGES</td>
                              <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{this.state.pumpCharges ? this.state.pumpCharges.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          ) : null
                          : null
                        }


                        {(this.state.gst !== 'gst') ?
                          (
                            (this.state.invoice.prePostGst === "preGst") ?
                              (
                                <tr style={{ width: "100%" }}>
                                  <td colSpan={4}></td>
                                  <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">TOTAL (INC. TAX)</td>
                                  <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{
                                    (this.state.preGstSubAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                  }</td>
                                </tr>
                              ) : null
                          ) : null
                        }
                        {
                          (_this.state.invoice.prePostGst === "preGst") ?
                            (
                              <tr style={{ width: "100%" }}>
                                <td colSpan={4}></td>
                                <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">ROUNDING</td>
                                <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{
                                  (this.state.preGstSubAmount + this.state.preGst) > Math.ceil((this.state.preGstSubAmount + this.state.preGst))
                                    ? <div>(-) {((this.state.preGstSubAmount + this.state.preGst) - Math.ceil((this.state.preGstSubAmount + this.state.preGst))).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    : <div>(+) {(Math.ceil((this.state.preGstSubAmount + this.state.preGst)) - (this.state.preGstSubAmount + this.state.preGst)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                }</td>
                              </tr>
                            ) :
                            (
                              <tr style={{ width: "100%" }}>
                                <td colSpan={4}></td>
                                <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">ROUNDING</td>
                                <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{
                                  (this.state.postGstSubAmount + this.state.postGst) > Math.ceil((this.state.postGstSubAmount + this.state.postGst))
                                    ? <div>(-) {((this.state.postGstSubAmount + this.state.postGst) - Math.ceil((this.state.postGstSubAmount + this.state.postGst))).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    : <div>(+) {(Math.ceil((this.state.postGstSubAmount + this.state.postGst)) - (this.state.postGstSubAmount + this.state.postGst)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                }</td>
                              </tr>
                            )
                        }
                        {
                          (this.state.invoice.prePostGst === "preGst") ?
                            (
                              <tr style={{ width: "100%" }}>
                                <td colSpan={4}></td>
                                <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">TOTAL (INC. TAX) (ROUNDED OFF)</td>
                                <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{
                                  (Math.ceil((this.state.preGstAmount))).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                }</td>
                              </tr>
                            ) :
                            (
                              <tr style={{ width: "100%" }}>
                                <td colSpan={4}></td>
                                <td colSpan={2} style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">TOTAL (INC. TAX) (ROUNDED OFF)</td>
                                <td style={{ borderBottom: "1px solid #bfb2b2", paddingRight: "5px" }} className="invoice-label1 text-right">{
                                  (Math.ceil((this.state.postGstAmount))).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                }</td>
                              </tr>
                            )
                        }
                        {
                          (this.state.invoice.prePostGst === "preGst") ?
                            (
                              <tr style={{ width: "100%", borderTop: "1px solid #bfb2b2" }}>
                                <td className="invoice-label1" colSpan={7}>AMOUNT IN WORDS: {RupeesToWords((Math.ceil(((this.state.preGstAmount)))), '', true)} </td>
                              </tr>
                            ) :
                            (
                              <tr style={{ width: "100%", borderTop: "1px solid #bfb2b2" }}>
                                <td className="invoice-label1" colSpan={7}>AMOUNT IN WORDS: {RupeesToWords((Math.ceil(((this.state.postGstAmount)))), '', true)} </td>
                              </tr>
                            )
                        }

                      </tbody>
                    </table>
                  </Col>
                  <Col md={6}>
                    <Table style={{ borderTop: "1px solid #bfb2b2", borderLeft: "1px solid #bfb2b2", }}>
                      <tbody class="tabel">
                        <tr><td style={{ paddingLeft: "5px" }}>   <strong><u>1. RTGS DETAILS FOR PAYMENT:</u> </strong></td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> Name of Bank: Axis Bank </td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> Branch: Wakad,Pune. </td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> Beneficiary Name:Sai Readymix Concrete </td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> Address: HinjawadiRoad,Wakad,Pune-411057 </td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> MICR CODE: 411211031 </td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}>RTGS/NEET IFSC CODE : UTIB0001893.</td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> A/C Type: Current A/C.</td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> A/C NO: 913020047149893,</td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}>Payment To Be Made A/C Payee DD/Cheque/RTGS/NEFT</td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}>Company PAN: ACDFS8755R</td></tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <Table style={{ borderTop: "1px solid #bfb2b2", borderRight: "1px solid #bfb2b2", }}>
                      <tbody class="table">
                        <tr><td style={{ paddingLeft: "5px" }}>   <strong><u>2. RTGS DETAILS FOR PAYMENT:</u> </strong></td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> Name of Bank: Bank of Maharashtra </td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> Branch: Ravet,Pune. </td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> Beneficiary Name:Sai Readymix Concrete </td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> Address: Bhondave Corner,Ravet,Pune-412101. </td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> MICR CODE: 411014123 </td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}>RTGS/NEET IFSC CODE :MAHB0001594.</td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> A/C Type: Current A/C.</td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}> A/C NO: 60137009182,</td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}>Payment To Be Made A/C Payee DD/Cheque/RTGS/NEFT</td></tr>
                        <tr><td style={{ paddingLeft: "5px" }}>Company PAN: ACDFS8755R</td></tr>

                      </tbody>
                    </Table>
                  </Col>
                  <Col sm={12}>
                    <Table style={{ borderLeft: "1px solid #bfb2b2", borderRight: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2" }}>
                      <tbody class="table1">
                        <tr><td style={{ paddingLeft: "5px" }}><u><b>Declaration:</b></u></td></tr>
                        <tr><td><p style={{ textAlign: "justify", fontSize: "12px", fontFamily: "arial", paddingLeft: "5px" }}> "I/We hereby certify that my/our registration certificate  under the Goods & Service Tax Act is in force on the date on which the sale of the goods specified in this tax invoice is made by me/us and that the transaction of sale covered by this tax invoice has been effected by me/us and it shall be accounted for in the turnover of sales while filing of return  and the due tax, if any, payable on the sale has been paid or shall be paid"</p></td></tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={12} style={{ borderLeft: "1px solid #bfb2b2", borderRight: "1px solid #bfb2b2" }}>
                    <Table>
                      <tbody>
                        <tr><td style={{ textAlign: "right" }}><b>For Sai Readymix Concrete</b></td></tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Table style={{ borderLeft: "1px solid #bfb2b2", borderBottom: "1px solid #bfb2b2", borderRight: "1px solid #bfb2b2" }}>
                    <tbody>
                      <tr>
                        <td colspan="3" style={{ width: "60%" }}>
                          <Table>
                          </Table>
                        </td>

                        <td colspan="4">
                          <Table>
                            <br /> <br />
                            <tr style={{ marginTop: "20px" }}>
                              <td style={{ width: "100px", textAlign: "left" }}>Prepared By</td>
                              <td style={{ textAlign: "right" }}>Verified By</td>
                              <td style={{ textAlign: "right" }}>Authorised By</td></tr>
                          </Table>
                        </td>

                      </tr>
                    </tbody>
                  </Table>

                  <Col sm={12} style={{ borderTop: "1px solid #bfb2b2", marginTop: "10px" }}>
                    <table className="invoice-table" style={{ width: "100%", fontSize: "11px" }}>
                      <tbody>
                        <tr> <td style={{ textAlign: "center" }}>SUBJECT TO PUNE JURISDICTION</td> </tr>
                        <tr> <td style={{ textAlign: "center" }}>This is a Computer Generated Invoice </td> </tr>
                        <tr><td style={{ textAlign: "left" }}>Receiver's Signature.</td> </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row >
              </div>

            )
          })
        }
      </div>


    )
  }
}

class DiapatchInvoiceModalComponent extends React.Component {
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

export default DiapatchInvoiceModalComponent;