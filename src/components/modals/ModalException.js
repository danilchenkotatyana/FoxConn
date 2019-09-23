import React, {Component} from 'react';
import i18n from '../../localization/i18n';

class ModalException extends Component {

    constructor(props) {
        super(props);

        this.state = {
            meetingName: 'room-599999200@infocus.net-2019-05-16_06_41_36.mp4'
        };
    }

    render() {
        let { meetingName } = this.state;

        return (
            <div className="modal modal__exception">
                <div className="modal__container">
                    <div className="modal__title">{i18n['Are you sure you want to delete']} {meetingName} {i18n['video']}?</div>
                    <div className="modal__buttons">
                        <div className="blue-btn">{i18n['Delete']}</div>
                        <div className="white-btn">{i18n['Cancel']}</div> 
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalException;
