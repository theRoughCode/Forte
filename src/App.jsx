import React, { Component } from 'react';
import queryString from 'query-string';
import 'whatwg-fetch';
import './App.css';
import Profile from './Profile';
import Gallery from './Gallery';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    const CLIENT_ID = '91c661c102224c47b773182c435d3a8f';
    const CLIENT_SECRET = '1b758af5f79b459f93b5894a997066a6';

    super(props);

    this.state = {
      query: '',
      artist: null,
      tracks: null
    }
  }

  search() {
    const BASE_URL = 'https://api.spotify.com/v1/search';
    const FETCH_URL = BASE_URL + '?q=' + this.state.query + '&type=artist&limit=1';
    const ALBUM_URL = `https://api.spotify.com/v1/artists/`
    const ACCESS_TOKEN = queryString.parse(window.location.hash).access_token;

    fetch(FETCH_URL, {
      mode: "cors",
      headers: {
        'Authorization': `Authorization: Bearer ${ACCESS_TOKEN}`
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
            'Authorization': `Authorization: Bearer ${ACCESS_TOKEN}`
          }
        })
          .then(res => res.json())
          .then(json => {
            console.log('json', json);
            const { tracks } = json;
            this.setState({ tracks });
          })
      })
  }

  render() {
    return (
      <div className="App">
        <div className="App-title">Forte</div>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Search for an artist"
              value={ this.state.query }
              onChange={ event => {this.setState({ query: event.target.value })} }
              onKeyPress={ event => {
                if (event.key === 'Enter') this.search();
              }}
            />
          <InputGroup.Addon onClick={() => this.search()}>
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
    )
  }
}

export default App;
