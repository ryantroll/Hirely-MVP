/**
 * Created by Iyad Bitar on 02/23/2016.
 */


(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .service('FileUpload', ['$q', '$rootScope', 'AMAZON_S3_CREDS', FileUpload]);

  function FileUpload($q, $rootScope, AMAZON_S3_CREDS) {


    this.putFile = function(file, fileName, folder){
      var deferred = $q.defer();

      AWS.config.update({ accessKeyId: AMAZON_S3_CREDS.access_key, secretAccessKey: AMAZON_S3_CREDS.secret_key });
      AWS.config.region = 'us-east-1';
      var bucket = new AWS.S3({ params: { Bucket: AMAZON_S3_CREDS.bucket + (folder ? '/' + folder : '')  } });
      var params = { Key: fileName, ContentType: file.type, Body: file, ServerSideEncryption: 'AES256' };

      bucket.putObject(params, function(err, data) {
        if(err) {
          // There Was An Error With Your S3 Config
          deferred.reject(err);
          return false;
        }
        else {
          // Success!
          var fileUrl = AMAZON_S3_CREDS.bucket_url + (folder ? '/' + folder : '') + '/' + fileName;

          deferred.resolve(fileUrl);
        }
      })
      .on('httpUploadProgress',function(progress) {
        $rootScope.$emit('UploadProgress', progress.loaded / progress.total);
      });

      return deferred.promise;
    }//// fun. putFile

  }//// FileUpload

})();


