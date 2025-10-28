import pandas as pd
import os

# Load dataset
df = pd.read_csv("sleep.csv")

# Display information about the dataset
print("Dataset loaded successfully!")
print(f"Dataset shape: {df.shape}")
print("\nFirst few rows:")
print(df.head())

print("\nDataset info:")
print(df.info())

print("\nSleep Quality distribution:")
print(df['Sleep Quality'].value_counts())

# Save a simple mapping for predictions
# In a real scenario, we would train a model here
# For now, we'll just save some basic statistics

# Calculate average values for each sleep quality category
avg_values = df.groupby('Sleep Quality').mean(numeric_only=True)
avg_values.to_csv('sleep_quality_avg_values.csv')

print("\nAverage values by sleep quality saved to 'sleep_quality_avg_values.csv'")
print(avg_values)

# Create a simple rule-based predictor
def predict_sleep_quality(age, gender, steps, calories, activity, diet):
    """
    Simple rule-based prediction based on the averages
    """
    # This is a very simplified approach - in reality, you'd use a trained ML model
    if steps > 8000 and calories > 2500 and activity in ['Moderate', 'High'] and diet == 'Healthy':
        return 'Good'
    elif steps > 6000 and calories > 2000 and diet in ['Average', 'Healthy']:
        return 'Fair'
    else:
        return 'Poor'

# Test the simple predictor
sample_prediction = predict_sleep_quality(30, 'Male', 7000, 2400, 'Moderate', 'Healthy')
print(f"\nSample prediction: {sample_prediction}")

print("\nTo use a real machine learning model, you'll need to install scikit-learn and joblib:")
print("pip install scikit-learn joblib")