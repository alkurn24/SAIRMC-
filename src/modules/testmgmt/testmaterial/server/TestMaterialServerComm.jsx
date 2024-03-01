import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getTestMaterialList(params, success, error) {
  getModuleList("test-mgmt/test-material", params, success, error);
}

export function getTestMaterialSingle (id, success, error) {
  getModuleSingle("test-mgmt/test-material", id, success, error);
}

export function createTestMaterial(obj, success, error) {
  createModule("test-mgmt/test-material", obj, success, error);
}

export function updateTestMaterial(obj, success, error) {
  updateModule("test-mgmt/test-material", obj, success, error);
}

export function deleteTestMaterial(id, success, error) {
  deleteModule("test-mgmt/test-material", id, success, error);
}
