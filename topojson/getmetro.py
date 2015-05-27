import json
import sys
import os

# Use: getmetro topojson-filename metro

filename = sys.argv[1]
metro = sys.argv[2]

# load the json file and get all areas
j = json.load(open(filename))
items = j['objects']['tl_2010_06_zcta510']['geometries']

# remove the ones that do not belong to this metro
for item in list(items):
	if not 'properties' in item or not 'metro' in item['properties'] or item['properties']['metro'] != metro:
		items.remove(item)

# store all ids in a separate file
# with open('ids.txt', 'w+') as ids:
# 	for item in items:
# 		item['id'] = item['id'].replace(' ', '')
# 		ids.write(item['id'] + '\n')

# write to a new topojson file with the name of the metro
with open(metro.replace(' ', '') + '.json', 'w+') as out:
	out.write(json.dumps(j))