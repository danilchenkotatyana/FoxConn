import React, {Component} from 'react';
import '../../css/main.scss';
import Room from "./Room";
import RoomsAPI from "../../api/rooms";
import ServerAPI from '../../api/server';
import Config from "../../config";
import i18n from '../../localization/i18n';
import Routes from "../../model/routes";
import EventsBus from "../../model/events-bus";
import Event from "../../model/event-names";
import {showPopup} from "../modals/PopupNotification";

const HOST = Config.getHost();
const ANCHOR_SUFFIX = 'anchor_room_';

class RoomsList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rooms: [],
            expandedRoomAlias: undefined,
        };

        this.collapseToggledRoom = function () {
            let {expandedRoomAlias} = this.state;
            if (expandedRoomAlias) {
                this.toggleRoom(expandedRoomAlias);
                showPopup({
                    message: i18n["Can't connect to MCU"],
                    okTitle: i18n['Close'],
                    showCancelButton: false
                });
            }
        }.bind(this);
    }

    componentDidMount() {

        EventsBus.on(Event.MCU_CONNECTION_FAIL, this.collapseToggledRoom);

        RoomsAPI.refreshRoomsList()
            .then(rooms => {
                this.setState({rooms: rooms});
                this.toggleAnchoredRoom(rooms);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    componentWillUnmount() {
        EventsBus.off(Event.MCU_CONNECTION_FAIL, this.collapseToggledRoom);
    }

    scrollIntoViewIfNeeded(target) {
        let rect = target.getBoundingClientRect();
        if ((rect.bottom + 400) > window.innerHeight || rect.top < 0) {
            target.scrollIntoView();
        }
    }

    toggleAnchoredRoom(rooms) {
        let groups = Routes.ROOMS.requestedPage().match(`\/\?${Routes.ROOMS.name}\/(\\w+)`);
        let anchoredAlias = (groups ? groups[1] : '') || rooms[0].alias;
        if (anchoredAlias) {
            let elem = this.refs[ANCHOR_SUFFIX + anchoredAlias];
            if (elem) {
                this.toggleRoom(anchoredAlias);
                if (anchoredAlias !== rooms[0].alias)
                    this.scrollIntoViewIfNeeded(elem.refs.scroll_anchor);
            }
        }
    }

    render() {
        let {rooms, expandedRoomAlias} = this.state;

        return (
            <div className="page">
                <div className="page-title">
                    <h1>{i18n['Rooms']}</h1>
                    <div className="page-title__buttons">
                        <div className="link" onClick={() => window.location.href = Routes.PLANS.getFullNodeUrl()}>{i18n['Add new' +
                        ' Room']}</div>
                        <div className="btn-green manage-btn" onClick={() => window.location.href = HOST+"/userSubscription/index"}>{i18n['Manage Subscription']}</div>
                    </div>
                </div>

                {rooms.map(room =>
                    <Room ref={ANCHOR_SUFFIX + room.alias} key={room.alias}
                          expanded={room.alias === expandedRoomAlias}
                          room={room}
                          toggleRoom={this.toggleRoom.bind(this)}
                          updateRoomsList={() => this.updateRoomsList()}
                    />
                )}
            </div>
        );
    }

    updateRoomsList () {
        this.setState({rooms: RoomsAPI.getRooms()});
    }

    toggleRoom (alias) {
        let {expandedRoomAlias} = this.state;

        if (expandedRoomAlias === alias) {
            ServerAPI.disconnectRoom(alias);
            this.setState({expandedRoomAlias: undefined, roomRecordings: undefined});
        } else {
            ServerAPI.disconnectRoom(expandedRoomAlias);
            ServerAPI.connectRoom(alias);
            this.setState({expandedRoomAlias: alias, roomRecordings: undefined});
        }
    }
}
export default RoomsList;
