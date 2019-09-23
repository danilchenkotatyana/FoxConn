import React, {Component} from 'react';
import '../../css/main.scss';
import i18n from '../../localization/i18n';

class ManageSubscription extends Component {

    render() {

        return (
            <div className="page manage-subscription">
                <div className="page-title">
                    <h1 className="back-icon">{i18n['Manage Subscription']}</h1>
                </div>
                <div className="plans-container">
                     <div className="plans-item">
                        <div className="plans-item__header">
                            <div className="plans-item__title-name">{i18n['Your plan']} ConX 10</div>
                            <div className="plans-item__title-small">{i18n['Up to 10 users per room']}</div>
                            <div className="plans-item__price">$4.99</div>
                            <div className="plans-item__note">{i18n['Per Month']}*</div>
                            <div className="blue-btn">{i18n['Cancel Subscription']}</div>
                        </div>
                    </div>
                    <div className="plans-item">
                        <div className="plans-item__header">
                            <div className="plans-item__title-name">{i18n['Your plan']} ConX 10</div>
                            <div className="plans-item__title-small">{i18n['Up to 10 users per room']}</div>
                            <div className="plans-item__price">$4.99</div>
                            <div className="plans-item__note">{i18n['Per Month']}*</div>
                            <div className="blue-btn">{i18n['Cancel Subscription']}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
export default ManageSubscription;
