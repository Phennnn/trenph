from flask import Flask, request, jsonify
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        logger.debug("Received request data: %s", request.get_json())
        data = request.get_json()
        distance_km = data.get('distance_km')
        hour_of_day = data.get('hour_of_day')
        day_of_week = data.get('day_of_week')
        is_holiday = data.get('is_holiday')
        weather_idx = data.get('weather_idx')
        crowd_level = data.get('crowd_level')

        if not all(isinstance(x, (int, float)) for x in [distance_km, hour_of_day, day_of_week, is_holiday, weather_idx, crowd_level]):
            return jsonify({"error": "Invalid input data"}), 400

        if distance_km <= 0 or hour_of_day < 0 or hour_of_day > 23 or day_of_week < 0 or day_of_week > 6 or is_holiday not in [0, 1] or crowd_level < 0 or crowd_level > 1:
            return jsonify({"error": "Invalid input values"}), 400

        input_data = np.array([[distance_km, hour_of_day, day_of_week, is_holiday, weather_idx, crowd_level]])
        logger.debug("Input data shape: %s", input_data.shape)
        prediction = model.predict(input_data)[0]
        logger.debug("Prediction: %s", prediction)
        return jsonify({
            "eta": f"{int(prediction)} min",
            "status": "On Time",
            "travelTime": f"{int(prediction * 1.5)} min"
        })
    except Exception as e:
        logger.error("Prediction failed: %s", str(e))
        return jsonify({"error": str(e)}), 500

app = Flask(__name__)

# Load the pre-trained model (ensure models/model.joblib exists)
MODEL_PATH = os.getenv("MODEL_PATH", "models/model.joblib")
try:
    model = joblib.load(MODEL_PATH)
except FileNotFoundError:
    # Fallback: Train a dummy model if file is missing
    model = RandomForestRegressor()
    model.fit(np.array([[1, 10, 1, 0, 1, 0.5]]), np.array([15]))  # Dummy data
    joblib.dump(model, MODEL_PATH)
    print(f"Warning: Created dummy model at {MODEL_PATH}")

@app.route('/predict', methods=['POST'])  # Change to POST to match server.js
def predict():
    try:
        data = request.get_json()
        distance_km = data.get('distance_km')
        hour_of_day = data.get('hour_of_day')
        day_of_week = data.get('day_of_week')
        is_holiday = data.get('is_holiday')
        weather_idx = data.get('weather_idx')
        crowd_level = data.get('crowd_level')

        # Input validation
        if not all(isinstance(x, (int, float)) for x in [distance_km, hour_of_day, day_of_week, is_holiday, weather_idx, crowd_level]):
            return jsonify({"error": "Invalid input data"}), 400

        if distance_km <= 0 or hour_of_day < 0 or hour_of_day > 23 or day_of_week < 0 or day_of_week > 6 or is_holiday not in [0, 1] or crowd_level < 0 or crowd_level > 1:
            return jsonify({"error": "Invalid input values"}), 400

        # Prepare input for model (reshape for single prediction)
        input_data = np.array([[distance_km, hour_of_day, day_of_week, is_holiday, weather_idx, crowd_level]])
        prediction = model.predict(input_data)[0]  # Get ETA in minutes

        return jsonify({
            "eta": f"{int(prediction)} min",
            "status": "On Time",
            "travelTime": f"{int(prediction * 1.5)} min"  # Example: travel time = 1.5x ETA
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)