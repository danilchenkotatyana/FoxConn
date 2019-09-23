import React from "react";
import ReactDOM from "react-dom";

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.mounted = false;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidMount() {
        this.mounted = true;

        let {onStop, onPlay} = this.props;
        let video = ReactDOM.findDOMNode(this);
        video.addEventListener("ended", function () {
            if (this.mounted && typeof onStop === 'function')
                onStop();
        }.bind(this));

        video.addEventListener("pause", function () {
            if (this.mounted && typeof onStop === 'function')
                onStop();
        }.bind(this));

        video.addEventListener("playing", function () {
            if (this.mounted && typeof onPlay === 'function')
                onPlay(decodeURI(video.src));
        }.bind(this));

        if (this.props.active)
            video.play();
    }

    componentDidUpdate(prevProps, prevState) {
        let video = ReactDOM.findDOMNode(this);
        if (this.props.active)
            video.play();
        else
            video.pause();
    }

    render() {
        return (
            <video
                src={this.props.url}
                controls
                autoPlay={true}
                playsInline={true}
                ref="video"
            />
        );
    }
}

export default Video;