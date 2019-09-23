import React, {Component} from 'react';
//import {showPopup} from "./modals/PopupNotification";
import i18n from '../../localization/i18n';

class ContactItemEdit extends Component {

    constructor(props) {
        super(props);

        let { value } = this.props;
        let [firstName, lastName] = value.name ? value.name.split(' ') : ['', ''];

        this.state = {
            email: value.email,
            firstName: firstName,
            lastName: lastName
        };
    }

    render() {
        let { onCancelEdit } = this.props;
        let { email, firstName, lastName } = this.state;

        let letSave = !!email && (!!firstName || !!lastName);

        return (
            <div className={"contacts-list__item"}>
                <div className="contacts-list__container inputs-container">
                    <input className="input contacts-list__mail" type="text" placeholder={i18n['Email']}
                           value={email}
                           onChange={(e) => this.changeValue({email: e.target.value})}
                    />
                    <input className="input contacts-list__name" type="text" placeholder={i18n['First Name']}
                           value={firstName}
                           onChange={(e) => this.changeValue({firstName: e.target.value})}
                    />
                    <input className="input contacts-list__last-name" type="text" placeholder={i18n['Last Name']}
                           value={lastName}
                           onChange={(e) => this.changeValue({lastName: e.target.value})}
                    />
                </div>

                <div className="contacts-list__edit">
                    <div className="btn-white"
                         onClick={onCancelEdit}>{i18n['Cancel']}</div>
                    <div className={"btn-green" + (!letSave ? ' inactive' : '')}
                         onClick={() =>this.save()}>{i18n['Save']}</div>
                </div>
            </div>
        );
    }

    changeValue (v) {
        this.setState(v);
    }

    save () {
        let { value, onSave } = this.props;
        let { email, firstName, lastName } = this.state;
        onSave({
            id: value.id,
            email: email,
            firstName: firstName,
            lastName: lastName
        })
    }

}

export default ContactItemEdit;
