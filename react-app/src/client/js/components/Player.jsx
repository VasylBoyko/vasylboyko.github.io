import React, {Component} from 'react';
import VideoFrame from './VideoFrame';
import PlayList from './PlayList';
//import PropTypes from 'prop-types';

export default class Player extends Component {
    constructor(props) {
        super(props);
        this.currentYtId = "";
        this.listItems = [];
    }
    onListItemChanged() {}
    render() {
        return (
            <div class="player">
                <VideoFrame src={this.currentYtId}></VideoFrame>
                <PlayList
                    listItems={this.listItems}
                    onItemSelected={this.onListItemChanged.bind(this)}
                    selectedItem={this.selectedItem}></PlayList>
                <div class="videoDescription">{this.selectedItem}</div>
            </div>
        );
    }
}
/*
Player.propTypes = {
  isMobile: PropTypes.bool.isRequired
};
*/