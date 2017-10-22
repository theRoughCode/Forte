import React, { Component } from 'react';
import queryString from 'query-string';
import 'whatwg-fetch';
import './App.css';
import Header from './Header';
import Search from './Search';
import Player from './Player/Player';


/*
https://accounts.spotify.com/authorize/?client_id=7999c825615341ee8c791189eca005d5&response_type=token&redirect_uri=http://localhost:3000/
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
      isPlaying: false
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
  }

  setSong = (song) => {
    this.setState({ song });
    console.log('song', song);
  }

  setPlaying = (isPlaying) => {
    this.setState({ isPlaying });
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
        <Header
          user={this.state.user}
        />
        <div className="Content">
          <div className="App-title">Forte</div>
          <Search
            accessToken={this.state.access_token}
            playing={this.state.isPlaying}
            setSong={this.setSong}
            setPlaying={this.setPlaying}
          />
        </div>
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
