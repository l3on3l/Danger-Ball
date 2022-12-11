import { Mesh, ConeGeometry, MeshStandardMaterial, Color } from "three";

const createCone = () => {
  return new Mesh(
    new ConeGeometry(0.25, 1, 30, 30),
    new MeshStandardMaterial({
      color: new Color(0xdddddd),
    })
  );
};

export default createCone;
