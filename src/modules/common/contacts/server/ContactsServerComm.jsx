import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function createContact (contact, success, error) {
  createModule("common/contacts", contact, success, error);
}

export function getContactList (params, success, error) {
  getModuleList("common/contacts", params, success, error);
}

export function getContactSingle (id, success, error) {
  getModuleSingle("common/contacts", id, success, error);
}

export function updateContact (contact, success, error) {
  updateModule("common/contacts", contact, success, error);
}

export function deleteContact (id, success, error) {
  deleteModule("common/contacts", id, success, error);
}