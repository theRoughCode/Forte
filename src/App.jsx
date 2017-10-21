import React, { Component } from 'react';
import queryString from 'query-string';
import 'whatwg-fetch';
import './App.css';
import Header from './Header';
import Profile from './Profile';
import Gallery from './Gallery';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';

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

    this.state = {
      query: '',
      artist: null,
      tracks: null,
      user:null,
      access_token
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

  search() {
    const BASE_URL = 'https://api.spotify.com/v1/search';
    const FETCH_URL = BASE_URL + '?q=' + this.state.query + '&type=artist&limit=1';
    const ALBUM_URL = `https://api.spotify.com/v1/artists/`

    fetch(FETCH_URL, {
      mode: "cors",
      headers: {
        'Authorization': `Authorization: Bearer ${this.state.access_token}`
      }
    })
      .then(res => {
        return res.json();
      })
      .then(json => {
        if (json.error) return null;
        this.setState({ artist: json.artists.items[0] })

        let url = `${ALBUM_URL}${this.state.artist.id}/top-tracks?country=CA`
        fetch(url, {
          mode: "cors",
          headers: {
            'Authorization': `Authorization: Bearer ${this.state.access_token}`
          }
        })
          .then(res => res.json())
          .then(json => {
            const { tracks } = json;
            this.setState({ tracks });
          })
      })
  }

  render() {
    return (
      <div>
        <Header
          user={this.state.user}
        />
        <div className="App">
          <div className="App-title">Forte</div>
          <FormGroup>
            <InputGroup>
              <FormControl
                className="search"
                type="text"
                placeholder="Search for an artist"
                value={ this.state.query }
                onChange={ event => {this.setState({ query: event.target.value })} }
                onKeyPress={ event => {
                  if (event.key === 'Enter') this.search();
                }}
                />
              <InputGroup.Addon
                className="search-button"
                onClick={() => this.search()}
              >
                <Glyphicon glyph="search"></Glyphicon>
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          {
            this.state.artist &&
            (
              <div>
                <Profile
                  artist={this.state.artist}
                  />
                <Gallery
                  tracks={this.state.tracks}
                  />
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default App;
