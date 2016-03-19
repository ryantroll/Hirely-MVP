var Utilities = require('./utilities-for-models');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = new Schema({
  userId      :       {type:String, ref:'users', required:true, index:true},
  positionId   :       {type:String, required:true, index:true},
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
  viewStatus  :       {
                        type:Number, //// 0 or undefined close, 1 viewed, 2 aging /// aging option might not be used as it calculated based on date
                        required:false,
                        validate:{
                          validator: function(v){
                            return /^(2|1|0)$/.test(v.toString());
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