import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getInventorySettingList(params, success, error) {
  getModuleList("settings/inventory", params, success, error);
}

export function getInventorySettingSingle (id, success, error) {
  getModuleSingle("settings/inventory", id, success, error);
}

export function createInventorySetting(obj, success, error) {
  createModule("settings/inventory", obj, success, error);
}

export function updateInventorySetting(obj, success, error) {
  updateModule("settings/inventory", obj, success, error);
}

export function deleteInventorySetting(id, success, error) {
  deleteModule("settings/inventory", id, success, error);
}