/**
 * Created by: Iyad Bitar 12/31/2015
 * Generic Job Application object
 *
 * */

JobApplication = Model({
  initialize: function (userId, variantId, status, prescreenAnswers){
    if(userId) this.userId = userId;
    if(variantId) this.variantId = variantId;
    if(undefined !== status) this.status = status;
    if(prescreenAnswers) this.prescreenAnswers = prescreenAnswers;

  }
});