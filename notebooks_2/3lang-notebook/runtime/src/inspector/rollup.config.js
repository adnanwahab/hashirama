import node from "@rollup/plugin-node-resolve";
import {terser} from "rollup-plugin-terser";

const copyright = `// @observablehq/inspector v9000 Copyright ${(new Date).getFullYear()} Observable, Inc.`;

export default [
  {
    input: "src/index.js",
    plugins: [
      node(),
      terser({output: {preamble: copyright}})
    ],
    output: {
      format: "umd",
      extend: true,
      name: "observablehq",
      file: "dist/inspector.js"
    }
  }
];
