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
https://accounts.spotify.com/authorize/?client_id=7999c825615341ee8c791189eca005d5&response_type=token&scope=user-read-currently-playing user-modify-playback-state&redirect_uri=http://localhost:3000/
*/

class App extends Component {
  constructor(props) {
    const CLIENT_ID = '7999c825615341ee8c791189eca005d5';
    const CLIENT_SECRET = '1980f09535884b6d97a88d335c107b83';

    super(props);

    const FETCH_URL = `https://api.spotify.com/v1/me`;
    const access_token = queryString.parse(window.location.hash).access_token;

    var ws = new WebSocket('uri');
    ws.onopen(function(evt){
      console.log('Connected to websocket');
      ws.send("sample rate:" + sampleRate);
    })

    this.state = {
      access_token,
      song: null,
      user: null,
      isPlaying: false,
      isRecording: false,
      playRecording: false,
      external: false
    }

    fetch(FETCH_URL, {
      mode: "cors",
      headers: {
        'Authorization': `Authorization: Bearer ${access_token}`
      }
    })
      .then(res => {
        return res.json();
      })
      .then(user => {
        this.setState({ user });
      });

      fetch(`${FETCH_URL}/player/currently-playing`, {
        mode: "cors",
        headers: {
          'Authorization': `Authorization: Bearer ${access_token}`
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
          }
        });
  }

  setSong = (song) => {
    this.setState({ song });
  }

  setPlaying = (isPlaying) => {
    console.log('this.state.external', this.state.external);
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

  startRecording = () => {
    this.setState({
      isRecording: true,
      playRecording: false
    });
  }

  pauseRecording = () => {
    this.setState({
      isRecording: false,
      playRecording: false
    });
  }

  playRecording = () => {
    this.setState({
      playRecording: true
    })
  }

  var oReq = new XMLHttpRequest();
  oReq.responseType = 'text'
  oReq.open("POST", url, true);
  oReq.onload = function () {
    console.log(oReq.reponse);
};
  oReq.send(blob);


  render() {
    return (
      <div className="App">
        <div className="banner">
          <div className="banner-left">
            <Recorder
              record={this.state.isRecording}
              play={this.state.playRecording}
            />
          </div>
          <Header
            user={this.state.user}
            />
        </div>
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={() => this.startRecording()}
          active
          >Start</Button>
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={() => this.pauseRecording()}
          active
          >Stop</Button>
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={() => this.playRecording()}
          active
          >Play</Button>
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
            playing={this.state.isPlaying}
            setPlaying={this.setPlaying}
          />
      )}
    </div>
    )
  }
}

export default App;
