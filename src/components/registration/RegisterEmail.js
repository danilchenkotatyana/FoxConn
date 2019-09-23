import React, {Component} from 'react';
import '../../css/main.scss';
import i18n from '../../localization/i18n';

class RegisterEmail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        let {} = this.state;

        return (
            <div className="registration__content">
                <div className="registration__plan-title">ConX 3</div>
                <div className="registration__plan-sub-title">Personal</div>
                <div className="registration__plan-text">
                    1 Room<br />
                    3 Participants
                </div>
                <div className="registration__text">Please enter your email address.</div>
                <input className="registration__input form-input" placeholder="Email Address" />
                <div className="registration__message error">Email address cannot be left empty.</div>
                <div className="registration__button btn-green">Next</div>
            </div>
        );
    }
}

export default RegisterEmail;
