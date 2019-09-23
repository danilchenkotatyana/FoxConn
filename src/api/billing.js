import api from './api-request';

export function loadBilling (callback) {
    api.get('/billing', callback);
}

export function changeBilling (info, callback) {
    api.post('/billing', info, callback);
}

export function deleteBilling (callback) {
    api.delete('/billing', callback);
}