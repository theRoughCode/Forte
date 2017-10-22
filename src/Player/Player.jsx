import React, { Component } from 'react';
import Song from './Song';
import Controls from './Controls';
import Volume from './Volume';

class Player extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    let song = this.props.song;

    return (
      <div className="Player">
        <Song
          img={song && song.album.images[0].url}
          name={song && song.name}
          artist={song && song.artists[0].name}
          />
        <Controls
          isPlaying={this.props.isPlaying}
          />
        <Volume />
      </div>
    )
  }
}

export default Player;
