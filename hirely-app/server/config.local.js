var config = {};

config.googleMapsAPIKey = 'AIzaSyDXt_V8OyuoNph540_ZBTUSjx66QKLUuJc';

config.traitify = {
  host: 'api-sandbox.traitify.com',
  version: 'v1',
  secretKey: 'jlktk03vvsduai7dq4angojl0l'
};


// config.mongoUri = 'mongodb://ip-172-31-25-53.ec2.internal:27000/hirely';
//config.mongoUri = 'mongodb://db:27017/hirely';
config.mongoUri = 'mongodb://localhost:27017/hirely';

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
config.saveTraitifyFamousPeople = false;


module.exports = config;
