import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import numpy as np

# Generate synthetic training data
np.random.seed(42)
data = pd.DataFrame({
    "distance_km": np.random.uniform(1, 20, 500),
    "hour_of_day": np.random.randint(0, 24, 500),
    "day_of_week": np.random.randint(0, 7, 500),
    "is_holiday": np.random.randint(0, 2, 500),
    "weather_idx": np.random.randint(0, 3, 500),
    "crowd_level": np.random.uniform(0, 1, 500)
})
data["travel_time_minutes"] = (
    data["distance_km"] * np.random.uniform(2, 4) +
    data["crowd_level"] * np.random.uniform(5, 15) +
    np.random.normal(0, 2, 500)
)

# Train model
X = data.drop("travel_time_minutes", axis=1)
y = data["travel_time_minutes"]
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model
joblib.dump(model, "models/model.joblib")
print("✅ Model trained and saved to models/model.joblib")
