import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getUnitList(params, success, error) {
  getModuleList("settings/settings-unit", params, success, error);
}

export function getUnitSingle(id, success, error) {
  getModuleSingle("settings/settings-unit", id, success, error);
}

export function createUnit(obj, success, error) {
  createModule("settings/settings-unit", obj, success, error);
}

export function updateUnit(obj, success, error) {
  updateModule("settings/settings-unit", obj, success, error);
}

export function deleteUnit(id, success, error) {
  deleteModule("settings/settings-unit", id, success, error);
}