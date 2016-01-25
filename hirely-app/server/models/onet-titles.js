var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var onetTitlesSchema = new Schema({
  onetId:String,
  occupationTitle:String,
  reportedTitle:String,
  combinedTitle:String
});


var onetTitles = mongoose.model('OnetTitles', onetTitlesSchema, "onetTitles");

module.exports = onetTitles;
