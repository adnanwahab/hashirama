import dispatch from "./dispatch.js";
import inspectCollapsed from "./collapsed.js";
import inspectExpanded from "./expanded.js";
import inspectName from "./inspectName.js";
import formatDate from "./formatDate.js";
import formatError from "./formatError.js";
import formatRegExp from "./formatRegExp.js";
import formatString from "./formatString.js";
import formatSymbol from "./formatSymbol.js";
import inspectFunction from "./inspectFunction.js";
import {FORBIDDEN} from "./object.js";

const {prototype: {toString}} = Object;

export function inspect(value, shallow, expand, name, proto) {
  let type = typeof value;
  switch (type) {
    case "boolean":
    case "undefined": { value += ""; break; }
    case "number": { value = value === 0 && 1 / value < 0 ? "-0" : value + ""; break; }
    case "bigint": { value = value + "n"; break; }
    case "symbol": { value = formatSymbol(value, name); break; }
    case "function": { return inspectFunction(value, name); }
    case "string": { return formatString(value, shallow, expand, name); }
    default: {
      if (value === null) { type = null, value = "null"; break; }
      if (value instanceof Date) { type = "date", value = formatDate(value, name); break; }
      if (value === FORBIDDEN) { type = "forbidden", value = "[forbidden]"; break; }
      switch (toString.call(value)) {
        case "[object RegExp]": { type = "regexp", value = formatRegExp(value, name); break; }
        case "[object Error]": // https://github.com/lodash/lodash/blob/master/isError.js#L26
        case "[object DOMException]": { type = "error", value = formatError(value, name); break; }
        default: return (expand ? inspectExpanded : inspectCollapsed)(value, shallow, name, proto);
      }
      break;
    }
  }
  const span = document.createElement("span");
  if (name) span.appendChild(inspectName(name));
  const n = span.appendChild(document.createElement("span"));
  n.className = `observablehq--${type}`;
  n.textContent = value;
  return span;
}

export function replace(spanOld, spanNew) {
  if (spanOld.classList.contains("observablehq--inspect")) spanNew.classList.add("observablehq--inspect");
  spanOld.parentNode.replaceChild(spanNew, spanOld);
  dispatch(spanNew, "load");
}
