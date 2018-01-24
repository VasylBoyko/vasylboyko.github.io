import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Player from './Player';

export default class App extends Component {
  render() {
    const { isMobile } = this.props;

    return (
      <div>
        <h1>Player {isMobile ? 'mobile' : 'desktop'}</h1>
        <Player></Player>
      </div>
    );
  }
}

App.propTypes = {
  isMobile: PropTypes.bool.isRequired
};