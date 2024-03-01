import React, { Component } from "react";
import { Col, Row, FormGroup } from "react-bootstrap";
import ChartistGraph from "react-chartist";
import Card from "components/Card/Card.jsx";
import Select from "react-select";
import StatsCard from "components/Card/StatsCard.jsx";
import ReactTable from "react-table";
import Moment from "moment";

import { getDashboardData } from "../server/DashboardServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import { getInventoryList } from "../../inventory/stores/server/StoresServerComm.jsx";
import { getMaintenaceLogList } from "../../assetsmgmt/maintenance/server/MaintenanceLogServerComm.jsx";


class PurchaseOrderDashboardFormComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: Moment().startOf("day"),
			endDate: Moment().endOf("day"),
			storesList: [],
			dashdata: [],
			events: [],
			socket: getSocket(),
			filter: {
				plant: "All"
			},

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
		this.handleDropDownChange = this.handleDropDownChange.bind(this);
		this.fetchDataServerPlant = this.fetchDataServerPlant.bind(this);
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
		this.fetchDataServerPlant();
		this.fetchDataFromServer();
	}
	fetchDataFromServer() {
		let _this = this;
		let params = "";
		getDashboardData(null,
			function success(data) {
				console.log(data);
				_this.setState({
					summary: data,
					loading: false
				})
			})
		getInventoryList(params,
			function success(data) {
				var tempData = []
				data.rows.map((prop, key) => {
					var temp = prop.stock.filter(x => {
						return (_this.state.filter.plant !== "All"
							? x.plant.id === _this.state.filter.plant
							: true
						)
					})
					return (
						temp.map(prop1 => {
							tempData.push({
								key: key + 1,
								_id: prop.id,
								name: prop.name ? prop.name : "",
								stdQty: prop1.standardQty ? prop1.standardQty : "",
								minStockQty: prop1.minStockQty ? prop1.minStockQty : 0,
								plant: prop1.plant ? prop1.plant.name : "",

							})
							return
						})
					)
				})
				_this.setState({ storesList: tempData, })
			}
		);

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
	fetchDataServerPlant() {
		let _this = this;
		getPlantList(null,
			function success(data) {
				_this.setState({
					plantList: data.rows.map((s) => {
						return {
							_id: s.id,
							value: s.id,
							label: s.name,
						}
					})
				});
				if (_this.state.plantList.length) {
					_this.handleDropDownChange(_this.state.plantList[0], "plant")
				}
			})
	}

	handleDropDownChange(selectOption, type) {
		var newFilter = this.state.filter;
		newFilter[type] = selectOption ? selectOption.value : null;
		this.fetchDataFromServer();
		this.setState({ filter: newFilter });
	}
	render() {
		var srNo = { Header: "SR", accessor: "srNo", width: 50, Cell: (row => { return (<div>{row.index + 1}</div>) }) }
		var nameCol = { Header: "Name", accessor: "name", sortable: true, width: 200, }
		var qtyStockCol = {
			Header: "Stock", accessor: "stdQty", width: 100, sortable: true, Cell: (row => {
				let className = "value-success";
				if (row.original.stdQty <= row.original.minStockQty) { className = "value-danger" }
				else if (row.original.stdQty <= (row.original.minStockQty * 1.2)) { className = "value-warning" }
				return (<div className={className}>{row.original.stdQty ? row.original.stdQty : 0}</div>)
			})
		}
		var locationCol = { Header: "LOCATION", accessor: "plant", sortable: false, width: 200 }
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

		// 					{!this.state.storesList || !this.state.storesList.length
		// 						? (<div></div>
		// 						) : (<div>
		// 							<Card
		// 								title="Inventory List"
		// 								content={<div>
		// 									<FormGroup>
		// 										<Select
		// 											clearable={false}
		// 											placeholder="Select Location"
		// 											name="plant"
		// 											value={this.state.filter.plant ? this.state.filter.plant : null}
		// 											options={this.state.plantList}
		// 											onChange={(selectOption) => this.handleDropDownChange(selectOption, "plant")}
		// 										/>
		// 									</FormGroup>
		// 									<ReactTable
		// 										columns={[srNo, nameCol, qtyStockCol, locationCol]}
		// 										data={this.state.storesList}
		// 										minRows={0}
		// 										sortable={false}
		// 										className="-striped -highlight"
		// 										defaultPageSize={10}
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
		// 										defaultPageSize={10}
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
		return (
			<div>
				{this.state.alert}
				{/* {table} */}
			</div>
		);
	}
}


export default PurchaseOrderDashboardFormComponent;
