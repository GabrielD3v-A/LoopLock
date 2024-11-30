from flask import Flask, jsonify # type: ignore
from routes.main_routes import main_routes
from flask import render_template


app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

app.register_blueprint(main_routes)
@app.route('/')
def home():
    return jsonify(message="Welcome to the Password Manager API!")

if __name__ == '__main__':
    app.run(debug=True)
