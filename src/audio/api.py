from flask import Flask, url_for, request
from flask_sockets import Sockets
import scipy.io.wavfile as wavf
import numpy as np

import test
'''
import volume
v = Volume()
'''

app = Flask(__name__)
ws = Sockets(app)
input_file = 'in.wav'

def toWav(audio_as_int_array):
    wavf.write(input_file, test.get_rate(), audio_as_int_array)

@ws.route('/websocket', methods = ['GET', 'POST'])
def audio(ws):
    if request.method == 'POST':
        first_message = True
        total_msg = ""
        sample_rate = 0

        while True:
            msg = ws.receive()

            if first_message and msg is not None: # the first message should be the sample rate
                sample_rate = getSampleRate(msg)
                first_message = False
                continue
            elif msg is not None:
                audio_as_int_array = numpy.frombuffer(msg, 'i2')
                toWav(audio_as_int_array)
            else:
                break
        ws.send(str(test.get_rate()))

# @app.route('/analyze', methods = ['GET', 'POST'])
# def api_analyze():
#     if request.method == 'GET':
#         return str(test.get_rate())
#     elif request.method == 'POST':
#         pass

if __name__ == '__main__':
    # app.run()
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    server.serve_forever()