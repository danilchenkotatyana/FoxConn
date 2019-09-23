import React, {Component} from 'react';
import '../../css/main.scss';
import i18n from '../../localization/i18n';
import RestAPI from '../../api/stuff';
import Logger from '../../logger'
import Config from "../../config";
import Utils from './utils';

const logger = Logger.create('SelectPackage');

class SelectPackage extends Component {

    constructor (props) {
        super(props);

        this.state = {
            countryCode: 'US',
            country: undefined,
            countries: [],
            packages: []
        }
    }

    componentDidMount() {
        this.requestCountries()
            .then(() => this.requestPackages(this.state.countryCode));
    }

    requestPackages(countryCode) {
        RestAPI.requestPaidPackages(countryCode, (err, json) => {
            logger.debug('loaded packages: ', json);
            this.setState({packages: json});
        });
    }

    requestCountries() {
        let {countryCode} = this.state;

        return new Promise ((resolve) => {
            try {
                RestAPI.requestCountries((err, json) => {
                    logger.debug('loaded countries: ', json);
                    let country = this.findCountry(countryCode, json);
                    this.setState({country: country, countries: json});
                    resolve();
                });
            } catch (e) {
                logger.error(e);
                resolve();
            }
        });
    }

    findCountry (code, _countries) {
        let countries = _countries || this.state.countries;
        return Array.isArray(countries) ? countries.find(c => c.code === code) : undefined;
    }

    render() {

        let {country, countries, packages} = this.state;

        return (
            <div className="plans-pricing">
                <div className="page">
                    <div className="page-title">
                        <h1>{i18n['Plans and Pricing']}</h1>
                    </div>
                    <div className="plans-container">
                        <div className="plans-panel">
                            <div className="plans-panel__title">{i18n['Choose Your Country:']}</div>
                            <select className="plans-panel__select" onChange={(e) => this.countryChanged(e)}>
                                {countries.map(c =>
                                    <option key={c.code} value={c.code} selected={country.code === c.code}>{c.name}</option>
                                )}

                            </select>
                            <div className="plans-panel__list">
                                <div className="plans-panel__list-item">{i18n['Number of Rooms']}</div>
                                <div className="plans-panel__list-item">{i18n['Number of Participants']}</div>
                                <div className="plans-panel__list-item">{i18n['Personal room number']}</div>
                                <div className="plans-panel__list-item">{i18n['Unlimited meetings']}</div>
                                <div className="plans-panel__list-item">{i18n['Video conferencing']}</div>
                                <div className="plans-panel__list-item">{i18n['Web audio']}</div>
                                <div className="plans-panel__list-item">{i18n['Dial in numbers']}</div>
                                <div className="plans-panel__list-item">{i18n['Desktop and application sharing']}</div>
                                <div className="plans-panel__list-item">{i18n['Meeting manager']}</div>
                                <div className="plans-panel__list-item">{i18n['H.323/SIP room system connector']}</div>
                                <div className="plans-panel__list-item">{i18n['Skype for Business (Lync) interoperability']}</div>
                                <div className="plans-panel__list-item">{i18n['Mobile and Desktop application']}</div>
                                <div className="plans-panel__list-item">{i18n['Email and Phone support']}</div>
                            </div>
                        </div>
                        {packages ? packages.map(p =>
                            <div className="plans-item">
                                <div className="plans-item__header">
                                    <div className="plans-item__title-name">{p.title}</div>
                                    <div className="plans-item__title-small">{p.subtitle}</div>
                                    <div className="plans-item__price">{Utils.currency(p.currency)}{p.monthly_price}</div>
                                    <div className="plans-item__note" dangerouslySetInnerHTML={{__html: p.price_subtitle}}/>
                                    <div className="btn-green"
                                         onClick={() => p.monthly_price ? this.selectPlan(p) : this.contactUs()}>
                                        {p.monthly_price ? i18n['Sing up'] : i18n['Contact Us']}</div>
                                </div>
                                <div className="plans-item__options">
                                    <div className="plans-item__value">{p.corporate ? '10-100' : '1'}</div>
                                    <div className="plans-item__value">{p.room_size}</div>
                                    <div className="plans-item__value blue-tick"></div>
                                    <div className="plans-item__value blue-tick"></div>
                                    <div className="plans-item__value blue-tick"></div>
                                    <div className="plans-item__value blue-tick"></div>
                                    <div className="plans-item__value blue-tick"></div>
                                    <div className="plans-item__value blue-tick"></div>
                                    <div className="plans-item__value blue-tick"></div>
                                    <div className="plans-item__value blue-tick"></div>
                                    <div className="plans-item__value blue-tick"></div>
                                    <div className="plans-item__value blue-tick"></div>
                                    <div className="plans-item__value blue-tick"></div>
                                </div>
                            </div>
                        ) : <div>No packages found</div>}
                    </div>
                    {country && country.continentCode !== 'EU' ?
                        <div className="plans-bottom-note">{i18n['Normally']} $8.29 {i18n['*Annual Plan']}</div>
                        : null
                    }
                </div>
            </div>
        );
    }

    countryChanged (e) {
        let countryCode = e.target.value;
        this.setState({countryCode: countryCode, country: this.findCountry(countryCode)});
        this.requestPackages(countryCode);
    }

    selectPlan (_package) {
        let {signUp} = this.props;
        let {country} = this.state;
        signUp(_package, country);
    }

    contactUs () {
        window.location.href = Config.getHost()+'/user/requestForm';
    }
}
export default SelectPackage;
