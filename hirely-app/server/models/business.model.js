var Utilities = require('./utilities-for-models');
var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

// TODO:  stop using freeSchema the way it's being used.  Should instead
// convert the existing sub-schemas to freeSchemas
var freeSchema = new Schema({}, {strict:false, _id:false});

var positionSchema = new Schema({
    locationId   :    {type: String, required:true},
    title         :    {type: String, required:true},
    slug          :    {type: String},
    occId         :    {type: String, required:true},
    description   :    {type: String, required:false},
    hasOpenings   :    {type: Boolean, default:false},  // this field should be updated whenever positions are updated
    interviewMaterials: [
        {
            name: String,
            url: String
        }
    ],

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
    openingsCount     :     Number,
    expLvl            :     Number,

    scoreWeights      :     {
        exp:  Number,
        edu:  Number,
        qual: Number,
        psy: Number,
    },

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
        commission      :     Boolean,
        paidVacation    :     Boolean,
        paidSickTime    :     Boolean,
        tips            :     Boolean,
        bonus           :     Boolean,
        flexibleSchedul :     Boolean,
        healthInsurance :     Boolean,
        dentalInsurance :     Boolean,
        retirementPlan  :     Boolean,
        discounts       :     Boolean
    }, //// benefits

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

    filters: {type:freeSchema, required:false},

});//// positionSchema
/**
 * Add slug to postion schema
 */
//positionSchema.plugin( Utilities.slug, {slugProperty:'slug', fields:['title'], unique:false, model:'Businesses'} );

var locationSchema = new Schema({
      name              :   {type:String, required:true},
      slug              :   {type: String},
      phone             :   {type:String, required:true},
      heroImageURL    :       {type:String},
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

      positionSlugs: {type:freeSchema, required:false},

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
      formattedAddress  :   {type:String, required:false},
      googlePlaceId     :   {type:String, required:false},
      lat               :   Number,
      lng               :   Number

    }///location object
);/// locationSchema
/**
 * Add slug to location schema
 */
//locationSchema.plugin( Utilities.slug, {slugProperty:'slug', fields:['state', 'city', 'name'], unique:false, model:'Businesses'} );

var businessSchema = new Schema({
  /**
   * Business info
   */
  name            :       {type:String, required:true},
  slug            :       {type:String, required:false, unique:true, index:true},
  description     :       {type:String},
  heroImageURL    :       {type:String},
  logoImageURL    :       {type:String},
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
  //locations: [locationSchema]///locations array
  locations: {type:freeSchema, required:false},
  locationSlugs: {type:freeSchema, required:false},

  positions: {type:freeSchema, required:false}

});
/**
 * Add slug to bsiness through slug plugin
 */
//businessSchema.plugin( Utilities.slug, {slugProperty:'slug', fields:'name', unique:true, model:'Businesses'} );


var BusinessModel = mongoose.model('Businesses', businessSchema, "businesses");

module.exports = BusinessModel;
