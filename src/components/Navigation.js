import React, {Component} from 'react';
import '../css/main.scss';
import Config from '../config';
import i18n from '../localization/i18n';
import Routes from "../model/routes";

const HOST = Config.getHost();

class Navigation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showMenu: false
        };

    }

    render() {
        let { showMenu } = this.state;

        return (
            <div className="navigation">
                <div className="navigation__mobile-main navigation__item icon-nav-room"> 
                    <div className="navigation__mobile-active" onClick={() => this.setState({ showMenu: !this.state.showMenu })}>{i18n['Room Controls']}</div>
                </div>
                <ul className={"navigation__container" + (showMenu ? ' active' : '')}>
                    <li className={"navigation__item icon-nav-room"+(Routes.ROOMS.isCurrent() ? ' active' : '')}>
                        <a href={HOST+Routes.ROOMS.getNodeUrl()}>{i18n['Room Controls']} </a>
                    </li>
                    <li className="navigation__item icon-nav-scedule"> 
                        <a href={HOST+"/meeting/index"}>{i18n['Schedule a Meeting']}</a>
                    </li>
                    <li className="navigation__item icon-nav-meetings">
                        <a href={HOST+"/meeting/scheduled"}>{i18n['Meetings']}</a>
                    </li>
                    <li className={"navigation__item icon-nav-records"+(Routes.RECORDINGS.isCurrent() ? ' active' : '')}>
                        <a href={HOST+Routes.RECORDINGS.getNodeUrl()}>{i18n['Records']}</a>
                    </li>
                    <li className={"navigation__item icon-nav-contacts"+(Routes.CONTACTS.isCurrent() ? ' active' : '')}>
                        <a href={HOST+Routes.CONTACTS.getNodeUrl()}>{i18n['Contacts']}</a>
                    </li>
{/*
                    temporary menu item
*/}
                    <li className={"navigation__item icon-nav-contacts"+(Routes.REGISTRATION.isCurrent() ? ' active' : '')}>
                        <a href={HOST+Routes.REGISTRATION.getNodeUrl()}>REGISTRATION</a>
                    </li>
                    <li className="navigation__item icon-nav-profile">
                        <a href={HOST+"/setting/index"}>{i18n['Profile']}</a>
                    </li>
                    <li className="navigation__item icon-nav-billing"> 
                        <a href={HOST+Routes.BILLING.getNodeUrl()}>{i18n['Billing']}</a>
                    </li>
                    {/* <li className="navigation__item icon-nav-reports">
                        <a href="">{i18n['Reports']}</a>
                    </li> */}
                    <li className="navigation__item icon-nav-contact-us"> 
                        <a href={HOST+"/user/requestForm"}>{i18n['Contact Us']}</a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Navigation;
