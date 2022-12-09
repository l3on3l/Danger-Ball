import { Mesh, ConeGeometry, MeshNormalMaterial } from "three";

const createCone = () => {
  return new Mesh(
    new ConeGeometry(0.25, 1, 30, 30),
    new MeshNormalMaterial({
      wireframe: true,
    })
  );
};

export default createCone;
