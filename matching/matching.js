var Q = require('q')

var UserService {
  var experienceLevels =  [0, 3, 6, 12, 24, 48, 64, 98, 124] // tiers of experience where level = num of months

  var monthCountToExperienceLevel = function(monthCount) {
    if      (rmonthCount > 124) { return 124 };
    else if (rmonthCount > 98) { return 98 };
    else if (rmonthCount > 64) { return 64 };
    else if (rmonthCount > 48) { return 48 };
    else if (rmonthCount > 24) { return 24 };
    else if (rmonthCount > 12) { return 12 };
    else if (rmonthCount > 6) { return 6 };
    else if (rmonthCount > 3) { return 3 };
    else if (rmonthCount > 1) { return 1 };
    else { return 0 };
  }

  // This should be an api endpoint, and should be called automatically when a profile is completed or when relevant fields are updated after completed;
  var updateUserCacheFields = function(user) {

    // Education
    user.educationMaxLvl = 0;
    for program in user.education.forEach(function(program) {
      // TODO: Make sure that program type numbers match up to onet, and that 2 = some college;
      if (program.programType > 1 && program.isCompleted == 0) {
        program.programType = 2;
      }
      if (program.programType > educationMaxLvl) {  // 0 = non edu, 1 = High School, 2 = Bachelors, 3 = Masters, 4 = PhD;
        user.educationMaxLvl = program.programType;
      }
    });
      

    // Clear the old Ksa
    user.knowledges = user.skills = user.abilities = user.workActivities = [];
    
    // Concat roles
    roles = {};
    totalWorkMonths = 0;
    onetIds = [];
    user.workExperiences.forEach(function (workExperience) {
      totalWorkMonths += workExperience.monthCount;
      onetIds.push(workExperience.onetId);

      // If role doesn't already exist, create it
      if (roles.indexOf(workExperience.onetId) == -1) {
        roles[workExperience.onetId] = {"monthCount": 0};
      }
      role = roles[workExperience.onetId];
      role.monthCount += workExperience.monthCount;
      role.experienceLvl = this.monthCountToExperienceLevel(role.monthCount)
    });

    
    // Retrieve the role occupations from OnetMetrics
    var promises = [];
    Object.keys(roles).forEach(function(key) {
      promises.push(OnetMetrics.findOne(key))
    })

    // Wait until retrieves are done
    Q.all(promises).then(function(occupations) {
        
      // Extend roles with onet metrics
      occupations.forEach(function(occupation) {
          var role = roles[occupation.onetId]
          role.knowledges = data[role.experienceLvl].knowledges
          role.skills = data[role.experienceLvl].skills
          role.abilities = data[role.experienceLvl].abilities
          role.workActivities = data[role.experienceLvl].workActivities
      });


      // Calc master KSAs;
      // Start by making the baseline;
      role1 = roles.pop();
      user.knowledges = role1["knowledges"];
      user.skills = role1["skills"];
      user.abilities = role1["abilities"];
      user.workActivities = role1["workActivities"];
      
      // Now update for weighted Averageing;
      roles.forEach(function(role) {
        // TODO:  Ask Dave if we should be using role.monthCount here instead of experienceLvl
        weight = role.experienceLvl) / totalWorkMonths;
        
        role.knowledges.forEach(function (value, name)) {
          weighted = weight * value;
          user.knowledges[name] += weighted;
        });

        role.skills.forEach(function (value, name)) {
          weighted = weight * value;
          user.skills[name] += weighted;
        });

        role.abilities.forEach(function (value, name)) {
          weighted = weight * value;
          user.abilities[name] += weighted;
        });

        role.workActivities.forEach(function (value, name)) {
          weighted = weight * value;
          user.workActivities[name] += weighted;
        });

        user.save();

      });  // end roles.forEach

        
    }).catch(function(error) {
      // Do whatever happens if one or more errored
    });  // end Q.all()
    
};


var BusinessService = {

  var qualificationComputer = function(operator, left, right) {
    switch (operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "/":
        return left / right;
      case "*":
        return left * right;
      case "%":
        return left % right;
      case "^":
        return Math.pow(left, right);
      case "within":
        for v in left:
          if (right.indexOf(v) == -1) { return 0; }
        return 1;
    };
  };


  var qualificationFormulaEvaluator = function(formula, business, location, position, variant, user) {
    var objLookup = {
      'business': business,;
      'location': location,;
      'position': position,;
      'variant': variant,;
      'user': user;
    };
    
    switch (formula.type) {
      case 'number':
      case 'string':
        return formula.value;
      case 'number':
        return formula.value;
      case 'attribute':
        parts = formula.value.split('.');
        obj = objLookup[parts.pop(0)];
        result = obj;
        parts.forEach(function(part) {
          result = result[part];
        });
        return result
      case 'computation':
        result = this.qualificationFormulaEvaluator(formula.operands.pop(), business, location, position, variant, user);
        formula.operands.forEach(function(operand) {
          oResult = self.qualificationFormulaEvaluator(formula.pop('operands')
          result = this.qualificationComputer(formula['operator']), result, oResult);
        });
    };
    return result;
  };
};

var MatchCacheService {
  // I have this list, when you are ready;
  var expLevels =  [0, 3, 6, 12, 24, 48, 64, 98, 124]; // tiers of experience where level = num of months
  var expWeight = .4;
  var eduWeight = .1;
  var psyWeight = .5;

  var calc_ss_user_for_onet_group = function(userOnetGroup, occOnetGroup) {
    ss = {};
    userOnetGroup.forEach(function(uScore, key)) {
      oScore = occOnetGroup[key]
      ss[key] = Math.pow(uScore - oScore, 2);
    };
    return ss;
  };

  var calc_ss_occupation_for_onet_group = function(userOnetGroup, occOnetGroup) {
    ss = {};
    userOnetGroup.forEach(function(uScore, key)) {
      ss[key] = occOnetGroup[key]  ** 2;
    };
    return ss
  };

  // This should be an api endpoint;
  // Generates a MatchCache document for every onet occupation;
  var generateForUser = function(user) {

    MatchCache.find({userId: user.id}).remove().then(function(err) {

      OnetMetrics.all().then(function(onetMetrics) {

        onetMetrics.forEach(function(occ) {

          matchCache = new MatchCache(userId=user.id, occupationId=occupation.id);

          this.expLevels.forEach(function(expLvl) {
                
            // Knowledge calcs;
            ss_user_k = this.calc_ss_user_for_onet_group(user.knowledges, occ[expLvl].knowledges);
            ss_occ_k = this.calc_ss_occupation_for_onet_group(user.knowledges, occ[expLvl].knowledges);

            // Skill calcs;
            ss_user_s = this.calc_ss_user_for_onet_group(user.skills, occ[expLvl].skills);
            ss_occ_s = this.calc_ss_occupation_for_onet_group(user.skills, occ[expLvl].skills);

          
            // Abilities calcs;
            ss_user_a = this.calc_ss_user_for_onet_group(user.abilities, occ[expLvl].abilities);
            ss_occ_a = this.calc_ss_occupation_for_onet_group(user.abilities, occ[expLvl].abilities);

          
            // WorkActivities calcs;
            ss_user_w = this.calc_ss_user_for_onet_group(user.workActivities, occ[expLvl].workActivities);
            ss_occ_w = this.calc_ss_occupation_for_onet_group(user.workActivities, occ[expLvl].workActivities);


            // Calc Experience score;
            ss_user_all = ss_user_k + ss_user_s + ss_user_a + ss_user_w;
            ss_occ_all = ss_occ_k + ss_occ_s + ss_occ_a + ss_occ_w;
            expScore = 1 - Math.sqrt(ss_user_all / ss_occ_all);
            expScore = Math.max(experienceScore, 0);
            matchCache.scores[expLvl]['exp'] = expScore;

            // TODO:  If we decide to boost exp when exact experience occupation id, put it here;
          
            // Education calcs;
            eduScore = occ[expLvl].eduPercentiles[user.educationMaxLvl];
            matchCache.scores[expLvl]['edu'] = eduScore;

            // Personality calcs;
            psyScore = user.personalityCareerScores[onetId];
            matchCache.scores[expLvl]['psy'] = psyScore;

            // Grand overallScore calcs;
            overallScore = expScore * self.expWeight + educationScore * self.eduWeight + personalityScore * self.psyWeight;

            matchCache.scores[expLvl]['overall'] = overallScore;

            if overallScore > matchCache.maxOverallScore:
              matchCache.maxOverallScore = overallScore;
          } // end this.experienceLevels.forEach

          matchCache.save();

        };  // end onetMetrics.forEach
      });  // end OnetMetrics.all.then
    });  // end MatchCache.find.then
  };  // end generateForUser

  
  // This should be an api endpoint;
  var getCareerSuggestions = function(userId, limit=100) {
    // TODO:  Figure out how to sort and limit
    return MatchCache.find(userId=userId, sort_by_descending=maxOverallScore, limit=limit).exec();
  };  // end getCareerSuggestions

  
  // This should be an api endpoint;
  var getVariantSuggestions = function(userId, limit=100, lng_lower_bound=null, lng_upper_bound=null, lat_lower_bound=null, lat_upper_bound=null) {

    var suggestions = [];
    var suggestionSortMap = [];

    // Get all businesses with open position variants within a lat-lon region;
    // TODO:  figure out how to do these filters
    if (lng_lower_bound !== null && lng_upper_bound !== null && lat_lower_bound !== null && lat_upper_bound !== null) {
      businessQuery = Business.find(variants__openings__gt=0,
                                    locations__lng__within=(lng_lower_bound, lng_upper_bound),
                                    locations__lat__within=(lat_lower_bound, lat_upper_bound));
    } else {
      businessQuery = Business.find(variants__openings__gt=0);
    }

    businessQuery.then(function(businesses) {
      
      var promises = [];

      businesses.forEach(function(business) {
        
        // Now get match scores for every variant and append to suggestions;
        business.variants.forEach(function(variant) {
          
          if (variant.openings > 0) {
            
            promises.push(MatchCache.findOne({onetId:variant.onetId, userId:userId}).then(function(match) {
              
              scores = match.scores[variant.expLvl];
              index = suggestions.push({business:business, variant:variant, scores:scores}) - 1;
              suggestionSortMap.push({index:index, score:scores.overallScore});
            
            }));  // end MatchCache.findOne
          
          };  // end if variant.openings
        
        });  // end business.variants.foreach
      
      });  // end businesses.foreach

      // Wait until retrieves are done
      Q.all(promises).then(function() {
      
        // Inverse sort by suggestion['scores']['overallScore']
        // Use the map to eval sort order to boost performance
        // reference:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        suggestionSortMap.sort(function(a, b) {return a.score - b.score;});
        // Now apply the sort to suggestions
        var suggestionsSorted = suggestionSortMap.map(function(element){
          return suggestions[element.index];
        });
        // Finally limit
        suggestionsSortedAndLimited = suggestionsSorted.slice(0, limit);
        // TODO:  Figure out how to return this synchronously for api requests
        return suggestionsSortedAndLimited

      }  // end Q.all
    
    });  // end businessQuery.then

  };  // end getVariantSuggestions

  // This should be an api endpoint;
  def getUserSuggestions(onetId, experienceLvl, lng_lower_bound=None, lng_upper_bound=None, lat_lower_bound=None, lat_upper_bound=None):
    if lng_lower_bound and lng_upper_bound and lat_lower_bound and lat_upper_bound:
      queryset = MatchCache.find(onetId=onetId, ;
                                 sort_by_descending=scores[experienceLvl]['overallScore'], ;
                                 limit=100, locations__lng__within=(lng_lower_bound, lng_upper_bound), ;
                                 locations__lat__within=(lat_lower_bound, lat_upper_bound));
    else:
      queryset = MatchCache.find(onetId=onetId,;
                                 sort_by_descending=scores[experienceLvl]['overallScore'], limit=100);

    // TODO:  Remove users who userOptOutOfSuggestionsFromEmployers = true;

    return queryset.exec();
};




var ApplicationService = {
  // This should be an api endpoint;
  def getApplicationsByBusiness(businessId):
    return Applications.find(businessId=businessId).exec();

  // This should be an api endpoint;
  def getApplicationsByLocation(locationId):
    return Applications.find(locationId=locationId).exec();

  // This should be an api endpoint;
  def getApplicationsByPosition(positionId):
    return Applications.find(positionId=positionId).exec();

  // This should be an api endpoint;
  def getApplicationsByVariant(variantId):
    return Applications.find(variantId=variantId).exec();

  def getQualificationScore(self, variantId, userId, disqualifyThreshold=0):
    user = User.findOne(id=userId);
    business = Business.findOne(variants__id=variandId);
    variant = business['variants'][variantId];
    position = business['position'][variant['positionId']];
    location = business['locations'][variant['locationId']];

    fScoreMaxSum = 0;
    disqualified = false;
    for formula in variant['qualificationSpecification']['formulas']:
      fScoreSum = self.qualificationFormulaEvaluator(formula=formula,;
                                                     business=business,;
                                                     location=location,;
                                                     position=position,;
                                                     variant=variant,;
                                                     user=user);
      if fScore > 0:
        fScore = 1;

      fScoreMaxSum += formula['importance'];
      fScoreSum += fScore * formula['importance'];

      if fScore == 0 and formula['importance'] >= disqualifyThreshold:
        disqualified = true;

    if disqualified:
      qScore = 0;
    elif fScoreMaxSum == 0:
      qScore = 1;
    else:
      qScore = qScore / maxScore;
    return qScore;

  // This should be an api endpoint;
  def createApplication(variantId, userId, prescreenAnswers):
    // TODO:  Check that all of the application fields are being populated;
    application = new Application(variantId=variantId, userId=userId, prescreenAnswers=prescreenAnswers);
    application.save();
    ApplicationService.updateApplicationscores(application=application);

  def updateApplicationScores(application):
    business = Business.findOne(business__variant=application['variantId']);
    user = User.findOne(userId=application['userId']);
    variant = business['variants'][variantId];
    matchCache = MatchCache.findOne(onetId=variant['onetId'], userId=userId);

    application.scores = matchCache.scores[variant.experienceLvl];
    application.scores['experienceScore'] *= variant['scoreWeights']['experience'];
    application.scores['educationScore'] *= variant['scoreWeights']['education'];
    application.scores['personalityScore'] *= variant['scoreWeights']['personality'];

    application.scores['qualificationScore'] = ApplicationService.getQaulificationScore(variantId=variant.id, userId=user.id, disqualifyThreshold=0);
    application.scores['qualificationScore'] *= variant['scoreWeights']['qualification'];

    application.scores['overallScore'] = avg(application.scores['experienceScore'],;
                                             application.scores['educationScore'],;
                                             application.scores['personalityScore'],;
                                             application.scores['qualificationScore']);
    application.save();

  // This should be called when a variant's qualification specification changes;
  def updateApplicationScoresForVariant(variant):
    for application in Applications.find({variantId: variant.id}):
      ApplicationService.updateApplicationscores(application=application);

  // This should be called when a user's profile changes;
  def updateApplicationScoresForUser(user):
    for application in Applications.find({userId: user.id}):
      ApplicationService.updateApplicationscores(application=application);
};

// This doesn't work right now, but demonstrates how this framework would work;
function test() {
  onetId = "22-22222.00";

  user = User.fineOne();
  userService.updateUserCacheFields(user);
  MatchCacheService.generateForUser(user);

  // job is some onetOccupation, and the scores are based on x months experience;
  business = Business.findOne();
  l = business['locations'].first();
  v = l['positions'].first()['variants'].first();

  userSuggestions = businessService.getUserSuggestions(onetId=v.onetId, ;
                                                       experienceLvl=v.experienceLvl, ;
                                                       lng_lower_bound=(l['address']['lng']-.5), ;
                                                       lng_upper_bound=(l['address']['lng']+.5), ;
                                                       lat_lower_bound=(l['address']['lat']-.5), ;
                                                       lat_upper_bound=(l['address']['lat']+.5));

  careerSuggestions = userService.getCareerSuggestions(user=user);

  variantSuggestions = userService.getVariantSuggestions(user=user,;
                                                         lng_lower_bound=(user['address']['lng']-.5), ;
                                                         lng_upper_bound=(user['address']['lng']+.5), ;
                                                         lat_lower_bound=(user['address']['lat']-.5), ;
                                                         lat_upper_bound=(user['address']['lat']+.5));
};
