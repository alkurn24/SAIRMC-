import axios from "axios";
import { backendURL } from "variables/appVariables.jsx";

export function createQuotation (quotation, success, error) {
  axios.post(backendURL + "sales/quotation", quotation)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function getQuotationList (params, success, error) {
  axios.get(backendURL + "sales/quotation?" + params)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function getQuotationSingle (id, success, error) {
  axios.get(backendURL + "sales/quotation/" + id)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function updateQuotation (quotation, success, error) {
  axios.put(backendURL + "sales/quotation/" + quotation.code, quotation)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function deleteQuotation (id, success, error) {
  axios.delete(backendURL + "sales/quotation/" + id)
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}

export function generateQuotationDoc (id, success, error) {
  axios.post(backendURL + "sales/quotation/doc/" + id, null )
    .then(res => {
      if (res.status === 200) { success(res.data); } 
      else { error(res.status); }
    });
}