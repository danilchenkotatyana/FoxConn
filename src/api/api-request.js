import Middleware from "../model/middleware";
import MainConfig from "../config";

function get(url, callback) {
    return new Promise(async function (resolve, reject) {
        let res = await fetch(MainConfig.steal_path + '/api' + url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'x-access-token': Middleware.getToken()
            }
        });

        if (res.status >= 200 && res.status <= 299) {
            let json = res.json();

            if (json.error) {
                return reject(json);
            } else {
                return resolve(json);
            }
        }

        reject('' + res.status + ' ' + res.statusText);
    }).then(r => {
        if (typeof callback === 'function') {
            callback(undefined, r)
        }
    }).catch(r => {
        if (typeof callback === 'function') {
            callback(r, undefined)
        }
    });
}

function put(url, payload, callback) {
    return new Promise(async function (resolve, reject) {
        let response = await fetch(MainConfig.steal_path + '/api' + url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'x-access-token': Middleware.getToken()
            },
            body: JSON.stringify(payload)
        });

        let json = {error: ''};
        try {
            json = await response.json();
        } catch (e) {}

        if (response.status === 201) {
            if (json.error) {
                reject(json);
            } else {
                resolve(json);
            }
        } else {
            reject(json);
        }

    }).then(r => {
        if (typeof callback === 'function') {
            callback(undefined, r)
        }
    }).catch(r => {
        if (typeof callback === 'function') {
            callback(r, undefined)
        }
    });
}

function post(url, payload, callback) {
    return action('POST', [200, 201], url, payload, callback);
}

function action(method, acceptCodes, url, payload, callback) {
    return new Promise(async function (resolve, reject) {
        let response = await fetch(MainConfig.steal_path + '/api' + url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'x-access-token': Middleware.getToken()
            },
            body: JSON.stringify(payload)
        });

        let json = {error: ''};
        try {
            json = await response.json();
        } catch (e) {
            console.error(e);
        }

        if ((acceptCodes && acceptCodes.indexOf(response.status)>=0) || response.status === 200) {
            if (json.error || json.errors) {
                reject(json);
            } else {
                resolve(json);
            }
        } else {
            if (json.error || json.errors || json.message) {
                reject(json);
            } else {
                reject({code: response.status, error: json.error || response.statusText});
            }
        }

    }).then(r => {
        if (typeof callback === 'function') {
            callback(undefined, r)
        }
    }).catch(r => {
        if (typeof callback === 'function') {
            callback(r, undefined)
        }
    });
}

function _delete(url, callback) {
    return new Promise(async function (resolve, reject) {
        let response = await fetch(MainConfig.steal_path + '/api' + url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'x-access-token': Middleware.getToken()
            }
        });

        if (response.status === 204)
            return resolve();

        let json = response.json();
        reject(json);
    }).then(r => {
        if (typeof callback === 'function') {
            callback(undefined, r)
        }
    }).catch(r => {
        if (typeof callback === 'function') {
            callback(r, undefined)
        }
    });
}

export default {
    get: get,
    put: put,
    post: post,
    delete: _delete,
}