var EXAMPLES_URL = 'https://docs-examples.firebaseio.com/';
var TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjg2NTQwNjE1MDY0OCwidiI6MCwiZCI6eyJzYW5kYm94U2V0dXAiOnRydWV9LCJpYXQiOjE0MDYyMzcwNDh9.VTOxQD-EFpe_6tQXY2-I-kSMARw8hp7qOstrEu63cXM';

var KEY_METHOD, AUTH_METHOD;

(function() {
  var fb = new Firebase('https://sandbox-test.firebaseio-demo.com');
  if( typeof(fb.key) === 'function' ) {
    KEY_METHOD = 'key';
    AUTH_METHOD = 'authWithCustomToken';
  }
  else {
    KEY_METHOD = 'name';
    AUTH_METHOD = 'auth';
  }
})();

var app = angular.module('demoUtils', []);

app.constant('DEMO_BASE_URL', EXAMPLES_URL);

app.constant('DEMO_TOKEN', TOKEN);

app.factory('demoUtils', function($q, $http, $timeout) {
  // we preserve users' example keys to save on demo namespaces
  function getUniqueId() {
    var id;
    if (storage) {
      id = storage.getItem('example-key');
    }
    if (!id) {
      id = new Firebase(EXAMPLES_URL).push()[KEY_METHOD]().replace('_', 'aa');
      if (storage) {
        storage.setItem('example-key', id);
      }
    }
    return id;
  }

  function getRandomDemoUrl(path) {
    var id = getUniqueId();
    return 'https://examples' + id + '.firebaseio-demo.com/' + path;
  }

  function copyDataIfEmpty(fromUrl, toUrl) {
    return checkIfEmpty(toUrl).then(function(isEmpty) {
      if( isEmpty ) {
        return resetData(fromUrl, toUrl);
      }
    });
  }

  function checkIfEmpty(toUrl) {
    return defer(function (def) {
      new Firebase(toUrl).once('value', function (snap) {
        $timeout(function() {
          def.resolve(snap.val() === null);
        })
      }, function(err) {
        $timeout(function() {
          def.reject(err);
        })
      });
    });
  }

  function resetData(fromUrl, toUrl) {
    var firebaseRef = new Firebase(toUrl);
    return defer(function(def) {
      function done(err) {
        $timeout(function() {
          if (err) {
            def.reject(err);
          } else {
            def.resolve();
          }
        });
      }

      if( fromUrl ) {
        $http({method: 'GET', url: fromUrl}).
          success(function(data/*, status, headers, config*/) {
            firebaseRef.set(data, done.bind(null, null));
          }).
          error(function(data, status/*, headers, config*/) {
            console.error('Could not fetch data from docs-examples', status, fromUrl);
            done(status);
          });
      }
      else {
        firebaseRef.remove(done);
      }
    });
  }

  function login(url) {
    return defer(function(def) {
      new Firebase(url)[AUTH_METHOD](TOKEN, function(err) {
        $timeout(function() {
          if( err ) { def.reject(err); }
          else {
            def.resolve(url);
          }
        });
      });
    });
  }

  function deleteOnDisconnect(url) {
    new Firebase(url).onDisconnect().remove();
  }

  function logout(url) {
    new Firebase(url).unauth();
  }

  function defer(fn) {
    var def = $q.defer();
    if( fn ) {
      $timeout(function() { fn(def); });
      return def.promise;
    }
    return def;
  }

  // determine if we can store the unique id in local storage
  var storage = (function () {
    var uid = new Date,
      storage,
      result;
    try {
      (storage = window.localStorage).setItem(uid, uid);
      result = storage.getItem(uid) == uid;
      storage.removeItem(uid);
      return result && storage;
    } catch (e) {}
  }());

  return {
    getUniqueId: getUniqueId,
    getRandomDemoUrl: getRandomDemoUrl,
    copyDataIfEmpty: copyDataIfEmpty,
    deleteOnDisconnect: deleteOnDisconnect,
    logout: logout,
    login: login,
    defer: defer
  }
});

app.factory('getDemoUrl', function(demoUtils) {
  return demoUtils.getRandomDemoUrl;
});

app.factory('loadSandbox', function(demoUtils) {
  return function(path, sourcePath) {
    var id = demoUtils.getUniqueId();
    var toUrl = 'https://docs-sandbox.firebaseio.com/'+path+'/'+id;
    var sourceUrl = sourcePath? EXAMPLES_URL + sourcePath + '.json' : null;
    if( sourcePath ) {
      return demoUtils.login(toUrl)
        .then(demoUtils.deleteOnDisconnect)
        .then(function() {
          return demoUtils.copyDataIfEmpty(sourceUrl, toUrl);
        })
        .then(function() {
          var def = demoUtils.defer();
          def.resolve(toUrl);
          return def.promise;
        })
        .always(demoUtils.logout);
    }
    else {
      var def = demoUtils.defer();
      def.resolve(toUrl);
      return def.promise;
    }
  }
});

app.factory('loadDemo', function(demoUtils) {
  return function (sourcePath, exampleName) {
    var destUrl = demoUtils.getRandomDemoUrl(exampleName);
    var sourceUrl = EXAMPLES_URL + sourcePath + '.json';
    return demoUtils.copyDataIfEmpty(sourceUrl, destUrl).then(function () {
      var def = demoUtils.defer();
      def.resolve(destUrl);
      return def.promise;
    });
  }
});

app.directive('demoLinks', function(demoUtils) {
  // create demo links for dashboard and resetting data
  return {
    restrict: 'A',
    link: function(el, attrs) {
      el
        .css('clear', 'both')
        .append(
          angular.element('<a>view dashboard</a>')
            .prop('href', attrs.destUrl)
            .prop('target', '_blank')
        )
        .append(' | ')
        .append(
          $('<a href="#">reset data</a>').click(function (e) {
            e.preventDefault();
            demoUtils.resetData(attrs.sourceUrl, attrs.destUrl);
          })
        )
        .appendTo(el);
    }
  }
});