import React, { Component } from 'react';

class Header extends Component {
  openUser(user) {
    window.open(user.external_urls.spotify);
  }

  render () {
    let { user } = this.props;
    user = JSON.parse(user);

    return (
      <div className="Header">
        <img
          alt="Profile"
          id="user-img"
          src={user && user.images && user.images[0].url}
          onClick={() => this.openUser(user)}
        />
      <p id="user-name">{user && user.display_name}</p>
      </div>
    )
  }
}

export default Header;
