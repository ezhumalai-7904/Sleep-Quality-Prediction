import pandas as pd
import tensorflow as tf
import numpy as np
import json

# Load dataset
df = pd.read_csv("sleep.csv")

print("Dataset loaded successfully!")
print(f"Dataset shape: {df.shape}")
print("\nFirst few rows:")
print(df.head())

# Prepare the data using only pandas and TensorFlow
# Encode categorical variables manually
def encode_categorical(df, column):
    unique_values = df[column].unique()
    mapping = {val: i for i, val in enumerate(unique_values)}
    encoded = df[column].map(mapping)
    return encoded, mapping

# Encode all categorical columns
gender_encoded, gender_map = encode_categorical(df, 'Gender')
activity_encoded, activity_map = encode_categorical(df, 'Physical Activity Level')
diet_encoded, diet_map = encode_categorical(df, 'Dietary Habits')
sleep_encoded, sleep_map = encode_categorical(df, 'Sleep Quality')

# Create feature matrix
X = np.column_stack([
    df['Age'].values,
    gender_encoded.values,
    df['Daily Steps'].values,
    df['Calories Burned'].values,
    activity_encoded.values,
    diet_encoded.values
])

y = sleep_encoded.values

# Convert to TensorFlow tensors
X = tf.constant(X, dtype=tf.float32)
y = tf.constant(y, dtype=tf.int32)

# Split data manually (80% train, 20% test)
split_idx = int(0.8 * len(X))
X_train, X_test = X[:split_idx], X[split_idx:]
y_train, y_test = y[:split_idx], y[split_idx:]

# Create and train a TensorFlow model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(6,)),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(len(sleep_map), activation='softmax')
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

# Save the model
model.save('sleep_tf_model.h5')

# Save the encoders as JSON
encoders = {
    'gender_map': gender_map,
    'activity_map': activity_map,
    'diet_map': diet_map,
    'sleep_map': sleep_map
}

with open('encoders.json', 'w') as f:
    json.dump(encoders, f)

print("\nModel and encoders saved successfully!")
print("Files created:")
print("- sleep_tf_model.h5 (TensorFlow model)")
print("- encoders.json (Label encoders for categorical variables)")

# Test prediction
sample_input = X_test[0:1]
prediction = model.predict(sample_input)
predicted_class_idx = np.argmax(prediction)
# Convert back to class name
predicted_class = [k for k, v in sleep_map.items() if v == predicted_class_idx][0]
print(f"\nSample prediction: {predicted_class}")