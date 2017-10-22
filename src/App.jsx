import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import queryString from 'query-string';
import 'whatwg-fetch';
import './App.css';
import Header from './Header';
import Search from './Search';
import Player from './Player/Player';
import Recorder from './Recorder';
import Media from './Media';


/*
https://accounts.spotify.com/authorize/?client_id=7999c825615341ee8c791189eca005d5&response_type=token&scope=user-read-currently-playing user-modify-playback-state user-read-playback-state&redirect_uri=http://localhost:3000/
*/

class App extends Component {
  constructor(props) {
    const CLIENT_ID = '7999c825615341ee8c791189eca005d5';
    const CLIENT_SECRET = '1980f09535884b6d97a88d335c107b83';

    super(props);

    const access_token = queryString.parse(window.location.hash).access_token;

    setInterval(() => {
      console.log('this.state.isRecording', this.state.isRecording);
      if (this.state.isRecording) this.pauseRecording();
      else this.startRecording();
    }, 10000);

    this.state = {
      access_token,
      song: null,
      user: null,
      isPlaying: false,
      isRecording: false,
      playRecording: false,
      external: false,
      progress: 0,
      volume: 0,
      blob: null
    }
  }

  sendBlob = (blob) => {
    console.log('sending blob');
    console.log('this.state.blob', blob);
    const TEST = 'http://100.65.207.162:8000/api';
    const URL = 'http://localhost:4000/blob';
    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        blob: blob
      })
    }).then((res) => {
      console.log('res', res);
      return res.text();
    }, err => console.error(err)).then(data => {
      console.log('res', data);
      // this.setState({ volume: parseInt(data) });
      this.startRecording();
    }, err => {
      console.error(err);
    });
  }

  updatePlayback = () => {
    const FETCH_URL = `https://api.spotify.com/v1/me`;

    // Get current song
    fetch(`${FETCH_URL}/player/currently-playing`, {
      mode: "cors",
      headers: {
        'Authorization': `Authorization: Bearer ${this.state.access_token}`
      }
    })
      .then(res => {
        return (res.status === 200) ? res.json() : null;
      })
      .then(data => {
        if (data && data.is_playing) {
          this.setState({
            isPlaying: true,
            song: data.item,
            external: true
          });

          // Get user playback info
          fetch(`${FETCH_URL}/player`, {
            mode: "cors",
            headers: {
              'Authorization': `Authorization: Bearer ${this.state.access_token}`
            }
          })
            .then(res => {
              return (res.status === 200) ? res.json() : null;
            })
            .then(data => {
              if (!data) return;
              this.setState({
                progress: data.progress_ms,
                volume: data.device.volume_percent
              });
              console.log('Retrieved playback info successfully');
            });
        }
      });
  }

  setSong = (song) => {
    this.setState({ song });
  }

  setPlaying = (isPlaying) => {
    if (this.state.external) {
      let opr = (isPlaying) ? 'play' : 'pause';
      fetch(`https://api.spotify.com/v1/me/player/${opr}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Authorization': `Authorization: Bearer ${this.state.access_token}`
        }
      }).then(res => {
        if (res.ok) {
          this.setState({ isPlaying });
        }
      });
    } else {
      this.setState({ isPlaying });
    }
  }

  prevSong = () => {
    console.log('previous song');
    fetch(`https://api.spotify.com/v1/me/player/previous`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Authorization: Bearer ${this.state.access_token}`
      }
    }).then(res => {
      if (!res.ok) {
        console.log('Failed to skip to previous song');
      } else setTimeout(() => this.updatePlayback(), 200);
    });
  }

  nextSong = () => {
    console.log('next song');
    fetch(`https://api.spotify.com/v1/me/player/next`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Authorization: Bearer ${this.state.access_token}`
      }
    }).then(res => {
      if (!res.ok) {
        console.log('Failed to skip to next song');
      } else setTimeout(() => this.updatePlayback(), 200);
    });
  }

  setVolume = (volume) => {
    this.setState({ volume });

    fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Authorization': `Authorization: Bearer ${this.state.access_token}`
      }
    }).then(res => {
      if (!res.ok) {
        console.log('Failed to adjust Spotify volume');
      }
    });
  }

  setBlob = (blob) => {
    console.log('blob', blob);
    this.sendBlob(blob);
  }

  startRecording = () => {
    console.log('Recording started');
    this.setState({
      isRecording: true,
      playRecording: false
    });
  }

  pauseRecording = () => {
    console.log('Recording paused');
    this.setState({
      isRecording: false,
      playRecording: false
    });
  }

  playRecording = () => {
    this.setState({ playRecording: true });
  }

  componentWillMount() {
    const FETCH_URL = `https://api.spotify.com/v1/me`;

    setTimeout(() => this.startRecording(), 1000);

    // Get user info
    fetch(FETCH_URL, {
      mode: "cors",
      headers: {
        'Authorization': `Authorization: Bearer ${this.state.access_token}`
      }
    })
      .then(res => {
        return res.text();
      })
      .then(user => {
        this.setState({ user });
      });

      this.updatePlayback();
  }

  //
  // <Button bsStyle="primary" bsSize="large" onClick={this.startRecording}>record</Button>
  // <Button bsStyle="primary" bsSize="large" onClick={this.pauseRecording}>pause</Button>
  // <Button bsStyle="primary" bsSize="large" onClick={this.playRecording}>play</Button>

  render() {
    return (
      <div className="App">
        <div className="banner">
          <div className="banner-left">
            <Recorder
              record={this.state.isRecording}
              play={this.state.playRecording}
              setBlob={this.setBlob}
            />
          </div>
          <Header
            user={this.state.user}
            />
        </div>
        <div className="Content">
          <div className="App-title">Forte</div>
          <Search
            accessToken={this.state.access_token}
            song={this.state.song}
            playing={this.state.isPlaying}
            setSong={this.setSong}
            setPlaying={isPlaying => {
              this.setState({ external: false });
              this.setPlaying(isPlaying);
            }}
          />
        </div>
        {!this.state.external && (
          <Media
            song={this.state.song}
            playing={this.state.isPlaying}
            />
        )}
        {this.state.song && (
          <Player
            className="Player"
            song={this.state.song}
            progress={this.state.progress}
            volume={this.state.volume}
            playing={this.state.isPlaying}
            setPlaying={this.setPlaying}
            setVolume={this.setVolume}
            prevSong={this.prevSong}
            nextSong={this.nextSong}
            sync={this.updatePlayback}
          />
      )}
    </div>
    )
  }
}

export default App;
