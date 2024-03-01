import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getOrderList(params, success, error) {
  getModuleList("sales/orders", params, success, error);
}

export function getOrderSingle(id, success, error) {
  getModuleSingle("sales/orders", id, success, error);
}

export function createOrder(order, success, error) {
  createModule("sales/orders", order, success, error);
}

export function updateOrder(order, success, error) {
  updateModule("sales/orders", order, success, error);
}

export function deleteOrder(id, success, error) {
  deleteModule("sales/orders", id, success, error);
}