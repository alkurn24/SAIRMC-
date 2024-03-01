import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getPlantList(params, success, error) {
  getModuleList("settings/plants", params, success, error);
}

export function getPlantSingle (id, success, error) {
  getModuleSingle("settings/plants", id, success, error);
}

export function createPlant(obj, success, error) {
  createModule("settings/plants", obj, success, error);
}

export function updatePlant(obj, success, error) {
  updateModule("settings/plants", obj, success, error);
}

export function deletePlant(id, success, error) {
  deleteModule("settings/plants", id, success, error);
}