import React, {Component} from 'react';
import '../../css/main.scss';

class ErrorMessage extends Component {

    render() {

        let {text} = this.props;

        return (
            <div className="error-message">{text}</div>
        );
    }
}
export default ErrorMessage;
