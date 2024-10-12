import { create, select } from 'npm:d3-selection';
import { transition } from 'npm:d3-transition';
import { line, curveLinearClosed, curveCatmullRomClosed } from 'npm:d3-shape';
import { interpolateViridis, interpolateTurbo, interpolateCool } from 'npm:d3-scale-chromatic';
import { easeCubicInOut, easeExpOut } from 'npm:d3-ease';
import { scaleLinear, scaleSequential } from 'npm:d3-scale';
import { extent, range } from 'npm:d3-array';
import { rgb } from 'npm:d3-color';


export function dynamicHull(hulls, {
  width, 
  height,
  xd = [-1, 1],
  yd = [-1, 1],
  x = (d) => d.x,
  y = (d) => d.y,
  selected = 271,
  strokeWidth = 2,
  fill = "none",
  stroke = "black",
  duration = 1000,
  delay = 0,
  ease = easeCubicInOut
} = {}) {
  
  const svgsel = create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; display: block;")
  
  const svg = svgsel.node()
  svg.value = {selected: selected, hovered: -1}
  

  const xScaleFactor = width / (xd[1] - xd[0]);
  const yScaleFactor = height / (yd[1] - yd[0]);

  // Calculate translation to center the drawing at (0,0)
  // This centers the view at (0,0) and accounts for the SVG's inverted y-axis
  const xOffset = width / 2 - (xScaleFactor * (xd[1] + xd[0]) / 2);
  const yOffset = height / 2 + (yScaleFactor * (yd[1] + yd[0]) / 2);

  // Calculate a scaled stroke width
  const scaledStrokeWidth = strokeWidth / Math.sqrt(xScaleFactor * yScaleFactor) / 2;

  const g = svgsel.append("g")
  g.attr('transform', `translate(${xOffset}, ${yOffset}) scale(${xScaleFactor}, ${yScaleFactor})`);

  const draw = line()
    .x(d => d.x)
    .y(d => -d.y)
    // .curve(curveCatmullRomClosed);
    .curve(curveLinearClosed);

  let sel = g.selectAll("path.hull")
    .data(hulls)
  
  // const exit = sel.exit()
  //   .style("opacity", 0)
  //     .remove()

  const enter = sel.enter()
    .append("path")
      .classed("hull", true)
      .attr("d", draw)
      .style("fill", (d,i) => interpolateCool(i/hulls.length))
      .style("stroke", stroke)
      .style("stroke-width", scaledStrokeWidth)
      .style("opacity", 0.5)
      .on("mouseover", function(e,d){ 
        select(this).style("stroke-width", scaledStrokeWidth * 2).style("opacity", 1) 
        let p = d[0]
        svg.value.hovered = p?.cluster
        svg.dispatchEvent(new Event("input"))
      })
      .on("mouseout", function(){ 
        select(this).style("stroke-width", scaledStrokeWidth).style("opacity", 0.5) 
        svg.value.hovered = -1
        svg.dispatchEvent(new Event("input"))
      })
      .on("click", function(e, d,i) {
        console.log("click",d) 
        let p = d[0]
        svg.value.selected = p?.cluster
        svg.dispatchEvent(new Event("input"));

        enter.style("fill", (d,i) => interpolateCool(i/hulls.length))
        select(this).style("fill", "black")
      })
    
  enter.filter(d => d[0]?.cluster == selected)
      .style("fill", "black")
      .style("stroke-width", scaledStrokeWidth * 2)

  // const update = sel
  //   .style("opacity", 0.75)
  //   .attr("d", draw)

  
  return svgsel.node()
}
