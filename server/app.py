from flask import Flask, jsonify # type: ignore
from routes.main_routes import main_routes
from flask import render_template
from flask_cors import CORS



app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
CORS(app, origins=["http://192.168.1.3:5000"])
app.register_blueprint(main_routes)
@app.route('/')

def home():
    return jsonify(message="Welcome to the Password Manager API!")

if __name__ == '__main__':
    app.run(debug=True)
