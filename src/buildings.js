export default {
  residential: () => {
    return {
      id: 'residential',
      tier: 0,
      updated: true,
      update: function () {
        if (Math.random() < 0.05) {
          if (this.tier < 5) {
            this.tier++;
            this.updated = true;
          }
        }
      }
    };
  },
  commercial: () => {
    return {
      id: 'commercial',
      tier: 0,
      updated: true,
      update: function () {
        if (Math.random() < 0.05) {
          if (this.tier < 5) {
            this.tier++;
            this.updated = true;
          }
        }
      }
    };
  },
  industrial: () => {
    return {
      id: 'industrial',
      tier: 0,
      updated: true,
      update: function () {
        if (Math.random() < 0.05) {
          if (this.tier < 5) {
            this.tier++;
            this.updated = true;
          }
        }
      }
    };
  },
  road: () => {
    return {
      id: 'road',
      tier: 0,
      updated: true,
      update: function () {
        if (this.updated) this.updated = false;
      }
    };
  }
};