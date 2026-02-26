from sklearn.utils import resample
import pandas as pd

df = pd.read_csv("data/realistic_elearning_data.csv")

# Separate majority and minority courses
majority_courses = df[df['next_course'].map(df['next_course'].value_counts()) >= 50]
minority_courses = df[df['next_course'].map(df['next_course'].value_counts()) < 50]

# Upsample minority courses to match majority size
minority_upsampled = resample(
    minority_courses,
    replace=True,  # sample with replacement
    n_samples=len(majority_courses),  # match number of majority rows
    random_state=42
)

# Combine majority + upsampled minority
df_balanced = pd.concat([majority_courses, minority_upsampled])

# Check new counts
print(df_balanced['next_course'].value_counts())
