import {isarray, isindex} from "./array.js";
import inspectExpanded from "./expanded.js";
import formatSymbol from "./formatSymbol.js";
import inspectName from "./inspectName.js";
import {inspect, replace} from "./inspect.js";
import {isown, symbolsof, tagof, valueof} from "./object.js";
import {immutableName} from "./immutable.js";

function hasSelection(elem) {
  const sel = window.getSelection();
  return (
    sel.type === "Range" &&
    (sel.containsNode(elem, true) ||
      elem.contains(sel.anchorNode) ||
      elem.contains(sel.focusNode))
  );
}

export default function inspectCollapsed(object, shallow, name, proto) {
  let arrayish = isarray(object);
  let tag, fields, next, n;

  if (object instanceof Map) {
    if (object instanceof object.constructor) {
      tag = `Map(${object.size})`;
      fields = iterateMap;
    } else { // avoid incompatible receiver error for prototype
      tag = "Map()";
      fields = iterateObject;
    }
  } else if (object instanceof Set) {
    if (object instanceof object.constructor) {
      tag = `Set(${object.size})`;
      fields = iterateSet;
    } else { // avoid incompatible receiver error for prototype
      tag = "Set()";
      fields = iterateObject;
    }
  } else if (arrayish) {
    tag = `${object.constructor.name}(${object.length})`;
    fields = iterateArray;
  } else if ((n = immutableName(object))) {
    tag = `Immutable.${n.name}${n.name === 'Record' ? '' : `(${object.size})`}`;
    arrayish = n.arrayish;
    fields = n.arrayish ? iterateImArray : n.setish ? iterateImSet : iterateImObject;
  } else {
    tag = tagof(object);
    fields = iterateObject;
  }

  if (shallow) {
    const span = document.createElement("span");
    span.className = "observablehq--shallow";
    if (name) {
      span.appendChild(inspectName(name));
    }
    span.appendChild(document.createTextNode(tag));
    span.addEventListener("mouseup", function(event) {
      if (hasSelection(span)) return;
      event.stopPropagation();
      replace(span, inspectCollapsed(object));
    });
    return span;
  }

  const span = document.createElement("span");
  span.className = "observablehq--collapsed";
  if (name) {
    span.appendChild(inspectName(name));
  }
  const a = span.appendChild(document.createElement("a"));
  a.innerHTML = `<svg width=8 height=8 class='observablehq--caret'>
    <path d='M7 4L1 8V0z' fill='currentColor' />
  </svg>`;
  a.appendChild(document.createTextNode(`${tag}${arrayish ? " [" : " {"}`));
  span.addEventListener("mouseup", function(event) {
    if (hasSelection(span)) return;
    event.stopPropagation();
    replace(span, inspectExpanded(object, null, name, proto));
  }, true);

  fields = fields(object);
  for (let i = 0; !(next = fields.next()).done && i < 20; ++i) {
    if (i > 0) span.appendChild(document.createTextNode(", "));
    span.appendChild(next.value);
  }

  if (!next.done) span.appendChild(document.createTextNode(", …"));
  span.appendChild(document.createTextNode(arrayish ? "]" : "}"));

  return span;
}

function* iterateMap(map) {
  for (const [key, value] of map) {
    yield formatMapField(key, value);
  }
  yield* iterateObject(map);
}

function* iterateSet(set) {
  for (const value of set) {
    yield inspect(value, true);
  }
  yield* iterateObject(set);
}

function* iterateImSet(set) {
  for (const value of set) {
    yield inspect(value, true);
  }
}

function* iterateImArray(array) {
  let i0 = -1, i1 = 0;
  for (const n = array.size; i1 < n; ++i1) {
    if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
    yield inspect(array.get(i1), true);
    i0 = i1;
  }
  if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
}

function* iterateArray(array) {
  let i0 = -1, i1 = 0;
  for (const n = array.length; i1 < n; ++i1) {
    if (i1 in array) {
      if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
      yield inspect(valueof(array, i1), true);
      i0 = i1;
    }
  }
  if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
  for (const key in array) {
    if (!isindex(key) && isown(array, key)) {
      yield formatField(key, valueof(array, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(array)) {
    yield formatField(formatSymbol(symbol), valueof(array, symbol), "observablehq--symbol");
  }
}

function* iterateObject(object) {
  for (const key in object) {
    if (isown(object, key)) {
      yield formatField(key, valueof(object, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(object)) {
    yield formatField(formatSymbol(symbol), valueof(object, symbol), "observablehq--symbol");
  }
}

function* iterateImObject(object) {
  for (const [key, value] of object) {
    yield formatField(key, value, "observablehq--key");
  }
}

function formatEmpty(e) {
  const span = document.createElement("span");
  span.className = "observablehq--empty";
  span.textContent = e === 1 ? "empty" : `empty × ${e}`;
  return span;
}

function formatField(key, value, className) {
  const fragment = document.createDocumentFragment();
  const span = fragment.appendChild(document.createElement("span"));
  span.className = className;
  span.textContent = key;
  fragment.appendChild(document.createTextNode(": "));
  fragment.appendChild(inspect(value, true));
  return fragment;
}

function formatMapField(key, value) {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(inspect(key, true));
  fragment.appendChild(document.createTextNode(" => "));
  fragment.appendChild(inspect(value, true));
  return fragment;
}
