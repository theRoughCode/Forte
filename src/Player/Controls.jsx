import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';

class Controls extends Component {
  togglePlay() {
    this.props.setPlaying(!this.props.playing);
  }

  render () {
    return (
      <div className="Controls">
        <div className="buttons-holder">
          <div className="buttons">
            <div className="pp-button-holder">
              <div
                className="pp-button"
                onClick={() => this.togglePlay()}
                >
                {this.props.playing
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
