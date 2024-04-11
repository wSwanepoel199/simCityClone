import * as THREE from 'three';

export const createLights = (midpoint) => {

  const lights = {
    ambient: new THREE.AmbientLight(0xffffff, 0.2),
    directional: new THREE.DirectionalLight(0xffffff, 1),
  };

  lights.directional.position.set(midpoint - 10, 20, midpoint + 10);
  lights.directional.castShadow = true;

  lights.directional.shadow.camera.left = -midpoint * 2;
  lights.directional.shadow.camera.right = midpoint * 2;
  lights.directional.shadow.camera.top = midpoint * 2;
  lights.directional.shadow.camera.bottom = -midpoint * 2;

  lights.directional.shadow.mapSize.width = 1024;
  lights.directional.shadow.mapSize.height = 1024;

  lights.directional.shadow.camera.near = 0.5;
  lights.directional.shadow.camera.far = 50;
  const targetObject = new THREE.Object3D();
  targetObject.position.set(midpoint, 0, midpoint);
  lights.directional.target = targetObject;


  return {
    lights,
    lightsTarget: targetObject
  };
};