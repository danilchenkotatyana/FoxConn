import api from './api-request';

export function purchaseRoom ({packageId, period, callback, profileName}) {
    api.put('/purchase/room',
        {
            packageId   : packageId,
            period      : period,
            profileName : profileName
        }, callback);
}