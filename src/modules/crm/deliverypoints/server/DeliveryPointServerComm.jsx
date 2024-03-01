import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getDeliveryPointList(params, success, error) {
  getModuleList("common/addresses", params, success, error);
}

export function getDeliveryPointSingle (id, success, error) {
  getModuleSingle("common/addresses", id, success, error);
}

export function createDeliveryPoint(obj, success, error) {
  createModule("common/addresses", obj, success, error);
}

export function updateDeliveryPoint(obj, success, error) {
  updateModule("common/addresses", obj, success, error);
}

export function deleteDeliveryPoint(id, success, error) {
  deleteModule("common/addresses", id, success, error);
}