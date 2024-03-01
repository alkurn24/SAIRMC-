import axios from "axios";
import { backendURL } from "variables/appVariables.jsx";

export function createApplication (object, success, error) {
  axios.post(backendURL + "settings/application", object)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function getApplicationList (params, success, error) {
  axios.get(backendURL + "settings/application")
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function getApplicationSingle (id, success, error) {
  axios.get(backendURL + "settings/application/" + id)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function updateApplication (object, success, error) {
  axios.put(backendURL + "settings/application/" + object.code, object)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function deleteApplication (id, success, error) {
  axios.delete(backendURL + "module/" + id)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}