/* eslint-disable no-process-env */

import assert from "assert";
import {promises as fs} from "fs";
import * as path from "path";
import * as inspectors from "./inspectors.js";
import it from "./jsdom.js";

for (const [name, inspector] of Object.entries(inspectors)) {
  it(`inspector ${name}`, async () => {
    const root = await inspector();
    const actual = `<link rel=stylesheet href="../../src/style.css">\n${root.outerHTML}`;
    const outfile = path.resolve("./test/output", `${name}.html`);
    const diffile = path.resolve("./test/output", `${name}-changed.html`);
    let expected;

    try {
      expected = await fs.readFile(outfile, "utf8");
    } catch (error) {
      if (error.code === "ENOENT" && process.env.CI !== "true") {
        console.warn(`! generating ${outfile}`);
        await fs.writeFile(outfile, actual, "utf8");
        return;
      } else {
        throw error;
      }
    }

    if (actual === expected) {
      if (process.env.CI !== "true") {
        try {
          await fs.unlink(diffile);
          console.warn(`! deleted ${diffile}`);
        } catch (error) {
          if (error.code !== "ENOENT") {
            throw error;
          }
        }
      }
    } else {
      console.warn(`! generating ${diffile}`);
      await fs.writeFile(diffile, actual, "utf8");
    }

    assert(actual === expected, `${name} must match snapshot`);
  });
}
