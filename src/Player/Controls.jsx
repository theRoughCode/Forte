import React, { Component } from 'react';
import { ProgressBar, Glyphicon } from 'react-bootstrap';

class Controls extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="Controls">
        <div className="buttons-holder">
          <div className="buttons">
            <div className="pp-button-holder">
              <div className="pp-button">
                {this.props.isPlaying
                    ? <Glyphicon glyph="pause"></Glyphicon>
                    : <Glyphicon glyph="play"></Glyphicon>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="bar-holder">
          <div className="bar">
            <div id="progress">
              <div id="progress-played"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Controls;
