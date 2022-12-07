import { BoxGeometry, Mesh, MeshNormalMaterial } from "three";

const geometry = new BoxGeometry(0.2, 0.2, 0.2);
const material = new MeshNormalMaterial();
const cube = new Mesh(geometry, material);

export default cube;
