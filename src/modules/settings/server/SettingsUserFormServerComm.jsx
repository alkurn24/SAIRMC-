import axios from "axios";
import { backendURL } from "variables/appVariables.jsx";

export function createUserForm (customer, success, error) {
  axios.post(backendURL + "settings/userforms", customer)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function getUserFormList (params, success, error) {
  axios.get(backendURL + "settings/userforms")
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function getUserFormSingle (id, success, error) {
  axios.get(backendURL + "settings/userforms/" + id)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function updateUserForm (customer, success, error) {
  axios.put(backendURL + "settings/userforms/" + customer.name, customer)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function deleteUserForm (id, success, error) {
  axios.delete(backendURL + "module/" + id)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}