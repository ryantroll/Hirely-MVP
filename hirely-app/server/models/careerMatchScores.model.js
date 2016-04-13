var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var careerMatchScoresSchema = new Schema({
    createdAt : {type:Date, default:Date.now},
    occId:{type:String, required:true, index: true},
    userId:{type:String, required:true, index: true},
    // TODO:  Explicitly specify each ksaw
    maxOverallScore: {type:String, required:true, index: true},
    scores: {
        0: {
            exp      :       {type:String, required:true},
            // edu      :       {type:String, required:true},
            psy      :       {type:String, required:true},
            overall  :       {type:String, required:true}
        },
        1: {
            exp      :       {type:String, required:true},
            // edu      :       {type:String, required:true},
            psy      :       {type:String, required:true},
            overall  :       {type:String, required:true}
        },
        3: {
            exp      :       {type:String, required:true},
            // edu      :       {type:String, required:true},
            psy      :       {type:String, required:true},
            overall  :       {type:String, required:true}
        },
        6: {
            exp      :       {type:String, required:true},
            // edu      :       {type:String, required:true},
            psy      :       {type:String, required:true},
            overall  :       {type:String, required:true}
        },
        12: {
            exp      :       {type:String, required:true},
            // edu      :       {type:String, required:true},
            psy      :       {type:String, required:true},
            overall  :       {type:String, required:true}
        },
        24: {
            exp      :       {type:String, required:true},
            // edu      :       {type:String, required:true},
            psy      :       {type:String, required:true},
            overall  :       {type:String, required:true}
        },
        48: {
            exp      :       {type:String, required:true},
            // edu      :       {type:String, required:true},
            psy      :       {type:String, required:true},
            overall  :       {type:String, required:true}
        },
        72: {
            exp      :       {type:String, required:true},
            // edu      :       {type:String, required:true},
            psy      :       {type:String, required:true},
            overall  :       {type:String, required:true}
        },
        120: {
            exp      :       {type:String, required:true},
            // edu      :       {type:String, required:true},
            psy      :       {type:String, required:true},
            overall  :       {type:String, required:true}
        }
    }
});


var careerMatchScores = mongoose.model('CareerMatchScores', careerMatchScoresSchema, "careerMatchScores");

module.exports = careerMatchScores;
