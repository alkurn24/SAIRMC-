import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getPayrollHeads(params, success, error) {
  getModuleList("hrms/payrollheads", params, success, error);
}

export function createPayrollHeads(obj, success, error) {
  createModule("hrms/payrollheads", obj, success, error);
}

export function updatePayrollHeads(obj, success, error) {
  updateModule("hrms/payrollheads", obj, success, error);
}

export function deletePayrollHeads(id, success, error) {
  deleteModule("hrms/payrollheads", id, success, error);
}