from flask import Flask, request, send_file,jsonify
from cloud import cloud_service
from estatistica import create_statistic
import os

app = Flask(__name__)

@app.route('/cloud', methods=['POST'])
def cloudController():
    body = request.get_json()

    if(body == None):
        return "", 400

    filename = cloud_service(body)
    return send_file(filename, mimetype='image/png'), 200

@app.route('/statistic', methods=['POST'])
def statisticController():
    body = request.get_json()
    if(body == None):
        return "", 400
    return jsonify(create_statistic(body)), 200


if __name__ == '__main__':
    port = 5000 if os.environ.get("port") == None else os.environ.get("port")
    debug = True if os.environ.get("debug") == None else os.environ.get("debug")
    app.run(host='0.0.0.0', debug=debug, port=port)