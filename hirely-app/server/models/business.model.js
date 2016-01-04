var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = new Schema({
  userId      :       String,
  status      :       String,
  prescreenAnswers  :
  [
    {
      question  :     String,
      answer    :     String
    }
  ]/// prescreen array
});

var businessSchema = new Schema({
  /**
   * Business info
   */
  name            :       String,
  description     :       String,
  email           :       String,
  website         :       String,
  agreedToTerms   :       Boolean,

  /**
   * Locations
   */
  locations: [
    {
    name              :       String,
    hoursOfOperation  :
    {
      mon   : [],
      tue   : [],
      wed   : [],
      thu   : [],
      fri   : [],
      sat   : [],
      sun   : []
    },

    /**
     * Location Address
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
     * Positions opened in this location
     */
    positions: [
      {
        title         :    String,
        onetClass     :    String,
        variants      :
        [
          {
            workType          :     String,
            hoursPerWeekMin   :     Number,
            hoursPerWeekMax   :     Number,
            minOpeningShifts  :     Number,
            minClosingShifts  :     Number,
            minWeekdayShifts  :     Number,
            minWeekendShifts  :     Number,
            openings          :     Number,

            compensation:
            {
              wageType        :     String,
              wageAmount      :     Number,
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

            shifts: [
              {
                shiftStart    :      Number,
                shiftStop     :      Number,
                day           :      String,
                required      :      Boolean
              }/// shift object
            ],/// shifts array

            applications:[ applicationSchema ]//// application array

          }//// position.varients[] object

        ],//// vairants araay
      } //// position object
    ] /// position array
  }///location object
  ],///locations array

});


var BusinessModel = mongoose.model('Business', businessSchema, "businessModel");

module.exports = BusinessModel;
