/**
 * Created by Iyad Bitar on 03/11/2016
 *
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .factory('FavoritesService', ['$http', '$q', 'HirelyApiService', 'FIREBASE_URL', FavoritesService]);

  function FavoritesService($http, $q, HirelyApiService) {

    function updateFavorite(favObj){
        return HirelyApiService.favorites().post(favObj);
    }

    function getFavorite(query){

      return HirelyApiService.favorites(query).get();
    }

    return {
      updateFavorite: updateFavorite,
      getFavorite: getFavorite
    }

  }
})();
