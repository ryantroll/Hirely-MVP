var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchecma = new Schema({
  userId      :       {type:Schema.Types.ObjectId, ref:'users', required:true, index:true},
  type        :       {
                        type:String,
                        required:true,
                        validate:{
                          validator: function(v){
                            return /^(position|business|location)$/.test(v);
                          },
                          message:'{VALUE} is not valid favorite type'
                        }
                      },
  businessId  :       {type:Schema.Types.ObjectId, ref:'businesses', required:true, index:true},
  locationId  :       {
                        type:Schema.Types.ObjectId,
                        index:true,
                        // validate:{
                        //   validator: function(v){
                        //     console.log(v);
                        //     console.log(v && (this.type === 'position' || this.type === 'location'), "<<<");
                        //     return v && (this.type === 'position' || this.type === 'location')

                        //   },
                        //   message: 'Location ID is required for favorite type location and position'
                        // }
                      },
  positionId  :       {type:Schema.Types.ObjectId, index:true},
  createdAt   :       {type:Date, required:true, default:Date.now()}
});//// applicationSchema

favoriteSchecma.pre('save', function(next){
  if(this.type === 'location' && !this.locationId){
    return next(new Error("locationId is required for type location"))
  }
  if(this.type === 'position'){
    if(!this.locationId){
      return next(new Error("locationId is required for type position"));
    }
    if(!this.positionId){
      return next(new Error("positionId is required for type position"));
    }
  }
  next();
})

var FavoritesModel = mongoose.model('FavoritesModel', favoriteSchecma, "favorites");

module.exports = FavoritesModel;