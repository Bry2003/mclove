from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify, session
import os
import secrets

# Create Flask app with proper static and template folders for responsive design
app = Flask(__name__, static_folder='.', template_folder='.')
app.secret_key = secrets.token_hex(16)  # Add a secret key for session management

@app.route('/')
def index():
    # Set user agent detection for device-specific optimizations
    user_agent = request.headers.get('User-Agent')
    return render_template('index.html')

# Add login route to handle password verification
@app.route('/login', methods=['POST'])
def login():
    password = request.form.get('password', '').lower().strip()
    correct_password = "divina"  # Same password as in your JavaScript
    
    if password == correct_password:
        session['logged_in'] = True
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Incorrect password. Please try again."})

# Serve static files properly
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

# Keep the specific route for background image
@app.route('/background.jpg')
def background():
    return send_from_directory('.', 'background.jpg')

# Add error handling for better user experience
@app.errorhandler(404)
def page_not_found(e):
    return render_template('index.html'), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)