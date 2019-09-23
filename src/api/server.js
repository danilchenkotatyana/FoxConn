import WsClient from '../model/ws-client'
import ApiEvents from '../model/api-event-names';
import Events from '../model/event-names';

let ServerAPI = (function () {

    let startCall = function (numbers) {
        console.debug('Calling to ',numbers);
        WsClient.pushEvent(ApiEvents.MAKE_CALL, {numbers: Array.isArray(numbers) ? numbers : [numbers]});
    };

    let endCall = function () {
        console.debug('Request call to be finished');
        WsClient.pushEvent(ApiEvents.END_CALL);
    };

    let muteAll = function () {
        console.debug('Requested muted all operation');
        WsClient.pushEvent(ApiEvents.MUTE_ALL);
    };

    let unmuteAll = function () {
        console.debug('Requested unmuted all operation');
        WsClient.pushEvent(ApiEvents.UNMUTE_ALL);
    };

    let lock = function () {
        console.debug('Requested lock operation');
        WsClient.pushEvent(ApiEvents.LOCK_ROOM);
    };

    let unlock = function () {
        console.debug('Requested unlock operation');
        WsClient.pushEvent(ApiEvents.UNLOCK_ROOM);
    };

    let startRec = function () {
        console.debug('Requested start recording');
        WsClient.pushEvent(ApiEvents.START_RECORDING);
    };

    let stopRec = function () {
        console.debug('Requested stop recording');
        WsClient.pushEvent(ApiEvents.STOP_RECORDING);
    };

    let pauseRec = function () {
        console.debug('Requested pause recording');
        WsClient.pushEvent(ApiEvents.PAUSE_RECORDING);
    };

    let resumeRec = function () {
        console.debug('Requested resume recording');
        WsClient.pushEvent(ApiEvents.RESUME_RECORDING);
    };
    let mute = function (pid, value) {

        console.debug('Requested ' + (value ? 'mute' : 'unmute') + ' for participant '+pid);
        WsClient.pushEvent(value ? ApiEvents.MUTE : ApiEvents.UNMUTE, {id: pid});
    };

    let broadcast = function (pid, value) {
        console.debug('Requested ' + (value ? 'broadcast "on"' : 'broadcast "off"') + ' for participant '+pid);
        WsClient.pushEvent(value ? ApiEvents.BROADCAST_ON : ApiEvents.BROADCAST_OFF, {id: pid});
    };

    let hangup = function (pid) {
        console.debug('Requested hangup for participant '+pid);
        WsClient.pushEvent(ApiEvents.HANGUP, {id: pid});
    };

    let configureLayout = function (layoutCode) {
        console.debug('Configure layout ', layoutCode);
        WsClient.pushEvent(ApiEvents.CONFIGURE_LAYOUT, {layoutCode: layoutCode});
    };

    let connectRoom = function (alias) {
        console.debug('Connecting to room ', alias);
        WsClient.pushEvent(Events.CONNECT_ROOM, {alias: alias});
    };

    let disconnectRoom = function (alias) {
        console.debug('Disconnecting from room ', alias);
        WsClient.pushEvent(Events.DISCONNECT_ROOM, {alias: alias});
    };

    let changePin = function (type, pin) {
        console.debug('Change ', type, ' pin to ', pin);
        WsClient.pushEvent(Events.CHANGE_PIN, {type: type, pin: pin});
    };

    let changeSTTLanguage = function (languageValue) {
        console.debug('Change STT language to ', languageValue);
        WsClient.pushEvent(Events.CHANGE_STT, {language: languageValue});
    };

    let changeMediaProfile = function (mediaProfileName) {
        console.debug('Change media profile to ', mediaProfileName);
        WsClient.pushEvent(Events.CHANGE_MEDIA_PROFILE, {profile: mediaProfileName});
    };

    let requestLanguages = function () {
        console.debug('Request languages list...');
        WsClient.pushEvent(Events.REQUEST_LANGUAGES);
    };

    let inviteByEmail = function (emails) {
        console.debug('Invite by email ',emails);
        WsClient.pushEvent(ApiEvents.INVITE_BY_EMAIL, {emails: Array.isArray(emails) ? emails : [emails]});
    };

    return {
        startCall: startCall,
        endCall: endCall,
        muteAll: muteAll,
        unmuteAll: unmuteAll,
        mute: mute,
        broadcast: broadcast,
        hangup: hangup,
        lock: lock,
        unlock: unlock,
        startRec: startRec,
        stopRec: stopRec,
        pauseRec: pauseRec,
        resumeRec: resumeRec,
        configureLayout: configureLayout,
        connectRoom: connectRoom,
        disconnectRoom: disconnectRoom,
        changePin: changePin,
        changeSTTLanguage: changeSTTLanguage,
        changeMediaProfile: changeMediaProfile,
        requestLanguages: requestLanguages,
        inviteByEmail: inviteByEmail,
    };
})();


export default ServerAPI;
