import { createScene } from "./scene.js";
import { createCamera } from "./camera.js";
import { createCity } from "./city.js";
import { createLights } from "./lights.js";


export const createGame = async (worldSize) => {
  const gameWindow = document.getElementById("render-target");
  let activeToolId = undefined;

  const camera = createCamera(gameWindow);
  const scene = createScene(gameWindow, camera);
  const lights = createLights((worldSize / 2) - 0.5);
  const city = createCity(worldSize);


  scene.onObjectSelected = (targetObject) => {
    if (!targetObject.userData.id) return;
    let { x, y } = targetObject.userData;
    const tile = city.data[x][y];

    switch (activeToolId) {
      case "bulldoze": {
        if (tile.building) {
          tile.remove(tile);
          scene.update(city);
        }
        return;
      }
      case "residential": {
        if (!tile.building) {
          tile.place(tile, 'residential');
          scene.update(city);
        }
        return;
      }
      case "commercial": {
        if (!tile.building) {
          tile.place(tile, 'commercial');
          scene.update(city);
        }
        return;
      }
      case "industrial": {
        if (!tile.building) {
          tile.place(tile, 'industrial');
          scene.update(city);
        }
        return;
      }
      case "road": {
        if (!tile.building) {
          tile.place(tile, 'road');
          scene.update(city);
        }
        return;
      }
      default: {
        return;
      };
    }
  };

  const setupListeners = () => {
    document.addEventListener("contextmenu", (event) =>
      event.preventDefault()
    );
    document.addEventListener("mousedown", scene.onMouseDown);
    document.addEventListener("mouseup", scene.onMouseUp);
    document.addEventListener("mousemove", scene.onMouseMove);
    document.addEventListener("wheel", (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
      scene.onMouseScroll(e);
    }, { passive: false });
  };

  const game = {
    initGame: async () => {
      setupListeners();
    },
    initWorld: async () => {
      camera.updateCameraPos({
        cameraPos: [(worldSize / 2) - 1, (worldSize / 2) - 1]
      });
      city.data = scene.initCity(city);
      return scene.start();
    },
    update: async () => {
      city.data = city.update(city);
      city.data = scene.update(city);
    },
    setActiveTool: (toolId) => {
      activeToolId = toolId;
    }
  };


  await game.initGame();


  return {
    ...game,
    updateInterval: undefined,
    scene,
    city,
    lights,
    camera
  };
};