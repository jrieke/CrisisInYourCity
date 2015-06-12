import json
import sys
import os
from subprocess import call

# Use like: python gettopojsons.py CA tl_2010_06_zcta510.shp
# the shp file has to have its original name!

shpFilename = sys.argv[2]
state = sys.argv[1]
jsonFilename = state + '.json'

print 'Processing shp file:', shpFilename

os.system('topojson -e city-names.csv -e Zip_MedianSoldPrice_AllHomes.csv -e Zip_PctOfHomesDecreasingInValues_AllHomes.csv -e Zip_HomesSoldAsForeclosures-Ratio_AllHomes.csv -p name=Name -p metro=Metro -p state=State --id-property=ZCTA5CE10,RegionName --simplify-proportion 0.15 -o ' + jsonFilename + ' zip=' + shpFilename)

print
print '-----------------'
print
print 'Loading json file:', jsonFilename

# load the json file and get all areas
j = json.load(open(jsonFilename))
items = list(j['objects']['zip']['geometries'])



# add 'zip' prefix to ids
for item in items:
	item['id'] = 'zip' + item['id']


items_per_metro = {}

def get_metro(item):
	if 'properties' in item and 'metro' in item['properties'] and item['properties']['metro']:
		return item['properties']['metro']
	else:
		return None

def get_state(item):
	if 'properties' in item and 'metro' in item['properties'] and item['properties']['state']:
		return item['properties']['state']
	else:
		return None

for item in items:
	if get_state(item) == state:
		metro = get_metro(item)
		if metro:
			del item['properties']['metro']  # this is not needed any more now
			if metro not in items_per_metro:
				print 'Found new metro:', metro 
				items_per_metro[metro] = [item]
			else:
				items_per_metro[metro].append(item)

print '---------------'
print 'Writing and processing topojsons'

resultsDir = state
try:
	os.makedirs(resultsDir)
except:
	pass


for metro in items_per_metro:
	j['objects']['zip']['geometries'] = items_per_metro[metro]

	# write to a new topojson file with the name of the metro
	filepath = os.path.join(resultsDir, metro.replace(' ', '') + '.json')
	print 'To', filepath
	with open(filepath, 'w') as out:
		out.write(json.dumps(j))

	os.system('topojson -p -o ' + filepath + ' ' + filepath)
	print ''


# store all metro names in a separate file
with open(state + '-metros.txt', 'w') as out:
	for metro in items_per_metro:
		out.write('{metro: "' + metro + '", state: "' + state + '"},\n')

