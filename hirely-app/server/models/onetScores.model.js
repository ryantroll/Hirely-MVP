var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var freeSchema = new Schema({}, {strict:false, _id:false});

var onetScoresSchema = new Schema({
    _id:{type:String, required:true},  // This id is an onetId
    // TODO:  Explicitly specify each ksaw
    scores: {
        0: {
            knowledges          :       {type:freeSchema, required:false},
            skills              :       {type:freeSchema, required:false},
            abilities           :       {type:freeSchema, required:false},
            workActivities      :       {type:freeSchema, required:false}
        },
        3: {
            knowledges          :       {type:freeSchema, required:false},
            skills              :       {type:freeSchema, required:false},
            abilities           :       {type:freeSchema, required:false},
            workActivities      :       {type:freeSchema, required:false}
        },
        6: {
            knowledges          :       {type:freeSchema, required:false},
            skills              :       {type:freeSchema, required:false},
            abilities           :       {type:freeSchema, required:false},
            workActivities      :       {type:freeSchema, required:false}
        },
        12: {
            knowledges          :       {type:freeSchema, required:false},
            skills              :       {type:freeSchema, required:false},
            abilities           :       {type:freeSchema, required:false},
            workActivities      :       {type:freeSchema, required:false}
        },
        24: {
            knowledges          :       {type:freeSchema, required:false},
            skills              :       {type:freeSchema, required:false},
            abilities           :       {type:freeSchema, required:false},
            workActivities      :       {type:freeSchema, required:false}
        },
        48: {
            knowledges          :       {type:freeSchema, required:false},
            skills              :       {type:freeSchema, required:false},
            abilities           :       {type:freeSchema, required:false},
            workActivities      :       {type:freeSchema, required:false}
        },
        64: {
            knowledges          :       {type:freeSchema, required:false},
            skills              :       {type:freeSchema, required:false},
            abilities           :       {type:freeSchema, required:false},
            workActivities      :       {type:freeSchema, required:false}
        },
        98: {
            knowledges          :       {type:freeSchema, required:false},
            skills              :       {type:freeSchema, required:false},
            abilities           :       {type:freeSchema, required:false},
            workActivities      :       {type:freeSchema, required:false}
        },
        124: {
            knowledges          :       {type:freeSchema, required:false},
            skills              :       {type:freeSchema, required:false},
            abilities           :       {type:freeSchema, required:false},
            workActivities      :       {type:freeSchema, required:false}
        }
    }
});


var onetScoresModel = mongoose.model('OnetScores', onetScoresSchema, "onetScores");

module.exports = onetScoresModel;
