import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getBomList(params, success, error) {
  getModuleList("production/bom", params, success, error);
}

export function getBomSingle (id, success, error) {
  getModuleSingle("production/bom", id, success, error);
}

export function createBom(receipie, success, error) {
  createModule("production/bom", receipie, success, error);
}

export function updateBom(receipie, success, error) {
  updateModule("production/bom", receipie, success, error);
}

export function deleteBom(id, success, error) {
  deleteModule("production/bom", id, success, error);
}