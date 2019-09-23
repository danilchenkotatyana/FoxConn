import Middleware from "../model/middleware";
import MainConfig from '../config';

let RecordingsAPI = (function () {

    let updateRecordingsList = function(alias) {
        console.debug('Try to find recordings for room: ', alias);
        let url = MainConfig.steal_path + `/api/aws/${alias}`;
        return new Promise(function (resolve, reject) {
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'x-access-token': Middleware.getToken()
                }
            }).then(response => response.json()).then(function (response) {
                if (response.error) {
                    reject(response);
                } else {
                    resolve(response);
                }
            }).catch(function(err) {
                reject(err);
            });
        });
    };

    let deleteRecords = function (alias, keys) {
        console.debug('Try to delete recordings for keys: ', keys);
        let url = MainConfig.steal_path + `/api/aws/delete`;
        return new Promise(function (resolve, reject) {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'x-access-token': Middleware.getToken()
                },
                body: JSON.stringify({alias: alias, keys: keys})
            }).then(response => response.json()).then(function (response) {
                if (response.error) {
                    reject(response);
                } else {
                    resolve();
                }
            }).catch(function(err) {
                reject(err);
            });
        });
    };

    return {
        getRecordingsList: updateRecordingsList,
        deleteRecords: deleteRecords
    };
})();


export default RecordingsAPI;
