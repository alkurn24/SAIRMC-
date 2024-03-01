import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getPurchaseRequestList(params, success, error) {
  getModuleList("purchase/requests", params, success, error);
}

export function getPurchaseRequestSingle(id, success, error) {
  getModuleSingle("purchase/requests", id, success, error);
}

export function createPurchaseRequest(order, success, error) {
  createModule("purchase/requests", order, success, error);
}

export function updatePurchaseRequest(order, success, error) {
  updateModule("purchase/requests", order, success, error);
}

export function deletePurchaseRequest(id, success, error) {
  deleteModule("purchase/requests", id, success, error);
}