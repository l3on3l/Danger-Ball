import { PerspectiveCamera } from "three";

const fov = 45; // vertical field fo view
const abstract = window.innerWidth / window.innerHeight; //the display aspect of the canvas
const near = 0.1;
const far = 1000;

const camera = new PerspectiveCamera(fov, abstract, near, far);
camera.position.z = 1;

export default camera;
