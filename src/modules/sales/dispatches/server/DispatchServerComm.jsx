import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule, downloadFile } from "js/server.js";

export function getDispatchList(params, success, error) {
  getModuleList("sales/dispatches", params, success, error);
}

export function getDispatchSingle(id, success, error) {
  getModuleSingle("sales/dispatches", id, success, error);
}

export function createDispatch(dispatch, success, error) {
  createModule("sales/dispatches", dispatch, success, error);
}

export function updateDispatch(diapatch, success, error) {
  updateModule("sales/dispatches", diapatch, success, error);
}

export function deleteDispatch(id, success, error) {
  deleteModule("sales/dispatches", id, success, error);
}
export function downloadDispatchReport(code, params, success, error) {
  downloadFile("sales/dispatches/", code + "/download", params, success, error)
}
export function downloadDispatchChallanReport(code, params, success, error) {
  downloadFile("sales/dispatches/", code + "/downloadDeliveryChallan", params, success, error)
}