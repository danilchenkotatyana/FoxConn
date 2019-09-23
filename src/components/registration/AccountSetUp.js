import React, {Component} from 'react';
import '../../css/main.scss';
import i18n from '../../localization/i18n';
import Config from "../../config";

const HOST = Config.getHost();

class AccountSetUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            info: {},
            countries: undefined
        };
    }

    render() {
        let {info, countries} = this.state;

        return (
            <div className="registration__content">
                <div className="registration__text">
                Thank you for verifying your email. Let's finish setting up your account.
                </div>
                <div className="form-item">
                    <div className="form-title">{i18n['Country']}</div>
                    <select className="form-select">
                        <option value="US" selected="">US</option>
                    </select>
                </div>
                <div className="form-item">
                    <div className="form-title">{i18n['Email']}</div>
                    <input className="registration__input form-input" type="text" />
                    <div className="registration__message error">{i18n['Email address cannot be left empty.']}</div>
                </div>
                <div className="form-item">
                    <div className="form-title">{i18n['First Name']}</div>
                    <input className="registration__input form-input" type="text" />
                    <div className="registration__message error">{i18n['First Name cannot be left empty.']}</div>
                </div>
                <div className="form-item">
                    <div className="form-title">{i18n['Last Name']}</div>
                    <input className="registration__input form-input" type="text" />
                    <div className="registration__message error">{i18n['Last Name cannot be left empty.']}</div>
                </div>
                <div className="form-item">
                    <div className="form-title">{i18n['Password']}</div>
                    <input className="registration__input form-input" type="password" />
                    <div className="registration__message error">{i18n['Password cannot be left empty.']}</div>
                </div>
                <div className="form-item">
                    <div className="form-title">{i18n['Confirm password']}</div>
                    <input className="registration__input form-input" type="password" />
                    <div className="registration__message error">{i18n['Confirm password cannot be left empty.']}</div>
                </div>
                
                <div className="registration__button btn-green">{i18n['Next']}</div>
            </div>
        );
    }
    countryChanged (e) {
        let {info} = this.state;
        info.country = e.target.value;
    }
}

export default AccountSetUp;
