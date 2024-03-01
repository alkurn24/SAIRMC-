import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function createAddress (address, success, error) {
  createModule("common/addresses", address, success, error);
}

export function getAddressList (params, success, error) {
  getModuleList("common/addresses", params, success, error);
}

export function getAddressSingle (id, success, error) {
  getModuleSingle("common/addresses", id, success, error);
}

export function updateAddress (address, success, error) {
  updateModule("common/addresses", address, success, error);
}

export function deleteAddress (id, success, error) {
  deleteModule("common/addresses", id, success, error);
}