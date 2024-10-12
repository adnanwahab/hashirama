export default function inspectName(name) {
  const n = document.createElement("span");
  n.className = "observablehq--cellname";
  n.textContent = `${name} = `;
  return n;
}
