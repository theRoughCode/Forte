import { Component } from 'react';

class Media extends Component {
  constructor(props) {
    super(props);

    this.state = {
      song: null,
      playing: false,
      audio: null
    };
  }

  playSong(song) {
    let audio = new Audio(song.preview_url);
    this.setState({ audio });
    audio.play();
  }

  pauseSong() {
    this.state.audio.pause();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      playing: nextProps.playing ,
      song: nextProps.song
    });
    if (nextProps.playing) {
      if (this.state.song && nextProps.song !== this.state.song) this.pauseSong();
      this.playSong(nextProps.song);
    } else if (this.state.audio) this.pauseSong();
  }

  render () {
    return null;
  }
}

export default Media;
