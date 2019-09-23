import React, {Component} from 'react';
import Event from '../../model/event-names';
import EventBus from '../../model/events-bus';
import {resolveImageUrl} from "../../model/utils";

class PopupSendMessage extends Component {

    constructor(props) {
        super(props);

        this.state= {
            canSend: false
        };
    }

    render() {

        let {contact, number} = this.props;

        let symbolsLeft = 140 - (this.refs.messageText ? this.refs.messageText.value.length : 0);
        let symbolsMessage = '' + symbolsLeft + ' symbols left';
        if (symbolsLeft === 1)
            symbolsMessage = '1 symbol left';
        else if (symbolsLeft === 0)
            symbolsMessage = 'No symbols left';

        return (
            <div className="modal-popup popup-send-message" id=''>
                <form className='modal-popup__root'>
                    <div className="icon-close" onClick={() => EventBus.trigger(Event.CLOSED_SEND_MESSAGE_POPUP)}></div>
                    <div className="popup-title">Send Message</div>
                    <div className="popup-main-section">
                        <div className="popup-contact-container">
                            <div className="callee-photo__container">
                                { contact.getImage() ?
                                <img className="callee-photo" src={resolveImageUrl(contact)} alt="" /> : null }
                            </div>
                            <div className="callee-text">
                                <div className="callee-name">{contact.getDisplayName()}</div>
                                <div className="contact-room">{number}</div>
                            </div>
                        </div>
                        <label className="switcher-container">
                            <input className="switcher" type="checkbox" disabled/>
                            <div className="switcher-box"/>
                            <div className="switcher-text">SMS</div>
                            <div className="switcher-text">WeSend</div>
                        </label>
                        <div className="textarea-container">
                            <textarea className="textarea" placeholder="Enter your message..." maxLength='140' ref={"messageText"} onInput={
                                function (e) {
                                    this.setState({canSend: !!e.target.value});
                                }.bind(this)
                            }/>
                            <div className="textarea-symbols">{symbolsMessage}</div>
                        </div>
                    </div>
                    <div className="popup-buttons">
                        <div className="white-btn cancel-button"
                             onClick={() => EventBus.trigger(Event.CLOSED_SEND_MESSAGE_POPUP)}>Cancel</div>
                        <div className={"blue-btn send-button" + (this.state.canSend ? "" : " inactive")}
                             onClick={function () {EventBus.trigger(Event.CLOSED_SEND_MESSAGE_POPUP, this.refs.messageText.value)}.bind(this)}>Send</div>
                    </div>
                </form>
            </div>
        );
    }
}

export default PopupSendMessage;

export function showSendMessage(contact, number, okHandler) {
    function _handler (message) {
        EventBus.off(Event.CLOSED_SEND_MESSAGE_POPUP, _handler);
        if (message && okHandler && typeof okHandler === 'function') {
            okHandler(message);
        }
    }
    EventBus.on(Event.CLOSED_SEND_MESSAGE_POPUP, _handler);
    EventBus.trigger(Event.SHOW_SEND_MESSAGE_POPUP, {contact: contact, number: number});
}
