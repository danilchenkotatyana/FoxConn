import React, {Component} from 'react';
import {formatTimeAMPM} from '../../../model/utils';
import i18n from '../../../localization/i18n';

class MeetingInfoBar extends Component {
    constructor (props) {
        super(props);
        this.state = {
            showInviteMenu: false
        }
    }

    render() {
        let {
            startTime
        } = this.props;

        let {
            showInviteMenu
        } = this.state;

        return (
            <div className="participants__title">
                {startTime ?
                    <div className="participants__title-text">
                        {i18n['Starting time']}
                        <span className="participants__title-time">{startTime ? formatTimeAMPM(startTime) : ''}</span>
                    </div> : null
                }
                <div className={"participants__invite link" + (showInviteMenu ? ' active' : '')}
                    onClick={() => this.setState({ showInviteMenu: !showInviteMenu })}>{i18n['Invite']}</div>
                <div className={"dropdown-menu" + (showInviteMenu ? ' active' : '')}>
                    <div className="dropdown__invite" onClick={() => this.onInviteSip()}>{i18n['Invite ConX']}</div>
                    <div className="dropdown__invite-email" onClick={() => this.onInviteByEmail()}>{i18n['Invite' +
                    ' Mail']}</div>
                </div>
            </div>
        );
    }

    onInviteSip () {
        let { onShowInviteSipList } = this.props;
        this.setState({showInviteMenu: false});
        onShowInviteSipList();
    }

    onInviteByEmail () {
        let { onShowInviteEmailList } = this.props;
        this.setState({showInviteMenu: false});
        onShowInviteEmailList();
    }
}

export default MeetingInfoBar;
