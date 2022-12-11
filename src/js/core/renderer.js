import { WebGLRenderer } from "three";

const canvas = document.getElementById("c");
const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);

export default renderer;
