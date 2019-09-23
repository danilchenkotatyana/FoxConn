import React, {Component} from 'react';
import '../../css/main.scss';
import i18n from '../../localization/i18n';
import {loadBilling, changeBilling} from "../../api/billing";
import RestAPI from "../../api/stuff";
import Logger from "../../logger";
import ErrorMessage from "../messages/error";
import NotificationMessage from "../messages/notification";
import {showPopup} from "../modals/PopupNotification";
import {hideLoader, showLoader} from "../modals/Loader";
import Config from "../../config";

const logger = Logger.create('BillingPage');
const HOST = Config.getHost();

class BillingPage extends Component {

    constructor (props) {
        super(props);

        this.state = {
            info: {},
            countries: undefined,
            states: undefined,
            error: undefined,
            notification: undefined
        };
    }

    componentDidMount() {
        this.requestBilling();
    }

    render() {

        let {info, countries, states, error, notification} = this.state;

        info = info ? info : {};

        return (
            <div className="page billing">
                <div className="page-title">
                    <h1>{i18n['Billing']}</h1>
                    <div className="page-title__buttons">
                        <div className="btn-green">{i18n['Add Activation Code']}</div>
                    </div>
                </div>
                <div className="billing-switcher">
                    <div className="billing-switcher__item active">{i18n['Info']}</div>
                    <div className="billing-switcher__item"
                         onClick={() => window.location.href = HOST+"/setting/billingHistory"}>
                        {i18n['Order History']}
                    </div>
                </div>
                <div className="billing-form" ref={'billingForm'}>
                    {notification ?
                        <NotificationMessage text={notification}/> : null
                    }
                    {this.hasFieldError('billing_info.base') || error ?
                        <ErrorMessage text={this.getFieldError('billing_info.base')
                        || (typeof error === 'string' ? error : 'You have some error in form')}/> : null
                    }
                    <div className="form-item">
                        <div className="form-title">{i18n['Cardholders name']}</div>
                        <input className="form-input input-name" type="text" value={this.toString(info.first_name)}
                               onChange={(e)=>this.changeField(e.target.value, 'first_name')}/>
                        <input className="form-input input-surname" type="text" value={this.toString(info.last_name)}
                               onChange={(e)=>this.changeField(e.target.value, 'last_name')}/>
                        {this.hasFieldError('billing_info.first_name') ?
                            <div className="error">{this.getFieldError('billing_info.first_name')}</div>
                            : null
                        }
                    </div>
                    <div className="form-item">
                        <div className="form-title">{i18n['Country']}</div>
                        {countries ?
                            <select className="form-select" onChange={(e) => this.countryChanged(e)}>
                                {countries.map(c =>
                                    <option key={'CN_'+c.code} value={c.code}
                                            selected={info.country === c.code}>{c.name}</option>
                                )}
                            </select>
                            : <input className="form-input input-name" type="text" value={this.toString(info.country)} />
                        }
                        {this.hasFieldError('billing_info.country') ?
                            <div className="error">{this.getFieldError('billing_info.country')}</div>
                            : null
                        }
                    </div>
                    {states ?
                        <div className="form-item">
                            <div className="form-title">{i18n['State']}*</div>
                                <select className="form-select" onChange={(e)=>this.changeField(e.target.value, 'state')}>
                                    {states.map(c =>
                                        <option key={'ST_'+c.code} value={c.code}
                                                selected={info.state === c.code}>{c.name}</option>
                                    )}
                                </select>
                            {this.hasFieldError('billing_info.state') ?
                                <div className="error">{this.getFieldError('billing_info.state')}</div>
                                : null
                            }
                        </div>
                        : null
                    }
                    <div className="form-item">
                        <div className="form-title">{i18n['City']}*</div>
                        <input className="form-input" type="text" value={this.toString(info.city)}
                               onChange={(e)=>this.changeField(e.target.value, 'city')}/>
                        {this.hasFieldError('billing_info.city') ?
                            <div className="error">{this.getFieldError('billing_info.city')}</div>
                            : null
                        }
                    </div>
                    <div className="form-item">
                        <div className="form-title">{i18n['Address']}*</div>
                        <input className="form-input" type="text" value={this.toString(info.address1)}
                               onChange={(e)=>this.changeField(e.target.value, 'address1')}/>
                        {this.hasFieldError('billing_info.address1') ?
                            <div className="error">{this.getFieldError('billing_info.address1')}</div>
                            : null
                        }
                    </div>
                    <div className="form-item">
                        <div className="form-title">{i18n['Address']} 2*</div>
                        <input className="form-input" type="text" value={this.toString(info.address2)}
                               onChange={(e)=>this.changeField(e.target.value, 'address2')}/>
                        {this.hasFieldError('billing_info.address2') ?
                            <div className="error">{this.getFieldError('billing_info.address2')}</div>
                            : null
                        }
                    </div>
                    <div className="form-item">
                        <div className="form-title">{i18n['Zip Code']}</div>
                        <input className="form-input" type="text" value={this.toString(info.zip)}
                               onChange={(e)=>this.changeField(e.target.value, 'zip')}/>
                        {this.hasFieldError('billing_info.zip') ?
                            <div className="error">{this.getFieldError('billing_info.zip')}</div>
                            : null
                        }
                    </div>
                    <div className="form-item">
                        <div className="form-title">{i18n['Card Number']}</div>
                        <input className="form-input" type="text"
                               value={this.buildCardNumber(info)}
                               placeholder={this.buildCardNumberPH(info)}
                               onChange={(e)=>this.changeField(e.target.value, 'card_number')}/>
                        {this.hasFieldError('billing_info.number') ?
                            <div className="error">{this.getFieldError('billing_info.number')}</div>
                            : null
                        }
                    </div>
                    <div className="form-item">
                        <div className="form-title">{i18n['Expiration']}</div>
                        <input className="form-input" type="text" value={this.buildCardExpire(info)} placeholder={this.buildCardExpirePH(info)}
                               onChange={(e)=>this.changeField(e.target.value, 'card_expires')}/>
                        {this.hasFieldError('billing_info.month') ?
                            <div className="error">Month {this.getFieldError('billing_info.month')}</div>
                            : null
                        }
                        {this.hasFieldError('billing_info.year') ?
                            <div className="error">Year {this.getFieldError('billing_info.year')}</div>
                            : null
                        }
                        {this.hasFieldError('billing_info.card_expires') ?
                            <div className="error">Date {this.getFieldError('billing_info.card_expires')}</div>
                            : null
                        }
                    </div>
                    <div className="form-item">
                        <div className="form-title">CVV</div>
                        <input className="form-input" type="text" value={this.toString(info.verification_value)}
                               onChange={(e)=>this.changeField(e.target.value, 'verification_value')}/>
                        {this.hasFieldError('billing_info.verification_value') ||
                        this.hasFieldError('billing_info.billing_info.credit_card_verification_value') ?
                            <div className="error">{
                                this.getFieldError('billing_info.verification_value')
                                || this.getFieldError('billing_info.billing_info.credit_card_verification_value')
                            }</div>
                            : null
                        }
                    </div>
                    <div className="bottom-btn">
                        <div className="btn-green" onClick={()=>this.saveBillingInfo()}>{i18n['Save Changes']}</div>
                    </div>
                </div>
            </div>
        );
    }

    toString (v) {
        return typeof v === 'string' ? v : '';
    }

    buildCardNumber (info) {
        if (info.card_number)
            return info.card_number;
        return '';
    }

    buildCardNumberPH (info) {
        if (info.first_six && typeof info.first_six === 'string') {
            return info.first_six.substr(0, 4)
                + '-'
                + info.first_six.substr(4, 2)
                + 'XX-XXXX-'
                + info.last_four;
        }
    }

    buildCardExpire (info) {
        if (info.card_expires)
            return info.card_expires;
        return '';
    }

    buildCardExpirePH (info) {
        if (!info.month || !info.year)
            return 'MM / YYYY';

        function zeros(v) {
            v = '0'+v;
            return v.substr(v.length-2);
        }

        return zeros(info.month) + ' / ' + info.year;
    }

    requestBilling () {
        loadBilling((err, json) => {
            if (err) {
                console.error(err);
                this.setState({info: {}});
            } else {
                console.log(json);
                this.setState({info: json});
            }

            this.requestCountries();
        })
    }

    requestCountries() {
        RestAPI.requestCountries((err, json) => {
            if (err) {
                this.setState({countries: undefined});
                return logger.error('Load countries:', err);
            }
            json.unshift({code: '', name: i18n['Choose country']});
            this.setState({countries: json});
            this.requestStates();
        });
    }

    requestStates() {
        let {info} = this.state;
        RestAPI.requestStates(info.country, (err, json) => {
            if (err) {
                this.setState({states: undefined});
                return logger.error('Load states:', err);
            }
            json.unshift({code: '', name: i18n['Choose state']});
            this.setState({states: json});
        });
    }

    countryChanged (e) {
        let {info} = this.state;
        info.country = e.target.value;
        this.setState({info: info});
        this.requestStates(info.country);
    }

    changeField (v, fieldName) {
        let {info} = this.state;
        info[fieldName] = v;
        this.setState({info: info});
    }

    hasFieldError (fieldName) {
        let {error} = this.state;
        if (error) {
            if (Array.isArray(error)) {
                return error.find((f) => f.field === fieldName);
            } else {
                return fieldName === error.field;
            }
        }
    }

    getFieldError (fieldName) {
        let {error} = this.state;
        if (error) {
            if (Array.isArray(error)) {
                let field = error.find((f) => f.field === fieldName);
                if (field)
                    return field['$t'];
            } else {
                if (fieldName === error.field)
                    return error['$t'];
            }
        }
    }

    clearAlerts () {
        this.setState({error: undefined, notification: undefined});
    }

    saveBillingInfo () {
        let {info} = this.state;

        if (info.card_expires) {
            let values = info.card_expires.split('/');
            info.month = values[0];
            info.year = values[1];
        }

        this.clearAlerts();

        showLoader();

        changeBilling(info, (err, info) => {
            this.refs.billingForm.scrollIntoView();

            hideLoader();

            if (err) {
                if (err.code === 'ESOCKETTIMEDOUT') {
                    return showPopup({
                        message: err.message,
                        showCancelButton: false
                    }).then(console.log).catch(console.log);
                }
                this.setState({error: err.error || err.message});
                return logger.error('Save billing:', err);
            }

            this.setState({error: undefined, info: info,
                notification: i18n['Billing information has been updated successfully']});
        });
    }
}
export default BillingPage;
