import { createModule, getModuleList, getModuleSingle, deleteModule, updateModule } from "js/server.js";

export function createMaintenaceLog(obj, success, error) {
  createModule("inventory/maintenance", obj, success, error);
 }
export function getMaintenaceLogList(params, success, error) {
  getModuleList("inventory/maintenance", params, success, error);
}
export function getMaintenaceLogSingle(id, success, error) {
  getModuleSingle("inventory/maintenance", id, success, error);
}
export function deleteMaintenaceLog(id, success, error) {
  deleteModule("inventory/maintenance", id, success, error);
}
export function updateMaintenaceLog(reviews, success, error) {
  updateModule("inventory/maintenance", reviews, success, error);

}