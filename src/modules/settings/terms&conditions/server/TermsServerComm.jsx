import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getTermsList(params, success, error) {
  getModuleList("settings/terms", params, success, error);
}

export function getTermsSingle(id, success, error) {
  getModuleSingle("settings/terms", id, success, error);
}

export function createTerms(obj, success, error) {
  createModule("settings/terms", obj, success, error);
}

export function updateTerms(obj, success, error) {
  updateModule("settings/terms", obj, success, error);
}

export function deleteTerms(id, success, error) {
  deleteModule("settings/terms", id, success, error);
}