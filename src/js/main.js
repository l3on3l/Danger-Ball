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

const controls = new OrbitControls(camera, renderer.domElement);

// add wrap the the scene
const wrap = createWrap(sphere);
scene.add(wrap);

// dist and lat log values
let dist = 1.5; // radius + half of mesh height
let latPer = 1; // 0 - 1
let longPer = 1; // 0 - 1

// add cone objects (spikes)
let aux = 0.0;
let cones = [];
for (let i = 0; i < 6; i++) {
  cones.push(createCone());
  cones[i].geometry.rotateX(Math.PI * 1.5);
  addObjectToWrap(wrap, "cone" + String(i), cones[i]);
  setObjToLatLong(wrap, "cone" + String(i), latPer - aux, longPer - aux, dist);
  aux += 0.2;
}
console.log(wrap);

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
