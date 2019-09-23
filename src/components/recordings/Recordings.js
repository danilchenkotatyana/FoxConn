import React, {Component} from 'react';
import RecordItem from './RecordItem';
import RecordingsAPI from "../../api/recordings";
import MCUPayload from '../../model/mcu-payload';
import Video from "./Video";
import {showPopup} from "../modals/PopupNotification";
import i18n from '../../localization/i18n';
import ServerAPI from "../../api/server";

class Recordings extends Component {

    constructor (props) {
        super(props);

        let rplay = props.recordToPlay;
        this.state = {
            recordings: props.recordings,
            playerTitle: rplay ? rplay.Title : '',
            playerUrl: rplay ? rplay.Url : '',
            playerActive: !!rplay,
            emptyPlayer: false,
            visiblePlayer: false,
            visibleManage: false,
            selectedRecords: [],
            recordingState: MCUPayload.RecordingState.NOT_RECORDING
        };

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
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.state.emptyPlayer = false;
    }

    render() {
        let {
            recordings
        } = this.props;

        let { playerTitle, playerUrl, playerActive, emptyPlayer, visiblePlayer, visibleManage, selectedRecords,
            recordingState } = this.state;

        return (
                <div className="record-container">

                    {isActiveRecording(recordingState) ?
                        <ActiveRecording alias={this.props.alias} state={recordingState}/> :
                        null
                    }

                    {emptyPlayer ? <video></video> :
                        <VideoPlayer title={playerTitle} url={playerUrl} active={playerActive}
                                     onPlay={this.playerStartUrl.bind(this)}
                                     onStop={this.playerStop.bind(this)}
                                     visible={visiblePlayer}
                                     toggleVideoPlayer={this.toggleVideoPlayer.bind(this)}/>
                    }

                    <div className="record__list-container">
                        <RecordsListTitle toggleManage={this.toggleManage.bind(this)} 
                                          visible={visibleManage}
                                          selectedPartial={selectedRecords.length > 0 && selectedRecords.length < recordings.length}
                                          selectedAll={selectedRecords.length === recordings.length}
                                          onSelectAllChanged={(e) => this.toggleSelectAll(e.target.checked)}
                                          toggleSelect={this.toggleSelect.bind(this)}
                                          onDelete={() => this.deleteSelectedRecordings()}
                        />
                        <div className="records-list__items">
                            {recordings.map(r => <RecordItem key={r.Key} value={r}
                                alias={this.props.alias}
                                updateRecordings={this.props.updateRecordings}
                                selected={selectedRecords.indexOf(r.Key) >= 0}
                                onSelect={(checked, key) => this.onRecordSelectChanged(checked, key)}
                                playing={playerUrl === r.Url && playerActive}
                                play={(recording) => this.playerStart(recording)}
                                stop={(clearContent) => this.playerStop(clearContent)}
                                visible={visibleManage}
                                toggleVideoPlayer={this.toggleVideoPlayer.bind(this)}/>
                                )}
                        </div>
                    </div>
                </div>
        );
    }

    deleteSelectedRecordings () {
        let { selectedRecords } = this.state;
        let _remove = function () {
            let { playing, stop, alias } = this.props;
            if (playing) {
                stop('clearContent');
            }
            RecordingsAPI.deleteRecords(alias, selectedRecords)
                .then(() => {
                    this.updateRecordings();
                })
                .catch(() => {})
        }.bind(this);
        showPopup({
            message: i18n['Are you sure you want to delete '] +
                selectedRecords.length +
                ' recording' + (selectedRecords.length > 0 ? 's' : '') + '?'
        })
            .then(() => {
                _remove();
            })
            .catch(() => {
            });
    }

    toggleSelectAll (checked) {
        let { selectedRecords, recordings } = this.state;
        selectedRecords = [];
        if (checked) {
            selectedRecords = selectedRecords.concat(recordings.map(v => v.Key));
        }
        this.setState({selectedRecords: selectedRecords});
    }

    onRecordSelectChanged (checked, key) {
        let { selectedRecords } = this.state;
        if (checked) {
            selectedRecords.push(key);
        } else {
            let index = selectedRecords.findIndex(k => k === key);
            selectedRecords.splice(index, 1);
        }

        this.setState({selectedRecords: selectedRecords});
    }

    playerStart (recording) {
        this.setState({
            playerTitle: recording.Title,
            playerUrl: recording.Url,
            playerActive: true
        });

    }

    playerStartUrl (url) {
        let {recordings} = this.state;
        let recording = recordings.find(r => r.Url === url);
        this.setState({
            playerTitle: recording ? recording.Title : '',
            playerUrl: url,
            playerActive: true
        });

    }

    playerStop (clear) {
        let mustBeCleared = clear === 'clearContent';
        let {playerTitle, playerUrl} = this.state;
        this.setState({
            playerActive: false,
            playerTitle: mustBeCleared ? undefined : playerTitle,
            playerUrl: mustBeCleared ? undefined : playerUrl,
            emptyPlayer: mustBeCleared
        });
    }

    toggleVideoPlayer (visible) {
        this.setState({ visiblePlayer: visible });
    }

    toggleManage () {
        this.setState({ visibleManage: !this.state.visibleManage});
    }

    toggleSelect () {
        this.setState({ selectedPartial: !this.state.selectedPartial});
    }
}

const RecordsListTitle = (props) => {
    let {visible, selectedPartial, selectedAll,
        toggleManage, toggleSelect, onSelectAllChanged, onDelete} = props;
    return (
        <div className="records-list__title">
            <span className={"link" + (visible ? ' hide' : '')} onClick={() => toggleManage()}>{i18n['Manage All Records']}</span>
            <label className={"checkbox-label" + (!visible ? ' hide' : '') + (selectedPartial ? ' separate-checked': '')}>
                <input type="checkbox" className="checkbox" checked={selectedAll} onChange={onSelectAllChanged}/>
                <span className="checkbox-custom"/>
                <span className="link"
                      onClick={() => toggleSelect()}>
                    {selectedPartial || !selectedAll ? i18n['Select All']: i18n['Unselect All']}
                </span>
            </label>
            <div className={"records-list__delete-selected" + (visible && (selectedPartial || selectedAll) ? '' : ' hide')}
                 onClick={onDelete}>
                {i18n['Delete selected']}
            </div>
        </div>
    );
};

const VideoPlayer = (props) => {
    let {toggleVideoPlayer, visible} = props;
    return (
        <div className={"record-player" + (!visible ? ' hide-player' : '')}> 
            <div className="record-player__title">
                {props.title}
                <div className="close-icon" onClick={() => toggleVideoPlayer(false)} />
            </div>
 
            <Video url={props.url} active={props.active} onStop={props.onStop} onPlay={props.onPlay}>
                {i18n['Your browser does not support the video tag.']}
            </Video>
        </div>
    );
};

const ActiveRecording = (props) => {
    let {state, alias} = props;
    return (
        <div className="record-current">
            <div className="record-current__indicator"/>
            <div className="record-current__info ellipsing">
                {i18n['Recording']} {alias}
                <span className="record-current__time">00:00:03</span>
            </div>
            {state === MCUPayload.RecordingState.PAUSED ?
                <div className="record-current__button icon-pause" onClick={() => ServerAPI.resumeRec()}>{i18n['Resume']}</div> :
                <div className="records-list__pause" onClick={() => ServerAPI.pauseRec()}>{i18n['Pause']}</div>
            }
            <div className="record-current__button icon-stop" onClick={() => ServerAPI.stopRec()}>{i18n['Stop']}</div>
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

export default Recordings;
