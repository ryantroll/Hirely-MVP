var Utilities = require('./utilities-for-models');
var mongoose = require('mongoose');
// mongoose.set('debug', true);
var Schema = mongoose.Schema;

var metaSchema = new Schema({
  metaId:{type:String, required:true, unique:true, index:true},
  metaName:{type:String, required:true, index:true},
  metaType:{type:String, required:true, index:true},
  meta:{type:Object}
},
{strict:true});

var TraitifyMeta = mongoose.model('TraitifyMeta', metaSchema, "traitifymeta");

module.exports = TraitifyMeta;