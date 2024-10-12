import {Inspector} from "@observablehq/inspector";
import Immutable from "immutable";

function inspectFulfilled(value) {
  const div = document.createElement("div");
  const inspector = new Inspector(div);
  inspector.fulfilled(value);
  return div;
}

function inspectRejected(value) {
  const div = document.createElement("div");
  const inspector = new Inspector(div);
  inspector.rejected(value);
  return div;
}

export function fulfilledArray() {
  return inspectFulfilled([1, 2, 3]);
}

export function fulfilledArrayOpen() {
  const div = inspectFulfilled([1, 2, 3]);
  div.querySelector("a").dispatchEvent(new Event("mouseup"));
  return div;
}

export function fulfilledIntoMultiple() {
  const div = document.createElement("div");
  const createInspector = Inspector.into(div);
  createInspector().fulfilled(1);
  createInspector().fulfilled(2);
  createInspector().fulfilled(3);
  return div;
}

export function fulfilledElement() {
  const span = document.createElement("span");
  span.textContent = "Surprise!";
  return inspectFulfilled(span);
}

export function fulfilledNumber() {
  return inspectFulfilled(42);
}

export function fulfilledString() {
  return inspectFulfilled("hi");
}

export function fulfilledString10Lines() {
  return inspectFulfilled(Array.from({length: 10}, () => "hi").join("\n"));
}

export function fulfilledString21Lines() {
  return inspectFulfilled(Array.from({length: 21}, () => "hi").join("\n"));
}

export function fulfilledString30Lines() {
  return inspectFulfilled(Array.from({length: 30}, () => "hi").join("\n"));
}

export function fulfilledString30LinesOpen() {
  const div = inspectFulfilled(Array.from({length: 30}, () => "hi").join("\n"));
  div.querySelector(".observablehq--string-expand").dispatchEvent(new Event("mouseup"));
  return div;
}

export function fulfilledMap() {
  return inspectFulfilled(new Map([["foo", 1], ["bar", 2]]));
}

export function fulfilledMapProto() {
  class SubMap extends Map {}
  return inspectFulfilled(Object.getPrototypeOf(new SubMap()));
}

export function fulfilledSet() {
  return inspectFulfilled(new Set(["foo", "bar"]));
}

export function fulfilledSetProto() {
  class SubSet extends Set {}
  return inspectFulfilled(Object.getPrototypeOf(new SubSet()));
}

export function fulfilledImmutableMap() {
  return inspectFulfilled(Immutable.Map([["foo", 1], ["bar", 2]]));
}

export function fulfilledImmutableMapOpen() {
  const div = inspectFulfilled(Immutable.Map([["foo", 1], ["bar", 2]]));
  div.querySelector("a").dispatchEvent(new Event("mouseup"));
  return div;
}

export function fulfilledImmutableSet() {
  return inspectFulfilled(Immutable.Set([1, 2, 3]));
}

export function fulfilledImmutableSetOpen() {
  const div = inspectFulfilled(Immutable.Set([1, 2, 3]));
  div.querySelector("a").dispatchEvent(new Event("mouseup"));
  return div;
}

export function fulfilledImmutableList() {
  return inspectFulfilled(Immutable.List([1, 2, 3]));
}

export function fulfilledImmutableListOpen() {
  const div = inspectFulfilled(Immutable.List([1, 2, 3]));
  div.querySelector("a").dispatchEvent(new Event("mouseup"));
  return div;
}

export function fulfilledImmutableRecord() {
  return inspectFulfilled(Immutable.Record({a: 1})({a: 21}));
}

export function fulfilledImmutableRecordOpen() {
  const div = inspectFulfilled(Immutable.Record({a: 1})({a: 21}));
  div.querySelector("a").dispatchEvent(new Event("mouseup"));
  return div;
}

export function pending() {
  const div = document.createElement("div");
  const inspector = new Inspector(div);
  inspector.pending();
  return div;
}

export function rejectedError() {
  return inspectRejected(new Error("Danger!"));
}

export function rejectedString() {
  return inspectRejected("Danger!");
}
