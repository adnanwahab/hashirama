import { Runtime, Inspector, Library } from "./runtime/src/index.js";

function _1(md) {
  return md`
# Scratch pad - for (robotics.university)
  `;
}

function _potrace() {
  return import(
    "https://unpkg.com/esm-potrace-wasm@0.4.1/dist/index.js?module"
  );
}

function _rescue_time_key() {
  return `B63NIk45O2Zui4ddzghKW23WAc4IhpolFXdyM0l0`;
}

function _docs() {
  return `https://www.rescuetime.com/anapi/setup/documentation`;
}

function _eat_docs() {
  return "100_apis ";
}

async function _7(images) {
  return await images[0];
}

function _make_img() {
  return async (src) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    await img.decode();
    return img;
  };
}

function _skyblue(FileAttachment) {
  return FileAttachment("frame_6937.jpg").image();
}

function _images(_, make_img) {
  return _.map(make_img).slice(0, 100);
}

function _12(htl) {
  return htl.html`<img src="https://files.hashirama.blog/youtube/apply_vfx/ouran_light_bulb/frame_7044.jpg">`;
}

function _img_names() {
  let min = 6825;
  let max = 7044;
  let indicies = [];
  for (let i = min; i < max; i++) indicies.push(i);
  const mk_url = (n) => `frame_${n}.jpg`;
  return indicies.map(mk_url);
}

function _14(FileAttachment) {
  return FileAttachment("frame_6942.jpg").json();
}
import * as _stdlib from "./runtime/src/stdlib/src/index.js";

async function* _15(draw_img, img_names) {
  function sendSvgToServer(svgElement, filename) {
    const svgString = svgElement;

    const serverCode = `
      import { writeFile, mkdir } from "fs/promises";
      import path from "path";
      const svgContent = \`<svg xmlns="http://www.w3.org/2000/svg">${svgString.innerHTML}</svg>\`
      const filename = "${filename.replace(".jpg", ".svg")}";
      async function saveSvgToFile(filename, svgContent) {
        try {
          const directoryPath = path.join("static", "lottie");
          const filePath = path.join(directoryPath, filename);

          await mkdir(directoryPath, { recursive: true });
          await writeFile(filePath, svgContent, "utf8");

          console.log('SVG saved successfully at ' + filePath);
          return { success: true, path: filePath };
        } catch (error) {
          console.error("Error saving SVG:", error);
          return { success: false, error: error.message };
        }
      }
      saveSvgToFile(filename, svgContent);
    `;
    // bun linter - standard - on this - highlight + stuff
    // fetch requestion to llama -> prompt - double heck if this ode makes ense
    const serverUrl = self.location.origin + "/observable-server";
    fetch(serverUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        //svg: svgContent,
        js: serverCode,
        filename: filename.replace(".jpg", ".js"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
        return { error: error.message };
      });
  }
  for (let i = 0; i < img_names.length; i++) {
    const file_name = img_names[i];
    const svgElement = await draw_img(file_name);
    //console.log(svgElement);
    sendSvgToServer(svgElement.firstElementChild, file_name);

    //return svgElement;
  }
  // const svgElement = await draw_img(img_names[0]);
  // sendSvgToServer(svgElement.firstElementChild);
  // console.log(svgElement);
  // return svgElement;
}

async function _17(draw_img, img_names) {
  return await draw_img(img_names[0]);
}

function _svgElement() {
  return document.querySelector("svg");
}

function _19(svgElement) {
  return svgElement.outerHTML;
}

function _draw_img(potrace, FileAttachment, skyblue, html) {
  return async (url) => {
    // Initialize the module once.
    await potrace.init();
    //  FileAttachment("frame_6976.jpg").image()
    const cool_img = FileAttachment("frame_6942.jpg").image();
    /**
     * The `imageBitmapSource` parameter is an `ImageBitmapSource`, that is any of:
     * - `HTMLImageElement`
     * - `SVGImageElement`
     * - `HTMLVideoElement`
     * - `HTMLCanvasElement`
     * - `ImageData`
     * - `ImageBitmap`
     * - `Blob`
     */
    const svg = await potrace.potrace(skyblue, {
      turdsize: 2,
      turnpolicy: 4,
      alphamax: 1,
      opticurve: 1,
      opttolerance: 0.2,
      pathonly: false,
      extractcolors: true,
      posterizelevel: 2, // [1, 255]
      posterizationalgorithm: 0, // 0: simple, 1: interpolation
    });
    //return html`<img src="${src}" alt="Processed Image" />`
    return html`${svg}`;
  };
}

async function _img_list(FileAttachment) {
  return await FileAttachment("img.json").json();
}

function _asdf(FileAttachment) {
  return FileAttachment("frame_6823.jpg").image();
}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() {
    return this.url;
  }
  const fileAttachments = new Map([
    [
      "img.json",
      {
        url: new URL(
          "./files/cda1fa4c2ef9d968f0c2ace4d37caa95431025144bc8aa45d363d5cfff03dd8d21cac6c842b947d1cecb8ff92bd2f270e4ed4f3f9059bb845192a47462796329.json",
          import.meta.url,
        ),
        mimeType: "application/json",
        toString,
      },
    ],
    [
      "frame_6942.jpg",
      {
        url: new URL(
          "./files/ff8d2292b6871fd29c4ffd50f030890c885a59e629d8061eccfc245f73cf5e598c019fbd098accf77000fa8f4eeb8c8c709820ce139aabd8fb80370cf764a586.jpeg",
          import.meta.url,
        ),
        mimeType: "image/jpeg",
        toString,
      },
    ],
    [
      "frame_6937.jpg",
      {
        url: new URL(
          "./files/ed3b20404ebd695193d70ec3b8486e1e4b0bc9e7634c7e5b86ed9f3ff7ecc03e65dab7e2c182403116aade573b46e0a40460f94ec03c924add8a033d8463d328.jpeg",
          import.meta.url,
        ),
        mimeType: "image/jpeg",
        toString,
      },
    ],
    [
      "frame_6823.jpg",
      {
        url: new URL(
          "./files/cbdae86fbaad8452a4c7a5b6613a97e7b4846aa365213e2ac9dc3f4a631feee61fbbc6fdddd20444b0094adde2019aab464a50b5d15dcaefddef9163ba4f4329.jpeg",
          import.meta.url,
        ),
        mimeType: "image/jpeg",
        toString,
      },
    ],
  ]);
  main.builtin(
    "FileAttachment",
    runtime.fileAttachments((name) => fileAttachments.get(name)),
  );
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("potrace")).define("potrace", _potrace);
  main
    .variable(observer("rescue_time_key"))
    .define("rescue_time_key", _rescue_time_key);
  main.variable(observer("docs")).define("docs", _docs);
  main.variable(observer("eat_docs")).define("eat_docs", _eat_docs);
  main.variable(observer()).define(["images"], _7);
  main.variable(observer("make_img")).define("make_img", _make_img);
  main
    .variable(observer("skyblue"))
    .define("skyblue", ["FileAttachment"], _skyblue);
  main
    .variable(observer("images"))
    .define("images", ["_", "make_img"], _images);
  main.variable(observer()).define(["htl"], _12);
  main.variable(observer("img_names")).define("img_names", _img_names);
  main.variable(observer()).define(["FileAttachment"], _14);
  main.variable(observer()).define(["draw_img", "img_names"], _15);
  main.variable(observer()).define(["draw_img", "img_names"], _17);
  main.variable(observer("svgElement")).define("svgElement", _svgElement);
  main.variable(observer()).define(["svgElement"], _19);
  main
    .variable(observer("draw_img"))
    .define(
      "draw_img",
      ["potrace", "FileAttachment", "skyblue", "html"],
      _draw_img,
    );
  main
    .variable(observer("img_list"))
    .define("img_list", ["FileAttachment"], _img_list);
  main.variable(observer("asdf")).define("asdf", ["FileAttachment"], _asdf);
  return main;
}
