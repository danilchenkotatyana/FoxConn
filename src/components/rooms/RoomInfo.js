import React, {Component} from 'react';
import '../../css/main.scss';
import {formatDate} from '../../model/utils';
import EventBus from "../../model/events-bus";
import Event from "../../model/event-names";
import Config from "../../config";
import i18n from '../../localization/i18n';

const HOST = Config.getHost();

const CREATED_FROM = {
    'CC': 'Credit Card',
    'DLC': 'Activated with code',
    'CONX': 'Conx'
};

class RoomInfo extends Component {

    constructor (props) {
        super(props);

        this.state = {
            roomUrl: RoomInfo.createUrl(props.room.alias)
        };

        this.onMcuServiceInfo = function (payload) {
            if (this.props.room.alias !== payload.SipAlias)
                return;

            let pin = typeof payload.Pin === 'string' ? payload.Pin : undefined;
            this.setState({
                roomUrl: RoomInfo.createUrl(props.room.alias, pin),
            })
        }.bind(this);
    }

    componentDidMount() {
        EventBus.on(Event.MCU_SERVICE_INFO, this.onMcuServiceInfo);
    }

    componentWillUnmount() {
        EventBus.off(Event.MCU_SERVICE_INFO, this.onMcuServiceInfo);
    }

    render() {
        let {room, expanded, toggleRoom, refreshRoom} = this.props;
        return (
            <div className="main_title room-title">
                <div className="main_title__left">
                    <h1>{i18n['Room']} {room.alias} <div className="credit-card">{i18n[CREATED_FROM[room.createdFrom]] || ''}</div></h1>
                    <div className="main_title__bottom">
                        <div className="subscription-title">{i18n['Max Participants']}
                            <span>{room.max_users}</span>
                        </div>
                        <div className="subscription-title">{i18n['Expiration date']}
                            <span>{formatDate(room.end_date)}</span>
                        </div>
                    </div>
                </div>
                <div className="main_title__right">
                    <div className="refresh" onClick={refreshRoom}>{i18n['Refresh']}</div>
                    { this.props.room.type === 'trial' ?
                        <div className="btn-green upgrade-btn" onClick={() => this.upgradeRoom()}>{i18n['Upgrade']}</div>
                        : null
                    }
                    <div className="btn-white" onClick={() => this.copyLink()}>{i18n['Copy link to room']}</div>
                </div>
                <div className={expanded ? "icon-up" : "icon-down"} onClick={toggleRoom}/>
            </div>
        );
    }

    static createUrl (alias, pin) {
        return 'http://conx.infocus.net/' + btoa(alias+(pin ? (':'+pin) : ''));
    }

    upgradeRoom () {
        let urlid = this.props.room.id.toLowerCase();
        urlid = urlid.substr(0, 8) +
            '-' + urlid.substr(8, 4) +
            '-' + urlid.substr(12, 4) +
            '-' + urlid.substr(16, 4) +
            '-' + urlid.substr(20);
        window.location.href = HOST + '/room/addNewRoom/cid/'+urlid+'/mode/upgrade';
    }

    copyLink () {
        let {roomUrl} = this.state;

        function selectElementText(element) {
            if (document.selection) {
                let range = document.body.createTextRange();
                range.moveToElementText(element);
                range.select();
            } else if (window.getSelection) {
                let range = document.createRange();
                range.selectNode(element);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
            }
        }
        let element = document.createElement('DIV');
        element.textContent = roomUrl;
        document.body.appendChild(element);
        selectElementText(element);
        document.execCommand('copy');
        element.remove();
    }
}

export default RoomInfo;
