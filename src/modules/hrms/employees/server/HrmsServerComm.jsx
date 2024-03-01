
import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule, downloadFile } from "js/server.js";

export function getEmployeeList(params, success, error) {
  getModuleList("hrms/employees", params, success, error);
}
export function getSupervisorList(params, success, error) {
  getModuleList("hrms/employees/", params, success, error);
}
export function getEmployeeDetails(id, success, error) {
  getModuleList("hrms/employees/employeedetails", id, success, error);
}
export function getLeaveType(params, success, error) {
  getModuleList("hrms/leavetype/all", params, success, error);
}
export function getLeaveDetails(params, success, error) {
  getModuleList("hrms/leave", params, success, error);
}
export function getLocationOrgChart(employee, success, error) {
  getModuleList("hrms/employees/orgchart", employee, success, error);
}
export function getPayrollHeadsList(params, success, error) {
  getModuleList("hrms/payrollheads", params, success, error);
}
export function getPayrollHeads(params, success, error) {
  getModuleSingle("hrms/payrollheads", params, success, error);
}
export function getPayrollInfo(params, success, error) {
  getModuleSingle("hrms/payrolldata/getPayrollinfo", params, success, error);
}
export function getPayrollData(id, success, error) {
  getModuleSingle("hrms/payrolldata", id, success, error);
}
export function updateEmployee(employee, success, error) {
  updateModule("hrms/employees", employee, success, error);
}
export function deleteEmployee(id, success, error) {
  deleteModule("hrms/employees", id, success, error);
}
export function createEmployee(employee, success, error) {
  createModule("hrms/employees", employee, success, error);
}
export function createLeaveApllication(employee, success, error) {
  createModule("hrms/leave", employee, success, error);
}
export function createPayrollData(payrollHeads, success, error) {
  createModule("hrms/payrolldata", payrollHeads, success, error);
}
export function changeApplicationStatus(employee, success, error) {
  updateModule("hrms/leave", employee, success, error);
}
export function getSalaryListSlips(id, success, error) {
  getModuleList("hrms/payslip", id, success, error);
}
export function downloadSalarySlip(id, success, error) {
  downloadFile("hrms/payslip/", id, success, error);
}
export function getReimbursementList(id, success, error) {
  getModuleList("hrms/reimbursement", id, success, error);
}
export function createExpense(expense, success, error) {
  createModule("hrms/reimbursement", expense, success, error);
}
export function updateExpense(expense, success, error) {
  updateModule("hrms/reimbursement", expense, success, error);
}
export function deleteExpense(id, success, error) {
  deleteModule("hrms/reimbursement", id, success, error);
}
export function getExpenseSingle(params, success, error) {
  getModuleSingle("hrms/reimbursement", params, success, error);
}