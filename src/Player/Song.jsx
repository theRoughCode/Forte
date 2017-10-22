import React, { Component } from 'react';

class Song extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="Song">
        <img
          id="song-img"
          src={this.props.img}
        />
      <div id="song-info">
          <div>{this.props.name}</div>
          <div id="song-artist">{this.props.artist}</div>
        </div>
      </div>
    )
  }
}

export default Song;
