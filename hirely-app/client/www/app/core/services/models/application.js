/**
 * Created by: Iyad Bitar 12/31/2015
 * Generic Job Application object
 *
 * */

JobApplication = Model({
  initialize: function (userId, positionId, status, prescreenAnswers){
    if(userId) this.userId = userId;
    if(positionId) this.positionId = positionId;
    if(undefined !== status) this.status = status;
    if(prescreenAnswers) this.prescreenAnswers = prescreenAnswers;

  }
});