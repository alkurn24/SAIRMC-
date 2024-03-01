import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getProductList(params, success, error) {
  getModuleList("inventory/products", params, success, error);
}

export function getProductSingle(id, success, error) {
  getModuleSingle("inventory/products", id, success, error);
}

export function createProduct(product, success, error) {
  createModule("inventory/products", product, success, error);
}

export function updateProduct(product, success, error) {
  updateModule("inventory/products", product, success, error);
}

export function deleteProduct(id, success, error) {
  deleteModule("inventory/products", id, success, error);
}