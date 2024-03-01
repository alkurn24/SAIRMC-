import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule, downloadFile } from "js/server.js";

export function getTestReportList(params, success, error) {
  getModuleList("test-mgmt/test-reports", params, success, error);
}

export function getTestReportSingle(id, success, error) {
  getModuleSingle("test-mgmt/test-reports", id, success, error);
}

export function createTestReport(report, success, error) {
  createModule("test-mgmt/test-reports", report, success, error);

}

export function updateTestReport(report, success, error) {
  updateModule("test-mgmt/test-reports", report, success, error);
}

export function deleteTestReport(id, success, error) {
  deleteModule("test-mgmt/test-reports", id, success, error);
}

export function downloadTestReport(code, params, success, error) {
  downloadFile("test-mgmt/test-reports/", code + "/print", params, success, error)
}
