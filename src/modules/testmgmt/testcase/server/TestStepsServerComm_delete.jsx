import axios from "axios";
import cookie from 'react-cookies';
import { backendURL } from "variables/appVariables.jsx";

export function createTestSteps(testSteps, success, error) {
    axios.post(backendURL + "test-mgmt/test-steps", testSteps, { 'headers': { 'Authorization': 'Bearer ' + cookie.load('token') } })
        .then(res => {
            console.log(res.data, res.status);
            if (res.status === 201) { success(res.data); }
            else { error(res.status); }
        });
}

export function getTestStepsList(params, success, error) {
    axios.get(backendURL + "test-mgmt/test-steps", { 'headers': { 'Authorization': 'Bearer ' + cookie.load('token') } })
        .then(res => {
            console.log(res.data, res.status);
            if (res.status === 200) { success(res.data); }
            else { error(res.status); }
        });
}
export function getTestCaseList(params, success, error) {
    axios.get(backendURL + "test-mgmt/test-cases", { 'headers': { 'Authorization': 'Bearer ' + cookie.load('token') } })
        .then(res => {
            console.log(res.data, res.status);
            if (res.status === 200) { success(res.data); }
            else { error(res.status); }
        });
}
export function getCaseSingle(id, success, error) {
    axios.get(backendURL + "test-mgmt/test-steps/" + id, { 'headers': { 'Authorization': 'Bearer ' + cookie.load('token') } })
        .then(res => {
            console.log(res.data, res.status);
            if (res.status === 200) { success(res.data); }
            else { error(res.status); }
        });
}

export function updateTestSteps(testSteps, success, error) {

    axios.put(backendURL + "test-mgmt/test-steps/" + testSteps.code, testSteps, { 'headers': { 'Authorization': 'Bearer ' + cookie.load('token') } })
        .then(res => {
            console.log(res.data, res.status);
            if (res.status === 200) { success(res.data); }
            else { error(res.status); }
        });
}

export function deleteTestStep(id, success, error) {
    axios.delete(backendURL + "test-mgmt/test-steps/" + id, { 'headers': { 'Authorization': 'Bearer ' + cookie.load('token') } })
        .then(res => {
            if (res.status === 204) { success(res.data); }
            else { error(res.status); }
        });
}