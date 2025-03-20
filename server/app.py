from flask import Flask, jsonify # type: ignore
from routes.main_routes import main_routes
from flask import render_template
from flask_cors import CORS
from flask_caching import Cache
from db.db import db
from routes.auth import auth_bp



app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost/db_looplock'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desativa o rastreamento de modificações para evitar warnings

CORS(app, origins=["http://192.168.1.4:5000"])
cache = Cache(app)
cache.clear()

db.init_app(app)

app.register_blueprint(main_routes)
app.register_blueprint(auth_bp, url_prefix='/auth')
@app.route('/')

def home():
    return jsonify(message="Welcome to the Password Manager API!")

if __name__ == '__main__':
    app.run(debug=True)
