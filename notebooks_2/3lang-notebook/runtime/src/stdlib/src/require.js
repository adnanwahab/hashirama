//import {require as initialRequire, requireFrom} from "d3-require";
//import {require as initialRequire, requireFrom} from "https://unpkg.com/d3-require@1.3.0/dist/d3-require.min.js";
import { requireFrom} from 'https://unpkg.com/d3-require@1.3.0/src/index.mjs?module'
import { require} from 'https://unpkg.com/d3-require@1.3.0/src/index.mjs?module'

// TODO Allow this to be overridden using the Library’s resolver.
export const cdn = "https://cdn.observableusercontent.com/npm/";

//export let requireDefault = initialRequire;
export let requireDefault = require;

export function setDefaultRequire(require) {
  requireDefault = require;
}

export function requirer(resolver) {
  return resolver == null ? requireDefault : requireFrom(resolver);
}
