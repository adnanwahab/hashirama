import time
from concurrent.futures import ThreadPoolExecutor, as_completed
#from dotenv import dotenv_values
from openai import OpenAI
import re
#config = dotenv_values("../../infra/.env") 
key = "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"
client = OpenAI(
    api_key=key,
)
import sys

src_file = sys.argv[1] if len(sys.argv) > 1 else '/Users/shelbernstein/hashirama/services/homelab-status-page/static/js/public/HomePage-69247ec2.js'
output_path = sys.argv[2] if len(sys.argv) > 2 else '/Users/shelbernstein/hashirama/services/homelab-status-page/static/js/public/HomePage-2.js'

#query ="please rewrite every path in this html file to be relative to the root of the domain"
query ="please convert every ',' at the end of a jsexpression to a ';' and newline - if it seems like correct js. tyvm "

# Function to append new CSS content to the existing file and measure time
def append_to_file(chunk, index):
    with open(f"{output_path}", 'w') as output_file:
        output_file.write(chunk)
    return chunk

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

def is_valid_html(line):
    # Simple check for HTML-like content
    return re.match(r'^\s*<', line) or re.match(r'^\s*[a-z-]+="', line) or line.strip() == ''

#structured 
def process_chunk(chunk_text, index):
    print("processing chunk" , index)
    chat_completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": query},
            {"role": "user", "content": '\n\n'.join(chunk_text)}

            ]
    )
    remove_non_html_portions = parse_gpt(chat_completion)
    # get only html
    #remove_non_html_portions
    first_index = remove_non_html_portions.index("<")
    last_index = remove_non_html_portions.rfind(">")

    print(f"index for first < {first_index} and  Index of the final '>': {last_index}")
    # extracted_css = extract_css(processed) #local llm
    return remove_non_html_portions[first_index:last_index+1]
    #append_to_file(processed, index)
    #print('im done')
    
# Simulate processing and chunking of final results
def process_chunks_in_parallel(chunks):
    results = []

    start_time = time.time()
    with ThreadPoolExecutor(max_workers=20) as executor:
        future_to_index = {executor.submit(process_chunk, chunk, index): index for index, chunk in enumerate(chunks)}

        for future in as_completed(future_to_index):
            index = future_to_index[future]
            try:
                result = future.result()
                results.append((index, result))
            except Exception as exc:
                print(f'Chunk {index} generated an exception: {exc}')

    results.sort(key=lambda x: x[0])
    final_result = ''.join(result for _, result in results)
    end_time = time.time() 
    
    print(f"Processing chunks took {end_time - start_time:.4f} seconds.")

    # Write the final result to the output file
    with open(output_path, 'w') as output_file:
        output_file.write(final_result)

    return "success"
# Function to split the document into CSS blocks instead of lines
# # Function to split the document into chunks
def split_into_chunks(css):
#    print(css[:1000])
    css_blocks = css.split('\n\n')
    lines_per_chunk = 10
    return [css_blocks[i:i + lines_per_chunk] for i in range(0, len(css_blocks), lines_per_chunk)]
    return css_blocks
    return document.split('\n\n')

# 2. Simulate processing the chunks (you can replace this with actual CSS chunks)
    # Open the file in write mode which will empty the file
with open(src_file, 'r') as output_file:
    chunks = split_into_chunks(output_file.read())
# 3. Process and append each chunk in parallel
    process_chunks_in_parallel(chunks)

#rewrite all code every time blog renders


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