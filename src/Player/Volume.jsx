import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';

class Volume extends Component {
  render () {
    return (
      <div className="Volume">
        <div className="volume-holder-holder">
          <div className="volume-holder">
            <Glyphicon glyph="volume-up"></Glyphicon>
          </div>
          <div className="bar-holder">
            <div className="bar">
              <div id="progress-played"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Volume;
