import pickle
from sklearn.tree import DecisionTreeClassifier

# Training data (temperature, humidity → labels)
X = [
    [18, 45], [22, 60], [30, 70], [45, 85], [35, 65], [25, 55]
]
y = ["Too Low", "Optimal", "Optimal", "Too High", "Optimal", "Optimal"]

# Train model
model = DecisionTreeClassifier()
model.fit(X, y)

# Save model with your local scikit-learn version
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model retrained and saved as model.pkl")
