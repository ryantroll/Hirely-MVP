/**
 *
 * Generic Address Model Used for Business and Users
 *
 * Our address model is based on: https://developers.google.com/maps/documentation/geocoding/intro?csw=1#Types
 *
 * */

Address = Model({
  initialize: function (formattedAddress, zipCode, unit, street, city, state, lng, lat){
    this.formattedAddress = formattedAddress;
    this.zipCode = zipCode;
    this.street = street;
    this.unit = unit;
    this.city = city;
    this.state = state;
    this.lng = lng;
    this.lat = lat;
  }
});