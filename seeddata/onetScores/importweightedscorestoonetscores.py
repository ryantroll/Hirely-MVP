import json
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client['hirely']
col = db['onetScores']

col.delete_many({})

f = open('WeightedScores.json', 'r')
arr = json.loads(f.read())

# The following will be fine when Dave pre-transforms the scores array
# The following transforms the WeightedScores before insertion
# 1) Converts array into dict with key = occId
# 2) Moves score contents into 'scores' dict
# 3) Adds '_id'
# for i in arr:
# 	# each i is a dict with a single key, where the key = occupation id
# 	for occId, scores in i.iteritems():
# 		# print occId + ": " + len(json.dumps(scores))
# 		# d[occId] = {'scores': scores}
# 		scores = {'_id': occId, 'scores': scores}
# 		col.insert_one(scores)

def getExpLvlByMonth(expLvl):
    lookup = {
        '0': '0',
        '1': '1',
        '2': '3',
        '3': '6',
        '4': '12',
        '5': '24',
        '6': '48',
        '7': '64',
        '8': '98',
        '9': '124'
    };
    return lookup[expLvl];

# The following transforms the WeightedScores AND the scores array before insertion
# 1) Converts array into dict with key = occId
# 2) Moves score contents into 'scores' dict
# 3) Adds '_id'
# 4) Transforms from ['Knowledges'] being an array to being a dict
for occScore in arr:
	# each i is a dict with a single key, where the key = occupation id
	for occId, scores in occScore.iteritems():
		scores2 = {'_id': occId, 'scores': {}}
		
		for expLvl, expLvl_scores in scores.iteritems():
			if int(expLvl) > 9:
				continue
			expLvlByMonth = getExpLvlByMonth(expLvl)
			scores2['scores'][expLvlByMonth] = {}

			for ksaw_name, ksaw_set  in expLvl_scores.iteritems():
				ksaw_set2 = {}
				for elem_comp in ksaw_set:
					ksaw_set2[elem_comp['Element Component']] = round(float(elem_comp['Values']), 2)

				scores2['scores'][expLvlByMonth][ksaw_name] = ksaw_set2

		col.insert_one(scores2)



