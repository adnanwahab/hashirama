import { promises as fs } from "fs";
import path from "path";
import { parse } from "svgson";

// Directory where your SVG files are located
const svgDirectory = "./static/lottie";

// Output file (Lottie JSON)
const outputFilePath = "./output-lottie.json";

// Function to read SVG files from the directory
async function readSvgFiles() {
  const files = await fs.readdir(svgDirectory);
  const svgFiles = files.filter(file => path.extname(file) === ".svg");

  const svgContentsPromises = svgFiles.map(file =>
    fs.readFile(path.join(svgDirectory, file), "utf8")
  );

  return Promise.all(svgContentsPromises);
}

// box 1 - known good 

//box 2 - known good 



// llm gen code - guess - box 1 + box 2 = box 3? --- then you try ?? - then :(

// Function to convert SVG to JSON using svgson and create Lottie JSON
async function convertSvgToLottie() {
  try {
    const svgContents = await readSvgFiles();
    console.log(svgContents.length)

    const frames = await Promise.all(
      svgContents.map(async (svgContent, index) => {
        const parsedSvg = await parse(svgContent);
        return {
          index,
          svgData: parsedSvg,
        };
      })
    );
    console.log(frames.length)
    // Generate Lottie-compatible structure
    const lottieJson = {
      v: "5.5.7", // Lottie version
      fr: 30, // Frame rate
      ip: 0, // In-point (starting frame)
      op: frames.length * 10, // Out-point (total length)
      w: 500, // Width of your animation (can be customized)
      h: 500, // Height of your animation (can be customized)
      nm: "SVG to Lottie", // Name of the animation
      ddd: 0, // 3D or not (0 = 2D)
      assets: [], // Assets used by the animation (empty for SVGs)
      layers: frames.map(frame => ({
        ddd: 0, // 2D layer
        ind: frame.index, // Index
        ty: 4, // Type of layer (4 = shape layer)
        nm: `Layer ${frame.index}`, // Name of the layer
        sr: 1, // Stretch
        ks: {
          o: { a: 0, k: 100 }, // Opacity
          r: { a: 0, k: 0 }, // Rotation
          p: { a: 0, k: [250, 250, 0] }, // Position
          a: { a: 0, k: [0, 0, 0] }, // Anchor point
          s: { a: 0, k: [100, 100, 100] } // Scale
        },
        shapes: [
          {
            ty: "gr", // Group of shapes
            it: [
              {
                ty: "sh", // Shape item
                ks: {
                  a: 0, // Keyframes for the shape
                  k: frame.svgData // SVG shape data converted to Lottie format
                }
              }
            ],
            nm: "Shape Group",
            np: 1,
            cix: 2,
            ix: 1,
            mn: "ADBE Vector Group",
            hd: false
          }
        ],
        ip: frame.index * 10, // In-point (starting frame for this layer)
        op: (frame.index + 1) * 10, // Out-point (ending frame for this layer)
        st: frame.index * 10, // Start time for the layer
        bm: 0 // Blending mode
      })),
      markers: [] // Markers can be used for tagging specific times in the animation
    };

    // Write Lottie JSON to file
    await fs.writeFile(outputFilePath, JSON.stringify(lottieJson, null, 2));
    console.log(`Lottie animation JSON saved to ${outputFilePath}`);
  } catch (err) {
    console.error("Error converting SVG to Lottie:", err);
  }
}

// Run the conversion
convertSvgToLottie();


// import { promises as fs } from "fs";
// import path from "path";
// import { parse } from "svgson";

// // Directory where your SVG files are located
// const svgDirectory = "./static/lottie/";


// // Output file (Lottie JSON)
// const outputFilePath = "./output-lottie.json";
// // Function to read SVG files from the directory
// async function readSvgFiles() {
//   const files = await fs.readdir(svgDirectory);
//   const jsonFiles = files.filter(file => path.extname(file) === ".json");
//   const jsonContentsPromises = jsonFiles.map(file =>
//     fs.readFile(path.join(svgDirectory, file), "utf8")
//   );

//   const jsonContents = await Promise.all(jsonContentsPromises);
//   //console.log(jsonContents)

//   const svgFromJson = jsonContents.map(content => {
//     const parsedJson = JSON.parse(content);
//     return parsedJson.svg;
//   });

//   const svgContentsPromises = files.filter(file => path.extname(file) === ".svg").map(file =>
//     fs.readFile(path.join(svgDirectory, file), "utf8")
//   );

//   const svgContents = await Promise.all(svgContentsPromises);

//   const mergedSvgContents = [...svgContents, ...svgFromJson];
    
//   const svgFiles = files.filter(file => path.extname(file) === ".svg");
//   const svgContentsPromises = svgFiles.map(file =>
//     fs.readFile(path.join(svgDirectory, file), "utf8")
//   );
// return  Promise.all(svgFromJson)
//   //return Promise.all(mergedSvgContents);
// }

// // Function to convert SVG to JSON using svgson and create Lottie JSON
// async function convertSvgToLottie() {
//   try {
//     const svgContents = await readSvgFiles();

//     const frames = await Promise.all(
//       svgContents.map(async (svgContent, index) => {
//         const parsedSvg = await parse(svgContent);


//         console.log(parsedSvg)

//         return {
//           index,
//           svgData: parsedSvg,
//         };
//       })
//     );


//     console.log(frames)
//     // Generate Lottie-compatible structure
//     const lottieJson = {
//       v: "5.5.7", // Lottie version
//       fr: 30, // Frame rate
//       ip: 0, // In-point (starting frame)
//       op: frames.length * 10, // Out-point (total length)
//       w: 500, // Width of your animation (can be customized)
//       h: 500, // Height of your animation (can be customized)
//       nm: "SVG to Lottie", // Name of the animation
//       ddd: 0, // 3D or not (0 = 2D)
//       assets: [], // Assets used by the animation (empty for SVGs)
//       layers: frames.map(frame => ({
//         ddd: 0, // 2D layer
//         ind: frame.index, // Index
//         ty: 4, // Type of layer (4 = shape layer)
//         nm: `Layer ${frame.index}`, // Name of the layer
//         sr: 1, // Stretch
//         ks: {
//           o: { a: 0, k: 100 }, // Opacity
//           r: { a: 0, k: 0 }, // Rotation
//           p: { a: 0, k: [250, 250, 0] }, // Position
//           a: { a: 0, k: [0, 0, 0] }, // Anchor point
//           s: { a: 0, k: [100, 100, 100] } // Scale
//         },
//         shapes: [
//           {
//             ty: "gr", // Group of shapes
//             it: [
//               {
//                 ty: "sh", // Shape item
//                 ks: {
//                   a: 0, // Keyframes for the shape
//                   k: frame.svgData // SVG shape data converted to Lottie format
//                 }
//               }
//             ],
//             nm: "Shape Group",
//             np: 1,
//             cix: 2,
//             ix: 1,
//             mn: "ADBE Vector Group",
//             hd: false
//           }
//         ],
//         ip: frame.index * 10, // In-point (starting frame for this layer)
//         op: (frame.index + 1) * 10, // Out-point (ending frame for this layer)
//         st: frame.index * 10, // Start time for the layer
//         bm: 0 // Blending mode
//       })),
//       markers: [] // Markers can be used for tagging specific times in the animation
//     };

//     // Write Lottie JSON to file
//     await fs.writeFile(outputFilePath, JSON.stringify(lottieJson, null, 2));
//     console.log(`Lottie animation JSON saved to ${outputFilePath}`);
//   } catch (err) {
//     console.error("Error converting SVG to Lottie:", err);
//   }
// }

// // Run the conversion
// convertSvgToLottie();
