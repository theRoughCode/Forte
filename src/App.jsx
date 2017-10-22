import React, { Component } from 'react';
import queryString from 'query-string';
import 'whatwg-fetch';
import './App.css';
import Header from './Header';
import Search from './Search';
import Player from './Player/Player';

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

    this.state = {
      access_token,
      song: null,
      user: null,
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

      fetch(`${FETCH_URL}/player/currently-playing`, {
        mode: "cors",
        headers: {
          'Authorization': `Authorization: Bearer ${access_token}`
        }
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          if (data.is_playing) {
            this.setState({
              isPlaying: true,
              song: data.item
            });
            console.log('this.state', this.state);
          }
        });
  }

  setSong = (song) => {
    this.setState({ song });
    console.log('song', song);
  }

  setPlaying = (isPlaying) => {
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
  }

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
            song={this.state.song}
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
