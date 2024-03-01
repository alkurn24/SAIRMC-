
import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "js/server.js";

export function getServiceList(params, success, error) {
  getModuleList("inventory/services", params, success, error);
 }
export function getServiceSingle (id, success, error) {
  getModuleSingle("inventory/services", id, success, error);
 }

export function createService(assetsDetails, success, error) {
 createModule("inventory/services", assetsDetails, success, error);
 }

export function updateService(assetsDetails, success, error) {
  updateModule("inventory/services", assetsDetails, success, error);
 }

export function deleteService(id, success, error) {
  deleteModule("inventory/services", id, success, error);
}

