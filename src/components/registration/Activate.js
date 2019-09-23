import React, {Component} from 'react';
import '../../css/main.scss';
import i18n from '../../localization/i18n';

class Activation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        let {} = this.state;

        return (
            <div className="registration__content">
                <div className="registration__title">Room Activation</div>
                <div className="registration__text">
                    Please enter the activation code you were provided.
                </div>
                <input className="registration__input form-input" placeholder="Enter Activation Code" />
                <div className="registration__message error">Activation Code cannot be blank.</div>
                <div className="registration__button btn-green">Next</div>
            </div>
        );
    }
}

export default Activation;
