var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var freeSchema = new Schema({}, {strict:false, _id:false});

var onetScoresSchema = new Schema({
    _id:{type:String, required:true},  // This id is an onetId
    // TODO:  Explicitly specify each ksaw
    scores: {
        0: {
            Knowledge          :       {type:freeSchema, required:false},
            Skills              :       {type:freeSchema, required:false},
            Abilities           :       {type:freeSchema, required:false},
            WorkActivities      :       {type:freeSchema, required:false}
        },
        3: {
            Knowledge          :       {type:freeSchema, required:false},
            Skills              :       {type:freeSchema, required:false},
            Abilities           :       {type:freeSchema, required:false},
            WorkActivities      :       {type:freeSchema, required:false}
        },
        6: {
            Knowledge          :       {type:freeSchema, required:false},
            Skills              :       {type:freeSchema, required:false},
            Abilities           :       {type:freeSchema, required:false},
            WorkActivities      :       {type:freeSchema, required:false}
        },
        12: {
            Knowledge          :       {type:freeSchema, required:false},
            Skills              :       {type:freeSchema, required:false},
            Abilities           :       {type:freeSchema, required:false},
            WorkActivities      :       {type:freeSchema, required:false}
        },
        24: {
            Knowledge          :       {type:freeSchema, required:false},
            Skills              :       {type:freeSchema, required:false},
            Abilities           :       {type:freeSchema, required:false},
            WorkActivities      :       {type:freeSchema, required:false}
        },
        48: {
            Knowledge          :       {type:freeSchema, required:false},
            Skills              :       {type:freeSchema, required:false},
            Abilities           :       {type:freeSchema, required:false},
            WorkActivities      :       {type:freeSchema, required:false}
        },
        64: {
            Knowledge          :       {type:freeSchema, required:false},
            Skills              :       {type:freeSchema, required:false},
            Abilities           :       {type:freeSchema, required:false},
            WorkActivities      :       {type:freeSchema, required:false}
        },
        98: {
            Knowledge          :       {type:freeSchema, required:false},
            Skills              :       {type:freeSchema, required:false},
            Abilities           :       {type:freeSchema, required:false},
            WorkActivities      :       {type:freeSchema, required:false}
        },
        124: {
            Knowledge          :       {type:freeSchema, required:false},
            Skills              :       {type:freeSchema, required:false},
            Abilities           :       {type:freeSchema, required:false},
            WorkActivities      :       {type:freeSchema, required:false}
        }
    }
});


var onetScoresModel = mongoose.model('OnetScores', onetScoresSchema, "onetScores");

module.exports = onetScoresModel;
