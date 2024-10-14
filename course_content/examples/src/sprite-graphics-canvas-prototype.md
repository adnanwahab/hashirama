```js
md`# Sprite Graphics Canvas Prototype

_A prototype to try and overlay sprite graphics on the canvas, using sprites from https://withering-systems.itch.io/city-game-tileset_`
```

```js
canvas = {
  const context = DOM.context2d(c_width, c_height);
  const delaunay = d3.Delaunay.from(
    piecesToDraw.map(gridToRenderSpace).map(({ x, y }) => {
      return [
        x +
          0.5 *
            (gridTranslation.x.x + gridTranslation.y.x - gridTranslation.z.x),
        y +
          0.5 *
            (gridTranslation.x.y + gridTranslation.y.y - gridTranslation.z.y)
      ];
    })
  );
  const voronoi = delaunay.voronoi([0, 0, c_width, c_height]);

  function update() {
    context.clearRect(0, 0, c_width, c_height);

    toDrawablePieces(inOrder(piecesToDraw)).forEach(piece => {
      context.drawImage(piece.img, piece.x, piece.y, piece.width, piece.height);
    });

    // Draw green cubes representing grid space
    // piecesToDraw.map(gridToRenderSpace).map(piece => {
    //   drawCube(context, piece.x, piece.y, "rgb(0,255,0,0.5)");
    // });

    // Draw the voronoi diagram
    // context.beginPath();
    // delaunay.render(context);
    // context.strokeStyle = "#ccc";
    // context.stroke();

    // context.beginPath();
    // voronoi.render(context);
    // voronoi.renderBounds(context);
    // context.strokeStyle = "#000";
    // context.stroke();

    // context.beginPath();
    // delaunay.renderPoints(context);
    // context.fill();
  }

  context.canvas.ontouchmove = context.canvas.onmousemove = event => {
    event.preventDefault();
    update();

    //Get the current mouse/finger position
    const mouseX = event.layerX;
    const mouseY = event.layerY;

    const startX =
      mouseX +
      0.5 * (-gridTranslation.x.x - gridTranslation.y.x + gridTranslation.z.x);
    const startY =
      mouseY +
      0.5 * (-gridTranslation.x.y - gridTranslation.y.y + gridTranslation.z.y);

    // Draw blue cube with center at mouse
    // drawCube(context, startX, startY, 'rgba(0,0,255,0.5)');

    //Draw the current x and y position as text in the lower left corner
    context.fillStyle = "black";
    context.fillText(
      `render x: ${mouseX}, y: ${mouseY}`,
      0,
      c_height - 50,
      200,
      50
    );

    const i = delaunay.find(mouseX, mouseY);
    const piece = gridToRenderSpace(piecesToDraw[i]);
    drawCube(context, piece.x, piece.y, "rgb(0,0,255,0.5)");
  };

  update();

  yield context.canvas;
}
```

```js
viewof pan_camera_x = slider({
  title: "Pan camera x",
  min: -10,
  max: 10,
  value: 0,
  step: 1
})
```

```js
viewof pan_camera_y = slider({
  title: "Pan camera y",
  min: -10,
  max: 10,
  value: -2,
  step: 1
})
```

```js
viewof pan_camera_z = slider({
  title: "Pan camera z",
  min: -10,
  max: 10,
  value: -3,
  step: 1
})
```

```js
viewof zoom = slider({
  title: "How zoomed in should everything be?",
  min: 0.01,
  max: 4,
  step: 0.01,
  value: 0.5
})
```

```js
pieces = {
  let pieces = {};
  for (let fileName of Object.keys(files)) {
    const file = files[fileName];

    const image = await file.file.image();

    pieces[fileName] = {
      image,
      blocks: file.blocks
    };
  }
  return pieces;
}
```

```js
piecesToDraw = {
  const piecesToDraw = [
    { piece: pieces.foliage1, x: 0, y: 0, z: 0 },
    { piece: pieces.crow1, x: 3, y: 3, z: 0 },
    { piece: pieces.bee1, x: 0, y: 0, z: 0 },
    { piece: pieces.door1, x: -3, y: 6, z: 2 },
    { piece: pieces.porous1, x: -3, y: 0, z: 0 },
    { piece: pieces.porous2, x: -2, y: 0, z: 0 },
    { piece: pieces.porous1, x: -1, y: 0, z: 0 },
    { piece: pieces.porous2, x: 1, y: 0, z: 0 },
    { piece: pieces.porous1, x: 2, y: 0, z: 0 },
    { piece: pieces.porous1, x: 3, y: 0, z: 0 },
    { piece: pieces.porous1, x: 3, y: 1, z: 0 },
    { piece: pieces.porous2, x: 3, y: 2, z: 0 },
    { piece: pieces.porous1, x: 3, y: 3, z: 0 },
    { piece: pieces.porous2, x: 3, y: 4, z: 0 },
    { piece: pieces.porous1, x: 3, y: 5, z: 0 },
    { piece: pieces.porous1, x: 2, y: 5, z: 0 },
    { piece: pieces.porous2, x: 1, y: 5, z: 0 },
    { piece: pieces.porous1, x: 0, y: 5, z: 0 },
    { piece: pieces.porous1, x: -1, y: 5, z: 0 },
    { piece: pieces.porous2, x: -2, y: 5, z: 0 },
    { piece: pieces.porous1, x: -3, y: 5, z: 0 },
    { piece: pieces.porous1, x: -3, y: 4, z: 0 },
    { piece: pieces.foliage1, x: -3, y: 3, z: 0 },
    { piece: pieces.porous1, x: -3, y: 2, z: 0 },
    { piece: pieces.porous1, x: -3, y: 1, z: 0 },
    { piece: pieces.porous1, x: -4, y: 6, z: 0 },
    { piece: pieces.porous1, x: -4, y: 6, z: 1 },
    { piece: pieces.porous1, x: 2, y: 5, z: -1 },
    { piece: pieces.porous1, x: 2, y: 4, z: -1 },
    { piece: pieces.stair1, x: 2, y: 4, z: -1 },
    { piece: pieces.foliage1, x: 1, y: 4, z: -1 },
    { piece: pieces.foliage2, x: 1, y: 3, z: -1 },
    { piece: pieces.foliage1, x: 0, y: 4, z: -1 },
    { piece: pieces.porous1, x: -1, y: 5, z: -1 },
    { piece: pieces.porous2, x: -2, y: 5, z: -1 },
    { piece: pieces.porous1, x: -1, y: 5, z: -2 },
    { piece: pieces.porous2, x: -2, y: 5, z: -2 },
    { piece: pieces.stair4, x: 0, y: 3, z: -3 },
    { piece: pieces.foliage2, x: -1, y: 6, z: 0 },
    { piece: pieces.stair4, x: -3, y: 5, z: 0 },
    { piece: pieces.porous1, x: -3, y: 6, z: 1 },
    { piece: pieces.porous1, x: -3, y: 6, z: 2 },
    { piece: pieces.porous1, x: -4, y: 6, z: 2 },
    { piece: pieces.porous1, x: -5, y: 6, z: 3 },
    { piece: pieces.porous1, x: -5, y: 7, z: 3 },
    { piece: pieces.foliage1, x: -4, y: 5, z: 2 },
    { piece: pieces.foliage1, x: -4, y: 4, z: 2 },
    { piece: pieces.foliage1, x: -5, y: 4, z: 2 },
    { piece: pieces.stair1, x: -5, y: 5, z: 2 },
    { piece: pieces.reeds1, x: -2, y: 5, z: 0 },
    { piece: pieces.rock1, x: -1, y: 5, z: 0 },
    { piece: pieces.foliage2, x: 1, y: 6, z: 0 },
    { piece: pieces.tomb1, x: 0, y: 6, z: 0 }
  ];

  return piecesToDraw;
}
```

```js
toDrawablePieces = pieces => {
  return pieces.map(piece => {
    //There are efficiency gains that can be made here if we know a given block in a future spot
    //will completely obscure the block we're about to draw, but for now, let's just render all
    const imageRender = imageToRenderSpace(piece.image);
    const gridRender = gridToRenderSpace(piece.position);

    return {
      img: imageRender.img,
      x: imageRender.x + gridRender.x,
      y: imageRender.y + gridRender.y,
      width: imageRender.width,
      height: imageRender.height
    };
  });
}
```

```js
inOrder = piecesArr => {
  //Always make sure that we draw the blocks the correct order. Correct order means that
  //the overlaps of each of the blocks at each of the levels looks correct, regardless
  //of what is placed in the block (i.e. a flat tile floor overlaps correctly, and so
  //does a tall palm tree)

  //For each block to draw, calculate the sort order and then sort blocks in ascending
  //order so that ones at the "back" of the render window, which will never overlap anything
  //are rendered first
  return piecesArr
    .map(({ piece, x, y, z }) => {
      return {
        image: piece.image,
        position: { x, y, z },
        blocks: piece.blocks,
        drawOrder: drawOrder(x, y, z, piece.blocks)
      };
    })
    .sort((a, b) => {
      if (a.drawOrder < b.drawOrder) return -1;
      else if (a.drawOrder > b.drawOrder) return 1;
      return 0;
    });
}
```

```js
function getHighestBlock(blocks) {
  let maxOrderBlock = [0, 0, 0];

  if (blocks !== undefined) {
    for (let block of blocks) {
      if (
        block[0] >= maxOrderBlock[0] &&
        block[1] <= maxOrderBlock[1] &&
        block[2] >= maxOrderBlock[2]
      ) {
        maxOrderBlock = block;
      }
    }
  }

  return maxOrderBlock;
}
```

```js
function drawOrder(x, y, z, blocks) {
  const maxOrderBlock = getHighestBlock(blocks);
  return (
    x +
    maxOrderBlock[0] -
    (y + maxOrderBlock[1]) +
    0.25 * (z + maxOrderBlock[2])
  );
}
```

```js
drawCube = (ctx, startX, startY, fillColor) => {
  const originalFillStyle = ctx.fillStyle;

  //Draw a cube the size of 1 grid space at the given position
  //but offset the cube by half of a translation in the -x, -y, and -z directions
  //so that it's anchored to the canvas by the center of the cube
  ctx.fillStyle = fillColor;
  ctx.beginPath();

  //start coords
  let drawCoords = { x: startX, y: startY };
  ctx.moveTo(drawCoords.x, drawCoords.y);

  //+y translation
  drawCoords.x += gridTranslation.y.x;
  drawCoords.y += gridTranslation.y.y;
  ctx.lineTo(drawCoords.x, drawCoords.y);

  //+x translation
  drawCoords.x += gridTranslation.x.x;
  drawCoords.y += gridTranslation.x.y;
  ctx.lineTo(drawCoords.x, drawCoords.y);

  //-z translation
  drawCoords.x -= gridTranslation.z.x;
  drawCoords.y -= gridTranslation.z.y;
  ctx.lineTo(drawCoords.x, drawCoords.y);

  //-y translation
  drawCoords.x -= gridTranslation.y.x;
  drawCoords.y -= gridTranslation.y.y;
  ctx.lineTo(drawCoords.x, drawCoords.y);

  //-x translation
  drawCoords.x -= gridTranslation.x.x;
  drawCoords.y -= gridTranslation.x.y;
  ctx.lineTo(drawCoords.x, drawCoords.y);

  ctx.closePath();
  ctx.fill();

  //Reset the fill style back to what it was before this call to prevent side effects
  ctx.fillStyle = originalFillStyle;
}
```

```js
imageToRenderSpace = img => {
  //For some reason, the images are always 80px off from where they should be, based on the grid.
  //This probably shouldn't exist, but it allows us to line up the virtual grid with the real rendered
  //images for things like mouse-over interactions.
  const magicalImageOffsetFromGrid = zoom * 80;

  //The image anchor is how we map the sprite image to the actual grid slot
  //For all sprites, we use the bottom grid slot of the sprite as the part
  //relative to which we frame the "position" of the piece
  const image_anchor = {
    //The sprite is always aligned to the center of the image horizontally
    x: (img.width * zoom) / 2.0,

    //The sprite starts in the bottom of the image, and we draw based off of
    //anchoring vertically half-way up the bottom grid slot, which is always
    //half of one vertical grid block up (+z direction)
    y: img.height * zoom + gridTranslation.z.y / 2.0
  };

  return {
    img,
    x: magicalImageOffsetFromGrid - image_anchor.x, //center the picture horizontally
    y: magicalImageOffsetFromGrid - image_anchor.y, //center the picture vertically
    width: img.width * zoom, //scale the picture horizontally to fit the block grid
    height: img.height * zoom //scale the picture vertically to fit the block grid
  };
}
```

```js
gridToRenderSpace = ({ x, y, z }) => {
  //The origin of the canvas is the top left corner by default
  //with x increasing downards and y increasing to the right
  //To move the origin from the top left to the center of the canvas, we must apply
  //another translation transform using the canvas width and height
  const origin = { x: c_width / 2.0, y: c_height / 2.0 };

  //Offset the camera based off of the origin of the canvas being centered,
  //the relative x pan of the camera being added in, and then the number of
  //grid spaces in the x, y, and/or z direction that we're placing this sprite
  const camera = {
    x: origin.x,
    y: origin.y
  };

  //Offset the block by the number of grid spaces in the x, y,
  //and/or z direction that we're placing this object
  const block = {
    x:
      (x + pan_camera_x) * gridTranslation.x.x +
      (y + pan_camera_y) * gridTranslation.y.x +
      (z + pan_camera_z) * gridTranslation.z.x,
    y:
      (x + pan_camera_x) * gridTranslation.x.y +
      (y + pan_camera_y) * gridTranslation.y.y +
      (z + pan_camera_z) * gridTranslation.z.y
  };

  return {
    x: camera.x + block.x,
    y: camera.y + block.y
  };
}
```

```js
gridTranslation = {
  //+z is in the upward, stacking-blocks direction
  //+x is in the south-east direction in the z-plane
  //+y is in the north-east direction in the z-plane

  //The following are ways to translate between quantized block movements in the xyz isometric space
  //and pixel movements in the XY rendering space. Each translation is +1 in the block space. To move
  //the other direction in block space, simply multiply each translation component by -1
  const x = {
    x: 80 * zoom,
    y: 40 * zoom
  };
  const y = {
    x: 80 * zoom,
    y: -40 * zoom
  };
  const z = {
    x: 0 * zoom,
    y: -80 * zoom
  };

  return {
    x,
    y,
    z
  };
}
```

```js
c_height = 805
```

```js
c_width = 805
```

```js
files = {
  return {
    bee1: {
      file: FileAttachment("bee1.png"),
      blocks: [[0, 0, 1]]
    },
    crow1: {
      file: FileAttachment("crow1.png"),
      blocks: [[0, 0, 1]]
    },
    door1: {
      file: FileAttachment("door1.png"),
      blocks: [[0, 0, 1], [0, 0, 2]]
    },
    foliage1: {
      file: FileAttachment("ground_tile_foliage1.png"),
      blocks: [[0, 0, 0]]
    },
    foliage2: {
      file: FileAttachment("ground_tile_foliage2.png"),
      blocks: [[0, 0, 0]]
    },
    porous1: {
      file: FileAttachment("ground_tile_porous1.png"),
      blocks: [[0, 0, 0]]
    },
    porous2: {
      file: FileAttachment("ground_tile_porous2.png"),
      blocks: [[0, 0, 0]]
    },
    stair1: {
      file: FileAttachment("stair1.png"),
      blocks: [[0, 0, 0], [0, 0, 1]]
    },
    // Stair 2 has a bug where it improperly draws over whatever is either below or above it
    // stair2: { file: FileAttachment("stair2.png"), blocks: [[0, 0, 1]] },
    // I don't like the look of stair 3 because it feels like it doesn't match the rest of the blocks
    // stair3: { file: FileAttachment("stair3.png"), blocks: [[0, 0, 0]] },
    stair4: {
      file: FileAttachment("stair4.png"),
      blocks: [[0, 0, 1], [0, 0, 2], [0, 0, 3], [0, 0, 4]]
    },
    reeds1: {
      file: FileAttachment("reeds1.png"),
      blocks: [[0, 0, 1], [0, 0, 2], [0, 0, 3]]
    },
    rock1: {
      file: FileAttachment("rock1.png"),
      blocks: [[0, 0, 1]]
    },
    tomb1: {
      file: FileAttachment("tomb1.png"),
      blocks: [[0, 0, 1], [0, 0, 2], [0, 0, 3], [0, 0, 4]]
    }
  };
}
```

```js
import { slider, button } from "@jashkenas/inputs"
```

```js
d3 = require("d3-delaunay")
```
