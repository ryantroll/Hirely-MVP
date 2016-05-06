var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

var ksawDescriptionsSchema = new Schema({
    'Element ID'         :           {type:String, reqired: true, index:true, unique:true},
    'Element Name'         :           {type:String, reqired: true, index:true, unique:false},
    'Description'         :           {type:String, reqired: true, index:false, unique:false},
});


var KsawDescriptions = mongoose.model('KsawDescriptions', ksawDescriptionsSchema, "ksawDescriptions");

module.exports = KsawDescriptions;
