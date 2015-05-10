import json
import sys
import os

# Use: getcounty State "County"

state = sys.argv[1]
county = sys.argv[2]
county_without_spaces = county.replace(' ', '')

j = json.load(open('ZillowNeighborhoods-' + state + '.json'))
items = j['objects']['ZillowNeighborhoods-' + state]['geometries']

for item in list(items):
	if item['properties']['COUNTY'] != sys.argv[2]:
		items.remove(item)

j['objects'][county_without_spaces] = j['objects']['ZillowNeighborhoods-' + state]
del j['objects']['ZillowNeighborhoods-' + state]

with open(county_without_spaces + '.json', 'w+') as out:
	out.write(json.dumps(j))