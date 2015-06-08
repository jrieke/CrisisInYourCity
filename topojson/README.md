*This needs to be updated*

1) Install [topojson](https://github.com/mbostock/topojson/wiki/Command-Line-Reference) globally:

	npm install topojson -g

2) Download the raw data (shape file with all ZIP codes in one state; this is pretty big so I cannot include it in the repo): Go [here](http://www.census.gov/cgi-bin/geo/shapefiles2010/main), select *ZIP Code Tabulation Areas*, and then in the upper field (for 2010) the state you want (here: California; do not take the file for the whole US, it is too big to convert it to topojson!).

3) Unzip the downloaded file, and copy the files *city-names.csv* and *zillow-properties.csv* from the repo into the unzipped folder.

4) In the unzipped folder, run:

	topojson -e city-names.csv -e zillow-properties.csv -p name=Name -p metro=Metro --id-property=ZCTA5CE10 -o California.json tl_2010_06_zcta510.shp

This will convert the entire shape file you downloaded to topojson. Additionally, it will add properties from the two CSV files you copied above: The first file (*city-names.csv*) contains names for the ZIP code areas, although these are rather rough, for example most areas in San Diego are simply called "San Diego"). The second one (*zillow-properties.csv*) contains the City/Metro/etc-properties for each ZIP code that Zillow uses. 

The `-e` commands will merge the properties from the CSV files you copied above into the topojson file, the `-p` commands will set the properties for the ZIP code areas (here from the additional files), the `--id-property` command will set the ID for each area (this is needed for datamaps; here it's the ZIP code).

4) Use getmetro.py to extract the metro area you want, for example for San Diego:

	python getmetro.py California.json "San Diego"

This will create the file *SanDiego.json*. However, this file is pretty big as it still contains most of the raw data of the original file.

5) To get rid of this data, run:

	topojson -p -o SanDiego-small.json SanDiego.json

The final topojson file is in *SanDiego-small.json*.