import React, { Component } from 'react';
import './css/main.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import Event from './model/event-names';
import EventBus from './model/events-bus';
import ws from './model/ws-client';
import Login from './components/Login';
import Middleware from './model/middleware';
import Routes from './model/routes';
import Navigation from './components/Navigation';
import RoomsList from './components/rooms/RoomsList';
import RecordsPage from './components/recordings/RecordsPage';
import ContactsPage from './components/contacts/ContactsPage';
import SelectPackage from './components/planspricing/SelectPackage';
import ManageSubscription from './components/planspricing/ManageSubscription';
import PopupNotification from './components/modals/PopupNotification';
import BillingPage from './components/billing/BillingPage';
import RegistrationAccountPage from './components/registration/RegistrationAccountPage';
import Config from "./config";
import PlansPricingPage from "./components/planspricing/PlansPricingPage";
import Loader from "./components/modals/Loader";

const HOST = Config.getHost();

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showSettings: false,
            receivedMessage: null,
            authenticated: false,
            expiredMessage: '',
            routerPath: Routes.PARTICIPANTS,
            userSentCall: false,
            showMessagePopup: false,
            showMessagePayload: null
        };

        this.durationInterval = null;

        EventBus.on(Event.AFTER_LOGGED, function () {
            this.setState({ authenticated: true });
            Middleware.startPing();
        }.bind(this));

        EventBus.on(Event.SESSION_EXPIRED, function (message) {
            this.setState({ authenticated: false, expiredMessage: message });
            clearInterval(this.durationInterval);
            window.location.href = HOST + '/setting/index';
        }.bind(this));

        Middleware.check()
            .then(function () {
                this.setState({ authenticated: true });
                ws.init();
            }.bind(this))
            .catch(() => {});

        EventBus.on(Event.ROUTE, function (message) {
            this.setState({ routerPath: message });
        }.bind(this));
    }

    componentDidMount() {

        EventBus.on(Event.AFTER_LOGGED, function () {
            clearInterval(this.durationInterval);
        }.bind(this));

        EventBus.on(Event.SHOW_SEND_MESSAGE_POPUP, function (payload) {
            this.setState({ showMessagePopup: true, showMessagePayload: payload });
        }.bind(this));

        EventBus.on(Event.CLOSED_SEND_MESSAGE_POPUP, function () {
            this.setState({ showMessagePopup: false });
        }.bind(this));

        // change title according to selected page
        document.title = "ConX - " + Routes.current().getTitle();
    }

    render() {
        let {
            authenticated, activeMeeting
        } = this.state;

        return (
            <div className="global-main ">
                {
                    authenticated ? (
                        <div className="main-page">
                            <Header showSettingsHandler={this.showSettingsHandler.bind(this)} />
                            <div className="content">
                                {!Routes.PLANS.isCurrent() || Routes.REGISTRATION.isCurrent() ? 
                                    <Navigation/> :
                                    null
                                }
                                {Routes.ROOMS.isCurrent() ? <RoomsList/> : null}
                                {Routes.RECORDINGS.isCurrent() ? <RecordsPage/> : null}
                                {Routes.CONTACTS.isCurrent() ? <ContactsPage/> : null}
                                {Routes.PLANS.isCurrent() ? <PlansPricingPage/> : null}
                                {Routes.BILLING.isCurrent() ? <BillingPage/> : null}
                                {Routes.REGISTRATION.isCurrent() ? <RegistrationAccountPage/> : null}
                            </div>
                            <Footer active={activeMeeting} />
                        </div>
                    ) : <Login message={this.state.expiredMessage} />
                }
                <PopupNotification/>
                <Loader/>
            </div>
        );
    }

    showSettingsHandler(visible) {
        this.setState({ showSettings: visible });
    }

}

export default App;
