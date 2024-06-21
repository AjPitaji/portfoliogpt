import openai

# Replace with your OpenAI API key
api_key = "YOUR_API_KEY_HERE"

# Set your OpenAI API key
openai.api_key = api_key

def get_gpt35_response(prompt, model="text-davinci-003", max_tokens=100):
    response = openai.Completion.create(
        engine=model,
        prompt=prompt,
        max_tokens=max_tokens
    )
    return response.choices[0].text.strip()

# Example usage
if __name__ == "__main__":
    prompt = "Write a poem about the sea."
    response = get_gpt35_response(prompt)
    print(response)