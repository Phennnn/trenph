from flask import Flask, request, jsonify
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
import numpy as np # Make sure numpy is imported
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Load the pre-trained model
MODEL_PATH = os.getenv("MODEL_PATH", "models/model.joblib")
try:
    model = joblib.load(MODEL_PATH)
except FileNotFoundError:
    logger.warning(f"Model file not found at {MODEL_PATH}. A dummy model will be used.")
    # Fallback: Create a dummy model if file is missing
    model = RandomForestRegressor()
    model.fit(np.array([[1, 10, 1, 0, 1, 0.5]]), np.array([15]))

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        logger.debug("Received request data: %s", data)
        
        distance_km = data.get('distance_km')
        hour_of_day = data.get('hour_of_day')
        day_of_week = data.get('day_of_week')
        is_holiday = data.get('is_holiday')
        weather_idx = data.get('weather_idx')
        crowd_level = data.get('crowd_level')

        # Input validation
        if not all(isinstance(x, (int, float)) for x in [distance_km, hour_of_day, day_of_week, is_holiday, weather_idx, crowd_level]):
            return jsonify({"error": "Invalid input data types"}), 400

        # Prepare input for the model
        input_data = np.array([[distance_km, hour_of_day, day_of_week, is_holiday, weather_idx, crowd_level]])
        prediction_result = model.predict(input_data)[0]
        logger.debug("Prediction: %s", prediction_result)

        return jsonify({
            "eta": f"{int(prediction_result)} min",
            "status": "On Time",
            "travelTime": f"{int(prediction_result * 1.5)} min"
        })
    except Exception as e:
        logger.error("Prediction failed: %s", str(e))
        return jsonify({"error": "An error occurred during prediction."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)