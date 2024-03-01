import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule, downloadFile } from "js/server.js";

export function getDispatchScheduleList(params, success, error) {
  getModuleList("sales/dispatchSchedule", params, success, error);
}

export function getDispatchScheduleSingle(id, success, error) {
  getModuleSingle("sales/dispatchSchedule", id, success, error);
}

export function createDispatchSchedule(dispatch, success, error) {
  createModule("sales/dispatchSchedule", dispatch, success, error);
}

export function updateDispatchSchedule(diapatch, success, error) {
  updateModule("sales/dispatchSchedule", diapatch, success, error);
}

export function deleteDispatchSchedule(id, success, error) {
  deleteModule("sales/dispatchSchedule", id, success, error);
}
export function downloadDispatchScheduleReport(code, params, success, error) {
  downloadFile("sales/dispatchSchedule/", code + "/download", params, success, error)
}