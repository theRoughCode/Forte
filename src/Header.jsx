import React, { Component } from 'react';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  openUser(user) {
    window.open(user.external_urls.spotify);
  }

  render () {
    let { user } = this.props;

    return (
      <div className="Header">
        <img
          id="user-img"
          src={user && user.images[0].url}
          onClick={() => this.openUser(user)}
        />
        <p id="user-name">{user && user.display_name}</p>
      </div>
    )
  }
}

export default Header;
