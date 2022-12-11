/* 
  Url: https://github.com/dustinpfister/test_threejs/blob/master/views/forpost/threejs-examples-position-things-to-sphere-surface/r0/js/sphere_wrap.js
  author: dustinpfister
  This code used as a guide to create a module that helps with the process of positioning an object to the surface of a sphere.
  There was little modification in the code for its use
*/

import { Vector3, Group } from "three";

// create wrap method
export function createWrap(objSphere) {
  // create a wrap group
  const wrap = new Group();
  // add a sphere to the wrap
  wrap.userData.sphere = objSphere;
  wrap.add(objSphere);
  // create a surface group and add to wrap
  const surface = new Group();
  wrap.userData.surface = surface;
  wrap.add(surface);
  return wrap;
}
// set to lat and long helper
export function setObjToLatLong(wrap, childName, latPer, longPer, dist) {
  // get child
  const childWrap = wrap.getObjectByName("objwrap_" + childName);
  const child = childWrap.children[0];
  childWrap.userData.latPer = latPer;
  childWrap.userData.longPer = longPer;
  // set lat
  const radian = Math.PI * -0.5 + Math.PI * latPer,
    x = Math.cos(radian) * dist,
    y = Math.sin(radian) * dist;
  child.position.set(x, y, 0);
  // set long
  childWrap.rotation.y = Math.PI * 2 * longPer;
  // look at origin of wrap
  const v = new Vector3();
  wrap.getWorldPosition(v);
  child.lookAt(v);
}
// Add an Object to a Sphere Wrap Group
export function addObjectToWrap(wrap, objectName, obj) {
  // create an obj
  obj.name = objectName;
  const objWrap = new Group();
  objWrap.name = "objwrap_" + objectName;
  objWrap.add(obj);
  // obj wrap user data object
  const ud = objWrap.userData;
  ud.latPer = 0;
  ud.longPer = 0;
  const radius = wrap.userData.sphere.geometry.parameters.radius;
  ud.dist = radius;
  // add the objWrap group to the surface group
  wrap.userData.surface.add(objWrap);
  //set position for the first time
  setObjToLatLong(wrap, objectName, ud.latPer, ud.longPer, ud.dist);
}
