/**
 * Created by: Iyad Bitar 12/31/2015
 * Generic Job Application object
 *
 * */

JobApplication = Model({
  initialize: function (startDate, minHours, maxHours){
    // if(userID) this.userID = userID;
    // if(jobID) this.jobID = jobID;

    /**
     * [startDate will be sent as date object and will be saved as number of milisecond
     * to keep timestamp consistant with Firebase timestamp]
     * @type {[Date]}
     */
    if(startDate) this.startDate = startDate.getTime();
    if(maxHours) this.maxHours = maxHours;
    if(minHours) this.minHours = minHours;
  }
});