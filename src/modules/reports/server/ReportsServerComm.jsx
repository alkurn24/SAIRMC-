
import axios from "axios";
import { backendURL } from "variables/appVariables.jsx";

export function getProductReport(params, success, error) {
  axios.get(backendURL + "reports?" + params, success, error)
    .then(res => {
      if (res.status === 200) { success(res.data); }
      else { error(res.status); }
    });
}

export function getBOMReport(params, success, error) {
  axios.get(backendURL + "reports/bomreport?" + params, success, error)
    .then(res => {
      if (res.status === 200) { success(res.data); }
      else { error(res.status); }
    });
}
export function getGRNReport(params, success, error) {
  axios.get(backendURL + "reports/grnreport?" + params, success, error)
    .then(res => {
      if (res.status === 200) { success(res.data); }
      else { error(res.status); }
    });
}
export function getInventoryInwardReport(params, success, error) {
  axios.get(backendURL + "reports/inventoryinward?" + params, success, error)
    .then(res => {
      if (res.status === 200) { success(res.data); }
      else { error(res.status); }
    });
}


