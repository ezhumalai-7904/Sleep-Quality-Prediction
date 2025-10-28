import streamlit as st
import pandas as pd
import joblib
import os

# Simple mock model function
def mock_predict(input_data):
    # Simple logic: higher steps and calories burned lead to better sleep
    steps = input_data['Daily Steps'].iloc[0]
    calories = input_data['Calories Burned'].iloc[0]
    
    score = (steps / 10000) * 0.5 + (calories / 3000) * 0.5
    
    if score > 0.8:
        return ["Excellent"]
    elif score > 0.6:
        return ["Good"]
    elif score > 0.4:
        return ["Fair"]
    else:
        return ["Poor"]

# Check if model exists, if not create a simple mock model
model_exists = os.path.exists('sleep_model.pkl')

if not model_exists:
    st.warning("Model file not found. Using a simple mock prediction.")

st.title("😴 Sleep Quality Prediction ")
st.write("Predict your sleep quality based on your daily habits!")

# Collect user inputs
age = st.number_input("Age", min_value=10, max_value=100, step=1, value=30)
gender = st.selectbox("Gender", ["Male", "Female"])
steps = st.number_input("Daily Steps", min_value=0, value=5000)
calories = st.number_input("Calories Burned", min_value=0, value=2000)
activity = st.selectbox("Physical Activity Level", ["Low", "Moderate", "High"])
diet = st.selectbox("Dietary Habits", ["Poor", "Average", "Healthy"])

# Convert inputs to DataFrame
input_data = pd.DataFrame({
    'Age': [age],
    'Gender_Male': [1 if gender == "Male" else 0],
    'Daily Steps': [steps],
    'Calories Burned': [calories],
    'Physical Activity Level_Moderate': [1 if activity == "Moderate" else 0],
    'Physical Activity Level_High': [1 if activity == "High" else 0],
    'Dietary Habits_Average': [1 if diet == "Average" else 0],
    'Dietary Habits_Healthy': [1 if diet == "Healthy" else 0]
})

# Predict button
if st.button("Predict Sleep Quality"):
    if model_exists:
        try:
            # Load the trained model
            model = joblib.load('sleep_model.pkl')
            prediction = model.predict(input_data)
            st.success(f"Predicted Sleep Quality: **{prediction[0]}** 😴")
        except Exception as e:
            st.error(f"Error loading model: {str(e)}")
            st.info("Using mock prediction instead:")
            prediction = mock_predict(input_data)
            st.success(f"Predicted Sleep Quality: **{prediction[0]}** 😴")
    else:
        prediction = mock_predict(input_data)
        st.success(f"Predicted Sleep Quality: **{prediction[0]}** 😴")
        
st.markdown("---")
st.write("Note: This is a demo application. To use a real machine learning model, you need to:")
st.write("1. Install required packages: pip install pandas scikit-learn joblib streamlit")
st.write("2. Run the model training script: python model_train.py")