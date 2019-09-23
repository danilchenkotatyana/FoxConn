import React, {Component} from 'react';
import EventBus from '../model/events-bus';
import Event from '../model/event-names';
import Config from "../config";
import i18n from '../localization/i18n';

const HOST = Config.getHost();

class Footer extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

        this.ismounted = false;

        EventBus.on(Event.AFTER_MCU_INITIAL_STATE, function () {
            if (this.ismounted) {
                this.setState({
                });
            }
        }.bind(this));

    }

    componentDidMount() {
        this.ismounted = true;
    }

    componentWillUnmount() {
        this.ismounted = false;
    }

    render() {
        return (
            <footer className="footer">
                <div className="footer__links">
                    <a href={HOST+"/site/privacy-policy"}>{i18n['Privacy Policy']}</a>
                    <a href={HOST+"/site/terms-of-use"}>{i18n['Terms of Use']}</a>
                    <a href={HOST+"/site/eula"}>{i18n['End-User License Agreement']}</a>
                </div>
                <div className="footer__copyright">© {i18n['Copyright 2018 InFocus Corporation. All Rights Reserved.']}</div>
            </footer>
        );
    }
}

export default Footer;
