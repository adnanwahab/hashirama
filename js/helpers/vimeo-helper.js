//


// mkdir -p output_frames

// # Find all segments and use xargs to run 20 parallel processes.
// find segments/ -name "*.mp4" | xargs -P 20 -I {} bash -c '
//   ffmpeg -i "{}" -vf "fps=30" output_frames/$(basename {} .mp4)_frame_%04d.png
// '
