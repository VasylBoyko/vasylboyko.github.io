import React, { Component } from 'react';
import VideoFrame from './VideoFrame';
import PlayList from './PlayList';
//import PropTypes from 'prop-types';

export default class Player extends Component {
    constructor (props) {
		super(props);
		this.currentYtId = "";
		this.listItems = [
			"_D1JGNidMr4",
			"qh3dYM6Keuw",
			"1iAG6h9ff5s",
		];
	}
  render() {
//    const { isMobile } = this.props;

    return (
      <div className="player">
        <VideoFrame src={this.currentYtId}></VideoFrame>
		<PlayList listItems={this.listItems} selectedItem={this.selectedItem}></PlayList>
		<div>{this.selectedItem}</div>
      </div>
    );
  }
}
/*
Player.propTypes = {
  isMobile: PropTypes.bool.isRequired
}; 
*/
