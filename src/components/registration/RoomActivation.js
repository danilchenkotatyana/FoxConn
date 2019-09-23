import React, {Component} from 'react';
import '../../css/main.scss';
import i18n from '../../localization/i18n';

class RoomActivation extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        let {info, countries} = this.state;

        return (
            <div className="registration__content">
                <div className="registration__title">Room Activation</div>
                <div className="registration__sub-title">Your Room Number</div>
                <div className="registration__plan-title">20108</div>
                <div className="registration__text">
                Choose a 4-digit Meeting Room Security Pin #. This will be used by you and your participants to enter the meeting room.
                </div>
                <div className="form-item">
                    <div className="form-title">Meeting Room Security Pin#</div>
                    <input className="registration__input form-input" type="text" placeholder="Enter a 4 d  Digit pin" />
                    <div className="registration__message error">Enter a 4 d  Digit pin</div>
                </div>
                <div className="registration__text">
                Choose a 4 digit Host Pin #. This will be used to manage your meeting. Features include locking the meeting room, muting participants, and more.
                </div>
                <div className="form-item">
                    <div className="form-title">Host Pin #</div>
                    <input className="registration__input form-input" type="text" placeholder="Enter a 4 d  Digit pin" />
                    <div className="registration__message error">Enter a 4 d  Digit pin</div>
                </div>
                
                <div className="registration__button btn-green">Activate My Room</div>
                <div className="registration__message">We will send you a confirmation email with your Room Number and Pin #s.</div>
            </div>
        );
    }
}

export default RoomActivation;
