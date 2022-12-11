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
  for (let i = 0; i < 6; i++) {
    addSpike(i, 1 + aux, 1 + aux);
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

//increment the size of the spikes
function spikeIncrement(animate = false) {
  if (cones.length == 0) {
    return;
  }

  for (let i = 0; i < cones.length; i++) {
    if (cones[i].scale.z >= 0 && cones[i].scale.z <= 2) {
      if (animate && cones[i].scale.z > currentSpikeSize) {
        isIncrement = !isIncrement;
        break;
      }
      cones[i].scale.z += 0.1;
      handleSpikeScale(i, "cone" + String(i));
    }
  }

  // update currentSpikeSize value by GUI
  if (!animate) {
    if (cones[0].scale.z >= 0 && cones[0].scale.z <= 2) {
      currentSpikeSize += 0.1;
    }
  }
}

//decrement the size of the spikes
function spikeDecrement(animate = false) {
  if (cones.length == 0) {
    return;
  }

  for (let i = 0; i < cones.length; i++) {
    if (parseFloat(cones[i].scale.z.toFixed(2)) >= 0.1) {
      cones[i].scale.z -= 0.1;
      handleSpikeScale(i, "cone" + String(i));
    } else {
      if (animate) {
        isIncrement = !isIncrement;
      }
      break;
    }
  }

  // update currentSpikeSize value by GUI
  if (!animate) {
    if (parseFloat(currentSpikeSize.toFixed(2)) >= 0.1) {
      currentSpikeSize -= 0.1;
    }
  }
}

// keyframe animation for spikes
function animateSpike() {
  if (isIncrement) {
    spikeIncrement(true);
  } else {
    spikeDecrement(true);
  }
}

// returns a random float in a range
function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

// GUI options
const options = {
  spikeLengthIncrement: function () {
    spikeIncrement();
  },
  spikeLengthDecrement: function () {
    spikeDecrement();
  },
  spikeNumberIncrement: function () {
    if (cones.length <= 25) {
      const latRand = getRandomFloat(0.1, 1, 4);
      const longRand = getRandomFloat(0.1, 1, 4);
      addSpike(cones.length, latRand, longRand);
      cones[cones.length - 1].scale.z = cones[0].scale.z;
      handleSpikeScale(cones.length - 1, "cone" + String(cones.length - 1));
    }
  },
  spikeNumberDecrement: function () {
    if (cones.length > 0) {
      wrap.userData.surface.children.pop();
      cones.pop();
    }
  },
};

// makeInstance GUI folder
const gui = new GUI();
const spikeLenghtFolder = gui.addFolder("Spike lengths");
spikeLenghtFolder.open();
spikeLenghtFolder.add(options, "spikeLengthIncrement").name("increment");
spikeLenghtFolder.add(options, "spikeLengthDecrement").name("decrement");
const spikeNumberFolder = gui.addFolder("Spike numbers");
spikeNumberFolder.open();
spikeNumberFolder.add(options, "spikeNumberIncrement").name("increment");
spikeNumberFolder.add(options, "spikeNumberDecrement").name("decrement");

// add wrap the the scene and light directional
const wrap = createWrap(sphere);
scene.add(wrap);
scene.add(directionalLight);
//init spikes
initSpikeBall();
let currentSpikeSize = cones[0].scale.z;

// render
let frame = 0;
const maxFrame = 400;
const fps = 30;
let fpsClock = new Date();

function render() {
  const now = new Date();
  const per = frame / maxFrame;
  const bias = 1 - Math.abs(per - 0.5) / 0.5;
  const secs = (now - fpsClock) / 1000;
  requestAnimationFrame(render);
  if (secs > 1 / fps) {
    // render whole group
    wrap.position.x = 1 - 2 * bias;
    wrap.position.z = Math.sin(Math.PI * 2 * bias) * 2;
    animateSpike();
    renderer.render(scene, camera);
    // update
    frame += fps * secs;
    frame %= maxFrame;
    fpsClock = now;
  }
}
render();
