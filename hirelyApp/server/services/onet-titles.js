var OnetTitles = require('../models/onet-titles');


// find a single title by code
exports.findTitleByCode = function(code, next){
  OnetTitles.findOne({code: code}, function(err, title){
    next(err, title);
  });
};

// find a single title by name
exports.findTitleByTitleName = function(titleName, next){
  OnetTitles.findOne({title : titleName}, function(err, title){
    next(err, title);
  });
};


// search title by name
exports.searchTitles = function(query, next){
  OnetTitles.find({ title: {$regex : new RegExp(query, "i")}} , function(err, title){
    console.log(title);
    next(err, title);
  }).limit(20);
};
