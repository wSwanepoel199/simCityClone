import * as THREE from 'three';
import { createInstanceOfAssets } from './assets';

export const createScene = (gameWindow, camera) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x777777);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.clientWidth, gameWindow.clientHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  gameWindow.appendChild(renderer.domElement);

  const interact = {
    raycaster: new THREE.Raycaster(),
    mousePos: new THREE.Vector2(),
    targetObject: undefined
  };
  let onObjectSelected = undefined;

  let tileMesh = [];

  // const boxMesh = new THREE.Mesh(
  //   new THREE.BoxGeometry(1, 1, 1),
  //   new THREE.MeshLambertMaterial({ color: 0x00ff00 })
  // );
  // boxMesh.position.set(8 - 0.5, 5, 8 - 0.5);

  const initCity = (cityData) => {
    scene.clear();

    addLights();
    if (tileMesh.length > 0) tileMesh = [];
    for (let x = 0; x < cityData.size; x++) {
      tileMesh[x] = [];
      for (let y = 0; y < cityData.size; y++) {
        const tile = {
          ...cityData.data[x][y],
        };
        if (!tile.foundationId) tile.foundationId = 'grass';
        tile.foundation = createInstanceOfAssets(tile.foundationId, x, y, tile.foundationTier);

        if (tile.foundation) scene.add(tile.foundation);
        tileMesh[x][y] = tile;
      }
    }

    return tileMesh;
  };

  const addLights = () => {
    const { lights } = window.game;
    scene.add(...Object.values(lights.lights), lights.lightsTarget);

    // const helper = new THREE.CameraHelper(lights.lights.directional.shadow.camera);
    // scene.add(helper);
  };



  const update = (cityData) => {
    console.log(window.performance.memory.usedJSHeapSize / 1024 / 1024, "MB used");
    for (let x = 0; x < cityData.size; x++) {
      for (let y = 0; y < cityData.size; y++) {
        const tile = cityData.data[x][y];
        if (!tile.build && !tile.building && !tile.building?.updated) continue;
        if (!tile.building && tile.build) {
          scene.remove(tile.build);
          delete tile.build;
          tile.building = undefined;
          tileMesh[x][y] = tile;
          continue;
        }

        if (!tile.build && tile.building) {
          tile.build = createInstanceOfAssets(tile.building.id, x, y, tile.building.tier);
        }

        if (tile.build && tile.building.updated) {
          scene.remove(tile.build);
          tile.build = createInstanceOfAssets(tile.building.id, x, y, tile.building.tier);
        }
        scene.add(tile.build);
        tile.building.updated = false;
        tileMesh[x][y] = tile;
        continue;
      }
    }
    return tileMesh;
  };
  let lastTime = 0;
  let cycle = 0;
  const draw = (time) => {
    time *= 0.001;
    const deltaTime = time - lastTime;
    lastTime = time;

    cycle += deltaTime * 1;
    if (cycle >= 1) {
      window.game.update();
      cycle = 0;
    }

    renderer.render(scene, camera.camera);
  };

  const start = () => {
    renderer.setAnimationLoop(draw);
  };

  const stop = () => {
    renderer.setAnimationLoop(null);
  };

  function onMouseDown(event) {
    if (event.target.tagName !== "CANVAS") return;
    camera.onMouseDown(event);

  };

  function onMouseUp(event) {
    if (event.target.tagName !== "CANVAS") return;
    camera.onMouseUp(event);
  };

  const onMouseMove = (event) => {
    if (event.target.tagName !== "CANVAS") return;
    camera.onMouseMove(event);
  };

  const onMouseScroll = (event) => {
    camera.onMouseScroll(event);
  };

  function castRay(event) {
    interact.mousePos.x = (event.clientX / gameWindow.clientWidth) * 2 - 1;
    interact.mousePos.y = -(event.clientY / gameWindow.clientHeight) * 2 + 1;
    interact.raycaster.setFromCamera(interact.mousePos, camera.camera);

    let objectIntersections = interact.raycaster.intersectObjects(scene.children, false);

    if (objectIntersections.length > 0) {
      // if (interact.targetObject) interact.targetObject.material.emissive.setHex(0);
      interact.targetObject = objectIntersections[0].object;
      // interact.targetObject.material.emissive.setHex(0x555555);
      if (this?.onObjectSelected) this.onObjectSelected(interact.targetObject);
    }
  }

  return {
    scene,
    start,
    stop,
    initCity,
    update,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseScroll,
    onObjectSelected,
    castRay
  };
};