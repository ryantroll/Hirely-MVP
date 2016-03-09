var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

var onetIconsSchema = new Schema({
  /**
   * Personal info
   */
  icon       :         {type:String, reqired: true, index:false},
  iconColor  :         {type:String, reqired: true, index:false},
  occId      :         {type:String, reqired: true, index:true, unique:true},
  cssClass   :         {type:String, reqired: true, index:false}

});


var OnetIconsModel = mongoose.model('OnetIcons', onetIconsSchema, "onetIcons");

module.exports = OnetIconsModel;
