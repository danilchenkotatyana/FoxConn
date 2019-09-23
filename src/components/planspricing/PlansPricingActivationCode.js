import React, {Component} from 'react';
import '../../css/main.scss';
import i18n from '../../localization/i18n';

class PlansPricingActivationCode extends Component {

    render() {

        return (
                <div className="page activation-code">
                    <div className="activation-code__title">{i18n['I have an Activation Code']}</div>
                    <input type="text" className="activation-code__input" placeholder={i18n['Activation Code']} />
                    <div className="btn-green">{i18n['Next']}</div>
                </div>
        );
    }

}
export default PlansPricingActivationCode;
