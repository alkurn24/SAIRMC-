import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getGrnList(params, success, error) {
  getModuleList("purchase/grn", params, success, error);
}

export function getGrnSingle (id, success, error) {
  getModuleSingle("purchase/grn", id, success, error);
}

export function createGrn(grn, success, error) {
  createModule("purchase/grn", grn, success, error);
}

export function updateGrn(grn, success, error) {
  updateModule("purchase/grn", grn, success, error);
}

export function deleteGrn(id, success, error) {
  deleteModule("purchase/grn", id, success, error);
}