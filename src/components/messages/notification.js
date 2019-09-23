import React, {Component} from 'react';
import '../../css/main.scss';

class NotificationMessage extends Component {

    render() {

        let {text} = this.props;

        return (
            <div className="exception-message">{text}</div>
        );
    }
}
export default NotificationMessage;
