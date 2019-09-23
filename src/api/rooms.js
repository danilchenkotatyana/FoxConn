import Middleware from "../model/middleware";
import MainConfig from '../config';

let RoomsAPI = (function () {

    let _rooms = [];

    let sortRooms = function () {
        _rooms.sort((a, b) => {
            return a.alias < b.alias ? -1 : (a.alias > b.alias ? 1 : 0);
        });
    };

    let refreshRoomsList = function() {
        console.debug('Try to refresh rooms list...');
        let url = MainConfig.steal_path + '/api/rooms';
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
                    _rooms = response;
                    sortRooms();
                    resolve(response);
                }
            }).catch(function(err) {
                reject(err);
            });
        });
    };

    let requestRoom = function(alias) {
        console.debug('Try to request room ', alias, '...');
        console.debug(_rooms);
        let url = MainConfig.steal_path + '/api/rooms/' + alias;
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
                    let index = _rooms.findIndex(room => room.alias === response.alias);
                    if (index >= 0) {
                        _rooms.splice(index, 1, response);
                        sortRooms();
                    }
                    resolve(response);
                }
            }).catch(function(err) {
                reject(err);
            });
        });
    };

    return {
        refreshRoomsList: refreshRoomsList,
        requestRoom: requestRoom,
        getRooms: function () {
            return _rooms;
        },
        destroy: function () {
            _rooms = [];
        }

    };
})();


export default RoomsAPI;
