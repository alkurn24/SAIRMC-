import {  updateModule, getModuleSingle } from "js/server.js";
export function updateDispatch(code, success, error) {
  updateModule("sales/dispatches", code, success, error);
}

  export function getDispatchSingle (id, success, error) {
    getModuleSingle("sales/dispatches", id, success, error);
  }