from flask import Flask, url_for, request, Response
import scipy.io.wavfile as wavf
import numpy as np
import wave
import json

# import test
from volume import Volume
v = Volume()

app = Flask(__name__)
input_file = 'in.wav'

nchannels = 1
sampwidth = 1
framerate = 8000
nframes = 1

def toWav(audio_as_int_array):
    wavf.write(input_file, test.get_rate(), audio_as_int_array)

@app.route('/api', methods=['POST'])
def audio():
    # print 'Headers: ', request.headers
    # print '\n---\n'
    # print 'Body: ', request.get_data()
    # print '\n---\n'
    # print 'Blob: ', request.form['blob']
    # print '\n---\n'
    print request.get_json(force=True)
    print request.get_data()
    print request.form

    # resp = Response("{'a':'b'}", status=201, mimetype='application/json')
    # return resp

    return Response(
        'Hello World',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )

    # return Response("pong\n", content_type="text/plain;charset=UTF-8")

    # print request.files
    # msg = request.files['wav']
    
    # audio = wave.open(name, 'wb')
    # audio.setnchannels(nchannels)
    # audio.setsampwidth(sampwidth)
    # audio.setframerate(framerate)
    # audio.setnframes(nframes)

    # blob = open(input_file).read()
    # audio.writeframes(blob)

    # return str(v.decibel(input_file))

@app.route('/hello', methods=['POST','GET'])
def hello():
    return 'Hello World!'

@app.route('/test', methods=['GET'])
def test():
    return Response("Hello", content_type="text/plain;charset=UTF-8")

if __name__ == '__main__':
    app.run(host='100.65.207.162',port=8000,debug=False)