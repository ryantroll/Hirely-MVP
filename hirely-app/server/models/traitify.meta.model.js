var Utilities = require('./utilities-for-models');
var mongoose = require('mongoose');
// mongoose.set('debug', true);
var Schema = mongoose.Schema;

var metaSchema = new Schema({
    _id:{type:String, requireed:true},
  metaId:{type:String, required:false, unique:true, index:true},
  // metaName:{type:String, required:true, index:true},
  metaType:{type:String, required:true, index:true},
  meta:{type:Object}
},
{strict:true, _id:false});

var TraitifyMeta = mongoose.model('TraitifyMeta', metaSchema, "traitifyMeta");

module.exports = TraitifyMeta;