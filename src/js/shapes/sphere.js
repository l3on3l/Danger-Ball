import { Mesh, MeshStandardMaterial, SphereGeometry, Color } from "three";

const sphere = new Mesh(
  new SphereGeometry(1, 40, 40),
  new MeshStandardMaterial({
    color: new Color(0x00ff00),
  })
);

export default sphere;
