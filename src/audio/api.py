from flask import Flask, url_for, request, Response
from flask_cors import CORS, cross_origin
import scipy.io.wavfile as wavf
import numpy as np
import math
import wave
import json
import urllib2
import random
import subprocess

TESTING = True

from datetime import timedelta
from functools import update_wrapper

from volume import Volume
v = Volume()

app = Flask(__name__)

app.config['SECRET_KEY'] = 'qwerqwerqwerqwerqwer'
app.config['CORS_HEADERS'] = 'Content-Type'

cors = CORS(app, resources={r"/api": {"origins": "http://localhost:port"}})

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

@app.route('/api', methods=['POST'])
@cross_origin(origin="localhost",headers=['Content-Type', 'Text/Plain'])
def audio():
    
    volum = str(random.randint(60, 90))
    if not TESTING:
        output_wav = 'demo.wav'
        '''
        input_wav = 'original.wav'
        blobUrl = json.dumps(request.json['blob']['blobURL'])

        fake_useragent = 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25'
        r = urllib2.Request(blobUrl, headers={'User-Agent': fake_useragent})
        f = urllib2.urlopen(r)

        print blobUrl

        input_file = urllib2.urlopen(blobUrl)
        with open(input_wav,'wb') as output: # write to this file
            output.write(input_file.read())

        nchannels = 1
        sampwidth = 1
        framerate = 8000
        nframes = 1
        audio = wave.open(output_name, 'wb') # write to this file

        audio.setnchannels(nchannels)
        audio.setsampwidth(sampwidth)
        audio.setframerate(framerate)
        audio.setnframes(nframes)

        blob = open(input_wav).read() 
        audio.writeframes(blob)
        '''
        f = open(output_wav, 'wb')
        f.write(request.data)
        f.close()

        subprocess.call(['ffmpeg', '-i', 'demo.mp3', 'demo.wav'])

        volum = str(v.decibel(output_wav))

    return Response( volum, content_type="text/plain;charset=UTF-8" )

@app.route('/test', methods=['GET'])
def test():
    return Response("Hello", content_type="text/plain;charset=UTF-8")

if __name__ == '__main__':
    app.run(host='100.65.207.162',port=8000,debug=False)