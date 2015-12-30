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
    if(profileImageUrl) this.profileImageUrl = profileImageUrl;
    if(personalStatement) this.personalStatement = personalStatement;
    if(provider) this.provider = provider;
    this.createdOn = createdOn;
    this.lastModifiedOn = lastModifiedOn;
    if(address) this.address = address;
    if(experience) this.experience = experience;
    if(education) this.education = education;
    if(mobile) this.mobile = mobile;
  },

  toString: function(){
    return "My unique email is "+ this.email +" and my name is " + this.firstName;
  }

});


Education = Model({

  initialize: function (programType, institutionName, degree, city, state,
                        startMonth, startYear, endMonth, endYear, current) {

    if(programType) this.programType = programType;
    if(institutionName) this.institutionName = institutionName;
    if(degree) this.degree = degree;
    if(city) this.city = city;
    if(state) this.state = state;
    if(startMonth) this.startMonth = startMonth;
    if(startYear) this.startYear = startYear;
    if(endmOnth) this.endMonth = endMonth;
    if(endYear) this.endYear = endYear;
    if(current) this.current = current;
  }

});

Experience = Model({

  initialize: function (position, employer, empolyerPlaceId, city, state,
                        startMonth, startYear, endMonth, endYear, current, accomplishments) {

    if(position) this.position = position;
    if(employer) this.employer = employer;
    if(empolyerPlaceId) this.empolyerPlaceId = empolyerPlaceId;
    if(city) this.city = city;
    if(state) this.state = state;
    if(startMonth) this.startMonth = startMonth;
    if(startYear) this.startYear = startYear;
    if(endMonth) this.endMonth = endMonth;
    if(endYear) this.endYear = endYear;
    if(current) this.current = current;
    if(accomplishments) this.accomplishments = accomplishments;
  }

});

Address = Model({

  initialize: function (formattedAddress, zipCode, unit, number, street, city, state, country, lng, lat) {
    if(formattedAddress) this.formattedAddress = formattedAddress;
    if(zipCode) this.zipCode = zipCode;
    if(unit) this.unit = unit;
    if(number) this.number = number;
    if(street) this.street = street;
    if(city) this.city = city;
    if(state) this.state = state;
    if(country) this.country = country;
    if(lng && lat){
        this.lng = lng;
        this.lat = lat;
    }
  }

});
