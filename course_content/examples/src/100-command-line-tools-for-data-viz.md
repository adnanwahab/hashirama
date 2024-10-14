# 100+ Command Line Tools for Data Visualization

Prepared for my talk at [2022 Outlier](https://outlierconf.com/), but should be useful for all!

While these tools may not all work with data viz directly, they would help with your data visualization *process*. This may include:

- Data cleaning/wrangling
- Exploring a dataset
- Sending/sharing data with others
- Translating/converting a dataset into different filetypes
- Making the terminal not unbearable

Feel free to send suggestions and comments to add new tools and categories!

```js
toc("h2,h3,h4")
```

## GOAT tools

Greatest of all time CLI tools for data viz!

- [pbcopy, pbpaste](https://osxdaily.com/2007/03/05/manipulating-the-clipboard-from-the-command-line/) - cut + paste to your clipboard from the command line (MacOS, but other operating system have their own)
- [visidata](https://www.visidata.org/) - an "interactive multitool for tabular data", including CSVs, SQLite databases, JSON, Excel, logs, etc.
- [jq](https://stedolan.github.io/jq/) + [fx](https://github.com/antonmedv/fx), because JSON is so versatile


## Working with...

Tools that work/handle specific file types!



### JSON

- [jq](https://stedolan.github.io/jq/) - "lightweight and flexible command-line JSON processor"
- [fx](https://github.com/antonmedv/fx) - interactive JSON viewer, works with your mouse!
- [jless](https://github.com/PaulJuliusMartinez/jless) - a powerful pager for JSON
- [ndjson-cli](https://github.com/mbostock/ndjson-cli) - several tools for newline-delimited JSON files and pipes
- [dvs2json, csv2json](https://github.com/d3/d3-dsv) - CSV, TSV, and whateverSV files to JSON

### CSV
- [xsv](https://github.com/BurntSushi/xsv) - fast CSV toolkit
- [csvkit](https://csvkit.readthedocs.io/en/latest/) - several tools for filtering, reformating, querying, and manipulating CSVs
- [csvs-to-sqlite](https://github.com/simonw/csvs-to-sqlite) - convert a directory of CSVs to SQLite database


### Cartography/Geography/Maps
- [mapshaper](https://github.com/mbloch/mapshaper) convert from various cartographic file formats (shapefiles, GeoJSON, SVGs, etc)
- [topojson-server](https://github.com/topojson/topojson-server#command-line-reference) generate TopoJSON files
- [topojson-client](https://github.com/topojson/topojson-client#command-line-reference) manipulate TopoJSON files
- [shapefile](https://github.com/mbostock/shapefile#command-line-reference) - shapefiles -> GeoJSON and dBASE files -> GeoJSON
- [gdal](https://gdal.org/programs/index.html) - extensive toolkit for raster and vector geospatial data


### Images and Videos
- [ffmpeg](https://ffmpeg.org/) - convert, clip, manipulate video and audio clips
- [imagemagick](https://imagemagick.org/index.php) - manipulate, covert, stitch together images
- [editly](https://github.com/mifi/editly) - edit and stitch together video clips
- [exiftool](https://exiftool.org/exiftool_pod.html)  - read and write EXIF metadata  from images


### PDFs

Everyone's *favorite* file format...
- [pdfplumber](https://github.com/jsvine/pdfplumber) - PDF -> text, extracting tables
- [pdfcat](https://github.com/mstamy2/PyPDF2/blob/master/Scripts/pdfcat) - concatenate PDFs together
- [imagemagick](https://imagemagick.org/script/command-line-processing.php) - images -> PDF, or PDF pages -> images
- [termpdf.py](https://github.com/dsanson/termpdf.py) - read PDFs from the command line (requires kitty terminal)

### HTML

- [htmlq](https://github.com/mgdm/htmlq) - "Like jq, but for HTML"
- [pup](https://github.com/EricChiang/pup) - Another jq~HTML alternative

## Data Visualization

### Data Viz in the command line

Data visualization components for use in CLI tools

- [you-plot](https://github.com/red-data-tools/YouPlot) - "A command line tool that draw plots on the terminal."
- [termgraph](https://github.com/mkaz/termgraph) - "a python command-line tool which draws basic graphs in the terminal"
- [histo](https://github.com/tj/histo) - "Plot charts in the terminal with arbitrary streaming or non-streaming data"
- [tqdm](https://tqdm.github.io/docs/cli/) - progress bar

### Command line in data viz workflows

CLI tools that help with creating data visualizations

- [observable-prerender](https://github.com/asg017/observable-prerender) - pre-render Observable notebooks for automation (disclaimer, this is my project)
- [d3-pre](https://github.com/fivethirtyeight/d3-pre) pre-render D3 visualizations (2016)
- [svgo](https://github.com/svg/svgo) - pre-optimize SVGs before publishing

## Getting/Scraping Data

- [playwright](https://playwright.dev/docs/cli/) - Browser automation for scraping, automation, and pre-rendering
- [httpie](https://httpie.io/cli) - friendlier curl alternative
- [youtube-dl](https://github.com/ytdl-org/youtube-dl) - download videos and MP3s from Youtube and other popular sites (also [yt-dlp](https://github.com/yt-dlp/yt-dlp))
- [fastfec](https://github.com/washingtonpost/FastFEC) - download and parse United States FEC filings
- [mergestat](https://www.mergestat.com/) - git and GitHub data
- [t](https://github.com/sferik/t) - Twitter data
- [twarc](https://github.com/DocNow/twarc) - Twitter data
- [twitter-to-sqlite](https://github.com/dogsheep/twitter-to-sqlite) - Twitter data

## Building CLI Tools

### Textual User Interfaces (TUIs)

Frameworks that build rich and interactive TUIs

- [blessed](https://github.com/chjj/blessed) - React for the terminal (Node.js)
- [ink](https://github.com/vadimdemedes/ink) - React for the terminal, different API (Node.js)
- [bubbletea](https://github.com/charmbracelet/bubbletea) - general purpose TUI framework (Go)
- [textual](https://github.com/willmcgugan/textual) - general purpose TUI framework (Python)

### Progress Bars

A simple, time-tested data visualization component for the terminal

- [tqdm](https://github.com/tqdm/tqdm) - (Python)
- [progress](https://github.com/verigak/progress) - (Python)
- [python-progressbar](https://github.com/WoLpH/python-progressbar) - (Python)
- [cli-progress](https://www.npmjs.com/package/cli-progress) - (Node.js)
- [terminal-kit](https://www.npmjs.com/package/terminal-kit) - (Node.js)
- [log-update](https://www.npmjs.com/package/log-update) - update lines of text (Node.js)
- [progress](https://github.com/r-lib/progress) - (R)

## Help + Manual pages

Don't go at the command line alone!
- [tldr](https://github.com/tldr-pages/tldr) - "Collaborative cheatsheets for console commands"
- [cheat](https://github.com/cheat/cheat) - interactive cheatsheets of command CLI tools
- [explainshell](https://github.com/idank/explainshell) - "match command-line arguments to their help text"

## Sending + Encrypting datasets

- [croc](https://github.com/schollz/croc) - "Easily and securely send things from one computer to another 🐊 📦" (scp alternative)
- [age](https://github.com/FiloSottile/age) - "A simple, modern and secure encryption tool (and Go library) with small explicit keys, no config options, and UNIX-style composability."
- [rclone](https://github.com/rclone/rclone) - backup and send files between Google Drive, Dropbox, S3, One Drive, etc.
- [minIO](https://docs.min.io/docs/minio-client-quickstart-guide.html) - UNIX-like commands and tools for S3-compatible objects


## Unix Alternatives

Tools that replace 80's era tools you probably use every day!

- [ripgrep](https://github.com/BurntSushi/ripgrep) - fancy grep alternative
- [bat](https://github.com/sharkdp/bat) - cat alt, with fancy syntax highlighting!
- [exa](https://github.com/ogham/exa) - list files and directories, ls alt
- [broot](https://dystroy.org/broot) - tree/ls alternative
- [jc](https://github.com/kellyjonbrazil/jc) - JSONify command Unix commands for piping
- [htop](https://github.com/htop-dev/htop) - process viewer, ps alt
- [hexyl](https://github.com/sharkdp/hexyl) - hex viewer, xxd alt
- [duf](https://github.com/muesli/duf) - disk usage, df alt
- [fzf](https://github.com/junegunn/fzf) - fuzzy finder alt
- [zoxide](https://github.com/ajeetdsouza/zoxide/) - cd alt
- [fd](https://github.com/sharkdp/fd) - find alt

## For developers

- [gh](https://cli.github.com/) - Github CLI
- [cookiecutter](https://github.com/cookiecutter/cookiecutter) - create projects from pre-made templates
- [gitignore](https://github.com/github/gitignore/blob/main/Node.gitignore) - generate gitignore files for common programming languages and projects
- [htop](https://htop.dev/) - "an interactive process viewer", good for monitoring CPU/memory usage during heavy data processing
- [hyperfine](https://github.com/sharkdp/hyperfine) - for benchmarking different CLI tools
- [caniuse](https://github.com/sgentle/caniuse-cmd) - lookup browser features for https://caniuse.com (maybe out of date)
- [lazygit](https://github.com/jesseduffield/lazygit) - TUI for common git workflows
- [starship](https://starship.rs/) - easy, fast, and cool-looking terminal prompts!
- [zx](https://github.com/google/zx) - shell scripting alternative in Node.js

## Terminal applications

Replace your standard builtin terminal with something fancier!

- [Windows terminal](https://github.com/microsoft/terminal) - new fancy terminal manager for Windows only
- [fig](https://fig.io/) - friendly terminal with builtin help, autocomplete, and recipes
- [kitty](https://sw.kovidgoyal.net/kitty/) - fast, customizable, extensible terminal
- [warp.dev](https://www.warp.dev/) - new terminal with many builtin features

## Recommended Reading

Across various fields of interest!

### Building CLIs

- [12 Factor CLI Apps](https://medium.com/@jdxcode/12-factor-cli-apps-dd3c227a0e46) - tips and guides for building CLIs
- [Command Line Interface Guidelines](https://clig.dev/) - Comprehensive guide for CLIs
- [the-art-of-command-line](https://github.com/jlevy/the-art-of-command-line) - another CLI guide
- [Bringing the Unix Philosophy to the 21st Century
](https://blog.kellybrazil.com/2019/11/26/bringing-the-unix-philosophy-to-the-21st-century/) - jc intro  and importance of JSON output
- [Tips on Adding JSON Output to Your CLI App](https://blog.kellybrazil.com/2021/12/03/tips-on-adding-json-output-to-your-cli-app/)

### Cartography
- [Command-Line Cartography](https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c) - a series on using D3, TopoJSON, and ndjson-cli to make population heat maps
- [Command Carto – The Terminal](https://moriartynaps.org/command-carto-part-one/) - a fun and gentle intro to command carto CLI tools

### Journalists/News Nerds
- [Tweet + thread from Gurman Bhatia](https://twitter.com/GurmanBhatia/status/1436030551241023489) of common command line tools used by data reporters and news developers
- [Data Science at the Command Line](https://datascienceatthecommandline.com/2e/index.html)

---

```js echo
import { toc } from "@nebrius/indented-toc"
```
