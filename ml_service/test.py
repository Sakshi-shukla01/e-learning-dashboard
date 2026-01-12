import pandas as pd

df = pd.read_csv("data/realistic_elearning_data.csv")

# Count of each next_course
course_counts = df['next_course'].value_counts()
print(course_counts)
# Majority: courses with count >= 50
majority_courses = df[df['next_course'].map(df['next_course'].value_counts()) >= 50]

# Minority: courses with count < 50
minority_courses = df[df['next_course'].map(df['next_course'].value_counts()) < 50]

print("Majority courses:\n", majority_courses['next_course'].value_counts())
print("Minority courses:\n", minority_courses['next_course'].value_counts())
