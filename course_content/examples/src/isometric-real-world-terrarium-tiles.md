```js
md`# Isometric real-world terrarium tiles

Isometric heightmaps of real-world tiles, using [Philippe’s](https://beta.observablehq.com/@ehouais) incredibly cool technique and terrarium tiles from [terrain tiles on Amazon](https://aws.amazon.com/public-datasets/terrain/), made by Mapzen (RIP).`
```

```js
viewof heightmap = {
  const nb = 512; // Adapt heightmap precision to canvas size

  // Transform height into color before rendering
  const colormap = [];
  for (let i = 0; i < nb; i++) {
    colormap[i] = [];
    for (let j = 0; j < nb; j++) {
      colormap[i][j] = Math.floor(Math.min(92, H[i][j]*100));
	  }
  }
  const context = DOM.context2d(width, width/2);
  isoFloorCasting(context, H, colormap, width/8);
  context.canvas.value = H;
  
  const ctx = DOM.context2d(256, 256);
  ctx.drawImage(overview, 0, 0);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.fillStyle = 'transparent';
  const size = 512 / Math.pow(2, coord[0] + 1);
  ctx.rect(coord[1] * size, coord[2] * size, size, size);
  ctx.stroke();
  
  context.drawImage(ctx.canvas, 64, 64, width / 5, width / 5);
  return context.canvas;
}
```

```js
{
  let zoomIn = html`<button ${coord[0] < 19 ? '' : 'disabled'}>+</button>`;
  let zoomOut = html`<button ${coord[0] > 0  ? '' : 'disabled'}>-</button>`;
  let left = html`<button ${coord[1] > 0 ? '' : 'disabled'}>left</button>`;
  let right = html`<button ${coord[1] < Math.pow(2, coord[0]) - 1 ? '' : 'disabled'}>right</button>`;
  let up = html`<button ${coord[2] > 0 ? '' : 'disabled'}>up</button>`;
  let down = html`<button ${coord[2] < Math.pow(2, coord[0]) - 1 ? '' : 'disabled'}>down</button>`;
  
  zoomIn && zoomIn.addEventListener('click', () => {
    mutable coord = [coord[0] + 1, coord[1] * 2, coord[2] * 2]; });
  zoomOut && zoomOut.addEventListener('click', () => {
    mutable coord = [coord[0] - 1, Math.floor(coord[1] / 2), Math.floor(coord[2] / 2)]; });
  
  left && left.addEventListener('click', () => { mutable coord = [coord[0], coord[1] - 1, coord[2]]; });
  right && right.addEventListener('click', () => { mutable coord = [coord[0], coord[1] + 1, coord[2]]; });
  
  up && up.addEventListener('click', () => { mutable coord = [coord[0], coord[1], coord[2] - 1]; });
  down && down.addEventListener('click', () => { mutable coord = [coord[0], coord[1], coord[2] + 1]; });
  
  return html`<div class='controls'>${[zoomIn, zoomOut, left, right, up, down].filter(Boolean)}</div>
<style>
.controls {
  text-align: center;
}
.controls button { font-size: inherit; margin:0 0.1rem; border: none; color: #000; background: #eee; }
.controls button:disabled { color: #ccc; }
</style>`;
}
```

```js
viewof seabed = DOM.range(25000, 31000)
```

```js
viewof extrude = DOM.range(20, 40)
```

```js
tile = {
  let img = new Image();
  img.crossOrigin = '*';
  img.src = `https://elevation-tiles-prod.s3.amazonaws.com/terrarium/${coord.join('/')}.png`;
  return new Promise(resolve => {
    img.addEventListener('load', () => {
      resolve(img);
    });
  });
}
```

```js
overview = {
  let img = new Image();
  img.crossOrigin = '*';
  img.src = `https://a.tile.openstreetmap.org/0/0/0.png`;
  return new Promise(resolve => {
    img.addEventListener('load', () => {
      resolve(img);
    });
  });
}
```

```js
md`Looks weird.`
```

```js
canvas = {
  const ctx = DOM.context2d(256, 256)
  ctx.drawImage(tile, 0, 0)
  return ctx.canvas
}
```

```js echo
clone = {
  const clone = canvas.getContext('2d').getImageData(0, 0, 512, 512);
  for (let i = 0; i < clone.data.length; i += 4) {
    let sum = (clone.data[i] * 256 + clone.data[i + 1] + clone.data[i + 2] / 256);
    sum = (sum - seabed) / extrude;
    clone.data[i] = clone.data[i + 1] = clone.data[i + 2] = sum;
  }
  return clone;
}
```

```js echo
H = {
  let H = [];
  for (let x = 0; x < 512; x++) {
    let r = [];
    for (let y = 0; y < 512; y++) {
      r.push(clone.data[(x * 4) + (y * 512 * 4)] / 300);
    }
    H.push(r.reverse());
  }
  return H;
}
```

```js
{

  const ctx = DOM.context2d(256, 256)
  ctx.putImageData(clone, 0, 0)
  return ctx.canvas;
}
```

```js
mutable coord = [0, 0, 0]
```

```js
import {isoFloorCasting, isoWireframe} from '@ehouais/heightmap-rendering-techniques'
```
