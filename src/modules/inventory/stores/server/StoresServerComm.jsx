
import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getInventoryList(params, success, error) {
  getModuleList("inventory/stores", params, success, error);
}
export function getInventorySingle(id, success, error) {
  getModuleSingle("inventory/stores", id, success, error);
}

export function createInventory(inventory, success, error) {
  createModule("inventory/stores", inventory, success, error);
}

export function updateInventory(inventory, success, error) {
  updateModule("inventory/stores", inventory, success, error);
}

export function deleteInventory(id, success, error) {
  deleteModule("inventory/stores", id, success, error);
}

