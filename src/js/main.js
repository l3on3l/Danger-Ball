import renderer from "./core/renderer";
import camera from "./core/camera";
import scene from "./core/scene";
import cube from "./shapes/cube";

function animation(time, shape) {
  shape.rotation.x = time / 2000;
  shape.rotation.y = time / 1000;

  renderer.render(scene, camera);
}

scene.add(cube);

renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
renderer.setAnimationLoop((t) => animation(t, cube));
