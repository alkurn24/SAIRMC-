
import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function createEmployee(employee, success, error) {
  createModule("hrms/employees", employee, success, error);
}

export function getEmployeeList(params, success, error) {
  getModuleList("hrms/employees", params, success, error);
}

export function getEmployeeStats(params, success, error) {
  getModuleList("hrms/employees/stats", params, success, error);
}

export function getEmployeeSingle(id, success, error) {
  getModuleSingle("hrms/employees", id, success, error);
}

export function updateEmployee(employee, success, error) {
  updateModule("hrms/employees", employee, success, error);
}

export function deleteEmployee(id, success, error) {
  deleteModule("hrms/employees", id, success, error);
}
export function getEmployeeOrgChart(params, success, error) {
  getModuleList("hrms/employees/org-chart", params, success, error);
}
export function createLeaveTracking(employee, success, error) {
  createModule("hrms/leave", employee, success, error);
}
export function getLeaveTrackingList(params, success, error) {
  getModuleList("hrms/employees", params, success, error);
}
export function getParentDesignation(id, success, error) {
  getModuleSingle("hrms/employees/designation", id, success, error);
}