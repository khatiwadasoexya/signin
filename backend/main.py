from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='../frontend/build', static_url_path='')

CORS(app)  # Enable CORS for all routes

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['auth_db']
users_collection = db['users']

@app.route('/')
def serve():
    # Serve the React app's index.html
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    # Serve static files for any other routes
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        # If the file does not exist, return the React app's index.html (for SPA routing)
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check if user already exists
    if users_collection.find_one({"username": username}):
        return jsonify({'success': False, 'message': 'User already exists'}), 400

    # Insert new user into MongoDB
    users_collection.insert_one({"username": username, "password": password})
    return jsonify({'success': True, 'message': 'User registered successfully'})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check if user exists and password matches
    user = users_collection.find_one({"username": username})
    if user and user['password'] == password:
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401


@app.route('/logout', methods=['POST'])
def logout():
    # Here, logout can be handled on the client side by removing the session or token
    return jsonify({'success': True, 'message': 'Logged out successfully'})


if __name__ == '__main__':
    app.run(debug=True)
