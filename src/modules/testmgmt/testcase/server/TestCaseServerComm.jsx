import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getTestCaseList(params, success, error) {
  getModuleList("test-mgmt/test-cases", params, success, error);
}

export function getTestCaseSingle (id, success, error) {
  getModuleSingle("test-mgmt/test-cases", id, success, error);
}

export function createTestCase(obj, success, error) {
  createModule("test-mgmt/test-cases", obj, success, error);
}

export function updateTestCase(obj, success, error) {
  updateModule("test-mgmt/test-cases", obj, success, error);
}

export function deleteTestCase(id, success, error) {
  deleteModule("test-mgmt/test-cases", id, success, error);
}
