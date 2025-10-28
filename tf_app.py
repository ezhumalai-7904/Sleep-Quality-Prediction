import streamlit as st
import pandas as pd
import tensorflow as tf
import numpy as np
import json
import os

# Load the trained model and encoders
@st.cache_resource
def load_model_and_encoders():
    if os.path.exists('sleep_tf_model.h5') and os.path.exists('encoders.json'):
        model = tf.keras.models.load_model('sleep_tf_model.h5')
        with open('encoders.json', 'r') as f:
            encoders = json.load(f)
        return model, encoders
    else:
        return None, None

model, encoders = load_model_and_encoders()

st.title("😴 Sleep Quality Prediction ")
st.write("Predict your sleep quality based on your daily habits!")

# Collect user inputs
age = st.number_input("Age", min_value=10, max_value=100, step=1, value=30)
gender = st.selectbox("Gender", ["Male", "Female"])
steps = st.number_input("Daily Steps", min_value=0, value=5000)
calories = st.number_input("Calories Burned", min_value=0, value=2000)
activity = st.selectbox("Physical Activity Level", ["Low", "Moderate", "High"])
diet = st.selectbox("Dietary Habits", ["Poor", "Average", "Healthy"])

# Function to provide sleep and activity suggestions
def get_suggestions(sleep_quality):
    suggestions = {
        "Excellent": {
            "sleep_hours": "7-9 hours",
            "physical_activity": "150+ minutes of moderate exercise per week",
            "message": "Your sleep quality is excellent! Keep up the good work."
        },
        "Good": {
            "sleep_hours": "7-9 hours",
            "physical_activity": "150+ minutes of moderate exercise per week",
            "message": "Your sleep quality is good!"
        },
        "Fair": {
            "sleep_hours": "8-10 hours",
            "physical_activity": "100-150 minutes of moderate exercise per week",
            "message": "Your sleep quality could be improved."
        },
        "Poor": {
            "sleep_hours": "9-11 hours",
            "physical_activity": "50-100 minutes of moderate exercise per week",
            "message": "Your sleep quality needs attention."
        }
    }
    return suggestions.get(sleep_quality, suggestions["Poor"])

# Predict button
if st.button("Predict Sleep Quality"):
    if model is not None and encoders is not None:
        try:
            # Encode the inputs
            gender_encoded = encoders['gender_map'].get(gender, 0)
            activity_encoded = encoders['activity_map'].get(activity, 0)
            diet_encoded = encoders['diet_map'].get(diet, 0)
            
            # Create input array
            input_data = np.array([[age, gender_encoded, steps, calories, activity_encoded, diet_encoded]], dtype=np.float32)
            
            # Make prediction
            prediction = model.predict(input_data)
            predicted_class_idx = np.argmax(prediction)
            
            # Convert back to class name
            sleep_quality = [k for k, v in encoders['sleep_map'].items() if v == predicted_class_idx][0]
            
            # Get confidence
            confidence = prediction[0][predicted_class_idx] * 100
            
            # Simplified output: Good or Bad
            if sleep_quality in ["Excellent", "Good"]:
                st.success(f"Sleep Quality: **Good** 😴")
            else:
                st.error(f"Sleep Quality: **Bad** 😴")
            
            st.info(f"Confidence: {confidence:.2f}%")
            
            # Provide suggestions
            suggestions = get_suggestions(sleep_quality)
            st.subheader("Recommendations:")
            st.write(f"• Aim for {suggestions['sleep_hours']} of sleep per night")
            st.write(f"• Do {suggestions['physical_activity']}")
            st.write(f"• {suggestions['message']}")
            
            # Show detailed prediction
            with st.expander("See detailed prediction"):
                st.subheader("Prediction Probabilities")
                prob_df = pd.DataFrame({
                    'Sleep Quality': list(encoders['sleep_map'].keys()),
                    'Probability': [f"{p*100:.2f}%" for p in prediction[0]]
                })
                st.table(prob_df)
            
        except Exception as e:
            st.error(f"Error making prediction: {str(e)}")
            st.info("Using rule-based prediction instead:")
            
            # Simple rule-based prediction as fallback
            if steps > 8000 and calories > 2500 and activity in ['Moderate', 'High'] and diet == 'Healthy':
                prediction_result = "Good"
            elif steps > 6000 and calories > 2000 and diet in ['Average', 'Healthy']:
                prediction_result = "Bad"
            else:
                prediction_result = "Bad"
                
            if prediction_result == "Good":
                st.success(f"Sleep Quality: **Good** 😴 (Rule-based)")
            else:
                st.error(f"Sleep Quality: **Bad** 😴 (Rule-based)")
                
            # Provide general suggestions
            st.subheader("Recommendations:")
            st.write("• Aim for 7-9 hours of sleep per night")
            st.write("• Do 150+ minutes of moderate exercise per week")
            st.write("• Maintain a healthy diet")
            
    else:
        st.warning("Trained model not found. Using rule-based prediction:")
        
        # Simple rule-based prediction
        if steps > 8000 and calories > 2500 and activity in ['Moderate', 'High'] and diet == 'Healthy':
            prediction_result = "Good"
        elif steps > 6000 and calories > 2000 and diet in ['Average', 'Healthy']:
            prediction_result = "Bad"
        else:
            prediction_result = "Bad"
            
        if prediction_result == "Good":
            st.success(f"Sleep Quality: **Good** 😴 (Rule-based)")
        else:
            st.error(f"Sleep Quality: **Bad** 😴 (Rule-based)")
            
        # Provide general suggestions
        st.subheader("Recommendations:")
        st.write("• Aim for 7-9 hours of sleep per night")
        st.write("• Do 150+ minutes of moderate exercise per week")
        st.write("• Maintain a healthy diet")

st.markdown("---")
st.write("Note: This application uses a TensorFlow neural network model trained on your sleep data.")
st.write("The model was trained with the following accuracy:")
if model is not None:
    st.write("- Validation accuracy: ~75%")
else:
    st.write("- Model not available (using rule-based predictions)")