To get topojson files for new cities, do the following:

1) Install [topojson](https://github.com/mbostock/topojson/wiki/Command-Line-Reference) globally:

	npm install topojson -g

2) Download the raw data (shape file with all ZIP codes in one state): Go [here](http://www.census.gov/cgi-bin/geo/shapefiles2010/main), select *ZIP Code Tabulation Areas*, and then in the upper field (for 2010) the state you want (here: California; do not take the file for the whole US, it is too big to convert it to topojson!)

3) Unzip the downloaded file (do not rename it!)

4) From [Zillow](http://www.zillow.com/research/data/), download the following datasets from the column *Zip Code*: [Median Sale Price](http://files.zillowstatic.com/research/public/Zip/Zip_MedianSoldPrice_AllHomes.csv), [Decreasing Values](http://files.zillowstatic.com/research/public/Zip/Zip_PctOfHomesDecreasingInValues_AllHomes.csv), [Homes foreclosed](http://files.zillowstatic.com/research/public/Zip/Zip_HomesSoldAsForeclosures-Ratio_AllHomes.csv)

5) Move the unzipped files, the files from Zillow and the files *gettopojson.py* and *city-names.csv* from this repository into the same folder

6) In this folder, open the terminal and run:

	python gettopojsons.py CA tl_2010_06_zcta510.shp

Substitute the name for your respective state and the file name for your .shp file. In a nutshell, this converts the .shp file to topojson, simplifies it, adds in names for the ZIP code areas from *city-names.csv*, and splits it into one topojson file per metro (according to the datasets from Zillow).

In the current directory, you will now find the following objects:

* *CA.json*: Topojson file for the complete state
* *CA*: Folder that contains the topojson files for each metro
* *CA.txt*: Contains the names of all metros in .json format

7) To add the topojsons to the website, copy the folder *CA* to *public/data* and append the content of *CA.txt* to the list of available metros in *util/constants.js*