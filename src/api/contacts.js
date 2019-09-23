import Middleware from "../model/middleware";
import MainConfig from '../config';

let ContactsAPI = (function () {

    let loadContactsList = function() {
        console.debug('Updating contacts...');
        let url = MainConfig.steal_path + '/api/contacts';
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

    let save = function (contact) {
        console.debug('Try to save contact ', contact);
        let url = MainConfig.steal_path + '/api/contacts';
        return new Promise(function (resolve, reject) {
            fetch(url, {
                method: contact.id ? 'POST' : 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'x-access-token': Middleware.getToken()
                },
                body: JSON.stringify(contact)
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

    let remove = function (_contacts) {
        console.debug('Try to delete contacts ', _contacts);

        let contacts = Array.isArray(_contacts) ? _contacts : [_contacts];
        let url = MainConfig.steal_path + '/api/contacts';

        return new Promise(function (resolve, reject) {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'x-access-token': Middleware.getToken()
                },
                body: JSON.stringify(contacts.map(c => c.id))
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

    return {
        loadContactsList: loadContactsList,
        save: save,
        remove: remove
    };
})();


export default ContactsAPI;
