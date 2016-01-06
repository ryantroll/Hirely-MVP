var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

var userIdMapSchema = new Schema({
  /**
   * Personal info
   */
  localId       :         {type:String, reqired: true, unique:true, index:true},
  externalId    :         {type:String, reqired: true, unique:true, index:true}
});


var UserIdMapModel = mongoose.model('UserIdMap', userIdMapSchema, "usersidmap");

module.exports = UserIdMapModel;
