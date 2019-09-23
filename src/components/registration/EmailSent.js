import React, {Component} from 'react';
import '../../css/main.scss';
import i18n from '../../localization/i18n';

class EmailSent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        let {} = this.state;

        return (
            <div className="registration__content">
                <div className="registration__title">Email Sent</div>
                <div className="registration__text">
                Thank you!<br />
                We've sent you an email to nss@n.com. Please check your email so we can finish activating your account.
                </div>
            </div>
        );
    }
}

export default EmailSent;
