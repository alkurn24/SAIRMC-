import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule, downloadFile } from "js/server.js";

export function getPurchaseOrderList(params, success, error) {
  getModuleList("purchase/purchase-orders", params, success, error);
}

export function getPurchaseOrderSingle(id, success, error) {
  getModuleSingle("purchase/purchase-orders", id, success, error);
}

export function createPurchaseOrder(order, success, error) {
  createModule("purchase/purchase-orders", order, success, error);
}

export function updatePurchaseOrder(order, success, error) {
  updateModule("purchase/purchase-orders", order, success, error);
}

export function deletePurchaseOrder(id, success, error) {
  deleteModule("purchase/purchase-orders", id, success, error);
}
export function downloadPurchaseOrderReport(code, params, success, error) {
  downloadFile("purchase/purchase-orders/", code + "/downloadworkorder", params, success, error)
}