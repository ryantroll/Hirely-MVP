var Utilities = require('./utilities-for-models');
var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

var metaSchema = new Schema({
  enviornments:[{id:{type:String, required:true, unique:true}}],
  famousPeople:[{id:{type:String, required:true, unique:true}}],
  personalityTraits:[Object],
  personalityTypes:[{
    id:{type:String, required:true, unique:true},
    name:{type:String, required:true, unique:true}
  }],
},
{strict:false});

var TraitifyMeta = mongoose.model('TraitifyMeta', metaSchema, "traitifymeta");

module.exports = TraitifyMeta;