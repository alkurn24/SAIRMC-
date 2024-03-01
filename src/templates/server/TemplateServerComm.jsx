import axios from "axios";
import { backendURL } from "variables/appVariables.jsx";

export function createModule (customer, success, error) {
  axios.post(backendURL + "module", customer)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function getModuleList (params, success, error) {
  axios.get(backendURL + "module")
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function getModuleSingle (id, success, error) {
  axios.get(backendURL + "module/" + id)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function updateModule (customer, success, error) {
  axios.put(backendURL + "module/" + customer._id, customer)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function deleteModule (id, success, error) {
  axios.delete(backendURL + "module/" + id)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}