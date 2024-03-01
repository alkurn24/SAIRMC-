import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule, downloadFile } from "js/server.js";

export function getMovementList(params, success, error) {
  getModuleList("inventory/movement", params, success, error);

}
export function getMovementSingle(id, success, error) {
  getModuleSingle("inventory/movement/", id, success, error);
}

export function createMovement(inward_outwardDetails, success, error) {
  createModule("inventory/movement", inward_outwardDetails, success, error);
}

export function updateMovement(inward_outwardDetails, success, error) {
  updateModule("inventory/movement", inward_outwardDetails, success, error);
}

export function deleteMovement(id, success, error) {
  deleteModule("inventory/movement", id, success, error);
}
export function downloadMovementReport(code, params, success, error) {
  downloadFile("inventory/movement/", code + "/downloadreturnablegp", params, success, error)
}
