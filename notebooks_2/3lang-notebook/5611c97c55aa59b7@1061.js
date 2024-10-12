// https://observablehq.com/@jashkenas/breakout@1061
import define1 from "./e93997d5089d7165@2303.js";

function _1(md, highscore, score, gameover) {
  return md`# Breakout!
### High Score: ${highscore}
### Score: ${score}
*This notebook demonstrates using [mutable state](https://beta.observablehq.com/@jashkenas/introduction-to-mutable-state) to build a clone of [Atari Breakout](https://en.wikipedia.org/wiki/Breakout_(video_game)). Adjust the parameters or code below, or watch [the screencast](https://www.youtube.com/watch?v=Aznz6oLbuFQ) to live code along...*
# <marquee style="max-width: 250px">${
    gameover ? "GAME OVER" : "&nbsp;"
  }</marquee>`;
}

function _c(DOM, w, h) {
  var c = DOM.context2d(w, h);
  c.canvas.value = c;
  c.canvas.style.cursor = "none";
  return c.canvas;
}

function _newgame(button) {
  return button("New Game");
}

function _score(newgame) {
  newgame;
  return 0;
}

function _highscore(score) {
  return Math.max(this || 0, score);
}

function _gameover(newgame) {
  newgame;
  return false;
}

function _w(slider, width) {
  return slider({ min: 100, max: width, value: 700, step: 1, title: "Width" });
}

function _h(slider) {
  return slider({ min: 100, max: 800, value: 350, step: 1, title: "Height" });
}

function _speed(slider) {
  return slider({
    min: 0.1,
    max: 10,
    step: 0.1,
    value: 5,
    title: "Speed",
  });
}

function _scale(slider) {
  return slider({ min: 2, max: 20, value: 12, step: 1, title: "Scale" });
}

function _paddleLength(slider) {
  return slider({
    min: 20,
    max: 150,
    value: 90,
    step: 1,
    title: "Paddle length",
  });
}

function _12(md) {
  return md`
## Watch the screencast:

<iframe width="400" height="225" src="https://www.youtube-nocookie.com/embed/Aznz6oLbuFQ?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  `;
}

function _13(md) {
  return md`
The _mutable_ ball is reset to the middle of the screen when a new game begins.
  `;
}

function _ball(newgame, scale, w, h, speed) {
  newgame;
  return { r: scale * 0.7, x: w / 2, y: h - scale * 2, dx: 0, dy: -speed };
}

function _15(md) {
  return md`
In the main \`gameloop\`, we:

- Move the \`ball\` according to its current velocity.
- Check to see if it should bounce off the walls or the paddle.
- Bounce it off any collided brick (removing the brick from the game).
- Set \`gameover\` if the ball has snuck past your paddle to hit the bottom edge of the screen.
  `;
}

function* _gameloop(
  $0,
  $1,
  scale,
  w,
  speed,
  $2,
  h,
  paddleLength,
  eachBrick,
  bricks,
  collide,
  $3,
) {
  let { r, x, y, dx, dy } = $0.value;

  while (!$1.value) {
    // Move the ball.
    (x += dx), (y += dy);

    // Bounce off walls.
    if (x < r + scale) dx = Math.abs(dx);
    if (x + r > w - scale) dx = -Math.abs(dx);
    if (y < r + scale) dy = speed;

    // Bounce off paddle.
    let px = $2.value;
    if (y + r > h - scale && x + r > px && x - r < px + paddleLength) {
      dy = -speed;
      dx = ((x - px) / paddleLength - 0.5) * Math.PI * speed;
    }

    // Bounce off bricks.
    eachBrick(bricks, (brick, row, col) => {
      let hit;
      if (!(hit = collide($0.value, brick))) return;
      bricks[row][col] = null;
      $3.value += brick.points;
      hit == "v" ? (dy = -dy) : (dx = -dx);
      return true;
    });

    $0.value = { r, x, y, dx, dy };
    if (y + r > h) $1.value = true;
    yield true;
  }
}

function _17(md) {
  return md`
Our draw cell is responsible for rendering the game state to the canvas \`c\`, and is called for every tick of the \`gameloop\`.
  `;
}

function _draw(
  gameloop,
  c,
  w,
  h,
  scale,
  eachBrick,
  bricks,
  colors,
  $0,
  paddleLength,
  $1,
) {
  gameloop;

  // Draw the background.
  c.fillStyle = "black";
  c.fillRect(0, 0, w, h);

  // Draw the walls.
  c.fillStyle = "#444";
  c.fillRect(0, 0, scale, h);
  c.fillRect(0, 0, w, scale);
  c.fillRect(w - scale, 0, scale, h);

  // Draw the bricks.
  eachBrick(bricks, (brick) => {
    c.fillStyle = brick.color;
    c.fillRect(brick.x, brick.y, brick.w, brick.h);
  });

  // Draw the paddle.
  c.fillStyle = colors[0];
  c.fillRect($0.value, h - scale, paddleLength, scale);

  // Draw the ball.
  const { r, x, y } = $1.value;
  c.beginPath();
  c.fillStyle = colors[0];
  c.arc(x, y, r, 0, 2 * Math.PI);
  c.fill();
  return true;
}

function _19(md) {
  return md`
We don't want the paddle’s X position to affect the speed at which the gameloop ticks, so we define it as a \`mutable\` value that the \`gameloop\` can read from non-reactively.
  `;
}

function _paddleX(w, paddleLength) {
  return w / 2 - paddleLength / 2;
}

function _21(md) {
  return md`
When the mouse moves over the canvas, update \`paddleX\`, constraining it to the screen space.
  `;
}

function _mousemove(c, $0, scale, paddleLength, w) {
  return (c.canvas.onmousemove = c.canvas.ontouchmove =
    (e) => {
      e.preventDefault();
      const cursor = e.changedTouches ? e.changedTouches[0] : e;
      const left = c.canvas.getBoundingClientRect().left;
      const x = cursor.pageX - left;
      $0.value = Math.min(
        Math.max(scale, x - paddleLength / 2),
        w - paddleLength - scale,
      );
    });
}

function _23(md) {
  return md`
Our collision dection function between a brick and the ball. Returns \`"h"\` if the ball bounced off the side of the brick, and \`"v"\` if it hit the top or bottom.
  `;
}

function _collide() {
  return function collide(ball, brick) {
    const { x, y, r, dx, dy } = ball;
    let hit =
      x + r > brick.x &&
      x - r < brick.x + brick.w &&
      y + r > brick.y &&
      y - r < brick.y + brick.h;
    if (!hit) return false;
    if (y - dy + r <= brick.y || y - dy - r >= brick.y + brick.h) return "v";
    if (x - dx + r <= brick.x || x - dx - r >= brick.x + brick.w) return "h";
  };
}

function _25(md) {
  return md`
We define the bricks as a 2D array of \`rows[columns]\`. Each brick has a position, a width and height, a point value, and a color. When bricks are destroyed by the ball, we set them to \`null\` in the nested array.
  `;
}

function _bricks(newgame, w, scale, eachBrick, colors, brickPoints) {
  newgame;

  const rows = 6,
    columns = Math.floor(w / 50);
  const padding = 3,
    top = 70;
  const width = (w - padding * (columns + 1) - scale * 2) / columns;

  let bricks = new Array(rows).fill(1).map(() => new Array(columns).fill(1));

  eachBrick(bricks, (b, row, col) => {
    bricks[row][col] = {
      w: width,
      h: scale,
      x: col * (width + padding) + padding + scale,
      y: row * (scale + padding) + top,
      color: colors[row],
      points: brickPoints[row],
    };
  });

  return bricks;
}

function _colors() {
  return ["#c84848", "#c66c3a", "#b47a2f", "#a2a229", "#49a049", "#4348c8"];
}

function _brickPoints() {
  return [7, 7, 4, 4, 1, 1];
}

function _eachBrick() {
  return function eachBrick(bricks, cb) {
    for (let row = 0; row < bricks.length; row++) {
      for (let col = 0; col < bricks[row].length; col++) {
        let brick = bricks[row][col];
        if (!brick) continue;
        if (cb(brick, row, col)) return;
      }
    }
  };
}

function _31(md) {
  return md`
_Thanks for the [Breakout tutorial](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript), Mozilla!_
  `;
}

export default function define(runtime, observer) {
  const main = runtime.module();
  main
    .variable(observer())
    .define(["md", "highscore", "score", "gameover"], _1);
  main.variable(observer("viewof c")).define("viewof c", ["DOM", "w", "h"], _c);
  main
    .variable(observer("c"))
    .define("c", ["Generators", "viewof c"], (G, _) => G.input(_));
  main
    .variable(observer("viewof newgame"))
    .define("viewof newgame", ["button"], _newgame);
  main
    .variable(observer("newgame"))
    .define("newgame", ["Generators", "viewof newgame"], (G, _) => G.input(_));
  main.define("initial score", ["newgame"], _score);
  main
    .variable(observer("mutable score"))
    .define("mutable score", ["Mutable", "initial score"], (M, _) => new M(_));
  main
    .variable(observer("score"))
    .define("score", ["mutable score"], (_) => _.generator);
  main
    .variable(observer("highscore"))
    .define("highscore", ["score"], _highscore);
  main.define("initial gameover", ["newgame"], _gameover);
  main
    .variable(observer("mutable gameover"))
    .define(
      "mutable gameover",
      ["Mutable", "initial gameover"],
      (M, _) => new M(_),
    );
  main
    .variable(observer("gameover"))
    .define("gameover", ["mutable gameover"], (_) => _.generator);
  main
    .variable(observer("viewof w"))
    .define("viewof w", ["slider", "width"], _w);
  main
    .variable(observer("w"))
    .define("w", ["Generators", "viewof w"], (G, _) => G.input(_));
  main.variable(observer("viewof h")).define("viewof h", ["slider"], _h);
  main
    .variable(observer("h"))
    .define("h", ["Generators", "viewof h"], (G, _) => G.input(_));
  main
    .variable(observer("viewof speed"))
    .define("viewof speed", ["slider"], _speed);
  main
    .variable(observer("speed"))
    .define("speed", ["Generators", "viewof speed"], (G, _) => G.input(_));
  main
    .variable(observer("viewof scale"))
    .define("viewof scale", ["slider"], _scale);
  main
    .variable(observer("scale"))
    .define("scale", ["Generators", "viewof scale"], (G, _) => G.input(_));
  main
    .variable(observer("viewof paddleLength"))
    .define("viewof paddleLength", ["slider"], _paddleLength);
  main
    .variable(observer("paddleLength"))
    .define("paddleLength", ["Generators", "viewof paddleLength"], (G, _) =>
      G.input(_),
    );
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["md"], _13);
  main.define("initial ball", ["newgame", "scale", "w", "h", "speed"], _ball);
  main
    .variable(observer("mutable ball"))
    .define("mutable ball", ["Mutable", "initial ball"], (M, _) => new M(_));
  main
    .variable(observer("ball"))
    .define("ball", ["mutable ball"], (_) => _.generator);
  main.variable(observer()).define(["md"], _15);
  main
    .variable(observer("gameloop"))
    .define(
      "gameloop",
      [
        "mutable ball",
        "mutable gameover",
        "scale",
        "w",
        "speed",
        "mutable paddleX",
        "h",
        "paddleLength",
        "eachBrick",
        "bricks",
        "collide",
        "mutable score",
      ],
      _gameloop,
    );
  main.variable(observer()).define(["md"], _17);
  main
    .variable(observer("draw"))
    .define(
      "draw",
      [
        "gameloop",
        "c",
        "w",
        "h",
        "scale",
        "eachBrick",
        "bricks",
        "colors",
        "mutable paddleX",
        "paddleLength",
        "mutable ball",
      ],
      _draw,
    );
  main.variable(observer()).define(["md"], _19);
  main.define("initial paddleX", ["w", "paddleLength"], _paddleX);
  main
    .variable(observer("mutable paddleX"))
    .define(
      "mutable paddleX",
      ["Mutable", "initial paddleX"],
      (M, _) => new M(_),
    );
  main
    .variable(observer("paddleX"))
    .define("paddleX", ["mutable paddleX"], (_) => _.generator);
  main.variable(observer()).define(["md"], _21);
  main
    .variable(observer("mousemove"))
    .define(
      "mousemove",
      ["c", "mutable paddleX", "scale", "paddleLength", "w"],
      _mousemove,
    );
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("collide")).define("collide", _collide);
  main.variable(observer()).define(["md"], _25);
  main
    .variable(observer("bricks"))
    .define(
      "bricks",
      ["newgame", "w", "scale", "eachBrick", "colors", "brickPoints"],
      _bricks,
    );
  main.variable(observer("colors")).define("colors", _colors);
  main.variable(observer("brickPoints")).define("brickPoints", _brickPoints);
  main.variable(observer("eachBrick")).define("eachBrick", _eachBrick);
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  main.import("button", child1);
  main.variable(observer()).define(["md"], _31);
  return main;
}
