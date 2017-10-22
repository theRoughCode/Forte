import React, { Component } from 'react';
import './App.css';

class Profile extends Component {
  render () {
    let artist = this.props.artist;
    return (
      <div className="profile">
        <img
          alt="Profile"
          className="profile-img"
          src={artist && artist.images[0].url}
        />
        <div className="profile-info">
          <div className="profile-name">{artist && artist.name}</div>
          <div className="profile-followers">
            {artist && artist.followers.total} followers
          </div>
          <div className="profile-genres">
            {artist &&
              artist.genres.map((genre, index) => {
                genre = (index !== artist.genres.length - 1)
                                ? `${genre}, `
                                : `& ${genre}`;
                return (
                  <span key={index}>{ genre }</span>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Profile;
