const sides = [
  { id: null, name: "tornado" }, //view-source:https://threejs.org/examples/webgpu_tsl_galaxy.html
  { id: null, name: "rainbow-carebear-video" }, //view-source:https://threejs.org/examples/webgpu_tsl_galaxy.html
  { id: null, name: "galaxy" }, //view-source:https://threejs.org/examples/webgpu_tsl_galaxy.html
  //https://threejs.org/examples/?q=webgpu#webgpu_compute_birds
  //https://threejs.org/examples/?q=webgpu#webgpu_water
  //https://threejs.org/examples/webgpu_postprocessing_sobel.html
  //https://threejs.org/examples/?q=webgpu#webgpu_tsl_galaxy
  //{ id: 1, name: 'rain' },  //https://threejs.org/examples/webgpu_compute_particles_rain.html
  //{ id: 2, name: 'attractor' }, //view-source:https://threejs.org/examples/webgpu_tsl_compute_attractors_particles.html
  //{ id: 3, name: '' },  //view-source:https://threejs.org/examples/webgpu_textures_2d-array_compressed.html
  //{ id: 4, name: 'Garden salad' }, //https://threejs.org/examples/webgpu_postprocessing_sobel.html
  //{ id: 5, name: 'bloom-robot' },  //https://threejs.org/examples/webgpu_postprocessing_bloom.html
  //{ id: 6, name: 'tornado' } //view-source:https://threejs.org/examples/webgpu_tsl_vfx_tornado.html
];
//alan kay kerpow blue plane - pink plane
function Example() {
  return (
    <fieldset>
      <legend className="text-sm font-semibold leading-6 text-gray-100">
        Select a Demo
      </legend>
      <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
        {sides.map((side, sideIdx) => (
          <div key={sideIdx} className="relative flex items-start py-4">
            <div className="min-w-0 flex-1 text-sm leading-6">
              <label
                htmlFor={side.id}
                className="select-none font-medium text-gray-100"
              >
                {side.name}
              </label>
            </div>
            <div className="ml-3 flex h-6 items-center">
              <input
                defaultChecked="true"
                id="side.id"
                name="plan"
                type="radio"
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Example />);
