import React, {Component} from 'react';

const Events = {
    SHOW_LOADER: 'SHOW_LOADER',
    HIDE_LOADER: 'HIDE_LOADER'
};

class Loader extends Component {

    constructor (props) {
        super(props);

        this.state = {
            visible: false
        };

        this.onShowNotification = function () {
            this.setState({visible: true});
        }.bind(this);

        this.onHideNotification = function () {
            this.setState({visible: false});
        }.bind(this);
    }

    componentDidMount() {
        window.addEventListener(Events.SHOW_LOADER, this.onShowNotification);
        window.addEventListener(Events.HIDE_LOADER, this.onHideNotification);
    }

    componentWillUnmount() {
        window.removeEventListener(Events.SHOW_LOADER, this.onShowNotification);
        window.removeEventListener(Events.HIDE_LOADER, this.onHideNotification);
    }

    render() {
        if (this.state.visible) {
            return (
                <div>
                    <div className="loader-container">
                        <div className="loader"/>
                    </div>
                </div>
            );
        } else {
            return (<div/>);
        }
    }

}

export function showLoader () {
    window.dispatchEvent(new CustomEvent(Events.SHOW_LOADER));
}

export function hideLoader () {
    window.dispatchEvent(new CustomEvent(Events.HIDE_LOADER));
}

export default Loader;
