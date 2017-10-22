import React, { Component } from 'react'
import { Glyphicon } from 'react-bootstrap';

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playingUrl: '',
      audio: null,
      playing: this.props.playing
    }
  }

  togglePlay(play) {
    if (play) this.state.audio.play();
    else this.state.audio.pause();

    this.props.setPlaying(play);
    this.setState({ playing: play });
  }

  playAudio(track) {
    let previewUrl = track.preview_url;
    let audio = new Audio(previewUrl);

    // pass track to parent
    if (this.state.playingUrl !== previewUrl) {
      this.props.setSong(track);
    }

    if (!this.state.playing) {
      audio.play();
      this.props.setPlaying(true);
      this.setState({
        playing: true,
        playingUrl:previewUrl,
        audio
      })
    } else {
      if (this.state.playingUrl === previewUrl) {
        this.state.audio.pause();
        this.props.setPlaying(false);
        this.setState({
          playing: false,
          playingUrl: null
        });
      } else {
        if(this.state.audio) this.state.audio.pause();
        audio.play();
        this.setState({
          playing: true,
          playingUrl: previewUrl,
          audio
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.audio && nextProps.playing !== this.state.playing) this.togglePlay(nextProps.playing);
  }

  render () {
    const { tracks } = this.props;
    return (
      <div>
        {tracks && tracks.map((track, index) => {
          const trackImg = track.album.images[0].url;
          return (
            <div
              key={index}
              className="track"
              onClick={() => this.playAudio(track)}
            >
            <img
              src={trackImg}
              className="track-img"
              alt="track"
            />
            <div className="track-play">
              <div className="track-play-inner">
                {
                  (this.state.playingUrl === track.preview_url)
                    ? <Glyphicon glyph="pause"></Glyphicon>
                    : <Glyphicon glyph="play"></Glyphicon>
                }
              </div>
            </div>
            <p className="track-text">
              {track.name}
            </p>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Gallery;
