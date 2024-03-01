import ProductReportComponent from "../modules/reports/components/productReport";
import InventoryReportComponent from "../modules/reports/components/inventoryReport"
import RawMaterialInwardReportComponent from "../modules/reports/components/inwardRawmaterialReport"
import grnReport from "../modules/reports/components/grnReport"
var reportsRoutes = [
	{
		path: "/reports/productReport",
		name: "Product Consumption",
		mini: "PR",
		component: ProductReportComponent
	},
	{
		path: "/reports/invReport",
		name: "Inventory Consumption",
		mini: "IR",
		component: InventoryReportComponent
	},
	{
		path: "/reports/rawmaterialInward",
		name: "Raw Material Inward Report",
		mini: "RMIR",
		component: RawMaterialInwardReportComponent
	},
	{
		path: "/reports/grnReport",
		name: "GRN Report",
		mini: "GR",
		component: grnReport
	}
];

export default reportsRoutes;