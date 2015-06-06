import json
import sys
import os
from subprocess import call

# Use: getmetro topojson-filename metro

filename = sys.argv[1]

# load the json file and get all areas
j = json.load(open(filename))
items = list(j['objects']['tl_2010_06_zcta510']['geometries'])



# add 'zip' prefix to ids
for item in items:
	item['id'] = 'zip' + item['id']


items_per_metro = {}

def getMetro(item):
	if 'properties' in item and 'metro' in item['properties'] and item['properties']['metro']:
		return item['properties']['metro']
	else:
		return None

for item in items:
	metro = getMetro(item)
	if metro:
		del item['properties']['metro']  # this is not needed any more now
		if metro not in items_per_metro:
			print 'Found new metro:', metro 
			items_per_metro[metro] = [item]
		else:
			items_per_metro[metro].append(item)

print '---------------'
print 'Writing and processing topojsons'

resultsDir = os.path.splitext(filename)[0]
try:
	os.makedirs(resultsDir)
except:
	pass

# for metro in items_per_metro:
# 	j['objects']['tl_2010_06_zcta510']['geometries'] = items_per_metro[metro]

# 	# write to a new topojson file with the name of the metro
# 	filepath = os.path.join(resultsDir, metro.replace(' ', '') + '.json')
# 	print 'To', filepath
# 	with open(filepath, 'w') as out:
# 		out.write(json.dumps(j))

# 	os.system('topojson -p -o ' + filepath + ' ' + filepath)
# 	print ''


# store all metro names in a separate file
with open('metros.txt', 'w') as out:
	for metro in items_per_metro:
		out.write('{metro: "' + metro + '", state: ""},\n')

