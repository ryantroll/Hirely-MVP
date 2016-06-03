var Utilities = require('./utilities-for-models');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var freeSchema = new Schema({}, {strict: false, _id: false});

var historySchema = new Schema({
    time: {type: Date, default: Date.now},
    type: {type: String},
    subject: {type: String},
    body: {type: String},
    userId: {type: String},
    userFirstName: {type: String},
    userLastName: {type: String},
    meta: freeSchema
}, {_id: false});

var prescreenSchema = new Schema({
    question: String,
    answer: {type:freeSchema},
    type: String,
    maxChars: Number
}, {_id: false});

var applicationSchema = new Schema(
    {
        userId: {type: String, ref: 'users', required: true, index: true},
        positionId: {type: String, required: true, index: true},
        createdAt: {type: Date, required: true, default: Date.now},
        appliedAt: Date,
        isVetted: {type: Boolean, default: false},
        status: {
            type: Number, //// -1 Soft Fail, 0 Started, 1 Pre-scree , 2 applied, 3 Shortlisted, 4 Interviewed, 5 Hired, 6 Dismissed, 7 Expired, 8 Failed Vetting.
            required: true,
            validate: {
                validator: function (v) {
                    return /^(8|7|6|5|4|3|2|1|0|-1)$/.test(v.toString());
                },
                message: '{VALUE} is not valid value for application status'
            }
        },
        viewStatus: {
            type: Number, //// 0 or undefined close, 1 viewed, 2 aging /// aging option might not be used as it calculated based on date
            required: false,
            validate: {
                validator: function (v) {
                    return /^(2|1|0)$/.test(v.toString());
                },
                message: '{VALUE} is not valid value for application status'
            }
        },
        prescreenAnswers: [prescreenSchema],/// prescreen array

        // This is failing for some reason
        history: [historySchema]
        // history: [{type:freeSchema, required:false}],

    }
    ,{strict: "throw"}
);//// applicationSchema

var ApplicationModel = mongoose.model('Applications', applicationSchema, "applications");

module.exports = ApplicationModel;
