from flask import Flask, url_for, request, Response
from flask_cors import CORS, cross_origin
import scipy.io.wavfile as wavf
import numpy as np
import math
import wave
import json
import urllib2

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

wav_file = 'demo.wav'

@app.route('/api', methods=['POST'])
@cross_origin(origin="localhost",headers=['Content-Type', 'Text/Plain'])
def audio():
    # print 'Headers: ', request.headers
    # print '\n---\n'
    # print 'Body: ', request.get_data()
    # print '\n---\n'
    # print 'Blob: ', request.form['blob']
    # print '\n---\n'
    # print request.get_json(force=True)
    print json.dumps(request.json['blob']['blob'])

    file_name = request.json['blob']['blobURL']

    mp3file = urllib2.urlopen(file_name)
    with open(wav_file,'wb') as output:
        output.write(mp3file.read())

    # rate=8000
    # data2 = np.asarray(request.data, dtype=np.int16)

    # wavf.write(wav_file,rate,data2)

    return str(v.decibel(wav_file))

    # return Response(
    #     'Hello World',
    #     headers={
    #         'Access-Control-Allow-Origin': '*',
    #         'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept'
    #     }
    # )

@app.route('/test', methods=['GET'])
def test():
    return Response("Hello", content_type="text/plain;charset=UTF-8")

if __name__ == '__main__':
    app.run(host='100.65.207.162',port=8000,debug=False)