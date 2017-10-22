from flask import Flask, url_for, request
import test

app = Flask(__name__)

@app.route('/hello')
def api_hello():
    if 'name' in request.args:
        return 'Hello ' + request.args['name']
    else:
        return 'Hello John Doe'

@app.route('/analyze')
def api_analyze():
    return str(test.get_rate())

if __name__ == '__main__':
    app.run()