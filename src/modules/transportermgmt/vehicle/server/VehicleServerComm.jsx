import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function createVehicle (vehicle, success, error) {
  createModule("transport/management", vehicle, success, error);
}

export function getVehicleList (params, success, error) {
  getModuleList("transport/management", params, success, error);
}

export function getVehicleSingle (id, success, error) {
  getModuleSingle("transport/management", id, success, error);
}

export function updateVehicle (vehicle, success, error) {
  updateModule("transport/management", vehicle, success, error);
}

export function deleteVehicle (id, success, error) {
  deleteModule("transport/management", id, success, error);
}