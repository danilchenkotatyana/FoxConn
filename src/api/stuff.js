import LoggerFactory from '../logger';
import RequestAPI from './api-request';

let logger = LoggerFactory.create('RestAPI');

export default {
    requestPackages: async function (countryCode, payType, callback) {
        logger.debug(`'Request ${payType} packages for country ${countryCode}...`);
        RequestAPI.get('/packages/'+countryCode+'/'+payType, callback);
    },

    requestPaidPackages: async function (countryCode, callback) {
        logger.debug(`Request paid packages for country ${countryCode}...`);
        RequestAPI.get('/packages/'+countryCode+'/paid', callback);
    },

    requestCountries: async function (callback) {
        logger.debug('Request countries...');
        RequestAPI.get('/countries', callback);
    },

    requestStates: async function (countryCode, callback) {
        logger.debug(`Request country ${countryCode} states...`);
        RequestAPI.get(`/countries/${countryCode}/states`, callback);
    }
};