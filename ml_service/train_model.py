import pandas as pd
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier
from flask import Flask, jsonify

# -----------------------------
# Setup Flask App
# -----------------------------
app = Flask(__name__)

# -----------------------------
# Paths
# -----------------------------
data_path = os.path.join("data", "realistic_elearning_data.csv")
model_dir = "models"
os.makedirs(model_dir, exist_ok=True)

# -----------------------------
# Training Function
# -----------------------------
def train_recommendation_model():
    # Load dataset
    df = pd.read_csv(data_path)
    df = df.drop(columns=["user_id"], errors="ignore")

    # Encode categorical features
    encoders = {}
    for col in ["course_name", "category", "next_course"]:
        enc = LabelEncoder()
        df[col] = enc.fit_transform(df[col])
        encoders[col] = enc

    # Feature Engineering
    df["engagement"] = (df["progress"] * 0.5) + (df["score"] * 0.5)
    df["performance_trend"] = df["score"] - df["progress"]
    df["consistency"] = df["progress"] / (df["score"] + 1)
    df["category_score"] = df.groupby("category")["score"].transform("mean")

    # Define features and target
    X = df[[
        "course_name", "category", "progress", "score", "engagement",
        "performance_trend", "consistency", "category_score"
    ]]
    y = df["next_course"]

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

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

    # Evaluate
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"🎯 Model Accuracy: {acc * 100:.2f}%")

    # Save model and encoders
    with open(os.path.join(model_dir, "recommendation_model.pkl"), "wb") as f:
        pickle.dump(model, f)
    with open(os.path.join(model_dir, "encoders.pkl"), "wb") as f:
        pickle.dump(encoders, f)

    print(f"✅ Model saved to: {model_dir}/recommendation_model.pkl")
    print(f"✅ Encoders saved to: {model_dir}/encoders.pkl")

    return acc


# -----------------------------
# Flask Endpoint: Retrain
# -----------------------------
@app.route('/retrain', methods=['POST'])
def retrain():
    try:
        accuracy = train_recommendation_model()
        return jsonify({
            "message": "✅ Model retrained successfully",
            "accuracy": round(accuracy * 100, 2)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Run Flask Service
# -----------------------------
if __name__ == "__main__":
    print("🚀 Starting ML retraining service on port 5001...")
    train_recommendation_model()  # initial training when service starts
    app.run(host="0.0.0.0", port=5001)
