
var app = angular.module("myApp", ["firebase", "demoUtils"]);

// this factory returns a synchronized array of chat messages
app.factory("jobs", ["$firebase", "$rootScope", 
   function($firebase, $rootScope) {
      // create a reference to the Firebase where we will store our data
      var ref = new Firebase($rootScope.demoUrl);
        
      // this uses AngularFire to create the synchronized array
      return $firebase(ref).$asArray();
   }
]);

// this is just some demo fluff that creates a unique sandbox URL
// and loads data into it so we can play with Firebase and have fun!
app.run(function(loadDemo, getDemoUrl, $rootScope) {
   $rootScope.demoUrl = getDemoUrl('jobs/title');
   loadDemo('jobs/ONET_Code', 'jobs/Description');
});


