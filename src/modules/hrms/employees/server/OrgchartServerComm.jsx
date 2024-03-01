import { createModule, getModuleList, updateModule, deleteModule } from "js/server.js";

export function getDesignationList(params, success, error) {
    getModuleList("hrms/orgchart", params, success, error);
}
export function getDesignationOrgChart(params, success, error) {
    getModuleList("hrms/orgchart/orgchart", params, success, error);
}
export function updateOrgChart(employee, success, error) {
    updateModule("hrms/orgchart", employee, success, error);
}
export function deleteOrgChart(id, success, error) {
    deleteModule("hrms/orgchart", id, success, error);
}
export function createOrgChart(employee, success, error) {
    createModule("hrms/orgchart", employee, success, error);
}