import React, {Component} from 'react';
import '../../css/main.scss';
import axios from 'axios';
import i18n from '../../localization/i18n';
import MainConfig from '../../config';

class ImportContactsDropdown extends Component {

    render() {
        return (
            <ul className={"dropdown-menu import-contacts__dropdown active"}>
                <li className="import-contacts__item icon-google"
                    onClick={() => this.queryGoogleApp()}>
                    Google
                </li>
                {
                    /*<li className="import-contacts__item icon-infocus">InFocus</li>*/
                }
                <li className="import-contacts__item icon-outlook"
                    onClick={() => this.queryMicrosoftApp()}>
                    Outlook
                </li>
                <li className="import-contacts__item icon-import"
                    onClick={() => this.refs.contactsFileRef.click()}>
                    {i18n['Import CSV']}
                </li>
                <li className="import-contacts__item icon-download"
                    onClick={() => {
                        this.props.hideDropdown();
                        window.location.href=MainConfig.steal_path + '/api/contacts/csv'
                    }}>
                    {i18n['Download CSV']}
                </li>
                <input style={{display: 'none'}}
                    name="contacts" accept=".csv" type="file" ref="contactsFileRef"
                    className="hidden-input" onChange={(e) => this.uploadContactsCSV(e)}/>
            </ul>
        );
    }

    uploadContactsCSV(event) {
        let updateContacts = this.props.contactsAreUploaded;
        this.props.hideDropdown();

        let selectedFile = event.target.files[0];

        if (!selectedFile)
            return;

        const data = new FormData();
        data.append('contacts', selectedFile, selectedFile.name);

        axios.post(MainConfig.steal_path + '/api/contacts/csv', data,
            {
                onUploadProgress: ProgressEvent => {
                    if (!!this && typeof this.setState === 'function') {
                        this.setState({
                            loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
                        });
                    }
                }
            })
            .then(res => {
                updateContacts(res);
            });

    }

    getHost() {
        let host = window.location.host;
        if (host === '127.0.0.1' || host.indexOf('localhost') >= 0) {
            return MainConfig.app_redirect_host;
        }

        return host;
    }

    getRedirectUri (vendor) {
        let base = window.location.protocol + '//' + this.getHost() + MainConfig.steal_path;
        return base + '/api/contacts/' + vendor + '/import';
    }

    queryGoogleApp () {
        this.props.hideDropdown();

        let redirect_uri = this.getRedirectUri('google');
        let clientId = '883832227810-1cbfhse9n3i0mds9i7p3s75vdv37dc2r.apps.googleusercontent.com';
        let action = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + clientId +
            '&redirect_uri=' + redirect_uri +
            '&access_type=offline' +
            '&scope=https://www.googleapis.com/auth/contacts.readonly' +
            '&response_type=code';

        window.open(action, "_blank",
            'status=0,toolbar=0,location=0,menubar=0,width=800,height=400' +
            ',top='+((window.screen.height-400)/2) +
            ',left='+((window.screen.width-800)/2));
    }

    queryMicrosoftApp () {
        this.props.hideDropdown();

        let redirect_uri = this.getRedirectUri('microsoft');
        let clientId = 'ca9ff6ad-0f5f-4f95-8caa-f9f72da2300f';
        let action = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=' + clientId +
            '&redirect_uri=' + redirect_uri +
//            '&scope=openid+profile+offline_access User.Read Contacts.Read' +
            '&scope=openid+offline_access+User.Read+Contacts.Read' +
            '&response_type=code';

        window.open(action, "_blank",
            'status=0,toolbar=0,location=0,menubar=0,width=800,height=400' +
            ',top='+((window.screen.height-400)/2) +
            ',left='+((window.screen.width-800)/2));
    }
}
export default ImportContactsDropdown;
