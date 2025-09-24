import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# --- Configuration ---
DATA_DIR = "data"
PROCESSED_DATA_PATH = os.path.join(DATA_DIR, "processed_ridership.csv")
MODEL_PATH = "models/model.joblib"

def train_model():
    """
    Trains the RandomForestRegressor model on the processed data
    and saves it to a file.
    """
    print("Training model on processed data...")
    if not os.path.exists(PROCESSED_DATA_PATH):
        print(f"Processed data not found at {PROCESSED_DATA_PATH}. Please run data_processor.py first.")
        return

    df = pd.read_csv(PROCESSED_DATA_PATH)
    
    # Define features (X) and the target (y)
    features = [
        'distance_km',
        'hour_of_day',
        'day_of_week',
        'is_holiday',
        'weather_idx',
        'crowd_level'
    ]
    target = 'travel_time_minutes'

    X = df[features]
    y = df[target]

    # Initialize and train the model
    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X, y)

    # Ensure the models directory exists
    if not os.path.exists("models"):
        os.makedirs("models")
        
    # Save the trained model
    joblib.dump(model, MODEL_PATH)
    print(f"✅ Model trained successfully and saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_model()