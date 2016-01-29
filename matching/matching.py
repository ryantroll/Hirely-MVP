#!/usr/bin/env python3

# TODO: EducationScores is a to be created lookup table for pre-calculated education percentiles for a given occupation
# TODO: Application scores should be generated when an application is submitted to avoid crunching multiple times

class UserService:
  experienceLevels =  [0, 3, 6, 12, 24, 48, 64, 98, 124] # tiers of experience where level = num of months

  def monthCountToExperienceLevel(monthCount):
    if rmonthCount > 124:
      return 124
    elif rmonthCount > 98:
      return 98
    elif rmonthCount > 64:
      return 64
    elif rmonthCount > 48:
      return 48
    elif rmonthCount > 24:
      return 24
    elif rmonthCount > 12:
      return 12
    elif rmonthCount > 6:
      return 6
    elif rmonthCount > 3:
      return 3
    elif rmonthCount > 1:
      return 1
    else:
      return 0

  # This should be an api endpoint, and should be called automatically when a profile is completed or when relevant fields are updated after completed
  def updateUserCacheFields(user):
    # Clear the old Ksa
    user.knowledges = user.skills = user.abilities = user.workActivities = []
    
    # Concat roles
    roles = {}
    totalWorkMonths = 0
    for workExperience in user['workExperiences']:
      totalWorkMonths += workExperience['monthCount']
      if workExperience.onetOccupationId in roles:
        roles[workExperience['onetOccupationId']["monthCount"] += workExperience['monthCount']
      else:
        roles[workExperience['onetOccupationId'] = {"monthCount": workExperience['monthCount']}

    # add KSA and experienceLvl calcs to roles
    for onetOccupationId, meta in roles.iteritems():
        roles[onetOccupationId]["knowledges"] = Knowledges.findOne(onetOccupationId=onetOccupationId, workExperienceLowerBound<=meta["experienceLvl"], workExperienceUpperBound>meta["experienceLvl"])
        roles[onetOccupationId]["skills"] = Skills.findOne(onetOccupationId=onetOccupationId, workExperienceLowerBound<=meta["experienceLvl"], workExperienceUpperBound>meta["experienceLvl"])
        roles[onetOccupationId]["abilities"] = Abilities.findOne(onetOccupationId=onetOccupationId, workExperienceLowerBound<=meta["experienceLvl"], workExperienceUpperBound>meta["experienceLvl"])
        roles[onetOccupationId]["workActivities"] = WorkActivities.findOne(onetOccupationId=onetOccupationId, workExperienceLowerBound<=meta["experienceLvl"], workExperienceUpperBound>meta["experienceLvl"])
        roles[onetOccupationId]["experienceLvl"] = monthCountToExperienceLevel(roles[onetOccupationId]['monthCount'])
    
    # Calc master KSAs
    # Start by making the baseline
    role1 = roles.pop()
    user.knowledges = role1["knowledges"]
    user.skills = role1["skills"]
    user.abilities = role1["abilities"]
    user.workActivities = role1["workActivities"]
    
    # Now update for weighted Averageing
    for role in roles:
        for knowledgeName, value in role["knowledges"]:
            value = float(role["experienceLvl"]/totalWorkMonths)*value
            user.knowledges[knowledgeName] += value
        for skillName, value in role["skills"]:
            value = float(role["experienceLvl"]/totalWorkMonths)*value
            user.skills[skillName] += value
        for abilityName, value in role["abilities"]:
            value = float(role["experienceLvl"]/totalWorkMonths)*value
            user.abilities[abilityName] += value
        for workActivityName, value in role["workActivities"]:
            value = float(role["experienceLvl"]/totalWorkMonths)*value
            user.workAbilitys[workActivityName] += value

    user.educationMaxLvl = 0
    for program in user.education:
      if program.programType > educationMaxLvl:  # 0 = non edu, 1 = High School, 2 = Bachelors, 3 = Masters, 4 = PhD
        user.educationMaxLvl = program.programType

    return user



class BusinessService:

  def qualificationComputer(self, operator, left, right):
    switch(operator) {
      case "+":
        return left + right;
        break;
      case "-":
        return left - right;
        break;
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
          if right.indexOf(v) == -1:
            return 0
        return 1
    }


  def qualificationFormulaEvaluator(self, formula, business, location, position, variant, user):
    objLookup = {
      'business': business,
      'location': location,
      'position': position,
      'variant': variant,
      'user': user
    }
    
    result = 0
    
    if formula['type'] in ['number', 'string']:
      result = formula['value']
    
    if formula['type'] == 'attribute':
      parts = formula['value'].split('.')
      obj = objLookup[parts.pop(0)]
      result = obj
      for part in parts:
        result = result[part]
    
    elif formula['type'] == 'computation':
      result = self.qualificationFormulaEvaluator(formula['operands'].pop())
      for childField in formula['operands']:
        # TODO:  create compute function.  Should not use eval
        result = self.qualificationComputer(formula['operator']), result, self.qualificationFormulaEvaluator(formula.pop('operands'))
    
    return result

  def getQualificationScore(self, variantId, userId, disqualifyThreshold=0):
    user = User.findOne(id=userId)
    business = Business.findOne(variants__id=variandId)
    variant = business['variants'][variantId]
    position = business['position'][variant['positionId']]
    location = business['locations'][variant['locationId']]
    
    fScoreSum = 0
    fScoreMaxSum = 0
    disqualified = false
    for formula in variant['qualificationSpecification']['formulas']:
      fScoreSum = self.qualificationFormulaEvaluator(formula=formula, 
                                                     business=business, 
                                                     location=location, 
                                                     position=position, 
                                                     variant=variant, 
                                                     user=user)
      if fScore > 0:
        fScore = 1
      
      fScoreMaxSum += formula['importance']
      fScoreSum += fScore * formula['importance']
    
      if fScore == 0 and formula['importance'] >= disqualifyThreshold:
        disqualified = true
    
    if disqualified:
      qScore = 0
    else if fScoreMaxSum == 0:
      qScore = 1
    else:
      qScore = qScore / maxScore
    return qScore

  # This should be called when a variant's qualification specification changes
  # TODO:  this
  def updateApplicationScores(business, variant):
    pass


class MatchCacheService:
  # I have this list, when you are ready
  onetOccupationIds = [...]
  experienceLevels =  [0, 3, 6, 12, 24, 48, 64, 98, 124] # tiers of experience where level = num of months 
  experienceWeight = .4
  educationWeight = .1
  personalityWeight = .5

  # This should be an api endpoint
  # Generates a MatchCache document for every onet occupation
  def generateForUser(user):
    for onetOccupationId in self.onetOccupationIds:

      occupationKnowledges = Knowledges.get(onetOccupationId=onetOccupationId)
      occupationSkills = Skills.get(onetOccupationId=onetOccupationId)
      occupationAbilities = Abilities.get(onetOccupationId=onetOccupationId)
      occupationWorkActivites = WorkActivities.get(onetOccupationId=onetOccupationId)

      matchCache = new MatchCache()

      for experienceLvl in self.experienceLevels:
            
        # Knowledge calcs
        ss_user_knowledge = {}
        ss_occupation_knowledge = {}
        for knowledgeName, score in user.knowledges.iteritems():
          ss_user_knowledge[knowledgeName] = (user.knowledges[knowledgeName] - occupationKnowledges[experienceLvl][knowledgeName])**2 
          ss_occupation_knowledge[knowledgeName] =  occupationKnowledges[experienceLvl][knowledgeName]**2

        # Skill calcs
        ss_user_skill = {}
        ss_occupation_skill = {}
        for skillName, score in user.skills.iteritems():
          ss_user_skill[skillName] = (user.skills[skillName] - occupationSkills[experienceLvl][skillName])**2 
          ss_occupation_skill[skillName] =  occupationSkills[experienceLvl][skillName]**2
      
        # Abilities calcs
        ss_user_abilities = {}
        ss_occupation_abilities = {}
        for abilityName, score in user.abilities.iteritems():
          ss_user_ability[abilityName] = (user.abilities[abilityName] - occupationAbilities[experienceLvl][abilityName])**2 
          ss_occupation_ability[abilityName] =  occupationAbilities[experienceLvl][abilityName]**2
      
        # WorkActivities calcs
        ss_user_workActivities = {}
        ss_occupation_workActivities = {}
        for workActivityName, score in user.workActivities.iteritems():
          ss_user_workActivity[workActivityName] = (user.workActivities[workActivityName] - occupationWorkActivities[experienceLvl][workActivityName])**2 
          ss_occupation_workActivity[workActivityName] =  occupationWorkActivities[experienceLvl][workActivityName]**2

        # Calc Experience score
        ss_user_all = ss_user_knowledge + ss_user_skills + ss_user_abilities + ss_user_workActivities
        ss_occupation_all = ss_occupation_knowledge + ss_occupation_skills + ss_occupation_abilities + ss_occupation_workActivities
        experienceScore = 1 - sqrt(ss_user_all/ss_occupation_all)
        experienceScore = Max( experienceScore, 0 )
        matchCache.scores[experienceLvl]['experienceScore'] = experienceScore
      
        # Education calcs
        matchCache.scores[experienceLvl]['educationScore'] = OnetMeta.findOne(onetOccupationId=onetOccupationId)['percentiles'][experienceLvl]['educationIndex'][user.educationMaxLvl]

        # Personality calcs
        matchCache.scores[experienceLvl]['personalityScore'] = user.personalityCareerScores[onetOccupationId]

        # Grand overallScore calcs
        overallScore = experienceScore*self.experienceWeight
                       + educationScore*self.educationWeight
                       + personalityScore*self.personalityWeight

        matchCache.scores[experienceLvl]['overallScore'] = overallScore

        if overallScore > matchCache.maxOverallScore:
          matchCache.maxOverallScore = overallScore

      matchCache.save()

  # This should be an api endpoint
  def getCareerSuggestions(userId, limit=100):
    queryset = MatchCache.find(userId=userId, sort_by_descending=maxOverallScore, limit=limit)
    return queryset

  # This should be an api endpoint
  def getVariantSuggestions(userId, limit=100, lng_lower_bound=None, lng_upper_bound=None, lat_lower_bound=None, lat_upper_bound=None):

    suggestions = {}

    # Get all businesses with open position variants within a lat-lon region
    if lng_lower_bound and lng_upper_bound and lat_lower_bound and lat_upper_bound:
      Business.find(variants__openings__gt=0, 
                    limit=limit,
                    locations__lng__within=(lng_lower_bound, lng_upper_bound), 
                    locations__lat__within=(lat_lower_bound, lat_upper_bound))
    else:
      Business.find(variants__openings__gt=0, 
                    limit=limit)
    
    # Now get match scores for every variant and append to suggestions
    for variant in business['variants']:
      if variant.openings > 0:
        matchCache = MatchCache.findOne(onetOccupationId=variant.onetOccupationId, userId=userId)
        scores = matchCache.scores[variant.experienceLvl]
        suggestions.append({"business": business, "variant": variant, "scores": scores})

    # Finally, sort by suggestion['scores']['overallScore'] and limit to top 100
    return suggestions.sort('scores.overallScore')[:100]

  # This should be an api endpoint
  def getUserSuggestions(onetOccupationId, experienceLvl, lng_lower_bound=None, lng_upper_bound=None, lat_lower_bound=None, lat_upper_bound=None):
    if lng_lower_bound and lng_upper_bound and lat_lower_bound and lat_upper_bound:
      queryset = MatchCache.find(onetOccupationId=onetOccupationId, 
                                 userOptOutOfSuggetionsFromEmployers=False, 
                                 sort_by_descending=scores[experienceLvl]['overallScore'], 
                                 limit=100, locations__lng__within=(lng_lower_bound, lng_upper_bound), 
                                 locations__lat__within=(lat_lower_bound, lat_upper_bound))
    else:
      queryset = MatchCache.find(onetOccupationId=onetOccupationId,
                                 userOptOutOfSuggetionsFromEmployers=False, 
                                 sort_by_descending=scores[experienceLvl]['overallScore'], limit=100)

      for index, matchCatch in queryset:
        user = User.findOne(id=matchCache['userId'])
        # TODO:  Strip out irrelevant user fields
        queryset[index]['user'] = user
    return queryset


class ApplicationService:
  # This should be an api endpoint
  def getApplicationsByBusiness(businessId):
    return Applications.find(businessId=businessId)

  # This should be an api endpoint
  def getApplicationsByLocation(locationId):
    return Applications.find(locationId=locationId)

  # This should be an api endpoint
  def getApplicationsByPosition(positionId):
    return Applications.find(positionId=positionId)

  # This should be an api endpoint
  def getApplicationsByVariant(variantId):
    return Applications.find(variantId=variantId)

  # This should be an api endpoint
  def createApplication(variantId, userId, prescreenAnswers):
    business = Business.findOne(business__variant=variantId)
    user = User.findOne(userId=userId)

    application = new Application()

    variant = business['variants'][variantId]:
    matchCache = MatchCache.findOne(onetOccupationId=variant.onetOccupationId, userId=userId)
    application.scores = matchCache.scores[variant.experienceLvl]
    application.scores['experienceScore'] *= variant['scoreWeights']['experience']
    application.scores['educationScore'] *= variant['scoreWeights']['education']
    application.scores['personalityScore'] *= variant['scoreWeights']['personality']
    
    # TODO:  Finish QualificationSpecificationService
    application.scores['qualificationScore'] = qualificationSpecificationService.getQaulificationScore(variantId=variant.id, userId=user.id, disqualifyThreshold=0)
    application.scores['qualificationScore'] *= variant['scoreWeights']['qualification']
    
    application.scores['overallScore'] = avg(application.scores['experienceScore'],
                                             application.scores['educationScore'],
                                             application.scores['personalityScore'],
                                             application.scores['qualificationScore'])

    application.save()


# This doesn't work right now, but demonstrates how this framework would work
def test():def test():
  onetOccupationId = "22-22222.00"

  user = User.fineOne()
  userService.updateUserCacheFields(user)
  userService.MatchCacheGenerator(user)

  # job is some onetOccupation, and the scores are based on x months experience
  business = Business.findOne()
  l = business['locations'].first()
  v = l['positions'].first()['variants'].first()

  userSuggestions = businessService.getUserSuggestions(onetOccupationId=v.onetOccupationId, 
                                                       experienceLvl=v.experienceLvl, 
                                                       lng_lower_bound=(l['address']['lng']-.5), 
                                                       lng_upper_bound=(l['address']['lng']+.5), 
                                                       lat_lower_bound=(l['address']['lat']-.5), 
                                                       lat_upper_bound=(l['address']['lat']+.5))

  careerSuggestions = userService.getCareerSuggestions(user=user)

  variantSuggestions = userService.getVariantSuggestions(user=user,
                                                         lng_lower_bound=(user['address']['lng']-.5), 
                                                         lng_upper_bound=(user['address']['lng']+.5), 
                                                         lat_lower_bound=(user['address']['lat']-.5), 
                                                         lat_upper_bound=(user['address']['lat']+.5))
