from flask import Flask, jsonify
from flask_cors import CORS



app = Flask(__name__)
CORS(app)



data = [
    {
        "street": "Domkloster 4",
        "zip": "50667",
        "city": "Köln",
        "tags": "dom,köln"
    },
    {
        "street": "Saalhof 1",
        "zip": "60311",
        "city": "Frankfurt am Main",
        "tags": "museum"
    }
]

@app.route('/data', methods=['GET'])
def get_locations():
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)