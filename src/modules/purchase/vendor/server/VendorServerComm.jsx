
import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getVendorList(params, success, error) {
  getModuleList("purchase/vendors", params, success, error);
}

export function getVendorSingle(id, success, error) {
  getModuleSingle("purchase/vendors", id, success, error);
}
export function getVendorStats(params, success, error) {
  getModuleList("purchase/vendors/stats", params, success, error);
}
export function createVendor(vendor, success, error) {
  createModule("purchase/vendors", vendor, success, error);
}

export function updateVendor(vendor, success, error) {
  updateModule("purchase/vendors/", vendor, success, error);
}

export function deleteVendor(id, success, error) {
  deleteModule("purchase/vendors/", id, success, error);
}
