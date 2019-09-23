import React, {Component} from 'react';
import ServerAPI from '../../../api/server';
import Event from '../../../model/event-names';
import EventBus from '../../../model/events-bus';
import {formatDuration} from '../../../model/utils';

class ParticipantItem extends Component {

    constructor(props) {
        super(props);

        let { participant } = this.props;

        this.state = {
            participant: participant,
            duration: participant.Duration ? Number.parseInt(participant.Duration, 10) : 0,
            muted: participant.IsMuted === 'true',
            broadcast: participant.IsBroadcaster === 'true'
        };

        this.onParticipantChanged = function (payload) {
            let { participant } = this.state;
            let p = payload.participant;
            if (participant.Id === p.Id) {
                this.setState({
                    participant: p,
                    muted: p.IsMuted === 'true',
                    broadcast: p.IsBroadcaster === 'true'
                })
            }
        }.bind(this);

        this.onUpdateDuration = function () {
            let { participant } = this.state;
            this.setState({
                duration: participant.DialerDuration
            })
        }.bind(this);
    }

    componentDidMount() {
        EventBus.on(Event.PARTICIPANT_CHANGED, this.onParticipantChanged);
        EventBus.on(Event.UPDATE_DURATION, this.onUpdateDuration);
    }

    componentWillUnmount() {
        EventBus.off(Event.PARTICIPANT_CHANGED, this.onParticipantChanged);
        EventBus.off(Event.UPDATE_DURATION, this.onUpdateDuration);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({ participant: nextProps.participant });
    }

    render() {
        let { participant, muted, broadcast, duration } = this.state;

        let relatedContact = undefined;
        let displayName = relatedContact ? relatedContact.getDisplayName() : participant.DisplayName;

        return (
            <div className="participant-item">
                <div className="participant-item__text" >
                    {/*<div className="participant-item____container">
                            <img className="participant-item__photo" src={picImage} alt="" onError={(e)=>{e.target.style.display='none'}}/>
                        </div>*/}
                    <div className="participant-item__name">{displayName}</div>
                    <div className="participant-item__time">{formatDuration(duration)}</div>
                </div>
                <div className="icons-container">
                    {broadcast ? (<div className="broadcast-button call-icon" />) : null}
                    <div className={"volume-button call-icon" + (broadcast ? " active" : "")} onClick={this.broadcast.bind(this)} />
                    <div className={"microphone-button call-icon" + (muted ? " active" : "")} onClick={this.mute.bind(this)} />
                    <div className="end-call-button call-icon" onClick={this.hangup.bind(this)} />
                </div>
            </div>
        );
    }

    broadcast() {
        let { participant, broadcast } = this.state;
        ServerAPI.broadcast(participant.Id, !broadcast);
    }

    mute() {
        let { participant, muted, broadcast } = this.state;
        if (!broadcast) ServerAPI.mute(participant.Id, !muted);
    }

    hangup() {
        let { participant } = this.state;
        ServerAPI.hangup(participant.Id);
    }

    getDuration(startTime) {
        if (!startTime)
            return 0;
        let _start = typeof startTime === 'string' ? new Date(startTime) : startTime;
        return new Date().getTime() - _start.getTime().toLocal;
    }
}

export default ParticipantItem;
