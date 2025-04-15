from datetime import timedelta
from flask import Flask, jsonify # type: ignore
from routes.credential import credential
from flask import render_template
from flask_cors import CORS
from flask_caching import Cache
from db.db import db
from extensions.config import jwt
from routes.auth import auth_bp
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = os.getenv('JSON_SORT_KEYS')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30) 
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)
app.config["SECRET_KEY"] = os.getenv('SECRET_KEY')

CORS(app, origins=["http://localhost:5000"])
cache = Cache(app)
cache.clear()

db.init_app(app)
jwt.init_app(app)

app.register_blueprint(credential)
app.register_blueprint(auth_bp, url_prefix='/auth')
@app.route('/')

def home():
    return jsonify(message="Welcome to the Password Manager API!")

#jwt error handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        'message': 'The token has expired.',
        'error': 'token_expired'
    }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({
        'message': 'Signature verification failed.',
        'error': 'invalid_token'
    }), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({
        'message': 'Request does not contain an access token.',
        'error': 'authorization_required'
    }), 401



if __name__ == '__main__':
    app.run(debug=True)
