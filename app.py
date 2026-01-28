from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

def load_people():
    try:
        # Assuming people.json is in crm-spa directory relative to project root
        file_path = os.path.join(os.path.dirname(__file__), 'people.json')
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: people.json not found.")
        return []

@app.route('/')
def index():
    # Extract all query parameters
    query_params = request.args.to_dict()
    
    people = load_people()
    found_user = None
    
    user_qry = request.args.get('user_qry')
    user_qry_txt = request.args.get('user_qry_txt')

    if user_qry:
        found_user = next((p for p in people if str(p['id']) == user_qry), None)
    elif user_qry_txt:
        found_user = next((p for p in people if p['id_txt'] == user_qry_txt), None)

    return render_template('index.html', query_params=query_params, found_user=found_user)

@app.route('/users/<user_id>')
def user_detail(user_id):
    people = load_people()
    found_user = next((p for p in people if str(p['id']) == user_id), None)
    
    # Always return JSON
    if found_user:
        return jsonify(found_user), 200
    else:
        return jsonify({"error": "User not found", "user_id": user_id}), 404

@app.route('/spa')
def spa():
    """Serve the standalone SPA"""
    spa_path = os.path.join(os.path.dirname(__file__), 'index.html')
    with open(spa_path, 'r') as f:
        return f.read()

@app.route('/spa/<path:filename>')
def spa_static(filename):
    """Serve static files for the SPA (CSS, JS, JSON)"""
    from flask import send_from_directory
    spa_dir = os.path.dirname(__file__)
    return send_from_directory(spa_dir, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
