import React, {Component} from 'react';
import '../../css/main.scss';
import Participants from './meeting/Participants';
import MeetingControlBar from './meeting/MeetingControlBar';
import MeetingInfoBar from './meeting/MeetingInfoBar';
import RoomSettings from './RoomSettings';
import RoomInfo from './RoomInfo';
import Event from '../../model/event-names';
import EventBus from '../../model/events-bus';
import MCUPayload from '../../model/mcu-payload';
import {formatDuration} from '../../model/utils';
import RoomsAPI from '../../api/rooms';
import ServerAPI from "../../api/server";
import i18n from '../../localization/i18n';

import ModalChangePin from './../modals/ModalChangePin';
import ModalInvite, {INVITE_TYPE} from './../modals/ModalInvite';
import {showPopup} from "../modals/PopupNotification";

class Room extends Component {

    constructor(props) {
        super(props);

        this.state = {
            active: false,
            locked: false,
            muted: false,
            participants: [],
            recordingState: MCUPayload.RecordingState.NOT_RECORDING,
            duration: '',
            startTime: '10:33 AM',
            changePinModalType: undefined,
            modalInviteVisible: false,
            modalInviteEmailVisible: false,
            connected: false,
            languages: []
        };

        this.durationInterval = null;

        EventBus.on(Event.SESSION_EXPIRED, function () {
            clearInterval(this.durationInterval);
        }.bind(this));

        this.changeActiveState = function (options) {

            let value = Object.assign({
                active: options.active,
                locked: options.locked,
                muted: options.muted,
                recordingState: options.recordingState || MCUPayload.RecordingState.NOT_RECORDING,
                participants: getActiveParticipants(options.participants),
                duration: options.duration ? Number.parseInt(options.duration, 10) : 0,
                startTime: options.startTime
            }, options);

            let { userSentCall } = this.state;
            if (value.active && userSentCall) {
                value.userSentCall = false;
            }

            this.setState(value);
        }.bind(this);

        this.updateDuration = function () {
            let { duration, active, participants } = this.state;
            if (active && participants.length > 0) {
                participants.forEach(function (p) {
                    if (typeof p.DialerDuration === 'undefined') {
                        p.DialerDuration = Number.parseInt(p.Duration, 10);
                    } else {
                        p.DialerDuration += 1000;
                    }
                });
                this.setState({ duration: duration + 1000 });
                EventBus.trigger(Event.UPDATE_DURATION);
            }
        }.bind(this);

        this.onMcuConnectionLost = function (payload) {
            if (payload.alias !== this.props.room.alias)
                return;

            this.setState({ active: false, connected: false });
            clearInterval(this.durationInterval);

            return showPopup({
                message: i18n['Connection with MCU has lost'],
                okTitle: i18n['Close'],
                showCancelButton: false
            }).then(() => {
                this.props.toggleRoom(this.props.room.alias);
            }).catch(console.log);
        }.bind(this);

        this.onMcuInitialState = function (payload) {
            if (payload.alias !== this.props.room.alias)
                return;

            this.setState({connected: true});

            ServerAPI.requestLanguages();

            clearInterval(this.durationInterval);
            this.changeActiveState(payload);
            if (payload.active) {
                this.durationInterval = setInterval(this.updateDuration, 1000);
            }
        }.bind(this);

        this.onLanguages = function (payload) {
            if (payload.alias !== this.props.room.alias)
                return;

            let langList = payload.languages ? payload.languages.split('\n') : [];
            langList = langList.map(lang => {
                if (lang.indexOf(',"')>=0) {
                    let parts = lang.split(',"');
                    let quoteIndex = parts[1].indexOf('"');
                    return {
                        key   : parts[0].split(',')[1],
                        title : parts[1].substr(0, quoteIndex)
                    };
                } else {
                    let items = lang.split(',');
                    return {key: items[1], title: items[2]};
                }
            });

            this.setState({languages: langList});
        }.bind(this);

        this.onConferenceStarted = function (payload) {
            if (payload.alias !== this.props.room.alias)
                return;
            this.changeActiveState(payload);
            clearInterval(this.durationInterval);
            this.durationInterval = setInterval(this.updateDuration, 1000);
        }.bind(this);

        this.onConferenceFinished = function (payload) {
            if (payload.alias !== this.props.room.alias)
                return;
            this.changeActiveState(payload);
            clearInterval(this.durationInterval);
        }.bind(this);

        this.onConferenceChanged = function (payload) {
            if (payload.alias !== this.props.room.alias)
                return;
            this.changeActiveState(payload);
        }.bind(this);

    }

    componentWillUnmount() {
        EventBus.off(Event.MCU_CONNECTION_LOST, this.onMcuConnectionLost);
        EventBus.off(Event.MCU_INITIAL_STATE, this.onMcuInitialState);
        EventBus.off(Event.CONFERENCE_STARTED, this.onConferenceStarted);
        EventBus.off(Event.CONFERENCE_FINISHED, this.onConferenceFinished);
        EventBus.off(Event.CONFERENCE_CHANGED, this.onConferenceChanged);
        EventBus.off(Event.LANGUAGES, this.onLanguages);
        clearInterval(this.durationInterval);
    }

    componentDidMount() {
        EventBus.on(Event.MCU_CONNECTION_LOST, this.onMcuConnectionLost);
        EventBus.on(Event.MCU_INITIAL_STATE, this.onMcuInitialState);
        EventBus.on(Event.CONFERENCE_STARTED, this.onConferenceStarted);
        EventBus.on(Event.CONFERENCE_FINISHED, this.onConferenceFinished);
        EventBus.on(Event.CONFERENCE_CHANGED, this.onConferenceChanged);
        EventBus.on(Event.LANGUAGES, this.onLanguages);
        clearInterval(this.durationInterval);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.expanded && !this.props.expanded) {
            console.debug('unmount room');
            this.changeActiveState({connected: false, active: false});
        } else if (!prevProps.expanded && this.props.expanded) {
            console.debug('mount room');
        }

    }

    render() {
        let {
            room, expanded, toggleRoom, hidden
        } = this.props;
        let {
            connected, active, locked, muted,
            duration, recordingState,participants, startTime,
            languages,
            changePinModalType, modalInviteVisible, modalInviteEmailVisible
        } = this.state;

        let meetingDuration = '';
        if (active && duration) {
            meetingDuration = formatDuration(duration);
        }

        return (
                <div className={"room-container" + (expanded ? "" : " expanded") + (hidden ? ' hide' : '')}>
                    <div ref={'scroll_anchor'}/>
                    <RoomInfo room={room} expanded={expanded}
                              toggleRoom={() => toggleRoom(room.alias)}
                              refreshRoom={() => this.refreshRoom()}
                    />

                    {expanded ?
                        <div>
                            {connected ?
                                <div>
                                    {isActiveRecording(recordingState) ?
                                        <ActiveRecording alias={room.alias} state={recordingState}/> :
                                        null
                                    }

                                    <RoomSettings connected={connected} room={room}
                                                  languages={languages}
                                                  updatePin={(type) => this.showUpdatePinModal(type)}/>
                                </div> : <div className="connecting">{i18n['Connecting...']}</div>
                            }


                            {active ?
                                <MeetingControlBar alias={room.alias} locked={locked} muted={muted} recordingState={recordingState}/>
                                : null
                            }
                            {connected ?
                                <MeetingInfoBar startTime={startTime} duration={meetingDuration}
                                                onShowInviteSipList={() => this.showInviteSipList()}
                                                onShowInviteEmailList={() => this.showInviteEmailList()}/>
                                : null
                            }
                            {active ?
                                <Participants alias={room.alias} participants={participants}/>
                                : null
                            }
                        </div> :
                        null
                    }

                    {changePinModalType ?
                        <ModalChangePin type={changePinModalType}
                                        onOk={() => this.setState({changePinModalType: undefined})}
                                        onCancel={() => this.setState({changePinModalType: undefined})}
                        /> : null
                    }

                    {modalInviteVisible ?
                        <ModalInvite type={INVITE_TYPE.sip}
                                     onOk={() => this.setState({modalInviteVisible: false})}
                                     onCancel={() => this.setState({modalInviteVisible: false})}
                        /> : null
                    }

                    {modalInviteEmailVisible ?
                        <ModalInvite type={INVITE_TYPE.email}
                                     onOk={() => this.setState({modalInviteEmailVisible: false})}
                                     onCancel={() => this.setState({modalInviteEmailVisible: false})}
                        /> : null
                    }


                    {/* <ModalException />  */}
                </div>
        );
    }


    showUpdatePinModal (type) {
        this.setState({changePinModalType: type});
    }

    showInviteSipList () {
        this.setState({modalInviteVisible: true});
    }

    showInviteEmailList () {
        this.setState({modalInviteEmailVisible: true});
    }

    refreshRoom () {
        this.changeActiveState({connected: false});

        let {room, updateRoomsList} = this.props;
        RoomsAPI.requestRoom(room.alias)
            .then(function (room) {
                updateRoomsList();
                let {expanded} = this.props;
                if (expanded) {
                    ServerAPI.disconnectRoom(room.alias);
                    ServerAPI.connectRoom(room.alias);
                }
            }.bind(this))
            .catch((err) => {
                console.error(err);
            });
    }
}

const ActiveRecording = (props) => {
    let {state, alias} = props;
    return (
        <div className="records-list__recording">
            <div className="records-list__record"/>
            <div className="records-list__info">
                <div className="records-list__name">{i18n['Recording']} {alias}</div>
            </div>
            {state === MCUPayload.RecordingState.PAUSED ?
                <div className="records-list__resume" onClick={() => ServerAPI.resumeRec()}>{i18n['Resume']}</div> :
                <div className="records-list__pause" onClick={() => ServerAPI.pauseRec()}>{i18n['Pause']}</div>
            }
            <div className="records-list__stop" onClick={() => ServerAPI.stopRec()}>{i18n['Stop']}</div>
        </div>
    );
};

function isActiveRecording(state) {
    return state === MCUPayload.RecordingState.PAUSED || state === MCUPayload.RecordingState.RECORDING;
}

function getActiveParticipants (participants) {
    if (!participants)
        return [];

    return participants.filter(p => p.IsAuthorized === 'true' && (p.Status === 'Active' || p.Status === 'Muted' || p.Status === 'Connecting'));
}

export default Room;
