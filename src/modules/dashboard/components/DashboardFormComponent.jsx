import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import ChartistGraph from "react-chartist";
import Card from "components/Card/Card.jsx";
import StatsCard from "components/Card/StatsCard.jsx";
import ReactTable from "react-table";
import StatsCard1 from "components/Card/StatsCard.1.jsx";
import StatsCard2 from "components/Card/StatsCard.2.jsx";
import Moment from "moment";

import { getDashboardData } from "../server/DashboardServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import { getDispatchList } from "modules/sales/dispatches/server/DispatchServerComm.jsx";
import { getMaintenaceLogList } from "../../assetsmgmt/maintenance/server/MaintenanceLogServerComm.jsx";

class DashboardPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: Moment().startOf("day"),
			endDate: Moment().endOf("day"),
			dispatchList: [],
			dashdata: [],
			events: [],
			socket: getSocket(),


			summary: {
				maintenanceCount: 0,
				plannedDispatch: 0,
				inprogressDispatch: 0,
				dispatchedDispatch: 0,
				acceptedDispatch: 0,
				rejectedDispatch: 0,
				planedGrn: 0,
				dispatchProgressGraph: {},
				productSale: {},
			},

			currency: "₹"
		}
		this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
		this.getSocketConnection = this.getSocketConnection.bind(this);
	}

	getSocketConnection() {
		if (getSocket()) {
			this.setState({ socket: getSocket() })
			setTimeout(() => {
				console.log(this.state.socket)
				this.state.socket.on("Dispatch", () => this.fetchDataFromServer())
			}, 100)
		} else setTimeout(this.getSocketConnection, 2000)
	}
	componentWillMount() {

		this.getSocketConnection();
		this.fetchDataFromServer();
	}
	fetchDataFromServer() {
		let _this = this;
		getDashboardData(null,
			function success(data) {
				console.log(data);
				_this.setState({
					summary: data,
					loading: false
				})
			})
		getDispatchList(("startDate=" + Moment(this.state.startDate).format("DD-MM-YYYY") + "&" + "endDate=" + Moment(this.state.endDate).format("DD-MM-YYYY") + "&status=Planned"),
			function success(data) {
				_this.setState({
					dispatchListData: data.rows.map((prop) => {
						return ({
							date: Moment(prop.dispatchDate).format("DD MMM YYYY hh:mm:ss A"),
							status: prop.status ? prop.status : "",
							code: prop.code ? prop.code : "",
							number: prop.number ? prop.number : "",
							order: (<a className="edit-link" href={"#/sales/orders-edit/" + prop.order.code ? prop.order.code : ""}>{prop.order ? prop.order.number : ""}</a>),
							customer: (<a className="edit-link" href={"#/crm/customers-edit/" + prop.order.customer.code}>{prop.order.customer.name}</a>),
							transporter: prop.transporter ? prop.transporter.name : "",
						});
					})

				})
			})
		let params = null;
		getMaintenaceLogList(params,
			function success(data) {
				var tempData = data.rows.map((prop, key) => {
					return {
						srNo: key + 1,
						code: prop.code,
						number: prop.number,
						name: prop.asset.name,
						maintenanceDate: prop.maintenanceDate ? Moment(prop.maintenanceDate).format("DD-MMM-YYYY ") : "",
						status: prop.status,
						groupId: prop.groupId,

					};
				})
				_this.setState({ events: tempData })
			},
			function error(error) { _this.setState({ events: [] }); }
		);
	}

	render() {
		var srNo = { Header: "SR", accessor: "srNo", width: 50, Cell: (row => { return (<div>{row.index + 1}</div>) }) }
		var dateCol = { Header: "Date", accessor: "date", width: 100, sortable: true }
		var statusCol = { Header: "Status", accessor: "status", width: 100, sortable: true }
		var orderCol = { Header: "Order Code", accessor: "order", width: 120, sortable: false }
		var customerCol = { Header: "Customer", accessor: "customer", width: 120, sortable: true }
		var maintenanceDateCol = { Header: "Maintenance Date", accessor: "maintenanceDate", width: 150, sortable: false }
		var maintenanceStatusCol = { Header: "Status", accessor: "status", width: 100, sortable: true }
		var assetNameCol = { Header: "Asset Name", accessor: "name", width: 120, sortable: true }
		var assetCodeCol = { Header: " Code", accessor: "number", width: 100, sortable: false }
		var responsiveSales = [
			[
				"screen and (max-width: 640px)",
				{
					axisX: {
						labelInterpolationFnc: function (value) {
							return value[0];
						}
					}
				}
			]
		];
		var optionsSales = {
			showLabel: true,
			low: 0,
			high: Math.max(this.state.summary ? this.state.summary.dispatchProgressGraph : 0),
			showArea: false,
			height: "245px",
			axisX: {
				showGrid: false
			},
			lineSmooth: true,
			showLine: true,
			showPoint: true,
			fullWidth: true,
			chartPadding: {
				left: 50,
				right: 50
			}
		};


		const activityChart = {
			type: "Bar",
			data: {
				labels: [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"Mai",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec"
				],
				series: [
					[283, 173, 154, 700, 138.50, 151.50, 300, 168.50, 224, 187, 187],
					[101, 173, 237, 580, 190, 187, 132, 168.50, 190, 114, 33.50],
					[283, 173, 154, 700, 138.50, 151.50, 300, 168.50, 224, 187, 187],
					[101, 173, 237, 580, 190, 187, 132, 168.50, 190, 114, 33.50]
				]
			}
		}

		const charts = [
			{
				chart: {
					title: "Activity",
					category: "Multiple Bars Chart",
					chart: activityChart
				}
			}
		];

		const activityChartRawMaterial = {
			type: "Bar",
			data: {
				labels: [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"Mai",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec"

				],
				series: [
					[3156, 6483, 3554, 248, 138.50, 75217, 3300, 168.50, 224, 4400, 700, 500],
					[45876, 4496.00, 570.00, 7813, 7484.00, 1262.00, 1477.00, 1668.50, 3418.00, 300, 700, 800],
					[350, 400, 450, 370, 1250, 5449, 890, 168.50, 347, 45276, 795, 328],
					[438, 658.00, 5370.00, 7813, 7484.00, 46876.00, 4388.00, 168.50, 6354.00, 439, 578]
				]
			}
		}

		const chartsRawMaterial = [
			{
				chart: {
					title: "Activity",
					category: "Multiple Bars Chart",
					chart: activityChartRawMaterial
				}
			}
		];
		// let table = (
		// 	<Col xs={12} className="DashBoard">
		// 		<Row>
		// 			<Col md={2}>
		// 				<StatsCard
		// 					statsValue={this.state.summary.maintenanceCount ? this.state.summary.maintenanceCount : 0}
		// 					statsIconText="Maintenances"
		// 				/>
		// 			</Col>
		// 			<Col md={2}>
		// 				<StatsCard
		// 					statsValue={this.state.summary.plannedDispatch.count ? this.state.summary.plannedDispatch.count : 0}
		// 					statsIconText="Planned Dispatch"
		// 				/>
		// 			</Col>
		// 			<Col md={2}>
		// 				<StatsCard
		// 					statsValue={this.state.summary.inprogressDispatch ? this.state.summary.inprogressDispatch : 0}
		// 					statsIconText="Inprogress Dispatch"
		// 				/>
		// 			</Col>
		// 			<Col md={2}>
		// 				<StatsCard
		// 					statsValue={this.state.summary.dispatchedDispatch ? this.state.summary.dispatchedDispatch : 0}
		// 					statsIconText="Dispatched Dispatch"
		// 				/>
		// 			</Col>

		// 			<Col md={2}>
		// 				<StatsCard
		// 					statsValue={this.state.summary.rejectedDispatch ? this.state.summary.rejectedDispatch : 0}
		// 					statsIconText="Rejected Dispatch"
		// 				/>
		// 			</Col>
		// 			<Col md={2}>
		// 				<StatsCard
		// 					statsValue={this.state.summary.planedGrn ? this.state.summary.planedGrn.count : 0}
		// 					statsIconText="Planned GRN"
		// 				/>
		// 			</Col>
		// 		</Row>
		// 		<Row>
		// 			<Col md={6}>
		// 				<Row>
		// 					{!this.state.dispatchListData || !this.state.dispatchListData.length
		// 						? (<div></div>
		// 						) : (<div>
		// 							<Card
		// 								title="Production Schedule List"
		// 								content={<div>
		// 									<ReactTable
		// 										data={this.state.dispatchListData}
		// 										columns={
		// 											[srNo, dateCol, statusCol, orderCol, customerCol]
		// 										}
		// 										minRows={0}
		// 										sortable={false}
		// 										className="-striped -highlight"
		// 										showPaginationTop={false}
		// 										showPaginationBottom={false}
		// 									/>
		// 								</div>
		// 								}
		// 							></Card>
		// 						</div>
		// 						)
		// 					}
		// 				</Row>
		// 			</Col>
		// 			<Col md={6}>
		// 				<Row>
		// 					{!this.state.events || !this.state.events.length
		// 						? (
		// 							<div></div>
		// 						) : (<div>
		// 							<Card
		// 								title="Maintenance  List"
		// 								content={<div>
		// 									<ReactTable
		// 										data={this.state.events}
		// 										columns={
		// 											[srNo, maintenanceDateCol, maintenanceStatusCol, assetNameCol, assetCodeCol,]
		// 										}
		// 										minRows={0}
		// 										sortable={false}
		// 										className="-striped -highlight"
		// 										showPaginationTop={false}
		// 										showPaginationBottom={false}

		// 									/>
		// 								</div>
		// 								}
		// 							></Card>
		// 						</div>
		// 						)

		// 					}
		// 				</Row>
		// 			</Col>
		// 		</Row>
		// 		{/* <Col sm={6} md={6}>
		// 			<Row>
		// 				<Card
		// 					title="Order Value (last 12 months)"
		// 					content={
		// 						<ChartistGraph
		// 							data={this.state.summary.dispatchProgressGraph}
		// 							type="Line"
		// 							options={optionsSales}
		// 							responsiveOptions={responsiveSales}
		// 						/>
		// 					}
		// 					legend={
		// 						<div>
		// 							<i className="fa fa-circle text-info" /> Orders Value

		// 						</div>
		// 					}
		// 				/>
		// 			</Row>
		// 		</Col> */}
		// 		{/* <Row>
		// 			<Col xs={6} md={6}>
		// 				<Row>
		// 					{charts.map((prop, key) => {
		// 						return (
		// 							<div key={key}>
		// 								<Card
		// 									title="Product Wise Dispatch (last 12 months)"
		// 									category=""
		// 									content={
		// 										<ChartistGraph
		// 											data={prop.chart.chart.data}
		// 											type="Bar"
		// 											options={prop.chart.chart.options}
		// 											responsiveOptions={responsiveSales}
		// 										/>
		// 									}
		// 									legend={
		// 										<div>
		// 											<i className="fa fa-circle text-info" /> M-7.5
		// 										<i className="fa fa-circle text-danger" /> M-10
		// 										<i className="fa fa-circle text-primary" />M-20
		// 										<i className="fa fa-circle text-success" /> M-25
		// 									</div>
		// 									}
		// 								// "M-15",
		// 								// "M-20",
		// 								// "M-25",
		// 								// "M-30",
		// 								// "M-35",
		// 								// "M-40",
		// 								// "M-40 SCC",
		// 								// "M-45",
		// 								// "M-50",
		// 								/>
		// 							</div>
		// 						);
		// 					})}
		// 				</Row>

		// 			</Col>
		// 			<Col xs={6} md={6}>
		// 				<Row>
		// 					{chartsRawMaterial.map((prop, key) => {
		// 						return (
		// 							<div key={key}>
		// 								<Card
		// 									title="Raw Material Wise Consumption (last 12 months)"
		// 									category=""
		// 									content={
		// 										<ChartistGraph
		// 											data={prop.chart.chart.data}
		// 											type="Bar"
		// 											options={prop.chart.chart.options}
		// 											responsiveOptions={responsiveSales}
		// 										/>
		// 									}
		// 									legend={
		// 										<div>
		// 											<i className="fa fa-circle text-info" />10 MM
		// 										<i className="fa fa-circle text-primary" />20 MM
		// 										<i className="fa fa-circle text-success" />CEMENT
		// 										<i className="fa fa-circle text-danger" />WATER

		// 									</div>
		// 									}
		// 								/>
		// 							</div>
		// 						);
		// 					})}
		// 				</Row>

		// 			</Col>
		// 		</Row> */}
		// 	</Col>
		// )

		// let form = (
		// 	<div>
		// 		<Col xs={12} sm={6} md={4} lg={4} >

		// 			<StatsCard
		// 				bigIcon={<i className="fa fa-info text-warning" />}
		// 				statsText="New Orders"
		// 				statsValue={0}
		// 			// statsIcon={<i className="fa fa-refresh" />}
		// 			// statsIconText={<div className="text-right">{this.state.currency + " " + (this.state.dashdata ? this.state.dashdata.inquiry.amount : 0)}</div>}
		// 			/>
		// 		</Col>
		// 		<Col xs={12} sm={6} md={4} lg={4}>
		// 			<StatsCard1
		// 				bigIcon={<i className="fa fa-quora text-warning" />}
		// 				statsText="Dispatching Orders"
		// 				statsValue={0}
		// 			// statsIcon={<i className="fa fa-refresh" />}
		// 			// statsIconText={<div className="text-right">{this.state.currency + " " + (this.state.dashdata ? this.state.dashdata.quotation.amount : 0)}</div>}
		// 			/>
		// 		</Col>
		// 		<Col xs={12} sm={6} md={4} lg={4} >
		// 			<StatsCard2
		// 				bigIcon={<i className="fa fa-shopping-cart text-warning" />}
		// 				statsText="Closed Orders"
		// 				statsValue={0}
		// 			// statsIcon={<i className="fa fa-refresh" />}
		// 			// statsIconText={<div className="text-right">{this.state.currency + " " + (this.state.dashdata ? this.state.dashdata.order.amount : 0)}</div>}
		// 			/>
		// 		</Col>
		// 		{/* <Col lg={3} sm={6}>
		//     <StatsCard
		//       bigIcon={<i className="fa fa-rupee text-info" />}
		//       statsText="Stock Inventory"
		//       statsValue={this.state.dashdata ? this.state.dashdata.product.amount : 0}
		//       statsIcon={<i className="fa fa-refresh" />}
		//       statsIconText="Updated now"
		//     />
		//   </Col>  */}

		// 		{/* <Col lg={3} sm={6}>
		//       <StatsCard3
		//         bigIcon={<i className="fa fa-info text-warning" />}
		//         statsText="Planned Dispatches"
		//         statsValue={this.state.dashdata ? this.state.dashdata.dispatches.planned : 0}
		//       // statsIcon={<i className="fa fa-refresh" />}
		//       // statsIconText={<div className="text-right">{this.state.currency + " " + (this.state.dashdata ? this.state.dashdata.inquiry.amount : 0)}</div>}
		//       />
		//     </Col> */}

		// 		<Col xs={12} sm={6} md={4} lg={4}>
		// 			<StatsCard
		// 				bigIcon={<i className="fa fa-quora text-warning" />}
		// 				statsText="In-Progress Dispatches"
		// 				statsValue={0}
		// 			// statsIcon={<i className="fa fa-refresh" />}
		// 			// statsIconText={<div className="text-right">{this.state.currency + " " + (this.state.dashdata ? this.state.dashdata.quotation.amount : 0)}</div>}
		// 			/>
		// 		</Col>
		// 		<Col xs={12} sm={6} md={4} lg={4}>
		// 			<StatsCard1
		// 				bigIcon={<i className="fa fa-shopping-cart text-warning" />}
		// 				statsText="Complete Dispatches"
		// 				statsValue={0}
		// 			// statsIcon={<i className="fa fa-refresh" />}
		// 			// statsIconText={<div className="text-right">{this.state.currency + " " + (this.state.dashdata ? this.state.dashdata.order.amount : 0)}</div>}
		// 			/>
		// 		</Col>
		// 		<Col xs={12} sm={6} md={4} lg={4}>
		// 			<StatsCard2
		// 				bigIcon={<i className="fa fa-rupee text-info" />}
		// 				statsText="Paid Dispatches"
		// 				statsValue={0}
		// 			// statsIcon={<i className="fa fa-refresh" />}
		// 			// statsIconText="Updated now"
		// 			/>
		// 		</Col>
		// 		{/* <Col sm={12} md={12}>
		//       <Card
		//         // title="Users Behavior"
		//         // category="24 Hours performance"
		//         content={
		//           <ChartistGraph
		//             data={dataSales}
		//             type="Line"
		//             options={optionsSales}
		//             responsiveOptions={responsiveSales}
		//           />
		//         }
		//         legend={
		//           <div>
		//             <i className="fa fa-circle text-info" /> Open
		//                 <i className="fa fa-circle text-danger" /> Click
		//                 <i className="fa fa-circle text-warning" /> Click Second
		//         Time
		//               </div>
		//         }
		//         stats={
		//           <div>
		//             <i className="fa fa-history" /> Updated 3 minutes ago
		//               </div>
		//         }
		//       />
		//       </Col> */}
		// 		{/* <Card

		//         title="Order Value (last 12 months)"
		//         // category="24 Hours performance"
		//         content={
		//           <ChartistGraph
		//             data={this.state.dashdata.chartData}
		//             type="Line"
		//             options={optionsSales}
		//             responsiveOptions={responsiveSales}
		//           />
		//         }
		//         legend={
		//           <div>
		//             <i className="fa fa-circle text-info" /> Orders Value
		//           </div>
		//         }
		//       /> */}

		// 		<Col sm={12} md={12} >
		// 			<Card
		// 				title="Order Value (last 12 months)"
		// 				// category="24 Hours performance"
		// 				content={
		// 					<ChartistGraph
		// 						//	data={this.state.dashdata.chartData}
		// 						type="Line"
		// 						options={optionsSales}
		// 						responsiveOptions={responsiveSales}
		// 					/>
		// 				}
		// 				legend={
		// 					<div>
		// 						<i className="fa fa-circle text-info" /> Orders Value

		// 					</div>
		// 				}

		// 			/>
		// 		</Col>

		// 	</div >
		// );
		return (
			<div>
				{this.state.alert}
				{/* {table} */}

				{/* {form} */}
			</div>
		);
	}
}


export default DashboardPage;
