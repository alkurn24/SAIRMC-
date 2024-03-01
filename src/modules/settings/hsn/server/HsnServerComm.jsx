import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getHsnList(params, success, error) {
  getModuleList("settings/settings-hsn", params, success, error);
}

export function getHsnSingle (id, success, error) {
  getModuleSingle("settings/settings-hsn", id, success, error);
}

export function createHsn(obj, success, error) {
  createModule("settings/settings-hsn", obj, success, error);
}

export function updateHsn(obj, success, error) {
  updateModule("settings/settings-hsn", obj, success, error);
}

export function deleteHsn(id, success, error) {
  deleteModule("settings/settings-hsn", id, success, error);
}