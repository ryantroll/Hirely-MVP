/* ======= Animations ======= */
$(document).ready(function() {

    //Only animate elements when using non-mobile devices    
    if (isMobile.any === false) { 

        /* Animate elements in #promo (homepage) */
        $('#promo .intro .title').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInLeft delayp1');}
        });
        $('#promo .intro .summary').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInRight delayp3');}
        });
        
        
        /* Animate elements in #why (homepage) */
        /*
        $('#why .benefits').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInLeft delayp1');}
        });

        $('#why .testimonials').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInRight delayp3');}
        });
        
         $('#why .btn').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp6');}
        });
        */
        
        
        /* Animate elements in #video (homepage) */
        $('#video .title').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInLeft delayp1');}
        });
        
        $('#video .summary').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInRight delayp3');}
        });
        
        
        /* Animate elements in #faq */
        /*
        $('#faq .panel').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp1');}
        });
        
        $('#faq .more').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp3');}
        });
        */
    
        
        /* Animate elements in #features-promo */
        $('#features-promo .title').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInLeft delayp1');}
        });
        
        $('#features-promo .features-list').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInRight delayp3');}
        });
        
        /*
        $('#features-promo .video-container').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp6');}
        });
        
        $('#features .from-left').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInLeft delayp1');}
        });
        
        $('#features .from-right').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInRight delayp3');}
        });
        */
        
        /* Animate elements in #price-plan */
        $('#price-plan .price-figure').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp1');}
        });
        
        $('#price-plan .heading .label').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInDown delayp6');}
        });
        
        /* Animate elements in #blog-list */
        /*
        $('#blog-list .post').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp1');}
        });
        */
        
        /* Animate elements in #contact-main */
        $('#contact-main .item .icon').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp1');}
        });
        
         /* Animate elements in #signup */
        
        $('#signup .signup-form').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp1');}
        });
    }
        
});
$(document).ready(function() {

    /* ======= Fixed header when scrolled ======= */

    $(window).bind('scroll', function() {
        if ($(window).scrollTop() > 0) {
            $('#header').addClass('navbar-fixed-top');
        }
        else {
            $('#header').removeClass('navbar-fixed-top');
        }
    });

});
/* =================================
 ===  WOW ANIMATION             ====
 =================================== */

new WOW().init();

/**
 * Created by labrina.loving on 8/8/2015.
 */
(function() {
    'use strict';

    angular.module('hirelyApp.account', []);
})();
/**
 * Created by labrina.loving on 8/8/2015.
 */
(function() {
    'use strict';

    angular.module('hirelyApp.core', []);
})();

/**
 * Created by labrina.loving on 8/16/2015.
 */

(function() {
    'use strict';

    angular.module('hirelyApp.candidate', []);
})();

/**
 * Created by labrina.loving on 8/5/2015.
 */

(function() {
    'use strict';

    angular.module('hirelyApp.home', []);
})();


/**
 * Created by mike.baker on 8/10/2015.
 */

(function() {
    'use strict';

    angular.module('hirelyApp.job', []);
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
(function() {
    'use strict';

    angular.module('hirelyApp.layout', []);
})();
/**
 * Created by labrina.loving on 8/5/2015.
 */
(function() {
    'use strict';

    angular.module('hirelyApp.shared', []);
})();

'use strict';

var myApp = angular.module('hirelyApp',
    [   
        'uiGmapgoogle-maps',
        'ui.router',
        'ui.bootstrap',
        'ui.grid',
        'firebase',
        'ngMask',
        'tc.chartjs',
        'hirelyApp.layout',
        'hirelyApp.home',
        'hirelyApp.shared',
        'hirelyApp.job',
        'hirelyApp.jobdetails',
        'hirelyApp.core',
        'hirelyApp.account',
        'hirelyApp.candidate'
    ])



    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/layout/master.html');
                }
            })
            .state('app.home', {
                url: '/home',
                parent: 'app',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/home/home.html');
                },
                controller: 'HomeCtrl'
            })
            .state('app.login', {
                url: '/login',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/account/login.html');
                },
                controller: 'LoginCtrl'
            })
            .state('app.job', {
                url: '/job',
                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/job/jobs.html');
                },
                controller: 'JobCtrl'
            })
            .state('app.jobdetails', {
                url: '/jobdetails',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/jobdetails/jobDetails.html');
                },
                controller: 'JobCtrl'
            })
            .state('app.register', {
                url: '/register',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/account/register.html');
                },
                controller: 'RegisterCtrl'
            })
            .state('app.candidate', {
                url: '/candidate',
                abstract: true,

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/candidate.html');
                },
                authRequired: true,
                controller: 'CandidateCtrl'
            })
            .state('app.candidate.dashboard', {
                url: '/dashboard',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/candidate-dashboard.html');
                },
                controller: 'CandidateDashboardCtrl',
                authRequired: true
            })
            .state('app.candidate.profile', {
                abstract: true,
                url: '/profile',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/candidate-profile.html');
                },
                authRequired: true
                // controller: 'CandidateProfileCtrl'
            })
            .state('app.candidate.profile.basics', {
                url: '/basics',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/candidate-profile-basics.html');
                },
                controller: 'CandidateProfileBasicsCtrl',
                authRequired: true
            })
            .state('app.candidate.profile.availability', {
                url: '/Availability',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/candidate-profile-availability.html');
                },
                //controller: 'CandidateProfileCtrl',
                authRequired: true
            })
            .state('app.candidate.profile.experience', {
                url: '/Experience',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/candidate-profile-experience.html');
                },
                // controller: 'CandidateProfileCtrl',
                authRequired: true
            })
            .state('app.candidate.profile.personality', {
                url: '/candidateProfileEducation',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/candidate-profile-education.html');
                },
                //  controller: 'CandidateProfileCtrl',
                authRequired: true
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });

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

    angular.module('hirelyApp.account').controller('RegisterCtrl', ['$scope','$stateParams','$modalInstance', 'AuthService', 'UserService', RegisterCtrl ]);

    function RegisterCtrl($scope, $stateParams,  $modalInstance,AuthService, UserService) {

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
        function thirdPartyLogin(provider, scope) {

            var deferred = $q.defer();
            firebaseRef.$authWithOAuthPopup(provider, scope)
                .then(function(user) {
                   deferred.resolve(user);
                }, function(err) {
                  deferred.reject(err);
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
 * Created by labrina.loving on 8/14/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('GeocodeService', ['$q', '$http', 'GOOGLEMAPSURL', GeocodeService]);

    function GeocodeService($q, $http, GOOGLEMAPSURL) {
        var MAPS_ENDPOINT = GOOGLEMAPSURL;
        var currentPlace = null;

        var service =  {
            getPlacebyLatLong : getPlacebyLatLong,
            getPlace: getPlace,
            setPlace: setPlace
        };
        return service;

        function getPlacebyLatLong(latitude, longitude){
            var url = MAPS_ENDPOINT.replace('{POSITION}', latitude + ',' + longitude);
            var deferred = $q.defer();


            $http.get(url).success(function(response) {
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

        function setPlace(place)
        {
            if(place && place.geometry.location.G)
            {
                place.geometry.location.lat = place.geometry.location.G;
                place.geometry.location.lng = place.geometry.location.K;
            }

            currentPlace = place;
        }

        function getPlace()
        {
            return currentPlace;
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
                    if (toState.authRequired && !UserService.getIsLoggedIn()){
                        // User isn�t authenticated
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


angular.module("hirelyApp").run(["$templateCache", function($templateCache) {$templateCache.put("app/account/login.html","<div class=modal-login><div class=modal-header><button type=button class=close data-dismiss=modal aria-hidden=true ng-click=vm.CloseModal()>&times;</button><h4 id=loginModalLabel class=\"modal-title text-center\">Log in to your account</h4></div><div class=modal-body><div><i class=\"fa fa-alert-icon\"></i></div><div class=\"social-login text-center\"><ul class=\"list-unstyled social-login\"><li><button class=\"facebook-btn btn\" type=button ng-click=vm.FbLogin()><i class=\"fa fa-facebook\"></i>Log in with Facebook</button></li><li><button class=\"twitter-btn btn\" type=button><i class=\"fa fa-twitter\"></i>Log in with Twitter</button></li><li><button class=\"google-btn btn\" type=button><i class=\"fa fa-google-plus\"></i>Log in with Google</button></li></ul></div><div class=divider><span>Or</span></div><div class=login-form-container><form class=login-form name=loginForm ng-submit=vm.PasswordLogin()><div class=\"form-group email\"><label class=sr-only for=loginEmail>Your email</label> <input id=loginEmail name=loginEmail type=email class=\"form-control login-email\" placeholder=\"Your email\" required ng-model=user.email><div role=alert><span class=error ng-show=\"loginForm.loginEmail.$error.required && !loginForm.loginEmail.$pristine\">Email is required</span> <span class=error ng-show=loginForm.loginEmail.$error.email>Invalid email format</span></div></div><div class=\"form-group password\"><label class=sr-only for=loginPassword>Password</label> <input id=loginPassword name=loginPassword type=password class=\"form-control login-password\" placeholder=Password required ng-minlength=6 ng-maxlength=12 ng-model=user.password><div role=alert><span class=error ng-show=\"loginForm.loginPassword.$error.required && !loginForm.loginPassword.$pristine\">Password is required</span> <span class=error ng-show=\"loginForm.loginPassword.$error.minlength || loginForm.loginPassword.$error.maxlength\">Password should be between 6 and 12 characters</span></div><p class=forgot-password><a href=# id=resetpass-link data-toggle=modal data-target=#resetpass-modal>Forgot password?</a></p></div><button type=submit class=\"btn btn-block btn-cta-primary\" ng-disabled=!loginForm.$valid>Log in</button><div class=\"checkbox remember\"><label><input type=checkbox> Remember me</label></div></form></div></div><div class=modal-footer><p>New to hirely? <a class=signup-link id=signup-link href=#>Sign up now</a></p></div></div>");
$templateCache.put("app/account/register.html","<div class=modal-signup><div class=modal-header><button type=button class=close data-dismiss=modal aria-hidden=true ng-click=vm.CloseModal()>&times;</button><h4 id=signupModalLabel class=\"modal-title text-center\">Want to Join hirely? Sign up now.</h4><p class=\"intro text-center\">It only takes 3 minutes!</p><p></p></div><div class=modal-body><div class=\"social-login text-center\"><ul class=\"list-unstyled social-login\"><li><button class=\"facebook-btn btn\" type=button ng-click=vm.FbRegister()><i class=\"fa fa-facebook\"></i>Sign up with Facebook</button></li><li><button class=\"twitter-btn btn\" type=button><i class=\"fa fa-twitter\"></i>Sign up with Twitter</button></li><li><button class=\"google-btn btn\" type=button ng-click=vm.GoogleRegister()><i class=\"fa fa-google-plus\"></i>Sign up with Google</button></li></ul></div><div class=divider><span>Or</span></div><div class=login-form-container><form name=loginForm class=login-form ng-submit=vm.registerNewUser()><div class=\"form-group firstName\"><label class=sr-only for=signupfirstName>First Name</label> <input id=signupfirstName name=signupfirstName type=text class=\"form-control login-email\" required placeholder=\"First Name\" ng-model=user.firstName><div role=alert><span class=error ng-show=\"loginForm.signupfirstName.$error.required && !loginForm.signupfirstName.$pristine\">First Name is required</span></div></div><div class=\"form-group lastName\"><label class=sr-only for=signuplastName>last Name</label> <input id=signuplastName name=signuplastName type=text class=\"form-control login-email\" required placeholder=\"Last Name\" ng-model=user.lastName><div role=alert><span class=error ng-show=\"loginForm.signuplastName.$error.required && !loginForm.signuplastName.$pristine\">Last Name is required</span></div></div><div class=\"form-group email\"><label class=sr-only for=signupEmail>Your email</label> <input id=signupEmail name=signupEmail type=email class=\"form-control login-email\" required placeholder=\"Your email\" ng-model=user.email><div role=alert><span class=error ng-show=\"loginForm.signupEmail.$error.required && !loginForm.signupEmail.$pristine\">Email is required</span> <span class=error ng-show=loginForm.signupEmail.$error.email>Invalid email format</span></div></div><div class=\"form-group password\"><label class=sr-only for=signupPassword>Your password</label> <input id=signupPassword name=signupPassword type=password class=\"form-control login-password\" ng-minlength=6 ng-maxlength=12 required placeholder=Password ng-model=user.password><div role=alert><span class=error ng-show=\"loginForm.signupPassword.$error.required && !loginForm.signupPassword.$pristine\">Password is required</span> <span class=error ng-show=\"loginForm.signupPassword.$error.minlength || loginForm.signupPassword.$error.maxlength\">Password should be between 6 and 12 characters</span></div></div><button type=submit class=\"btn btn-block btn-cta-primary\" ng-disabled=!loginForm.$valid>Sign up</button><p class=note>By signing up, you agree to our terms of services and privacy policy.</p></form></div></div><div class=modal-footer><p>Already have an account? <a class=login-link id=login-link href=#>Log in</a></p></div></div>");
$templateCache.put("app/candidate/candidate-dashboard.html","<div class=profile-body><div class=\"row margin-bottom-10\"><div class=\"col-sm-6 sm-margin-bottom-20\"><div class=\"service-block-v3 service-block-u\"><i class=\"fa fa-user fa-3x\"></i><div class=profile-card-info><h3>{{user.firstName}}</h3><small>Bethesda, MD USA</small></div><div><canvas tc-chartjs-doughnut chart-options=options chart-data=data></canvas></div><div class=\"clearfix profile-stat-info\"><h4><span class=counter>17</span><span>Jobs Applied</span></h4></div></div></div><div class=col-sm-6><div class=\"service-block-v3 service-block-blue\"><i class=\"fa fa-gears\"></i><h5>You are a</h5><h3>Visionary/Analyzer</h3><div class=\"clearfix margin-bottom-10\"></div><div class=\"row margin-bottom-10\"><div class=\"col-xs-6 service-in\"><div class=panel-body><span>Top Skills</span> <small>HTML/CSS</small> <small>92%</small><div class=\"progress progress-u progress-xxs\"><div style=\"width: 92%\" aria-valuemax=100 aria-valuemin=0 aria-valuenow=92 role=progressbar class=\"progress-bar progress-bar-u\"></div></div><small>.Net</small> <small>85%</small><div class=\"progress progress-u progress-xxs\"><div style=\"width: 85%\" aria-valuemax=100 aria-valuemin=0 aria-valuenow=77 role=progressbar class=\"progress-bar progress-bar-u\"></div></div><small>Javascript</small> <small>77%</small><div class=\"progress progress-u progress-xxs\"><div style=\"width: 77%\" aria-valuemax=100 aria-valuemin=0 aria-valuenow=85 role=progressbar class=\"progress-bar progress-bar-u\"></div></div></div></div><div class=\"col-xs-6 service-in\"><div class=panel-body><span>Top Traits</span> <small>Visionary</small> <small>78%</small><div class=\"progress progress-u progress-xxs\"><div style=\"width: 78%\" aria-valuemax=100 aria-valuemin=0 aria-valuenow=92 role=progressbar class=\"progress-bar progress-bar-u\"></div></div><small>Analyzer</small> <small>72%</small><div class=\"progress progress-u progress-xxs\"><div style=\"width: 72%\" aria-valuemax=100 aria-valuemin=0 aria-valuenow=77 role=progressbar class=\"progress-bar progress-bar-u\"></div></div><small>Mentor</small> <small>72%</small><div class=\"progress progress-u progress-xxs\"><div style=\"width: 72%\" aria-valuemax=100 aria-valuemin=0 aria-valuenow=85 role=progressbar class=\"progress-bar progress-bar-u\"></div></div></div></div></div><div class=\"clearfix profile-stat-trait\"><h4><span class=counter>150</span><span>Companies are looking for you</span></h4></div></div></div></div><hr><div class=\"panel space-4\"><div class=panel-header><i class=\"fa fa-files-o\"></i> Recent Applications</div><div class=panel-body><div id=gridRecentApps ui-grid=uiGridOptions class=grid></div></div></div></div>");
$templateCache.put("app/candidate/candidate-profile-availability.html","<!DOCTYPE html><html lang=en><head><meta charset=UTF-8><title></title></head><body></body></html>");
$templateCache.put("app/candidate/candidate-profile-basics.html","<form class=form-layout name=candidateForm id=user-profile-form ng-submit=submitProfile()><div class=form-group><figure class=profile-pic><img class=img-circle src={{user.profileImageUrl}}> <a class=\"btn btn-primary\" href=#>Change Picture</a></figure></div><div class=form-group><label for=firstName>First Name</label> <input type=text class=form-control name=firstName ng-model=user.firstName required></div><div class=form-group><label for=name>Last Name</label> <input type=text class=form-control name=lastName ng-model=user.lastName required></div><div class=form-group><label for=email>Email</label> <input type=email class=form-control name=email ng-model=user.email required></div><div class=form-group><label for=phone>Phone</label> <input type=text class=form-control name=phone mask=\"(999) 999-9999\" clean=true ng-model=user.phone></div><div class=form-group><label for=phone>Bio (max 150 characters)</label> <textarea class=form-control name=personalStatement ng-model=user.personalStatement ng-minlength=0 ng-maxlength=150></textarea></div><div class=\"form-group row\"><div class=\"col-xs-6 col-xs-offset-3\"><button type=submit class=\"btn btn-block btn-primary\" ng-disabled=!candidateForm.$valid><i class=\"fa fa-circle-arrow-right\"></i>Next</button></div></div></form>");
$templateCache.put("app/candidate/candidate-profile-education.html","<!DOCTYPE html><html lang=en><head><meta charset=UTF-8><title></title></head><body></body></html>");
$templateCache.put("app/candidate/candidate-profile-experience.html","<!DOCTYPE html><html lang=en><head><meta charset=UTF-8><title></title></head><body></body></html>");
$templateCache.put("app/candidate/candidate-profile-personality.html","<!DOCTYPE html><html lang=en><head><meta charset=UTF-8><title></title></head><body></body></html>");
$templateCache.put("app/candidate/candidate-profile.html","<div class=row><div class=user-profile id=form-container><div class=\"page-header text-center\"><div id=status-buttons class=text-center><a ui-sref-active=active ui-sref=.basics><span>1</span> Profile</a> <a ui-sref-active=active ui-sref=.experience><span>2</span> Experience</a> <a ui-sref-active=active ui-sref=.personality><span>3</span> Personality</a> <a ui-sref-active=active ui-sref=.availability><span>4</span> Availability</a></div></div><div id=form-views ui-view></div></div></div>");
$templateCache.put("app/candidate/candidate.html","<div class=\"container content profile\" ng-controller=CandidateDashboardCtrl><div class=row><div class=\"col-md-3 md-margin-bottom-40\"><div class=profile-pic><img class=img-circle src={{user.profileImageUrl}} alt={{user.displayName}}></div><ul class=\"list-group sidebar-nav-v1 margin-bottom-40\" id=sidebar-nav-1><li class=list-group-item><a ui-sref-active=active ui-sref=app.candidate.dashboard><i class=\"fa fa-bar-chart-o\"></i> Dashboard</a></li><li class=list-group-item><a ui-sref-active=active ui-sref=app.candidate.profile.basics><i class=\"fa fa-user\"></i> Profile</a></li><li class=list-group-item><a ui-sref-active=active href=page_profile_users.html><i class=\"fa fa-files-o\"></i> Applications</a></li><li class=list-group-item><a ui-sref-active=active href=page_profile_projects.html><i class=\"fa fa-heart-o\"></i> Favorites</a></li><li class=list-group-item><a ui-sref-active=active href=page_profile_comments.html><i class=\"fa fa-gears\"></i> My Personality</a></li><li class=list-group-item><a ui-sref-active=active href=page_profile_history.html><i class=\"fa fa-cog\"></i> Settings</a></li></ul></div><div class=col-md-9 ui-view></div></div></div>");
$templateCache.put("app/job/jobs.html","<div style=width:100%;>{{details.formatted_address}} {{details.geometry.location.lat}} {{details.geometry.location.lng}}<div class=\"collapse navbar-collapse navbar-responsive-collapse\"><div class=menu-container><div class=\"job-img margin-bottom-30\"><div class=\"container text-center\"><h2>Let Hirely help you find the Job you Need ...</h2></div><hr><div class=\"grid-boxes-qoute bg-color-blue\"><div class=\"grid-boxes-caption grid-boxes-quote\"><div class=job-img-inputs><div class=container><div class=row><div class=\"col-sm-4 md-margin-bottom-10\"><div class=form-group ng-controller=JobSearchCtrl><div class=input-group><span class=input-group-addon><i class=\"fa fa-tag\"></i></span> <input type=text id=search ng-model=selected typeahead=\"job as job.Title for job in jobs | filter:{Lay_Title:$viewValue} | limitTo:15\" class=form-control ng-init placeholder=\"Find your next gig\"></div></div></div><div class=\"col-sm-4 md-margin-bottom-10\"><div class=input-group><span class=input-group-addon><i class=\"fa fa-map-marker\"></i></span> <input type=text id=Autocomplete class=form-control ng-autocomplete=results details=details ng-model=results options=options on-place-changed=getResults() required placeholder=\"Search Jobs in other Cities!!\"></div></div><div class=\"col-sm-4 md-margin-bottom-10\"><div class=input-group><span class=input-group-addon><i class=\"fa fa-search\"></i></span> <input class=form-control id=searchText ng-model=searchText googleplace placeholder=\"What Type of Job are you seeking??...\"></div></div></div></div></div></div></div><hr><div class=\"container text-left\" style=\"float:left; width:50%;\"><div id=comments_block><div class=\"container text-left\" ng-app=hirelyApp ng-controller=JobCtrl><div ng-repeat=\"job in split_jobs\" class=row><div class=col-md-5 ng-repeat=\"job in jobOpenings | orderBy:\'orderBy\'| filter:selected | filter:results | filter:searchText\"><div class=\"nf-item branding coffee spacing\"><div class=item-box><a ng-click=setJobResults(job.UID) href=#><img class=item-container src={{job.Image}} alt width=450 height=350></a><div class=absolute1><blockquote style=\"border: opx solid #666; padding: 0px; background-color: #303030;\"><h3><a ng-click=setJobResults(job.UID) href=#><font color=white>{{job.Job_Title}}</font></a></h3><h4><a ng-click=setJobResults(job.UID) href=#><font color=white>@ {{job.Company}}</font></a></h4></blockquote></div><div class=absolute2><p class=white><i class=\"fa fa-dollar-sign\"><font color=white>{{job.Wage}}</font></i><li class=\"fa fa-clock-o\"><font color=white>{{job.Shifts}}</font></li></p></div></div><div class=item-mask><div class=item-caption><hr><span style=padding-left:20px></span></div></div></div></div></div></div></div></div></div></div><div style=\"float:right; width:50%;\"><div class=container><body ng-app=hirelyApp><div class=angular-google-map-container ng-controller=MainCtrl><ui-gmap-google-map center=map.center zoom=map.zoom draggable=true options=map.options events=map.events control=googlemap><ui-gmap-window coords=markers.coords show=windowOptions.show options=windowOptions closeclick=closeClick()><div>Hello</div></ui-gmap-window><ui-gmap-markers models=markers idkey=markers.id coords=\"\'coords\'\" click=\"\'onClick\'\" events=markers.events></ui-gmap-markers><div class=col-md-5></div></ui-gmap-google-map></div></body></div></div></div></div>");
$templateCache.put("app/home/home.html","<section id=promo class=\"promo section\"><div class=fixed-container><div class=search ng-controller=HomeCtrl><div class=\"container text-center\"><h1 class=title>Opportunity Awaits</h1><form class=search-form ng-submit=getResults()><div class=form-group><input type=text id=Autocomplete class=form-control ng-autocomplete=results details=details ng-model=results options=options on-place-changed=getResults() required placeholder=\"Where\'s your next gig?\"></div><button type=submit class=\"btn btn-cta btn-cta-primary btn-search\"><span class=btn-search-inner></span></button></form></div></div></div><div class=bg-slider-wrapper><div id=bg-slider class=\"flexslider bg-slider\" flexslider><ul class=slides><li class=\"slide slide-1\"></li><li class=\"slide slide-2\"></li><li class=\"slide slide-3\"></li><li class=\"slide slide-4\"></li></ul></div></div></section><section id=why class=\"why section\"><div class=container><h2 class=\"title text-center\">We totally get it</h2><p class=\"intro text-center\">We are disrupting the way local hourly talent and small businesses connect.</p><img class=img-responsive src=img/hirely_protos.png><div class=\"row services\"><div class=\"col-lg-4 col-sm-4 focus-box red wow fadeInLeft animated\" data-wow-offset=30 data-wow-duration=1.5s data-wow-delay=0.15s><div class=service-icon><i class=\"fa fa-list fa-4x\"></i></div><h5 class=red-border-bottom>Informative Listings</h5><p>Detailed job cards show you the information that\'s most important. Hirely ensures jobs are active and informative.</p></div><div class=\"col-lg-4 col-sm-4 focus-box green wow fadeInLeft animated\" data-wow-offset=30 data-wow-duration=1.5s data-wow-delay=0.15s><div class=service-icon><i class=\"fa fa-user fa-4x\"></i></div><h5 class=green-border-bottom>Applicant Cards</h5><p>You\'re more than a resume. Applicant cards let you showcase who you are and easily apply to jobs.</p></div><div class=\"col-lg-4 col-sm-4 focus-box blue wow fadeInRight animated\" data-wow-offset=30 data-wow-duration=1.5s data-wow-delay=0.15s><div class=service-icon><i class=\"fa fa-search fa-4x\"></i></div><h5 class=blue-border-bottom>Intelligent Search</h5><p>Time is of the essence when you are looking for a job. Our technology works hard to find you to the right opportunities.</p></div></div></div></section>");
$templateCache.put("app/jobdetails/jobDetails.html","<style>\r\ndiv.stars {\r\n  width: 140px;\r\n  display: inline-block;\r\n}\r\ninput.star { display: none; }\r\n\r\nlabel.star {\r\n  float: left;\r\n  padding: 5px;\r\n  font-size: 18px;\r\n  color: #444;\r\n  transition: all .2s;\r\n}\r\n\r\ninput.star:checked ~ label.star:before {\r\n  content: \'\\f005\';\r\n  color: #FD4;\r\n  transition: all .25s;\r\n}\r\n\r\ninput.star-5:checked ~ label.star:before {\r\n  color: #FE7;\r\n  text-shadow: 0 0 20px #952;\r\n}\r\n\r\ninput.star-1:checked ~ label.star:before { color: #F62; }\r\n\r\nlabel.star:hover { transform: rotate(-15deg) scale(1.3); }\r\n\r\nlabel.star:before {\r\n  content: \'\\f006\';\r\n  font-family: FontAwesome;\r\n}\r\nIMG.displayed {\r\n    display: block;\r\n    margin-left: auto;\r\n    margin-right: auto \r\n}\r\n  P.blocktext {\r\n    margin-left: 175px;\r\n    margin-right: 0px;\r\n    width: 50em\r\n}  \r\nbody {\r\n    background-color: #FAFAFA;\r\n}\r\ndiv.absolute1 {\r\n    position: absolute;\r\n    border: 200px;\r\n    padding: 15px;\r\n    top: 250px;\r\n    left: 0;\r\n    width: 400px;\r\n    height: 50px;\r\n    border: 3px;\r\n}\r\ndiv.absolute2 {\r\n    position: absolute;\r\n    border: 200px;\r\n    padding: 15px;\r\n    top: 480px;\r\n    right: 450px;\r\n    width: 300px;\r\n    height: 200px;\r\n    border: 3px;\r\n}\r\nli {\r\n    overflow: hidden;\r\n}\r\n.buttons, .owners {\r\n    float: left;\r\n}\r\n.text {\r\n    overflow: hidden;\r\n    color: red;\r\n    padding-left: 4px;\r\n}\r\n#comments_block {\r\n   overflow-y: scroll;\r\n   overflow-x: hidden;\r\n   width: 1000px;\r\n   height: 1560px;\r\n}\r\n.angular-google-map-container { \r\n  width: 1000px;\r\n  height: 1560px;\r\n}\r\n</style><div class=wrapper><div class=\"container content\"><img class=displayed src={{job.Image}} alt width=1140 height=500><div class=absolute2 style=\"border: 10px solid #666; padding: 0px; background-color: #303030;\"><p class=white></p><h3><i class=\"fa fa-dollar-sign\"><font color=white>{{job.Wage}}</font></i><li class=\"fa fa-clock-o\"><font color=white>{{job.Shifts}}</font></li></h3></div></div><div class=job-description><div class=\"container content\"><div class=row><div class=col-md-7><div class=left-inner><div class=title-box-v2><h1>{{job.Job_Title}}</h1></div><div class=overflow-h><ul class=list-inline><li><h3>{{job.Company}}</h3></li><li><div class=stars><form action><input class=\"star star-5\" id=star-5 type=radio name=star> <label class=\"star star-5\" for=star-5></label> <input class=\"star star-4\" id=star-4 type=radio name=star> <label class=\"star star-4\" for=star-4></label> <input class=\"star star-3\" id=star-3 type=radio name=star> <label class=\"star star-3\" for=star-3></label> <input class=\"star star-2\" id=star-2 type=radio name=star> <label class=\"star star-2\" for=star-2></label> <input class=\"star star-1\" id=star-1 type=radio name=star> <label class=\"star star-1\" for=star-1></label></form></div></li></ul></div><a href=#><i class=\"position-top fa fa-print\"></i></a><div class=overflow-h><p class=hex>{{job.Location}}</p><div></div><div></div></div><hr><h4>About the Position</h4><p>This job was a great job for the pay and benefits when compared to waiting table and working fast food. I also preferred working for the vs other stores like . The biggest problem was unreasonable expectations from management. Even as one of there top employees you feel taken advantage of and over worked. Dealing with the customers was the other issue.</p><hr><h5>Total Compensation</h5><div class=overflow-h><div><ul class=list-inline><li><p class=blocktext>Wage: Hourly&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Commission: No</p></li><li><p class=blocktext>Tips: Yes</p></li></ul></div></div><hr><h5>Perks and Benefits</h5><ul class=list-unstyled><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Nullam laoreet est sit amet felis tristique laoreet</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> The biggest problem was unreasonable expectations</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Dealing with the customers was the other issue</p></li></ul><hr><h5>Typical Task</h5><p>A Wal-Mart cashier is responsible for effectively executing and adhering to the “Basic Beliefs” of the founder, Sam Walton.</p><ul class=list-unstyled><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Nullam laoreet est sit amet felis tristique laoreet</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> The biggest problem was unreasonable expectations</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Dealing with the customers was the other issue</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Nullam laoreet est sit amet felis tristique laoreet</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> The biggest problem was unreasonable expectations</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Dealing with the customers was the other issue</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Nullam laoreet est sit amet felis tristique laoreet</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> The biggest problem was unreasonable expectations</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Dealing with the customers was the other issue</p></li></ul><hr><h5>Availablity</h5></div></div><div class=col-md-5><hr><div class=right-inner><h5>About the Hiring Manager</h5><img src={{job.HM_Photo}} alt><div ng-controller=JobDetailCtrl><ul class=\"list-unstyled save-job\"><li><i class=\"fa fa-refresh fa-spin\"></i><a>Responds in 48 hours</a></li><li><i class=\"fa fa-shield\"></i><a>Member since 2015</a></li></ul><div class=container><div class=row>Click here to view all my Job Listings: <input type=checkbox text=\"Show / Hide Map\" ng-model=map.show></div><div class=row ng-if=map.show><div style=\"height:310px;width:430px;border:0px solid #ccc;font:16px/26px Georgia, Garamond, Serif; overflow:auto;\"><div ng-repeat=\"job in jobDetails | orderBy:\'orderBy\' | filter:job.Hiring_Manager\" ng-if=\"jobUID != job.UID\"><h5><input type=radio value={{job.UID}} njobid=jobUID job=favorite \'\' ng-init=\"jobUID=\'{{job.UID}}\'\" ng-model=jobUID ng-click=setJobResults(jobUID)>{{job.Job_Title}} @ {{job.Company}}</h5><ul class=\"list-inline grid-boxes-news\"><li><span>{{job.Wage}} - <i class=\"fa fa-clock-o\">- {{job.Shifts}}</i></span></li><li>|</li><li>{{job.Location}}</li></ul><hr></div></div></div></div></div><hr><ul class=\"list-unstyled save-job\"><li><i class=\"fa fa-download\"></i> <a href=#>Save job</a></li><li><i class=\"fa fa-plus\"></i> <a href=#>Follow us</a></li></ul><hr><h5>Latest Employee Recommendations</h5><div class=\"people-say margin-bottom-20\"><img src=assets/img/testimonials/img2.jpg alt><div class=overflow-h><span>{{job.Employee1}}</span> <small class=\"hex pull-right\">5 - hours ago</small><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis varius hendrerit nisl id condimentum.</p></div></div><div class=\"people-say margin-bottom-20\"><img src=assets/img/testimonials/user.jpg alt><div class=overflow-h><span>{{job.Employee2}}</span> <small class=\"hex pull-right\">2 - days ago</small><p>Vestibulum justo est, pharetra fermentum justo in, tincidunt mollis turpis. Duis imperdiet non justo euismod semper.</p></div></div><div class=people-say><img src=assets/img/testimonials/img3.jpg alt><div class=overflow-h><span>{{job.Employee3}}</span> <small class=\"hex pull-right\">3 - days ago</small><p>A Wal-Mart cashier is responsible for effectively executing and adhering to the “Basic Beliefs” of the founder.</p></div></div><hr><button type=button class=\"btn-u btn-block\"><a href=#>Apply with Resume</a></button></div></div></div></div></div></div>");
$templateCache.put("app/layout/footer.html","<footer class=footer><div class=bottom-bar><div class=container><div class=row><small class=\"copyright col-md-6 col-sm-6 col-xs-12\">Copyright @ 2015 All Rights Reserved | Privacy Policy</small><ul class=\"social col-md-6 col-sm-6 col-xs-12 list-inline\"><li><a href=https://twitter.com/hellohirely><i class=\"fa fa-twitter\"></i></a></li><li><a href=https://www.facebook.com/pages/Hirely><i class=\"fa fa-facebook\"></i></a></li><li><a href><i class=\"fa fa-envelope\"></i></a></li></ul></div></div></div></footer>");
$templateCache.put("app/layout/header.html","<header id=header class=header><div class=container ng-controller=\"HeaderCtrl as vm\"><h1 class=\"logo pull-left\"><a ui-sref=app.home><span class=logo-title>hirely</span></a></h1><nav id=main-nav class=\"main-nav navbar-right\" role=navigation><div class=navbar-header><button class=navbar-toggle type=button data-toggle=collapse data-target=#navbar-collapse><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span></button></div><div class=\"navbar-collapse collapse\" id=navbar-collapse><ul class=\"nav navbar-nav\"><li class=nav-item><a href=#>Start Hiring</a></li><li class=\"dropdown dropdown-user\" ng-show=currentUser><a href=javascript:; class=dropdown-toggle data-toggle=dropdown data-hover=dropdown data-close-others=true><div class=sign-in-divider></div><img alt class=img-circle src={{currentUser.profileImageUrl}}> <span class=\"username username-hide-on-mobile\">Hi <span ng-bind=currentUser.firstName></span></span>! <i class=\"fa fa-angle-down\"></i></a><ul class=\"dropdown-menu dropdown-menu-default\"><li><a ui-sref=app.candidate.dashboard><i class=\"fa fa-user\"></i> My Profile</a></li><li><a href=#><i class=\"fa fa-files-o\"></i> Applications</a></li><li><a href=#><i class=\"fa fa-heart\"></i> Favorites</a></li><li><a href ng-click=vm.logout()><i class=\"fa fa-lock\"></i> Log Out</a></li></ul></li><li class=nav-item ng-show=!currentUser><a ng-click=vm.login()><div class=sign-in-divider></div>Log in</a></li><li class=\"nav-item nav-item-cta last\" ng-show=!currentUser><button type=button class=\"btn btn-blue btn-cta-blue\" ng-click=vm.register()>Get Started</button></li></ul></div></nav></div></header>");
$templateCache.put("app/layout/master.html","<div class=wrapper ng-controller=\"MasterCtrl as vm\"><div header></div><div ui-view></div></div><div footer></div>");
$templateCache.put("app/layout/menu-layout.html","<ion-side-menus><ion-side-menu-content><ion-nav-bar class=\"bar-stable nav-title-slide-ios7\"><ion-nav-title class=energized><img src=img/hirely_logo.png style=\"vertical-align: middle;height:35px;margin-top:5px;margin-bottom:10px;border-radius:5px;display:inline-block;\"> <span>hirely</span></ion-nav-title><ion-nav-back-button class=button-clear><i class=\"icon ion-ios7-arrow-back\"></i> Back</ion-nav-back-button><ion-nav-buttons side=left><button menu-toggle=left class=\"button button-icon icon ion-navicon\"></button></ion-nav-buttons></ion-nav-bar><ion-nav-view name=mainContent animation=slide-left-right></ion-nav-view></ion-side-menu-content><ion-side-menu side=left expose-aside-when=large><header class=\"bar bar-header bar-stable\" ui-sref=app.login><h1 class=title>Log In</h1></header><ion-content class=has-header><ion-list><ion-item nav-clear menu-close ui-sref=app.register>Join Hirely</ion-item><ion-item nav-clear menu-close>Find a Job</ion-item><ion-item nav-clear menu-close>Start Hiring</ion-item><ion-item nav-clear menu-close>How It Works</ion-item></ion-list></ion-content></ion-side-menu></ion-side-menus>");}]);
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
            this.provider =  '';
            this.providerId = '';
            this.createdOn = '';
            this.lastModifiedOn = '';

        }


        this.getCurrentUser = function getCurrentUser() {
           return currentUser;
        };

        this.getIsLoggedIn =  function getIsLoggedIn(){
            return isLoggedIn;
        };

        this.setCurrentUser = function setCurrentUser(user, userId){
            currentUser = user;
            currentUserId = userId;
        };

        this.setIsLoggedIn = function setIsLoggedIn(aisLoggedIn){
            isLoggedIn = aisLoggedIn;

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
        }


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
            fbUser.profileImageUrl =  fbAuthData.facebook.cachedUserProfile.picture;
            fbUser.email = fbAuthData.facebook.email;
            fbUser.provider = fbAuthData.provider;
            fbUser.providerId = fbAuthData.uid;
            fbUser.createdOn = timestamp;
            fbUser.lastModifiedOn = timestamp;

            return fbUser;

        }
    }
})();

/**
 * Created by labrina.loving on 8/26/2015.
 */
/**
 * Created by labrina.loving on 8/16/2015.
 */
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

        $scope.saveUser = function() {
           userService.saveUser($scope.user)
        }
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
 * Created by labrina.loving on 8/28/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateProfileBasicsCtrl', ['$scope','$state','$stateParams', 'UserService', CandidateProfileBasicsCtrl ]);


    function CandidateProfileBasicsCtrl($scope, $state,$stateParams, UserService) {
        var userService = UserService;
        var vm = this;


        $scope.submitProfile = function() {
            userService.saveUser($scope.user);
            $state.go('app.candidate.profile.experience');
        }
    }
})()
;



(function () {
    'use strict';

    angular.module('hirelyApp.home').controller('HomeCtrl', ['$scope', '$state', '$stateParams', 'GeocodeService', HomeCtrl ]);

    function HomeCtrl ($scope, $state, $stateParams, GeocodeService) {
        var geocodeService = GeocodeService;

        $scope.results = '';
        $scope.options = {
            types: '(regions)'
        };

        $scope.details = '';


        $scope.getResults = function() {
            geocodeService.setPlace($scope.details);
            $state.go('app.job')

        }

    }
})();

/**
 * Created by mike.baker on 8/9/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.job').controller('JobSearchCtrl', ['$scope', '$http', '$location', '$log', '$timeout', '$state', '$stateParams', JobSearchCtrl ]);


  function JobSearchCtrl($scope, $http, $location, $log, $timeout, $state, $stateParams) {

  $scope.selected = undefined;
    $scope.jobs = [];
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
		$scope.split_jobs = [['job1', 'job2', 'job3']];

        $scope.details = geocodeService.getPlace();
        $scope.jobdetails = $scope.jobOpenings;
      

        $scope.setJobResults = function(jobUID) {
             jobdetailsService.setJob(jobUID);
            $state.go('app.jobdetails')

        }

      
 }


})();

myApp.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: '711561845732-pg1q3d3cn30f4jk07bmqno9qeio7unmg.apps.googleusercontent.com',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});

myApp.controller('MainCtrl', function($scope, $firebaseArray, $http, GeocodeService, uiGmapGoogleMapApi, uiGmapIsReady) {
    var url = 'https://shining-torch-5144.firebaseio.com/jobOpenings';
    var fireRef = new Firebase(url);

    $scope.mapmarkers = $firebaseArray(fireRef);
    $scope.details = GeocodeService.getPlace();
    uiGmapGoogleMapApi
        .then(function(maps){
            $scope.googlemap = {};
            $scope.map = {
                center: {
                    latitude: $scope.details.geometry.location.lat,
                    longitude: $scope.details.geometry.location.long
                },
                zoom: 14,
                pan: 1,
                options: $scope.mapOptions,
                control: {},
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

    $scope.windowOptions = {
        show: false
    };

    $scope.onClick = function(data) {
        $scope.windowOptions.show = !$scope.windowOptions.show;
        console.log('$scope.windowOptions.show: ', $scope.windowOptions.show);
        console.log('This is a ' + data);
        alert('This is a ' + data);
    };

    $scope.closeClick = function() {
        $scope.windowOptions.show = false;
    };

    $scope.title = "Window Title!";

    uiGmapIsReady.promise()                                    // if no value is put in promise() it defaults to promise(1)
        .then(function(instances) {
            console.log(instances[0].map);                        // get the current map
        })
        .then(function(){
            $scope.addMarkerClickFunction($scope.markers);
        });

    $scope.markers = [
        {
            id: 0,
            coords: {
                latitude: 38.9071923,
                longitude: -77.03687070000001,
                draggable: false,
                animation: 1 // 1: BOUNCE, 2: DROP
            },
            data: 'restaurant'
        },
        {
            id: 1,
            coords: {
                latitude: 38.8799697,
                longitude: -77.1067698,
                draggable: false,
                animation: 1 // 1: BOUNCE, 2: DROP
            },
            data: 'house'
        },
        {
            id: 2,
            coords: {
                latitude: 38.704282,
                longitude: -77.2277603,
                draggable: false,
                animation: 1 // 1: BOUNCE, 2: DROP
            },
            data: 'hotel'
        }


    ];

    $scope.addMarkerClickFunction = function(markersArray){
        angular.forEach(markersArray, function(value, key) {
            value.onClick = function(){
                $scope.onClick(value.data);
            };
        });
    };


    $scope.MapOptions = {
        minZoom : 3,
        zoomControl : false,
        draggable : true,
        navigationControl : false,
        mapTypeControl : false,
        scaleControl : false,
        streetViewControl : false,
        disableDoubleClickZoom : false,
        keyboardShortcuts : true,
        styles : [{
            featureType : "poi",
            elementType : "labels",
            stylers : [{
                visibility : "off"
            }]
        }, {
            featureType : "transit",
            elementType : "all",
            stylers : [{
                visibility : "off"
            }]
        }],
    };
});
/**
 * Created by mike.baker on 8/17/2015.
 */

 (function () {
    'use strict';

    angular.module('hirelyApp.jobdetails').controller('JobDetailCtrl', ['$scope', '$state', '$stateParams', '$firebaseArray', 'JobdetailsService', JobDetailCtrl ]);

    function JobDetailCtrl ($scope, $state, $stateParams, $firebaseArray, JobdetailsService) {

    	var url = 'https://shining-torch-5144.firebaseio.com/jobOpenings';
        var fireRef = new Firebase(url);
        var jobdetailsService = JobdetailsService;

        $scope.jobDetails = $firebaseArray(fireRef);
        $scope.jobUID = jobdetailsService.getJob();

        $scope.setJobResults = function(jobUID) {
             jobdetailsService.setJob(jobUID);
            $state.go('app.jobdetails')

        }

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
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('MasterCtrl', ['$stateParams', '$scope', '$modal', '$log', '$q', '$window', 'AuthService', 'UserService', 'GeocodeService', MasterCtrl ]);

    function MasterCtrl($stateParams, $scope, $modal, $log, $q, $window, AuthService, UserService, GeocodeService) {

        var vm = this;
        var geocodeService = GeocodeService;

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
                $scope.userService.setCurrentUser(null)
            }
        });

        //watch for user auth changes, if changed broadcast to pages
        $scope.$watch('userService.getCurrentUser()', function (newVal) {
            $scope.$broadcast('currentUserChanged', { message: newVal });
            $scope.currentUser = newVal;

        },true);

    };
})();
    /**
 * Created by labrina.loving on 8/6/2015.
 */
angular.module("hirelyApp.shared").directive('flexslider', function () {

    return {
        link: function (scope, element, attrs) {

            $('#bg-slider').flexslider({
                animation: "fade",
                directionNav: false, //remove the default direction-nav - https://github.com/woothemes/FlexSlider/wiki/FlexSlider-Properties
                controlNav: false, //remove the default control-nav
                slideshowSpeed: 10000
            });
        }
    }
});

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
