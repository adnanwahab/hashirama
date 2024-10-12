import {Inspector} from "@observablehq/inspector";
import assert from "assert";
import it from "./jsdom.js";

it(`Inspector.into(selector) throws an error if no element is found`, () => {
  assert.throws(() => Inspector.into("unknown-id"), /container not found/);
});
