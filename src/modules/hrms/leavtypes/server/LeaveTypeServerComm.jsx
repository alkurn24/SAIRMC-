import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getLeaveTypes(params, success, error) {
  getModuleList("hrms/leavetype", params, success, error);
}

export function createLeaveType(obj, success, error) {
  createModule("hrms/leavetype", obj, success, error);
}

export function updateLeaveType(obj, success, error) {
  updateModule("hrms/leavetype", obj, success, error);
}

export function deleteLeaveType(id, success, error) {
  deleteModule("hrms/leavetype", id, success, error);
}