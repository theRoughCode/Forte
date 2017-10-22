import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import Slider from 'react-rangeslider'

class Volume extends Component {
  constructor(props) {
    super(props)
    this.state = {
      volume: this.props.volume
    }
  }

  handleOnChange = (value) => {
    this.setState({
      volume: value
    })
  }

  handleChangeComplete = (e) => {
    this.props.setVolume(this.state.volume);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.volume !== this.state.volume) this.setState({ volume: nextProps.volume });
  }

  render () {
    return (
      <div className="Volume">
        <div className="volume-holder-holder">
          <div className="volume-holder">
            <Glyphicon glyph="volume-up"></Glyphicon>
          </div>
          <div className="bar-holder">
            <Slider
              className="volume-slider"
              min={0}
              max={100}
              value={this.state.volume}
              tooltip={false}
              onChange={this.handleOnChange}
              onChangeComplete={this.handleChangeComplete}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Volume;
