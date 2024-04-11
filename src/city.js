import createBuilding from "./buildings.js";
export const createCity = (size) => {
  const data = [];
  // auto init function
  (() => {
    for (let x = 0; x < size; x++) {
      data[x] = [];
      for (let y = 0; y < size; y++) {
        const tile = createTile(x, y);

        data[x][y] = tile;
      }
    }
  })();

  const update = (cityData) => {
    for (let x = 0; x < cityData.size; x++) {
      for (let y = 0; y < cityData.size; y++) {
        cityData.data[x][y].update(cityData.data[x][y]);
      }
    }
    return cityData.data;
  };

  return {
    size,
    data,
    update
  };
};

const createTile = (x, y) => {
  return {
    x,
    y,
    // buildId: undefined,
    building: undefined,
    buildTier: 0,
    foundationId: undefined,
    foundationTier: 0,
    remove: (tile) => {
      if (tile.building) {
        tile.building = undefined;
      }
    },
    place: (tile, type) => {
      if (!tile.building) {
        tile.building = createBuilding[type]();
        tile.building.tier = 1;
      }
    },
    update: (tile) => {
      if (tile.building) {
        tile.building?.update(tile);
      }
    }
  };
};