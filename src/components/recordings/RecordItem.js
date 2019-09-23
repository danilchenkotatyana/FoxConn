import React, {Component} from 'react';
import RecordingsAPI from '../../api/recordings';
import {formatRecordingsDate} from '../../model/utils';
import {showPopup} from "../modals/PopupNotification";
import i18n from '../../localization/i18n';

class RecordItem extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        let { value, playing, visible, onSelect, selected } = this.props;
        return (
            <div className={"records-list__item" + (playing ? " active" : "") + (visible ? " checkbox": "")}>
                { visible ? 
                    <label className="checkbox-label">
                        <input className="checkbox" type="checkbox" checked={selected} onChange={(e) => onSelect(e.target.checked, value.Key)}/>
                        <span className="checkbox-custom"/>
                    </label>
                    : null
                }
                
                <div className={"records-list__play" + (playing ? "" : " play")} 
                     onClick={() => this.togglePlay()}/>
                <div className="records-list__info">
                    <div className="records-list__name" title={value.Title}>{value.Title}</div>
                    <div className="records-list__time">
                        {/*12 march 2018, 11:34 AM*/}
                        {formatRecordingsDate(value.LastModified)}
                        {/*<div className="records-list__duration">00:12:23</div>*/}
                    </div>
                </div>
                <div className="records-list__download" onClick={() => this.downloadRecord(value)}>
                    {i18n['Download']}
                    <span className="records-list__download-size">
                        {/*(7.6mb)*/}
                        {this.getSizeString(value.Size)}
                    </span>
                </div>
                <div className="records-list__bin" onClick={() => this.deleteRecord(value)}/>
            </div>
        );
    }

    deleteRecord (value) {
        let _remove = function () {
            let { playing, stop, alias } = this.props;
            if (playing) {
                stop('clearContent');
            }
            RecordingsAPI.deleteRecords(alias, [value.Key])
                .then(() => {
                    this.props.updateRecordings();
                })
                .catch(() => {})
        }.bind(this);
        showPopup({message: i18n['Are you sure you want to delete ']+value.Title+i18n[' video?']})
            .then(() => {
                _remove();
            })
            .catch(() => {
            });
    }

    downloadRecord (object) {
        let link = document.createElement('a');
        link.href = object.Url;
        link.download = object.Title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    getSizeString (sizeValue) {
        let $intValue = parseFloat(sizeValue);
        if (isNaN($intValue))
            return 'unknown';

        if ($intValue < 1e3)
            return '' + $intValue + 'b';
        if ($intValue < 1e6)
            return '' + ($intValue / 1e3).toFixed(1) + 'kb';
        if ($intValue < 1e9)
            return '' + ($intValue / 1e6).toFixed(1) + 'mb';
        if ($intValue < 1e12)
            return '' + ($intValue / 1e9).toFixed(1) + 'Gb';
    };

    togglePlay () {
        let {value, play, stop, playing, toggleVideoPlayer} = this.props;
        if (playing) {
            stop();
        } else {
            play(value);
            toggleVideoPlayer(true);
        }

    }
}

export default RecordItem;
