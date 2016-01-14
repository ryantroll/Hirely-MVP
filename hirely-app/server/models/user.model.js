var Utilities = require('./utilities-for-models');
var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

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
  mobile        :       {type:String},

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
  state              :   String,
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
    personalityExams:[
        {
          extId: String,
          skills: []
        }
    ],

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
    }

});


var UserModel = mongoose.model('User', userSchema, "users");

module.exports = UserModel;
