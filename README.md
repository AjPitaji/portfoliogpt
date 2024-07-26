import gradio as gr

# Your query function
def query_function(prompt):
    # Your implementation here
    response = "Processed response for: " + prompt
    return response

# Creating the Gradio chat interface using Blocks
with gr.Blocks() as demo:
    chat_box = gr.Chatbot()
    msg = gr.Textbox(placeholder="Enter your prompt here...")
    submit_btn = gr.Button("Submit")

    def respond(user_input, chat_history):
        response = query_function(user_input)
        chat_history.append((user_input, response))
        return chat_history, ""

    submit_btn.click(respond, [msg, chat_box], [chat_box, msg])

# Launch the interface
demo.launch()