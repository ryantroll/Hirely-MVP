var Q = require('q')

var UserService {
  var experienceLevels =  [0, 3, 6, 12, 24, 48, 64, 98, 124] // tiers of experience where level = num of months

  var monthCountToExperienceLevel = function(monthCount) {
    if      (monthCount > 124) { return 124 };
    else if (monthCount > 98) { return 98 };
    else if (monthCount > 64) { return 64 };
    else if (monthCount > 48) { return 48 };
    else if (monthCount > 24) { return 24 };
    else if (monthCount > 12) { return 12 };
    else if (monthCount > 6) { return 6 };
    else if (monthCount > 3) { return 3 };
    else if (monthCount > 1) { return 1 };
    else { return 0 };
  }

  // This should be an api endpoint, and should be called automatically when a profile is completed or when relevant fields are updated after completed;
  var updateUserCacheFields = function(user) {

    // Education
    user.educationMaxLvl = 0;
    user.education.forEach(function(program) {
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
          ['knowledges', 'skills', 'abilities', 'workActivities'].forEach(function(category) {
            role[category] = data[role.experienceLvl][category]
          });
      });


      // Calc master KSAs;
      roles.forEach(function(role) {
        // TODO:  Ask Dave if we should be using role.monthCount here instead of experienceLvl
        weight = role.experienceLvl / totalWorkMonths;

        ['knowledges', 'skills', 'abilities', 'workActivities'].forEach(function(category) {
          role[category].forEach(function (value, name)) {
            weighted = weight * value;
            if (user[category] === null) {
              user[category][name] = weighted;  
            } else {
              user[category][name] += weighted;
            }
          });
        });

      });  // end roles.forEach
      
      user.save();

        
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

    MatchCache.find({userId: user._id}).remove().then(function(err) {

      OnetMetrics.all().then(function(onetMetrics) {

        onetMetrics.forEach(function(occ) {

          matchCache = new MatchCache(userId=user._id, occupationId=occupation._id);

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
            matchCache.scores[expLvl].exp = expScore;

            // TODO:  If we decide to boost exp when exact experience occupation id, put it here;
          
            // Education calcs;
            eduScore = occ[expLvl].eduPercentiles[user.educationMaxLvl];
            matchCache.scores[expLvl].edu = eduScore;

            // Personality calcs;
            psyScore = user.personalityCareerScores[onetId];
            matchCache.scores[expLvl].psy = psyScore;

            // Grand overallScore calcs;
            overallScore = expScore * self.expWeight + educationScore * self.eduWeight + personalityScore * self.psyWeight;

            matchCache.scores[expLvl].overall = overallScore;

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
  var getUserSuggestions = function(onetId, experienceLvl, lng_lower_bound=null, lng_upper_bound=null, lat_lower_bound=null, lat_upper_bound=null) {
    if (lng_lower_bound && lng_upper_bound and lat_lower_bound and lat_upper_bound) {
      queryset = MatchCache.find(onetId=onetId,
                                 sort_by_descending=scores[experienceLvl]['overallScore'],
                                 limit=100, locations__lng__within=(lng_lower_bound, lng_upper_bound),
                                 locations__lat__within=(lat_lower_bound, lat_upper_bound));
    }
    else {
      queryset = MatchCache.find(onetId=onetId, sort_by_descending=scores[experienceLvl]['overallScore'], limit=100);
    }

    // TODO:  Remove users who userOptOutOfSuggestionsFromEmployers = true;
    return queryset.exec();
  };  // end getUserSuggestions
};




var ApplicationService = {
  // This should be an api endpoint;
  var getApplicationsByBusiness = function(businessId) {
    return Applications.find(businessId: businessId).exec();
  }

  // This should be an api endpoint;
  var getApplicationsByLocation = function(locationId) {
    return Applications.find(locationId: locationId).exec();
  }

  // This should be an api endpoint;
  var getApplicationsByPosition = function(positionId) {
    return Applications.find(positionId: positionId).exec();
  }

  // This should be an api endpoint;
  var getApplicationsByVariant = function(variantId) {
    return Applications.find(variantId: variantId).exec();
  }

  var getQualificationScore = function(variantId, userId, disqualifyThreshold=0) {
    User.findOne(id: userId).then(function(user) {
      // TODO:  Index variant and/or figure out how to speed this up if it's slow
      Business.findOne('variants.'+variantId+'._id': variantId).then(function(business) {

        variant = business.variants[variantId];
        position = business.position[variant.positionId];
        location = business.locations[variant.locationId];

        fScoreMaxSum = 0;
        disqualified = false;
        variant.qualificationSpecification.formulas.forEach(formula) {
          fScoreSum = self.qualificationFormulaEvaluator(formula=formula,
                                                         business=business,
                                                         location=location,
                                                         position=position,
                                                         variant=variant,
                                                         user=user);
          if (fScore > 0) {
            fScore = 1;
          }

          fScoreMaxSum += formula.importance;
          fScoreSum += fScore * formula.importance;

          if (fScore == 0 && formula.importance >= disqualifyThreshold) {
            disqualified = true;
          }
        }

        if (disqualified) {
          qScore = 0;
        } else if (fScoreMaxSum == 0) {
          qScore = 1;
        } else {
          qScore = qScore / maxScore;
        }
        return qScore;
      
      });  // end Business.findOne
    
    });  // end User.findOne
      
  }  // end getQualificationScore

  // This should be an api endpoint;
  var createApplication = function(variantId, userId, prescreenAnswers) {
    // TODO:  Check that all of the application fields are being populated;
    application = new Application(variantId, userId, prescreenAnswers);
    application.save();
    ApplicationService.updateApplicationscores(application);
  }

  var updateApplicationScores = function(application) {
    User.findOne(id: application.userId).then(function(user) {
      // TODO:  Index variant and/or figure out how to speed this up if it's slow
      Business.findOne('variants.'+application.variantId+'._id': application.variantId).then(function(business) {

        MatchCache.findOne(onetId=variant.onetId, userId=userId).then(function(matchCache) {
          variant = business.variants[variantId];

          application.scores = matchCache.scores[variant.experienceLvl];
          application.scores.experienceScore *= variant.scoreWeights.experience;
          application.scores.educationScore *= variant.scoreWeights.education;
          application.scores.personalityScore *= variant.scoreWeights.personality;

          application.scores.qualificationScore = ApplicationService.getQaulificationScore(variant._id, user._id, 0);
          application.scores.qualificationScore *= variant.scoreWeights.qualification;

          application.scores.overallScore = avg(application.scores.experienceScore,
                                                application.scores.educationScore,
                                                application.scores.personalityScore,
                                                application.scores.qualificationScore);
          application.save();
        
        });  // end MatchCache.findOne
      });  // end Business.findOne
    });  // end User.findOne
  }  // end updateApplicationScores

  // This should be called when a variant's qualification specification changes;
  var updateApplicationScoresForVariant = function(variant) {
    Applications.find({variantId: variant._id}).then(function(applications) {
      applications.forEach(function(application) {
        ApplicationService.updateApplicationscores(application);    
      });
    });
  }

  // This should be called when a user's profile changes;
  var updateApplicationScoresForUser = function(user) {
    Applications.find({userId: user._id}).then(function(applications) {
      applications.forEach(function(application) {
        ApplicationService.updateApplicationscores(application=application);
      });
    });
  }
};
