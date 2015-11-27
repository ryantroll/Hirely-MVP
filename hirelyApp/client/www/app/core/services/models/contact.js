/**
 *
 * Generic Contact Model Used for Business and Users
 *
 * */

Contact = Model({
  initialize: function (email, mobile, phone, other){
    this.email = email;
    this.mobile = mobile;
    this.phone = phone;
    this.other = other;
  }
});