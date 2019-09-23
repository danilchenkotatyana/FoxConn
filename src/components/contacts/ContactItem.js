import React, {Component} from 'react';
//import {showPopup} from "./modals/PopupNotification";
import i18n from '../../localization/i18n';

class ContactItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        let { value, onSelect, selected, onEdit} = this.props;

        let [firstName, lastName] = value.name ? value.name.split(' ') : ['', ''];

        return (
            <div className={"contacts-list__item"}>
                <label className="checkbox-label">
                    <input className="checkbox" type="checkbox" checked={selected}
                           onChange={(e) => onSelect(e.target.checked, value)}/>
                    <span className="checkbox-custom"/>
                </label>

                <div className="contacts-list__container">
                    <div className="contacts-list__mail ellipsing">{value.email}</div>
                    <div className="contacts-list__name ellipsing">{firstName}</div>
                    <div className="contacts-list__last-name ellipsing">{lastName}</div>
                </div>

                <div className="contacts-list__edit">
                    <div className="edit-icon"
                         onClick={() => onEdit(value)}
                    />
                </div>

            </div>
        );
    }

}

export default ContactItem;
