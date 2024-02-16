import sys
import requests

API_URL = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct"
headers = {"Authorization": "Bearer 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"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

# Check if the input text is provided as a command line argument
if len(sys.argv) > 1:
    input_text = " ".join(sys.argv[1:])
else:
    # If not provided, use a default input
    print("Usage: python main.py <input_text>")
    sys.exit(1)

output = query({
    "parameters": {
        "max_new_tokens": 100,
        "return_full_text":False
    },
    "inputs": input_text,
    "options": {
        "wait_for_model": True,
    }})

print(output[0]['generated_text'])
