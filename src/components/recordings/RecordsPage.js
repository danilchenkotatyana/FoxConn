import React, {Component} from 'react';
import '../../css/main.scss';
import RoomsAPI from "../../api/rooms";
import RecordingsAPI from '../../api/recordings';
import Recordings from "./Recordings";
import i18n from '../../localization/i18n';

class RecordsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rooms: [],

            showRoomMenu: false,
            recordingsRoomAlias: undefined,
            roomRecordings: undefined,
            recordToPlay: undefined,

            recordingsAreUpdating: false,
            recordingsLoadError: undefined,
            recordingsLoaded: false
        };
    }

    componentDidMount() {
        RoomsAPI.refreshRoomsList()
            .then(() => {
                let rooms = RoomsAPI.getRooms();
                let alias = rooms && rooms.length ? rooms[0].alias : undefined;
                this.setState({
                    rooms: rooms,
                    recordingsRoomAlias: alias
                });

                this.updateRecordings(alias);
            })
            .catch((err) => {
                console.error(err);
            })

    }

    render() {
        let {
            rooms,
            recordingsAreUpdating,
            roomRecordings,
            recordToPlay,
            recordingsRoomAlias,
            recordingsLoadError
        } = this.state;

        let haveRecordings = roomRecordings && roomRecordings.length > 0;

        return (
            <div className="page">
                <div className="page-title">
                    <h1>{i18n['Records in']}
                        <div className={"dropdown" + (this.state.showRoomMenu ? ' active' : '')}>
                            <div className="dropdown__title"
                                onClick={() => this.toggleRoomMenu()}>Room {recordingsRoomAlias}
                            </div>

                            <ul className="dropdown__menu">
                                {rooms.map(room =>
                                    <li key={room.alias} className="dropdown__item"
                                    onClick={(e) => this.toggleRoom(e.target.getAttribute('data-alias'))}
                                    data-alias={room.alias}>
                                        {room.alias}
                                    </li>
                                )}
                            </ul>

                        </div>
                    </h1>
                    {!recordingsAreUpdating ?
                        <div className="page-title__info">
                            <div className="refresh"
                                onClick={() => this.refreshRecordings()}>{i18n['Refresh']}</div>
                            {haveRecordings ?
                                <div className="items-counter">{roomRecordings.length} {i18n['items']}</div>
                                : null
                            }
                        </div> : null
                    }
                </div>

                {recordingsAreUpdating ?
                    <div className="record-container">
                        <div className={"connecting"}>{i18n['Updating list...']}</div>
                    </div>
                    :
                    (haveRecordings ?
                            <Recordings alias={recordingsRoomAlias}
                                        toggleRoom={this.toggleRoom.bind(this)}
                                        showRoomRecords={this.showRoomRecords.bind(this)}
                                        updateRecordings={this.updateRecordings.bind(this)}
                                        recordings={roomRecordings} recordToPlay={recordToPlay}
                            /> :
                            <div className="record-container">{i18n['There are no recordings yet']}.</div>    
                    )
                }
                {recordingsLoadError ?
                    <div className="record-container">{recordingsLoadError}</div>   
                    : null
                }
            </div>
        );
    }

    updateRecordings (alias) {
        let {recordingsRoomAlias} = this.state;
        recordingsRoomAlias = alias ? alias : recordingsRoomAlias;
        this.setState({
            roomRecordings: undefined,
            recordingsAreUpdating: true,
            recordingsLoadError: undefined,
            recordingsLoaded: false
        });

        if (!recordingsRoomAlias)
            return;

        RecordingsAPI.getRecordingsList(recordingsRoomAlias)
            .then(function (data) {
                if (Array.isArray(data)) {
                    this.setState({
                        roomRecordings: data,
                        recordingsAreUpdating: false,
                        recordingsLoadError: undefined,
                        recordingsLoaded: true
                    });
                } else {
                    this.setState({
                        recordingsAreUpdating: false,
                        recordingsLoadError: data.errors,
                        recordingsLoaded: false
                    });
                }
            }.bind(this))
            .catch(function (err) {
                console.error(err);
                this.setState({
                    roomRecordings: [],
                    recordingsAreUpdating: false,
                    recordingsLoadError: err,
                    recordingsLoaded: true
                });
            }.bind(this));
    }

    showRoomRecords (alias, recordings, recordToPlay) {
        this.setState({
            recordingsRoomAlias: alias,
            roomRecordings: recordings,
            recordToPlay: recordToPlay
        });
    }

    toggleRoom (alias) {
        this.setState({showRoomMenu: false, recordingsRoomAlias: alias});
        this.updateRecordings(alias);
    }

    toggleRoomMenu () {
        this.setState({ showRoomMenu: !this.state.showRoomMenu})
    }

    refreshRecordings (alias) {
        this.updateRecordings(alias);
    }
}

export default RecordsPage;
