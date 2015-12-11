/**
 *
 * Base Model Generator
 *
 * */

Model = function(methods) {
  var baseModel = function() {
    this.initialize.apply(this, arguments);
  };

  for (var property in methods) {
    baseModel.prototype[property] = methods[property];
  }

  if (!baseModel.prototype.initialize) baseModel.prototype.initialize = function(){};

  return baseModel;
};