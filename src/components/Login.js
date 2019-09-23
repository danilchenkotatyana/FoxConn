import React, {Component} from 'react';
import '../css/main.scss';
import EventBus from "../model/events-bus";
import Event from "../model/event-names";
import Middleware from '../model/middleware';
import i18n from '../localization/i18n';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: this.props.message
        };
    }

    render() {
        return (
            <div className="login-page">
                <header className="header">
                    <div className="header__logo">{i18n['ConX']}</div>
                </header>
                <div className="login-container">
                    <div>Authenticating...</div>
{/*
                    <label className="login-title" htmlFor="username">
                        {i18n['Meeting room number']}
                        <input className="login-input" id="username" type="number" ref="username" placeholder={i18n['Enter room number']} />
                    </label>
                    <label className="login-title" htmlFor="password">
                        {i18n['Host pin']}
                        <input className="login-input" id="password" type="password" ref="password" pattern="[0-9]*" placeholder={i18n['Enter host pin']} />
                    </label>
                    <button className="control-button blue-btn" value="Login" onClick={this.login.bind(this)}>{i18n['Log in']}</button>
                    <div className="exception-message">{this.state.message}</div>
*/}
                </div>
            </div>
        );
    }

    login() {
        let username = this.refs.username.value;
        let password = this.refs.password.value;
        let fail = function (json) {
            this.setState({ message: json.message });
        }.bind(this);
        Middleware.login(username, password).then(() => {
            EventBus.trigger(Event.SESSION_STARTED);
        }).catch(fail);
    }
}

export default Login;
