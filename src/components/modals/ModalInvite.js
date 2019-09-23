import React, {Component} from 'react';
import ServerAPI from '../../api/server';
import i18n from '../../localization/i18n';

export const INVITE_TYPE = {
    email: 'email',
    sip: 'sip'
};

const SETTINGS = {};
SETTINGS[INVITE_TYPE.sip] = {
    title: i18n['Invite Participants in ConX'],
    sub_title: i18n['Enter video number(s) one per line'],
    invite_button_text: i18n['Invite Participants'],
    inviteMethod: ServerAPI.startCall
};

SETTINGS[INVITE_TYPE.email] = {
    title: i18n['Invite Participants in Mail'],
    sub_title: i18n['Enter email addresses one per line'],
    invite_button_text: i18n['Send Invitations'],
    inviteMethod: ServerAPI.inviteByEmail
};


class ModalInvite extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inviteText: '',
            settings: SETTINGS[props.type],
            canInvite: false
        };
    }

    componentDidMount() {
        this.refs.siplist.focus();
    }

    render() {
        let { inviteText, canInvite } = this.state;
        let { type, onCancel } = this.props;

        let settings = SETTINGS[type];

        return (
            <div className="modal modal__invite">
                <div className="modal__container">
                    <div className="modal__title">{settings.title}</div>
                    <div className="modal__sub-title">{settings.sub_title}</div>
                    <textarea ref="siplist" type="text" className="modal__textarea" value={inviteText} onChange={(e) => this.onChange(e)}/>
                    <div className="modal__buttons">
                        <div className={"blue-btn" + (canInvite ? '' : ' inactive')} onClick={() => this.onInvite()}>{settings.invite_button_text}</div>
                        <div className="white-btn" onClick={onCancel}>{i18n['Cancel']}</div>
                    </div>
                </div>
            </div>
        );
    }

    getInviteList (text) {
        if (!SETTINGS[this.props.type]) {
            return [];
        }

        let sipList = text.trim().split('\n');
        if (sipList === '' || sipList.length === 0) {
            return [];
        }

        let testPattern = this.props.type === INVITE_TYPE.sip
            ? /^([0-9]+)(@(.+))?$/g
            : /^([a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+)@([a-zA-Z0-9-]+)(?:\.[a-zA-Z0-9-]+)*$/g;

        return sipList.filter(v => testPattern.test(v));
    }

    onChange (e) {
        this.setState({
            inviteText: e.target.value,
            canInvite: this.getInviteList(e.target.value).length > 0
        });
    }

    onInvite () {

        if (!SETTINGS[this.props.type]) {
            return [];
        }

        let sipList = this.getInviteList(this.refs.siplist.value);
        if (sipList === '' || sipList.length === 0) {
            return;
        }

        let inviteMethod = SETTINGS[this.props.type].inviteMethod;
        inviteMethod(sipList);

        let { onOk } = this.props;
        onOk();
    }
}

export default ModalInvite;
