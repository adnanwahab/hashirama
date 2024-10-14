# Visualizing the loss of rod and cone photoreceptor cells

> <div style="background-color:#f0f0f0; border-radius: 7px; padding: 10px">**Related research article:** Whitmore, S.S., et al. Modeling rod and cone photoreceptor cell survival in vivo using optical coherence tomography. *Scientific Reports* **13**, 6896 (2023).
<a href="https://doi.org/10.1038/s41598-023-33694-y">10.1038/s41598-023-33694-y</a></div>

Could you guess what percentage of photoreceptor cells were lost? The difference between 100% surviving rods and 50% surviving rods is subtle. To see just how subtle cell loss can be, try changing the percentages of rods and cones below:

```js
// bscan_canvas_segmentation = function(image_data, thickness_data, show_bscan, is_simulated){
bscan_canvas_segmentation = {
  // Modifying Mike Bostock's example: https://observablehq.com/@d3/canvas-horizon-chart
  const div = html`<div style="position:relative;">`;

  let bscan = image_data.filter(d => d.laterality == which_eye )

  let width = 768
  let height = 496

  // image_data.filter(d => d.laterality == which_eye )[0].image
  const canvas = d3.select(div)
    .selectAll("canvas")
    .data(bscan)
    .enter().append(() => DOM.context2d(width, height).canvas)
      .style("position", "absolute")
      .style("width", `${width}px`)
      .style("height", `${height}px`)
      .each(draw_bscan)

    const svg = d3.select(div.appendChild(DOM.svg(768, 496)))
      .style("position", "relative")

  // TASK: Add line data here...

  // svg.append("g")
  //     .call(xAxis);
  let data_no_vitreous = thickness_modified_eye
    .filter(d => d["surface_id"] > 1)
    .orderby("surface_id")

  let data = Array.from(d3.group(data_no_vitreous, d => d.surface_id), ([key, value]) => ({key, value}))
  
  let x = d3.scaleLinear()
    .range([0, width])
    .domain([1,768])

  let y = d3.scaleLinear()
    .range([height, 0])
    .domain(y_domain)

  let line = d3.line()
    .x(d => x(d.ascan_id))
    .y(d => y(d.z_um))

  let area = d3.area()
    .x(d => x(d.ascan_id))
    .y0(496)
    .y1(d => y(d.z_um))

  let color = d3.scaleOrdinal()
    .domain(d3.range(2, 12))
    .range(d3.schemePaired)
  
  let layers = svg.append("g")
    .selectAll(".layers")
    .data(data)
    .enter().append("path")
      .attr("id", d => +d.key)
      .attr("stroke", d => color(+d.key))
      //  .attr("stroke", d => color(+d.key))    
      .attr("fill", d => color(+d.key))
      // .attr("fill", d => color(+d.key))
      .attr("opacity", +(show_layers == "Layers"))
      .attr("d", d=> area(d.value))  

  let lines = svg.append("g")
    .selectAll(".surfaces")
    .data(data)
    .enter().append("path")
      .attr("id", d => +d.key)
      .attr("stroke", d => color(+d.key))
      .attr("fill", "none")
      .attr("opacity", +(show_layers == "Surfaces"))
      .attr("stroke-width", 2)
      .attr("d", d=> line(d.value))  

  function draw_bscan (d) {

    const context = this.getContext("2d");
    // canvas.style = "width: 60%";
    this.width = width
    this.height = height

    console.log("this:", this.width, this.height)
  
    context.drawImage(d.image, 0, 0, width, height);

  
    if(show_bscan) {
  
      const bscanData = context.getImageData(
        0,
        0,
        width,
        height
      );

      console.log("bscanData: width = ", bscanData.width, ", height = ", bscanData.height)
  
      // modify_segmentation(bscanData.data, thickness_modified_eye.orderby("surface_id").objects())
      modify_working(bscanData.data, thickness_modified_eye.orderby("surface_id").objects())

      console.log("bscanData: width = ", bscanData.width, ", height = ", bscanData.height)

      
      context.putImageData(bscanData, 0, 0);
    }

    // Change the title if photoreceptor survival drops below 100%
    let title = "Original"
    if(is_simulated & show_bscan) {
      title = "Simulation"
    } 
  
    context.fillStyle = "#B88A00";
    context.font = "30px Helvetica";
    context.fillText(title, 10, 40);

    // return canvas;
  }


  
    return div
}
```

```js
legend = Swatches(d3.scaleOrdinal(plot_fill.domain.map(d => layer_scale(d - 1)), plot_fill.range), {title: "Retinal layers"})
```

```js
html`<strong>Figure 1:</strong> ${(rods_surviving * 100).toFixed(0)}% rods surviving and ${(cones_surviving * 100).toFixed(0)}% cones. Adjust the controls below.`
```

```js
viewof show_layers = Inputs.radio(["None", "Surfaces", "Layers"], {value: "None", label: "Display retinal layer segmentation?"})
```

```js
viewof rods_surviving_percentage = Inputs.range([0, 100], {step: 1, label: "Percentage of rods surviving", value: 100})
```

```js
viewof cones_surviving_percentage = Inputs.range([0, 100], {step: 1, label: "Percentage of cones surviving", value: 100})
```

```js
viewof which_eye_select = Inputs.radio(["Right", "Left"], {label: "Select eye", value:  "Right"})
```

```js
viewof show_bscan = Inputs.toggle({label: "Simulated B-scan: Show / Hide", value: true})
```

## Quiz
Try guessing what percentage of rod and cone photoreceptor cells survive in the following patient:

```js
bscan_canvas(bscan_random, thickness_modified_eye_random.orderby("surface_id").objects(), true, true)
```

```js
viewof new_quiz = Inputs.button("New quiz", {reduce: () => set(viewof submit_guess, 0)} )
```

Your guesses:

```js
viewof rods_surviving_guess_percentage = Inputs.range([0, 100], {step: 1, label: "Percentage of rods surviving", value: 100})
```

```js
viewof cones_surviving_guess_percentage = Inputs.range([0, 100], {step: 1, label: "Percentage of cones surviving", value: 100})
```

```js
viewof submit_guess = Inputs.button("Submit guess")
```

```js
submit_guess ?  md`Actual surviving rods: ${Math.round(rods_surviving_random * 100)}%. Your answer was off by ${Math.round(rods_surviving_difference)}%<br>Actual surviving cones: ${Math.round(cones_surviving_random * 100)}%. Your answer was off by ${Math.round(cones_surviving_difference)}%` :  md`Awaiting your guess.`
```

## How it works

To build the model, we used rod and cone density data originally published in (Curcio, C. A., Sloan, K. R., Kalina, R. E., Hendrickson, A. E., 1990. [Human photoreceptor topography](https://doi.org/10.1002/cne.902920402). J Comp Neurol 292, 497-523. PMID 2324310). Dr. Curcio has made the data available for download from her [research website](https://christineacurcio.com/PRtopo/). Using custom software, we registered the cell density data to an OCT volume in R, interpolated cell densities for every A-scan in the volume, and computed the expected proportion of rods and cones at each position. The model implemented here assumes that thickness of the outer retina is proportional to the surviving proportion of rods and cones. Details are available in [our published paper](https://doi.org:10.1038/s41598-023-33694-y).

## Appendix A: Math

We modify the thickness data based on the number of surviving rods and cones:

```tex
thickness_{new}= thickness_{original} \times ((proportion_{rods}\times surviving_{rods}) + (1 - proportion_{rods})\times surviving_{cones} )
```

## Appendix B: Code

```js
which_eye =  {
  if(which_eye_select == "Right") { return "OD"} else { return "OS"}
}
```

```js echo
rods_surviving = rods_surviving_percentage / 100
```

```js echo
cones_surviving = cones_surviving_percentage / 100
```

```js
rods_surviving_guess = rods_surviving_guess_percentage / 100
```

```js echo
cones_surviving_guess = cones_surviving_guess_percentage / 100
```

```js echo
import { aq } from '@uwdata/arquero'
```

```js echo
import {vl} from '@vega/vega-lite-api-v5'
```

### Data import

Import central B-scan image:

```js echo
FileAttachment("central_bscan_od@2.png").url()
```

```js echo
FileAttachment("central_bscan_od@2.png").url()
```

```js echo
bscan_os_image = FileAttachment("central_bscan_os@1.png").image()
```

```js echo
bscan_od_image = FileAttachment("central_bscan_od@2.png").image()
```

```js echo
image_data = [
  {laterality: "OD", image: bscan_od_image, url: "https://raw.githubusercontent.com/barefootbiology/examplebscans/main/data/central_bscan_od.png", url2: await FileAttachment("central_bscan_od@2.png").url(), x: 0, y: 0}, 
  {laterality: "OS", image: bscan_os_image, url: "https://raw.githubusercontent.com/barefootbiology/examplebscans/main/data/central_bscan_os.png", url2: await FileAttachment("central_bscan_os@1.png").url(), x: 0, y: 0}
]
```

```js echo
image_data_eye = aq.from(image_data)
   .filter(aq.escape(d => d["laterality"] == which_eye))
```

```js echo
simulated_bscan = bscan_canvas(bscan, thickness_modified_eye.orderby("surface_id").objects(), show_bscan, is_simulated)
```

```js echo
current_bscan_data = {
  return { "url": simulated_bscan.toDataURL(), "x": 0, "y": 0 }
    }
```

```js
data_file = FileAttachment("central_bscan_data@2.tsv")
```

```js
bscan_canvas = function(bscan, thickness_data, show_bscan, is_simulated){
  
    const canvas = DOM.canvas(bscan.naturalWidth, bscan.naturalHeight);
    const context = canvas.getContext("2d");
    canvas.style = "width: 60%";
  
    context.drawImage(bscan, 0, 0, bscan.naturalWidth, bscan.naturalHeight);

  
    if(show_bscan) {
  
      const bscanData = context.getImageData(
        0,
        0,
        bscan.naturalWidth,
        bscan.naturalHeight
      );
  
      // modify_segmentation(bscanData.data, thickness_modified_eye.orderby("surface_id").objects())
      modify_working(bscanData.data, thickness_data)
    
      context.putImageData(bscanData, 0, 0);
    }

    // Change the title if photoreceptor survival drops below 100%
    let title = "Original"
    if(is_simulated & show_bscan) {
      title = "Simulation"
    } 
  
    context.fillStyle = "#B88A00";
    context.font = "30px Helvetica";
    context.fillText(title, 10, 40);

    return canvas;
  
}
```

```js
thickness_data = d3.tsvParse(await data_file.text(data_file), d3.autoType)
```

```js echo
// To use copied code replace "data" with your own variable
modify_thickness = function(data, rods_surviving, cones_surviving) {
  let thickness_modified = aq.from(data)
  	.derive(
      {
        thickness_modified: 
          aq.escape(d => 
                    d.is_outerretina * d.thickness * 
                    (d.proportion_rods * rods_surviving + 
                    (1 - d.proportion_rods) * cones_surviving) + 
                    (1 - d.is_outerretina) * d.thickness)
      }
    )
    .derive({laterality_ascan_group: d => d.laterality + "_" + d.ascan_id})
    .groupby('laterality_ascan_group')
  	.orderby("ascan_id")
  	.orderby(aq.desc("surface_id"))
    .derive({ z_original: aq.rolling(d => op.sum(d.thickness)) }) 
    .derive({ thickness_residual: d => op.sum(d.thickness) - op.sum(d.thickness_modified)})
    .derive({ thickness_modified_adjusted: d => (d.surface_id == 1) ? d.thickness_modified + d.thickness_residual : d.thickness_modified })
    // For dealing with voxel data:
    .derive({ thickness_mod_rounded: d => Math.round(d.thickness_modified_adjusted)})
    .derive({ thickness_mod_rounded_residual: d => op.sum(d.thickness) - op.sum(d.thickness_mod_rounded) })
    .derive({ thickness_mod_rounded_adjusted: d => (d.surface_id == 1) ? d.thickness_mod_rounded + d.thickness_mod_rounded_residual : d.thickness_mod_rounded })
    .derive({ z: aq.rolling(d => op.sum(d.thickness_modified_adjusted)) })
    .derive({ z_um: d => (496 - d.z) * d.z_units * 1000})
    .ungroup()
  	// .objects() // Uncomment to return an array of objects
  return thickness_modified
}

```

```js echo
thickness_modified = modify_thickness(thickness_data, rods_surviving, cones_surviving)
```

```js echo
thickness_modified_eye = thickness_modified
  .filter(aq.escape(d => d["laterality"] == which_eye))
```

### Basic plotting parameters

Scales for plotting the original thickness data:

```js
x = d3.scaleLinear()
    .domain([1, d3.max(thickness_data, d => d.ascan_id)])
    .range([margin.left, width - margin.right])
    .interpolate(d3.interpolateRound)
```

```js
x_mm = d3.scaleLinear()
  .domain([d3.min(thickness_data, d => d.x_mm), d3.max(thickness_data, d => d.x_mm)])
  .range([margin.left, width - margin.right])
  .interpolate(d3.interpolateRound)
```

```js
y = d3.scaleLinear()
    .domain([1, 496])
    .range([height - margin.top, margin.bottom])
    .interpolate(d3.interpolateRound)
```

```js
color_surface = d3.scaleOrdinal()
    .range(d3.schemePaired)
    .domain([2,3,4,5,6,7,8,9,10])
```

Note that the y scale needs to flip the axis:

Scales for the surface segmentation plots:

```js
height = 400
```

```js
margin = ({top: 20, right: 0, bottom: 0, left: 30})
```

```js
surface_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
```

These plotting functions are works in progress. I want to add a legend for the retinal layers, but haven't got it working yet.

```js
layer_scale = d3.scaleOrdinal()
  .domain([0,1,2,3,4,5,6,7,8,9,10,11])
  .range(["vitreous", "nerve fiber layer", "ganglion cell layer", "inner plexiform layer", "inner nuclear layer", "outer plexiform layer", "outer nuclear layer", "ellipsoid zone", "outer segments", "interdigitation zone", "RPE/Bruch's membrane complex", "choroid and sclera"])
```

```js echo
plot_fill = rodconeloss.scale("color")
```

```js
import {Legend, Swatches} from "@d3/color-legend"
```

```js echo
plot_fill.domain.map(d => layer_scale(d - 1))
```

### Experimental data wrangling

I used these functions to experiment with data wrangling. See Mike Freeman's ["Data Wrangler"](https://observablehq.com/@observablehq/data-wrangler) notebook for details.

```js
import {Copier} from "@mbostock/copier"
```

```js
import {Wrangler, op} from "@observablehq/data-wrangler"
```

### Values for the quiz

```js
laterality_random = {
  new_quiz;
  yield ["OD", "OS"][d3.randomInt(0, 2)(1)]
}
```

```js
rods_surviving_random = {
  new_quiz;
  yield Math.round((d3.randomUniform(0, 1)(1) * 100)) / 100;
}
```

```js
cones_surviving_random = {
  new_quiz;
  yield Math.round(d3.randomUniform(0, 1)(1) * 100) / 100;
}
```

```js
cones_surviving_difference = (cones_surviving_random - cones_surviving_guess) * 100
```

```js
rods_surviving_difference = (rods_surviving_random - rods_surviving_guess) * 100
```

```js echo
thickness_modified_random = modify_thickness(thickness_data, rods_surviving_random, cones_surviving_random)
```

```js echo
thickness_modified_eye_random = thickness_modified_random
  .filter(aq.escape(d => d["laterality"] == laterality_random))
```

The `set` function let's one input change the value of another input. I'm using it for the "Submit guess" and "New quiz" buttons.

```js echo
import {set} from '@observablehq/synchronized-inputs'
```

### Simulating a B-scan

1. Get a single A-scan.
2. Get the unmodified segmentation at this position.
3. Get the modified segmentation at this position.
4. Draw a three column picture showing the mapping from A-scan voxel intensities, unmodified segmentation, and modified segmentation.
5. Work out the function to use these three sources as input data.
6. Plot the modified intensity data as a fourth column.

```js echo
viewof which_ascan = Inputs.range([1, 768], {step: 1, label: "Amount"})
```

```js echo
thickness_modified_eye_ascan = thickness_modified_eye.filter(aq.escape(d => d["ascan_id"] == which_ascan))
```

```js echo
ascan_domain = [1, 496]
```

```js echo
image_data.filter(d => d.laterality == which_eye)[0]["image"]
```

```js
bscan_od_image
```

```js echo
plot_rodconeloss = function(data, layers) {
  let data_no_vitreous = data
    .filter(d => d["surface_id"] > 1)
    .orderby("surface_id")

  return Plot.plot({
    x: {domain: x_domain },
    y: {domain: y_domain},  
    color: {
      type: "ordinal",
      scheme: "paired"
    },
    marks: [
      Plot.areaY(data_no_vitreous, {x: "x_mm", y1: y_domain[0], y2: "z_um", fill: "surface_id", fillOpacity: +layers}),
      Plot.line(data_no_vitreous, {x: "x_mm", y: "z_um", stroke: "surface_id"})
    ]
  })
}
```

```js echo
x_domain = [d3.min(thickness_modified, d => d.x_mm), d3.max(thickness_modified, d => d.x_mm)]
```

```js echo
y_domain = [496 * 0.003872 * 1000, 0]
```

## Generating a modified B-scan

```js echo
import {modify_vector, inverse_rle, compute_thickness} from '@barefootbiology/resizing-segmented-vectors'
```

### Working with the B-scan image data

Here's what we need:

1. The B-scan image as a 2D array.
2. The original surface positions as a 2D array. (Alternatively, we could use the original layer thicknesses.)
3. The modified layer thicknesses as a 2D array.

Alternatively, you could treat all the data as a giant 1D vector.

A column in the B-scan images is called an A-scan.

Here's what we'll do:

1. Create a new container to hold the result.
2. For each A-scan, run `modify_vector(bscan[i,], segmentation[i, ], modified_thickness[i, ])`

```js echo
// Get the current B-scan image
bscan = image_data.filter(d => d.laterality == which_eye )[0].image
```

```js echo
bscan_random = image_data.filter(d => d.laterality == laterality_random )[0].image
```

```js echo
modify_working = function(data, thickness_data) {

  for(let ascan_id = 0; ascan_id < 768; ascan_id++) {

    // The A-scans begin at 1 not 0
    let surface_positions = 
        thickness_data.filter(d => d.ascan_id == ascan_id+1).map(d => d.z_original)
        .sort()

    // Add the position of the vitreous
    surface_positions.unshift(0)

    surface_positions.pop()
    
    let modified_thicknesses = 
      thickness_data.filter(d => d.ascan_id == ascan_id+1)
      .sort((a, b) => (a.surface_id > b.surface_id) ? 1 : -1)
      .map(d => d.thickness_mod_rounded_adjusted)
  
    let ascan_original = new Array(496)

    // Copy the original data
    for(let row_index = 0; row_index < 496; row_index++) {
      let array_index = 768*4*row_index + ascan_id*4

      ascan_original[row_index] = data[array_index]
    }

    // Modify the copied data
    // Confession: I'm not sure why I needed to reverse the vectors where I did--but it works.
    //             If someone wants to suggest how to make this simpler, please do!
    let ascan_modified = modify_vector(ascan_original.reverse(), surface_positions, modified_thicknesses.reverse()).reverse()

    // Copy the modified data back into the data object
    for(let row_index = 0; row_index < 496; row_index++) {
      let array_index = 768*4*row_index + ascan_id*4

      data[array_index + 0] = ascan_modified[row_index]
      data[array_index + 1] = ascan_modified[row_index]
      data[array_index + 2] = ascan_modified[row_index]
    }   
  }
}
```

```js echo
is_simulated = (rods_surviving < 1) | (cones_surviving < 1)
```

```js
viewof layers = Inputs.toggle({label: "Layers: On / Off"})
```

```js
rodconeloss = plot_rodconeloss(thickness_modified_eye, layers)
```
