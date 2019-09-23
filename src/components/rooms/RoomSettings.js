import React, {Component} from 'react';
import Event from '../../model/event-names';
import EventBus from '../../model/events-bus';
import ServerAPI from "../../api/server";
import i18n from '../../localization/i18n';

const MEDIA_PROFILES = ['English', 'French', 'Chinese'];

class RoomSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guest_pin: '',
            host_pin: '',
            language: 'English',
            mediaProfile: undefined,
            showLanguageControl: false,
            showMediaProfileControl: false
        };

        this.onMcuServiceInfo = function (payload) {
            if (this.props.room.alias !== payload.SipAlias)
                return;

            let sttMode = payload.STTMode.toLowerCase();

            this.setState({
                guest_pin: typeof payload.Pin === 'string' ? payload.Pin : undefined,
                host_pin: typeof payload.HostPin === 'string' ? payload.HostPin : undefined,
                language: sttMode === 'disabled' ? undefined : payload.STTLanguage,
                mediaProfile: payload.MediaFilesProfileName
            })
        }.bind(this);

        this.onServiceChanged = function (payload) {
            if (this.props.room.alias !== payload.alias)
                return;

            let sttMode = payload.Service.STTMode ? payload.Service.STTMode.toLowerCase() : 'disabled';

            this.setState({
                guest_pin: typeof payload.Service.Pin === 'string' ? payload.Service.Pin : undefined,
                host_pin: typeof payload.Service.HostPin === 'string' ? payload.Service.HostPin : undefined,
                language: sttMode === 'disabled' ? undefined : payload.Service.STTLanguage,
                mediaProfile: payload.Service.MediaProfileName
            })
        }.bind(this);
    }

    componentDidMount() {
        EventBus.on(Event.MCU_SERVICE_INFO, this.onMcuServiceInfo);
        EventBus.on(Event.CONFERENCING_SERVICE_CHANGED, this.onServiceChanged);
    }

    componentWillUnmount() {
        EventBus.off(Event.MCU_SERVICE_INFO, this.onMcuServiceInfo);
        EventBus.off(Event.CONFERENCING_SERVICE_CHANGED, this.onServiceChanged);
    }

    render() {
        let { connected, updatePin, languages } = this.props;
        let { guest_pin, host_pin, language, mediaProfile } = this.state;

        let curentSTTLanguage = languages.find(lang => lang.key === language);

        return (
            <div className="room-settings">
                <div className="active-participants-title language">{i18n['Language']}
                    <span className="language__title"
                          onClick={() => this.toggleMediaProfileControl()}>
                        {MEDIA_PROFILES.find(profile => profile === mediaProfile) || 'Unknown ('+mediaProfile+')'}
                    </span>
                    <ul className={"language__container dropdown-menu" + (this.state.showMediaProfileControl ? ' active' : '')}>
                        {MEDIA_PROFILES.map(profile =>
                            <li key={profile} className="language__item" onClick={() => this.changeMediaProfile(profile)}>{profile}</li>
                        )}
                    </ul>
                </div>
                <div className="active-participants-title language">{i18n['Translate conversation from']}
                    <span className="language__title"
                        onClick={() => this.toggleLanguageControl()}>
                        {language ?
                            (curentSTTLanguage ? curentSTTLanguage.title : 'Unknown ('+language+')') : 'Disabled'
                        }
                    </span>
                    <ul className={"language__container dropdown-menu" + (this.state.showLanguageControl ? ' active' : '')}>
                        {languages.map(
                            lang =>
                                <li key={lang.key} className="language__item" onClick={() => this.changeLanguage(lang.key)}>{lang.title}</li>
                        )}
                    </ul>
                </div>
                <div className="active-participants-title" onClick={() => {if (connected) updatePin('host')}}>{i18n['Host PIN']}<span>{host_pin}</span>
                    {connected ? <span className="icon-edit"/> : null}
                </div>
                <div className="active-participants-title" onClick={() => {if (connected) updatePin('guest')}}>{i18n['Guest PIN']}<span>{guest_pin}</span>
                    {connected ? <span className="icon-edit"/> : null}
                </div>
            </div>
        );
    }

    toggleLanguageControl () {
        let {language} = this.state;
        if (this.props.connected && language)
            this.setState({ showLanguageControl: !this.state.showLanguageControl })
    }

    changeLanguage (languageKey) {
        if (this.props.connected) {
            ServerAPI.changeSTTLanguage(languageKey);
            this.setState({showLanguageControl: false});
        }
    }

    toggleMediaProfileControl () {
        let {mediaProfile} = this.state;
        if (this.props.connected && mediaProfile)
            this.setState({ showMediaProfileControl: !this.state.showMediaProfileControl })
    }

    changeMediaProfile (profile) {
        if (this.props.connected) {
            ServerAPI.changeMediaProfile(profile);
            this.setState({showMediaProfileControl: false});
        }
    }
}

export default RoomSettings;
