1) Install [topojson](https://github.com/mbostock/topojson/wiki/Command-Line-Reference):

	npm install topojson -g

2) Download the data for your state from [Zillow](http://www.zillow.com/howto/api/neighborhood-boundaries.htm)

3) Unzip, navigate into the folder and run (with XX the state):

	topojson -p -o ZillowNeighborhoods-XX.json ZillowNeighborhoods-XX.shp

4) Use getcounty.py to extract the area you want:

	python getcounty XX "County Name"

	
