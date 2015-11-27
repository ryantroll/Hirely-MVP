/**
 *
 * User Model
 *
 * Experience Model
 *
 * Education Model
 *
 * */


User = Model({

  initialize: function (userName, firstName, lastName, email, userType,
                        profileImageUrl, personalStatement,
                        provider, createdOn, lastModifiedOn, address) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.userType = userType;
    this.profileImageUrl = profileImageUrl;
    this.personalStatement = personalStatement;
    this.provider = provider;
    this.createdOn = createdOn;
    this.lastModifiedOn = lastModifiedOn;
    this.address = address;
  },

  toString: function(){
    return "My unique email is "+ this.email+ " and my name is " + this.firstName;
  }

});


Education = Model({

  initialize: function (programType, institutionName, degree, city, state,
                        startMonth, startYear, endMonth, endYear, current) {
    this.programType = programType;
    this.institutionName = institutionName;
    this.degree = degree;
    this.city = city;
    this.state = state;
    this.startMonth = startMonth;
    this.startYear = startYear;
    this.endMonth = endMonth;
    this.endYear = endYear;
    this.current = current;
  }

});

Experience = Model({

  initialize: function (position, employer, empolyerPlaceId, city, state,
                        startMonth, startYear, endMonth, endYear, current, accomplishments) {
    this.position = position;
    this.employer = employer;
    this.empolyerPlaceId = empolyerPlaceId;
    this.city = city;
    this.state = state;
    this.startMonth = startMonth;
    this.startYear = startYear;
    this.endMonth = endMonth;
    this.endYear = endYear;
    this.current = current;
    this.accomplishments = accomplishments;
  }

});
