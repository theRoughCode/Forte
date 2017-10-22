import React, { Component } from 'react';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import Profile from './Profile';
import Gallery from './Gallery';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      access_token: this.props.accessToken,
      query: '',
      artist: null,
      tracks: null,
      user: null
    }
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
        if (json.error || !json.artists.items.length) return null;
        console.log('json', json);
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

  render () {
    return (
      <div>
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
                playing={this.props.playing}
                setSong={this.props.setSong}
                setPlaying={this.props.setPlaying}
              />
            </div>
          )
        }
      </div>
    )
  }
}

export default Search;
