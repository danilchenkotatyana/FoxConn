import React, {Component} from 'react';
import '../../css/main.scss';
import ContactItem from './ContactItem';
import i18n from '../../localization/i18n';
import ContactsAPI from "../../api/contacts";
import ContactItemEdit from "./ContactItemEdit";
import {showPopup} from "../modals/PopupNotification";
import ImportContactsDropdown from "./ImportContactsDropdown";
import EventBus from "../../model/events-bus";
import Event from "../../model/event-names";

class ContactsPage extends Component {

    constructor (props) {
        super(props);

        this.state = {
            contacts: [],
            visibleManage: false,
            selectedContacts: [],
            contactToEdit: undefined,
            contactsLoadError: undefined,
            contactsAreUpdating: false,
            toggleImportDropdown: false
        };

        this.NEED_UPDATE_CONTACTS_AFTER_IMPORT = function () {
            showPopup({message: 'Contacts are imported successfully', showCancelButton: false});
            this.updateContacts();
        }.bind(this);

        this.CONTACTS_IMPORT_GONE_WRONG = function () {
            showPopup({message: 'Contacts import failed', showCancelButton: false});
        }.bind(this);

    }

    componentDidMount() {
        EventBus.on(Event.NEED_UPDATE_CONTACTS_AFTER_IMPORT, this.NEED_UPDATE_CONTACTS_AFTER_IMPORT);
        EventBus.on(Event.CONTACTS_IMPORT_GONE_WRONG, this.CONTACTS_IMPORT_GONE_WRONG);

        this.updateContacts();
    }

    componentWillUnmount() {
        EventBus.off(Event.NEED_UPDATE_CONTACTS_AFTER_IMPORT, this.NEED_UPDATE_CONTACTS_AFTER_IMPORT);
        EventBus.off(Event.CONTACTS_IMPORT_GONE_WRONG, this.CONTACTS_IMPORT_GONE_WRONG);
    }

    render() {
        let { contacts, selectedContacts, contactToEdit, contactsLoadError, contactsAreUpdating, toggleImportDropdown } = this.state;

        let haveContacts = contacts && Array.isArray(contacts) && contacts.length > 0;
        let editMode = !!contactToEdit && !contactToEdit.hasOwnProperty('id');

        let selectedPartial = selectedContacts.length > 0 && selectedContacts.length < contacts.length;
        let selectedAll = selectedContacts.length === contacts.length && selectedContacts.length > 0;

        return (
            <div className="page">
                <div className="page-title">
                    <h1>{i18n['Contacts']}</h1>
                    <div className="page-title__buttons">
                        <div className="link" onClick={() => this.setState({ toggleImportDropdown: !this.state.toggleImportDropdown })}>{i18n['Import Contacts']}</div>
                        <div className="btn-green manage-btn"
                             onClick={() => this.setState({contactToEdit: {}})}
                        >{i18n['Add new Contact']}</div>
                        {toggleImportDropdown ? 
                            <ImportContactsDropdown
                                contactsAreUploaded={() => {
                                    this.setState({toggleImportDropdown: false});
                                    this.updateContacts();
                                }}
                                hideDropdown={() => {
                                    this.setState({toggleImportDropdown: false});
                                }}
                            /> : null
                        }
                        
                    </div>
                </div>
                <div className="contacts-container">
                    <div className="contacts-list__manage">
                        <div className={"contacts-list__delete-selected" + (selectedPartial || selectedAll ? '' : ' hide')}
                             onClick={() => this.deleteSelected()}>
                            {i18n['Delete selected']}
                        </div>
                    </div>
                    <div className="contacts-list">
                        { haveContacts ?
                        <div className="contacts-list__title">
                            <div className="contacts-list__checkbox">
                                <label className={"checkbox-label" + (selectedPartial ? ' separate-checked': '')}>
                                    <input
                                    className="checkbox"
                                    type="checkbox"
                                    checked={selectedAll}
                                    onChange={(e) => this.toggleSelectAll(e.target.checked)}
                                    />
                                    <span className="checkbox-custom"/>
                                </label>
                            </div>
                            <div className="contacts-list__container">
                                <div className="contacts-list__mail">{i18n['Email']}</div>
                                <div className="contacts-list__name">{i18n['First Name']}</div>
                                <div className="contacts-list__last-name">{i18n['Last Name']}</div>
                            </div>
                            
                            <div className="contacts-list__edit">{i18n['Edit']}</div>
                        </div> : null }
                        {contactsAreUpdating ?
                            <div className={"connecting"}>{i18n['Updating list...']}</div>
                            :
                            (contactsLoadError ?
                                <div>{contactsLoadError}</div>
                                :
                                (haveContacts ?
                                    <div className="contacts-list__block">
                                        {editMode ?
                                            <ContactItemEdit value={contactToEdit}
                                                             onCancelEdit={() => this.setState({contactToEdit: undefined})}
                                                             onSave={(contact) => this.saveContact(contact)}
                                            />
                                            : null
                                        }
                                        {contacts.map(c =>
                                                contactToEdit && contactToEdit.id === c.id ?
                                                    <ContactItemEdit key={c.id} value={c}
                                                                     onCancelEdit={() => this.setState({contactToEdit: undefined})}
                                                                     onSave={(contact) => this.saveContact(contact)}
                                                    />
                                                    : <ContactItem key={c.id} value={c}
                                                                   selected={!!selectedContacts.find(sc => sc.id === c.id)}
                                                                   onEdit={() => this.setState({contactToEdit: c})}
                                                                   onSelect={(selected, contact) => this.toggleSelect(selected, contact)}
                                                    />
                                        )}
                                    </div>
                                    : <div>There are no contacts yet.</div>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        );

    }

    toggleSelect (selected, contact) {
        let { selectedContacts } = this.state;
        if (selected) {
            selectedContacts.push(contact);
        } else {
            let index = selectedContacts.findIndex(c => c.id === contact.id);
            selectedContacts.splice(index, 1);
        }
        this.setState({selectedContacts: selectedContacts});
    }

    toggleSelectAll (isSelected) {
        let { selectedContacts, contacts } = this.state;
        let selectedPartial = selectedContacts.length > 0 && selectedContacts.length < contacts.length;
        if (selectedPartial) {
            this.setState({selectedContacts: []});
            return;
        }

        if (isSelected)
            this.setState({selectedContacts: this.state.contacts});
        else
            this.setState({selectedContacts: []});
    }

    updateContacts (options) {
        if (options && options.silent === true) {
            this.setState({
                contacts: undefined,
                contactsAreUpdating: true,
                contactsLoadError: undefined
            });
        }

        ContactsAPI.loadContactsList()
            .then(function (data) {
                if (Array.isArray(data)) {
                    this.setState({
                        contacts: data,
                        contactsAreUpdating: false,
                        contactsLoadError: undefined
                    });
                } else {
                    this.setState({
                        contactsAreUpdating: false,
                        contactsLoadError: data.errors
                    });
                }
            }.bind(this))
            .catch(function (err) {
                console.log(""+err);
                this.setState({
                    contacts: [],
                    contactsAreUpdating: false,
                    contactsLoadError: ""+err
                });
            }.bind(this));
    }

    saveContact (contact) {
        console.log('Save contact ', contact);

        ContactsAPI.save(contact)
            .then(function () {
                this.updateContacts({silent: true});
            }.bind(this))
            .catch((err) => {console.error(err)});

        this.setState({contactToEdit: undefined});
    }

    deleteSelected () {
        let { selectedContacts } = this.state;

        let _remove = function () {
            ContactsAPI.remove(selectedContacts)
                .then(() => {
                    this.setState({selectedContacts: []});
                    this.updateContacts();
                })
                .catch(e => {})
        }.bind(this);

        let firstContact = selectedContacts[0];
        console.log(firstContact);
        let message = selectedContacts.length === 1 ?
            'Are you sure you want to delete contact ' + firstContact.name + ' (' + firstContact.email + ')?'
            : 'Are you sure you want to delete ' + selectedContacts.length + ' contacts ?';
        showPopup({message: message})
            .then(() => {
                console.log('Remove contacts');
                _remove();
            })
            .catch(() => {
                console.log('Cancel removing contacts');
            });
        
    }
}

export default ContactsPage;