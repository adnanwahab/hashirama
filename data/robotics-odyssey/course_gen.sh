jq -r '.modules[].topics[].title | gsub(" "; "-") | ascii_downcase | gsub("[^a-z0-9-]"; "") + ".json"' data/robotics-odyssey/modules.json
for filename in $(jq -r '.modules[].topics[].title | gsub(" "; "-") | ascii_downcase | gsub("[^a-z0-9-]"; "") + ".md"' data/robotics-odyssey/modules.json); do
      echo "{}" > "data/robotics-odyssey/$filename"
done