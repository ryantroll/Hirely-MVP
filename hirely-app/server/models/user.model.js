var Utilities = require('./utilities-for-models');
var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

var freeSchema = new Schema({}, {strict:false, _id:false});

function endDateValidator(value){
  /**
   * this here will refer to schema
   */

  if(null != value && !isNaN(value.getTime())
    && this.dateStart && !isNaN(this.dateStart.getTime())
  ){
    return value > this.dateStart;
  }
  else{
    return true;
  }
}

/**
 * [customId schema with disabled auto _id to be used in arrays of personalityExam schema where the "name" is used as _id]
 * @type {Schema}
 */
var customId = new Schema({
  _id:{type:String, required:true},
  score:{type:Number, required:false}
}
,{strict:false, _id:false});

var personalitySchema = new Schema({
  extId               :       {type:String, required:true},
  createdAt           :       {type:Date, required:true, default:Date.now},
  personalityTypes    :       [customId],
  personalityTraits   :       [customId],
  personalityBlend    :       {
                                name:String,
                                personalityTypes:[customId]
                              },
  careerMatchScores        :       {type:freeSchema, required:false}

});

var experienceSchema = new Schema({
  formattedAddress        :         {type:String, required:false},
  city                    :         {type:String, required:true},
  state                   :         {type:String, required:true},
  googlePlaceId           :         {type:String, required:false},
  currentlyHere           :         {type:Boolean, required:false},
  dateStart               :         {type:Date, required:true},
  dateEnd                 :         {
                                      type:Date,
                                      required:false,
                                      validate:[endDateValidator, 'End date must be greater than start date']
                                    },
  reportedOccTitle         :         {type:String, required:true},
  occTitle       :         {type:String, required:true},
  occId        :         {type:String, required:false},
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
                                          return /^(High School|Certificate|Associate's Degree|Bachelor's Degree|Master's Degree|Professional Degree|Doctoral Degree|Post-Doctoral Training)$/.test(v);
                                        },
                                        message:'{VALUE} is not valid education program type'
                                      }
                                    },
  degree                  :         {type:String, reqired:true},

  dateEnd                 :         {
                                      type:Date,
                                      required:false,
                                      validate:[endDateValidator, 'End date must be greater than start date']
                                    },
  isCompleted             :         {type:Boolean, required:true}
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
  password              :     String,
  mobile                :     {type:String},
  dateOfBirth           :     {type:Date},
  agreedToTerms         :     {type:Boolean},
  personalStatment      :     {type:String},
  profileImageURL       :     {type:String},
  eligibleToWorkInUS    :     {type:Boolean},
  tenureAvg             :     {type:Number},
  queuedForMetricUpdate :     {type:Boolean, default:false},


  /**
   * Date fields
   */
  createdOn     :       {type: Date,    default: Date.now},
  lastModifiedOn:       {type: Date,    default: Date.now},

  /**
   * Address fields
   */
  postalCode        :   String,

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
        discounts           :       Boolean,
        optOutOfSuggestionsFromEmployers:   {type:Boolean, default:false},
    },


    /**
     * Personality Exams
     */
    personalityExams:[personalitySchema],

    /**
     * Availability
     */
    availability: {
        isAvailable         :       {type:Boolean, default:true},
        startAvailability   :       Number,
        hoursPerWeekMin     :       Number,
        hoursPerWeekMax     :       Number,
        season              :       String,
        dateStart           :       Date,
        dateEnd             :       Date,
        mon                 :       [Number],
        tue                 :       [Number],
        wed                 :       [Number],
        thu                 :       [Number],
        fri                 :       [Number],
        sat                 :       [Number],
        sun                 :       [Number]
    },

    /**
     * Work Experience
     */
    workExperience      :       [experienceSchema],

    /**
     * Education
     */
    education           :       [educationSchema],
    educationMax        :       {type:freeSchema, required:false},
    educationStatus     :       String,

    /**
     * KSAW scores
     */
    // TODO:  Explicitly specify each ksaw
    scores              : {
        Knowledge          :       {type:freeSchema, required:false},
        Skills              :       {type:freeSchema, required:false},
        Abilities           :       {type:freeSchema, required:false},
        WorkActivities      :       {type:freeSchema, required:false}
    },

    isVetted            : {type:String, default:false}

});


var UserModel = mongoose.model('User', userSchema, "users");

module.exports = UserModel;

// console.log("Running...");
// UserModel.find({}).then(function(users) {
//     console.log("Found users");
//     users.forEach(function(user) {
//         console.log("user: "+user.email);
//         if (user.personalityExams && user.personalityExams.length) {
//             user.personalityExams[0].personalityBlend = {
//                 "name": "Mentor/Inventor",
//                 "personalityTypes": [
//                     {
//                         "_id": "Mentor"
//                     },
//                     {
//                         "_id": "Inventor"
//                     }
//                 ]
//             };
//             user.save();
//         }
//     });
//     console.log("Done.");
// });