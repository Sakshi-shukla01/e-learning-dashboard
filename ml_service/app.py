from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier
from sklearn.utils import resample

app = Flask(__name__)
CORS(app)

# -----------------------------
# Paths
# -----------------------------
DATA_PATH = os.path.join("data", "realistic_elearning_data.csv")
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "recommendation_model.pkl")
ENCODERS_PATH = os.path.join(MODEL_DIR, "encoders.pkl")

model = None
encoders = {}
scaler = None

# -----------------------------
# Load model + encoders
# -----------------------------
def load_model():
    global model, encoders, scaler
    if os.path.exists(MODEL_PATH) and os.path.exists(ENCODERS_PATH):
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        with open(ENCODERS_PATH, "rb") as f:
            saved_data = pickle.load(f)
            encoders = saved_data.get("encoders", {})
            scaler = saved_data.get("scaler")
        print("✅ Model and encoders loaded successfully.")
    else:
        print("⚠️ No model found. Please retrain using /retrain endpoint.")

# -----------------------------
# Safe transform for unseen labels
# -----------------------------
def safe_transform(encoder, value):
    if value in encoder.classes_:
        return encoder.transform([value])[0]
    else:
        most_common = encoder.classes_[0]
        print(f"⚠️ Unseen label '{value}', using most common '{most_common}'")
        return encoder.transform([most_common])[0]

# -----------------------------
# Retrain model with balanced data
# -----------------------------
def retrain_model():
    global model, encoders, scaler

    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found at '{DATA_PATH}'")

    df = pd.read_csv(DATA_PATH)
    df = df.drop(columns=["user_id"], errors="ignore")

    # Encode categorical columns
    encoders = {}
    for col in ["course_name", "category", "next_course"]:
        enc = LabelEncoder()
        df[col] = enc.fit_transform(df[col])
        encoders[col] = enc

    # Upsample minority classes
    counts = df['next_course'].value_counts()
    max_count = counts.max()
    dfs = []
    for cls in counts.index:
        df_cls = df[df['next_course'] == cls]
        if len(df_cls) < max_count:
            df_cls_upsampled = resample(df_cls,
                                        replace=True,
                                        n_samples=max_count,
                                        random_state=42)
            dfs.append(df_cls_upsampled)
        else:
            dfs.append(df_cls)
    df_balanced = pd.concat(dfs).sample(frac=1, random_state=42)

    # Feature Engineering
    df_balanced["engagement"] = (df_balanced["progress"] * 0.5) + (df_balanced["score"] * 0.5)
    df_balanced["performance_trend"] = df_balanced["score"] - df_balanced["progress"]
    df_balanced["consistency"] = df_balanced["progress"] / (df_balanced["score"] + 1)
    df_balanced["category_score"] = df_balanced.groupby("category")["score"].transform("mean")

    # Store mean scores per category
    category_scores = df_balanced.groupby("category")["score"].mean().to_dict()
    encoders["category_scores"] = category_scores

    # Features and target
    X = df_balanced[[
        "course_name", "category", "progress", "score",
        "engagement", "performance_trend", "consistency", "category_score"
    ]]
    y = df_balanced["next_course"]

    # Scale
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    # Train model
    model = XGBClassifier(
        n_estimators=500,
        learning_rate=0.03,
        max_depth=8,
        subsample=0.9,
        colsample_bytree=0.8,
        random_state=42,
        use_label_encoder=False,
        eval_metric="mlogloss"
    )
    model.fit(X_train, y_train)

    # Test accuracy
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)

    # Save model + encoders + scaler
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    with open(ENCODERS_PATH, "wb") as f:
        pickle.dump({"encoders": encoders, "scaler": scaler}, f)

    print(f"✅ Model retrained and saved successfully. Accuracy: {acc*100:.2f}%")
    return acc

# -----------------------------
# Retrain API endpoint
# -----------------------------
@app.route("/retrain", methods=["POST"])
def retrain_endpoint():
    try:
        acc = retrain_model()
        return jsonify({"message": "Model retrained successfully", "accuracy": acc})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------
# Predict endpoint
# -----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    global model, encoders, scaler
    try:
        if model is None or not encoders:
            return jsonify({"error": "Model not loaded. Please call /retrain first."}), 400

        data = request.get_json()
        required_fields = ["course_name", "category", "progress", "score"]
        for f in required_fields:
            if f not in data:
                return jsonify({"error": f"Missing field: {f}"}), 400

        course_name_enc = safe_transform(encoders["course_name"], data["course_name"])
        category_enc = safe_transform(encoders["category"], data["category"])
        progress = float(data["progress"])
        score = float(data["score"])
        engagement = progress * 0.5 + score * 0.5
        performance_trend = score - progress
        consistency = progress / (score + 1)

        # Use stored category mean if available
        category_score = encoders.get("category_scores", {}).get(category_enc, score)

        X = np.array([[course_name_enc, category_enc, progress, score,
                       engagement, performance_trend, consistency, category_score]])
        X_scaled = scaler.transform(X)

        pred_enc = model.predict(X_scaled)[0]
        recommended_course = encoders["next_course"].inverse_transform([pred_enc])[0]

        return jsonify({"recommended_course": recommended_course})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------
# Start Flask Server
# -----------------------------
if __name__ == "__main__":
    load_model()
    print("🚀 ML Service running at http://localhost:5001")
    app.run(port=5001, debug=True)
