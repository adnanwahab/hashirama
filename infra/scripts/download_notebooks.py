import requests
import os

default = "https://observablehq.com/d/29574e768ede40b8?collection=@roboticsuniversity/robotics-odyssey"
default_id = "https://observablehq.com/d/29574e768ede40b8?collection=@roboticsuniversity/robotics-odyssey"

# The URL of your Observable collection
collection_url = default_id
#f"https://api.observablehq.com/collection/{default}"

# Create a folder to store downloaded inks
if not os.path.exists("observable_inks"):
    os.makedirs("observable_inks")

# Replace 'collection-id' with the actual collection identifier
response = requests.get(collection_url)

# Process the response to extract notebook information
notebooks = response.json().get('notebooks')

for notebook in notebooks:
    notebook_id = notebook['id']
    notebook_title = notebook['title']

    # Get the notebook's source code
    notebook_response = requests.get(f"https://api.observablehq.com/{notebook_id}.tgz")

    # Save the .tgz file
    with open(f"observable_inks/{notebook_title}.tgz", 'wb') as f:
        f.write(notebook_response.content)

    print(f"Downloaded {notebook_title}")

print("All notebooks downloaded!")
