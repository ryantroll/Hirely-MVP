var config = {};

config.jwtSecret = "iwXye8tYZoGKPdGBckmm3QuX";

config.googleMapsAPIKey = 'AIzaSyDXt_V8OyuoNph540_ZBTUSjx66QKLUuJc';

config.traitify = {
  host: 'api-sandbox.traitify.com',
  version: 'v1',
  secretKey: 'jlktk03vvsduai7dq4angojl0l'
};


//config.mongoUri = 'mongodb://ip-172-31-25-53.ec2.internal:27000/hirely';
//config.mongoUri = 'mongodb://db:27017/hirely';
config.mongoUri = 'mongodb://localhost:27017/hirely';
// config.mongoUri = 'mongodb://ec2-54-173-108-137.compute-1.amazonaws.com:27000/hirely';

/**
 * [urlSeparator this will be used in slug generating as word separator]
 * @type {String}
 */
config.urlSeparator = '-';

/**
 * [extractTraitifyMeta congiration option if set to false will stop the code from proccessing the meta of traitify with each assessment save]
 * @type {Boolean}
 */
config.extractTraitifyMeta = true;
/**
 * [saveTraitifyFamousPeople if set to true will add the famous people to traitify meta processing]
 * @type {Boolean}
 */
config.saveTraitifyFamousPeople = true;

/**
 * [primeOnetScoresCache if set to true will prime the onetScoresCache in onetScoresService]
 * @type {Boolean}
 */
config.primeOnetScoresCache = false;

config.onetSecretKey = "YXBwX2hpcmVseV91c19jb21wYXM6NTQ1OGdhdg==";

config.appMode = 'express';
// config.appMode = 'crunchMuncher';

config.tokenLifeDefault = '30m';
config.tokenLifeBusiness = '48h';

module.exports = config;
