# 🚄 Tren-PH

AI-powered travel time prediction and transportation assistant inspired by Sakay.ph — built for the Philippines.

---

## 📦 Project Structure

Tren-PH/
├── backend/ # Node.js Express API (connects frontend → ML API)
├── frontend/ # React or mobile app (UI)
├── ml/ # Machine Learning microservice (Python Flask API)
│ ├── train_model.py
│ ├── predict_service.py
│ ├── models/
│ └── requirements.txt
├── db/ # Database files / scripts
├── docs/ # Project documentation
├── README.md
└── .gitignore

---

## 🛠 Requirements

- **Python 3.12** (tested version)
- **Node.js** (for backend & frontend)
- **Git**

---

## ⚡ Quick Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/Phennnn/trenph.git
cd trenph
```

### 2️⃣ Set up the ML API

```bash
cd ml
py -3.12 -m pip install -r requirements.txt
py -3.12 train_model.py
```

### 3️⃣ Start the ML API

```bash
py -3.12 predict_service.py
```

### 4️⃣ Test the ML API (PowerShell example)

```powershell
curl -Method POST http://localhost:5001/predict `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"distance_km": 8, "hour_of_day": 17, "day_of_week": 5, "is_holiday": 0, "weather_idx": 1, "crowd_level": 0.8}'
```

### 5️⃣ Run the backend

```bash
cd backend
npm install
node server.js
```

### 6️⃣ Run the frontend

```bash
cd frontend
npm install
npm start
```
