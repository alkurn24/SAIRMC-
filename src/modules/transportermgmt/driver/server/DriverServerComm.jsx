import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getUserList(params, success, error) {
  getModuleList("users", params, success, error);
}

export function getUserSingle(id, success, error) {
  getModuleSingle("users", id, success, error);
}

export function createUser(obj, success, error) {
  createModule("users", obj, success, error);
}

export function updateUser(obj, success, error) {
  updateModule("users", obj, success, error);
}

export function deleteUser(id, success, error) {
  deleteModule("users", id, success, error);
}