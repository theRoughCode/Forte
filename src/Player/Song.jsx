import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';

class Song extends Component {
  render () {
    return (
      <div className="Song">
        <img
          alt=" "
          id="song-img"
          src={this.props.img}
        />
        <div id="song-info">
          <div>{this.props.name}</div>
          <div id="song-artist">{this.props.artist}</div>
        </div>
        <div id="sync" onClick={this.props.sync}>
          <Glyphicon glyph="refresh"></Glyphicon>
        </div>
      </div>
    )
  }
}

export default Song;
