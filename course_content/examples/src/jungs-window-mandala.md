```js
md`# Jung's Window Mandala`
```

```js
md` Jung described the final mandala he painted as: 
>A luminous flower in the center, with stars rotating about it. Around the flower, walls with eight gates. The whole conceived as a transparent window... The rose in the center is depicted as a ruby, its outer ring being conceived as a wheel, or a wall with gates (so that nothing can come out from inside or go in from outside)... [The rose] shone like a four-rayed star. The square represents the wall of the park and at the same time a street leading round the park in a square. From it radiate eight main streets, and from each of these eight side-streets, which meet in a shining red central point. <br/>
<div style="text-align: right">Red Book, page 318, footnote 296</div>`
```

```js
viewof inputVariables = inputsGroup([
 [
    slider({
    min: -1, 
    max: 1, 
    step: .05, 
    value: .4, 
    title: "Animation Speed",
    theme: 'default-thin',
    highlight: {
      lower: -.04,
      upper: .04,
      colors: {
        normal: '#EDEDED',
        inactive: '#7295FF',
        active: '#000000'
      },
      preventUpdate: false
    }
    }),
   select({
      title: "Subgroup Action",
      //description: "Transformations that leave the whole the same",
      options: [
        "C1 ⟳ Do Nothing", 
        "C2 🗘 Rotate 180°", 
        "C4 ↷ Rotate Right 90°", 
        "D2 ↔ Horizontal Reflection", 
        "D2 ↕ Vertical Reflection", 
        "D2 ⤢ Diagonal Reflection", 
        "D2 ⤡ Diagonal Reflection",
        "D4 🟄 Cardinal Reflections", 
        "D4 🞩 Ordinal Reflections",
        "D8 🞼 All Reflections" ],
      value: "D8 🞼 All Reflections"
    })
  ]
])
```

```js
windowMandala ={ 
  // SET UP ------------------------------------
  let action = mutable sym
  
  // scene
  const aspect = 1
  const width = Math.min(window.innerWidth,625)
  const height = width * aspect
  const scene = new THREE.Scene()
  
  // camera
  const camera = new THREE.PerspectiveCamera(30, width/height, 1, 1000) // field of view, aspect ratio, near, far plane
  camera.position.set( 0, 0, 47 ) // camera is +40 in z direction
  camera.lookAt( 0, 0, 0 )        // camera is looking at origin
  
  // renderer
  const renderer = new THREE.WebGLRenderer({antialias: true}) // most powerful all purpose renderer, with smooth edges
  renderer.setClearColor("#2e2023") // background color
  renderer.setSize(width, height) // set window size
  yield renderer.domElement 
  
  // camera controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement); // allows mouse to move camera
  controls.enableZoom   = false  // disables zoom
  controls.enablePan    = false  // disables pan
  controls.enableRotate = false  // determines if camera can rotate
 
  // MAPS --------------------------------------
  let subset =    [1,1,1,1,1,1,1,1]
  let highlight = [0,0,0,0,0,0,0,0]
  
  const ctx = document.createElement('canvas').getContext('2d');
   ctx.canvas.width = 200
   ctx.canvas.height = 200
  const pathPoints = [.5,0,  1,0,  1,.5,  1,1,  .5,1,  0,1,  0,.5,  0,0, .5,0]
  
  function makeOpacity(s, h){
    for(let i=0; i<8; i++){
           if(2*s[i]+h[i]==3){ctx.fillStyle = '#00FF00'}
      else if(2*s[i]+h[i]==2){ctx.fillStyle = '#00CC00'}
      else if(2*s[i]+h[i]==1){ctx.fillStyle = '#000000'}
      else                   {ctx.fillStyle = 'black'}
      ctx.beginPath();
      ctx.moveTo(ctx.canvas.width/2, ctx.canvas.height/2);
      ctx.lineTo(pathPoints[2*i]*ctx.canvas.width, pathPoints[2*i+1]*ctx.canvas.height);
      ctx.lineTo(pathPoints[2*i+2]*ctx.canvas.width, pathPoints[2*i+3]*ctx.canvas.height);
      ctx.fill();
    }
  }
  //makeOpacity(subset, highlight)
  const mapDistricts = new THREE.CanvasTexture(ctx.canvas)
  
  // MATERIALS ---------------------------------
  const loader = new THREE.TextureLoader();
  const matBack = new THREE.MeshBasicMaterial( { map: loader.load(back), transparent: true});
  const matCenter = new THREE.MeshBasicMaterial( { map: loader.load(pleroma), side: THREE.DoubleSide, transparent: true, depthWrite: false, opacity: .8, blending: THREE.AdditiveBlending} );
  const matWalls = new THREE.MeshBasicMaterial( { map: loader.load(hysterema), alphaMap:mapDistricts,  side: THREE.DoubleSide, depthWrite: false, transparent: true, opacity: 1, alphaTest: 0.1, blending: THREE.AdditiveBlending} );
  const matFlare = new THREE.SpriteMaterial({map: loader.load(flare), transparent: true, opacity:.7, blending: THREE.AdditiveBlending, depthWrite: false})
  const matRays = new THREE.SpriteMaterial({map: loader.load(rays), transparent: true, opacity:.4, blending: THREE.AdditiveBlending, depthWrite: false})
  const matHighlight = new THREE.MeshBasicMaterial({color: 0xFF000, side: THREE.DoubleSide, depthWrite: false, transparent: true, opacity: 1, alphaTest: 0.1, blending: THREE.AdditiveBlending})
  
  // HELPERS ------------------------------------
  const helperRoot = new THREE.Mesh( new THREE.BoxGeometry( 8, 8, 8 ) , 
    new THREE.MeshLambertMaterial({color: 0x0000ff, wireframe: true, opacity: 0,transparent: true, depthWrite: false}))
  
  const helper1 = new THREE.Mesh( new THREE.BoxGeometry( 6, 6, 6 ) , 
    new THREE.MeshLambertMaterial({color: 0x0000ff, wireframe: true, opacity: 0,transparent: true, depthWrite: false}))
  helper1.rotation.set(0,0,Math.PI/4)
  helperRoot.add(helper1)
  
  const helper2 = new THREE.Mesh( new THREE.BoxGeometry( 4, 4, 4 ) , 
    new THREE.MeshLambertMaterial({color: 0x0000ff, wireframe: true, opacity: 0,transparent: true, depthWrite: false}))
  helper1.add(helper2)
  
  const helper3 = new THREE.Mesh( new THREE.BoxGeometry( 2, 2, 2 ) , 
    new THREE.MeshLambertMaterial({color: 0x0000ff, wireframe: true, opacity: 0,transparent: true, depthWrite: false}))
  helper3.rotation.set(0,0,-Math.PI/4)
  helper2.add(helper3)
  const helperWedges = new THREE.Mesh( new THREE.BoxGeometry( 2, 2, 2 ) , 
    new THREE.MeshLambertMaterial({color: 0x0000ff, wireframe: true, opacity: 0,transparent: true, depthWrite: false}))
  helper3.add(helperWedges)
  
  // SHAPE ------------------------------------
  const meshCenter = new THREE.Mesh( new THREE.PlaneGeometry(25,25), matCenter)
  meshCenter.position.set(0,0,.05)
  const meshWalls = new THREE.Mesh( new THREE.PlaneGeometry(25,25), matWalls)
  
  const meshBack = new THREE.Mesh( new THREE.PlaneGeometry(32.5,32.5), matBack)
  meshBack.position.set(0,0,-14)
  
  let wedges = []
  let r=11.7
  const wedgeVertices = [0,1,  1,1, 1,0,  1,-1,  0,-1,  -1,-1,  -1,0, -1,1, 0,1]
  for ( var i = 0; i < 8; i ++ ) {
    const geoWedge = new THREE.Geometry()
    geoWedge.vertices.push(
      new THREE.Vector3(r*wedgeVertices[2*i],   r*wedgeVertices[2*i+1], 0),
      new THREE.Vector3(r*wedgeVertices[2*i+2], r*wedgeVertices[2*i+3], 0),
      new THREE.Vector3(0,0,0)
    ) // vertex of triangle
    geoWedge.faces.push( new THREE.Face3( 0, 1, 2 ) )                                // make triangle face from vertices
    geoWedge.computeFaceNormals() // required to know how to light faces
    const object = new THREE.Mesh( geoWedge, matHighlight.clone() ) // assigns a unique material to each wedge
    object.material.color.setHex(0x000000)
    helperWedges.add( object )    // makes wedge a child of the square border
    wedges.push(object)           // adds wedge object to array
  }
  
  let stars = []
  const starPos = [4.52,9.14,0,  9.175,4.285,0,  9.135,-4.45,0,  4.45,-9.11,0,  -4.53,-9.11,0,  -9.19,-4.36,0,  -9.24,4.45,0,  -4.44,9.14,0]
  for( let i=0; i<8; i++){
    const label = new THREE.Sprite(matFlare.clone());
    if(subset[i]==0){label.material.opacity = 0}
    label.position.set(starPos[3*i+0], starPos[3*i+1], starPos[3*i+2])
    label.scale.x = width/70 ;
    label.scale.y = width/70 ;
    meshWalls.add(label)
    stars.push(label)
  }
  
  const rays1 = new THREE.Sprite(matRays.clone());
  rays1.scale.x = width/15 ;
  rays1.scale.y = width/15 ;
  scene.add(rays1)
  
  const rays2 = new THREE.Sprite(matRays.clone());
  rays2.scale.x = width/15 ;
  rays2.scale.y = -width/15 ;
  scene.add(rays2)
  
  // SCENE --------------------------------------
  helper3.add(meshWalls)
  scene.add(meshCenter)
  scene.add(meshBack)
  scene.add(helperRoot)
  
  // Animation function
  function Tween(x,a){
    if(a==1){ x = x + Math.sin(2*x+Math.PI)/2 }             // sin wave tween
    else if(a==2){ x = x-Math.sin(2*x+.5*Math.sin(2*x))/3 } // linear with smooth starts and stops
    return x
  }
  
  // RAYCASTER-----------------------------------
  const mouse = new THREE.Vector2(100,100) // starts mouse position off screen so no objects are highlighted at start
  let intersected
  const raycaster = new THREE.Raycaster()
  
  let x
  let y
  renderer.domElement.onmousemove = event => {
    event.preventDefault();
    console.log(event)
    x=event.layerX
    y=event.layerY
    mouse.x =  ( x / width ) * 2 - 1,
    mouse.y = -( y / height  ) * 2 + 1
  };
  
  //////////////////////////////////////////////////////////////////////////////////////////////
 // RENDER LOOP ///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
  let intersects
  let INTERSECTED;
  let t=0
  let s=0
  let a=0
  let step = 0
  var target = new THREE.Vector3(); // create once an reuse it
  let pi = Math.PI
  
  const render = function(){
    requestAnimationFrame(render) // adjust scale on resize and stops animation when window is closed to save memory
    
    // mouse actions
    raycaster.setFromCamera( mouse, camera ); //raycaster runs each animation frame
    intersects = raycaster.intersectObjects(helperWedges.children); // checks intersection
    
    if ( intersects.length > 0 ) {
		  if ( INTERSECTED != intersects[ 0 ].object ) {
			  INTERSECTED = intersects[ 0 ].object;
			}
		} else {
			INTERSECTED = null;
	  }
    
    // holon
    for(let i=0; i<8; i++){
      if(INTERSECTED == wedges[i]){highlight[i]=1}else{highlight[i]=0}
    }
    for(let i=0; i<8; i++){
      stars[i].material.opacity = .7 * subset[i] * (1+Math.sin(a*2 + pi*i/4)*.02+Math.sin(a*-3 + pi*i/2)*.02+Math.sin(a*5 + pi*i)*.02) +.1*highlight[i] 
    }
    makeOpacity(subset, highlight)
    mapDistricts.needsUpdate = true
    
    //  variable
    s = mutable speed
    action = mutable sym
    t+= .12 *s*s*s
    a+=.1
    
    // animation
    helperRoot.rotation.set(0,0,0)
    helper2.rotation.set(0,0,0)
    
    if(action==0 ){helperRoot.rotation.set(0,0,0)}
    if(action==1 ){helperRoot.rotation.set(0,0,-Tween(t/2,1))}
    if(action==2 ){helperRoot.rotation.set(0,0,-Tween(t,1)/2)}
    
    if(action==3 ){helperRoot.rotation.set(0,Tween(t,2),0)}
    if(action==4 ){helperRoot.rotation.set(Tween(t,2),0,0)}
    if(action==5 ){helper2.rotation   .set(0,Tween(t,2),0)}
    if(action==6 ){helper2.rotation   .set(Tween(t,2),0,0)}
    
    if(action==7){
      if(t>4*pi){t=0}
      if(t<0){t=4*pi}
            if(t<1*pi){helperRoot.rotation.set(Tween(t,2),0,0)
      }else if(t<2*pi){helperRoot.rotation.set(pi,Tween(t,2)+pi,0)
      }else if(t<3*pi){helperRoot.rotation.set(-Tween(t,2)+pi,pi,0)
      }else if(t<4*pi){helperRoot.rotation.set(0,Tween(t,2),0)}
    }
    if(action==8){if(t>4*pi){t=0}
      if(t<0){t=4*pi}
            if(t<1*pi){helper2.rotation.set(Tween(t,2),0,0)
      }else if(t<2*pi){helper2.rotation.set(pi,Tween(t,2)+pi,0)
      }else if(t<3*pi){helper2.rotation.set(-Tween(t,2)+pi,pi,0)
      }else if(t<4*pi){helper2.rotation.set(0,Tween(t,2),0)}
    }
    
    if(action==9){
      if(t>8*pi){t=0}
      if(t<0){t=8*pi}
            if(t<1*pi){helperRoot.rotation.set(0,0,0)            ; helper2.rotation.set(Tween(t,2),0,0)
      }else if(t<2*pi){helperRoot.rotation.set(Tween(t,2)+pi,0,0)   ; helper2.rotation.set(pi,0,0)
      }else if(t<3*pi){helperRoot.rotation.set(pi,0,0)           ; helper2.rotation.set(Tween(t,2)+pi,0,0)
      }else if(t<4*pi){helperRoot.rotation.set(pi,Tween(t,2)+pi,0); helper2.rotation.set(0,0,0)
      }else if(t<5*pi){helperRoot.rotation.set(pi,pi,0)            ; helper2.rotation.set(Tween(t,2),0,0)
      }else if(t<6*pi){helperRoot.rotation.set(-Tween(t,2)+pi,0,0); helper2.rotation.set(0,pi,0)
      }else if(t<7*pi){helperRoot.rotation.set(pi,0,0)             ; helper2.rotation.set(-Tween(t,2),pi,0)
      }else if(t<8*pi){helperRoot.rotation.set(0,Tween(t,2),0)    ; helper2.rotation.set(0,0,0)}
    }
    
    // sun
    rays1.material.rotation = .015 * a
    rays2.material.rotation = -.02 * a
    
    rays1.material.opacity =  .4 * (1+Math.sin(a*.2)*.2+Math.sin(a*-.3+pi)*.1+Math.sin(a*.5)*.05)
    rays2.material.opacity =  .4 * (1+Math.sin(a*.2+pi)*.2+Math.sin(a*-.3 )*.1+Math.sin(a*.5+pi)*.05)
    
    renderer.render(scene, camera) // renders scene
  }
    
  // Input -------------------------
  function clicked (){ 
    for(let i=0; i<8; i++){if(INTERSECTED == wedges[i]){subset[i]= (subset[i]+1)%2}}
  }
  window.addEventListener('click', () => { clicked() })
  window.addEventListener('touchstart', () => { clicked() })
  
  const leftClick = [
    [[1,0,0,0,0,0,0,0], [0,1,0,0,0,0,0,0], [0,0,1,0,0,0,0,0], [0,0,0,1,0,0,0,0],
     [0,0,0,0,1,0,0,0], [0,0,0,0,0,1,0,0], [0,0,0,0,0,0,1,0], [0,0,0,0,0,0,0,1] ],
    [[1,0,0,0,1,0,0,0], [0,1,0,0,0,1,0,0], [0,0,1,0,0,0,1,0], [0,0,0,1,0,0,0,1],
     [1,0,0,0,1,0,0,0], [0,1,0,0,0,1,0,0], [0,0,1,0,0,0,1,0], [0,0,0,1,0,0,0,1] ],
    [[1,0,1,0,1,0,1,0], [0,1,0,1,0,1,0,1], [1,0,1,0,1,0,1,0], [0,1,0,1,0,1,0,1],
     [1,0,1,0,1,0,1,0], [0,1,0,1,0,1,0,1], [1,0,1,0,1,0,1,0], [0,1,0,1,0,1,0,1] ],
    [[1,0,0,0,0,0,0,1], [0,1,0,0,0,0,1,0], [0,0,1,0,0,1,0,0], [0,0,0,1,1,0,0,0],
     [0,0,0,1,1,0,0,0], [0,0,1,0,0,1,0,0], [0,1,0,0,0,0,1,0], [1,0,0,0,0,0,0,1] ],
    [[1,0,0,1,0,0,0,0], [0,1,1,0,0,0,0,0], [0,1,1,0,0,0,0,0], [1,0,0,1,0,0,0,0],
     [0,0,0,0,1,0,0,1], [0,0,0,0,0,1,1,0], [0,0,0,0,0,1,1,0], [0,0,0,0,1,0,0,1] ],
    [[1,0,0,0,0,1,0,0], [0,1,0,0,1,0,0,0], [0,0,1,1,0,0,0,0], [0,0,1,1,0,0,0,0],
     [0,1,0,0,1,0,0,0], [1,0,0,0,0,1,0,0], [0,0,0,0,0,0,1,1], [0,0,0,0,0,0,1,1] ],
    [[1,1,0,0,0,0,0,0], [1,1,0,0,0,0,0,0], [0,0,1,0,0,0,0,1], [0,0,0,1,0,0,1,0],
     [0,0,0,0,1,1,0,0], [0,0,0,0,1,1,0,0], [0,0,0,1,0,0,1,0], [0,0,1,0,0,0,0,1] ],
    [[1,0,0,1,1,0,0,1], [0,1,1,0,0,1,1,0], [0,1,1,0,0,1,1,0], [1,0,0,1,1,0,0,1],
     [1,0,0,1,1,0,0,1], [0,1,1,0,0,1,1,0], [0,1,1,0,0,1,1,0], [1,0,0,1,1,0,0,1] ],
    
    [[1,1,0,0,1,1,0,0], [1,1,0,0,1,1,0,0], [0,0,1,1,0,0,1,1], [0,0,1,1,0,0,1,1],
     [1,1,0,0,1,1,0,0], [1,1,0,0,1,1,0,0], [0,0,1,1,0,0,1,1], [0,0,1,1,0,0,1,1] ],
    
    [[1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1], 
     [1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1] ],
  ]
  window.addEventListener('auxclick', () => {
    for(let i=0; i<8; i++){if(INTERSECTED == wedges[i]){
      for(let j=0; j<8; j++){subset[j] = leftClick[action][i][j]}
    }}
  })
  
  window.addEventListener('mouseout', () => {mouse.x=100; mouse.y=100})
  
  render();
}
```

```js
md` **Left click** to turn holons on and off.<br/>
**Right click** to generate a subset that matches the subgroup action.`
```

```js
md` This mandala shows the [symmetry of the square][1]. 

The eight districts with small red lights in the heart <sub>${Hermetica.society}</sub> are [holons][2]. Each [holon][2] <sub>${Hermetica.holon}</sub> reflects the overall order of the square, but in a asymmetric, individual way according the roads it borders. This is necessary for each to differentiate itself from the [pleroma][3], and to create the emptiness necessary for movement and life. When Jung originally imagined this mandala, he assumed he was the very center, but later recanted when he realized his conscious residence was just off the corner of one of the minor lights. Even though each individual holon is asymmetric, the whole society of eight holons completes itself in the greater rotundum. This relationship between the totality and its distributed manifestation is the meaning of the circle and dot <sub>${Hermetica.sun1}</sub> in the [sun][7] and the [monad][8] symbol. 

Eight directions emanate from the chaos at the center <sub>${Hermetica.chaos}</sub>. The longer length of the blue star's cardinal rays <sub>${Hermetica.cardinal}</sub> indicates up, down, left, right are the primary directions. The [four part sun cross][10] <sub>${Hermetica.sun4}</sub> and the [eight part sun cross][14] <sub>${Hermetica.sun8}</sub> incorporates this with the solar symbol. Each reflection fixes a major road radiating out from the center park which contain an opposing pair<sub>${Hermetica.opposition}</sub>of two rubies, which have [differentiated][11] from the masse confusion in the center. The circular wall with eight gates, the outer <sub>${Hermetica.boundary}</sub> part of <sub>${Hermetica.sun8}</sub>, is [Horos][12], which prevents the polarities from being reabsorbed by maintaining the seperation of the inner totality from the outer polarity <sub>${Hermetica.being}</sub>. Even though being implies a loss of wholeness, it also implies an equal and opposite way of being, which may ultimately be reconsiled in the [hieros gamos][15] <sub>${Hermetica.hierosGamos}</sub> to reobtain a semblance of the whole.

Each side in the square road <sub>${Hermetica.road}</sub> connects two round rubies through a rectangular ruby <sub>${Hermetica.side}</sub>. The rotation is in 90 degree increments <sub>${Hermetica.lauburu}</sub> due to the dissimilarity between the cardinal and ordinal points, embodied in the shape of the square. Each of the eight holons is the expression of an eigth of the square road connecting a round ruby to a rectangular ruby <sub>${Hermetica.rubies}</sub>. The radial roads dead end at the park, but the rotations around the square road allows [circumambulation][13] to the other side, connecting all districts into a dialectic whole.

[Reflexivity][4] <sub>${Hermetica.ouroboros}</sub> is necessary for consciousness to [self actualize][5] in a [cybernetic][6] feedback loop. A group can act on a set of objects and on itself, making it a reflexive [second-order cybernetic][9] schema. In addition to giving Jung peace about the problem of good and evil, the mandala also foretells the transformation of the world.

[1]:https://en.wikipedia.org/wiki/Examples_of_groups#dihedral_group_of_order_8
[2]:https://en.wikipedia.org/wiki/Holon_(philosophy)
[3]:https://en.wikipedia.org/wiki/Pleroma#Gnosticism
[4]:https://en.wikipedia.org/wiki/Reflexive_relation
[5]:http://ctmucommunity.org/wiki/Telic_Principle
[6]:https://en.wikipedia.org/wiki/Cybernetics
[7]:https://en.wikipedia.org/wiki/Solar_symbol
[8]:https://en.wikipedia.org/wiki/Monad_(philosophy)
[9]:https://en.wikipedia.org/wiki/Second-order_cybernetics
[10]:https://en.wikipedia.org/wiki/Sun_cross
[11]:https://en.wikipedia.org/wiki/Albedo_(alchemy)
[12]:https://en.wikipedia.org/wiki/Aeon_(Gnosticism)#Horos
[13]:https://en.wikipedia.org/wiki/Circumambulation
[14]:https://en.wikipedia.org/wiki/Dharmachakra
[15]:https://en.wikipedia.org/wiki/Hieros_gamos
`
```

```js
md`### <br/> Mutable Variables`
```

```js
mutable speed = .4
```

```js
mutable sym = 8
```

```js
{
  // animation speed slider
  mutable speed = inputVariables[0][0]
  
  // dropdown action list
  const actionList = [
    "C1 ⟳ Do Nothing", 
    "C2 🗘 Rotate 180°", 
    "C4 ↷ Rotate Right 90°", 
    "D2 ↔ Horizontal Reflection", 
    "D2 ↕ Vertical Reflection", 
    "D2 ⤢ Diagonal Reflection", 
    "D2 ⤡ Diagonal Reflection",
    "D4 🟄 Cardinal Reflections", 
    "D4 🞩 Ordinal Reflections",
    "D8 🞼 All Reflections" 
  ]
  for(let i=0; i<actionList.length; i++){ if(inputVariables[0][1] == actionList[i]){mutable sym = i; } }
  
  
  return "update mutable variables"
}
```

```js
md`### <br/> Libraries`
```

```js
THREE = {
  const THREE = window.THREE = await require("three@0.96/build/three.min.js");
  await require("three@0.96/examples/js/controls/OrbitControls.js").catch(() => {});
  return THREE;
}
```

```js
import { inputsGroup } from '@bumbeishvili/input-groups'
```

```js
import {select} from "@jashkenas/inputs"
```

```js
import {slider} from '@bartok32/diy-inputs'
```

```js
md`### <br/> Images`
```

```js
back = FileAttachment("Background_Texture.jpg").url()
```

```js
pleroma = FileAttachment("Center_Texture@3.jpg").url()
```

```js
hysterema = FileAttachment("Walls_Texture@4.jpg").url()
```

```js
flare = FileAttachment("Light_Red@1.jpg").url()
```

```js
rays = FileAttachment("Light_Blue_Rays.jpg").url()
```

```js
Hermetica = {
  let size = 19
  
  let society = `<svg height=${size} viewBox="0 0 100 100"><g id="Layer_2" data-name="Layer 2"><circle cx="34.85" cy="13.43" r="10.41"/><circle cx="65.15" cy="86.57" r="10.41"/><circle cx="13.43" cy="65.15" r="10.41"/><circle cx="86.57" cy="34.85" r="10.41"/><circle cx="13.43" cy="34.85" r="10.41"/><circle cx="86.57" cy="65.15" r="10.41"/><circle cx="34.85" cy="86.57" r="10.41"/><circle cx="65.15" cy="13.43" r="10.41"/></g></svg>`
  
  let holon = `<svg height=${size} viewBox="0 0 100 100"><g id="Layer_2" data-name="Layer 2"><path d="M35.43,90.06,0,54.63V25.5H100Zm-26-39.33,26,26L77.24,34.92H9.43Z"/><circle cx="35.3" cy="52.13" r="8.03"/></g></svg>`
  
  let sun1 = `<svg height=${size} viewBox="0 0 360 360">
  <g>
    <circle cx="178.89" cy="179.13" r="36"/>
    <path d="M180,22 C92.86,22 22,92.86 22,180 C22,267.14 92.9,338 180,338 C267.1,338 338,267.1 338,180 C338,92.9 267.14,22 180,22 Z M180,302 C112.621261,302 58,247.378739 58,180 C58,112.621261 112.621261,58 180,58 C247.378739,58 302,112.621261 302,180 C301.900869,247.337635 247.337635,301.900869 180,302 Z"/>
  </g>
</svg>`
  
  let chaos = `<svg height=${size} viewBox="0 0 360 360">
    <polygon points="338.04 162 223.46 162 304.48 80.98 279.02 55.52 198 136.54 198 21.96 162 21.96 162 136.54 80.98 55.52 55.52 80.98 136.54 162 21.96 162 21.96 198 136.54 198 55.52 279.02 80.98 304.48 162 223.46 162 338.04 198 338.04 198 223.46 279.02 304.48 304.48 279.02 223.46 198 338.04 198"/>
  </svg>`
  
  let cardinal = `<svg height=${size} viewBox="0 0 360 360"><path d="M180.08,367.21,125.26,234.89-7.06,180.08l132.32-54.82L180.08-7.06l54.8,132.32,132.33,54.82L234.88,234.89ZM89.62,180.08l64,26.49,26.5,64,26.49-64,64-26.49-64-26.5-26.49-64-26.5,64Z"/></svg>`
  
  let sun4 = `<svg height=${size} viewBox="0 0 360 360">
  <path d="M180.71,22 C93.57,22 22.71,92.9 22.71,180 C22.71,267.1 93.61,338 180.71,338 C267.81,338 338.71,267.1 338.71,180 C338.71,92.9 267.86,22 180.71,22 Z M301.42,162 L198.72,162 L198.72,59.29 C251.775066,67.2963985 293.418767,108.944154 301.42,162 Z M162.72,59.29 L162.72,162 L60,162 C68.003555,108.937939 109.65716,67.288389 162.72,59.29 L162.72,59.29 Z M60,198 L162.72,198 L162.72,300.71 C109.65716,292.711611 68.003555,251.062061 60,198 L60,198 Z M198.72,300.71 L198.72,198 L301.42,198 C293.418767,251.055846 251.775066,292.703601 198.72,300.71 L198.72,300.71 Z"/>
</svg>`
  
  let sun8 = `<svg height=${size} viewBox="0 0 360 360">
  <path d="M223.4946,161.0389 L278.0826,106.4519 C289.7606,122.1829 297.7446,140.8089 300.7486,161.0389 L223.4946,161.0389 Z M223.4946,197.0389 L300.7486,197.0389 C297.7446,217.2689 289.7606,235.8949 278.0826,251.6269 L223.4946,197.0389 Z M198.0396,222.4949 L252.6276,277.0819 C236.8956,288.7599 218.2696,296.7439 198.0396,299.7479 L198.0396,222.4949 Z M162.0396,222.4939 L162.0396,299.7479 C141.8086,296.7439 123.1826,288.7599 107.4506,277.0819 L162.0396,222.4939 Z M136.5836,197.0389 L81.9956,251.6259 C70.3186,235.8939 62.3336,217.2689 59.3296,197.0389 L136.5836,197.0389 Z M136.5836,161.0389 L59.3296,161.0389 C62.3336,140.8089 70.3186,122.1839 81.9956,106.4519 L136.5836,161.0389 Z M162.0396,135.5839 L107.4516,80.9959 C123.1826,69.3189 141.8086,61.3339 162.0396,58.3299 L162.0396,135.5839 Z M198.0396,58.3299 C218.2696,61.3339 236.8956,69.3179 252.6266,80.9959 L198.0396,135.5829 L198.0396,58.3299 Z M180.0396,20.9999 C92.8956,20.9999 21.9996,91.8959 21.9996,179.0389 C21.9996,266.1819 92.8956,337.0779 180.0396,337.0779 C267.1826,337.0779 338.0786,266.1819 338.0786,179.0389 C338.0786,91.8959 267.1826,20.9999 180.0396,20.9999 L180.0396,20.9999 Z"/>
</svg>`
  
  let being = `<svg height=${size} viewBox="0 0 360 360">
  <path d="M180,304.639 C150.225,304.639 126,280.414 126,250.639 C126,220.864 150.225,196.639 180,196.639 C209.775,196.639 234,220.864 234,250.639 C234,280.414 209.775,304.639 180,304.639 M180,55 C189.925,55 198,63.075 198,73 C198,82.926 189.925,91 180,91 C170.075,91 162,82.926 162,73 C162,63.075 170.075,55 180,55 M198,162.449 L198,123.904 C218.95,116.473 234,96.466 234,73 C234,43.224 209.775,19 180,19 C150.225,19 126,43.224 126,73 C126,96.466 141.05,116.473 162,123.904 L162,162.449 C120.97,170.811 90,207.176 90,250.639 C90,300.265 130.374,340.639 180,340.639 C229.626,340.639 270,300.265 270,250.639 C270,207.176 239.03,170.811 198,162.449"/>
</svg>`
  
  let opposition = `<svg height=${size} viewBox="0 0 360 360">
  <path d="M207.3594,273.3983 C207.3594,289.2123 194.4944,302.0783 178.6794,302.0783 C162.8654,302.0783 150.0004,289.2123 150.0004,273.3983 C150.0004,257.5843 162.8654,244.7183 178.6794,244.7183 C194.4944,244.7183 207.3594,257.5843 207.3594,273.3983 L207.3594,273.3983 Z M150.0004,86.6793 C150.0004,70.8653 162.8654,58.0003 178.6794,58.0003 C194.4944,58.0003 207.3594,70.8653 207.3594,86.6793 C207.3594,102.4933 194.4944,115.3593 178.6794,115.3593 C162.8654,115.3593 150.0004,102.4933 150.0004,86.6793 L150.0004,86.6793 Z M245.0154,198.0393 L245.0154,162.0393 L196.6794,162.0393 L196.6794,148.7913 C223.6104,140.9743 243.3594,116.0973 243.3594,86.6793 C243.3594,51.0153 214.3434,22.0003 178.6794,22.0003 C143.0154,22.0003 114.0004,51.0153 114.0004,86.6793 C114.0004,116.0973 133.7494,140.9743 160.6794,148.7913 L160.6794,162.0393 L114.0004,162.0393 L114.0004,198.0393 L160.6794,198.0393 L160.6794,211.2863 C133.7494,219.1043 114.0004,243.9803 114.0004,273.3983 C114.0004,309.0623 143.0154,338.0783 178.6794,338.0783 C214.3434,338.0783 243.3594,309.0623 243.3594,273.3983 C243.3594,243.9803 223.6104,219.1043 196.6794,211.2863 L196.6794,198.0393 L245.0154,198.0393 Z"/>
</svg>`
  
  let boundary = `<svg height=${size} viewBox="0 0 360 360">
  <path d="M180,338 C92.86,338 22,267.1 22,180 C22,92.9 92.86,22 180,22 C267.14,22 338,92.9 338,180 C338,267.1 267.14,338 180,338 Z M180,58 C112.621261,58 58,112.621261 58,180 C58,247.378739 112.621261,302 180,302 C247.378739,302 302,247.378739 302,180 C301.900869,112.662365 247.337635,58.0991314 180,58 Z"/>
</svg>`
  
  let hierosGamos = `<svg height=${size} viewBox="0 0 360 360">
  <path d="M266.6147,265.9647 C267.5597,260.8047 268.0577,255.4877 268.0577,250.0587 C268.0577,201.5247 228.5727,162.0387 180.0387,162.0387 C151.3547,162.0387 128.0187,138.7027 128.0187,110.0197 C128.0187,81.3367 151.3537,58.0007 180.0377,57.9997 L180.0397,57.9997 C247.3327,57.9997 302.0787,112.7467 302.0787,180.0387 C302.0787,213.5207 288.5217,243.8937 266.6147,265.9647 M57.9997,180.0387 C57.9997,146.5577 71.5557,116.1867 93.4627,94.1147 C92.5167,99.2747 92.0197,104.5897 92.0197,110.0197 C92.0197,158.5537 131.5047,198.0387 180.0387,198.0387 C208.7217,198.0387 232.0577,221.3747 232.0577,250.0587 C232.0577,278.7417 208.7217,302.0777 180.0387,302.0777 C112.7457,302.0777 57.9997,247.3317 57.9997,180.0387 M180.0397,21.9997 L180.0387,21.9997 C179.4587,21.9997 178.8807,22.0107 178.3017,22.0217 C91.9567,22.9577 21.9997,93.4767 21.9997,180.0387 C21.9997,267.1817 92.8957,338.0767 180.0387,338.0777 L180.0397,338.0777 C267.1817,338.0777 338.0787,267.1817 338.0787,180.0387 C338.0787,92.8957 267.1817,21.9997 180.0397,21.9997"/>
</svg>
`
  let road = `<svg height=${size} viewBox="0 0 100 100"><g id="Layer_2" data-name="Layer 2"><path d="M90.62,45.08v.14L76.27,30.88l6.12-6.12-6.64-6.63-6.11,6.11L54.69,9.3V.22H45.31V9.61h.14L31.1,24,25,17.84l-6.64,6.63,6.12,6.12L9.83,45.22v-.14H.45v9.39H9.83v-.2L24.72,69.16l-6.29,6.29,6.64,6.63,6.28-6.28L46,90.39h-.64v9.39h9.38V90.39H54.5L69.39,75.51l6.28,6.28,6.64-6.64L76,68.87l14.6-14.6v.2H100V45.08Zm-8.75,4.67L50.22,81.4,18.58,49.75,50.22,18.1Z"/></g></svg>`
      
  let side = `<svg height=${size} viewBox="0 0 360 360"><path d="M341.81,254a62.11,62.11,0,0,0-75.47-9.58l-38.06-38.07,32.12-32.12a20.12,20.12,0,0,0,0-28.46L214.23,99.6a20.12,20.12,0,0,0-28.46,0l-32.12,32.12L115.58,93.66a62.1,62.1,0,1,0-21.81,21.85l38,38.05L99.69,185.68a20.12,20.12,0,0,0,0,28.46l46.17,46.17a20.12,20.12,0,0,0,28.46,0l32.12-32.12,38.05,38A62.1,62.1,0,1,0,341.81,254Z"/></svg>`
      
  let lauburu = `<svg height=${size} viewBox="0 0 360 360">
  <path d="M250.4893,105.9957 C211.0293,105.9957 178.6553,136.8387 176.1653,175.6797 C161.3913,173.5707 149.9943,160.8407 149.9943,145.4937 C149.9943,128.6777 163.6763,114.9957 180.4923,114.9957 C202.2723,114.9957 219.9913,97.2767 219.9913,75.4977 C219.9913,53.7187 202.2723,35.9997 180.4923,35.9997 C139.4153,35.9997 105.9963,69.4187 105.9963,110.4957 C105.9963,149.9547 136.8393,182.3287 175.6793,184.8197 C173.5713,199.5937 160.8413,210.9897 145.4943,210.9897 C128.6773,210.9897 114.9963,197.3087 114.9963,180.4917 C114.9963,158.7127 97.2773,140.9937 75.4983,140.9937 C53.7183,140.9937 36.0003,158.7127 36.0003,180.4917 C36.0003,221.5687 69.4193,254.9877 110.4963,254.9877 C149.9553,254.9877 182.3293,224.1447 184.8193,185.3047 C199.5943,187.4127 210.9913,200.1427 210.9913,215.4897 C210.9913,232.3067 197.3093,245.9877 180.4923,245.9877 C158.7133,245.9877 140.9943,263.7067 140.9943,285.4857 C140.9943,307.2657 158.7133,324.9837 180.4923,324.9837 C221.5703,324.9837 254.9893,291.5647 254.9893,250.4877 C254.9893,211.0287 224.1463,178.6547 185.3043,176.1637 C187.4133,161.3907 200.1433,149.9937 215.4913,149.9937 C232.3073,149.9937 245.9893,163.6757 245.9893,180.4917 C245.9893,202.2707 263.7083,219.9897 285.4873,219.9897 C307.2663,219.9897 324.9853,202.2707 324.9853,180.4917 C324.9853,139.4147 291.5663,105.9957 250.4893,105.9957"/>
</svg>`
  
  let rubies = `<svg height=${size} viewBox="0 0 360 360"><circle cx="74.13" cy="74.13" r="74.13"/><rect x="195.37" y="161.57" width="126" height="193.39" rx="27" transform="translate(258.29 -107.05) rotate(45)"/><rect x="9.88" y="123.32" width="263.97" height="36.87" transform="translate(141.78 -58.79) rotate(45)"/></svg>`
  
  let ouroboros = `<svg height=${size} viewBox="0 0 100 100"><path d="M94.44,6c-3.86-3.86-11.63-7-26.77.11-10,4.66-21.09,12.83-31.28,23L33.8,31.7,21.44,24.56V66.43L57.7,45.49,44.56,37.91l.32-.32C54.1,28.36,64,21,72.74,17S85.3,13.8,86,14.45c2.6,2.6-2.28,20.22-23.14,41.08C51.23,67.11,40.65,73.76,33.08,76.94a16.88,16.88,0,1,0-.18,12.79C44.9,86.1,59.22,76.09,71.3,64,91.47,43.84,105.89,17.42,94.44,6Z"/></svg>`
  
  return ({
    society: society,
    holon: holon,
    sun1: sun1,
    chaos: chaos,
    cardinal: cardinal,
    sun4: sun4,
    sun8: sun8,
    being: being,
    opposition: opposition,
    boundary: boundary,
    hierosGamos: hierosGamos,
    road: road,
    side: side,
    lauburu: lauburu,
    rubies: rubies,
    ouroboros: ouroboros
  })
}
```
