import React, { Component } from 'react'
import { Glyphicon } from 'react-bootstrap';

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playingUrl: '',
      playing: this.props.playing
    }
  }

  togglePlay(playing) {
    this.setState({ playing });
  }

  playAudio(track) {
    let previewUrl = track.preview_url;

    // pass track to parent
    if (this.state.playingUrl !== previewUrl) {
      this.props.setSong(track);
    }

    if (!this.state.playing) {
      this.props.setPlaying(true);
      this.setState({
        playing: true,
        playingUrl: previewUrl
      });
    } else {
      if (this.state.playingUrl === previewUrl) {
        this.props.setPlaying(false);
        this.setState({
          playing: false,
          playingUrl: null
        });
      } else {
        this.setState({
          playing: true,
          playingUrl: previewUrl
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.playingUrl && this.state.playingUrl.length && nextProps.playing !== this.state.playing) this.togglePlay(nextProps.playing);
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
