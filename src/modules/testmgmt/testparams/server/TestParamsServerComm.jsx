import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getTestParamsList(params, success, error) {
  getModuleList("test-mgmt/test-params", params, success, error);
}

export function getTestParamsSingle (id, success, error) {
  getModuleSingle("test-mgmt/test-params", id, success, error);
}

export function createTestParams(obj, success, error) {
  createModule("test-mgmt/test-params", obj, success, error);
}

export function updateTestParams(obj, success, error) {
  updateModule("test-mgmt/test-params", obj, success, error);
}

export function deleteTestParams(id, success, error) {
  deleteModule("test-mgmt/test-params", id, success, error);
}
