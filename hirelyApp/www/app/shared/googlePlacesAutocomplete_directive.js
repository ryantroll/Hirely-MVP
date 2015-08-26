'use strict';
angular.module("hirelyApp.shared").directive('ngAutocomplete', ['GeocodeService', '$parse', function(GeocodeService, $parse) {

    return {
        scope: {
            details: '=',
            ngAutocomplete: '=',
            options: '=',
            onPlaceChanged: '&'
        },
        link: function(scope, element, attrs, model) {

            //options for autocomplete
            var opts

            //convert options provided to opts
            var initOpts = function() {
                opts = {}
                if (scope.options) {
                    if (scope.options.types) {
                        opts.types = []
                        opts.types.push(scope.options.types)
                    }
                    if (scope.options.bounds) {
                        opts.bounds = scope.options.bounds
                    }
                    if (scope.options.country) {
                        opts.componentRestrictions = {
                            country: scope.options.country
                        }
                    }
                }
            }
            initOpts();

            var getCurrentLocation = function(){

                var currentLocation = GeocodeService.getPlace();
                if(currentLocation)
                {
                    scope.$apply(function() {
                        scope.details = currentLocation;
                        scope.ngAutocomplete = currentLocation.formatted_address;
                    });

                }
            };


            //create new autocomplete
            //reinitializes on every change of the options provided
            var newAutocomplete = function() {
                scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
                google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                    scope.$apply(function() {
//              if (scope.details) {
                        scope.details = scope.gPlace.getPlace();
//              }
                        scope.ngAutocomplete = element.val();

                    });
                    if(scope.onPlaceChanged){
                        scope.onPlaceChanged();

                    }
                })
            }
            newAutocomplete();
            //getCurrentLocation();

            //watch options provided to directive
            scope.watchOptions = function () {
                return scope.options
            };
            scope.$watch(scope.watchOptions, function () {
                initOpts()
                newAutocomplete()
                element[0].value = '';
                scope.ngAutocomplete = element.val();
            }, true);

            scope.$on('currentPlaceChanged', function (event, args) {
                scope.details = args.message;
                scope.ngAutocomplete = args.message.formatted_address;
            });

        }
    }
}]);
