import React, { Component } from 'react';
import 'whatwg-fetch';
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
            <div className="prev-button-holder">
              <div
                className="previous-button"
                onClick={this.props.prevSong}
                >
                <Glyphicon glyph="step-backward"></Glyphicon>
              </div>
            </div>
            <div className="pp-button-holder">
              <div className="pp-button-radius">
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
            <div className="next-button-holder">
              <div
                className="next-button"
                onClick={this.props.nextSong}
                >
                <Glyphicon glyph="step-forward"></Glyphicon>
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
