import React, {Component} from 'react';
import '../../css/main.scss';
import i18n, {i18n_format} from '../../localization/i18n';
import Utils from './utils';
import {purchaseRoom} from "../../api/purchase";
import Routes from "../../model/routes";
import {showPopup} from "../modals/PopupNotification";
import {hideLoader, showLoader} from "../modals/Loader";

const PERIOD = {
    'monthly': {title: 'Monthly', value: 'm'},
    'yearly': {title: 'Annualy', value: 'y'}
};

const DEFAULT_LANGUAGE_PACK = "English";
const DEFAULT_LANGUAGE_PACK_KEY = "Default Media Profile";
const Languages = [
    {title: DEFAULT_LANGUAGE_PACK,  key: DEFAULT_LANGUAGE_PACK_KEY},
    {title: "French",               key: "French"},
    {title: "Chinese",              key: "Chinese"}
];

class SelectedSubscription extends Component {

    constructor (props) {
        super(props);

        this.state = {
            period: PERIOD.monthly,
            agreeWithTerms: true,
            language: DEFAULT_LANGUAGE_PACK_KEY
        };
    }

    render() {

        let {ctx, back} = this.props;
        let {period, agreeWithTerms, language} = this.state;

        return (
            <div className="page selected-subscription">
                <div className="page-title">
                    <h1>{i18n_format('You have selected the {1} with {2} billing', ctx.package.title, period.title)}</h1>
                </div>
                <div className="plans-container">
                    {ctx.package.monthly_price ?
                        <div className={"plans-item " + (period === PERIOD.monthly ? 'active' : '')}
                             onClick={() => this.setState({period: PERIOD.monthly})}>
                            <div className="plans-item__header">
                                <div className="plans-item__title-small">{i18n['Monthly']}</div>
                                <div className="plans-item__price">{Utils.currency(ctx.package.currency)}{ctx.package.monthly_price}</div>
                                <div className="plans-item__note">{i18n['Month (12 equal payment)']}</div>
                            </div>
                        </div>
                        : null
                    }
                    {ctx.package.yearly_price ?
                        <div className={"plans-item " + (period === PERIOD.yearly ? 'active' : '')}
                             onClick={() => this.setState({period: PERIOD.yearly})}>
                            <div className="plans-item__header">
                                <div className="plans-item__title-small">{i18n['Annualy']}</div>
                                <div className="plans-item__price">{Utils.currency(ctx.package.currency)}{ctx.package.yearly_price}</div>
                                <div className="plans-item__note">{i18n['Year (1 payment with 15)']}</div>
                            </div>
                        </div>
                        : null
                    }
                </div>
                <div className="total-mount">{i18n['Total Due Today']}:&nbsp;
                    {Utils.currency(ctx.package.currency)}{period === PERIOD.monthly ? ctx.package.monthly_price : ctx.package.yearly_price}
                </div>

                <div className="selected-subscription__title">{i18n['Choose language pack']}:</div>
                <select className="selected-subscription__select" onChange={(e) => this.languageChanged(e)}>
                    {Languages.map(c =>
                        <option key={c.key} value={c.key} selected={language === c.key}>{c.title}</option>
                    )}
                </select>

                <label className="checkbox-label">
                    <input type="checkbox" className="checkbox" defaultChecked={agreeWithTerms}
                           onChange={(e) => this.setState({agreeWithTerms: e.target.checked})}/>
                    <span className="checkbox-custom"></span>
                    <span>
                        {i18n['I agree to the']}&nbsp;
                        <a target={'_blank'} href={'/site/privacy-policy'}>{i18n['Terms & Condition']}</a>&nbsp;
                        {i18n['and the']}&nbsp;
                        <a target={'_blank'} href={'/site/terms-of-use'}>{i18n['Privacy Policy']}</a>
                    </span>
                </label>
                <div className="buttom-buttons">
                    <div className="btn-white" onClick={() => back()}>{i18n['Back']}</div>
                    <div className={"blue-btn"+(agreeWithTerms ? '' : ' inactive')}
                         onClick={() => this.purchasePackage()}>{i18n['Purchase']}</div>
                </div>
            </div>
        );
    }

    purchasePackage () {
        let {ctx} = this.props;
        let {period, language} = this.state;

        showLoader();

        purchaseRoom({
            packageId: ctx.package.package_attribute_id,
            period: period.value,
            profileName: language,
            callback: (err, body) => {

                hideLoader();

                if (err) {
                    if (err.code === 'BILLING_REQUIRED') {
                        showPopup({
                            message: err.message,
                            transactionID: err.transactionID,
                            showCancelButton: true,
                            okTitle: i18n['Edit'],
                            cancelTitle: i18n['Cancel']
                        })
                            .then(() => {
                                window.location.href = Routes.BILLING.getFullNodeUrl();
                            })
                            .catch(console.log);
                    } else {
                        showPopup({
                            message: err.message,
                            transactionID: err.transactionID,
                            showCancelButton: false
                        }).then(console.log).catch(console.log);
                    }
                    return;
                }

                showPopup({
                    message: i18n_format('Room {1} purchased', body.alias),
                    showCancelButton: true,
                    okTitle: i18n['Go to room'],
                    cancelTitle: i18n['Close']
                }).then(() => {
                    window.location.href = Routes.ROOMS.getNavigatedUrl() + '/' + body.alias;
                }).catch(console.log);
            }
        });
    }

    languageChanged (e) {
        this.setState({language: e.target.value});
    }

}

export default SelectedSubscription;
