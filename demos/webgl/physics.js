import { init } from "../../lib/main";
import updateSpritesWGSL from "../shaders/updateSprites.wgsl?raw";
import spriteWGSLFS from '../shaders/sprite_fs.wgsl?raw';
import spriteWGSLVS from '../shaders/sprite_vs.wgsl?raw';

//should be two draw calls
//drawCompute()
//drawScreen()

//draw() - schedules a draw to happen in the next frame 
//in main_run_loop 
  //renderPipelines.exec()
//water = init(options)

let draw1 = {
  attributes: [],
  uniforms: [],
  shader: []
}

let data = {}
const options = {
  data: {},
  compute: { //optional
  vs: spriteWGSLVS,
  fs: spriteWGSLFS,
  cs: updateSpritesWGSL,
   simParams:{
      deltaT: 0.04,
      rule1Distance: 0.1,
      rule2Distance: 0.025,
      rule3Distance: 0.025,
      rule1Scale: 0.02,
      rule2Scale: 0.05,
      rule3Scale: 0.005,
    },
  }
}

//let draw = await init(options);
/// let compute = await init(options);


//regl.frame(function () {
//  draw()
// compute()
//})


///  simulation computeDrawCall
///  simulation computeDrawCall
//   blur computeDrawCall
/// one view
//

//rename draw to render
//[render, compute] = init(vertexBuffers,shaders...etc)
//render(uniforms)

//compute = init({})
//

async function physics() {
  options.data = options.data  //extend 
  console.log('start draw loop')

  let draw = await init(options);
  draw(data);
  
// particle buffer
// physics simulation 
//  each particle has a position and velocity
//  every frame, add velocity to position
//        add stuff to velocity based on distance to mouse or vector field based on image
//          or based on every other particles position
//  

  requestAnimationFrame(function test() {
    draw(data);
      requestAnimationFrame(test)
      //setTimeout(test, 500)
  });
  }
  
  export default physics;