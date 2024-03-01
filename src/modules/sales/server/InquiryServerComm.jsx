import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getInquiryList(params, success, error) {
  getModuleList("sales/inquiries", params, success, error);
}

export function getInquirySingle (id, success, error) {
  getModuleSingle("sales/inquiries", id, success, error);
}

export function createInquiry(inquiry, success, error) {
  createModule("sales/inquiries", inquiry, success, error);
}

export function updateInquiry(inquiry, success, error) {
  updateModule("sales/inquiries", inquiry, success, error);
}

export function deleteInquiry(id, success, error) {
  deleteModule("sales/inquiries", id, success, error);
}