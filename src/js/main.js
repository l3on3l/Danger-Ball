// core
import renderer from "./core/renderer";
import camera from "./core/camera";
import scene from "./core/scene";
//shapes
import sphere from "./shapes/sphere";
import createCone from "./shapes/cone";
// others
import { addObjectToWrap, createWrap, setObjToLatLong } from "./vendor/wrap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const controls = new OrbitControls(camera, renderer.domElement);

// Global values
const dist = 1.5; // radius + half of mesh height
let cones = []; // to save the spikes
let totalSpikes = 6; // total current spikes

// add wrap the the scene
const wrap = createWrap(sphere);
scene.add(wrap);

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
  for (let i = 0; i < totalSpikes; i++) {
    addSpike(i, 1 + aux, 1 + aux);
    aux += 0.2;
  }
}

// GUI options
const options = {
  spikeLengthIncrement: function () {
    // console.log(cones[0].geometry.parameters);
    for (let i = 0; i < totalSpikes; i++) {
      if (cones[i].scale.z >= 1 || cones[i].scale.z <= 2) {
        cones[i].scale.z += 0.1;
      } else {
        break;
      }
    }
  },
  spikeLengthDecrement: function () {
    for (let i = 0; i < totalSpikes; i++) {
      if (cones[i].scale.z == 1) {
        break;
      } else {
        cones[i].scale.z -= 0.1;
      }
    }
  },
  spikeNumberIncrement: function () {
    const latRand = (Math.floor(Math.random() * 10) + 1) / 10;
    const longRand = (Math.floor(Math.random() * 10) + 1) / 10;
    addSpike(totalSpikes, latRand, longRand);
    totalSpikes++;
  },
  spikeNumberDecrement: function () {
    if (totalSpikes > 0) {
      wrap.userData.surface.children.pop();
      totalSpikes--;
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

//init spikes
initSpikeBall();

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
    renderer.render(scene, camera);
    // update
    frame += fps * secs;
    frame %= maxFrame;
    fpsClock = now;
  }
}
render();
