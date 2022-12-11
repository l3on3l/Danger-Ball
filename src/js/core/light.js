import { DirectionalLight } from "three";

const directionalLight = new DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(4, 2, 1);

export default directionalLight;
