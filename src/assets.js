import * as THREE from 'three';

const loader = new THREE.TextureLoader();

const loadTexture = (url) => {
  const texture = loader.load(url);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
};

const textures = {
  grass: loadTexture('/textures/grass.png'),
  residential1: loadTexture('/textures/apartments7.png'),
  residential2: loadTexture('/textures/apartment_block7.png'),
  residential3: loadTexture('/textures/apartments1.png'),
  commercial1: loadTexture('/textures/building_l2.png'),
  commercial2: loadTexture('/textures/building_office10.png'),
  commercial3: loadTexture('/textures/building_office7.png'),
  industrial1: loadTexture('/textures/building_dock2.png'),
  industrial2: loadTexture('/textures/building_side_long.png'),
  industrial3: loadTexture('/textures/building_derelict1.png'),
};

const getTopMaterial = () => {
  return new THREE.MeshLambertMaterial({ color: 0x555555 });
};

const getSideMaterial = (textureName) => {
  return new THREE.MeshLambertMaterial({ map: textures[textureName].clone() });
};

const geometry = new THREE.BoxGeometry(1, 1, 1);
const assets = {
  grass: (assetId, x, y) => {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ map: textures.grass })
    );
    mesh.userData = {
      id: assetId,
      x,
      y
    };
    mesh.receiveShadow = true;
    mesh.scale.set(1, 0.2, 1);
    mesh.position.set(x, -0.1, y);
    return mesh;
  },
  building: (assetId, x, y, tier) => {
    const buildingColor = {
      1: 0xbb5555,
      2: 0xbbbb55,
      3: 0x5555bb
    };
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color: buildingColor[tier] })
    );
    mesh.userData = {
      id: assetId,
      x,
      y,
      tier
    };
    mesh.scale.set(1, tier, 1);
    mesh.position.set(x, tier / 2, y);
    return mesh;
  },
  residential: (assetId, x, y, tier) => {
    const data = {
      id: assetId,
      tier,
      castShadow: true,
      receiveShadow: true
    };
    const mesh = genZoneMesh(x, y, data);
    return mesh;
  },
  commercial: (assetId, x, y, tier) => {
    const data = {
      id: assetId,
      tier,
      castShadow: true,
      receiveShadow: true
    };
    const mesh = genZoneMesh(x, y, data);
    return mesh;
  },
  industrial: (assetId, x, y, tier) => {
    const data = {
      id: assetId,
      tier,
      castShadow: true,
      receiveShadow: true
    };
    const mesh = genZoneMesh(x, y, data);
    return mesh;
  },
  road: (assetId, x, y, tier) => {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color: 0x444444 })
    );
    mesh.userData = {
      id: assetId,
      x,
      y,
      tier
    };
    mesh.scale.set(1, 0.1, 1);
    mesh.position.set(x, 0.05, y);
    return mesh;
  }
};

export const createInstanceOfAssets = (assetId, x, y, tier = 0) => {
  if (assetId in assets) {
    return assets[assetId](assetId, x, y, tier);
  } else {
    console.warn("Asset not found");
    return undefined;
  }
};


const genZoneMesh = (x, y, data) => {
  const textureName = data.id + Math.round(data.tier / 2);

  const topMat = getTopMaterial();
  const sideMat = getSideMaterial(textureName);
  let matArray = [
    sideMat,
    sideMat,
    topMat,
    topMat,
    sideMat,
    sideMat
  ];
  let mesh = new THREE.Mesh(
    geometry,
    matArray
  );
  mesh.userData = { x, y, ...data };
  mesh.scale.set(0.8, (data.tier - 0.95) / 2, 0.8);
  mesh.material.forEach(material => material.map?.repeat.set(1, data.tier - 1));
  mesh.position.set(x, (data.tier - 0.95) / 4, y);
  mesh.castShadow = data.castShadow;
  mesh.receiveShadow = data.receiveShadow;
  return mesh;
};