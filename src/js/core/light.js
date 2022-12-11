import { DirectionalLight } from "three";

const directionalLight = new DirectionalLight(0xffffff);
directionalLight.position.y = 0;
directionalLight.position.z = 1;

export default directionalLight;
