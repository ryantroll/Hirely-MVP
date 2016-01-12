var Utilities = require('./utilities-for-models');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var variantSchema = new Schema(
  {
    title             :     { type:String, required:true },
    slug              :     {type: String},
    workType          :     {
                              type:String,
                              required:true,
                              validate:{
                                validator: function(v){
                                  return /^(part\-time|full\-time)$/.test(v);
                                },
                                message:'{VALUE} is not valid work type'
                              }
                            },

    hoursPerWeekMin   :     Number,
    hoursPerWeekMax   :     Number,
    minOpeningShifts  :     Number,
    minClosingShifts  :     Number,
    minWeekdayShifts  :     Number,
    minWeekendShifts  :     Number,
    openings          :     Number,

    compensation:
    {
      wageType        :     {
                              type:String,
                              required:true,
                              validate:{
                                validator: function(v){
                                  return /^(hourly)$/.test(v);
                                },
                                message:'{VALUE} is not valid work type'
                              }
                            },
      wageAmount      :     {type:Number, required:true},
      commission      :     Boolean,
      tips            :     Boolean
    }, //// ocmpensation object

    benefits:
    {
      paidVacation    :     Boolean,
      paidSickTime    :     Boolean,
      flexibleSchedul :     Boolean,
      healthInsurance :     Boolean,
      dentalInsurance :     Boolean,
      retirementPlan  :     Boolean,
      discounts       :     Boolean
    }, //// benefites

    shifts:
    {
      mon           :       [Number],
      tue           :       [Number],
      wed           :       [Number],
      thu           :       [Number],
      fri           :       [Number],
      sat           :       [Number],
      sun           :       [Number],
      required      :       Boolean
    },/// shift object

    prescreenQuestions:
        [
            {
                question  :     String,
            }
        ], /// prescreen array


    // applications:[ applicationSchema ]//// application array

  }//// varients[] object
);//// variantSchema
/**
 * Add slug to postion schema
 */
// variantSchema.plugin(slug('workType'));

var positionSchema = new Schema({
        title         :    {type: String, required:true},
        slug          :    {type: String},
        onetClass     :    {type: String, required:true},

        variants      :    [ variantSchema ]//// vairants araay
});//// positionSchema
/**
 * Add slug to postion schema
 */
// positionSchema.plugin(slug('title'));

var locationSchema = new Schema({
      name              :   {type:String, required:true},
      slug              :   {type: String},
      phone             :   {type:String, required:true},
      hoursOfOperation  :
      {
        mon   : [Number],
        tue   : [Number],
        wed   : [Number],
        thu   : [Number],
        fri   : [Number],
        sat   : [Number],
        sun   : [Number]
      },

      /**
       * Location Address
       */
      country           :   {type:String, required:true},
      state             :   {type:String, required:true},
      city              :   {type:String, required:true},
      street1           :   {type:String, required:true},
      street2           :   String,
      street3           :   String,
      neighbourhood     :   String,
      postalCode        :   {type:String, required:true},
      formattedAddress  :   {type:String, required:true},
      lat               :   Number,
      lng               :   Number,

      /**
       * Positions opened in this location
       */
      positions: [positionSchema] /// position array
    }///location object
);/// locationSchema
/**
 * Add slug to location schema
 */
// locationSchema.plugin(slug('state city name'));

var businessSchema = new Schema({
  /**
   * Business info
   */
  name            :       {type:String, required:true},
  slug            :       {type:String, required:false, unique:true, index:true},
  description     :       String,
  photoUrl        :       {type:String},
  email           :       {
                            type:String,
                            required:true,
                            index:true,
                            unique:true,
                            validate:{
                              validator: function(v){
                                return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
                              },
                              message:'{VALUE} is not valid email'
                            },
                            set: Utilities.toLower
                          },
  website         :       {
                            type:String,
                            validate:{
                              validator: function(v){
                                return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(v);
                              },
                              message:'{VALUE} is not valid website URL'
                            }
                          },
  agreedToTerms   :       {type:Boolean, required:true},

  /**
   * Locations
   */
  locations: [locationSchema]///locations array

});
/**
 * Add slug to bsiness through slug plugin
 */
// businessSchema.plugin( Utilities.slug, {slug:'slug', fields:'name', unique:true} );


var BusinessModel = mongoose.model('Businesses', businessSchema, "businesses");

module.exports = BusinessModel;
