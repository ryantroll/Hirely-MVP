var Q = require('q');

var MatchService {
  // I have this list, when you are ready;
  var expLevels =  [0, 3, 6, 12, 24, 48, 64, 98, 124]; // tiers of experience where level = num of months
  var expWeight = .4;
  var eduWeight = .1;
  var psyWeight = .5;

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

  // This should be an api endpoint;
  // Generates a CareerMatchCache document for every onet occupation;
  var generateCareerMatchCacheForUser = function(user) {

    CareerMatchCache.find({userId: user._id}).remove().then(function(err) {

      OnetMetrics.all().then(function(onetMetrics) {

        onetMetrics.forEach(function(occ) {

          careerMatchCache = new CareerMatchCache(userId=user._id, occupationId=occ._id);

          this.expLevels.forEach(function(expLvl) {

            ss_user_all = {};
            ss_occ_all = {};

            // Calc std deviation of ksaw
            ['knowledges', 'skills', 'abilities', 'workActivities'].forEach(function(category) {
              Object.keys(user[category]).forEach(function(key) {
                oScore = occ[expLvl][category][key]
                ss_user_all[key] = Math.pow(user[category][key] - oScore, 2);
              };
              Object.keys(occ[expLvl][category]).forEach(function(key) {
                ss_occ_all[key] = occ[expLvl][category][key]  ** 2;
              };
            });
            // Calc Overall Experience score based on std deviations
            expScore = 1 - Math.sqrt(ss_user_all / ss_occ_all);
            // TODO:  Ask Dave why we need to do this?  Won't expScore always be > 0?
            expScore = Math.max(expScore, 0);
            careerMatchCache.scores[expLvl].exp = expScore;

            // Education calcs
            eduScore = occ[expLvl].eduPercentiles[user.educationMaxLvl];
            careerMatchCache.scores[expLvl].edu = eduScore;

            // Personality calcs
            psyScore = user.personalityCareerScores[onetId];
            careerMatchCache.scores[expLvl].psy = psyScore;

            // Grand overallScore calcs;
            overallScore = expScore * self.expWeight;
            overallScore += educationScore * self.eduWeight
            overallScore += personalityScore * self.psyWeight;
            careerMatchCache.scores[expLvl].overall = overallScore;

            if (overallScore > careerMatchCache.maxOverallScore) {
              careerMatchCache.maxOverallScore = overallScore;
            };

          } // end this.expLevels.forEach

          careerMatchCache.save();

        };  // end onetMetrics.forEach
      });  // end OnetMetrics.all.then
    });  // end CareerMatchCache.find.then
  };  // end generateForUser

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

  var updateApplicationScores = function(application) {
    User.findOne(id: application.userId).then(function(user) {
      // TODO:  Index variant and/or figure out how to speed this up if it's slow
      Business.findOne('variants.'+application.variantId+'._id': application.variantId).then(function(business) {

        CareerMatchCache.findOne(onetId=variant.onetId, userId=userId).then(function(careerMatchCache) {
          variant = business.variants[variantId];

          application.scores = careerMatchCache.scores[variant.experienceLvl];
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
        
        });  // end CareerMatchCache.findOne
      });  // end Business.findOne
    });  // end User.findOne
  };  // end updateApplicationScores

  // This should be called when a variant's qualification specification changes;
  var updateApplicationScoresForVariant = function(variantId) {
    Applications.find({variantId: variantId}).then(function(applications) {
      applications.forEach(function(application) {
        ApplicationService.updateApplicationscores(application);    
      });
    });
  };

  // This should be called when a user's profile changes;
  var updateApplicationScoresForUser = function(userId) {
    Applications.find({'userId': userId}).then(function(applications) {
      applications.forEach(function(application) {
        ApplicationService.updateApplicationscores(application=application);
      });
    });
  };


  // This should be an api endpoint;
  var getCareerSuggestions = function(userId, limit=100) {
    return CareerMatchCache.find({'userId': userId, $sort: {"scores."+experienceLvl+".overallScore": -1}, $limit: 100).exec()
  };  // end getUserSuggestions

  
  // This should be an api endpoint
  var getVariantSuggestions = function(userId, distance=null, limit=100) {
    // Not implemented yet

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
            
            promises.push(CareerMatchCache.findOne({onetId:variant.onetId, userId:userId}).then(function(match) {
              
              scores = match.scores[variant.expLvl];
              index = suggestions.push({businessId:business._id, variantId:variant._id, scores:scores}) - 1;
              suggestionSortMap.push({index:index, score:scores.overallScore});
            
            }));  // end CareerMatchCache.findOne
          
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

  var getUserSuggestions = function(variantId, limit=100) {
    // Not implemented yet
  };  // end getUserSuggestions

};
