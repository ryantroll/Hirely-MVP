var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var careerMatchScoresSchema = new Schema({
    occId:{type:String, required:true, index: true},
    userId:{type:String, required:true, index: true},
    // TODO:  Explicitly specify each ksaw
    maxOverallScore: {type:Number, required:true, index: true},
    scores: {
        0: {
            exp      :       {type:Number, required:true},
            // edu      :       {type:Number, required:true},
            psy      :       {type:Number, required:true},
            overall  :       {type:Number, required:true}
        },
        3: {
            exp      :       {type:Number, required:true},
            // edu      :       {type:Number, required:true},
            psy      :       {type:Number, required:true},
            overall  :       {type:Number, required:true}
        },
        6: {
            exp      :       {type:Number, required:true},
            // edu      :       {type:Number, required:true},
            psy      :       {type:Number, required:true},
            overall  :       {type:Number, required:true}
        },
        12: {
            exp      :       {type:Number, required:true},
            // edu      :       {type:Number, required:true},
            psy      :       {type:Number, required:true},
            overall  :       {type:Number, required:true}
        },
        24: {
            exp      :       {type:Number, required:true},
            // edu      :       {type:Number, required:true},
            psy      :       {type:Number, required:true},
            overall  :       {type:Number, required:true}
        },
        48: {
            exp      :       {type:Number, required:true},
            // edu      :       {type:Number, required:true},
            psy      :       {type:Number, required:true},
            overall  :       {type:Number, required:true}
        },
        64: {
            exp      :       {type:Number, required:true},
            // edu      :       {type:Number, required:true},
            psy      :       {type:Number, required:true},
            overall  :       {type:Number, required:true}
        },
        98: {
            exp      :       {type:Number, required:true},
            // edu      :       {type:Number, required:true},
            psy      :       {type:Number, required:true},
            overall  :       {type:Number, required:true}
        },
        124: {
            exp      :       {type:Number, required:true},
            // edu      :       {type:Number, required:true},
            psy      :       {type:Number, required:true},
            overall  :       {type:Number, required:true}
        }
    }
});


var careerMatchScores = mongoose.model('CareerMatchScores', careerMatchScoresSchema, "careerMatchScores");

module.exports = careerMatchScores;
