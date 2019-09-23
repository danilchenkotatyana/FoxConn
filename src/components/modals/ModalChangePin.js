import React, {Component} from 'react';
import ServerAPI from "../../api/server";
import i18n from '../../localization/i18n';
 
class ModalChangePin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            canSave: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let v = event.target.value;
        if (v.length > 4)
            return;

        this.setState({value: v, canSave: /^[0123456789]{4}$/g.test(v)});
    }

    componentDidMount() {
        this.refs.pinValue.focus();
    }

    render() {
        let { type, onCancel } = this.props;
        let { canSave } = this.state;

        return (
            <div className="modal modal__change-pin">
                <div className="modal__container">
                    <div className="modal__title">{i18n['Edit']+' '+(type === 'guest' ? i18n['Guest'] : i18n['Host'])+' '+i18n['Pin']}</div>
                    <div className="modal__line-content">
                        <input ref="pinValue" type="text" className="modal__input" name={type === 'guest' ? "conf_pin" : "conf_pin"} value={this.state.value} onChange={this.handleChange} />
                        <div className="modal__buttons">
                            <div className={"blue-btn" + (canSave ? '' : ' inactive')} onClick={() => this.savePin()}>{i18n['Save']}</div>
                            <div className="white-btn" onClick={onCancel}>{i18n['Cancel']}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    savePin () {
        let { type, onOk} = this.props;
        ServerAPI.changePin(type, this.refs.pinValue.value);
        onOk();
    }
}

export default ModalChangePin;
