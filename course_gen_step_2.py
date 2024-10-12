import time
from concurrent.futures import ThreadPoolExecutor
from openai import OpenAI
import os
import argparse
openai_api_key = os.getenv('OPENAI_KEY')

client = OpenAI(
    api_key=openai_api_key,
)

query = "gen a markdown of example markdown about the robotics topic " 
input_dir =  "data/robotics-odyssey"


def append_to_file(chunk, index, output_dir):
    with open(f"{output_dir}/parallel_chunk_{index}.txt", 'w') as output_file:
        output_file.write(chunk)
    return chunk

def empty_file(output_dir):
    start_time = time.time()
    with open(f'{output_dir}/journey-4.css.txt', 'w') as output_file:
        pass
    end_time = time.time()
    print(f"Emptying the file took {end_time - start_time:.4f} seconds.")

def parse_gpt(results):
    comp = results
    if len(comp.choices) == 0:
        return print('No completion available')

    message_content = comp.choices[0].message.content
    return message_content

def extract_css(input_text):
    start_marker = "```"
    end_marker = "\n"

    start_idx = input_text.find(start_marker) + len(start_marker)
    end_idx = input_text.find(end_marker)

    css_content = input_text[start_idx:end_idx]
    return css_content


def split_into_chunks(css):
    css_blocks = css.split('\n\n')
    lines_per_chunk = 10
    return [css_blocks[i:i + lines_per_chunk] for i in range(0, len(css_blocks), lines_per_chunk)]

import os

def process_chunk(filename, content, index):
    print("processing chunk", index)

    chat_completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": query + os.path.basename(filename)},
            {"role": "user", "content": content}
        ]
    )  # Fixed indentation and added closing parenthesis
    processed = parse_gpt(chat_completion)
    print("writing to", filename)  # Corrected spelling from "wiriting" to "writing"
    output_dir= "course_content/docs"
    with open(f"{output_dir}/{os.path.basename(filename)}", 'w') as file:
        file.write(processed)
    # return processed
# is jupyter a thing? try collarobaroty - add currsor - to obs+jpy - (LLM_prediciton_planning, cgi, hardware) 
# add in dict types from fastapi - 
def process_all_files_in_directory(directory_path):
    files = [os.path.join(directory_path, filename) for filename in os.listdir(directory_path) if filename.endswith('.md')]
    file_contents = [open(file_path, 'r').read() for file_path in files] 
    file_dict = {file_path: content for file_path, content in zip(files, file_contents)}
    start_time = time.time()
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = []
        for index, (filename, content) in enumerate(file_dict.items()):
            print(f"File {index}: {filename} with content length {len(content)}")
            futures.append(executor.submit(process_chunk, filename, content, index))

        for future in futures:
            future.result()
    end_time = time.time()
    print("processing all files in directory took", end_time - start_time, "seconds")

process_all_files_in_directory(input_dir)
# augment this file to pass in 1tb of embeddings to llama / anthropic / openai



# (read 5000 research papers + 2 best ourses) -> (gen diagrams) + 1 paragraph per diaagram.


# def parse_arguments():
#     parser = argparse.ArgumentParser(description='Process html files with OpenAI.')

#     parser.add_argument('--query', type=str, required=True, help='Query to send to the LLM.')
#     parser.add_argument('--input_dir', type=str, required=True, help='',)
#     parser.add_argument('--output_dir', type=str, required=True, help='.')

#     return parser.parse_args()


# query = args.query
# input_dir = args.input_dir
# output_dir = args.output_dir
# judgment / design / choice / 
# Initialize the OpenAI client with the API key
# Retrieve the OpenAI API key from the environment variable
