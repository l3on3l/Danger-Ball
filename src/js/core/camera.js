import { PerspectiveCamera } from "three";

const fov = 45; // vertical field fo view
const abstract = window.innerWidth / window.innerHeight; //the display aspect of the canvas
const near = 0.1;
const far = 1000;

const camera = new PerspectiveCamera(fov, abstract, near, far);
camera.position.z = 3;
camera.position.set(3.0, 3.0, 3.0);
camera.lookAt(0, 0, 0);

export default camera;
