import { Mesh, MeshNormalMaterial, SphereGeometry } from "three";

const sphere = new Mesh(
  new SphereGeometry(1, 40, 40),
  new MeshNormalMaterial({
    wireframe: true,
  })
);

export default sphere;
