/**
 * Created by: Iyad Bitar 12/31/2015
 * Generic Job Application object
 *
 * */

JobApplication = Model({
  initialize: function (userId, variantId, status, prescreenAnswers){
    if(userID) this.userID = userID;
    if(variantId) this.variantId = variantId;
    if(prescreenAnswers) this.prescreenAnswers = prescreenAnswers;

  }
});