
Interactive E-Learning Dashboard

> A full-stack AI-powered e-learning platform with an **XGBoost-based course recommendation engine**, **AWS S3 media delivery**, and **optimized MongoDB analytics** — built with React.js, Node.js, Express.js, Flask, and Python ML stack.

🔗 **Live Demo:** [e-learning-dashboard-hazel.vercel.app](https://e-learning-dashboard-hazel.vercel.app)  
📦 **GitHub:** [Sakshi-shukla01/e-learning-dashboard](https://github.com/Sakshi-shukla01/e-learning-dashboard)

---

## 🧱 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, CSS3, HTML5, Responsive Design |
| **Backend** | Node.js, Express.js, RESTful APIs, JWT Authentication |
| **ML Service** | Python, Flask, XGBoost, Scikit-Learn, Pandas |
| **Database** | MongoDB (Aggregation Pipelines, Compound Indexing, Transactions) |
| **Cloud** | AWS S3 (PDF delivery + Video streaming) |
| **Tools** | Git, Postman, VS Code |

---

## 📁 Project Structure

```
e-learning-dashboard/
│
├── frontend/                        # React.js SPA
│   └── src/
│       ├── components/              # Reusable UI components
│       ├── pages/                   # Dashboard, Courses, Progress, Recommendations
│       ├── hooks/                   # Custom React hooks (useDashboard, useCourses)
│       └── services/api.js          # Axios API service layer with JWT interceptors
│
├── backend/                         # Node.js + Express REST API
│   ├── routes/
│   │   ├── auth.js                  # Register, Login, JWT issuance
│   │   ├── courses.js               # Course CRUD + S3 presigned URLs
│   │   ├── analytics.js             # Dashboard aggregation endpoints
│   │   └── recommendations.js       # Calls Flask ML service
│   ├── models/
│   │   ├── User.js                  # Mongoose user schema
│   │   ├── Course.js                # Mongoose course schema
│   │   └── UserProgress.js          # Lesson completion + quiz tracking
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification middleware
│   │   └── errorHandler.js          # Global Express error handler
│   ├── config/
│   │   ├── db.js                    # MongoDB Atlas connection
│   │   └── s3.js                    # AWS S3 SDK config
│   └── server.js                    # Express app entry point
│
├── ml_service/                      # Python Flask ML microservice
│   ├── model/
│   │   ├── train.py                 # XGBoost training pipeline
│   │   ├── predict.py               # Inference + preprocessing
│   │   └── preprocess.py            # Feature engineering
│   ├── app.py                       # Flask app (POST /recommend)
│   └── requirements.txt
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## ✨ Key Features

### 🤖 XGBoost Course Recommendation Engine
- Trained on user interaction patterns: quiz scores, lesson completion rates, video watch time, topic preferences
- Feature engineering pipeline: aggregation → normalization → label encoding
- Automated personalized learning path generation per user
- Served via Flask REST microservice: `POST /recommend` → returns ranked course list

### 📊 Optimized Analytics Dashboard
- Real-time learning progress per user and course
- **30% reduction in query latency** through:
  - Compound indexes: `{ userId: 1, status: 1, completedAt: -1 }` (ESR rule)
  - Aggregation pipeline optimization: `$match` first → `$project` early → `$lookup` after `$group`
  - Eliminated full collection scans (COLLSCAN → IXSCAN verified via `explain()`)

### ☁️ AWS S3 Media Delivery
- PDF course notes: served via **presigned S3 URLs** (15-min expiry, HMAC-SHA256 signed)
- Video content: streamed via S3 for scalable delivery
- Zero media files on application server — fully decoupled architecture

### 🔐 JWT Authentication
- Stateless auth — all user identity in token payload
- Protected routes via Express middleware
- Role-based access: Student / Instructor / Admin

---

## 🧠 ML Model — XGBoost Recommendation Engine

### Problem Statement
Given a user's historical interaction data, predict which courses they are most likely to engage with and complete.

### Features Used
| Feature | Source | Description |
|---|---|---|
| `avg_quiz_score` | Quiz records | Mean score across completed quizzes |
| `lesson_completion_rate` | Progress records | % lessons completed per course |
| `avg_watch_time_ratio` | Video events | Watch duration / video total duration |
| `topic_category_encoded` | Course metadata | Label-encoded topic category |
| `days_since_last_activity` | Activity log | Recency signal |
| `total_courses_enrolled` | Enrollments | Platform engagement breadth |

### Training Pipeline
```python
# preprocess.py
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split

# Feature engineering
df['completion_rate'] = df['lessons_done'] / df['total_lessons']
df['watch_ratio'] = df['watch_duration'] / df['total_duration']
df['recency_score'] = 1 / (df['days_since_last_activity'] + 1)

# Encode + scale
le = LabelEncoder()
df['topic_encoded'] = le.fit_transform(df['topic_category'])
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X[numeric_cols])

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)
```

### XGBoost Model
```python
from xgboost import XGBClassifier

model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    eval_metric='mlogloss'
)
model.fit(X_train, y_train,
          eval_set=[(X_test, y_test)],
          early_stopping_rounds=20)
```

### Flask Inference API
```python
@app.route('/recommend', methods=['POST'])
def recommend():
    user_data = request.json
    features = preprocess(user_data)          # Same scaler/encoder as training
    probas = model.predict_proba(features)[0]
    top_courses = sorted(enumerate(probas), key=lambda x: x[1], reverse=True)[:5]
    return jsonify({ 'recommendations': [c for c,_ in top_courses] })
```

---

## 🗃️ MongoDB Optimization

### Aggregation Pipeline
```javascript
const analytics = await UserProgress.aggregate([
  { $match: { userId: ObjectId(userId) } },            // Filter FIRST (uses index)
  { $project: { courseId:1, score:1, completedAt:1 }}, // Drop fields early
  { $group: {
      _id: '$courseId',
      avgScore: { $avg: '$score' },
      lessonsCompleted: { $sum: 1 },
      lastActivity: { $max: '$completedAt' }
  }},
  { $lookup: { from:'courses', localField:'_id',        // Join AFTER grouping
      foreignField:'_id', as:'courseInfo' }},
  { $sort: { lastActivity: -1 } },
  { $limit: 10 }
]);
```

### Compound Indexes (ESR Rule: Equality → Sort → Range)
```javascript
UserProgressSchema.index({ userId: 1, status: 1, completedAt: -1 });
CourseSchema.index({ category: 1, difficulty: 1, createdAt: -1 });
```

---

## ☁️ AWS S3 Presigned URL
```javascript
const getPresignedUrl = async (courseId, fileName) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `courses/${courseId}/notes/${fileName}`,
    Expires: 900  // 15 minutes
  };
  return s3.getSignedUrlPromise('getObject', params);
};
```

---

## 🚀 Setup

### Prerequisites: Node.js v18+, Python 3.9+, MongoDB Atlas URI, AWS S3 credentials

```bash
# Backend
cd backend && npm install
cp .env.example .env   # Fill MONGO_URI, JWT_SECRET, AWS keys, ML_SERVICE_URL
npm run dev

# ML Service
cd ml_service && pip install -r requirements.txt
python app.py          # Runs on :5000

# Frontend
cd frontend && npm install
cp .env.example .env   # Fill REACT_APP_API_URL
npm start
```

---

## 🔒 Environment Variables

```env
# backend/.env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_strong_secret
JWT_EXPIRES_IN=7d
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-south-1
S3_BUCKET_NAME=elearning-content
ML_SERVICE_URL=http://localhost:5000
PORT=8000
```

---

## 📈 Performance

| Metric | Result |
|---|---|
| Dashboard query latency reduction | **30%** |
| Index type achieved | IXSCAN (from COLLSCAN) |
| Docs examined = docs returned | ✅ |
| S3 decoupled media delivery | ✅ |

---

## 👩‍💻 Author

**Sakshi Shukla** — B.Tech CSE, Bharati Vidyapeeth College of Engineering, Pune | CGPA: 9.80  
📧 sakshishukla1008@gmail.com | [GitHub](https://github.com/Sakshi-shukla01)

---

## 📄 License
MIT — see [LICENSE](LICENSE)
