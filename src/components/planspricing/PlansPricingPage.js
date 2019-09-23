import React, {Component} from 'react';
import '../../css/main.scss';
import SelectPackage from '../../components/planspricing/SelectPackage';
import PlansPricingActivationCode from '../../components/planspricing/PlansPricingActivationCode';
import SelectedSubscription from "./SelectedSubscription";
import Logger from '../../logger';

const logger = Logger.create('PlansPricingPage')

const MasterStages = {
    'SelectPackage': 'SelectPackage',
    'SelectSubscription': 'SelectSubscription',
    'ManageSubscription': 'ManageSubscription',
    'ActivationCode': 'ActivationCode'
};

class PlansPricingPage extends Component {

    constructor (props) {
        super(props);

        this.state = {
            masterStage: MasterStages.SelectPackage,
            stageCtx: {}
        }
    }

    render() {

        let {masterStage, stageCtx} = this.state;

        return (
            <div className="plans-pricing">
                {masterStage === MasterStages.SelectPackage ?
                    <SelectPackage
                        signUp={
                            (_package, country) => this.showStage(MasterStages.SelectSubscription,
                                {package: _package, country: country})
                        }/> : null
                }
                {masterStage === MasterStages.SelectSubscription ?
                    <SelectedSubscription ctx={stageCtx}
                                          back={() => this.showStage(MasterStages.SelectPackage)}
                    /> : null
                }
                {masterStage === MasterStages.ActivationCode ? <PlansPricingActivationCode/> : null}
            </div>
        );
    }

    showStage (stage, ctx) {
        logger.log('Stage ', stage, ' requested with ctx=', ctx);
        this.setState({
            masterStage: stage,
            stageCtx: ctx
        });
    }
}
export default PlansPricingPage;
