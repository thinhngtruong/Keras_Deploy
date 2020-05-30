import os

# Flask
from flask import Flask, request, render_template, jsonify
from gevent.pywsgi import WSGIServer

from util import base64_to_pil

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
# Declare a flask app
app = Flask(__name__)

import Caption_it

print('Model loaded. Check http://localhost/')


@app.route('/', methods=['GET'])
def index():
    # Main page
    return render_template('index.html')


@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        # Get the image from post request
        img = base64_to_pil(request.json)

        # Save the image to ./uploads
        img.save("C:/Users\Admin\Desktop\keras-flask-deploy-webapp\static\image.png")

        path = "C:/Users\Admin\Desktop\keras-flask-deploy-webapp\static\image.png"

        caption = Caption_it.caption_this_image(path)

        # Serialize the result, you can add additional fields
        return jsonify(result=caption)

    return None


if __name__ == '__main__':
    http_server = WSGIServer(('localhost', 80), app)
    http_server.serve_forever()