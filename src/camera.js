import * as THREE from 'three';

export const createCamera = (gameWindow) => {
  const cameraSettings = {
    rotationSensitivity: 0.5,
    zoomSensitivity: 0.0025,
    panSenativity: 0.01,
    cameraOrigin: new THREE.Vector3(),
    cameraRadius: 10,
    cameraAzimuth: 0,
    cameraElevation: 10,
    minElevation: 10,
    maxElevation: 80,
    minZoom: 2,
    maxZoom: 20,
  };

  let mouseDown = [false, false, false];
  let mousePos = [0, 0];

  const Deg2Rad = (deg) => {
    return deg * Math.PI / 180;
  };

  const camera = new THREE.PerspectiveCamera(75, gameWindow.clientWidth / gameWindow.clientHeight, 0.1, 1000);

  const onMouseDown = (event) => {
    event.preventDefault();
    mouseDown[event.button] = true;
    if (!event.ctrlKey && mouseDown[0]) window.game.scene.castRay(event);
  };


  const onMouseUp = (event) => {
    event.preventDefault();
    mouseDown[event.button] = false;
  };

  const onMouseMove = (event) => {

    if (mouseDown[0] && !event.ctrlKey) {
      window.game.scene.castRay(event);
    }
    // rotates camera
    if (mouseDown[2]) {
      cameraSettings.cameraAzimuth += -((event.clientX - mousePos[0]) * cameraSettings.rotationSensitivity);
      cameraSettings.cameraElevation += ((event.clientY - mousePos[1]) * cameraSettings.rotationSensitivity);
      cameraSettings.cameraElevation = Math.min(Math.max(cameraSettings.cameraElevation, cameraSettings.minElevation), cameraSettings.maxElevation);
      updateCameraPos({ mouseClick: 2 });
    }

    // pans camera
    if (mouseDown[0] && event.ctrlKey) {
      const forwardVector = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), Deg2Rad(cameraSettings.cameraAzimuth));
      cameraSettings.cameraOrigin.add(forwardVector.multiplyScalar(-((event.clientY - mousePos[1]) * cameraSettings.panSenativity)));

      const leftVector = new THREE.Vector3(-1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), Deg2Rad(cameraSettings.cameraAzimuth));
      cameraSettings.cameraOrigin.add(leftVector.multiplyScalar((event.clientX - mousePos[0]) * cameraSettings.panSenativity));

      updateCameraPos({ mouseClick: 0 });
    }

    mousePos = [event.clientX, event.clientY];
  };

  const onMouseScroll = (event) => {
    event.preventDefault();

    // console.log(event, cameraRadius);
    cameraSettings.cameraRadius += event.deltaY * cameraSettings.zoomSensitivity;
    cameraSettings.cameraRadius = Math.min(Math.max(cameraSettings.cameraRadius, cameraSettings.minZoom), cameraSettings.maxZoom);

    updateCameraPos();
  };

  const updateCameraPos = ({ mouseClick = undefined, cameraPos = undefined } = {}) => {
    camera.position.set(
      cameraSettings.cameraRadius * Math.sin(Deg2Rad(cameraSettings.cameraAzimuth)) * Math.cos(Deg2Rad(cameraSettings.cameraElevation)),
      cameraSettings.cameraRadius * Math.sin(Deg2Rad(cameraSettings.cameraElevation)),
      cameraSettings.cameraRadius * Math.cos(Deg2Rad(cameraSettings.cameraAzimuth)) * Math.cos(Deg2Rad(cameraSettings.cameraElevation))
    );

    cameraSettings.cameraOrigin = cameraPos ? new THREE.Vector3(cameraPos[0], 0, cameraPos[1]) : cameraSettings.cameraOrigin;
    camera.position.add(cameraSettings.cameraOrigin);
    camera.lookAt(cameraSettings.cameraOrigin);
    camera.updateMatrix();


    if (mouseClick !== undefined) {
      mouseDown[mouseClick] = 'cameraMoved';
    }
  };

  return {
    camera,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseScroll,
    updateCameraPos,
  };
};