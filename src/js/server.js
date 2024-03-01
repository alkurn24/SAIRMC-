import axios from "axios";
import cookie from 'react-cookies';
import CryptoJS from 'crypto-js'

import {
  backendURL,
  encdec
} from "variables/appVariables.jsx";

export function createModule(moduleName, data, success, error) {
  var encData = CryptoJS.AES.encrypt(JSON.stringify(data), encdec);
  axios.post(backendURL + moduleName, {
      data: encData.toString()
    }, {
      'headers': {
        'Authorization': 'Bearer ' + cookie.load('token')
      }
    })
    .then(res => {
      if (res.status === 201) {
        var bytes = CryptoJS.AES.decrypt(res.data.toString(), encdec);
        res.data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        success(res.data);
      } else {
        error(res.status);
      }
    }).catch(error);
}

export function getModuleList(moduleName, params, success, error) {
  axios.get(backendURL + moduleName + "?" + params, {
      'headers': {
        'Authorization': 'Bearer ' + cookie.load('token')
      }
    })
    .then(res => {
      if (res.status === 200) {
        var bytes = CryptoJS.AES.decrypt(res.data.toString(), encdec);
        res.data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        success(res.data);
      } else {
        error(res.status);
      }
    }).catch(error);
}

export function getModuleSingle(moduleName, id, success, error) {
  axios.get(backendURL + moduleName + "/" + id, {
      'headers': {
        'Authorization': 'Bearer ' + cookie.load('token')
      }
    })
    .then(res => {
      if (res.status === 200) {
        var bytes = CryptoJS.AES.decrypt(res.data.toString(), encdec);
        res.data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        success(res.data);
      } else {
        error(res.status);
      }
    }).catch(error);
}

export function updateModule(moduleName, data, success, error) {
  var encData = CryptoJS.AES.encrypt(JSON.stringify(data), encdec);
  axios.put(backendURL + moduleName + "/" + data.code, {
      data: encData.toString()
    }, {
      'headers': {
        'Authorization': 'Bearer ' + cookie.load('token')
      }
    })
    .then(res => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.status);
      }
    }).catch(error);
}

export function deleteModule(moduleName, id, success, error) {
  axios.delete(backendURL + moduleName + "/" + id, {
      'headers': {
        'Authorization': 'Bearer ' + cookie.load('token')
      }
    })
    .then(res => {
      if (res.status === 204) {
        success(res.data);
      } else {
        error(res.status);
      }
    }).catch(error);
}

export function downloadFile(moduleName, id, params, success, error) {
  axios.get(backendURL + moduleName + id, {
      'headers': {
        'Authorization': 'Bearer ' + cookie.load('token')
      },
      'responseType': 'blob'
    })
    .then(res => {
      if (res.status === 200) {
        success(res);
      } else {
        error(res.status);
      }
    }).catch(error);
}
export function customGet(moduleName, encrypt, success, error) {
  axios.get(backendURL + moduleName, {
      'headers': {
        'Authorization': 'Bearer ' + cookie.load('token')
      }
    })
    .then(res => {
      if (res.status === 200) {
        if (encrypt) {
          var bytes = CryptoJS.AES.decrypt(res.data.toString(), encdec);
          res.data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          success(res.data);
        } else {
          success(res.data);
        }
      } else {
        error(res.status);
      }
    }).catch(error);
}

export function customUpdate(moduleName, data, success, error) {
  var encData = CryptoJS.AES.encrypt(JSON.stringify(data), encdec);
  axios.put(backendURL + moduleName, {
      data: encData.toString()
    }, {
      'headers': {
        'Authorization': 'Bearer ' + cookie.load('token')
      }
    })
    .then(res => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.status);
      }
    }).catch(error);
}