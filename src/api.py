from flask import Flask, url_for, request
import test
#from volume import decibel

app = Flask(__name__)

@app.route('/analyze')
def api_analyze():
    return str(test.get_rate())

if __name__ == '__main__':
    app.run()