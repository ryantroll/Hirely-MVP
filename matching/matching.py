#!/usr/bin/env python3
# TODO:  Consider location and availability in suggestions

class UserService(object):
  def updateUserCacheFields(user):
    # Clear the old Ksa
    user.knowledges = user.skills = user.abilities = user.workActivities = []
    
    # Concat roles
    roles = {}
    for workExperience in user['workExperiences']:
      if workExperience.onetOccupationId in roles:
        # experienceLvl: tiers of experience where level = num of months in the role
        roles[workExperience['onetOccupationId']["experienceLvl"] += workExperience['experienceLvl']
      else:
        roles[workExperience['onetOccupationId'] = {"experienceLvl": workExperience['experienceLvl']}

    # add KSA calcs to roles
    for onetOccupationId, meta in roles.iteritems():
        roles[onetOccupationId]["knowledges"] = Knowledges.findOne(onetOccupationId=onetOccupationId, workExperienceLowerBound<=meta["experienceLvl"], workExperienceUpperBound>meta["experienceLvl"])
        roles[onetOccupationId]["skills"] = Skills.findOne(onetOccupationId=onetOccupationId, workExperienceLowerBound<=meta["experienceLvl"], workExperienceUpperBound>meta["experienceLvl"])
        roles[onetOccupationId]["abilities"] = Abilities.findOne(onetOccupationId=onetOccupationId, workExperienceLowerBound<=meta["experienceLvl"], workExperienceUpperBound>meta["experienceLvl"])
        roles[onetOccupationId]["workActivities"] = WorkActivities.findOne(onetOccupationId=onetOccupationId, workExperienceLowerBound<=meta["experienceLvl"], workExperienceUpperBound>meta["experienceLvl"])

    
    # Calc master KSAs
    # Start by making the baseline
    role1 = roles.pop()
    user.knowledges = role1["knowledges"]
    user.skills = role1["skills"]
    user.abilities = role1["abilities"]
    user.workActivities = role1["workActivities"]
    weightingTotal = sum(workExperience.experienceLvl)  # What exactly is this?  Dave should walk me through
    
    # Now update for weighted Averageing
    for role in roles:
        for knowledgeName, value in role["knowledges"]:
            value = float(role["experienceLvl"]/weightingTotal)*value
            user.knowledges[knowledgeName] += value
        for skillName, value in role["skills"]:
            value = float(role["experienceLvl"]/weightingTotal)*value
            user.skills[skillName] += value
        for abilityName, value in role["abilities"]:
            value = float(role["experienceLvl"]/weightingTotal)*value
            user.abilities[abilityName] += value
        for workActivityName, value in role["workActivities"]:
            value = float(role["experienceLvl"]/weightingTotal)*value
            user.workAbilitys[workActivityName] += value

    user.educationMaxLvl = 0
    for program in user.education:
      if program.programType > educationMaxLvl:  # 0 = non edu, 1 = High School, 2 = Bachelors, 3 = Masters, 4 = PhD
        user.educationMaxLvl = program.programType

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
    experienceLevels =  [0, 6, 12, 18, 24, 48, 96] # tiers of experience where level = num of months
    maxScore = 0
    knowledgeWeight = .1
    skillWeight = .1
    abilityWeight = .1
    workActivitesWeight = .1
    educationWeight = .3
    personalityWeight = .4

    def __call__(self, user):
      self.user = user

    def generateAll(self):
      for onetOccupationId in self.onetOccupationIds:
        self.generateForId(onetOccupationId)

    def generateForId(self, onetOccupationId):
      for experienceLvl in self.experienceLevels:
            
        # Knowledge calcs
        ss_user_knowledge = {}
        ss_job_knowledge = {}
        for knowledgeName, score in user.knowledges:  
          ss_user_knowledge[knowledgeName] = (user.knowledges[knowledgeName] - Knowledges[onetOccupationId][experienceLvl][knowledgeName])**2 
          ss_job_knowledge[knowledgeName] =  Knowledges.get(onetOccupationId=onetOccupationId,workExpereinceName=experienceLvl,elementComponenet=knowledgeName)**2
        knowledgeTotal = 1 - sqrt(ss_user_knowledge/ss_job_knowledge)
        knowledgeTotal = Max( knowledgeTotal, 0 )
        self.matchScores[experienceLvl]['knowledgeTotal'] = knowledgeTotal


        # Skill calcs
        ss_user_skill = {}
        ss_job_skill = {}
        for skillName, score in user.skills:
          ss_user_skill[skillName] = (user.skills[skillName] - Skills[onetOccupationId][experienceLvl][skillName])**2 
          ss_job_skill[skillName] =  Skills.get(onetOccupationId=onetOccupationId,workExpereinceName=experienceLvl,elementComponenet=skillName)**2
        skillTotal = 1 - sqrt(ss_user_skill/ss_job_skill)
        skillTotal = Max( skillTotal, 0 )
        self.matchScores[experienceLvl]['skillTotal'] = skillTotal
      
      
        # Abilities calcs
        ss_user_abilities = {}
        ss_job_abilities = {}
        for abilitiesName, score in user.abilities:
          ss_user_abilities[abilitiesName] = (user.abilities[abilitiesName] - Abilities[onetOccupationId][experienceLvl][abilitiesName])**2 
          ss_job_abilities[abilitiesName] =  Abilities.get(onetOccupationId=onetOccupationId,workExpereinceName=experienceLvl,elementComponenet=Abilities)**2
        abilitiesTotal = 1 - sqrt(ss_user_abilities/ss_job_abilities)
        abilitiesTotal = Max( abilitiesTotal, 0 )
        self.matchScores[experienceLvl]['abilitiesTotal'] = abiliitesTotal
      
      
        # WorkActivities calcs
        ss_user_workActivities = {}
        ss_job_workActivities = {}
        for workActivitiesName, score in user.workActivities:
          ss_user_workActivities[workActivitiesName] = (user.workActivities[workActivitiesName] - WorkActivities[onetOccupationId][experienceLvl][workActivitiesName])**2 
          ss_job_workActivities[workActivities] =  WorkActivities.get(onetOccupationId=onetOccupationId,workExpereinceName=experienceLvl,elementComponenet=workActivities)**2
        workActivitiesTotal = 1 - sqrt(ss_user_workActivities/ss_job_workActivities)
        workActivitiesTotal = Max( workActivitiesTotal, 0 )
        self.matchScores[experienceLvl]['workActivitiesTotal'] = workActivitiesTotal
      
      
        # Education calcs
        educationScores = Education.get(onetOccupationId=onetOccupationId)
        # EducationScores is a to be created lookup table for pre-calculated education percentiles for a given job
        self.matchScores[experienceLvl]['educationScore'] = OnetMeta.findOne(onetOccupationId=onetOccupationId)['percentiles'][experienceLvl][educationIndex][user.educationMaxLvl]

        # Personality calcs
        self.matchScores[experienceLvl]['personalityScore'] = user.personalityScores[onetOccupationId]

        # Grand total calcs
        # TODO:  Ask Dave how to factor in weights, education and personality
        ss_user_all = ss_user_knowledge + ss_user_skills + ss_user_abilities + ss_user_workActivities
        ss_job_all = ss_job_knowledge + ss_job_skills + ss_job_abilities + ss_job_workActivities
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
