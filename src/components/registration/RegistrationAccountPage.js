import React, {Component} from 'react';
import '../../css/main.scss';
import i18n from '../../localization/i18n';
import RegisterEmail from './RegisterEmail';
import Activation from './Activate';
import EmailSent from './EmailSent';
import AccountSetUp from './AccountSetUp';
import RoomActivation from './RoomActivation';

class RegistrationAccountPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        let {} = this.state;

        return (
            <div className="page registration">
                <div className="steps">
                    <div className="steps__item active">
                        <div className="steps__number">1</div>
                        {i18n['Create Account']}
                    </div>
                    <div className="steps__item">
                        <div className="steps__number">2</div>
                        {i18n['Account Set Up']}
                    </div>
                    <div className="steps__item">
                        <div className="steps__number">3</div>
                        {i18n['Room Activation']}
                    </div>
                </div>
                <RegisterEmail />
                <Activation />
                <EmailSent />
                <AccountSetUp/>
                <RoomActivation/>
            </div>
        );
    }
}

export default RegistrationAccountPage;
