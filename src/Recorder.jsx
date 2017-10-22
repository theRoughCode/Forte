import React, { Component } from 'react';
import { ReactMic } from 'react-mic';

class Recorder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blobUrl: null,
      strokeColor: '#fff',
      bgColor: 'blue'
    }
  }

  onStop = (blob) => {
    console.log('blob', blob);
    this.setState({ blobUrl: blob.blobURL });
  }

  playRecording() {
    if (this.state.blobUrl) {
      let recording = new Audio(this.state.blobUrl);
      recording.play();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.play) this.playRecording();
  }

  render () {
    return (
      <ReactMic
        className="Recorder"
        onStop={this.onStop}
        strokeColor={this.state.strokeColor}
        backgroundColor={this.state.bgColor}
        record={this.props.record}
        mimeType={'audio/wav'}
        />
    )
  }
}

export default Recorder;
