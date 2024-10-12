import time
from concurrent.futures import ThreadPoolExecutor
from dotenv import dotenv_values

from openai import OpenAI
config = dotenv_values("../../infra/.env") 
client = OpenAI(
    api_key=config['openai'],
)
# Function to append new CSS content to the existing file and measure time
def append_to_file(chunk, index):
    #start_time = time.time()  # Start timing
    
    # First, read the current content of the file
    # with open('../homelab-status-page/static/css/journey-3.css.txt', 'r') as output_file:
    #     current_content = output_file.read()
    
    # # Append the current content to the chunk
    # final_result = current_content + "\n" + chunk
    
    # Write the combined content back to the file
    with open(f"../homelab-status-page/static/css/parallel_chunk_{index}.txt", 'w') as output_file:
        output_file.write(chunk)
    
    #end_time = time.time()  # End timing
    #print(f"Appending chunk {index} to file took {end_time - start_time:.4f} seconds.")
    return chunk

# Function to clear the file (start with a clean slate) and measure time
def empty_file():
    start_time = time.time()  # Start timing
    
    # Open the file in write mode which will empty the file
    with open('../homelab-status-page/static/css/journey-4.css.txt', 'w') as output_file:
        pass  # Opening in 'w' mode automatically clears the file
    
    end_time = time.time()  # End timing
    print(f"Emptying the file took {end_time - start_time:.4f} seconds.")


def parse_gpt(results):
    comp = results
    if len(comp.choices) == 0: 
        return print('No completion available')

    message_content = comp.choices[0].message.content
    return message_content
# https://www.quora.com/profile/Alan-Kay-11
# https://jigsaw.w3.org/css-validator/#validate_by_input
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

.eggnog html,
.eggnog body,
.eggnog div,
.eggnog span,
.eggnog applet,
.eggnog object,
.eggnog iframe,
.eggnog h1,
.eggnog h2,
.eggnog h3,
.eggnog h4,
.eggnog h5,
.eggnog h6,
.eggnog p,
.eggnog blockquote,
.eggnog pre,
.eggnog a,
.eggnog abbr,
.eggnog acronym,
.eggnog address,
.eggnog big,
.eggnog cite,
.eggnog code,
.eggnog del,
.eggnog dfn,
.eggnog em,
.eggnog img,
.eggnog ins,
.eggnog kbd,
.eggnog q,
.eggnog s,
.eggnog samp,
.eggnog small,
.eggnog strike,
.eggnog strong,
.eggnog sub,
.eggnog sup,
.eggnog tt,
.eggnog var,
.eggnog b,
.eggnog u,
.eggnog i,
.eggnog center,
.eggnog dl,
.eggnog dt,
.eggnog dd,
.eggnog ol,
.eggnog ul,
.eggnog li,
.eggnog fieldset,
.eggnog form,
.eggnog label,
.eggnog legend,
.eggnog table,
.eggnog caption,
.eggnog tbody,
.eggnog tfoot,
.eggnog thead,
.eggnog tr,
.eggnog th,
.eggnog td,
.eggnog article,
.eggnog aside,
.eggnog canvas,
.eggnog details,
.eggnog embed,
.eggnog figure,
.eggnog figcaption,
.eggnog footer,
.eggnog header,
.eggnog hgroup,
.eggnog menu,
.eggnog nav,
.eggnog output,
.eggnog ruby,
.eggnog section,
.eggnog summary,
.eggnog time,
.eggnog mark,
.eggnog audio,
.eggnog video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline
}

.eggnog article,
.eggnog aside,
.eggnog details,
.eggnog figcaption,
.eggnog figure,
.eggnog footer,
.eggnog header,
.eggnog hgroup,
.eggnog menu,
.eggnog nav,
.eggnog section {
    display: block
}

.eggnog body {
    line-height: 1;
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    text-size-adjust: 100%
}

.eggnog ol,
.eggnog ul {
    list-style: none
}

.eggnog blockquote,
.eggnog q {
    quotes: none
}

.eggnog blockquote:before,
.eggnog blockquote:after,
.eggnog q:before,
.eggnog q:after {
    content: "";
    content: none
}

.eggnog table {
    border-collapse: collapse;
    border-spacing: 0
}

.eggnog table th {
    text-align: left
}

// ... continue this pattern for all selectors ...



This approach will ensure that all the styles are only applied to elements within the .eggnog class. You'll need to continue this pattern for all the selectors in the file.
A few things to note:
1. Some selectors like html and body might not make sense when scoped to .eggnog. You may want to consider removing or adjusting these.
For pseudo-elements and pseudo-classes, make sure to keep them after the .eggnog class, like this:
  .eggnog .some-class:hover { ... }
   .eggnog .some-class::before { ... }
For media queries, you'll need to nest the .eggnog selector inside:
  @media (max-width: 1300px) {
     .eggnog .some-class { ... }
   }

Be careful with specificity. Adding .eggnog to every selector will increase specificity, which might affect how styles are applied if you have other competing styles.
This will result in a much larger CSS file, as you're essentially duplicating all selectors with the .eggnog prefix.

be sure to only return css that will validate in the browser - no quotes wrapping the result ty.
"""
#Remember to test thoroughly after making these changes to ensure everything still works as expected.

def process_chunk(chunk_text, index):
    print("processing chunk" , index)
    #print(len(chunk_text), index, query)
#    return 123
    chat_completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": query},
            {"role": "user", "content": '\n\n'.join(chunk_text)}

            ]
    )
    processed = parse_gpt(chat_completion)
    # extracted_css = extract_css(processed) #local llm
    append_to_file(processed, index)
    print('im done')
    
# Simulate processing and chunking of final results
def process_chunks_in_parallel(chunks):
    # Use ThreadPoolExecutor to parallelize file appending
    start_time = time.time() 
    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = []
        for index, chunk in enumerate(chunks):
            # Submit the append task to the thread pool
            futures.append(executor.submit(process_chunk, chunk, index))
        
        # Wait for all futures to complete
        for future in futures:
            future.result()  # This will raise exceptions if any occurred during execution
    end_time = time.time() 
    print(f"Appending chunk shit to file took {end_time - start_time:.4f} seconds.")
 

# Example usage:
# 1. To clear the file before appending new content#
#empty_file()

# Function to split the document into CSS blocks instead of lines
# # Function to split the document into chunks
def split_into_chunks(css):
#    print(css[:1000])
    css_blocks = css.split('\n\n')
    lines_per_chunk = 10
    return [css_blocks[i:i + lines_per_chunk] for i in range(0, len(css_blocks), lines_per_chunk)]

    return css_blocks
    return document.split('\n\n')

#rewrite all code every time blog renders

# 2. Simulate processing the chunks (you can replace this with actual CSS chunks)
    # Open the file in write mode which will empty the file
with open('../homelab-status-page/static/css/journey-2.css', 'r') as output_file:
    #print(output_file.read())
    chunks = split_into_chunks(output_file.read())
    print("hello", chunks, 'bye')
# 3. Process and append each chunk in parallel
    process_chunks_in_parallel(chunks)
