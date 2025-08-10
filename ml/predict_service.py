from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

MODEL_PATH = os.getenv("MODEL_PATH", "models/model.joblib")
model = joblib.load(MODEL_PATH)

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array([[
        data.get("distance_km", 5),
        data.get("hour_of_day", 8),
        data.get("day_of_week", 1),
        data.get("is_holiday", 0),
        data.get("weather_idx", 0),
        data.get("crowd_level", 0.5)
    ]])
    prediction = model.predict(features)[0]
    return jsonify({"predicted_travel_time_minutes": round(float(prediction), 2)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
