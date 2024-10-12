import inspectName from "./inspectName.js";
import {inspect, replace} from "./inspect.js";

/* eslint-disable no-control-regex */
const NEWLINE_LIMIT = 20;

export default function formatString(string, shallow, expanded, name) {
  if (shallow === false) {
    // String has fewer escapes displayed with double quotes
    if (count(string, /["\n]/g) <= count(string, /`|\${/g)) {
      const span = document.createElement("span");
      if (name) span.appendChild(inspectName(name));
      const textValue = span.appendChild(document.createElement("span"));
      textValue.className = "observablehq--string";
      textValue.textContent = JSON.stringify(string);
      return span;
    }
    const lines = string.split("\n");
    if (lines.length > NEWLINE_LIMIT && !expanded) {
      const div = document.createElement("div");
      if (name) div.appendChild(inspectName(name));
      const textValue = div.appendChild(document.createElement("span"));
      textValue.className = "observablehq--string";
      textValue.textContent = "`" + templatify(lines.slice(0, NEWLINE_LIMIT).join("\n"));
      const splitter = div.appendChild(document.createElement("span"));
      const truncatedCount = lines.length - NEWLINE_LIMIT;
      splitter.textContent = `Show ${truncatedCount} truncated line${truncatedCount > 1 ? "s": ""}`; splitter.className = "observablehq--string-expand";
      splitter.addEventListener("mouseup", function (event) {
        event.stopPropagation();
        replace(div, inspect(string, shallow, true, name));
      });
      return div;
    }
    const span = document.createElement("span");
    if (name) span.appendChild(inspectName(name));
    const textValue = span.appendChild(document.createElement("span"));
    textValue.className = `observablehq--string${expanded ? " observablehq--expanded" : ""}`;
    textValue.textContent = "`" + templatify(string) + "`";
    return span;
  }

  const span = document.createElement("span");
  if (name) span.appendChild(inspectName(name));
  const textValue = span.appendChild(document.createElement("span"));
  textValue.className = "observablehq--string";
  textValue.textContent = JSON.stringify(string.length > 100 ?
    `${string.slice(0, 50)}…${string.slice(-49)}` : string);
  return span;
}

function templatify(string) {
  return string.replace(/[\\`\x00-\x09\x0b-\x19]|\${/g, templatifyChar);
}

function templatifyChar(char) {
  var code = char.charCodeAt(0);
  switch (code) {
    case 0x8: return "\\b";
    case 0x9: return "\\t";
    case 0xb: return "\\v";
    case 0xc: return "\\f";
    case 0xd: return "\\r";
  }
  return code < 0x10 ? "\\x0" + code.toString(16)
      : code < 0x20 ? "\\x" + code.toString(16)
      : "\\" + char;
}

function count(string, re) {
  var n = 0;
  while (re.exec(string)) ++n;
  return n;
}
