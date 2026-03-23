from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
# Enable CORS so the local frontend (index.html, probably on a different origin if run via live server or file://) can talk to this API
CORS(app)

@app.route('/api/generate-reading', methods=['POST'])
def generate_reading():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data['text']
    words = text.split()
    
    if len(words) > 300:
        return jsonify({"error": "Text is too long. Please provide up to 200 words."}), 400
        
    if len(words) < 10:
        return jsonify({"error": "Text is too short. Please provide at least 10 words."}), 400

    # Simulate AI processing time
    time.sleep(1.5)

    # In a real app, you would pass `text` to an LLM like Google Gemini here.
    # For now, we return a simulated dummy response.
    
    response_data = {
        "passage": text,
        "questions": [
            {
                "id": "q1",
                "type": "multiple-choice",
                "question": "What is the general tone or main topic of this passage?",
                "options": [
                    "It discusses a complex scientific theory.",
                    "It provides general information or narrative based on the provided text.",
                    "It is a fictional story about space travel.",
                    "It is a recipe for baking a cake."
                ],
                "answer": 1, # index of correct option (0-based)
                "explanation": "Since this is a simulated response, we assume the text provides some general information."
            },
            {
                "id": "q2",
                "type": "vocabulary",
                "word": words[len(words)//2] if words else "word", # Pick a word from the middle
                "question": f"In the context of the passage, what might the word '{words[len(words)//2] if words else 'it'}' be related to?",
                "options": [
                    "A type of food",
                    "A location",
                    "An idea or object mentioned in the text",
                    "A completely unrelated concept"
                ],
                "answer": 2,
                "explanation": "Words in context usually relate to the concepts discussed in the text."
            },
            {
                "id": "q3",
                "type": "true-false",
                "question": "The provided text contains more than 5 words.",
                "options": ["True", "False"],
                "answer": 0,
                "explanation": "We validate that the text has at least 10 words, so this is True."
            }
        ]
    }

    return jsonify(response_data)

if __name__ == '__main__':
    print("Starting AI Reading Generator API on port 5000...")
    app.run(debug=True, port=5000)
