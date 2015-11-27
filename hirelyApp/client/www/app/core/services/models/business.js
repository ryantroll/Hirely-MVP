/**
 *
 * Business Model
 * --- Photo Model
 *
 * Job Model
 *
 * */

Business = Model({

  initialize: function (name, description, admin, type, active, placeId, website){
    this.name = name;
    this.description = description;
    this.admin = admin
    this.type = type;
    this.active = active;
    this.placeId = placeId;
    this.website = website;
  },

  toString: function(){
    return "My unique email is "+ this.email+ " and my name is " + this.firstName;
  }
});


Photo = Model({
  initialize: function (url, main){
    this.url = url;
    this.main = main;
  }
});


Job = Model({
  initialize: function (businessId, hiringManager, position, occupationId, description, createdAt, updatedAt, available){
    this.businessId = businessId;
    this.hiringManager = hiringManager;
    this.position = position;
    this.occupationId = occupationId;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.available = available;
  }
});
