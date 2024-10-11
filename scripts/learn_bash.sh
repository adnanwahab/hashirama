json_array=(
    "voice_reactive_particles"
    "stixels_voxels"
    "git_viusalizer"
    "figma to animation"
    "ig-generation-flux"
    "kill-math"
    "drone_map"
    "scene_reconstruction"
    "nerf"
)

mkdir -p views/cgi

for name in "${json_array[@]}"; do
    # Replace spaces with underscores and remove parentheses for valid filenames
  sanitized_name=$(echo "$name" | sed 's/[ ()]//g' | tr ' ' '_')

  touch "views/cgi/${sanitized_name}.html"
done

# auto alias
# auto key managnement
