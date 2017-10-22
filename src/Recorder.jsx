import React, { Component } from 'react';
import { ReactMic } from 'react-mic';

class Recorder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blobUrl: null,
      strokeColor: '#000000',
      bgColor: '#417ee0',
      record: this.props.record,
      play: this.props.play
    }
  }

  onStop = (blob) => {
    console.log('stopped');
    this.setState({ blobUrl: blob.blobURL });
    this.props.setBlob(blob);
  }

  playRecording() {
    this.setState({ play: false });
    console.log('playing');
    if (this.state.blobUrl) {
      let recording = new Audio(this.state.blobUrl);
      recording.play();
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
    this.setState({
      play: nextProps.play,
      record: nextProps.record
    });
    if (nextProps.play) this.playRecording();
  }

  render () {
    return (
      <ReactMic
        className="Recorder"
        onStop={this.onStop}
        strokeColor={this.state.strokeColor}
        backgroundColor={this.state.bgColor}
        record={this.state.record}
        mimeType={'audio/wav'}
        />
    )
  }
}

export default Recorder;
