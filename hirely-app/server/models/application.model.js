var Utilities = require('./utilities-for-models');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = new Schema({
  userId      :       {type:Schema.Types.ObjectId, ref:'users', required:true, index:true},
  positionId   :       {type:Schema.Types.ObjectId, required:true, index:true},
  createdAt   :       {type:Date, required:true, default:Date.now},
  status      :       {
                        type:Number, //// 0 close, 1 open
                        required:true,
                        validate:{
                          validator: function(v){
                            return /^(1|0)$/.test(v.toString());
                          },
                          message:'{VALUE} is not valid value for application status'
                        }
                      },
  prescreenAnswers  :
  [
    {
      question  :     String,
      answer    :     String
    }
  ],/// prescreen array

});//// applicationSchema

var ApplicationModel = mongoose.model('Applications', applicationSchema, "applications");

module.exports = ApplicationModel;