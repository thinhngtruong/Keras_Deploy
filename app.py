import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
# Flask
from random import randint
from flask import Flask, request, render_template, jsonify, send_file
from gevent.pywsgi import WSGIServer
from gtts import gTTS
from util import base64_to_pil, urlConfig
import Caption_it
# Declare a flask app
app = Flask(__name__)

print('Model loaded. Check at http://localhost/')

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
        img.save(urlConfig + "\static\image.png")

        path = urlConfig + "\static\image.png"

        caption = Caption_it.caption_this_image(path)
        obj = gTTS(text=caption, slow=False, lang='en')

        delete_old_file()
        #generate new file name for browers get new wav file. Unless, browers use its cache.
        random = randint(1,100000)
        obj.save(urlConfig + "\static\speech" + str(random) + ".wav")
        # Serialize the result, you can add additional fields
        return jsonify(result=caption, key=random)

    return None

def delete_old_file():
    # Delete old wav file
    os.chdir(urlConfig + "\static")
    for file in os.listdir("."):
        if os.path.isfile(file) and file.startswith("speech"):
            try:
                os.remove(file)
            except Exception as e:
                print(e)

if __name__ == '__main__':
    # for other device access the website
    app.run(host='0.0.0.0')
    # http_server = WSGIServer(('localhost', 80), app)
    # http_server.serve_forever()
