import React, {Component} from 'react';
import ServerAPI from "../../../api/server";
import EventBus from "../../../model/events-bus";
import Event from "../../../model/event-names";
import McuPayload from '../../../model/mcu-payload';
import i18n from '../../../localization/i18n';

class MeetingControlBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            locked: props.locked,
            muted: props.muted,
            recordingState: props.recordingState,
        };

        this.onConferenceChanged = function (payload) {
            this.setState({
                muted: payload.muted,
                locked: payload.locked,
                recordingState: payload.recordingState
            });
        }.bind(this);

        this.onConferenceMuteChanged = function (muted) {
            this.setState({ muted: muted });
        }.bind(this);

        this.onConferenceLockChanged = function (locked) {
            this.setState({ locked: locked });
        }.bind(this);

        this.onConferenceRecordingChanged = function (payload) {
            this.setState({ recordingState: payload.recordingState });
        }.bind(this);
    }

    componentDidMount() {
        EventBus.on(Event.CONFERENCE_CHANGED, this.onConferenceChanged);
        EventBus.on(Event.AFTER_CONFERENCE_MUTE_CHANGED, this.onConferenceMuteChanged);
        EventBus.on(Event.AFTER_CONFERENCE_LOCK_CHANGED, this.onConferenceLockChanged);
        EventBus.on(Event.RECORDING_STATE_CHANGED, this.onConferenceRecordingChanged);
    }

    componentWillUnmount() {
        EventBus.off(Event.CONFERENCE_CHANGED, this.onConferenceChanged);
        EventBus.off(Event.AFTER_CONFERENCE_MUTE_CHANGED, this.onConferenceMuteChanged);
        EventBus.off(Event.AFTER_CONFERENCE_LOCK_CHANGED, this.onConferenceLockChanged);
        EventBus.off(Event.RECORDING_STATE_CHANGED, this.onConferenceRecordingChanged);
    }

    render() {
        let {
            locked,
            muted,
            recordingState
        } = this.state;
        let recordingActive = recordingState === McuPayload.RecordingState.RECORDING;
        let recordingDisabled = recordingState === McuPayload.RecordingState.DISABLED;

        return (
            <section className="meeting-control-bar">
                <div className={"change-layout-container " + (this.state.showLayout ? 'active' : '')}>
                    <div className="icon-close" onClick={() => this.setState({ showLayout: !this.state.showLayout })}/>
                    <div className="change-layout-title">{i18n['Choose Layout']}
                    </div>
                    <div className="icon-layout icon-layout-auto" layout="10" onClick={this.changeLayout.bind(this)}/>
                    <div className="icon-layout icon-layout-1" layout="10" onClick={this.changeLayout.bind(this)}/>
                    <div className="icon-layout icon-layout-2" layout="21" onClick={this.changeLayout.bind(this)}/>
                    <div className="icon-layout icon-layout-21" layout="20" onClick={this.changeLayout.bind(this)}/>
                    <div className="icon-layout icon-layout-12" layout="22" onClick={this.changeLayout.bind(this)}/>
                    <div className="icon-layout icon-layout-3" layout="31" onClick={this.changeLayout.bind(this)}/>
                    <div className="icon-layout icon-layout-31" layout="30" onClick={this.changeLayout.bind(this)}/>
                    <div className="icon-layout icon-layout-22" layout="35" onClick={this.changeLayout.bind(this)}/>
                    <div className="icon-layout icon-layout-4" layout="40" onClick={this.changeLayout.bind(this)}/>
                    <div className="icon-layout icon-layout-41" layout="41" onClick={this.changeLayout.bind(this)}/>
                    <div className="icon-layout icon-layout-6" layout="60" onClick={this.changeLayout.bind(this)}/>
                    <div className="icon-layout icon-layout-9" layout="90" onClick={this.changeLayout.bind(this)}/>
                </div>
                <ul className="nav navbar-nav">
                    <li className="layout-li">
                        <span className={"room-icon-layout" + (this.state.showLayout ? ' active' : '')}
                            onClick={() => this.setState({ showLayout: !this.state.showLayout })}>
                            {this.state.showLayout ? i18n["Change Layout"] : i18n["Change Layout"]}
                        </span>
                    </li>
                    <li>
                        <span className={"room-icon-speaker" + (muted ? '-active' : '')}
                            onClick={() => { muted ? ServerAPI.unmuteAll() : ServerAPI.muteAll(); }}>
                            {muted ? i18n["Unmute All"] : i18n["Mute All"]}
                        </span>
                    </li>
                    <li>
                        <span className={"room-icon-lock" + (locked ? '-active' : '')}
                            onClick={() => { locked ? ServerAPI.unlock() : ServerAPI.lock(); }}>
                            {locked ? i18n["Unlock Room"] : i18n["Lock Room"]}
                        </span>
                    </li>
                    <li>
                        <span className={"room-icon-record" + (recordingActive ? '-active' : '') + (recordingDisabled ? ' disabled' : '')}
                            onClick={() => { recordingActive ? ServerAPI.stopRec() : ServerAPI.startRec(); }}>
                            {recordingActive ? i18n["Stop Record"] : i18n["Start Record"]}
                        </span>
                    </li>
                    <li>
                        <span className="room-icon-close"
                            onClick={() => { ServerAPI.endCall(); }}>{i18n['End Call']}</span>
                    </li>
                </ul>
            </section>
        );
    }
    changeLayout(e) {
        ServerAPI.configureLayout(e.target.getAttribute('layout'));
        this.setState({ showLayout: false });
    }

    contactSelected(contact, selected) {
        let { selectedContacts } = this.state;

        if (contact) {
            if (selected) {
                if (!selectedContacts.find(c => c.getId() === contact.getId())) {
                    selectedContacts.push(contact);
                }
            } else {
                let index = selectedContacts.findIndex(c => c.getId() === contact.getId());
                if (index >= 0) {
                    selectedContacts.splice(index, 1);
                }
            }
            this.setState({ selectedContacts: selectedContacts });
        }

    }

    startMeeting() {
        let { selectedContacts } = this.state;

        let numbersToCall = [];
        selectedContacts.forEach((contact) => {

            let defaultNumbers = contact.getDefaultNumbers();
            if (defaultNumbers) {
                defaultNumbers.forEach((number) => {
                    if (number.value) {
                        numbersToCall.push(number.value);
                    }
                })
            }

        });

        if (numbersToCall.length > 0) {
            ServerAPI.startCall(numbersToCall);
            this.setState({ selectedContacts: [] });
            EventBus.trigger(Event.CONTACTS_UNSELECT_ALL);
        }

        EventBus.trigger(Event.USER_SENT_CALL);
    }

}

export default MeetingControlBar;
