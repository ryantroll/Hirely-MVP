/**
 * Created by labrina.loving on 10/5/2015.
 *
 * 1.  Get candidate's experience, availability, and personality
 * 2.  Get position's occupation abilities, skills, knowledge, work context, work activities, tools
 * 3.  Calculate candidate's experience score
 *     a.  Get unique occupation's from experience
 *     b.  For each unique occupation, get abilities, skills, knowledge, work context, work activities, tools
 *     c.  Get max value of each
 */
module.exports = function() {
    'use strict'
    var Q = require('q');
    var _ = require('lodash');
    var Firebase = require('firebase');
    var config = require('./config')();
    var ref = new Firebase(config.firebase);

    var jobApplicationService = {
        apply: apply
    };
    return jobApplicationService;

    function calculateAvailabilityScore(candidateAvailability, positionAvailability){
        var matchingSchedule = [];
        var positionScheduleCount = 0;
        _.forEach(positionAvailability, function(times, day) {

            _.forEach(times, function (value, positionTimeKey) {
                if(value == true){
                    positionScheduleCount++;
                    var dayItems = _.find(candidateAvailability, function(candidateTimes, candidateDay) {
                        return candidateDay == day;
                    });
                    var timeItem =  _.find(dayItems, function(value, timeKey) {
                        return timeKey == positionTimeKey
                    });
                    if(timeItem == true){
                        matchingSchedule.push({day: day, time: positionTimeKey})
                    }
                }
            });
        });
        return {positionScheduleCount: positionScheduleCount, applicationMatchingAvailabilityCount: matchingSchedule.length, applicantMatchingDays: matchingSchedule, availabilityScore: matchingSchedule.length/positionScheduleCount};

    }

    function calculateExperienceScore(experience, position){
        var deferred = Q.defer();
        var occupation = {id: '',
                          onetData: {}};


        //get unique occupations in experience
        var occupations =  _.chain(experience)
            .map(function(item) {
                return item.occupation.id;
            }).uniq().value();

        //loop through each occupation and get onetData
        var applicantOccupations = getApplicantOccupations(occupations).then(function(applicantOccupations){
            //abilities
            var applicantAbilities = _.map(applicantOccupations, function(item){
                    return {id: item.occupationId, elements: item.Abilities}
                }
            );
            var abilitiesScore = getElementsScore(applicantAbilities, position.onetData.Abilities);

            //knowledge
            var applicantKnowledge = _.map(applicantOccupations, function(item){
                    return {id: item.occupationId, elements: item.Knowledge}
                }
            );
            var knowledgeScore = getElementsScore(applicantKnowledge, position.onetData.Knowledge);

            //skills
            var applicantSkills = _.map(applicantOccupations, function(item){
                    return {id: item.occupationId, elements: item.Skills}
                }
            );
            var skillsScore = getElementsScore(applicantSkills, position.onetData.Skills);

            //work activities
            var applicantWorkActivities = _.map(applicantOccupations, function(item){
                    return {id: item.occupationId, elements: item.WorkActivities}
                }
            );
            var workActivitiesScore = getElementsScore(applicantWorkActivities, position.onetData.WorkActivities);

            //work context
            var applicantWorkContext = _.map(applicantOccupations, function(item){
                    return {id: item.occupationId, elements: item.workContext}
                }
            );
            var workContextScore = getContextScore(applicantWorkContext, position.onetData.workContext);

            //tools/tech
            var applicantToolsTech = _.map(applicantOccupations, function(item){
                    return {id: item.occupationId, elements: item.toolsTech}
                }
            );
            var toolsTechScore = getToolsTechScore(applicantToolsTech, position.onetData.toolsTech);

            var experienceOverallScore = (toolsTechScore.overallScore + workActivitiesScore.overallScore + workContextScore.overallScore + abilitiesScore.overallScore + skillsScore.overallScore + knowledgeScore.overallScore)/6;
            var experienceScore = {abilitiesScore: abilitiesScore, knowledgeScore: knowledgeScore, skillsScore: skillsScore, workActivitiesScore: workActivitiesScore, workContextScore: workContextScore, overallScore: experienceOverallScore };
           return deferred.resolve(experienceScore);
        });


        return deferred.promise;
    }
    function getElementsScore(applicantElements, positionElements){
        var applicantScores= [];
        var applicantScore = {};

        _.forEach(positionElements, function(positionElement, elementKey) {
            var elementValues = [];
            var candidateElements = [];
            //get all abilities
            _.forEach(applicantElements, function(applicant, key) {
                candidateElements.push(_.result(_.findWhere(applicant.elements, { 'elementId': positionElement.elementId, }), 'level.value'));
            });
            var maxLevel = _.max(candidateElements);
            applicantScores.push({id: elementKey, elementId: positionElement.elementId, positionLevel: positionElement.level.value, maxCandidateLevel: maxLevel, index: maxLevel/positionElement.level.value})
        });
        var meanPositionLevel = _.sum(applicantScores, function(element) {
                return element.positionLevel;
            })/applicantScores.length;
        var meanCandidateLevel = _.sum(applicantScores, function(element) {
                return element.maxCandidateLevel;
            })/applicantScores.length;
        var overallScore = meanCandidateLevel/meanPositionLevel;
        applicantScore = {meanPositionLevel: meanPositionLevel, meanCandidateLevel: meanCandidateLevel, overallScore: overallScore, elements: applicantScores}
        return applicantScore;
    }

    function getContextScore(applicantElements, positionElements){
        var applicantScores= [];
        var applicantScore = {};

        _.forEach(positionElements, function(positionElement, elementKey) {
            var elementValues = [];
            var candidateElements = [];
            //get all abilities
            _.forEach(applicantElements, function(applicant, key) {
                candidateElements.push(_.result(_.findWhere(applicant.elements, { 'elementId': positionElement.elementId, }), 'context.value'));
            });
            var maxLevel = _.max(candidateElements);
            applicantScores.push({id: elementKey, elementId: positionElement.elementId, positionLevel: positionElement.context.value, maxCandidateLevel: maxLevel, index: maxLevel/positionElement.context.value})
        });
        var meanPositionLevel = _.sum(applicantScores, function(element) {
                return element.positionLevel;
            })/applicantScores.length;
        var meanCandidateLevel = _.sum(applicantScores, function(element) {
                return element.maxCandidateLevel;
            })/applicantScores.length;
        var overallScore = meanCandidateLevel/meanPositionLevel;
        applicantScore = {meanPositionLevel: meanPositionLevel, meanCandidateLevel: meanCandidateLevel, overallScore: overallScore, elements: applicantScores};
        return applicantScore;
    }

    function getToolsTechScore(applicantElements, positionElements){
        var toolsTechUsed = [];
        var toolsTechScore = {};

        _.forEach(positionElements, function(positionElement, elementKey) {

            //get all abilities
            _.forEach(applicantElements, function(applicant, key) {

              var result = _.result(_.find(applicant.elements, function(value, toolTechKey) {
                    return toolTechKey == elementKey;
                }), 'commodityExample');
                if(result){
                   toolsTechUsed.push(elementKey);
                   return false;
               };
            });
          });
        var positionToolsTechCount = _.size(positionElements);
        toolsTechScore = {toolsTechPositionCount: positionToolsTechCount, toolsTechCandidateCount: toolsTechUsed.length, overallScore: toolsTechUsed.length/positionToolsTechCount, elements: toolsTechUsed};
        return toolsTechScore;
    }

    function getApplicantOccupations(occupations){
        var deferred = Q.defer();
        var applicantOccupations = [];
        var promises = [];

        _.forEach(occupations, function(occupationId) {

                if(occupationId){
                    promises.push(getOccupationOnetData(occupationId));
                }

            });
        Q.all(promises).then(function (onetData) {
           deferred.resolve(onetData);
        });
        return deferred.promise;
    }

    function getOccupationElements(occupationId, elementName){
        var deferred = Q.defer();
        ref.child('/' + elementName + '/' + occupationId).orderByChild("importance/value").startAt(3).once("value", function (elementSnap) {
            deferred.resolve(elementSnap.val());
        });
        return deferred.promise;
    }

    function getOccupationWorkContext(occupationId){
        var deferred = Q.defer();
        ref.child('/onetWorkContext/' + occupationId).orderByChild("context/percentage").startAt(0.5).once("value", function (workContextSnap) {
            deferred.resolve(workContextSnap.val());
        });
        return deferred.promise;
    }


    function getOccupationTools(occupationId){
        var deferred = Q.defer();
        ref.child('/onetToolsTech/' + occupationId).once("value", function (toolsSnap) {
            deferred.resolve(toolsSnap.val());
        });
        return deferred.promise;
    }

    function getOccupation(occupationId){
        var deferred = Q.defer();
        ref.child('/onetOccupation/' + occupationId).once("value", function (snap) {
            deferred.resolve(snap.val());
        });
        return deferred.promise;
    }

    function getOccupationOnetData(occupationId){
        var onetData = {
            occupationId: '',
            Skills: {},
            Abilities: {},
            Knowledge: {},
            WorkActivities: {},
            workContext: {},
            toolsTech: {}
        };
        var deferred = Q.defer();
        Q.all([
            getOccupationElements(occupationId, 'onetSkills'),
            getOccupationElements(occupationId, 'onetAbilities'),
            getOccupationElements(occupationId, 'onetKnowledge'),
            getOccupationElements(occupationId, 'onetWorkActivities'),
            getOccupationWorkContext(occupationId),
            getOccupationTools(occupationId),
            getOccupation(occupationId)
        ]).then(function(data){
            onetData.occupationId = occupationId;
            onetData.Skills = data[0];
            onetData.Abilities = data[1];
            onetData.Knowledge = data[2];
            onetData.WorkActivities = data[3];
            onetData.workContext = data[4];
            onetData.toolsTech = data[5];
            onetData.occupation = data[6];
            deferred.resolve(onetData)
        });
        return deferred.promise;

    }
    function getPosition(positionId) {
        var deferred = Q.defer();
        var position = {
           onetData: {}
        };
        var occupationId = '';
          ref.child('/position/' + positionId).once("value", function (positionSnap) {
              position = positionSnap.val();
              occupationId = position.occupation;
              getOccupationOnetData(occupationId).then(function(onetData){
                  position.onetData = onetData;
                  deferred.resolve(position);
              });

        });
        return deferred.promise;
    }

    function getCandidate(candidateId){
        var deferred = Q.defer();

        var candidate = {
            experience: {},
            availability: {},
            personality: {}
        };
        ref.child('/users/' + candidateId).once("value", function (userSnap) {
           candidate = userSnap.val();
            ref.child('/candidate-experience/' + candidateId).once("value", function (expSnap) {
                candidate.experience= expSnap.val();
                ref.child('/candidate-availability/' + candidateId).once("value", function (availSnap) {
                    candidate.availability = availSnap.val();
                    ref.child('/candidate-personality/' + candidateId).once("value", function (personalitySnap) {
                        candidate.personality = personalitySnap.val();
                        deferred.resolve(candidate);

                    });
                });

            });
        });

        return deferred.promise;

    }
    function calculatePersonalityScore(position, candidatePersonality){
        var score = _.result(_.find(candidatePersonality.careerMatches, function(career, key) {
            return career.career.id == position.onetData.occupation.onetsocCode;
        }), 'score');

        if(score){
            return (score/100);

        }
        else{
            return (0);
        }


    }

    function apply(application) {
    //get position and candidate data
        Q.all([ getPosition(application.positionId), getCandidate((application.candidateId))]).then(function(data){
            var position = data[0];
            var candidate = data[1];
            calculateExperienceScore(candidate.experience, position).then(function(experienceScore){
                var availabilityScore = calculateAvailabilityScore(candidate.availability, position.availability);
                var personalityScore = calculatePersonalityScore(position, candidate.personality);
                var candidateScore = {experience: experienceScore, personality: personalityScore, availability: availabilityScore};
                var positionApplication = ref.child('/positionApplication/' + application.positionId)
                var positionAppRef = new Firebase(config.firebase + '/positionApplication/' + application.positionId + '/' + application.candidateId);

                positionAppRef.set(candidateScore);
            });

        });


    }


};