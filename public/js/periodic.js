import * as THREE from "three";
import TWEEN from "three/addons/libs/tween.module.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";
//import parameters from "/static/js/bret-victor.js";
// function paramters(i) {
//   const document.querySelector('.')
//   return i
// }
console.log(window.parameters);
window.parameters = window.parameters || function () {};
// const parameters = () => {
//   console.log(123123);
//   return "_____";
// };
//const imported_shit = document.querySelector(".parameters");
const width = innerWidth * 0.8,
  height = innerHeight * 0.8;
const table = [
  "H",
  "Hydrogen",
  "1.00794",
  1,
  1,
  "He",
  "Helium",
  "4.002602",
  18,
  1,
  "Li",
  "Lithium",
  "6.941",
  1,
  2,
  "Be",
  "Beryllium",
  "9.012182",
  2,
  2,
  "B",
  "Boron",
  "10.811",
  13,
  2,
  "C",
  "Carbon",
  "12.0107",
  14,
  2,
  "N",
  "Nitrogen",
  "14.0067",
  15,
  2,
  "O",
  "Oxygen",
  "15.9994",
  16,
  2,
  "F",
  "Fluorine",
  "18.9984032",
  17,
  2,
  "Ne",
  "Neon",
  "20.1797",
  18,
  2,
  "Na",
  "Sodium",
  "22.98976...",
  1,
  3,
  "Mg",
  "Magnesium",
  "24.305",
  2,
  3,
  "Al",
  "Aluminium",
  "26.9815386",
  13,
  3,
  "Si",
  "Silicon",
  "28.0855",
  14,
  3,
  "P",
  "Phosphorus",
  "30.973762",
  15,
  3,
  "S",
  "Sulfur",
  "32.065",
  16,
  3,
  "Cl",
  "Chlorine",
  "35.453",
  17,
  3,
  "Ar",
  "Argon",
  "39.948",
  18,
  3,
  "K",
  "Potassium",
  "39.948",
  1,
  4,
  "Ca",
  "Calcium",
  "40.078",
  2,
  4,
  "Sc",
  "Scandium",
  "44.955912",
  3,
  4,
  "Ti",
  "Titanium",
  "47.867",
  4,
  4,
  "V",
  "Vanadium",
  "50.9415",
  5,
  4,
  "Cr",
  "Chromium",
  "51.9961",
  6,
  4,
  "Mn",
  "Manganese",
  "54.938045",
  7,
  4,
  "Fe",
  "Iron",
  "55.845",
  8,
  4,
  "Co",
  "Cobalt",
  "58.933195",
  9,
  4,
  "Ni",
  "Nickel",
  "58.6934",
  10,
  4,
  "Cu",
  "Copper",
  "63.546",
  11,
  4,
  "Zn",
  "Zinc",
  "65.38",
  12,
  4,
  "Ga",
  "Gallium",
  "69.723",
  13,
  4,
  "Ge",
  "Germanium",
  "72.63",
  14,
  4,
  "As",
  "Arsenic",
  "74.9216",
  15,
  4,
  "Se",
  "Selenium",
  "78.96",
  16,
  4,
  "Br",
  "Bromine",
  "79.904",
  17,
  4,
  "Kr",
  "Krypton",
  "83.798",
  18,
  4,
  "Rb",
  "Rubidium",
  "85.4678",
  1,
  5,
  "Sr",
  "Strontium",
  "87.62",
  2,
  5,
  "Y",
  "Yttrium",
  "88.90585",
  3,
  5,
  "Zr",
  "Zirconium",
  "91.224",
  4,
  5,
  "Nb",
  "Niobium",
  "92.90628",
  5,
  5,
  "Mo",
  "Molybdenum",
  "95.96",
  6,
  5,
  "Tc",
  "Technetium",
  "(98)",
  7,
  5,
  "Ru",
  "Ruthenium",
  "101.07",
  8,
  5,
  "Rh",
  "Rhodium",
  "102.9055",
  9,
  5,
  "Pd",
  "Palladium",
  "106.42",
  10,
  5,
  "Ag",
  "Silver",
  "107.8682",
  11,
  5,
  "Cd",
  "Cadmium",
  "112.411",
  12,
  5,
  "In",
  "Indium",
  "114.818",
  13,
  5,
  "Sn",
  "Tin",
  "118.71",
  14,
  5,
  "Sb",
  "Antimony",
  "121.76",
  15,
  5,
  "Te",
  "Tellurium",
  "127.6",
  16,
  5,
  "I",
  "Iodine",
  "126.90447",
  17,
  5,
  "Xe",
  "Xenon",
  "131.293",
  18,
  5,
  "Cs",
  "Caesium",
  "132.9054",
  1,
  6,
  "Ba",
  "Barium",
  "132.9054",
  2,
  6,
  "La",
  "Lanthanum",
  "138.90547",
  4,
  9,
  "Ce",
  "Cerium",
  "140.116",
  5,
  9,
  "Pr",
  "Praseodymium",
  "140.90765",
  6,
  9,
  "Nd",
  "Neodymium",
  "144.242",
  7,
  9,
  "Pm",
  "Promethium",
  "(145)",
  8,
  9,
  "Sm",
  "Samarium",
  "150.36",
  9,
  9,
  "Eu",
  "Europium",
  "151.964",
  10,
  9,
  "Gd",
  "Gadolinium",
  "157.25",
  11,
  9,
  "Tb",
  "Terbium",
  "158.92535",
  12,
  9,
  "Dy",
  "Dysprosium",
  "162.5",
  13,
  9,
  "Ho",
  "Holmium",
  "164.93032",
  14,
  9,
  "Er",
  "Erbium",
  "167.259",
  15,
  9,
  "Tm",
  "Thulium",
  "168.93421",
  16,
  9,
  "Yb",
  "Ytterbium",
  "173.054",
  17,
  9,
  "Lu",
  "Lutetium",
  "174.9668",
  18,
  9,
  "Hf",
  "Hafnium",
  "178.49",
  4,
  6,
  "Ta",
  "Tantalum",
  "180.94788",
  5,
  6,
  "W",
  "Tungsten",
  "183.84",
  6,
  6,
  "Re",
  "Rhenium",
  "186.207",
  7,
  6,
  "Os",
  "Osmium",
  "190.23",
  8,
  6,
  "Ir",
  "Iridium",
  "192.217",
  9,
  6,
  "Pt",
  "Platinum",
  "195.084",
  10,
  6,
  "Au",
  "Gold",
  "196.966569",
  11,
  6,
  "Hg",
  "Mercury",
  "200.59",
  12,
  6,
  "Tl",
  "Thallium",
  "204.3833",
  13,
  6,
  "Pb",
  "Lead",
  "207.2",
  14,
  6,
  "Bi",
  "Bismuth",
  "208.9804",
  15,
  6,
  "Po",
  "Polonium",
  "(209)",
  16,
  6,
  "At",
  "Astatine",
  "(210)",
  17,
  6,
  "Rn",
  "Radon",
  "(222)",
  18,
  6,
  "Fr",
  "Francium",
  "(223)",
  1,
  7,
  "Ra",
  "Radium",
  "(226)",
  2,
  7,
  "Ac",
  "Actinium",
  "(227)",
  4,
  10,
  "Th",
  "Thorium",
  "232.03806",
  5,
  10,
  "Pa",
  "Protactinium",
  "231.0588",
  6,
  10,
  "U",
  "Uranium",
  "238.02891",
  7,
  10,
  "Np",
  "Neptunium",
  "(237)",
  8,
  10,
  "Pu",
  "Plutonium",
  "(244)",
  9,
  10,
  "Am",
  "Americium",
  "(243)",
  10,
  10,
  "Cm",
  "Curium",
  "(247)",
  11,
  10,
  "Bk",
  "Berkelium",
  "(247)",
  12,
  10,
  "Cf",
  "Californium",
  "(251)",
  13,
  10,
  "Es",
  "Einstenium",
  "(252)",
  14,
  10,
  "Fm",
  "Fermium",
  "(257)",
  15,
  10,
  "Md",
  "Mendelevium",
  "(258)",
  16,
  10,
  "No",
  "Nobelium",
  "(259)",
  17,
  10,
  "Lr",
  "Lawrencium",
  "(262)",
  18,
  10,
  "Rf",
  "Rutherfordium",
  "(267)",
  4,
  7,
  "Db",
  "Dubnium",
  "(268)",
  5,
  7,
  "Sg",
  "Seaborgium",
  "(271)",
  6,
  7,
  "Bh",
  "Bohrium",
  "(272)",
  7,
  7,
  "Hs",
  "Hassium",
  "(270)",
  8,
  7,
  "Mt",
  "Meitnerium",
  "(276)",
  9,
  7,
  "Ds",
  "Darmstadium",
  "(281)",
  10,
  7,
  "Rg",
  "Roentgenium",
  "(280)",
  11,
  7,
  "Cn",
  "Copernicium",
  "(285)",
  12,
  7,
  "Nh",
  "Nihonium",
  "(286)",
  13,
  7,
  "Fl",
  "Flerovium",
  "(289)",
  14,
  7,
  "Mc",
  "Moscovium",
  "(290)",
  15,
  7,
  "Lv",
  "Livermorium",
  "(293)",
  16,
  7,
  "Ts",
  "Tennessine",
  "(294)",
  17,
  7,
  "Og",
  "Oganesson",
  "(294)",
  18,
  7,
];

let camera, scene, renderer;
let controls;

const objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [] };

let _table = [];
for (let i = 0; i < table.length; i += 5) {
  const ele = [];
  for (let j = 0; j < 5; j++) {
    ele.push(table[i * 5 + j]);
  }
  _table.push(ele);
}
init(table);
animate();

function init(table) {
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000,
  );
  camera.position.z = 3000;

  scene = new THREE.Scene();
  // table
  for (let i = 0; i < table.length; i += 5) {
    const element = document.createElement("div");
    element.className = "element";
    element.style.backgroundColor =
      "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";

    if (false) {
      const addition = window.parameters(i);
      //console.log(addition);
      element.appendChild(addition);
    } else {
      const addition = `services/perception/seeing/cropped_image_999.png`;
      // element.appendChild(addition);
      const _ = [];

      let src = _.map((_) => "static/images/blog/seeing/" + _)[
        Math.floor(i / 5)
      ];
      src = [
        "cropped_image_0.png",
        "cropped_image_126.png",
        "cropped_image_153.png",
        "cropped_image_45.png",
        "cropped_image_75.png",

        "cropped_image_1.png",
        "cropped_image_127.png",
        "cropped_image_154.png",
        "cropped_image_46.png",
        "cropped_image_78.png",
        "cropped_image_10.png",
        "cropped_image_128.png",
        "cropped_image_155.png",
        "cropped_image_47.png",
        "cropped_image_79.png",
        "cropped_image_100.png",
        "cropped_image_129.png",
        "cropped_image_156.png",
        "cropped_image_48.png",
        "cropped_image_8.png",
        "cropped_image_101.png",
        "cropped_image_130.png",
        "cropped_image_157.png",
        "cropped_image_49.png",
        "cropped_image_80.png",
        "cropped_image_102.png",
        "cropped_image_131.png",
        "cropped_image_158.png",
        "cropped_image_5.png",
        "cropped_image_81.png",
        "cropped_image_103.png",
        "cropped_image_132.png",
        "cropped_image_159.png",
        "cropped_image_50.png",
        "cropped_image_82.png",
        "cropped_image_104.png",
        "cropped_image_133.png",
        "cropped_image_161.png",
        "cropped_image_51.png",
        "cropped_image_83.png",
        "cropped_image_105.png",
        "cropped_image_134.png",
        "cropped_image_17.png",
        "cropped_image_52.png",
        "cropped_image_84.png",
        "cropped_image_106.png",
        "cropped_image_135.png",
        "cropped_image_19.png",
        "cropped_image_53.png",
        "cropped_image_85.png",
        "cropped_image_107.png",
        "cropped_image_136.png",
        "cropped_image_20.png",
        "cropped_image_54.png",
        "cropped_image_86.png",
        "cropped_image_108.png",
        "cropped_image_137.png",
        "cropped_image_21.png",
        "cropped_image_55.png",
        "cropped_image_87.png",
        "cropped_image_11.png",
        "cropped_image_138.png",
        "cropped_image_22.png",
        "cropped_image_56.png",
        "cropped_image_88.png",
        "cropped_image_111.png",
        "cropped_image_139.png",
        "cropped_image_26.png",
        "cropped_image_57.png",
        "cropped_image_89.png",
        "cropped_image_112.png",
        "cropped_image_14.png",
        "cropped_image_27.png",
        "cropped_image_58.png",
        "cropped_image_9.png",
        "cropped_image_113.png",
        "cropped_image_140.png",
        "cropped_image_28.png",
        "cropped_image_59.png",
        "cropped_image_90.png",
        "cropped_image_114.png",
        "cropped_image_141.png",
        "cropped_image_29.png",
        "cropped_image_60.png",
        "cropped_image_91.png",
        "cropped_image_115.png",
        "cropped_image_142.png",
        "cropped_image_30.png",
        "cropped_image_61.png",
        "cropped_image_92.png",
        "cropped_image_116.png",
        "cropped_image_143.png",
        "cropped_image_31.png",
        "cropped_image_62.png",
        "cropped_image_93.png",
        "cropped_image_117.png",
        "cropped_image_144.png",
        "cropped_image_32.png",
        "cropped_image_63.png",
        "cropped_image_94.png",
        "cropped_image_118.png",
        "cropped_image_145.png",
        "cropped_image_33.png",
        "cropped_image_64.png",
        "cropped_image_95.png",
        "cropped_image_119.png",
        "cropped_image_146.png",
        "cropped_image_35.png",
        "cropped_image_65.png",
        "cropped_image_96.png",
        "cropped_image_12.png",
        "cropped_image_147.png",
        "cropped_image_39.png",
        "cropped_image_66.png",
        "cropped_image_97.png",
        "cropped_image_120.png",
        "cropped_image_148.png",
        "cropped_image_4.png",
        "cropped_image_67.png",
        "cropped_image_98.png",
        "cropped_image_121.png",
        "cropped_image_149.png",
        "cropped_image_40.png",
        "cropped_image_68.png",
        "cropped_image_99.png",
        "cropped_image_122.png",
        "cropped_image_15.png",
        "cropped_image_41.png",
        "cropped_image_7.png",
        "cropped_image_123.png",
        "cropped_image_150.png",
        "cropped_image_42.png",
        "cropped_image_72.png",
        "cropped_image_124.png",
        "cropped_image_151.png",
        "cropped_image_43.png",
        "cropped_image_73.png",
        "cropped_image_125.png",
        "cropped_image_152.png",
        "cropped_image_44.png",
        "cropped_image_74.png",
      ];
      element.appendChild(
        Object.assign(document.createElement("img"), {
          src: "static/images/blog/seeing/" + src[Math.floor(i / 5)],
        }),
      );

      //make mini dynamic land - draw with penicl - computer asks - wdym?
      // const number = document.createElement("div");

      // element.appendChild(number);
      // number.className = "number";
      // number.textContent = i / 5 + 1;
      // const symbol = document.createElement("div");
      // symbol.className = "symbol";
      // symbol.textContent = table[i];
      // number.className = "number";
      // element.appendChild(number);

      // element.appendChild(symbol);
      // const details = document.createElement("div");
      // details.className = "details";
      // details.innerHTML = table[i + 1] + "<br>" + table[i + 2];
      // element.appendChild(details);
    }
    // if youre smart then you have a repsonsibltiy
    // and if you dont fufill that part of you will always wonder and question if you did neoughs
    //i
    // art = one of coollest form of "spiritualtiyy"

    const objectCSS = new CSS3DObject(element);
    objectCSS.position.x = Math.random() * 4000 - 2000;
    objectCSS.position.y = Math.random() * 4000 - 2000;
    objectCSS.position.z = Math.random() * 4000 - 2000;
    scene.add(objectCSS);

    objects.push(objectCSS);

    //

    const object = new THREE.Object3D();
    object.position.x = table[i + 3] * 140 - 1330;
    object.position.y = -(table[i + 4] * 180) + 990;

    targets.table.push(object);
  }

  // sphere

  const vector = new THREE.Vector3();

  for (let i = 0, l = objects.length; i < l; i++) {
    const phi = Math.acos(-1 + (2 * i) / l);
    const theta = Math.sqrt(l * Math.PI) * phi;

    const object = new THREE.Object3D();

    object.position.setFromSphericalCoords(800, phi, theta);

    vector.copy(object.position).multiplyScalar(2);

    object.lookAt(vector);

    targets.sphere.push(object);
  }

  // helix

  for (let i = 0, l = objects.length; i < l; i++) {
    const theta = i * 0.175 + Math.PI;
    const y = -(i * 8) + 450;

    const object = new THREE.Object3D();

    object.position.setFromCylindricalCoords(900, theta, y);

    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;

    object.lookAt(vector);

    targets.helix.push(object);
  }

  // grid

  for (let i = 0; i < objects.length; i++) {
    const object = new THREE.Object3D();

    object.position.x = (i % 5) * 400 - 800;
    object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
    object.position.z = Math.floor(i / 25) * 1000 - 2000;

    targets.grid.push(object);
  }

  //

  renderer = new CSS3DRenderer();
  renderer.setSize(width, height);
  document.getElementById("container").appendChild(renderer.domElement);

  //

  controls = new TrackballControls(camera, renderer.domElement);
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener("change", render);

  const buttonTable = document.getElementById("table");
  buttonTable.addEventListener("click", function () {
    transform(targets.table, 2000);
  });

  const buttonSphere = document.getElementById("sphere");
  buttonSphere.addEventListener("click", function () {
    transform(targets.sphere, 2000);
  });

  const buttonHelix = document.getElementById("helix");
  buttonHelix.addEventListener("click", function () {
    transform(targets.helix, 2000);
  });

  const buttonGrid = document.getElementById("grid");
  buttonGrid.addEventListener("click", function () {
    transform(targets.grid, 2000);
  });

  transform(targets.table, 2000);

  window.addEventListener("resize", onWindowResize);
}
const totalHeight = 2400;
document.addEventListener(
  "scroll",
  function (e) {
    const scrollY =
      e.target.scrollTop !== undefined
        ? e.target.scrollTop
        : window.scrollY || 0;
    const scrollPercent = scrollY / totalHeight;
    const index = Math.floor(scrollPercent * 4);

    const which = Object.keys(targets)[index];
    console.log(index, which);

    transform(targets[which], 2000);
  },
  1000,
);

function transform(targets, duration) {
  TWEEN.removeAll();

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const target = targets[i];

    new TWEEN.Tween(object.position)
      .to(
        { x: target.position.x, y: target.position.y, z: target.position.z },
        Math.random() * duration + duration,
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to(
        { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
        Math.random() * duration + duration,
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();
}

function onWindowResize() {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

  render();
}

function animate() {
  requestAnimationFrame(animate);

  TWEEN.update();

  controls.update();
}

function render() {
  renderer.render(scene, camera);
}

// all your youtubes
// all your history
// more than 4 layouts -> 10 (magic square)
//
//import renderCell from "";
//console.log(imported_shit.textContent);
//const parameters = new Function(imported_shit.textContent || {});
// console.log(parameters);
//const parameters = () => {};
//window.parameters = parameters;
//convert from text to js function
