import React, { Component } from 'react';
import Song from './Song';
import Controls from './Controls';
import Volume from './Volume';

class Player extends Component {
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
          playing={this.props.playing}
          setPlaying={this.props.setPlaying}
          />
        <Volume />
      </div>
    )
  }
}

export default Player;
