#!/usr/bin/env python3

class UserService(object):
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

  def getCareerSuggestions(user, limit=100):
    queryset = MatchCache.find(userId=user.id, sort_by_descending=maxScoreTotal, limit=limit)
    return queryset

  def getVariantSuggestions(user, limit=100, lng_lower_bound=None, lng_upper_bound=None, lat_lower_bound=None, lat_upper_bound=None):
    suggestions = {}
    if lng_lower_bound and lng_upper_bound and lat_lower_bound and lat_upper_bound:
      Business.find(locations__positions__variants__openings__gt=0, 
                    limit=limit,
                    locations__lng__within=(lng_lower_bound, lng_upper_bound), 
                    locations__lat__within=(lat_lower_bound, lat_upper_bound))
    else:
      Business.find(locations__positions__variants__openings__gt=0, 
                    limit=limit)
    for business in businesses
      for locations in business:
        for positions in location:
          for variant in positions:
            if variant.openings > 0:
              match = MatchCache.findOne(onetOccupationId=variant.onetOccupationId, userId=user.id)
              matchScore = match.scores[variant.experienceLvl]['total']
              suggestions.append({"businessId": business.id, "variantId": variant.id, "score": matchScore})

    return suggestions.sort('score')[:100]


class MatchCacheService(object)
  class MatchCacheGenerator(object):
    user = None
    # I have this list, when you are ready
    onetOccupationIds = [...]
    experienceLevels =  [0, 3, 6, 12, 24, 48, 64, 98, 124] # tiers of experience where level = num of months
    matchScores = {}
    maxScoreTotal = 0
    knowledgesWeight = .1
    skillsWeight = .1
    abilitiesWeight = .1
    workActivitiesWeight = .1
    educationWeight = .3
    personalityWeight = .4

    def __call__(user):
      self.user = user

    def generateAll():
      for onetOccupationId in self.onetOccupationIds:
        self.generateForId(onetOccupationId)

    def generateForId(onetOccupationId):
      
      occupationKnowledges = Knowledges.get(onetOccupationId=onetOccupationId)
      occupationSkills = Skills.get(onetOccupationId=onetOccupationId)
      occupationAbilities = Abilities.get(onetOccupationId=onetOccupationId)
      occupationWorkActivites = WorkActivities.get(onetOccupationId=onetOccupationId)

      for experienceLvl in self.experienceLevels:
            
        # Knowledge calcs
        ss_user_knowledge = {}
        ss_occupation_knowledge = {}
        for knowledgeName, score in user.knowledges.iteritems():
          ss_user_knowledge[knowledgeName] = (user.knowledges[knowledgeName] - occupationKnowledges[experienceLvl][knowledgeName])**2 
          ss_occupation_knowledge[knowledgeName] =  occupationKnowledges[experienceLvl][knowledgeName]**2
        knowledgesTotal = 1 - sqrt(ss_user_knowledge/ss_occupation_knowledge)
        knowledgesTotal = Max( knowledgesTotal, 0 )
        self.matchScores[experienceLvl]['knowledgesTotal'] = knowledgesTotal


        # Skill calcs
        ss_user_skill = {}
        ss_occupation_skill = {}
        for skillName, score in user.skills.iteritems():
          ss_user_skill[skillName] = (user.skills[skillName] - occupationSkills[experienceLvl][skillName])**2 
          ss_occupation_skill[skillName] =  occupationSkills[experienceLvl][skillName]**2
        skillsTotal = 1 - sqrt(ss_user_skill/ss_occupation_skill)
        skillsTotal = Max( skillsTotal, 0 )
        self.matchScores[experienceLvl]['skillsTotal'] = skillsTotal
      
      
        # Abilities calcs
        ss_user_abilities = {}
        ss_occupation_abilities = {}
        for abilityName, score in user.abilities.iteritems():
          ss_user_ability[abilityName] = (user.abilities[abilityName] - occupationAbilities[experienceLvl][abilityName])**2 
          ss_occupation_ability[abilityName] =  occupationAbilities[experienceLvl][abilityName]**2
        abilitiesTotal = 1 - sqrt(ss_user_abilities/ss_occupation_abilities)
        abilitiesTotal = Max( abilitiesTotal, 0 )
        self.matchScores[experienceLvl]['abilitiesTotal'] = abiliitesTotal
      
      
        # WorkActivities calcs
        ss_user_workActivities = {}
        ss_occupation_workActivities = {}
        for workActivityName, score in user.workActivities.iteritems():
          ss_user_workActivity[workActivityName] = (user.workActivities[workActivityName] - occupationWorkActivities[experienceLvl][workActivityName])**2 
          ss_occupation_workActivity[workActivityName] =  occupationWorkActivities[experienceLvl][workActivityName]**2
        workActivitiesTotal = 1 - sqrt(ss_user_workActivities/ss_occupation_workActivities)
        workActivitiesTotal = Max( workActivitiesTotal, 0 )
        self.matchScores[experienceLvl]['workActivitiesTotal'] = workActivitiesTotal
      
      
        # Education calcs
        # EducationScores is a to be created lookup table for pre-calculated education percentiles for a given occupation
        self.matchScores[experienceLvl]['educationScore'] = OnetMeta.findOne(onetOccupationId=onetOccupationId)['percentiles'][experienceLvl]['educationIndex'][user.educationMaxLvl]

        # Personality calcs
        self.matchScores[experienceLvl]['personalityScore'] = user.personalityCareerScores[onetOccupationId]

        # Grand total calcs
        total = Max( total, 0 )
        total = knowledgesTotal*self.knowledgesWeight 
                + skillsTotal*self.skillsWeight 
                + abilitiesTotal*self.abilitiesWeight
                + workActivitiesTotal*self.workActivitiesWeight
                + educationScore*self.educationWeight
                + personalityScore*self.personalityWeight

        self.matchScores[experienceLvl]['total'] = total

        if total > self.maxScoreTotal:
          self.maxScoreTotal = total
    

class BusinessService(object):
  def getUserSuggestions(onetOccupationId, experienceLvl, lng_lower_bound=None, lng_upper_bound=None, lat_lower_bound=None, lat_upper_bound=None):
    if lng_lower_bound and lng_upper_bound and lat_lower_bound and lat_upper_bound:
      queryset = MatchCache.find(onetOccupationId=onetOccupationId, 
                                 userOptOutOfSuggetionsFromEmployers=False, 
                                 sort_by_descending=scores[experienceLvl]['total'], 
                                 limit=100, locations__lng__within=(lng_lower_bound, lng_upper_bound), 
                                 locations__lat__within=(lat_lower_bound, lat_upper_bound))
    else:
      queryset = MatchCache.find(onetOccupationId=onetOccupationId,
                                 userOptOutOfSuggetionsFromEmployers=False, 
                                 sort_by_descending=scores[experienceLvl]['total'], limit=100)
    return queryset



# This doesn't work right now, but demonstrates how this framework would work
def test():def test():
  onetOccupationId = "22-22222.00"

  user = User.fineOne()
  userService.updateUserCacheFields(user)
  userService.MatchCacheGenerator(user)

  # job is some onetOccupation, and the scores are based on x months experience
  business = Business.findOne()
  l = business.locations[0]
  v = l.positions[0].variants[0]

  userSuggestions = businessService.getUserSuggestions(onetOccupationId=v.onetOccupationId, 
                                                       experienceLvl=v.experienceLvl, 
                                                       lng_lower_bound=(l.address.lng-.5), 
                                                       lng_upper_bound=(l.address.lng+.5), 
                                                       lat_lower_bound=(l.address.lat-.5), 
                                                       lat_upper_bound=(l.address.lat+.5))

  careerSuggestions = userService.getCareerSuggestions(user=user)

  variantSuggestions = userService.getVariantSuggestions(user=user,
                                                         lng_lower_bound=(user.address.lng-.5), 
                                                         lng_upper_bound=(user.address.lng+.5), 
                                                         lat_lower_bound=(user.address.lat-.5), 
                                                         lat_upper_bound=(user.address.lat+.5))
