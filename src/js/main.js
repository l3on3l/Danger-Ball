// core
import renderer from "./core/renderer";
import camera from "./core/camera";
import scene from "./core/scene";
import directionalLight from "./core/light";
//shapes
import sphere from "./shapes/sphere";
import createCone from "./shapes/cone";
// others
import { addObjectToWrap, createWrap, setObjToLatLong } from "./vendor/wrap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const controls = new OrbitControls(camera, renderer.domElement);

// Global values
const dist = 1.4; // radius + half of mesh height - 0.1
let cones = []; // to save the spikes
let isIncrement = true; // when to incement the size of spikes for animation

// add spike (helper)
function addSpike(index, lat, long) {
  cones.push(createCone());
  cones[index].geometry.rotateX(Math.PI * 1.5);
  addObjectToWrap(wrap, "cone" + String(index), cones[index]);
  setObjToLatLong(wrap, "cone" + String(index), lat, long, dist);
}

// initialize the cone objects(spikes)
function initSpikeBall() {
  let aux = 0.0;
  for (let i = 0; i < params.total; i++) {
    addSpike(i, params.size + aux, params.size + aux);
    aux += 0.2;
  }
}

// handle spike hight
function handleSpikeScale(index, childName) {
  const newDist =
    sphere.geometry.parameters.radius + cones[index].scale.z / 2 - 0.1;
  const childWrap = wrap.getObjectByName("objwrap_" + childName);
  setObjToLatLong(
    wrap,
    childName,
    childWrap.userData.latPer,
    childWrap.userData.longPer,
    newDist
  );
}

//increment the size of the spikes (for animation)
function spikeIncrement() {
  if (cones.length == 0) {
    return;
  }

  for (let i = 0; i < cones.length; i++) {
    if (cones[i].scale.z > params.size) {
      isIncrement = !isIncrement;
      break;
    }
    cones[i].scale.z += 0.1;
    handleSpikeScale(i, "cone" + String(i));
  }
}

//decrement the size of the spikes (for animation)
function spikeDecrement() {
  if (cones.length == 0) {
    return;
  }

  for (let i = 0; i < cones.length; i++) {
    if (parseFloat(cones[i].scale.z.toFixed(2)) >= 0.1) {
      cones[i].scale.z -= 0.1;
      handleSpikeScale(i, "cone" + String(i));
    } else {
      isIncrement = !isIncrement;
      break;
    }
  }
}

// keyframe animation for spikes
function animateSpike() {
  if (isIncrement) {
    spikeIncrement();
  } else {
    spikeDecrement();
  }
}

// returns a random float in a range
function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

// push/pop 'n' spikes
function handlePushPopSpike(n) {
  if (n > cones.length) {
    // push spikes
    const total = n - cones.length;
    for (let i = 0; i < total; i++) {
      const latRand = getRandomFloat(0.1, 1, 4);
      const longRand = getRandomFloat(0.1, 1, 4);
      addSpike(cones.length, latRand, longRand);
      cones[cones.length - 1].scale.z = cones[0].scale.z;
      handleSpikeScale(cones.length - 1, "cone" + String(cones.length - 1));
    }
  } else if (n < cones.length) {
    // remove spikes
    const total = cones.length - n;
    for (let i = 0; i < total; i++) {
      if (cones.length > 0) {
        wrap.userData.surface.children.pop();
        cones.pop();
      }
    }
  }
}

// add GUI & options
let gui = new GUI();
class Params {
  constructor() {
    // spike
    this.animate = true;
    this.total = 6;
    this.size = 1;
    // render
    this.fps = 40;
  }
}
// add GUI folder
const params = new Params();
const spikeFolder = gui.addFolder("Spikes");
spikeFolder.add(params, "animate").listen();
spikeFolder
  .add(params, "total", 0, 20, 1)
  .listen()
  .onChange(function () {
    handlePushPopSpike(params.total);
  });
spikeFolder
  .add(params, "size", 0, 2, 0.1)
  .listen()
  .onChange(function () {
    if (cones.length == 0) {
      return;
    }
    // add new size for the spikes
    for (let i = 0; i < cones.length; i++) {
      cones[i].scale.z = params.size;
      handleSpikeScale(i, "cone" + String(i));
    }
  });

const renderFolder = gui.addFolder("Render");
renderFolder.add(params, "fps", 10, 60, 10).listen();

// add wrap the the scene and light directional
const wrap = createWrap(sphere);
scene.add(wrap);
scene.add(directionalLight);
//init spikes
initSpikeBall();

// render
let frame = 0;
const maxFrame = 600;
let fpsClock = new Date();

function render(time) {
  const now = new Date();
  const per = frame / maxFrame;
  const bias = 1 - Math.abs(per - 0.5) / 0.5;
  const secs = (now - fpsClock) / 1000;
  requestAnimationFrame(render);
  if (secs > 1 / params.fps) {
    // render whole group
    wrap.position.x = 1 - 2 * bias;
    wrap.position.z = Math.sin(Math.PI * 2 * bias) * 2;
    wrap.rotation.x = time / 1000;
    wrap.rotation.y = time / 1000;
    if (params.animate) {
      animateSpike();
    }
    controls.update();
    renderer.render(scene, camera);
    // update
    frame += params.fps * secs;
    frame %= maxFrame;
    fpsClock = now;
  }
}
renderer.setAnimationLoop((t) => render(t));
// render();
