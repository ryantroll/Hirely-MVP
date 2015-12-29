/**
 *
 * User Model
 * -- Experience Model
 * -- Education Model
 *
 * */


User = Model({

  initialize: function (firstName, lastName, email, userType,
                        profileImageUrl, personalStatement,
                        provider, createdOn, lastModifiedOn , address , experience , education, mobile) {

    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.userType = userType;
    this.profileImageUrl = profileImageUrl || false;
    this.personalStatement = personalStatement || false;
    this.provider = provider;
    this.createdOn = createdOn;
    this.lastModifiedOn = lastModifiedOn;
    this.address = address || false ;
    this.experience = experience || false ;
    this.education = education || false;
    this.mobile = mobile || false;
  },

  toString: function(){
    return "My unique email is "+ this.email +" and my name is " + this.firstName;
  }

});


Education = Model({

  initialize: function (programType, institutionName, degree, city, state,
                        startMonth, startYear, endMonth, endYear, current) {
    this.programType = programType || '';
    this.institutionName = institutionName || '';
    this.degree = degree || '';
    this.city = city || '';
    this.state = state || '';
    this.startMonth = startMonth || '';
    this.startYear = startYear || '';
    this.endMonth = endMonth || '';
    this.endYear = endYear || '';
    this.current = current || '';
  }

});

Experience = Model({

  initialize: function (position, employer, empolyerPlaceId, city, state,
                        startMonth, startYear, endMonth, endYear, current, accomplishments) {
    this.position = position || '';
    this.employer = employer || '';
    this.empolyerPlaceId = empolyerPlaceId || '';
    this.city = city || '';
    this.state = state || '';
    this.startMonth = startMonth || '';
    this.startYear = startYear || '';
    this.endMonth = endMonth || '';
    this.endYear = endYear || '';
    this.current = current || '';
    this.accomplishments = accomplishments || '';
  }

});

Address = Model({

  initialize: function (formattedAddress, zipCode, unit, number, street, city, state, country, lng, lat) {
    this.formattedAddress = formattedAddress || false;
    this.zipCode = zipCode || false;
    this.unit = unit || false;
    this.number = number || false;
    this.street = street || false;
    this.city = city || false;
    this.state = state || false;
    this.country = country || false;
    this.lng = lng || false;
    this.lat = lat || false;
  }

});
