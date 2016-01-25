var OnetTitles = require('../models/onet-titles');

function organizeTitles(list){
  var ret = [];
  var limit = list.length;
  var preTitle  = null;
  var toSave = {reportedTitle:'', occupations:[]};

  for(var i=0; i<limit; i++){
    var cObj = list[i];

    var inner = {onetId:cObj.onetId, occupationTitle:cObj.occupationTitle, combinedTtitle:cObj.combinedTtitle};

    if(cObj.reportedTitle === preTitle || preTitle === null){
      toSave.reportedTitle = preTitle;
      toSave.occupations.push(inner);
    }
    else{
      ret.push(toSave);
      toSave = {reportedTitle:cObj.reportedTitle, occupations:[]};
      toSave.occupations.push(inner);
    }


    preTitle = cObj.reportedTitle;
  }
  ret.push(toSave)

  return ret;
}

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
  OnetTitles.find({ reportedTitle: {$regex : new RegExp(query, "i")}} , function(err, title){
    console.log(organizeTitles(title));
    next(err, organizeTitles(title));
  }).limit(20);
};
