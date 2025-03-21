from datetime import timedelta
from flask import Flask, jsonify # type: ignore
from routes.main_routes import main_routes
from flask import render_template
from flask_cors import CORS
from flask_caching import Cache
from db.db import db
from extensions.config import jwt
from routes.auth import auth_bp



app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost/db_looplock'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desativa o rastreamento de modificações para evitar warnings
app.config['JWT_SECRET_KEY'] = '138c567d9267acbca2510a38'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30) 
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)  # Expira em 7 dias

CORS(app, origins=["http://192.168.1.4:5000"])
cache = Cache(app)
cache.clear()

db.init_app(app)
jwt.init_app(app)

app.register_blueprint(main_routes)
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
