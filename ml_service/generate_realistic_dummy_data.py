import pandas as pd
import random
import os

os.makedirs("data", exist_ok=True)

# Course structure with difficulty levels
courses = {
    "Math": ["Basic Math", "Intermediate Math", "Advanced Math"],
    "Science": ["Physics Basics", "Chemistry Basics", "Advanced Physics"],
    "Language": ["English Grammar", "English Vocabulary", "Advanced English"],
    "Coding": ["Python Basics", "Python Intermediate", "Data Science"],
    "Business": ["Marketing Basics", "Digital Marketing", "Business Analytics"]
}

data = []
for user_id in range(1, 801):  # 800 learners
    category = random.choice(list(courses.keys()))
    course_list = courses[category]

    # Randomly select difficulty level
    current_course = random.choice(course_list)
    progress = random.randint(40, 100)
    score = random.randint(40, 100)

    # Decide the next course based on performance
    if score > 80 and progress > 80:
        next_course = (
            course_list[min(course_list.index(current_course) + 1, len(course_list) - 1)]
        )  # go to next level
    elif score < 60 or progress < 60:
        next_course = current_course  # repeat same course
    else:
        next_course = random.choice(course_list)

    data.append({
        "user_id": user_id,
        "course_name": current_course,
        "category": category,
        "progress": progress,
        "score": score,
        "next_course": next_course
    })

df = pd.DataFrame(data)
output_path = os.path.join("data", "realistic_elearning_data.csv")
df.to_csv(output_path, index=False)

print(f"✅ Smart dataset generated with {len(df)} rows at {output_path}")
