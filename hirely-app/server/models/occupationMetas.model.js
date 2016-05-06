var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

var occupationMetasSchema = new Schema({
    occId         :           {type:String, reqired: true, index:true, unique:false},
    skillMetrics  :           [
                                    {
                                        sid:{type:String, require:true},
                                        name:{type:String, require:true},
                                        im:{type:Number, require:true},
                                        lv:{type:Number, require:true},
                                    }
                                ],
    traitMetrics  :             [
                                    {
                                        name:{type:String, require:true},
                                        description:{type:String, require:true},
                                        weight:{type:Number, require:true}
                                    }
                                ]

});


var OccupationMetas = mongoose.model('OccupationMetas', occupationMetasSchema, "occMetas");

module.exports = OccupationMetas;
