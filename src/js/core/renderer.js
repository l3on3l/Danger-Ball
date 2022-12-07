import { WebGLRenderer } from "three";

const canvas = document.getElementById("c");
const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
});

export default renderer;
