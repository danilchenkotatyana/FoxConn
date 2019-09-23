import React, {Component} from 'react';
import ParticipantItem from "./ParticipantItem";
import i18n from '../../../localization/i18n';

class Participants extends Component {

    constructor(props) {
        super(props);

        this.state = {
            participants: props.participants
        };
    }

    render() {
        let {alias, participants} = this.props;

        return (
            <div className="participants">
                {(participants && participants.length > 0) ? participants.map(participant =>
                    <ParticipantItem roomAlias={alias} key={participant.Id}
                        participant={participant}
                    />
                ) : <div className="connecting">{i18n['Awaiting for participants...']}</div>}
            </div>
        );
    }
}

export default Participants;
