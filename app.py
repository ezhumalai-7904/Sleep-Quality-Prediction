import streamlit as st
import pandas as pd
import os

# Load average values for prediction
if os.path.exists('sleep_quality_avg_values.csv'):
    avg_values = pd.read_csv('sleep_quality_avg_values.csv')
    avg_values.set_index('Sleep Quality', inplace=True)
else:
    # Create default values if file doesn't exist
    data = {
        'Age': [37.6, 27.86, 36.125],
        'Daily Steps': [9900.0, 4928.57, 8062.5],
        'Calories Burned': [2980.0, 1800.0, 2612.5]
    }
    avg_values = pd.DataFrame(data, index=['Excellent', 'Fair', 'Good'])

st.title("😴 Sleep Quality Prediction")
st.write("Predict your sleep quality based on your daily habits!")

# Collect user inputs
age = st.number_input("Age", min_value=10, max_value=100, step=1, value=30)
gender = st.selectbox("Gender", ["Male", "Female"])
steps = st.number_input("Daily Steps", min_value=0, value=5000)
calories = st.number_input("Calories Burned", min_value=0, value=2000)
activity = st.selectbox("Physical Activity Level", ["Low", "Moderate", "High"])
diet = st.selectbox("Dietary Habits", ["Poor", "Average", "Healthy"])

# Simple prediction function
def predict_sleep_quality(age, steps, calories, activity, diet):
    # Calculate scores based on how close inputs are to excellent averages
    excellent_steps = avg_values.loc['Excellent', 'Daily Steps']
    excellent_calories = avg_values.loc['Excellent', 'Calories Burned']
    
    # Score based on steps (40% weight)
    steps_score = min(1.0, steps / excellent_steps) * 0.4
    
    # Score based on calories (30% weight)
    calories_score = min(1.0, calories / excellent_calories) * 0.3
    
    # Score based on activity (20% weight)
    activity_score = 0.0
    if activity == 'High':
        activity_score = 0.2
    elif activity == 'Moderate':
        activity_score = 0.1
    
    # Score based on diet (10% weight)
    diet_score = 0.0
    if diet == 'Healthy':
        diet_score = 0.1
    elif diet == 'Average':
        diet_score = 0.05
    
    total_score = steps_score + calories_score + activity_score + diet_score
    
    # Determine sleep quality based on total score
    if total_score >= 0.8:
        return "Excellent"
    elif total_score >= 0.6:
        return "Good"
    elif total_score >= 0.4:
        return "Fair"
    else:
        return "Poor"

# Predict button
if st.button("Predict Sleep Quality"):
    prediction = predict_sleep_quality(age, steps, calories, activity, diet)
    st.success(f"Predicted Sleep Quality: **{prediction}** 😴")
    
    # Show comparison with averages
    st.subheader("Comparison with Average Values")
    comparison_data = avg_values.copy()
    comparison_data.loc['Your Input'] = [age, steps, calories]
    st.table(comparison_data)

st.markdown("---")
st.write("Note: This is a rule-based prediction system. For a real machine learning model, you would need to install scikit-learn and joblib:")
st.code("pip install scikit-learn joblib")