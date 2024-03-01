
import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getAssetList(params, success, error) {
  getModuleList("inventory/assets", params, success, error);
}
export function getAssetSingle(id, success, error) {
  getModuleSingle("inventory/assets", id, success, error);
}

export function createAsset(assetsDetails, success, error) {
  createModule("inventory/assets", assetsDetails, success, error);
}

export function updateAsset(assetsDetails, success, error) {
  updateModule("inventory/assets", assetsDetails, success, error);
}

export function deleteAsset(id, success, error) {
  deleteModule("inventory/assets", id, success, error);
}

