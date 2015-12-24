var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var onetTitlesSchema = new Schema({
  code: 'String',
  title: 'String'
});


var onetTitles = mongoose.model('OnetTitles', onetTitlesSchema, "onetTitles");

module.exports = onetTitles;
