var Modules = {
  init: function () {
    require('./modules/backdrop')();
    require('./modules/follow')();

  }
};

module.exports = Modules;
