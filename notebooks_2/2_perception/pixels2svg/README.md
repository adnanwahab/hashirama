# pixels2svg <sub><sup>v0.2.2</sup></sub>

### Convert pixels to SVG square-based shapes.

<img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/pixels2svg.png" width="512" />

There are a few open source tools around that do bitmap -> vector _tracing_,
for instance [potrace](http://potrace.sourceforge.net) which is the engine 
used by [Inkscape](https://inkscape.org) and also has available python 
bindings ([pypotrace](https://pypi.org/project/pypotrace/)).

But sometimes, what you want is the exact bitmap data, but as a set of 
SVG shapes, that you could for instance:
- enlarge for big prints
- use as input paths for a wood laser cutter
- customize in a vector graphics software (edit opacity, contours, overlay 
  on some background image etc.)

Medical image segmentation is another typical use case where one has 
pretty low-res images and sometimes needs to display them best for data 
visualization/presentation purposes. In this case, an SVG overlay with 
editable contours and opacity can be convenient.

This package enables you to easily convert your bitmap image to its 
equivalent SVG representation, each path of the SVG being a polygon made of 
adjacent pixels of same color merged together.

It is inspired of [Florian Berger](https://github.com/florian-berger)'s 
[pixel2svg](https://florian-berger.de/en/software/pixel2svg) package 
(GitHub fork available [here](https://github.com/cyChop/pixel2svg-fork)), 
which is pretty old (python2) and doesn't merge adjacent pixels of same color, 
making the SVG pretty tedious to edit in vector graphics softwares.


## Requirements
- Python >= __3.7__

---

## Dependencies
- [svgwrite](https://github.com/mozman/svgwrite)
- [PIL](https://github.com/python-pillow/Pillow)
- [scipy](https://github.com/scipy/scipy)
- [cc3d](https://github.com/seung-lab/connected-components-3d)

---

## Install
```
pip install pixels2svg
```
or directly from Github:
```pixels2svg
pip install git+git://github.com/ValentinFrancois/pixels2svg#egg=pixels2svg
```

---

## Usage
### CLI
```
python3 -m pixels2svg [-h] [--output <path>] [--color_tolerance <int>] [--remove_background]
                      [--background_tolerance <float>] [--maximal_non_bg_artifact_size <float>]
                      [--no_group_by_color] [--no_pretty]
                      <input_path>

pixels2svg CLI

positional arguments:
  <input_path>          Path to the input bitmap image (anything supported by PIL.Image).

optional arguments:
  -h, --help            Show this help message and exit
  --output <path>, -o <path>
                        Path to the output SVG image.
                        If not passed, will print the output in the terminal.
  --color_tolerance <int>, -c <int>
                        Color tolerance (1 = the smallest luminosity difference i.e. a difference of 1 on the
                        Blue channel).
  --remove_background, -b
                        If the input image has a solid background, will try to remove it.
  --background_tolerance <float>
                        (Only relevant when `remove_background = True`)
                        Arbitrary quantity of blur use to remove noise - just fine-tune the value if the
                        default (1.0) doesn't work well.
                        0 means no blur will be used.
  --maximal_non_bg_artifact_size <float>
                        (Only relevant when `remove_background = True`)
                        When a blob of pixels is clone enough to the detected image contours and below this
                        threshold, it won't be considered as background.
                        Combined with `background_tolerance`, this allows you to control how progressive the
                        background detection should be with blurred contours.
                        Size is expressed in % of total image pixels.
  --no_group_by_color   Do not group shapes of same color together inside <g> tags.
  --no_pretty           Do not pretty-write the SVG code.
```

### In Python

#### Simple usage
```python
from pixels2svg import pixels2svg

pixels2svg('input.png', 'output.svg')
```

`pixels2svg()` accepts a few optional arguments that should help you 
integrate it best within your codebase:

<div style="background-color: rgba(255, 255, 255, 0.05); padding: 0px 10px 2px 10px;">

<span style="text-decoration:underline; font-weight: bold; ">Parameters</span>


- **`input_path`** : `str`
  <br/>Path of the input bitmap image


- **`output_path`** : `Optional[str]`
  <br/>Path of the output SVG image (optional). If passed, the function will return None.
  <br/>If not passed, the function will return the SVG data as a `str` or a `Drawing` depending on the `as_string` parameter.


- **`group_by_color`** : `bool`
  <br/>If True (default), group same-color shapes under SVG elements.


- **`color_tolerance`**: `int`
 <br/>Optional tolerance parameter that defines if adjacent pixels of close colors should be merged together in a single SVG shape. 
 <br/>Tolerance is applied based on luminosity. 1 represents the smallest difference of luminosity, i.e. a difference of 1 in the Blue channel.


- **`remove_background`**: `bool`
 <br/>If True, tries to remove the background before the conversion to SVG (default False). 
 <br/>Simple technique based on contour detection, probably won't work well with complex images.


- **`background_tolerance`**: `float`
 <br/>(Only relevant when remove_background = True) 
 <br/>Arbitrary quantity of blur use to remove noise - just fine-tune the value if the default (1.0) doesn't work well.
 <br/>0 means no blur will be used.


- **`maximal_non_bg_artifact_size`**: `float`
 <br/>(Only relevant when remove_background = True) 
 <br/>When a blob of pixels is clone enough to the detected image contours, and below this threshold, it won't be considered as background.
 <br/>Combined with background_tolerance, this allows you to control how progressive the background detection should be with blurred contours.
 <br/>Size is expressed in % of total image pixels.


- **`as_string`** : `bool`
  <br/>If True and no `output_path` is passed, return a `str` representing the SVG data.


- **`pretty`** : `bool`
  <br/>If True (default), output SVG code is pretty-printed.


<span style="text-decoration:underline; font-weight: bold; ">Returns</span>


- `Optional[Union[svg.Drawing, str]]`
  <br/>Depends on the `output_path` and `as_string` parameters

</div>

#### Advanced usage

By setting `output_path=None` and `as_string=False`, you can get an object 
inheriting [svgwrite.Drawing](https://svgwrite.readthedocs.io/en/latest/classes/drawing.html), 
with the additional useful methods: 

- `def save_to_path(self, path: str, pretty: bool = False)`
- `def to_string(self, pretty: bool = False) ‑> str`

This gives you access to the `svgwrite` API to modify the output programmatically.

See advanced examples in [examples](https://github.com/ValentinFrancois/pixels2svg/tree/main/examples).

---

## Examples

### Example 1 - vectorize and edit pixel art ([source](https://github.com/ValentinFrancois/pixels2svg/blob/main/examples/sword_outline.py))
| File                                                 | Preview                                                                                                                              |
|------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Original PNG image <br/>(32×32)                      | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/sword.png"  width="32" height="32"/>             | 
| Original PNG image <br/>(browser enlarged)           | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/sword.png"  width="256" height="256"/>           |
| Output SVG image                                     | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/sword_converted.svg"  width="256" height="256"/> | 
| Output SVG image with <br/>customized contour style  | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/sword_outline.svg" width="256" height="256"/>    |

### Example 2 - brain scan + segmentation overlay ([source](https://github.com/ValentinFrancois/pixels2svg/blob/main/examples/brain_overlay.py))
| File                                                                              | Preview                                                                                                                               |
|-----------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| Scan image (PNG)                                                                  | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/brain.png" width="256" height="256"/>             |
| Segmentation overlay (PNG)                                                        | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/overlay.png" width="256" height="256"/>           |
| Converted SVG segmentation overlay                                                | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/overlay_converted.svg" width="256" height="256"/> |
| Converted SVG overlayed on PNG scan <br/>with customized opacity & contour style  | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/brain_overlay.svg" width="256" height="256"/>     | 


### Example 3 - vectorize pixel art and remove background ([source](https://github.com/ValentinFrancois/pixels2svg/blob/main/examples/spaceships.py))
| File                                        | Preview                                                                                                                         |
|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Original PNG image <br/>(256×256)           | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/spaceships.png" width="256" height="256"/>  |
| Output SVG image <br/>(background removed)  | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/spaceships.svg" width="256" height="256"/>  |


### Example 4 - vectorize sprite with gradients and reduce number of colors  ([source](https://github.com/ValentinFrancois/pixels2svg/blob/main/examples/fireball.py))
| File                                              | Preview                                                                                                                                    |
|---------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Original PNG image <br/>(150×150)                 | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/fireball.png" width="256" height="256"/>               |
| Output SVG image <br/>(color tolerance: **0**)    | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/fireball_tolerance_0.svg" width="256" height="256"/>   |
| Output SVG image <br/>(color tolerance: **64**)   | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/fireball_tolerance_64.svg" width="256" height="256"/>  |
| Output SVG image <br/>(color tolerance: **128**)  | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/fireball_tolerance_128.svg" width="256" height="256"/> |
| Output SVG image <br/>(color tolerance: **256**)  | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/fireball_tolerance_256.svg" width="256" height="256"/> |
| Output SVG image <br/>(color tolerance: **512**)  | <img src="https://raw.githubusercontent.com/ValentinFrancois/pixels2svg/main/images/fireball_tolerance_512.svg" width="256" height="256"/> |

---

## Limitations

The code isn't optimized and runtime is pretty much proportional to the 
dimensions and the number of colors of the image that gets traced in SVG: 
we indeed iterate over each isolated color blob to calculate its polygonal 
contour. This is why reducing the number of colors might be useful.


For instance, converting the 150×150 fireball sprite with transparency in 
[example 4](https://github.com/ValentinFrancois/pixels2svg#example-4---vectorize-sprite-with-gradients-and-reduce-number-of-colors--source)
took 60s on my laptop.
<br/>Using `color_tolerance=64`, it took 4s. Using `color_tolerance=128`, it took 0.8s.

---

## Contributing

PRs are appreciated, just make sure your PR title starts with one of the
following keywords so that the CI works:
- `[MAJOR]`: breaking changes
- `[MINOR]`: feature changes
- `[PATCH]`: fixes
- `[CONFIG]`: changes only related to GitHub (CI, .gitignore, etc.) -> won't trigger a package release

--- 

## Links

- Sources of examples images:

  - [brain tumor scan & overlay](https://www.nature.com/articles/srep16822)
  - [sword](https://raventale.itch.io/daily-doodles-pixelart-asset-pack)
  - [spaceships](https://opengameart.org/content/modular-ships)
  - [fireball](https://opengameart.org/content/fireball-effect-2)


- [A cool SVG path inspector & editor](https://yqnn.github.io/svg-path-editor)


- [ Open Game Art](https://opengameart.org/content/good-cc0-art)