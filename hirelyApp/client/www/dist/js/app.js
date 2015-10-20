'use strict';

var myApp = angular.module('hirelyApp',
    [   
        'uiGmapgoogle-maps',
        'ui.router',
        'ui.bootstrap',
        'ui.grid',
        'uiGmapgoogle-maps',
        'firebase',
        'ngMask',
        'ng-currency',
        'rzModule',
        'angular-flexslider',
        'ui-notification',
        'hirelyApp.layout',
        'hirelyApp.home',
        'hirelyApp.shared',
        'hirelyApp.job',
        'hirelyApp.jobdetails',
        'hirelyApp.core',
        'hirelyApp.account',
        'hirelyApp.candidate',
        'hirelyApp.manager'
    ])



    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: 'app/layout/master.html'
            })
            .state('app.home', {
                url: '/home',
                parent: 'app',
                templateUrl: 'app/home/home.html',

                controller: 'HomeCtrl'
            })
            .state('app.login', {
                url: '/login',
                templateUrl: 'app/account/login.html',
                controller: 'LoginCtrl'
            })
            .state('app.job', {
                url: '/job?placeId&distance&occupationId&wage',
                parent: 'app',
                templateUrl: 'app/job/job-search.html',
            })
            .state('app.jobdetails', {
                url: '/jobdetails?siteId&positionId&placeId',
                templateUrl: 'app/jobdetails/jobDetails.html',
            })
            .state('app.register', {
                url: '/register',
                templateUrl: 'app/account/register.html',
                controller: 'RegisterCtrl'
            })
             .state('app.hmregister', {
                url: '/hmregister',
                templateUrl: 'app/manager/hmRegister.html',
                controller: 'HMRegisterCtrl'
            })
            .state('app.busDashboard', {
                url: '/busDashboard',
                templateUrl: 'app/manager/hmDashboard.html',
                controller: 'HMRegisterCtrl'
            })
            .state('app.hmPosition', {
                url: '/hmPosition',
                templateUrl: 'app/manager/hmPosition.html',
                controller: 'HMRegisterCtrl'
            })
            .state('app.hmHiring', {
                url: '/hmHiring',
                templateUrl: 'app/manager/hmHiring.html',
                controller: 'HMRegisterCtrl'
            })
            .state('app.candidate', {
                url: '/candidate',
                abstract: true,
                templateUrl: 'app/candidate/candidate.html',
                authRequired: true,
                controller: 'CandidateCtrl'
            })
            .state('app.candidate.dashboard', {
                url: '/dashboard',
                templateUrl: 'app/candidate/candidate-dashboard.html',
                controller: 'CandidateDashboardCtrl',
                authRequired: true
            })
            .state('app.candidate.profile', {
                abstract: true,
                url: '/profile',
                templateUrl: 'app/candidate/profile/candidate-profile.html',
                controller: 'CandidateProfileCtrl',
                authRequired: true,
                resolve: {
                    profile: function ($q, CandidateService, UserService) {
                        //retrieve profile before loading
                        var user = UserService.getCurrentUser();
                        return CandidateService.getProfile(user.userId).then(function(profile) {

                           return profile;
                        }, function(err) {
                            deferred.reject(err);
                        });

                    }
                }
            })
            .state('app.candidate.profile.basics', {
                url: '/basics',
                templateUrl: 'app/candidate/profile/candidate-profile-basics.html',

                controller: 'CandidateProfileBasicsCtrl',
                authRequired: true
            })
            .state('app.candidate.profile.availability', {
                url: '/Availability',
                templateUrl: 'app/candidate/profile/candidate-profile-availability.html',
                authRequired: true
            })
            .state('app.candidate.profile.experience', {
                url: '/Experience',
                templateUrl: 'app/candidate/profile/candidate-profile-experience.html',
                authRequired: true
            })
            .state('app.candidate.profile.personality', {
                url: '/Personality',
                templateUrl: 'app/candidate/profile/candidate-profile-personality.html',
                authRequired: true
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });

/**
 * Created by labrina.loving on 8/8/2015.
 */
(function() {
    'use strict';

    angular.module('hirelyApp.account', []);
})();
/**
 * Created by labrina.loving on 8/5/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('LoginCtrl', ['$scope','$stateParams','$modalInstance', 'AuthService', LoginCtrl ]);


    function LoginCtrl($scope, $stateParams, $modalInstance, AuthService) {
        var authService = AuthService;
        var vm = this;
        $scope.error = '';
        $scope.user = {email: '', password:''};

        vm.FbLogin = function(){
           authService.thirdPartyLogin('facebook')
               .then(function(data){
                   $modalInstance.close();

               }, function(err) {

                   $scope.error = errMessage(err);
               }
           );

        };

        vm.GoogleLogin = function(){
            authService.thirdPartyLogin('google')
                .then(function(data){
                    $modalInstance.close();

                }, function(err) {

                    $scope.error = errMessage(err);
                }
            );

        };

        vm.PasswordLogin = function() {
            authService.passwordLogin($scope.user.email, $scope.user.password)
                .then(function(auth){
                    $modalInstance.close();
                }, function(err) {
                    alert(err)
                });
        };


        vm.CloseModal = function (){
            $modalInstance.close();
        };


    }
})();
/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('RegisterCtrl', ['$scope', '$stateParams', '$modalInstance', 'AuthService', 'UserService', RegisterCtrl ]);

    function RegisterCtrl($scope, $stateParams, $modalInstance, AuthService, UserService) {

        var vm = this;
        var authService = AuthService;
        var userService = UserService;
        $scope.error = '';
        $scope.user = {email: '', password: '', firstName: '', lastName: ''}

        vm.FbRegister = function () {

            registerThirdPartyUser('facebook')
        }

        vm.GoogleRegister = function () {

            registerThirdPartyUser('google')
        }

        vm.TwitterRegister = function () {

            registerThirdPartyUser('twitter')
        }

        vm.registerNewUser = function() {
            registerPasswordUser($scope.user)
        }

        vm.CloseModal = function (){
            $modalInstance.close();
        }

        //this function registers user in 3rd party and
        //and then creates Firebase db
        function registerThirdPartyUser(provider, scope) {
            authService.thirdPartyLogin(provider, scope)
                .then(function(user) {
                    userService.createUserfromThirdParty(provider, user)
                        .then(function(fbUser){
                            userService.setCurrentUser(fbUser, provider.uid);
                            $modalInstance.close();
                        }, function(err) {
                            alert(err)
                        });
                }, function(err) {
                    alert(err)
                })
        }

        function registerPasswordUser(registeredUser){
            //register new user
            authService.registerNewUser(registeredUser.email, registeredUser.password)
                .then(function(user) {
                    userService.createRegisteredNewUser(registeredUser, user.uid)
                        .then(function(newUser){
                            authService.passwordLogin(registeredUser.email, registeredUser.password)
                                .then(function(auth){
                                    userService.setCurrentUser(newUser, user.uid);
                                    $modalInstance.close();
                                }, function(err) {
                                    alert(err)
                                });
                        }, function(err) {
                            alert(err)
                        });
                }, function(err) {
                    alert(err)
                })

        }


    }




})();

/**
 * Created by labrina.loving on 8/16/2015.
 */

(function() {
    'use strict';

    angular.module('hirelyApp.candidate', []);
})();

/**
 * Created by labrina.loving on 8/26/2015.
 **/

(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateCtrl', ['$scope','$stateParams', 'UserService', CandidateCtrl ]);


    function CandidateCtrl($scope, $stateParams, UserService) {
        var userService = UserService;
        var vm = this;

        $scope.user = userService.getCurrentUser();



        //listen for changes to current user
        $scope.$on('currentUserChanged', function (event, args) {
            $scope.user = args.message;


        });
    }
})()
;


/**
 * Created by labrina.loving on 8/16/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateDashboardCtrl', ['$scope','$stateParams', CandidateDashboardCtrl ]);


    function CandidateDashboardCtrl($scope, $stateParams) {

        var vm = this;
        $scope.uiGridOptions  = {
            data: 'recentApps',
            columnDefs: [{
                field: 'company'
            }, {
                field: 'position'
            }, {
                field: 'application date'
            },
                {
                    field: 'current status'
                }
            ]
        };

        $scope.recentApps = [];

        if($scope.user.Applications){
            $scope.recentApps = $scope.user.Applications;
        }

        // Chart.js Data
        $scope.data = [
            {
                value: 5,
                color:'#FFA540',
                highlight: '#BF7C30',
                label: 'Review'
            },
            {
                value: 2,
                color: '#38A2D0',
                highlight: '#5AD3D1',
                label: 'Interview Scheduled '
            },
            {
                value: 1,
                color: '#37DB79',
                highlight: '#FFC870',
                label: 'Passed'
            }
        ];

        // Chart.js Options
        $scope.options =  {

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke : true,

            //String - The colour of each segment stroke
            segmentStrokeColor : '#fff',

            //Number - The width of each segment stroke
            segmentStrokeWidth : 2,

            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout : 50, // This is 0 for Pie charts

            //Number - Amount of animation steps
            animationSteps : 100,

            //String - Animation easing effect
            animationEasing : 'easeOutBounce',

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate : true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale : false,

            showLegend: false

          };



    }
})()
;

/**
 * Created by labrina.loving on 9/7/2015.
 */
(function() {
    'use strict';

    angular
        .module('hirelyApp.core')

        .config(function(uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                key: '711561845732-pg1q3d3cn30f4jk07bmqno9qeio7unmg.apps.googleusercontent.com',
                v: '3.20', //defaults to latest 3.X anyhow
                libraries: 'weather,geometry,visualization'
            });
        })
        .config(function(NotificationProvider) {
            NotificationProvider.setOptions({
                delay: 5000,
                startTop: 80,
                startRight: 20,
                verticalSpacing: 20,
                horizontalSpacing: 20,
                positionX: 'left',
                positionY: 'top'
            });
    });
})();
/**
 * Created by labrina.loving on 8/8/2015.
 */
(function() {
    'use strict';

    angular
        .module('hirelyApp.core')
        // version of this seed app is compatible with angularFire 0.6
        // see tags for other versions: https://github.com/firebase/angularFire-seed/tags
        .constant('version', '0.6')

        // where to redirect users if they need to authenticate (see module.routeSecurity)
        .constant('loginRedirectPath', 'app.home')

        // your Firebase URL goes here
        .constant('FBURL', 'https://shining-torch-5144.firebaseio.com')

        .constant('GOOGLEMAPSURL', 'https://maps.google.com/maps/api/geocode/json?latlng={POSITION}&sensor=false')

        .constant('filePickerKey', 'AALU2i7ySUuUi8XUDHq8wz')

        .constant('GOOGLEMAPSSERVERKEY', 'AIzaSyDoM7YVRZsYdeoJ3XezTX-l_eCgFz2EqfM')

        .constant('GOOGLEPLACESURL', 'https://maps.googleapis.com/maps/api/place/details/json?placeid={PLACEID}&key={KEY}')

        .constant('candidateStatus', {1: 'Active', 2: 'Employed', 3: 'Inactive'})
})();
/**
 * Created by labrina.loving on 8/8/2015.
 */
(function() {
    'use strict';

    angular.module('hirelyApp.core', []);
})();

/**
 * Created by labrina.loving on 8/10/2015.
 */

// a simple wrapper on Firebase and AngularFire to simplify deps and keep things DRY
angular.module('hirelyApp.core')
    .factory('fbutil', ['$window', 'FBURL', '$q', function($window, FBURL, $q) {


        var utils = {
            // convert a node or Firebase style callback to a future
            handler: function(fn, context) {
                return utils.defer(function(def) {
                    fn.call(context, function(err, result) {
                        if( err !== null ) { def.reject(err); }
                        else { def.resolve(result); }
                    });
                });
            },

            // abstract the process of creating a future/promise
            defer: function(fn, context) {
                var def = $q.defer();
                fn.call(context, def);
                return def.promise;
            },

            ref: firebaseRef
        };

        return utils;

        function pathRef(args) {
            for (var i = 0; i < args.length; i++) {
                if (angular.isArray(args[i])) {
                    args[i] = pathRef(args[i]);
                }
                else if( typeof args[i] !== 'string' ) {
                    throw new Error('Argument '+i+' to firebaseRef is not a string: '+args[i]);
                }
            }
            return args.join('/');
        }

        /**
         * Example:
         * <code>
         *    function(firebaseRef) {
         *       var ref = firebaseRef('path/to/data');
         *    }
         * </code>
         *
         * @function
         * @name firebaseRef
         * @param {String|Array...} path relative path to the root folder in Firebase instance
         * @return a Firebase instance
         */
        function firebaseRef(path) {
            var ref = new $window.Firebase(FBURL);
            var args = Array.prototype.slice.call(arguments);
            if( args.length ) {
                ref = ref.child(pathRef(args));
            }
            return ref;
        }
    }]);


/**
 * Created by labrina.loving on 8/9/2015.
 */
(function (angular) {
    "use strict";

      var securedRoutes = [];

    angular.module('hirelyApp.core')

    /**
     * Apply some route security. Any route's resolve method can reject the promise with
     * { authRequired: true } to force a redirect. This method enforces that and also watches
     * for changes in auth status which might require us to navigate away from a path
     * that we can no longer view.
     */
         .run(['$rootScope', '$state', 'AuthService', 'UserService', 'loginRedirectPath',
            function ($rootScope, $state, AuthService, UserService, loginRedirectPath) {
                // watch for login status changes and redirect if appropriate
                AuthService.AuthRef().$onAuth(check);

                // some of our routes may reject resolve promises with the special {authRequired: true} error
                // this redirects to the login page whenever that is encountered
                $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
                    if (error === "AUTH_REQUIRED") {
                        $state.go(loginRedirectPath);
                    }
                });

                $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
                    AuthService.AuthRef().$onAuth(check);
                    if (toState.authRequired && !UserService.getIsLoggedIn()){
                        // User isn’t authenticated
                        $state.transitionTo(loginRedirectPath);
                        event.preventDefault();
                    }
                });



                function check(user) {
                    if (!user && $state.current.authRequired) {
                         $state.go(loginRedirectPath);
                    }
                }

            }
        ]);

})(angular);


/**
 * Created by labrina.loving on 9/7/2015.
 */

/**
 * Created by labrina.loving on 8/5/2015.
 */

(function() {
    'use strict';

    angular.module('hirelyApp.home', []);
})();


(function () {
    'use strict';

    angular.module('hirelyApp.home').controller('HomeCtrl', ['$scope', '$state', '$stateParams', 'GeocodeService', HomeCtrl ]);

    function HomeCtrl ($scope, $state, $stateParams, GeocodeService, $window) {
        var geocodeService = GeocodeService;

        $scope.flexSliderOptions = {
            animation: "fade",
            directionNav: false,
            controlNav: false,
            slideshowSpeed: 10000
        };

        $scope.results = '';
        $scope.options = {
            types: '(regions)'
        };
        $scope.details = '';

        var place = geocodeService.getPlace();
        if(place){

            $scope.results = place.formatted_address;
            $scope.details = place;
        }

        $scope.getResults = function() {
            geocodeService.setPlace($scope.details);
            $state.go('app.job', {placeId: $scope.details.place_id})

        };
    }
})();

/**
 * Created by mike.baker on 8/10/2015.
 */

(function() {
    'use strict';

    angular.module('hirelyApp.job', []);
})();


/**
 * Created by mike.baker on 8/9/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.job').controller('JobSearchCtrl', ['$scope', '$http', '$state', '$stateParams',
        'FBURL', 'PositionService', 'GeocodeService', 'OccupationService','UserService', 'CandidateService','Notification', 'uiGmapGoogleMapApi', 'uiGmapIsReady', JobSearchCtrl]);



  function JobSearchCtrl($scope, $http, $state, $stateParams, FBURL, PositionService, GeocodeService, OccupationService,UserService, CandidateService, Notification, uiGmapGoogleMapApi, uiGmapIsReady) {
      var positionService = PositionService;
      var occupationService = OccupationService;
      var geocodeService = GeocodeService;
      var userService = UserService;
      var candidateService = CandidateService;

      $scope.positions = [];

      $scope.filter = {
          distance: ($stateParams.distance) ? $stateParams.distance : 20,
          minWage: ($stateParams.wage) ? $stateParams.wage : 0,
          occupationId: ($stateParams.occupationId) ? $stateParams.occupationId : '',
          occupation: ''

      };

      $scope.occupation = '';

      $scope.options = {
          types: '(regions)'
      };
      $scope.results = '';
      $scope.details = '';
      $scope.mapmarkers = [];
      $scope.map = '';
      $scope.mapOptions = '';
      $scope.occupations = [];
      $scope.placeId = $stateParams.placeId;


      var getJobs = function() {

          geocodeService.getPlacebyPlaceId($scope.placeId)
              .then(function (place) {
                  if (place) {
                     initializeMap();
                      $scope.results = place.formatted_address;
                      $scope.details = place;
                      //TODO:  move this to a seperate service
                      var firebaseRef = new Firebase(FBURL + '/businessSiteLocation');
                      var geoFire = new GeoFire(firebaseRef);
                      var geoQuery = geoFire.query({
                          center: [$scope.details.geometry.location.lat, $scope.details.geometry.location.lng],
                          radius: $scope.filter.distance * 1.60934
                      });


                      var onKeyEnteredRegistration = geoQuery.on("key_entered", function (key, location, distance) {
                          positionService.getOpenPositionsForLocation(key, $scope.filter.minWage,  $scope.filter.occupationId)
                              .then(function (positions) {
                                  if(positions)
                                  {
                                      angular.forEach(positions, function (openPosition, id) {
                                          $scope.positions.push(createPosition(openPosition, distance, id));
                                          $scope.mapmarkers.push(createMarker(id, location[0], location[1], openPosition.businessSite));
                                      });
                                  }


                          }, function (err) {

                          });
                      });

                      var onKeyExitedRegistration = geoQuery.on("key_exited", function (key, location, distance) {
                          //remove items from position arrray and remove markers
                          var positions = $scope.positions;
                          var markers = $scope.mapmarkers;
                          $scope.positions = _.reject(positions,
                              function (position) {
                                  return position.siteId == key;
                              }
                          );

                          $scope.mapmarkers = _.reject(markers,
                              function (marker) {
                                  return marker["id"] == key;
                              }
                          );
                      });
                  }

              }, function (err) {
                  //TODO:  add error handling
              });
      }


      var getOccupations = function(){
          occupationService.getOccupations().then(function(occupations) {
             $scope.occupations = occupations;
              if($stateParams.occupationId){
                  $scope.filter.occupation = _.findWhere(occupations, {id: $stateParams.occupationId})
              }
          }, function(err) {

          });
      };
      var initializeMap = function(){
          uiGmapGoogleMapApi
              .then(function(maps){
                  $scope.googlemap = {};
                  $scope.map = {
                      center: {
                          latitude: $scope.details.geometry.location.lat,
                          longitude: $scope.details.geometry.location.lng
                      },
                      zoom: 10,
                      pan: 1,
                      options: $scope.mapOptions,
                      control: {},
                      clusterOptions:  {
                          title: 'Hi I am a Cluster!',
                          gridSize: 20,
                          ignoreHidden: true,
                          minimumClusterSize: 1,
                          zoomOnClick: false
                      },
                      events: {
                          tilesloaded: function (maps, eventName, args) {
                          },
                          dragend: function (maps, eventName, args) {
                          },
                          zoom_changed: function (maps, eventName, args) {
                          }
                      }
                  };
              });





          $scope.mapOptions = {
              scrollwheel: false
          };
      }
      var createMarker = function(id, lat, lng, site) {
          var marker = {

                  coords:{
                      latitude: '',
                      longitude: '',
                  },
              businessSite: '',
              photoUrl: '',
              show: false

          };
          var idkey = "id";
          marker[idkey] = id;
          marker.coords.latitude = lat;
          marker.coords.longitude = lng;
          marker.businessSite = site;

        return marker;
      };

      var createPosition = function(openPosition, distance, positionId){
          var position = {
              title: '',
              companyName: '',
              positionId: '',
              siteId: '',
              wage: {
                  amount: '',
                  frequency: ''
              },
              distance: '',
              employmentTypes: '',
              occupationId: '',
              postDate: '',
              photoUrl: ''
          };
          position.companyName = openPosition.business.name;
          position.distance = distance/1.60934;
          position.employmentTypes = openPosition.position.employmentTypes;
          position.status = openPosition.position.status;
          position.title = openPosition.position.title;
          position.wage = openPosition.position.compensation.wage.maxAmount ? getMaxWageDisplay(openPosition.position.compensation.wage) : getnoMaxWageDisplay(openPosition.position.compensation.wage);
          position.siteId = openPosition.siteId;
          position.positionId = positionId;
          position.occupationId = openPosition.position.occupation;
          position.postDate = openPosition.postDate;
          var defaultPhoto = _.matcher({main: "true"});
          var photo =  _.filter(openPosition.businessPhotos, defaultPhoto);
          if(photo){
             position.photoUrl = photo[0].source;
          }

          return position;
      }

      var getMaxWageDisplay = function(wage)
      {
          return  wage.minAmount + '-' + wage.maxAmount + ' /' + wage.frequency;
      }

      var getnoMaxWageDisplay = function(wage)
      {

          return  wage.minAmount + '+' + ' /' + wage.frequency;
      }

      $scope.getJobsbyLocation = function(details){
          $scope.details = details;
          $scope.searchJobs();
      }

      $scope.getJobsbyOccupation = function(item, model, label){
         $scope.filter.occupationId = item.id;
          $scope.filter.occupation = item;
          $scope.searchJobs();

      }

      $scope.searchJobs = function(){
          $state.go('app.job', {placeId: $scope.details.place_id, wage: $scope.filter.minWage, occupationId: $scope.filter.occupationId, distance: $scope.filter.distance })
      }

      $scope.addToFavorites = function(positionId){
         var user = userService.getCurrentUser();
         candidateService.savePositiontoFavorites(user.userId, positionId);
          Notification.success('Job Added to Favorites');
      }

      var initialize = function(){
          getJobs();
          getOccupations();

      };


      //initialize controller
      initialize();
}

 })();

/**
 * Created by labrina.loving on 8/6/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('FooterCtrl', ['$stateParams', FooterCtrl ]);

    function FooterCtrl($stateParams) {


    };
})();
/**
 * Created by labrina.loving on 8/6/2015.
 */
angular.module("hirelyApp.layout").directive("footer", function() {
    return {
        restrict: 'A',
        templateUrl: 'app/layout/footer.html',
        scope: true,
        transclude : false
    };
});
/**
 * Created by labrina.loving on 8/6/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('HeaderCtrl', ['$stateParams', '$scope', '$modal', '$log', 'AuthService', HeaderCtrl ]);

    function HeaderCtrl($stateParams, $scope, $modal, $log, AuthService) {

        //region Scope variables
        $scope.currentUser = $scope.$parent.currentUser;
        //endregion

        var vm = this;
        var authService = AuthService;

        //listen for changes to current user
        $scope.$on('currentUserChanged', function (event, args) {
            $scope.currentUser = args.message;
        });


        //region Controller Functions
        vm.login = function() {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/login.html',
                controller: 'LoginCtrl as vm',
                resolve: {
                    items: function () {

                    }
                }
            });
        };

        vm.register = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/register.html',
                controller: 'RegisterCtrl as vm'
            });
        };

        vm.hmregister = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/manager/hmRegister.html',
                controller: 'HMRegisterCtrl as vm',
                
            });
        };

        vm.logout = function(){
            authService.logout();
        };

        //endregion

    };
})();
/**
 * Created by labrina.loving on 8/6/2015.
 */
angular.module("hirelyApp.layout").directive("header", function() {
    return {
        restrict: 'A',
        templateUrl: 'app/layout/header.html',
        controller: 'HeaderCtrl',
        scope: true,
        transclude : false
    };
});
/**
 * Created by labrina.loving on 8/6/2015.
 */
(function() {
    'use strict';

    angular.module('hirelyApp.layout', []);
})();
/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('MasterCtrl', ['$stateParams', '$scope', '$modal', '$log', '$q', '$window', 'AuthService', 'UserService', 'GeocodeService', MasterCtrl ]);

    function MasterCtrl($stateParams, $scope, $modal, $log, $q, $window, AuthService, UserService, GeocodeService) {

        var vm = this;
        var geocodeService = GeocodeService;

        //$scope.userType = "visitor";
        //$scope.userType = "hiring-manager-nav";
        $scope.userType = "candidate-nav";

        $scope.authRef = AuthService.AuthRef();
        $scope.userService = UserService;
        $scope.currentUser = null;
        $scope.location = {};
        $scope.currentPlace = null;


        //
        $window.navigator.geolocation.getCurrentPosition(function(position){

            var lat = position.coords.latitude;
            var long = position.coords.longitude;

            $scope.$apply(function() {
                    $scope.location.latitude = lat;
                    $scope.location.longitude = long;
                    if(lat && long)
                    {
                        geocodeService.getPlacebyLatLong(lat, long)
                            .then(function(place) {
                                if(place){
                                    $scope.currentPlace = place;
                                    $scope.$broadcast('currentPlaceChanged', { message: place });
                                }
                            }, function(err) {
                                deferred.reject(err);
                            });
                    }

                }
            )
        });

        // any time auth status updates, add the user data to scope
        $scope.authRef.$onAuth(function(authData) {
            if(authData)
            {
                if(!$scope.currentUser) {
                    //try to retrieve user
                    $scope.userService.getUserByKey(authData.uid)
                        .then(function (snapshot) {
                            var exists = (snapshot.val() != null);
                            if (exists) {
                                $scope.userService.setCurrentUser(snapshot.val(), snapshot.key());
                                $scope.userService.setIsLoggedIn(true);
                            }

                        }, function (err) {

                        });
                }
            }
            else
            {
                $scope.userService.setIsLoggedIn(false);

            }
        });

        //watch for user auth changes, if changed broadcast to pages
        $scope.$watch('userService.getCurrentUser()', function (newVal) {
            $scope.$broadcast('currentUserChanged', { message: newVal });
            $scope.currentUser = newVal;

        },true);

        $scope.slideout = new Slideout({
            'panel': document.getElementById('hirely-content'),
            'menu': document.getElementById('mobile-nav'),
            'padding': 256,
            'tolerance': 70
        });

        var open = false;
        $scope.toggleMobileNav = function () {
            if(!open){
                $('.lines-button').addClass('open');
                open = true;
            } else {
                $('.lines-button').removeClass('open');
                open = false;
            }
            $scope.slideout.toggle();
        }

        $(window).resize(function(){
            $('.lines-button').removeClass('open');
            open = false;
            $scope.slideout.close();
        });


        var authService = AuthService;

        //listen for changes to current user
        $scope.$on('currentUserChanged', function (event, args) {
            $scope.currentUser = args.message;
        });


        //region Controller Functions
        vm.login = function() {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/login.html',
                controller: 'LoginCtrl as vm',
                resolve: {
                    items: function () {

                    }
                }
            });
        };

        vm.register = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/register.html',
                controller: 'RegisterCtrl as vm'
            });
        };

        vm.hmregister = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/manager/hmRegister.html',
                controller: 'HMRegisterCtrl as vm',

            });
        };

        vm.logout = function(){
            authService.logout();
        };
    };
})();
/**
 * Created by mike.baker on 9/29/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.manager').controller('HMRegisterCtrl', ['$scope', '$state', '$firebaseObject', '$firebaseArray', 'FBURL', 'AuthService', 'UserService', 'BusinessService',  HMRegisterCtrl ]);
   

    function HMRegisterCtrl($scope, $state, $firebaseObject, $firebaseArray, FBURL, AuthService, UserService, BusinessService) {

        var vm = this;
        var authService = AuthService;
        var userService = UserService;
        var businessService = BusinessService;
        var managerId = '';
        var businessRef = new Firebase(FBURL + '/businessSite');
        var photoRef = new Firebase(FBURL + '/businessPhotos');
       
        $scope.companies = $firebaseArray(businessRef);
        $scope.picturesRef = $firebaseArray(photoRef);
        $scope.split_jobs = [['job1', 'job2', 'job3'], ['job5', 'job6', 'job7']];
    
        $scope.street_number = '';
        $scope.route = '';
        $scope.locality = '';
        $scope.administrative_area_level_1 = '';
        $scope.postal_code = '';
        $scope.country = '';
        $scope.latitude = '';
        $scope.longitude = '';
        $scope.open_store_hours0 = '';
        $scope.closed_store_hours0 = '';
        $scope.open_store_hours1 = '';
        $scope.closed_store_hours1 = '';
        $scope.open_store_hours2 = '';
        $scope.closed_store_hours2 = '';
        $scope.open_store_hours3 = '';
        $scope.closed_store_hours3 = '';
        $scope.open_store_hours4 = '';
        $scope.closed_store_hours4 = '';
        $scope.open_store_hours5 = '';
        $scope.closed_store_hours5 = '';
        $scope.open_store_hours6 = '';
        $scope.closed_store_hours6 = '';
        $scope.error = '';

        $scope.manager = {email: '', password: '', firstName: '', lastName: ''}
        $scope.business = {name: '', description: '', status: '', street_number: $scope.street_number, route: $scope.route, locality: $scope.locality, administrative_area_level_1: $scope.administrative_area_level_1, 
        postal_code: '', country: '', latitude: '', longitude: '', webaddress: '', open_store_hours0: '', 
        closed_store_hours0: '', open_store_hours1: '', closed_store_hours1: '', open_store_hours2: '', closed_store_hours2: '', 
        open_store_hours3: '', closed_store_hours3: '', open_store_hours4: '', closed_store_hours4: '', open_store_hours5: '', 
        closed_store_hours5: '', open_store_hours6: '', closed_store_hours6: ''}




       $scope.options = {
          types: '(regions)'
       };

       $scope.results = '';
       $scope.details = '';
    
        vm.registerNewHMBUS = function() {
            registerPasswordHM($scope.manager, $scope.business)
        }
       
        vm.CloseModal = function (){
            $modalInstance.close();
        }

        function registerPasswordHM(registeredUser, newbusinessObj){
            //register new hiring manager
            authService.registerNewUser(registeredUser.email, registeredUser.password)
                .then(function(manager) {
                    userService.createRegisteredNewUser(registeredUser, manager.uid)
                        .then(function(newUser){
                            authService.passwordLogin(registeredUser.email, registeredUser.password)
                                .then(function(auth){
                                    managerId = manager.uid;
                                    userService.setCurrentUser(newUser, manager.uid);
                                    businessService.createNewBusiness(newbusinessObj, manager.uid);
                                    $modalInstance.close();
                                }, function(err) {
                                    alert(err)
                                });
                        }, function(err) {
                            alert(err)
                        });
                }, function(err) {
                    alert(err)
                })
      $state.go('app.busDashboard');
        }


}


})();

/**
 * Created by mike.baker on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.jobdetails').controller('JobCtrl', ['$scope', '$state', '$stateParams', '$firebaseArray', '$http', 'GeocodeService', 'JobdetailsService', JobCtrl ]);

      function JobCtrl($scope, $state, $stateParams, $firebaseArray, $http, GeocodeService, JobdetailsService) {
           
        var url = 'https://shining-torch-5144.firebaseio.com/jobOpenings';
        var fireRef = new Firebase(url);

        var geocodeService = GeocodeService;
        var jobdetailsService = JobdetailsService;
   

        $scope.jobOpenings = $firebaseArray(fireRef);
		$scope.split_jobs = [['job1', 'job2', 'job3'], ['job5', 'job6', 'job7']];

        $scope.details = geocodeService.getPlace();
        $scope.jobdetails = $scope.jobOpenings;
      

        $scope.setJobResults = function(jobUID) {
             jobdetailsService.setJob(jobUID);
            $state.go('app.jobDetails')

        }

      
 }


})();

/**
 * Created by mike.baker on 9/8/2015.
 */
(function() {
    'use strict';

    angular.module('hirelyApp.manager', []);
})();
    /**
 * Created by labrina.loving on 8/6/2015.
 */
angular.module("hirelyApp.shared").directive('flexslider', function () {

    return {
        restrict: 'A',
        scope: {
            options: '=?'
        },
        link: function (scope, element, attrs) {

            $(element[0]).flexslider(scope.options);
        }
    }
});

'use strict';


angular.module('hirelyApp.core').directive('ngAutocomplete', ['GeocodeService', 'UserService', '$parse', function(GeocodeService, UserService, $parse) {
    return {
        require: 'ngModel',
        scope: {
            ngModel: '=',
            options: '=?',
            details: '=?',
            onPlaceChanged: '&'
        },

        link: function(scope, element, attrs, controller) {

            //options for autocomplete
            var opts
            var watchEnter = false
            //convert options provided to opts
            var initOpts = function() {

                opts = {}
                if (scope.options) {

                    if (scope.options.watchEnter !== true) {
                        watchEnter = false
                    } else {
                        watchEnter = true
                    }

                    if (scope.options.types) {
                        opts.types = []
                        opts.types.push(scope.options.types)
                        scope.gPlace.setTypes(opts.types)
                    } else {
                        scope.gPlace.setTypes([])
                    }

                    if (scope.options.bounds) {
                        opts.bounds = scope.options.bounds
                        scope.gPlace.setBounds(opts.bounds)
                    } else {
                        scope.gPlace.setBounds(null)
                    }

                    if (scope.options.country) {
                        opts.componentRestrictions = {
                            country: scope.options.country
                        }
                        scope.gPlace.setComponentRestrictions(opts.componentRestrictions)
                    } else {
                        scope.gPlace.setComponentRestrictions(null)
                    }
                }
            }

            if (scope.gPlace == undefined) {
                scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
            }
            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                var result = scope.gPlace.getPlace();
                if (result !== undefined) {
                    if (result.address_components !== undefined) {

                        scope.$apply(function() {

                            scope.details = result;

                            controller.$setViewValue(element.val());

                        });
                        scope.onPlaceChanged({details: result});
                    }
                    else {
                        if (watchEnter) {
                            getPlace(result)
                        }
                    }
                }
            })

            //function to get retrieve the autocompletes first result using the AutocompleteService
            var getPlace = function(result) {
                var autocompleteService = new google.maps.places.AutocompleteService();
                if (result.name.length > 0){
                    autocompleteService.getPlacePredictions(
                        {
                            input: result.name,
                            offset: result.name.length
                        },
                        function listentoresult(list, status) {
                            if(list == null || list.length == 0) {

                                scope.$apply(function() {
                                    scope.details = null;
                                });

                            } else {
                                var placesService = new google.maps.places.PlacesService(element[0]);
                                placesService.getDetails(
                                    {'reference': list[0].reference},
                                    function detailsresult(detailsResult, placesServiceStatus) {

                                        if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
                                            scope.$apply(function() {

                                                controller.$setViewValue(detailsResult.formatted_address);
                                                element.val(detailsResult.formatted_address);

                                                scope.details = detailsResult;

                                                //on focusout the value reverts, need to set it again.
                                                var watchFocusOut = element.on('focusout', function(event) {
                                                    element.val(detailsResult.formatted_address);
                                                    element.unbind('focusout')
                                                })

                                            });
                                        }
                                    }
                                );
                            }
                        });
                }
            }

            controller.$render = function () {
                var location = controller.$viewValue;
                element.val(location);
            };


            //watch options provided to directive
            scope.watchOptions = function () {
                return scope.options
            };
            scope.$watch(scope.watchOptions, function () {
                initOpts()
            }, true);

            scope.$on('currentPlaceChanged', function (event, args) {
                scope.details = args.message;
                scope.ngModel = args.message.formatted_address;
            });
        }
    };
}]);
/**
 * Created by labrina.loving on 8/5/2015.
 */
(function() {
    'use strict';

    angular.module('hirelyApp.shared', []);
})();

/**
 * Created by mike.baker on 8/17/2015.
 */

 (function () {
    'use strict';

    angular.module('hirelyApp.jobdetails').controller('JobDetailCtrl', ['$scope', '$state', '$stateParams','PositionService', 'GeocodeService', JobDetailCtrl ]);

    function JobDetailCtrl ($scope, $state, $stateParams, PositionService, GeocodeService) {

        var positionService = PositionService;
        var geocodeService = GeocodeService;
        var params = $stateParams;
        var siteId = $stateParams.siteId;
        var positionId = $stateParams.positionId;
        var placeId = $stateParams.placeId;
        $scope.position = '';
        $scope.wageFormatted = '';
        $scope.hoursFormatted = '';
        $scope.distance = '';
        $scope.photos = [];

        positionService.getPositionbyId(siteId, positionId).then(function (positionObj) {
            var today=new Date();
            $scope.position = positionObj;
            $scope.wageFormatted = positionObj.position.compensation.wage.maxAmount ? getMaxWageDisplay(positionObj.position.compensation.wage) : getnoMaxWageDisplay(positionObj.position.compensation.wage);
            $scope.hoursFormatted =positionObj.position.workHours.max ? positionObj.position.workHours.min + '-' + positionObj.position.workHours.max : positionObj.position.workHours.min + '+'
            var largePhoto = _.matcher({size: "l"});
            var photos =  _.filter(positionObj.businessPhotos, largePhoto);
            angular.forEach(photos, function(photoObj, photoKey) {

                $scope.photos.push(photoObj.source);
            });

           geocodeService.calculateDistancetoSite(siteId, placeId).then(function (distance) {
               $scope.distance = distance;
           }, function (err) {
                //TODO:  add error handling
            });

        }, function (err) {
            //TODO:  add error handling
        });

        var getMaxWageDisplay = function(wage)
        {

            return  numeral(wage.minAmount).format('$0.00') + '-' + numeral(wage.maxAmount).format('$0.00');
        }

        var getnoMaxWageDisplay = function(wage)
        {

            return  numeral(wage.minAmount).format('$0.00') + '+';
        }

    }


})();

 
/**
 * Created by mike.baker on 8/17/2015.
 */

(function() {
    'use strict';

    angular.module('hirelyApp.jobdetails', []);
})();


/**
 * Created by labrina.loving on 9/6/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateProfileAvailabilityCtrl', ['$scope','$state','$stateParams', 'CandidateService', CandidateProfileAvailabilityCtrl ]);


    function CandidateProfileAvailabilityCtrl($scope, $state,$stateParams, CandidateService) {
        var candidateService = CandidateService;
        var schedule ={
            "sunday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "monday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "tuesday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "wednesday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "thursday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "friday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "saturday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            }
        }

        $scope.schedule = schedule;

        if($scope.profile && $scope.profile.availability){
            $scope.schedule = $scope.profile.availability;
        }
        $scope.saveSchedule = function() {
            candidateService.saveAvailability($scope.schedule, $scope.user.providerId);
            $state.go('app.candidate.dashboard');
        }


    }
})()
;




/**
 * Created by labrina.loving on 8/28/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateProfileBasicsCtrl', ['$scope','$state','$stateParams', 'FilePickerService', 'filePickerKey','UserService', 'CandidateService', CandidateProfileBasicsCtrl ]);


    function CandidateProfileBasicsCtrl($scope, $state,$stateParams, FilePickerService, filePickerKey, UserService, CandidateService) {
        var userService = UserService;
        var filePickerService = FilePickerService;
        var candidateService = CandidateService;

        var vm = this;
        $scope.results = '';
        $scope.options = {
            types: '(regions)'
        };
        $scope.details = '';
        $scope.candidate = {authorizedInUS: false};

        if($scope.profile && $scope.profile.candidate){

            $scope.candidate = $scope.profile.candidate;
        }

        filePickerService.setKey(filePickerKey);
        $scope.pickFile = function pickFile(){
            filePickerService.pick(
                {
                    mimetype: 'image/*',
                    services: ['CONVERT', 'COMPUTER', 'FACEBOOK', 'DROPBOX', 'GOOGLE_DRIVE', 'INSTAGRAM', 'WEBCAM'],
                    conversions: ['crop', 'rotate', 'filter']
                },

                onSuccess
            );
        };

        function onSuccess(Blob){
            $scope.user.profileImageUrl = Blob.url;
            $scope.$apply();
        };

        $scope.submitProfile = function() {

            userService.saveUser($scope.user);
            candidateService.saveCandidate($scope.candidate, $scope.user.userId);
            $state.go('app.candidate.profile.experience');
        }
    }
})()
;



/**
 * Created by labrina.loving on 9/6/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateProfileCtrl', ['$scope','$state','$stateParams', 'CandidateService', 'profile', CandidateProfileCtrl ]);


    function CandidateProfileCtrl($scope, $state,$stateParams,CandidateService, profile) {

        var candidateService = CandidateService;

        $scope.profile = profile;


    }
})()
;




/**
 * Created by labrina.loving on 9/28/2015.
 */
/**
 * Created by labrina.loving on 9/6/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateProfileExperienceCtrl', ['$scope','$state','$stateParams', 'CandidateService', 'OccupationService', CandidateProfileExperienceCtrl ]);


    function CandidateProfileExperienceCtrl($scope, $state,$stateParams, CandidateService, OccupationService) {
        var occupationService = OccupationService;
        var candidateService = CandidateService;
        function experienceModel(){
            this.company = {
                place: '',
                name: '',
                result: '',
            }
            this.occupation = '';
            this.location = {
                place: '',
                name: ''
            };
            this.startDate = '';
            this.endDate = '';
            this.currentlyWorking = false;
        }

        $scope.occupation = '';
        $scope.experience = {
        };

        $scope.startDate = '';
        $scope.endDate = ''
        $scope.experiences = [];
        $scope.occupations = [];

        $scope.companyDetails = '';
        $scope.companyResults = '';
        $scope.companyOptions = {
            types:  'establishment'
        };

        $scope.locationDetails = '';
        $scope.locationResults = '';
        $scope.locationOptions = {
            types: '(regions)'
        };

        $scope.addExperience = false;


        $scope.showExperience = function(){
            $scope.addExperience = true;
            $scope.experience = new experienceModel();
        };

        $scope.cancelExperience = function(){
            clearExperience();

        };

        $scope.saveExperience = function(){
            $scope.experience.startDate = $scope.startDate.toJSON();
            if($scope.endDate){
                $scope.experience.endDate = $scope.endDate.toJSON();
            }

            if($scope.companyResults && !$scope.experience.company.name)
            {
                $scope.experience.company.name = $scope.companyResults;
            }

            if($scope.experience.$id)
            {
                $scope.experiences.$save($scope.experience).then(function(ref){
                    clearExperience();

                });
            }
            else{
                $scope.experiences.$add($scope.experience);
                clearExperience();
            }


        }

        $scope.companySet = function(){

            if($scope.companyResults && $scope.companyDetails)
            {
                $scope.experience.company.place = $scope.companyDetails.id;
                $scope.experience.company.result = $scope.companyResults;
                $scope.experience.company.name = $scope.companyDetails.name;
                $scope.experience.location.place = $scope.companyDetails.id;
                var address = $scope.companyDetails.address_components;

                $scope.experience.location.name = address[2].long_name + ', ' + address[3].short_name + ', ' + address[4].long_name;
                $scope.locationResults =  $scope.experience.location.name;
                $scope.$apply();
            }

        }

        $scope.locationSet = function(){

            if($scope.locationResults && $scope.locationDetails)
            {
                $scope.experience.location.place = $scope.locationDetails.id;
                $scope.experience.location.name = $scope.locationResults;

                $scope.$apply();
            }

        }
        $scope.editExperience = function(key){
            $scope.experience = $scope.experiences.$getRecord(key);

            $scope.startDate = new Date($scope.experience.startDate);
            if($scope.experience.endDate){
                $scope.endDate = new Date($scope.experience.endDate);
            }


            $scope.companyResults = $scope.experience.company.result;

            $scope.locationResults = $scope.experience.location.name;
            $scope.addExperience = true;

        }



        $scope.deleteExperience = function(key){
            var item = $scope.experiences.$getRecord(key);
            if(item)
            {
                $scope.experiences.$remove(item).then(function(ref) {

                });
            }


        }

        var getOccupations = function(){
            occupationService.getOccupations().then(function(occupations) {
                $scope.occupations = occupations;

            }, function(err) {

            });
        };

        var getExperience = function() {
              $scope.experiences = candidateService.getExperience($scope.user.userId);

        }

        var clearExperience = function(){
            $scope.experienceForm.$setPristine();
            $scope.experience = new experienceModel();
            $scope.addExperience = false;
            $scope.startDate = '';
            $scope.endDate = ''

            $scope.companyDetails = '';
            $scope.companyResults = '';


            $scope.locationDetails = '';
            $scope.locationResults = '';

        }
        var initialize = function(){
            getOccupations();
            if($scope.profile && $scope.profile.experience){
                $scope.experiences = $scope.profile.experience;
            }

        };

        initialize();

    }
})()
;

/**
 * Created by labrina.loving on 9/23/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateProfilePersonalityCtrl', ['$scope','$state','$stateParams', 'CandidateService', CandidateProfilePersonalityCtrl ]);


    function CandidateProfilePersonalityCtrl($scope, $state,$stateParams, CandidateService) {
        var candidateService = CandidateService;
        $scope.personality = {
            results: '',
            slides: '',
            careerMatches: ''
        };
        var retrieveAssessment = function(){
            var assessmentId = $scope.personality.results.id;
            Traitify.setPublicKey("cbt6fmp5dfq4t2iqa8r28b7bp2"); // Example Public Key
            Traitify.setHost("api-sandbox.traitify.com"); // Example host url (Defaults to api.traitify.com)
            Traitify.setVersion("v1"); // Example Version
            var results = Traitify.ui.load("results", assessmentId, ".results");
            var personalityTypes = Traitify.ui.load("personalityTypes", assessmentId, ".personality-types");
            var personalityTraits = Traitify.ui.load("personalityTraits", assessmentId, ".personality-traits");

        }

        var initializeAssessment = function(){
            candidateService.createTraitifyAssessment().then(function(assessmentObj) {
                var assessment = assessmentObj;
                Traitify.setPublicKey("cbt6fmp5dfq4t2iqa8r28b7bp2"); // Example Public Key
                Traitify.setHost("api-sandbox.traitify.com"); // Example host url (Defaults to api.traitify.com)
                Traitify.setVersion("v1"); // Example Version
                var assessmentId = assessmentObj.id; // Example Assessment id

                var traitify = Traitify.ui.load(assessmentId, ".slide-deck", {
                    results: {target: ".results"},
                    personalityTypes: {target: ".personality-types"},
                    personalityTraits: {target: ".personality-traits"}
                });
                traitify.results.onInitialize(function(results){
                    candidateService.getAssessmentResults(assessmentId)
                        .then(function(resultsObj) {
                            $scope.personality.results = resultsObj;
                            candidateService.getAssessmentSlides(assessmentId)
                                .then(function(slidesObj) {
                                    $scope.personality.slides = slidesObj;
                                    candidateService.getAssessmentCareerMatches(assessmentId)
                                        .then(function(careerMatchesObj) {
                                            $scope.personality.careerMatches = careerMatchesObj;
                                            candidateService.savePersonality($scope.personality, $scope.user.userId);
                                        }, function(err) {

                                        });
                                }, function(err) {

                                });
                        }, function(err) {

                        });



                });

            }, function(err) {

            });

        }

        if($scope.profile && $scope.profile.personality){

            $scope.personality = $scope.profile.personality;
            retrieveAssessment();
        }
        else{
            initializeAssessment();
        }
    }
})()
;


/**
 * Created by labrina.loving on 8/9/2015.
 */
angular.module('hirelyApp.core')
    .config(['$provide', function($provide) {
        // adapt ng-cloak to wait for auth before it does its magic
        $provide.decorator('ngCloakDirective', ['$delegate', 'Auth',
            function($delegate, Auth) {
                var directive = $delegate[0];
                // make a copy of the old directive
                var _compile = directive.compile;
                directive.compile = function(element, attr) {
                    Auth.$waitForAuth().then(function() {
                        // after auth, run the original ng-cloak directive
                        _compile.call(directive, element, attr);
                    });
                };
                // return the modified directive
                return $delegate;
            }]);
    }]);

/**
 * Created by labrina.loving on 9/16/2015.
 */
angular.module("hirelyApp.core").filter('jobSearchFilter', function () {
    return function (items, occupation, minWage) {
        var filtered = [];
       for (var i = 0; i < items.length; i++) {
            var occupationMatched = true;
            var wageMatched = true;
            var item = items[i];
            if(occupation){
                occupationMatched = occupation.id === item.occupationId;
            }

           wageMatched = item.wage.amount >= minWage;
           if(wageMatched && occupationMatched)
           {
               filtered.push(item);
           }

        }
        return filtered;
    };
});

/**
 * Created by labrina.loving on 8/8/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('AuthService', ['$firebaseAuth', 'fbutil', '$q', AuthService]);

    function AuthService($firebaseAuth, fbutil, $q) {
        var self = this;
        var firebaseRef = $firebaseAuth(fbutil.ref());
        var authData = '';
        var service =  {
            thirdPartyLogin: thirdPartyLogin,
            AuthRef: AuthRef,
            registerNewUser: registerNewUser,
            passwordLogin: passwordLogin,
            logout: logout
        };
        return service;

        // Handle third party login providers
        // returns a promise
        function thirdPartyLogin(provider) {

            var deferred = $q.defer();
            firebaseRef.$authWithOAuthPopup(provider)
                .then(function(user) {
                   deferred.resolve(user);
                }, function(err) {
                    if (err.code === "TRANSPORT_UNAVAILABLE") {
                        // fall-back to browser redirects, and pick up the session
                        // automatically when we come back to the origin page
                        ref.authWithOAuthRedirect.then(function(user) {
                            deferred.resolve(user);
                        }, function(err) {
                            deferred.reject(err);
                            });
                    }
                });


          return deferred.promise;
        };

        function passwordLogin(email, password) {

            var deferred = $q.defer();
            firebaseRef.$authWithPassword({
                email    : email,
                password : password
                })
                .then(function(user) {
                    deferred.resolve(user);
                }, function(err) {
                    deferred.reject(err);
                });


            return deferred.promise;
        };

        function AuthRef(){
            return firebaseRef;
        }

        function logout(){
            firebaseRef.$unauth();
        }

        function registerNewUser(email, password) {

            var deferred = $q.defer();
            firebaseRef.$createUser({
                    email: email,
                    password : password})
                .then(function(user) {
                    deferred.resolve(user);
                }, function(err) {
                    deferred.reject(err);
                });


            return deferred.promise;
        };

        function AuthRef(){
            return firebaseRef;
        }




    }
})();
/**
 * Created by labrina.loving on 9/6/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('BroadcastService', ['$rootScope', BroadcastService]);

    function BroadcastService($rootScope) {
        var self = this;

        var service =  {
            send: send
        };
        return service;

        function send(msg, data){
            $rootScope.$broadcast(msg, data);
        }




    }
})();
/**
 * Created by mike.baker on 9/25/2015.
 */


(function () {
    'use strict';

    angular.module('hirelyApp.manager')
        .service('BusinessService', ['$q','FBURL', '$firebaseObject', 'fbutil', BusinessService]);

     function BusinessService( $q, FBURL, $firebaseObject, fbutil, BusinessService) {
        var self = this;
        var bpostref = new Firebase(FBURL + '/business');
        var businessRef = bpostref.push();
        var rootRef = new Firebase(FBURL + '/businessSite');
        var businessSiteRef = rootRef.push();
        var busId = '';
        var siteId = '';
        var firebaseRef = new Firebase(FBURL + '/businessSiteLocation');
        var geoFire = new GeoFire(firebaseRef);

        function businessSiteModel(){
            this.active = '';
            this.type = '';
            this.description = '';
            this.name = '';
            this.photos = [];
        }

       function addressObjModel(company){
            this.city = company.locality;
            this.formattedAddress = company.street_number;
            this.placeId = busId;
            this.state = company.administrative_area_level_1;
            this.street1 = company.route;
            this.street2 = '';
            this.zipCode = company.postal_code;
        }

        function hoursObjModel(companyo, companyc){
            this.startTime = companyo;
            this.endTime = companyc;
        }
        function daysObjModel(company){
            this.sunday = new hoursObjModel(company.open_store_hours0, company.closed_store_hours0);
            this.monday = new hoursObjModel(company.open_store_hours1, company.closed_store_hours1);
            this.tuesday = new hoursObjModel(company.open_store_hours2, company.closed_store_hours2);
            this.wednesday = new hoursObjModel(company.open_store_hours3, company.closed_store_hours3);
            this.thursday = new hoursObjModel(company.open_store_hours4, company.closed_store_hours4);
            this.friday  = new hoursObjModel(company.open_store_hours5, company.closed_store_hours5);
            this.saturday = new hoursObjModel(company.open_store_hours6, company.closed_store_hours6);
        }
        
        function companyObjModel(){
            this.active = '';
            this.address = '';
            this.currentlyHiring = '';
            this.description = '';
            this.hiringManagers = '';
            this.webaddress = '';
            this.name = '';
            this.parentBusiness = '';
            this.workHours = ''; 
         
        }

        this.createNewBusiness = function createNewBusiness(company, userId){
            var deferred = $q.defer();
            var business = new businessSiteModel(); 

            business.active = 'true';
            business.type = company.status;
            business.description = company.description;
            business.name = company.name;
            business.photos = '';
            businessRef.set(business);
            busId =  businessRef.key();
           
            var businessSite = new companyObjModel();
            businessSite.active = 'true';
            businessSite.address = new addressObjModel(company);
            businessSite.currentlyHiring = 'true';
            businessSite.description = company.description;
            businessSite.hiringManagers = userId;
            businessSite.webaddress = company.webaddress;
            businessSite.name = company.name;
            businessSite.parentBusiness = busId;
            businessSite.workHours = new daysObjModel(company);
            businessSiteRef.set(businessSite);
            siteId =  businessSiteRef.key();

            geoFire.set(siteId, [38.6294021, -77.2796177]).then(function() {
              console.log("Provided key has been added to GeoFire");
            }, function(error) {
              console.log("Error: " + error);
            });  
        }
    };

})();



/**
 * Created by labrina.loving on 9/4/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('CandidateService', ['$q','$http','FBURL', '$firebaseObject', 'fbutil', '$firebaseArray', CandidateService]);

    function CandidateService($q, $http, FBURL, $firebaseObject, fbutil, $firebaseArray, CandidateService) {
        var self = this;
        var profile = '';
        var candidateExperience = [];
        var candidateEducation = [];

        function candidateModel(){
            this.authorizedInUS = '';
            this.status = '';
            this.experience ={};
            this.education = {};
            this.personality = {};
            this.availability = {};
        }


        this.getProfile = function getProfile(userId){
            var ref = new Firebase(FBURL);
            var deferred = $q.defer();
            var profile = new Firebase.util.NormalizedCollection(
                ref.child('users'),
                ref.child('candidates'),
                ref.child('candidate-availability'),
                ref.child('candidate-personality')

            );

            // specify the fields for each path
            profile = profile.select({key: 'candidates.$value', alias: 'candidate'},
                {key: 'candidate-availability.$value', alias: 'availability'},
                {key: 'candidate-personality.$value', alias: 'personality'}),

            // apply a client-side filter to the data (only return users where key === 'user1'
            profile = profile.filter(
                function(data, key, priority) { return key === userId; }
            );

            var profileRef = profile.ref().child(userId);
            // run it and see what we get
            profileRef.once('value', function(snap) {
                    var profile = snap.val();
                    var ref = fbutil.ref('candidate-experience', userId);
                    profile.experience =  $firebaseArray(ref);
                    deferred.resolve(profile);

                }, function (err) {
                    deferred.reject(snap);
                }
            );

            return deferred.promise;

        }

        this.saveCandidate = function saveCandidate(candidate, key) {
            var ref = fbutil.ref('candidates', key);
            ref.set(candidate);
        };

        this.saveAvailability = function saveAvailability(availability, key) {
            var ref = fbutil.ref('candidate-availability', key);
            ref.set(availability);
        };

        this.savePersonality = function savePersonality(personality, key){
            var ref = fbutil.ref('candidate-personality', key);
            ref.set(personality);
        }

        this.createTraitifyAssessment = function createTraitifyAssessment(){
            var deferred = $q.defer();

            $http.get('/api/assessment')
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            return deferred.promise;

        }

        this.getAssessmentResults = function getAssessmentResults(assessmentId){
            var deferred = $q.defer();

            $http.get('/api/assessmentResults'+ assessmentId)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            return deferred.promise;

        }

        this.getAssessmentSlides = function getAssessmentSlides(assessmentId){
            var deferred = $q.defer();

            $http.get('/api/assessmentSlides'+ assessmentId)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            return deferred.promise;

        }

        this.getAssessmentCareerMatches = function getAssessmentCareerMatches(assessmentId){
            var deferred = $q.defer();

            $http.get('/api/assessmentCareerMatches'+ assessmentId)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            return deferred.promise;

        }

        this.getAssessment = function getAssessment(assessmentId){
            var deferred = $q.defer();

            $http.get('/api/assessmentData'+ assessmentId)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            return deferred.promise;

        }

        this.getExperience = function getExperience(userId){
            var ref = fbutil.ref('candidate-experience', userId);
            return $firebaseArray(ref);
        }

        this.savePositiontoFavorites = function savePositiontoFavorites(userId, positionId){
            var ref = fbutil.ref('candidate-favorites', userId);
            ref.child(positionId).set(true);

        }


    }
})();


/**
 * Created by labrina.loving on 9/4/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('FilePickerService', ['$window', FilePickerService]);

    function FilePickerService($window) {
        return $window.filepicker;
    }

})();
/**
 * Created by labrina.loving on 8/14/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('GeocodeService', ['$q', '$http', 'GOOGLEMAPSURL', 'FBURL', GeocodeService]);

    function GeocodeService($q, $http, GOOGLEMAPSURL, FBURL) {
        var mapsEndPoint = GOOGLEMAPSURL;
        var currentPlace = null;

        var service =  {
            getPlacebyLatLong : getPlacebyLatLong,
            getPlacebyPlaceId : getPlacebyPlaceId,
            getPlace: getPlace,
            setPlace: setPlace,
            calculateDistancetoSite: calculateDistancetoSite
        };
        return service;

        function getPlacebyLatLong(latitude, longitude){
            var url = mapsEndPoint.replace('{POSITION}', latitude + ',' + longitude);
            var deferred = $q.defer();

            $http.get(url, {cache: true}).success(function(response) {
                // hacky
                var place;
                angular.forEach(response.results, function(result) {
                    if(result.types[0] === 'postal_code') {
                        place = result;
                    }
                });
                deferred.resolve(place);
            }).error(deferred.reject);

            return deferred.promise;
        }

        function getPlacebyPlaceId(placeId){

            var deferred = $q.defer();

            $http.get('/api/googleplace'+ placeId)
                .success(function(data) {
                    currentPlace = data;
                    deferred.resolve(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            return deferred.promise;
        }

        function getPlace(){
            return currentPlace;
        }

        function setPlace(place){
            currentPlace = place;
        }

        function calculateDistancetoSite(siteId, placeId){
            var deferred = $q.defer();
            var firebaseRef = new Firebase(FBURL + '/businessSiteLocation');
            var geoFire = new GeoFire(firebaseRef);
            geoFire.get(siteId).then(function(siteLocation) {
                var place = getPlacebyPlaceId((placeId)).then(function(place) {
                    var currentPlaceLocation = [place.geometry.location.lat, place.geometry.location.lng];
                    var distance = GeoFire.distance(currentPlaceLocation, siteLocation) * 0.621371;
                    deferred.resolve(distance);

                }, function(error) {
                    console.log("Error: " + error);
                });

            }, function(error) {
                console.log("Error: " + error);
            });
            return deferred.promise;
        }




    }


})();

/**
 * Created by mike.baker on 8/19/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('JobdetailsService', ['$q', '$http', JobdetailsService]);

    function JobdetailsService($q, $http) {
  
        var currentJob = '';
        var selected = '';
        var service =  {
            getJob: getJob,
            setJob: setJob
        };
        return service;

        function setJob(selected)
        {
            currentJob = selected;
        }

        function getJob()
        {
            return currentJob;
        }

    }


})();

/**
 * Created by labrina.loving on 9/15/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('OccupationService', ['$q','FBURL', '$firebaseObject', 'fbutil', OccupationService]);

    function OccupationService($q, FBURL, $firebaseObject, fbutil, OccupationService) {

        this.getOccupations = function getOccupations(){

            var occupationRef =  new Firebase(FBURL + "/onetOccupation");
            var deferred = $q.defer();
            occupationRef.once("value", function (snapshot) {
                    var occupations = [];
                    snapshot.forEach(function(item) {
                        var itemVal = item.val();
                        var key = item.key();
                        var occupation = {
                            id: '',
                            title: '',
                            socCode: ''
                        }
                        occupation.id = key;
                        occupation.title = itemVal.title;
                        occupation.socCode = itemVal.onetsocCode;
                        occupations.push(occupation);


                    });
                    deferred.resolve(occupations);

                }, function (err) {
                    deferred.reject(snapshot);
                }
            );
            return deferred.promise;

        };


    };
})();


/**
 * Created by labrina.loving on 9/10/2015.
 */


(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('PositionService', ['$q','FBURL', '$firebaseObject', 'fbutil', PositionService]);

    function PositionService($q, FBURL, $firebaseObject, fbutil) {
        var self = this;
        var profile;

        this.getOpenPositionsForLocation = function getOpenPositionsForLocation(locationId, minWage, occupationId){
            var ref = new Firebase(FBURL);
            var deferred = $q.defer();
            var positions = new Firebase.util.NormalizedCollection(
                ref.child('position'),
                [ref.child('businessSite'), 'businessSite', 'position.siteId'],
                [ref.child('business'), 'business', 'position.businessId'],
                [ref.child('businessPhotos'), 'businessPhotos', 'position.businessId']
            );

            // specify the fields for each path
            positions = positions.select('position.siteId', 'position.businessId', {key: 'position.$value', alias: 'position'}, {key: 'businessSite.$value', alias: 'businessSite'},  {key: 'business.$value', alias: 'business'},  {key: 'businessPhotos.$value', alias: 'businessPhotos'});

            positions =  positions.filter(
                function(data, key, priority)
                {
                    var locationMatched = false;
                    var occupationMatched = false;
                    var wageMatched = false;
                    locationMatched = data.siteId == locationId;
                    occupationMatched = (occupationId) ? data.position.occupation == occupationId : true;
                    wageMatched = (minWage) ? data.position.compensation.wage.minAmount >= minWage : true;
                    return locationMatched && occupationMatched && wageMatched;
                }
            );



            var positionsRef = positions.ref();
            positionsRef.once('value', function(positionSnap) {
                   deferred.resolve(positionSnap.val());
                }, function (err) {
                    deferred.reject(err);
                }
            );

            return deferred.promise;

        };

        this.getPositionbyId = function(siteId, positionId){
            var ref = new Firebase(FBURL);
            var deferred = $q.defer();
            var positions = new Firebase.util.NormalizedCollection(
                ref.child('position'),
                [ref.child('businessSite'), 'businessSite', 'position.siteId'],
                [ref.child('business'), 'business', 'position.businessId'],
                [ref.child('businessPhotos'), 'businessPhotos', 'position.businessId'],
                [ref.child('users'), 'users', 'position.mainHiringMgr']

            );

            // specify the fields for each path
            positions = positions.select('position.siteId', 'position.businessId', 'position.mainHiringMgr', {key: 'position.$value', alias: 'position'}, {key: 'businessSite.$value', alias: 'businessSite'},  {key: 'business.$value', alias: 'business'},
                {key: 'users.$value', alias: 'hiringMgr'},{key: 'businessPhotos.$value', alias: 'businessPhotos'});

            positions =  positions.filter(
                function(data, key, priority)
                {
                   return key == positionId;
                }
            );



            var positionsRef = positions.ref().child(positionId);

            positionsRef.once('value', function(positionSnap) {
                    deferred.resolve(positionSnap.val());
                }, function (err) {
                    deferred.reject(err);
                }
            );

            return deferred.promise;

        }
    };
})();



/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('UserService', ['$rootScope', '$q','FBURL', '$firebaseObject', 'fbutil', UserService]);

    function UserService($rootScope, $q, FBURL, $firebaseObject, fbutil, UserService) {
        var self = this;
        var ref = new Firebase(FBURL + "/users");
        var currentUser;
        var currentUserId;
        var isLoggedIn = false;

        function userModel(){
            this.firstName = '';
            this.lastName = '';
            this.fullName = '';
            this.email = '';
            this.profileImageUrl = '';
            this.personalStatement = '';
            this.location = '';
            this.provider =  '';
            this.providerId = '';
            this.createdOn = '';
            this.lastModifiedOn = '';
            this.userId = '';
           }


        this.getCurrentUser = function getCurrentUser() {
           return currentUser;
        };

        this.getIsLoggedIn =  function getIsLoggedIn(){
            return isLoggedIn;
        };

        this.setCurrentUser = function setCurrentUser(user, userId){
            currentUser = user;
            currentUser.userId = userId;
            currentUserId = userId;
        };

        this.setIsLoggedIn = function setIsLoggedIn(aisLoggedIn){
            isLoggedIn = aisLoggedIn;
            if(!isLoggedIn){
                currentUser = '';
                currentUserId = '';
            }

        };

        this.getUserByKey = function getUserByKey(key){
            var userRef =  new Firebase(FBURL + "/users" + '/' + key);
            var deferred = $q.defer();
            userRef.once("value", function (snapshot) {
                    deferred.resolve(snapshot);

                }, function (err) {
                    deferred.reject(snapshot);
                }
            );
            return deferred.promise;
        };


        this.getUserByEmail = function getUserByEmail(email) {

            var deferred = $q.defer();
            ref.orderByChild("email").equalTo(email).once("value", function (snapshot) {
                    deferred.resolve(snapshot);

                }, function (err) {
                    deferred.reject(snapshot);
                }
            );
            return deferred.promise;
        };

        this.createUserinFirebase = function createUserInFireBase(user, key) {

            var ref = fbutil.ref('users', key);
            ref.set(user)
        }

        this.saveUser = function saveUser(user){
            var ref = new Firebase(FBURL + "/users/" + currentUserId);
            ref.update(user);
            currentUser = user;
        }

        this.createUserfromThirdParty = function createUserfromThirdParty(provider, authData) {
            var deferred = $q.defer();
            var user;

            //get proper user for provider
            switch(provider) {
                case 'facebook':
                    user = createFacebookUser(authData);
                    break;
                case 'twitter':

                    break;
                case 'google':
                    user = createGoogleUser(authData);
            }

            //check if user previously exists
            var userExists = false;
            this.getUserByKey(authData.uid)
                .then(function(snapshot) {
                    var exists = (snapshot.val() != null);
                    if(!exists)
                    {
                        self.createUserinFirebase(user, authData.uid)

                    }
                    deferred.resolve(user);
                }, function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;

        };



        this.createRegisteredNewUser = function createRegisteredNewUser(userData, providerId) {

            var deferred = $q.defer();
            var user;

            var timestamp = Firebase.ServerValue.TIMESTAMP;
            user = new userModel();
            user.fullName = userData.firstName + ' ' + userData.lastName;
            user.firstName = userData.firstName;
            user.lastName = userData.lastName;
            user.email = userData.email;
            user.provider = 'password';
            user.providerId = providerId;
            user.createdOn = timestamp;
            user.lastModifiedOn = timestamp;

            self.createUserinFirebase(user, providerId)


            deferred.resolve(user);
            return deferred.promise;

        };



        function createFacebookUser(fbAuthData)
        {
            var timestamp = Firebase.ServerValue.TIMESTAMP;
            var fbUser = new userModel();
            fbUser.fullName = fbAuthData.facebook.displayName;
            fbUser.profileImageUrl =  "http://graph.facebook.com/" + fbAuthData.facebook.id  + "/picture?width=300&height=300";
            fbUser.email = fbAuthData.facebook.email;
            fbUser.provider = fbAuthData.provider;
            fbUser.providerId = fbAuthData.uid;
            fbUser.createdOn = timestamp;
            fbUser.lastModifiedOn = timestamp;

            return fbUser;

        };

        function createGoogleUser(googleAuthData)
        {
            var timestamp = Firebase.ServerValue.TIMESTAMP;
            var fbUser = new userModel();

            fbUser.fullName = googleAuthData.google.displayName;
            fbUser.firstName = googleAuthData.google.cachedUserProfile.given_name;
            fbUser.lastName = googleAuthData.google.cachedUserProfile.family_name;
            fbUser.profileImageUrl =  googleAuthData.google.profileImageURL;
            fbUser.email = googleAuthData.google.email ? googleAuthData.google.email: '';
            fbUser.provider = googleAuthData.provider;
            fbUser.providerId = googleAuthData.auth.uid;
            fbUser.createdOn = timestamp;
            fbUser.lastModifiedOn = timestamp;

            return fbUser;

        };
    }
})();
