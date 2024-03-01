import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule, customGet, customUpdate } from "js/server.js";

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

export function generateResetToken(email, success, error) {
  customGet("users/generate-token/" + email, false, success, error)
}

export function getResetToken(token, success, error) {
  customGet("users/reset/" + token, false, success, error);
}

export function updatePassword(obj, success, error) {
  customUpdate("users/" + obj.id + "/reset", obj, success, error)
}



// WEBPACK FOOTER //
// src/modules/settings/usermgmt/server/UserServerComm.jsx