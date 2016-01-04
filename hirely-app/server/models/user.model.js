var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  /**
   * Personal info
   */
  firstName     :       String,
  lastName      :       String,
  email         :       String,
  mobile        :       String,

  /**
   * Date fields
   */
  createdOn     :       Date,
  lastModifiedOn:       {type: Date,    default: Date.now},

  /**
   * User object meta fields
   */
  provider      :       String,
  userType      :       String,

  /**
   * Address fields
   */
  country           :   String,
  stat              :   String,
  city              :   String,
  street1           :   String,
  street2           :   String,
  street3           :   String,
  postalCode        :   String,
  formattedAddress  :   String,
  lat               :   Number,
  lng               :   Number,

  /**
   * Job Application related fields
   */
    businessesAppliedTo: [],
    businessesOwned: [],
    businessesManaged: [],
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
        seekerStatus        :       Number, //// 0 = inactive, 1 = active
        startAvailability   :       Number,
        hoursPerWeekMin     :       Number,
        hoursPerWeekMax     :       Number,
        mon                 :       [],
        tue                 :       [],
        wed                 :       [],
        thu                 :       [],
        fri                 :       [],
        sat                 :       [],
        sun                 :       []
    },

    /**
     * Languages
     */
    spokenLanguages: {
        English         :       Boolean,
        Spanish         :       Boolean
    }

});


var UserModel = mongoose.model('User', userSchema, "userModel");

module.exports = UserModel;
