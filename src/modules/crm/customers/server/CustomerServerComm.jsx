
import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function createCustomer(customer, success, error) {
  createModule("crm/customers", customer, success, error);
}

export function getCustomerList(params, success, error) {
  getModuleList("crm/customers", params, success, error);
}
export function getCustomerStats(params, success, error) {
  getModuleList("crm/customers/stats", params, success, error);
}
export function getCustomerSingle(id, success, error) {
  getModuleSingle("crm/customers", id, success, error);
}

export function updateCustomer(customer, success, error) {
  updateModule("crm/customers", customer, success, error);
}

export function deleteCustomer(id, success, error) {
  deleteModule("crm/customers", id, success, error);
}