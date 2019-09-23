import React, {Component} from 'react';
import i18n from '../../localization/i18n';

const Events = {
    SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
    HIDE_NOTIFICATION: 'HIDE_NOTIFICATION',
    OK_NOTIFICATION: 'OK_NOTIFICATION',
    CANCEL_NOTIFICATION: 'CANCEL_NOTIFICATION',
};

class PopupNotification extends Component {

    constructor (props) {
        super(props);

        this.state = {
            visible: false,
            caption: undefined,
            message: undefined,
            transactionID: undefined,
            okTitle: i18n['Ok'],
            cancelTitle: i18n['Cancel'],
            showCancelButton: true
        };

        this.onShowNotification = function (options) {
            this.setState(Object.assign({
                visible: true,
                caption: undefined,
                message: undefined,
                transactionID: undefined,
                showCancelButton: true,
                okTitle: i18n['Ok'],
                cancelTitle: i18n['Cancel']}, options.detail));
        }.bind(this);

        this.onHideNotification = function () {
            this.setState({visible: false});
        }.bind(this);
    }

    componentDidMount() {
        window.addEventListener(Events.SHOW_NOTIFICATION, this.onShowNotification);
        window.addEventListener(Events.HIDE_NOTIFICATION, this.onHideNotification);
    }

    componentWillUnmount() {
        window.removeEventListener(Events.SHOW_NOTIFICATION, this.onShowNotification);
        window.removeEventListener(Events.HIDE_NOTIFICATION, this.onHideNotification);
    }

    render() {
        let {
            visible, caption, message, okTitle, cancelTitle, showCancelButton,
            transactionID
        } = this.state;

        return (
            <div className="modal modal__notification" style={{display: visible ? '' : 'none'}}>
                <div className='modal__container'>
                    {/*<div className="icon-error"></div>*/}
                    {caption ? <div className="modal__title">{caption}</div> : null}
                    <div className="modal__title">
                        {message}
                    </div>
                    {transactionID ?
                        <div className="modal__title">
                            Transaction ID: {transactionID}
                        </div> : null
                    }
                    <div className="modal__buttons">
                        <div className="blue-btn"
                             onClick={() => window.dispatchEvent(new Event(Events.OK_NOTIFICATION))}>
                            {okTitle ? okTitle : i18n['Ok']}
                        </div>
                        {showCancelButton ?
                            <div className="white-btn"
                                 onClick={() => window.dispatchEvent(new Event(Events.CANCEL_NOTIFICATION))}>
                                {cancelTitle ? cancelTitle : i18n['Cancel']}
                            </div> : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export function showPopup (options) {

    window.dispatchEvent(new CustomEvent(Events.SHOW_NOTIFICATION, {detail: options}));

    return new Promise ((resolve, reject) => {
        function onOk () {
            window.dispatchEvent(new Event(Events.HIDE_NOTIFICATION));
            unsubscribe();
            resolve();
        }

        function onCancel () {
            window.dispatchEvent(new Event(Events.HIDE_NOTIFICATION));
            unsubscribe();
            reject();
        }

        function unsubscribe() {
            window.removeEventListener(Events.OK_NOTIFICATION, onOk);
            window.removeEventListener(Events.CANCEL_NOTIFICATION, onCancel);
        }

        window.addEventListener(Events.OK_NOTIFICATION, onOk);
        window.addEventListener(Events.CANCEL_NOTIFICATION, onCancel);
    });
}
export default PopupNotification;
