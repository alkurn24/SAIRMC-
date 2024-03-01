import axios from "axios";
import { backendURL } from "variables/appVariables.jsx";

export function getDashboardData(params, success, error) {
  axios.get(backendURL + "dashboard")
    .then(res => {
      if (res.status === 200) { success(res.data); }
      else { error(res.status); }
    });
}

export function getHeaderData(params, success, error) {
  axios.get(backendURL + "dashboard/header")
    .then(res => {
      if (res.status === 200) { success(res.data); }
      else { error(res.status); }
    });
}
export function getNotificationData(params, success, error) {
  axios.get(backendURL + "dashboard/notifications")
    .then(res => {
      if (res.status === 200) { success(res.data); }
      else { error(res.status); }
    });
}