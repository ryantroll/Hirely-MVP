var Utilities = require('./utilities-for-models');
var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

function endDateValidator(value){
  /**
   * this here will refer to schema
   */
  console.log(this.formattedAddress, value > this.dateStart)
  if(null != value && value.getTime() != 0){
    return value > this.dateStart;
  }
  else{
    return true;
  }
}

/**
 * [customeId schema with disabled auto _id to be used in arrays of personalityExam schema where the "name" is used as _id]
 * @type {Schema}
 */
var customeId = new Schema({
  _id:{type:String, requireed:true},
  score:{type:Number, required:false}
}
,{strict:false, _id:false});

var personalitySchema = new Schema({
  extId               :       {type:String, required:true},
  createdAt           :       {type:Date, required:true, default:Date.now},
  personalityTypes    :       [customeId],
  personalityTraits   :       [customeId],
  personalityBlend    :       {
                                name:String,
                                personalityTypes:[customeId]
                              }

});

var experienceSchema = new Schema({
  formattedAddress        :         {type:String, required:false},
  city                    :         {type:String, required:true},
  state                   :         {type:String, required:true},
  googlePlaceId           :         {type:String, required:false},
  dateStart               :         {type:Date, required:true},
  dateEnd                 :         {
                                      type:Date,
                                      required:false,
                                      validate:[endDateValidator, 'End date must be greater than start date']
                                    },
  reportedJobName         :         {type:String, required:true},
  occupationJobName       :         {type:String, required:true},
  onetOccupationId        :         {type:String, required:false},
  accomplishments         :         {type:String, required:false}
});

var educationSchema = new Schema({
  institutionName         :         {type:String, required:true},
  city                    :         {type:String, required:true},
  state                   :         {type:String, required:true},
  programType             :         {
                                      type:String,
                                      required:true,
                                      validate:{
                                        validator: function(v){
                                          return /^(High School Equivalent|Associates|Bachelors|Masters|PhD)$/.test(v);
                                        },
                                        message:'{VALUE} is not valid education program type'
                                      }
                                    },
  degree                  :         {type:String, reqired:true},

  dateStart               :         {type:Date, required:true},
  dateEnd                 :         {
                                      type:Date,
                                      required:false,
                                      validate:[endDateValidator, 'End date must be greater than start date']
                                    },
  isCompleted             :         {type:Boolean, required:true},
  isOnline                :         {type:Boolean, required:true}
});

var userSchema = new Schema({
  /**
   * Personal info
   */
  firstName     :       {type:String, required:true},
  lastName      :       {type:String, required:true},
  email         :       {
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
                          /**
                           * make sure emails are all saved in lower case to easy compare
                           */
                          set: Utilities.toLower
                        },
  mobile                :     {type:String},
  dateOfBirth           :     {type:Date},
  agreedToTerms         :     {type:Boolean},
  personalStatment      :     {type:String},
  profileImageURL       :     {type:String},
  eligibleToWorkInUS    :     {type:Boolean},


  /**
   * Date fields
   */
  createdOn     :       {type: Date,    default: Date.now},
  lastModifiedOn:       {type: Date,    default: Date.now},

  /**
   * User object meta fields
   */
  provider      :       {
                          type:String,
                          required:true,
                          validate:{
                            validator: function(v){
                              return /^(password|twitter|facebook|google)$/.test(v);
                            },
                            message:'{VALUE} is not valid provider name'
                          }
                        },
  userType      :       {
                          type:String,
                          required:true,
                          validate:{
                            validator: function(v){
                              return /^(JS|IOS|ANDROID)$/.test(v);
                            },
                            message:'{VALUE} is not valid userType'
                          }
                        },

  /**
   * Address fields
   */
  country           :   String,
  state             :   String,
  city              :   String,
  street1           :   String,
  street2           :   String,
  street3           :   String,
  postalCode        :   String,
  googlePlaceId     :   String,
  formattedAddress  :   String,
  lat               :   Number,
  lng               :   Number,

  /**
   * Job Application related fields
   */
    businessesAppliedTo: [],
    businessesOwned: [],
    locationsManaged: [],
    businessesStaffOf: [],

    /**
     * Preferences object
     */
    preferences:{
        desiredWageMin      :       Number,
        paidVacation        :       Boolean,
        paidSickTime        :       Boolean,
        flexibleSchedule    :       Boolean,
        healthInsurance     :       Boolean,
        dentalInsurance     :       Boolean,
        retirementPlan      :       Boolean,
        discounts           :       Boolean
    },


    /**
     * Personality Exams
     */
    personalityExams:[personalitySchema],

    /**
     * Availability
     */
    availability: {
        seekerStatus        :       {//// 0 = inactive, 1 = active
                                      type:Number,
                                      required:true,
                                      default: 1,
                                      validate:{
                                        validator: function(v){
                                          return /^(0|1)$/.test(v.toString());
                                        },
                                        message:'{VALUE} is not a valid availability.seekerStatus'
                                      }
                                    },
        startAvailability   :       Number,
        hoursPerWeekMin     :       Number,
        hoursPerWeekMax     :       Number,
        mon                 :       [Number],
        tue                 :       [Number],
        wed                 :       [Number],
        thu                 :       [Number],
        fri                 :       [Number],
        sat                 :       [Number],
        sun                 :       [Number]
    },

    /**
     * Languages
     */
    spokenLanguages: {
        English         :       Boolean,
        Spanish         :       Boolean
    },

    /**
     * Work Experience
     */
    workExperience      :       [experienceSchema],

    /**
     * Education
     */
    education           :       [educationSchema]

});


var UserModel = mongoose.model('User', userSchema, "users");

module.exports = UserModel;