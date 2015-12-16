'use strict';

var myApp = angular.module('hirelyApp',
  [
    'uiGmapgoogle-maps',
    'ui.router',
    'ui.bootstrap',
    'ui.bootstrap.typeahead',
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
    'hirelyApp.manager',
    'ngSanitize',
    'multiStepForm'

  ])


  .config(function ($stateProvider, $urlRouterProvider) {

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
            return CandidateService.getProfile(user.userId).then(function (profile) {

              return profile;
            }, function (err) {
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
      .state('app.application', {
        url: '/:jobId/apply',
        templateUrl: 'app/application/job-application.html',
        controller: 'JobApplicationController'
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
        $scope.user = {email: '', password: '', firstName: '', lastName: '', userType: 'JS'}

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
            userService.registerNewUser(registeredUser.email, registeredUser.password)
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
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('JobApplicationController', ['$scope', '$stateParams', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'UserService', JobApplicationController]);


  function JobApplicationController($scope, $stateParams, uiGmapGoogleMapApi, uiGmapIsReady , UserService) {

    // test jobs
    var testJobOne = {
      position: "Barista",
      city: "Washington DC",
      lng: "-77.0576414",
      lat: "38.9340854",
      business: "Starbucks",
      photoUrl: "http://assets.inhabitat.com/wp-content/blogs.dir/1/files/2013/12/starbucks-canal-street-NOLA-store-6.jpg"
    };

    var testJobTwo = {
      position: "Cashier",
      city: "Boca Raton, Fl",
      lng: "-80.1692048",
      lat: "26.3503604",
      business: "McDonald's",
      photoUrl: "http://retaildesignblog.net/wp-content/uploads/2011/08/McDonald-s-flagship-restaurant-by-SHH-London.jpg"
    };

    var jobInfo = {};


    $scope.stepOneLoaded = false;
    $scope.stepTwoLoaded = false;
    //$scope.stepThreeLoaded = false; step three is special case, maintained in step controller
    $scope.stepFourLoaded = false;
    $scope.stepFiveLoaded = false;


    // test Job IDs
    var currentJob = $stateParams.jobId;
    switch (currentJob) {
      case "122122":
        $scope.jobInfo = testJobOne;
        break;
      case "130130":
        $scope.jobInfo = testJobTwo;
        break;
    }


    /***
     *
     * Map stuff:
     *
     *
     *
     ***/


    $scope.mapOptions = {
      styles: hirelyCustomMap,
      disableDefaultUI: true
    };


    uiGmapGoogleMapApi
      .then(function (maps) {
        console.log('redy');
        $scope.googlemap = {};
        $scope.map = {
          center: {
            latitude: $scope.jobInfo.lat,
            longitude: $scope.jobInfo.lng
          },
          zoom: 10,
          pan: 1,
          options: $scope.mapOptions,
          control: {},
          clusterOptions: {
            title: 'hirely',
            gridSize: 20,
            ignoreHidden: true,
            minimumClusterSize: 1,
            zoomOnClick: false
          }
          //events: {
          //  tilesloaded: function (maps, eventName, args) {
          //  },
          //  dragend: function (maps, eventName, args) {
          //  },
          //  zoom_changed: function (maps, eventName, args) {
          //  }
          //}
        };
      });


    //form steps
    $scope.steps = [
      {
        templateUrl: '/app/application/step-1/step-one.tpl.html',
        controller: 'StepOneController',
        hasForm: false
      },
      {
        templateUrl: '/app/application/step-2/step-two.tpl.html',
        controller: 'StepTwoController',
        hasForm: true
      },
      {
        templateUrl: '/app/application/step-3/step-three.tpl.html',
        controller: 'StepThreeController'
      },
      {
        templateUrl: '/app/application/step-4/step-four.tpl.html'
      },
      {
        templateUrl: '/app/application/step-5/step-five.tpl.html',
        controller: 'StepFiveController',
        hasForm: true
      }
    ];




    //navigation animation & init
    angular.element(document).ready(function () {
      var steps = $('.steps');

      // Timer for delay, must same as CSS!
      var stepsTimer = 200,
        stepsTimerL = 400;

      // remove mini between current
      steps.addClass('is-mini');
      steps.each(function (i) {
        var self = $(this);
        if (self.hasClass('is-current')) {
          self.removeClass('is-mini');
          self.prev().removeClass('is-mini');
          self.next().removeClass('is-mini');
        }
      });

      // Bounce Animation
      steps.addClass('is-circle-entering');

      // Delay for BounceIn
      setTimeout(function () {
        steps.each(function (i) {
          var self = $(this),
            timer = (stepsTimer * 2) * i;
          setTimeout(function () {
            // Line Flow
            self.addClass('is-line-entering');
            if (self.hasClass('is-current')) {
              // Title FadeIn
              steps.addClass('is-title-entering');
            }
          }, timer);
        });
      }, stepsTimer);

    });

    $scope.xpItems = [];
    $scope.addJobXp = function () {
      console.log($scope.company);
      $scope.xpItems.push(
        {
          company: $scope.company,
          position: $scope.position,
          description: $scope.description
        }
      )
    };


    $scope.submitStepOne = function () {
      console.log(hello);
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
        .constant('FIREBASE_URL', 'https://hirely-dev.firebaseio.com')

        .constant('GOOGLEMAPSURL', 'https://maps.google.com/maps/api/geocode/json?latlng={POSITION}&sensor=false')

        .constant('filePickerKey', 'AALU2i7ySUuUi8XUDHq8wz')

        .constant('GOOGLEMAPSSERVERKEY', 'AIzaSyDoM7YVRZsYdeoJ3XezTX-l_eCgFz2EqfM')

        .constant('GOOGLEPLACESURL', 'https://maps.googleapis.com/maps/api/place/details/json?placeid={PLACEID}&key={KEY}')

        .constant('candidateStatus', {1: 'Active', 2: 'Employed', 3: 'Inactive'})

        .constant('RESPONSE', {success: {code: '1', status: 'ok'}, error: {code: '0', status: 'error'}})

        .constant('TRAITIFY_PUBLIC_KEY', "vjcprrh344sj6d5jbs80b4tjns");
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
    .factory('fbutil', ['$window', 'FIREBASE_URL', '$q', function($window, FIREBASE_URL, $q) {


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
            var ref = new $window.Firebase(FIREBASE_URL);
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
        'FIREBASE_URL', 'PositionService', 'GeocodeService', 'OccupationService','UserService', 'CandidateService','Notification', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$timeout' ,JobSearchCtrl]);



  function JobSearchCtrl($scope, $http, $state, $stateParams, FIREBASE_URL, PositionService, GeocodeService, OccupationService,UserService, CandidateService, Notification, uiGmapGoogleMapApi, uiGmapIsReady, $timeout) {
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
                      var firebaseRef = new Firebase(FIREBASE_URL + '/businessSiteLocation');
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


      //var getOccupations = function(){
      //    occupationService.getOccupations().then(function(occupations) {
      //       $scope.occupations = occupations;
      //        if($stateParams.occupationId){
      //            $scope.filter.occupation = _.findWhere(occupations, {id: $stateParams.occupationId})
      //        }
      //    }, function(err) {
      //
      //    });
      //};



      var initializeMap = function(){
          uiGmapGoogleMapApi
              .then(function(maps){
                  $scope.googlemap = {};
                  $scope.map = {
                      center: {
                          latitude: $scope.details.geometry.location.lat,
                          longitude: $scope.details.geometry.location.lng
                      },
                      zoom: 100,
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
      };

      $scope.getJobsbyLocation = function(details){
          $scope.details = details;
          $scope.searchJobs();
      };

      $scope.getJobsbyOccupation = function(item, model, label){
         $scope.filter.occupationId = item.id;
          $scope.filter.occupation = item;
          $scope.searchJobs();

      };

      $scope.searchJobs = function(){
          $state.go('app.job', {placeId: $scope.details.place_id, wage: $scope.filter.minWage, occupationId: $scope.filter.occupationId, distance: $scope.filter.distance })
      };

      $scope.addToFavorites = function(positionId){
         var user = userService.getCurrentUser();
         candidateService.savePositiontoFavorites(user.userId, positionId);
          Notification.success('Job Added to Favorites');
      };

      var initialize = function(){
          getJobs();
          //getOccupations();

      };




      var locations = [];
      $scope.selectedLocation = undefined;


      $scope.searchLocations = function(query){
          if(!!query && query.trim() != ''){
              return geocodeService.getCityBySearchQuery(query).then(function(data){
                  locations = [];
                  if(data.statusCode == 200){
                      data.results.predictions.forEach(function(prediction){
                          locations.push({address: prediction.description, placeId: prediction.id});
                      });
                      return locations;
                  } else {
                      return {};
                  }
              });
          }
      };
      var occupations = [];
      $scope.selectedOccupation = null;
      $scope.searchOnetOccupations = function(query){
          if(!!query && query.trim() != ''){
              return occupationService.getOccupations(query).then(function(data){
                  occupations = [];
                  if(data.statusCode == 200){
                      data.results.forEach(function(occ){
                          occupations.push({code: occ.code, title: occ.title});
                      });
                      return occupations;
                  } else {
                      return {};
                  }
              });
          } else {
              return {}
          }
      };


      //initialize controller
      initialize();
}

 })();

/**
 * Created by labrina.loving on 8/5/2015.
 */

(function() {
    'use strict';

    angular.module('hirelyApp.home', []);
})();


(function () {
    'use strict';

    angular.module('hirelyApp.home').controller('HomeCtrl', ['$scope', '$state', '$stateParams', 'GeocodeService', '$window','$timeout', 'BusinessService' ,'JobService','UserService',HomeCtrl ]);

    function HomeCtrl ($scope, $state, $stateParams, GeocodeService, $window, $timeout, BusinessService , JobService, UserService) {


        var geocodeService = GeocodeService;

        $scope.flexSliderOptions = {
            animation: "fade",
            directionNav: false,
            controlNav: false,
            slideshowSpeed: 10000
        };

        angular.element('.search-container').addClass('animated fadeInUp');

        angular.element('.search-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            angular.element('.search-container').removeClass('animated fadeInUp');
        });


        var locations = [];
        $scope.selectedLocation = undefined;


        $scope.searchLocations = function(query){
            if(!!query && query.trim() != ''){
                return geocodeService.getCityBySearchQuery(query).then(function(data){
                    locations = [];
                    if(data.statusCode == 200){
                        data.results.predictions.forEach(function(prediction){
                            locations.push({address: prediction.description, placeId: prediction.id});
                        });
                        return locations;
                    } else {
                        return {};
                    }
                });
            }
        };

            //var place = geocodeService.getPlace();
        //if(place){
        //
        //    $scope.results = place.formatted_address;
        //    $scope.details = place;
        //}
        //
        $scope.getResults = function() {
            if(!!$scope.selectedLocation){
                geocodeService.setPlace($scope.selectedLocation);
                $state.go('app.job', {placeId: $scope.selectedLocation.placeId});
            }
            else {
                console.log('no!');
                angular.element('.search-container').addClass('animated shake');
                angular.element('.search-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    angular.element('.search-container').removeClass('animated shake');
                });
            }

        };

        /**********************************************************************************
         *
         *  TESTING AREA - STAY AWAY!!
         *
        **********************************************************************************/

        $scope.company = {
            name: 'KFC',
            description: 'Resturant',
            admin: '1',
            type: '0',
            active: 'true',
            placeId: 'Gsghsddf215584sdfd',
            website: 'www.KFC.com'
        };
/*
        //$scope.job = {
        //    businessId: {1234:'true'},
        //    hiringMgr: {123123132:'true'},
        //    contact: {email:'hani.hanna@develoopers.com.au',phone:'77445855',website:'www.hanna.com'},
        //    applicants: {65555:'true'},
        //    workingHrs: {0:{open:'10',close:'00'},1:{open:'10',close:'00'},2:{open:'10',close:'00'},3:{open:'10',close:'00'},4:{open:'10',close:'00'},5:{open:'10',close:'00'},6:{open:'12',close:'00'}}
        //};

        //JobService.createNewJob($scope.job, 1010);

        $scope.userData = {
            firstName : 'Hanu',
            lastName: 'Hanna',
            email : 'hani.hanna@gmail.com',
            userType : '1',
            profileImageUrl : 'www.hani.com/pic/hehe.jpg',
            personalStatement : 'work hard in silence let success make the noise',
            provider : 'password',
            createdOn : '25-11-2015',
            lastModifiedOn : '28-11-2015'
        };

*/
        $scope.address = {
          formattedAddress : 'USA-NY',
          zipCode : '001',
          unit : ' ',
          street : 'AA',
          city : 'NY',
          state : 'NY',
          lng : '75.36',
          lat : '35.36'
        };

        $scope.contact = {
            email : 'hani@developpers.com.au',
            mobile: '05236542'
        }

        $scope.photo = {
            url: 'http://www.kfc.com/pic/logo.jpg',
            main: 'true'
        }

        //$scope.userData.address = $scope.address;

        $scope.company.address = $scope.address;
        $scope.company.photo = $scope.photo;

        /*
        $scope.user = UserService.getUserById('hani-hanna-89%40gmail-com').then(function(user){
            console.log(user.firstName);
        });*/

        //UserService.createNewUser($scope.userData,589-676);
        //BusinessService.createNewBusiness($scope.company,$scope.photo,$scope.address,$scope.contact);

        $scope.job = {
            businessId : '0L5DpYpNjhPiqj1wbFv',
            hiringManager : '-444',
            position : 'position',
            numberOfPositions : '3',
            occupationId : 'jhkjjhhk-87',
            description : 'Hiring 3 waiters',
            createdAt : '27-11-2015',
            updatedAt : '28-11-2015',
            available : 'true'
        }

        JobService.createNewJob($scope.job);

    }
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
                controller: 'LoginCtrl as vm'

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
        //$scope.authRef.$onAuth(function(authData) {
        //    if(authData)
        //    {
        //        if(!$scope.currentUser) {
        //            //try to retrieve user
        //            $scope.userService.getUserByKey(authData.uid)
        //                .then(function (snapshot) {
        //                    var exists = (snapshot.val() != null);
        //                    if (exists) {
        //                        $scope.userService.setCurrentUser(snapshot.val(), snapshot.key());
        //                        $scope.userService.setIsLoggedIn(true);
        //                    }
        //
        //                }, function (err) {
        //
        //                });
        //        }
        //    }
        //    else
        //    {
        //        $scope.userService.setIsLoggedIn(false);
        //
        //    }
        //});

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
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

angular.module('hirelyApp.manager').directive('autoFillableField', [
  '$timeout',
  function($timeout) {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, ngModel) {

        $timeout(function() {
          if (ngModel.$viewValue !== element.val()) {
            ngModel.$setViewValue(element.val());
          }
        }, 50);
      }
    };
  }
]);
}
)();
/**
 * Created by mike.baker on 9/29/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.manager').controller('HMRegisterCtrl', ['$scope', '$state', '$firebaseObject', '$firebaseArray', 'FIREBASE_URL', 'AuthService', 'UserService', 'BusinessService',  HMRegisterCtrl ]);
   

    function HMRegisterCtrl($scope, $state, $firebaseObject, $firebaseArray, FIREBASE_URL, AuthService, UserService, BusinessService) {

        var vm = this;
        var authService = AuthService;
        var userService = UserService;
        var businessService = BusinessService;
        var managerId = '';
        var businessRef = new Firebase(FIREBASE_URL + '/businessSite');
        var photoRef = new Firebase(FIREBASE_URL + '/businessPhotos');
       
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
            userService.registerNewUser(registeredUser.email, registeredUser.password)
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
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 *
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('StepOneController', ['$scope', '$stateParams', 'multiStepFormInstance', 'GeocodeService', 'UserService',StepOneController]);


  function StepOneController($scope, $stateParams, multiStepFormInstance, GeocodeService, UserService) {

    var geocodeService = GeocodeService;

    $scope.validStep = false;

    var addressComponents = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };



    $scope.$watch('stepOne.$valid', function(state) {
      multiStepFormInstance.setValidity(state);
    });

    var locations = [];
    $scope.selectedLocation = undefined;

    $scope.searchLocations = function(query){
      if(!!query && query.trim() != ''){
        return geocodeService.geoCodeAddress(query).then(function(data){
          locations = [];
          if(data.statusCode == 200){
            console.log(data);
            data.results.predictions.forEach(function(prediction){
              locations.push({address: prediction.description, placeId: prediction.place_id});
            });
            return locations;
          } else {
            return {};
          }
        });
      }
    };

    $scope.setAddress = function(address){
      geocodeService.getPlaceDetails(address.placeId).then(function(data){
        var place = data.results.result;
        if(place){
          for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            switch (addressType){
              case "administrative_area_level_1":
                $scope.state = place.address_components[i][addressComponents[addressType]];
                break;

              case "locality":
                $scope.address_city = place.address_components[i][addressComponents[addressType]];
                break;

              case "postal_code":
                $scope.zipcode = place.address_components[i][addressComponents[addressType]];
                break;
            }
          }
        }
      });
    }
    var testUserId = '-444';
    if(!$scope.stepOneLoaded){
      UserService.getUserById(testUserId).then(function(user){
              $scope.firstname = user.firstName;
              $scope.lastname = user.lastName;
              $scope.email = user.email;
              $scope.mobile = user.mobile;
              $scope.address = user.address.formattedAddress;
              $scope.address_unit = user.address.unit;
              $scope.address_city = user.address.city;
              $scope.state = user.address.state;
              $scope.zipcode = user.address.zipCode;

              $scope.stepOneLoaded = true;
            });
    }


  }
})();

/**
 *
 * Job Application Workflow
 *
 * Develoopers - Hirely 2015
 *
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('StepThreeController', ['$scope', '$stateParams', 'TraitifyService' ,'TRAITIFY_PUBLIC_KEY', StepThreeController]);


  function StepThreeController($scope, $stateParams, TraitifyService, TRAITIFY_PUBLIC_KEY) {

    $scope.stepThreeLoaded = true;

    Traitify.setPublicKey(TRAITIFY_PUBLIC_KEY);
    Traitify.setHost("api-sandbox.traitify.com");
    Traitify.setVersion("v1");

    TraitifyService.getAssessmentId().then(function (data) {
        var assessmentId =  data.results.id;
        var traitify = Traitify.ui.load(assessmentId, ".personality-analysis", {
          results: {target: ".personality-results"},
          personalityTypes: {target: ".personality-types"},
          personalityTraits: {target: ".personality-traits"}
        });
        // traitify.onInitialize(function(){
        //   $scope.stepThreeLoaded = true;
        //   $scope.$apply();
        // });
        });

    });



  }
})();

/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('StepTwoController', ['$scope', '$stateParams', StepTwoController]);


  function StepTwoController($scope, $stateParams) {

    $scope.xpItems = [];
    $scope.addJobXp = function () {
      console.log($scope.company);
      $scope.xpItems.push(
        {
          company: $scope.company,
          position: $scope.position,
          description: $scope.description
        }
      )
    }

  }
})();
/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 *
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('StepFiveController', ['$scope', '$stateParams', 'multiStepFormInstance', 'GeocodeService', StepFiveController])
  .filter('hourRangesByDay', function(){
        return function(hours, day){
          var result = [];

          angular.forEach(hours, function(hour){
            var obj = {};
            
              obj.start = '6AM';
              obj.end = '8AM';
            
           
            result.push(obj);
          })
          return result;
        }
      })

  function StepFiveController($scope, $stateParams, multiStepFormInstance, GeocodeService) {

    $scope.today = function() {
    $scope.startDate = new Date();
    };
      $scope.today();

      $scope.clear = function () {
        $scope.startDate = null;
      };


      $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();
      $scope.maxDate = new Date(2020, 5, 22);

      $scope.openDatePicker = function($event) {
        $scope.status.opened = true;
      };

      $scope.setDate = function(year, month, day) {
        $scope.startDate = new Date(year, month, day);
      };

      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];

      $scope.status = {
        opened: false
      };



      $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0,0,0,0);

          for (var i=0;i<$scope.events.length;i++){
            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }

        return '';
      };

      //// pattern to restrict number input only;
      $scope.onlyNumbers = /^\d+$/;

      /**
       * Weekely Time Table 
       */
    
        
    //// build and initiate time table array 
      var weeklyTimetable = [];
      for(var h=0; h<24; h++){
        var hourLabel = '';
        if(0==h){
            hourLabel += '12AM';
        }
        else if(h<12){
            hourLabel += String(h) + 'AM';
        }
        else{
            hourLabel += String(h-12 <= 0 ? 12 : h-12) + 'PM';
        }
        weeklyTimetable[h] = {
            'label': hourLabel,
            'days':{
                'su' : false,
                'mo' : false,
                'tu' : false,
                'we' : false,
                'th' : false,
                'fr' : false,
                'sa' : false
            }
          };
      }//// for

      $scope.weeklyTimetable = weeklyTimetable;

      
  }////fun. stepFiveController
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

    angular.module('hirelyApp.candidate').controller('CandidateProfileExperienceCtrl', ['$scope','$state','$stateParams', 'CandidateService', 'OccupationService', 'GeocodeService', '$timeout', CandidateProfileExperienceCtrl ]);


    function CandidateProfileExperienceCtrl($scope, $state,$stateParams, CandidateService, OccupationService, GeocodeService, $timeout) {
        var occupationService = OccupationService;
        var candidateService = CandidateService;
        var geocodeService = GeocodeService;
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

        //var getOccupations = function(){
        //    occupationService.getOccupations().then(function(occupations) {
        //        $scope.occupations = occupations;
        //
        //    }, function(err) {
        //
        //    });
        //};

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
            //getOccupations();
            if($scope.profile && $scope.profile.experience){
                $scope.experiences = $scope.profile.experience;
            }

        };


        //*** LOCATION SEARCH ***//

        var locations = [];
        $scope.selectedLocation = undefined;


        $scope.searchLocations = function(query){
            if(!!query && query.trim() != ''){
                return geocodeService.getCityBySearchQuery(query).then(function(data){
                    locations = [];
                    if(data.statusCode == 200){
                        data.results.predictions.forEach(function(prediction){
                            locations.push({address: prediction.description, placeId: prediction.id});
                        });
                        return locations;
                    } else {
                        return {};
                    }
                });
            }
        };


        var occupations = [];
        $scope.selectedOccupation = null;
        $scope.searchOnetOccupations = function(query){
            if(!!query && query.trim() != ''){
                return occupationService.getOccupations(query).then(function(data){
                    occupations = [];
                    if(data.statusCode == 200){
                        data.results.forEach(function(occ){
                            occupations.push({code: occ.code, title: occ.title});
                        });
                        return occupations;
                    } else {
                        return {};
                    }
                });
            } else {
                return {}
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



        function AuthRef(){
            return firebaseRef;
        }




    }
})();
(function () {
    'use strict';

    angular.module('hirelyApp.manager')
        .service('BusinessService', ['$q','FIREBASE_URL', 'RESPONSE', BusinessService]);

     function BusinessService( $q, FIREBASE_URL, RESPONSE) {


        var deferred = $q.defer();

        var businessRef = new Firebase(FIREBASE_URL + '/business');

        //var onComplete = function (error) {
        //  if(error){
        //    deferred.resolve(RESPONSE.success);
        //  } else {
        //    deferred.reject(RESPONSE.success);
        //  }
        //};


        /**
         *
         * for Company profile refer to: Business model
         *
         *
         **/

        this.createNewBusiness = function createNewBusiness(companyProfile){

            var id = generatePushID();
            var business = new Business(
              companyProfile.name,
              companyProfile.description,
              companyProfile.admin,
              companyProfile.type,
              companyProfile.active,
              companyProfile.placeId,
              companyProfile.website,
              companyProfile.photo,
              companyProfile.address,
              companyProfile.contact
            );

            businessRef.child(id).set(business, function(error){
              if(!error){
                console.log('success');
              }
              else
                console.log('error');
            });
        }



    // retrievce business by its ID
    this.getBusinessById = function getBusinessById(id)
    { 
      var deferred = $q.defer();
      var user = {};
      var url = new Firebase(FIREBASE_URL + "/business/" + id);
      url.on("value", function(snapshot) {
        user = snapshot.val();
        deferred.resolve(user);
      }, function (err) {
      deferred.reject(err);
      });

      return deferred.promise;
    }


    };

})();



/**
 * Created by labrina.loving on 9/4/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('CandidateService', ['$q','$http','FIREBASE_URL', '$firebaseObject', 'fbutil', '$firebaseArray', CandidateService]);

    function CandidateService($q, $http, FIREBASE_URL, $firebaseObject, fbutil, $firebaseArray, CandidateService) {
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
            var ref = new Firebase(FIREBASE_URL);
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
        .factory('GeocodeService', ['$q', '$http', 'GOOGLEMAPSURL', 'FIREBASE_URL', GeocodeService]);

    function GeocodeService($q, $http, GOOGLEMAPSURL, FIREBASE_URL) {
        var mapsEndPoint = GOOGLEMAPSURL;
        var currentPlace = null;

        var service =  {
            getPlacebyLatLong : getPlacebyLatLong,
            getPlacebyPlaceId : getPlacebyPlaceId,
            getPlace: getPlace,
            setPlace: setPlace,
            calculateDistancetoSite: calculateDistancetoSite,
            getCityBySearchQuery: getCityBySearchQuery,
            getLocationBySearchQuery: getLocationBySearchQuery,
            geoCodeAddress: geoCodeAddress,
            getPlaceDetails: getPlaceDetails
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
            var firebaseRef = new Firebase(FIREBASE_URL + '/businessSiteLocation');
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


        function getCityBySearchQuery(query){
            var deferred = $q.defer();

            $http.get('/api/search/cities/'+ query)
              .success(function(data) {
                  console.log(data);
                  currentPlace = data;
                  deferred.resolve(data);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });

            return deferred.promise;
        }


        function getLocationBySearchQuery(query){
            var deferred = $q.defer();

            $http.get('/api/search/locations/'+ query)
              .success(function(data) {
                  console.log(data);
                  currentPlace = data;
                  deferred.resolve(data);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });

            return deferred.promise;
        }

        function geoCodeAddress(query){
            var deferred = $q.defer();

            $http.get('/api/geocode/'+ query)
              .success(function(data) {
                  currentPlace = data;
                  deferred.resolve(data);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });

            return deferred.promise;
        }

        function getPlaceDetails(query){
            var deferred = $q.defer();

            $http.get('/api/places/'+ query)
              .success(function(data) {
                  currentPlace = data;
                  deferred.resolve(data);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });

            return deferred.promise;
        }


    }


})();

/**
 * Created by mike.baker on 9/25/2015.
 */


(function () {
  'use strict';

  angular.module('hirelyApp.manager')
    .service('JobService', ['$q', 'FIREBASE_URL', '$firebaseObject', 'fbutil', JobService]);

  function JobService($q, FIREBASE_URL, $firebaseObject, fbutil, JobService) {
    var self = this;
    var ref = new Firebase(FIREBASE_URL + '/job');

    /*
    var onComplete = function (error) {
      if (error) {
        throw new Error('Storing new job failed' + error);
      } else {
        console.log('success.');
      }
    };*/

    

    /**
         *
         * for jobData refer to: Job model
         *
    **/

    this.createNewJob = function createNewJob(jobData) {

      var id = generatePushID();
      var job = new Job(
        jobData.businessId,
        jobData.hiringManager,
        jobData.position,
        jobData.numberOfPositions,
        jobData.occupationId,
        jobData.description,
        jobData.createdAt,
        jobData.updatedAt,
        jobData.available
      );

      ref.child(id).set(job, function(error){
        if (! error)
          console.log('success');
        else
          console.log('error');  
      });
    }


    // retrieve job by its ID
     this.getJobById = function getJobById(id)
    { 
      var deferred = $q.defer();
      var user = {};
      var url = new Firebase(FIREBASE_URL + "/job/" + id);
      url.on("value", function(snapshot) {
        user = snapshot.val();
        deferred.resolve(user);
      }, function (err) {
      deferred.reject(err);
      });

      return deferred.promise;
    }


  };

})();



(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .service('OccupationService', ['$q', '$http', OccupationService]);

  function OccupationService($q, $http) {

    /*
    * Search occupation by search query term
    * HTTP function: GET
    * Endpoint: /api/onet/titles/search/:query
    * Return: Promise with 1 to 5 matching results
    * */
    this.getOccupations = function getOccupations(query) {
      var deferred = $q.defer();

      $http.get('/api/onet/titles/search/' + query)
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });

      return deferred.promise;
    }
  };
})();


/**
 * Created by Zouhir Chahoud
 *
 * Traitify Personality Analysis - more info: https://developer.traitify.com
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .factory('TraitifyService', ['$http', '$q', TraitifyService]);

  function TraitifyService($http, $q) {

    function getAssessmentId(){
      var deferred = $q.defer();

      $http.get('/api/traitify/assesment-id')
        .success(function (data) {
          console.log(data);
          deferred.resolve(data);
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });

      return deferred.promise;
    }

    return {
      getAssessmentId: getAssessmentId
    }

  }
})();

(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .service('UserService', ['$rootScope', '$q', 'FIREBASE_URL', '$firebaseObject', 'fbutil', '$firebaseAuth', UserService]);

  function UserService($rootScope, $q, FIREBASE_URL, $firebaseObject, fbutil, $firebaseAuth, UserService) {
    var self = this;
    var baseRef = new Firebase(FIREBASE_URL);
    var ref = new Firebase(FIREBASE_URL + "/users");
    var auth = $firebaseAuth(baseRef);


    this.createUserfromThirdParty = function createUserfromThirdParty(provider, authData) {
      var deferred = $q.defer();
      var user;

      //get proper user for provider
      switch (provider) {
        case 'facebook':
          user = createFacebookUser(authData);
          break;
        case 'google':
          user = createGoogleUser(authData);
          break;
      }

      //check if user previously exists
      this.getUserByKey(authData.uid)
        .then(function (snapshot) {
          var exists = (snapshot.val() != null);
          if (!exists) {
            self.createUserinFirebase(user, authData.uid)

          }
          deferred.resolve(user);
        }, function (err) {
          deferred.reject(err);
        });

      return deferred.promise;

    };


    this.createRegisteredNewUser = function createRegisteredNewUser(userData, providerId) {

      var deferred = $q.defer();


      var timestamp = Firebase.ServerValue.TIMESTAMP;

      var firstName = userData.firstName;
      var lastName = userData.lastName;
      var email = userData.email;
      var userType = userData.userType;
      var profileImageUrl = userData.profileImageUrl;
      var provider = 'password';
      var createdOn = timestamp;
      var lastModifiedOn = timestamp;
      var personalStatement = userData.personalStatement;
      var address = userData.address;

      var user = new User(firstName, lastName, email, userType,
        profileImageUrl, personalStatement,
        provider, createdOn, lastModifiedOn, address);

      self.createUserinFirebase(user, providerId);


      deferred.resolve(user);
      return deferred.promise;

    };

    this.registerNewUser = function registerNewUser(email, password) {

      var deferred = $q.defer();
      auth.$createUser({
        email: email,
        password: password
      })
        .then(function (user) {
          deferred.resolve(user);
        }, function (err) {
          deferred.reject(err);
        });


      return deferred.promise;
    };


    /**
     *
     * for userData refer to: User model
     *
     * for authId refer to USR_ID
     *
     *
     **/

    this.createNewUser = function createNewUser(userData, authId) {

      var id = authId;

      var pAddress = userData.address || {};
      var pEducation = userData.education || {};
      var pExperience = userData.experience || {};

      var user = new User(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.userType,
        userData.profileImageUrl,
        userData.personalStatement,
        userData.provider,
        userData.createdOn,
        userData.lastModifiedOn,
        userData.address,
        userData.experience,
        userData.education
      );

      /*****
       *
       * Uncomment When needed.
       *
       * ***/

      /*
       var address = new Address (
       pAddress.formattedAddress,
       pAddress.zipCode,
       pAddress.unit,
       pAddress.street,
       pAddress.city,
       pAddress.state,
       pAddress.lng,
       pAddress.lat
       );


       var education = new Education (
       pEducation.programType,
       pEducation.institutionName,
       pEducation.degree,
       pEducation.city,
       pEducation.state,
       pEducation.startMonth,
       pEducation.startYear,
       pEducation.endMonth,
       pEducation.endYear,
       pEducation.current
       );

       var experience = new Experience (
       pExperience.position,
       pExperience.employer,
       pExperience.empolyerPlaceId,
       pExperience.city,
       pExperience.state,
       pExperience.startMonth,
       pExperience.startYear,
       pExperience.endMonth,
       pExperience.endYear,
       pExperience.current,
       pExperience.accomplishments
       );

       */
      ref.child(id).set(user, function (error) {
        if (error)
          console.log("error");
        else {
          ref.child(id).child('experience').set(experience);
          ref.child(id).child('education').set(education);
          ref.child(id).child('address').set(address);
          console.log("Success");
        }

      });

    };


    this.getUserById = function getUserById(id) {
      var deferred = $q.defer();
      var user = {};
      var url = new Firebase(FIREBASE_URL + "/users/" + id);
      url.on("value", function (snapshot) {
        user = snapshot.val();
        deferred.resolve(user);
      }, function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    };




    function createFacebookUser(fbAuthData) {
      var timestamp = Firebase.ServerValue.TIMESTAMP;
      var firstName = fbAuthData.facebook.cachedUserProfile.first_name;
      var lastName = fbAuthData.facebook.cachedUserProfile.last_name;
      var email = fbAuthData.facebook.email;
      var userType = '';
      var profileImageUrl = "http://graph.facebook.com/" + fbAuthData.facebook.id + "/picture?width=300&height=300";
      var provider = fbAuthData.provider;
      var createdOn = timestamp;
      var lastModifiedOn = timestamp;
      var personalStatement = '';
      var address = new Address(fbAuthData.facebook.address);
      var experience = {};
      var education = {};

      var user = new User(firstName, lastName, email, userType,
        profileImageUrl, personalStatement,
        provider, createdOn, lastModifiedOn, address, experience, education);


      return user;

    };

    function createGoogleUser(googleAuthData) {
      var timestamp = Firebase.ServerValue.TIMESTAMP;
      var firstName = googleAuthData.google.cachedUserProfile.given_name;
      var lastName = googleAuthData.google.cachedUserProfile.family_name;
      var email = googleAuthData.google.email;
      var userType = '';
      var profileImageUrl = googleAuthData.google.profileImageURL;
      var provider = fbAuthData.provider;
      var createdOn = timestamp;
      var lastModifiedOn = timestamp;
      var personalStatement = '';
      var address = new Address(googleAuthData.google.address);
      var experience = {};
      var education = {};

      var user = new User(firstName, lastName, email, userType,
        profileImageUrl, personalStatement,
        provider, createdOn, lastModifiedOn, address, experience, education);

      return user;

    };

  }


})();

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
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

angular.module('hirelyApp.manager').directive('autoFillableField', [
  '$timeout',
  function($timeout) {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, ngModel) {

        $timeout(function() {
          if (ngModel.$viewValue !== element.val()) {
            ngModel.$setViewValue(element.val());
          }
        }, 100);
      }
    };
  }
]);

})();
/**
 * Created by mike.baker on 10/3/2015.
 */
(function () {
    'use strict';

   var app = angular.module('hirelyApp.manager').controller('HMCompanyCtrl', ['$scope', '$state', '$modal',  '$firebaseArray', 'FBURL', '$stateParams', 'FilePickerService', 'filePickerKey', 
        'GeocodeService', 'UserService', 'OccupationService', 'CandidateService', 'BusinessService', 'Notification', 'PositionService', HMCompanyCtrl]);

    function HMCompanyCtrl($scope, $state, $modal, $firebaseArray, FBURL, $stateParams, FilePickerService, filePickerKey, GeocodeService, UserService, OccupationService, CandidateService, BusinessService, Notification, PositionService) {
        var managerId = '';
        var businessRef = new Firebase(FBURL + '/business');
        var businessSiteRef = new Firebase(FBURL + '/businessSite');
        var photoRef = new Firebase(FBURL + '/businessPhotos');
        var positionRef = new Firebase(FBURL + '/position');
        var occupationRef = new Firebase(FBURL + "/onetOccupation")
        var vm = this;
        var currentUser = BusinessService;
        var businessService = BusinessService;
        var candidateService = CandidateService;
        var filePickerService = FilePickerService;
        var geocodeService = GeocodeService;
        var occupationService = OccupationService;
        var positionService = PositionService;
        var userService = UserService;

        $scope.occupations = [];
        $scope.occupations = occupationRef;
        $scope.companies = $firebaseArray(businessSiteRef);
        $scope.pictures = $firebaseArray(photoRef);
        $scope.split_jobs = ['job1', 'job2', 'job3'];
 
        $scope.HiringManager = currentUser.getCurrentUser();
	   
        $scope.results = '';
        $scope.options = {
            types: '(regions)'
        };

        $scope.positions = [];

        $scope.filter = {
          distance: ($stateParams.distance) ? $stateParams.distance : 20,
          minWage: ($stateParams.wage) ? $stateParams.wage : 0,
          occupationId: ($stateParams.occupationId) ? $stateParams.occupationId : '',
          occupation: ''

        };

        $scope.occupation = '';
        $scope.details = '';
       
        $scope.placeId = $stateParams.placeId;

        $scope.error = '';

        
        $scope.business = {name: '', description: '', status: '', street_number: '', route: '', locality: '', administrative_area_level_1: '', 
        postal_code: '', country: '', latitude: '', longitude: '', webaddress: '', open_store_hours0: '', 
        closed_store_hours0: '', open_store_hours1: '', closed_store_hours1: '', open_store_hours2: '', closed_store_hours2: '', 
        open_store_hours3: '', closed_store_hours3: '', open_store_hours4: '', closed_store_hours4: '', open_store_hours5: '', 
        closed_store_hours5: '', open_store_hours6: '', closed_store_hours6: ''}

       $scope.job = {occupation: '', LayName: '', Feature: '', mon_morning: '', mon_afternoon: '', mon_evening: '', tues_morning: '', 
        tues_afternoon: '', tues_evening: '', wed_morning: '', wed_afternoon: '', wed_evening: '', thurs_morning: '', thurs_afternoon: '', thurs_evening: '', 
        fri_morning: '', fri_afternoon: '', fri_evening: '', sat_morning: '', sat_afternoon: '', sat_evening: '', sun_morning: '', sun_afternoon: '', sun_evening: '', 
        MinHours: '', MaxHours: '', MinSalary: '', MaxSalary: '', medical: '', vision: '', discounts: '', dental: '', life: '', stock: '', flexibleSchedule: '', retirement: ''}
       


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
 
    
       $scope.positions = $firebaseArray(positionRef);
       app.run(function(editableOptions) {
        editableOptions.theme = 'bs3';
       });

     

        if($scope.profile && $scope.profile.availability){
            $scope.schedule = $scope.profile.availability;
        }


        function onSuccess(Blob){
            $scope.companies.profileImageUrl = Blob.url;
            $scope.business.profileImageUrl = Blob.url;
            $scope.$apply();
        };

        $scope.registerNewBus = function() {
            submitBusinessProfile($scope.business, $scope.HiringManager)
        }

        function submitBusinessProfile(newbusinessObj, managerId) {
            businessService.createNewBusiness(newbusinessObj, managerId);
            $state.go('app.hmDashboard');
        }
    
        $scope.createNewPosition = function() {
            createNewSitePosition($scope.job, $scope.HiringManager)
        }

        function createNewSitePosition(newbusinessObj, managerId) {
            businessService.createNewSitePosition(newbusinessObj, managerId);
            $modalInstance.close();
            $state.go('app.hmPosition');
        }
    
        $scope.hmaddposition = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/manager/company/hmAddPosition.html',
                controller: 'HMCompanyCtrl as vm',
                
            });
        };

     
}


})();

/**
 *
 * Generic Address Model Used for Business and Users
 *
 * Our address model is based on: https://developers.google.com/maps/documentation/geocoding/intro?csw=1#Types
 *
 * */

Address = Model({
  initialize: function (formattedAddress, zipCode, unit, street, city, state, lng, lat){
    this.formattedAddress = formattedAddress || '';
    this.zipCode = zipCode || '';
    this.unit = unit || '';
    this.street = street || '';
    this.city = city || '';
    this.state = state || '';
    this.lng = lng || '';
    this.lat = lat || '';
  }
});
/**
 *
 * Business Model
 * --- Photo Model
 *
 * Job Model
 *
 * */

Business = Model({

  initialize: function (name, description, admin, type, active, placeId, website ,photo , address , contact ){
    this.name = name;
    this.description = description;
    this.admin = admin
    this.type = type;
    this.active = active;
    this.placeId = placeId;
    this.website = website;
    this.photo = photo || {};
    this.address = address || {};
    this.contact = contact || {};
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
  initialize: function (businessId, hiringManager, position, numberOfPositions, occupationId, description, createdAt, updatedAt, available){
    this.businessId = businessId;
    this.hiringManager = hiringManager;
    this.position = position;
    this.numberOfPositions = numberOfPositions;
    this.occupationId = occupationId;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.available = available;
  }
});

/**
 *
 * Generic Contact Model Used for Business and Users
 *
 * */

Contact = Model({
  initialize: function (email, mobile, phone, other){
    this.email = email || '';
    this.mobile = mobile || '';
    this.phone = phone || '';
    this.other = other || '';
  }
});
/**
 *
 * Base Model Generator
 *
 * */

Model = function(methods) {
  var baseModel = function() {
    this.initialize.apply(this, arguments);
  };

  for (var property in methods) {
    baseModel.prototype[property] = methods[property];
  }

  if (!baseModel.prototype.initialize) baseModel.prototype.initialize = function(){};

  return baseModel;
};
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
                        provider, createdOn, lastModifiedOn , address , experience , education) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.userType = userType;
    this.profileImageUrl = profileImageUrl;
    this.personalStatement = personalStatement;
    this.provider = provider;
    this.createdOn = createdOn;
    this.lastModifiedOn = lastModifiedOn;
    this.address = address || {} ;
    this.experience = experience || {} ;
    this.education = education || {};
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
