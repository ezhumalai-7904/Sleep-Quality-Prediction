import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
df = pd.read_csv("sleep.csv")

# Encode categorical columns
df = pd.get_dummies(df, drop_first=True)

# Split data
X = df.drop('Sleep Quality', axis=1)
y = df['Sleep Quality']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = LogisticRegression()
model.fit(X_train, y_train)

# Predict and evaluate
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# Save the trained model
joblib.dump(model, 'sleep_model.pkl')
print("Model saved as sleep_model.pkl")