var Utilities = require('./utilities-for-models');
var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

var persoanlitySchema = new Schema({
  userId              :       {type:Schema.Types.ObjectId, ref:'users', required:true, index:true},
  extId               :       {type:String, required:true},
  createdAt           :       {type:Date, required:true, default:Date.now},
  personalityTypes    :       [{
                                score:Number,
                                name:String,
                              }],
  personalityTraits   :       [{
                                score:Number,
                                name:String,
                              }],
  personalityBlend    :       {
                                name:String,
                                personalityTypes:[{name:String}]
                              }

});

var PersonalityModel = mongoose.model('User', persoanlitySchema, "users");

module.exports = PersonalityModel;