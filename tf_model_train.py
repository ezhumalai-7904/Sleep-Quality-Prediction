import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Load dataset
df = pd.read_csv("sleep.csv")

print("Dataset loaded successfully!")
print(f"Dataset shape: {df.shape}")
print("\nFirst few rows:")
print(df.head())

# Prepare the data
# Encode categorical variables
label_encoders = {}
categorical_columns = ['Gender', 'Physical Activity Level', 'Dietary Habits', 'Sleep Quality']

for col in categorical_columns:
    le = LabelEncoder()
    df[col + '_encoded'] = le.fit_transform(df[col])
    label_encoders[col] = le

# Select features for training
feature_columns = ['Age', 'Gender_encoded', 'Daily Steps', 'Calories Burned', 
                  'Physical Activity Level_encoded', 'Dietary Habits_encoded']

X = df[feature_columns]
y = df['Sleep Quality_encoded']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train a TensorFlow model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(len(feature_columns),)),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(len(label_encoders['Sleep Quality'].classes_), activation='softmax')
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Train the model
print("\nTraining TensorFlow model...")
history = model.fit(X_train, y_train, 
                    epochs=100, 
                    batch_size=32, 
                    validation_split=0.2,
                    verbose=1)

# Evaluate the model
test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
print(f"\nTest Accuracy: {test_accuracy:.4f}")

# Save the model and encoders
model.save('sleep_tf_model.h5')
joblib.dump(label_encoders, 'label_encoders.pkl')

print("\nModel and encoders saved successfully!")
print("Files created:")
print("- sleep_tf_model.h5 (TensorFlow model)")
print("- label_encoders.pkl (Label encoders for categorical variables)")

# Test prediction
sample_input = X_test.iloc[0:1].values
prediction = model.predict(sample_input)
predicted_class = label_encoders['Sleep Quality'].inverse_transform([prediction.argmax()])
print(f"\nSample prediction: {predicted_class[0]}")