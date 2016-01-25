# TODO:  Consider location and availability in suggestions

class UserService(object):
  def updateUserCacheFields(user):
    # Clear the old Ksa
    user.knowledges = user.skills = user.abilities = user.workAbilitys = []
    
    # Concat roles
    roles = {}
    for workExperience in user.workExperiences:
      if workExperience.onetOccupationId in roles:
        roles[workExperience.onetOccupationId]["experienceLvl"] += workExperience.experienceLvl
      else:
        roles[workExperience.onetOccupationId] = {"experienceLvl": workExperience.experienceLvl}

    # add KSA calcs to roles
    for onetOccupationId, meta in roles.iteritems():
        roles[onetOccupationId]["knowledges"] = db.knowledges(onetOccupationId=onetOccupationId, WorkExperience=meta["experienceLvl"])
        roles[onetOccupationId]["skills"] = db.skills(onetOccupationId=onetOccupationId, WorkExperience=meta["experienceLvl"])
        roles[onetOccupationId]["abilities"] = db.abilities(onetOccupationId=onetOccupationId, WorkExperience=meta["experienceLvl"])
        roles[onetOccupationId]["workAbilitys"] = db.workAbilitys(onetOccupationId=onetOccupationId, WorkExperience=meta["experienceLvl"])
    
    # Calculate master KSAs, using max method
    
    # Start by making the baseline
    role1 = roles.pop()
    user.knowledges = role1["knowledges"]
    user.skills = role1["skills"]
    user.abilities = role1["abilities"]
    user.workAbilitys = role1["workAbilitys"]
    
    # Now update if higher
    for role in roles:
      for knowledgeName, value in role["knowledges"]:
          if user.knowledges[knowledgeName] < value:
            user.knowledges[knowledgeName] = value
      for skillName, value in role["skills"]:
          if user.skills[skillName] < value:
            user.skills[skillName] = value
      for abilityName, value in role["abilities"]:
          if user.abilities[abilityName] < value:
            user.abilities[abilityName] = value
      for workAbilityName, value in role["workAbilitys"]:
          if user.workAbilitys[workAbilityName] < value:
            user.workAbilitys[workAbilityName] = value

    user.highestIndex = 0
    for program in user.education:
      if program.programType > highestIndex:
        user.highestIndex = program.programType

    return user

  def getCareerSuggestions(user, limit=100):
    queryset = MatchCache.find(userId=user.id, sort_by_descending=maxScore, limit=limit)
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
    matchScores = {}
    maxScore = 0
    knowledgeWeight = .1
    skillWeight = .1
    abilityWeight = .1
    workAbilityWeight = .1
    educationWeight = .3
    personalityWeight = .4

    def __call__(self, user):
      self.user = user
      self.generateAll()

    def generateAll(self):
      for onetOccupationId in self.onetOccupationIds:
        self.generateForId(onetOccupationId)

    def generateForId(self, onetOccupationId):

      for experienceLvl, scores in user.scores:
        self.matchScores[experienceLvl] = {}

        # Knowledge calcs
        ss_user_knowledge = {}
        ss_job_knowledge = {}
        for knowledgeName, score in user.knowledges:
          ss_user_knowledge[knowledgeName] = (user.knowledges[knowledgeName] - Knowledges[knowledgeName])**2 
          ss_job_knowledge[knowledgeName] =  Knowledges.get(knowledgeName=)**2
        knowledgeTotal = 1 - sqrt(ss_user_knowledge/ss_job_knowledge)
        knowledgeTotal = Max( knowledgeTotal, 0 )
        self.matchScores[experienceLvl]['knowledgeTotal'] = knowledgeTotal


        # Skill calcs
        ss_user_skill = {}
        ss_job_skill = {}
        for skillName, score in user.skills:
          ss_user_skill[skillName] = (user.skills[skillName] - Skills[skillName])**2 
          ss_job_skill[skillName] =  Skills.get(skillName=)**2
        skillTotal = 1 - sqrt(ss_user_skill/ss_job_skill)
        skillTotal = Max( skillTotal, 0 )
        self.matchScores[experienceLvl]['skillTotal'] = skillTotal
  	  
  	  
        # Activity calcs
        ss_user_activity = {}
        ss_job_activity = {}
        for activityName, score in user.activities:
          ss_user_activity[activityName] = (user.activities[activityName] - Activitys[activityName])**2 
          ss_job_activity[activityName] =  Activitys.get(activityName=)**2
        activityTotal = 1 - sqrt(ss_user_activity/ss_job_activity)
        activityTotal = Max( activityTotal, 0 )
        self.matchScores[experienceLvl]['activityTotal'] = activityTotal
  	  
  	  
        # WorkAbility calcs
        ss_user_workAbility = {}
        ss_job_workAbility = {}
        for workAbilityName, score in user.workAbilitys:
          ss_user_workAbility[workAbilityName] = (user.workAbilitys[workAbilityName] - WorkAbilitys[workAbilityName])**2 
          ss_job_workAbility[workAbilityName] =  WorkAbilitys.get(workAbilityName=)**2
        workAbilityTotal = 1 - sqrt(ss_user_workAbility/ss_job_workAbility)
        workAbilityTotal = Max( workAbilityTotal, 0 )
        self.matchScores[experienceLvl]['workAbilityTotal'] = workAbilityTotal
  	  
  	  
        # Education calcs
        educationScores = Education.get(onetOccupationId=onetOccupationId)
        self.matchScores[experienceLvl]['educationScore'] = EducationScores[experienceLvl][educationIndex][user.highestEducationIndex]

        # Personality calcs
        self.matchScores[experienceLvl]['personalityScore'] = user.personalityScores[onetOccupationId]

        # Grand total calcs
        # TODO:  Ask Dave how to factor in weights, education and personality
        ss_user_all = ss_user_knowledge + ss_user_skills + ss_user_abilities + ss_user_workAbilitys
        ss_job_all = ss_job_knowledge + ss_job_skills + ss_job_abilities + ss_job_workAbilitys
        total = 1 - sqrt(ss_user_all/ss_job_all)
        total = Max( total, 0 )
        self.matchScores[experienceLvl]['total'] = total

        if total > self.maxScore:
          self.maxScore = total


class BusinessService(object):
  def getUserSuggestions(onetOccupationId, experienceLvl, lng_lower_bound=None, lng_upper_bound=None, lat_lower_bound=None, lat_upper_bound=None):
    if lng_lower_bound and lng_upper_bound and lat_lower_bound and lat_upper_bound:
      queryset = MatchCache.find(onetOccupationId=onetOccupationId, 
                                 userOptOutOfSuggetions=False, 
                                 sort_by_descending=scores[experienceLvl]['total'], 
                                 limit=100, locations__lng__within=(lng_lower_bound, lng_upper_bound), 
                                 locations__lat__within=(lat_lower_bound, lat_upper_bound))
    else:
      queryset = MatchCache.find(onetOccupationId=onetOccupationId,
                                 userOptOutOfSuggetions=False, 
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






  

      

