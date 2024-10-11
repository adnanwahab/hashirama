import time
from concurrent.futures import ThreadPoolExecutor
from dotenv import dotenv_values
import argparse

from openai import OpenAI

def parse_arguments():
    parser = argparse.ArgumentParser(description='Process CSS files with OpenAI.')
    #parser.add_argument('--input_file', type=str, required=True, help='Path to the input CSS file.')
    #parser.add_argument('--output_dir', type=str, required=True, help='Directory to save the output files.')
    return parser.parse_args()

args = parse_arguments()

config = dotenv_values("../../infra/.env") 
client = OpenAI(
    api_key=config['openai'],
)

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

query = """
To scope the CSS to .eggnog and its descendant children, you'll need to prefix all the selectors with .eggnog. Here's how you can modify the CSS:

// ... existing code ...

// ... continue this pattern for all selectors ...

be sure to only return css that will validate in the browser - no quotes wrapping the result ty.
"""

def process_chunk(chunk_text, index, output_dir):
    print("processing chunk", index)
    chat_completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": query},
            {"role": "user", "content": '\n\n'.join(chunk_text)}
        ]
    )
    processed = parse_gpt(chat_completion)
    append_to_file(processed, index, output_dir)
    print('im done')

def process_chunks_in_parallel(chunks, output_dir):
    start_time = time.time() 
    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = []
        for index, chunk in enumerate(chunks):
            futures.append(executor.submit(process_chunk, chunk, index, output_dir))
        
        for future in futures:
            future.result()
    end_time = time.time() 
    print(f"Appending chunk to file took {end_time - start_time:.4f} seconds.")

def split_into_chunks(css):
    css_blocks = css.split('\n\n')
    lines_per_chunk = 10
    return [css_blocks[i:i + lines_per_chunk] for i in range(0, len(css_blocks), lines_per_chunk)]

with open(args.input_file, 'r') as output_file:
    chunks = split_into_chunks(output_file.read())
    process_chunks_in_parallel(chunks, args.output_dir)