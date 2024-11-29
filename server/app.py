from flask import Flask, jsonify # type: ignore
from routes.main_routes import main_routes


app = Flask(__name__)

app.register_blueprint(main_routes)
@app.route('/')
def home():
    return jsonify(message="Welcome to the Password Manager API!")

if __name__ == '__main__':
    app.run(debug=True)
