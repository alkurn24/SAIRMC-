import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getTransporterList(params, success, error) {
  getModuleList("settings/transporters", params, success, error);
}

export function getTransporterSingle (id, success, error) {
  getModuleSingle("settings/transporters", id, success, error);
}

export function createTransporter(obj, success, error) {
  createModule("settings/transporters", obj, success, error);
}

export function updateTransporter(obj, success, error) {
  updateModule("settings/transporters", obj, success, error);
}

export function deleteTransporter(id, success, error) {
  deleteModule("settings/transporters", id, success, error);
}