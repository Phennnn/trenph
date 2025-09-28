import pandas as pd
import requests
import os
import json

# --- Configuration ---
DATA_DIR = "data"
RAW_DATA_PATH = os.path.join(DATA_DIR, "dotr_ridership_2023.csv")
# NEW: Path for our crowd profile data
CROWD_PROFILE_PATH = os.path.join(DATA_DIR, "station_crowd_profiles.json") 

def create_dummy_data():
    """
    Creates a more detailed dummy CSV to simulate real ridership data for processing.
    """
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

    print("Creating detailed dummy ridership data for crowd analysis...")
    # This dummy data simulates hourly entries for a few key stations
    data = {
        'line': ['LRT-1', 'LRT-1', 'LRT-1', 'MRT-3', 'MRT-3', 'MRT-3', 'LRT-1', 'MRT-3', 'LRT-2', 'LRT-2'],
        'station_entry': ['Baclaran', 'Baclaran', 'EDSA', 'North Avenue', 'Ayala', 'Ayala', 'Baclaran', 'Ayala', 'Recto', 'Cubao'],
        'hour_of_day': [7, 8, 8, 7, 17, 18, 9, 19, 8, 17], # Simulating morning and evening rush hours
        'riders': [4500, 5200, 3800, 5500, 5800, 5100, 2500, 4800, 4200, 4900]
    }
    df = pd.DataFrame(data)
    df.to_csv(RAW_DATA_PATH, index=False)
    print(f"Dummy ridership data saved to {RAW_DATA_PATH}")

def process_crowd_data():
    """
    Processes the raw ridership data to create an hourly crowd profile for each station.
    """
    print("Processing data to create crowd profiles...")
    if not os.path.exists(RAW_DATA_PATH):
        print("Raw data not found. Please run create_dummy_data first.")
        return

    df = pd.read_csv(RAW_DATA_PATH)

    # Calculate the average number of riders for each station at each hour
    crowd_profile = df.groupby(['line', 'station_entry', 'hour_of_day'])['riders'].mean().round(0).unstack(fill_value=100) # Use 100 as a base for off-peak
    
    # Convert the multi-level dataframe to a nested dictionary (JSON)
    # The structure will be: { "LRT-1": { "Baclaran": { "7": 4500, "8": 5200, ... } } }
    profile_dict = {level: crowd_profile.xs(level).to_dict('index') for level in crowd_profile.index.levels[0]}

    with open(CROWD_PROFILE_PATH, 'w') as f:
        json.dump(profile_dict, f, indent=4)
        
    print(f"✅ Station crowd profiles saved to {CROWD_PROFILE_PATH}")


def main():
    """
    Main function to run the data processing pipeline.
    """
    create_dummy_data()
    process_crowd_data()

if __name__ == "__main__":
    main()