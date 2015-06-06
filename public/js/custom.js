// TODO: Make a minified version

/* ------------------------------------------- Data Fetching -------------------------------------------------- */

// var months = [//'2000-01-15', '2000-02-15', '2000-03-15', '2000-04-15', '2000-05-15', '2000-06-15', '2000-07-15', '2000-08-15', '2000-09-15', '2000-10-15', '2000-11-15', '2000-12-15', '2001-01-15', '2001-02-15', '2001-03-15', '2001-04-15', '2001-05-15', '2001-06-15', '2001-07-15', '2001-08-15', '2001-09-15', '2001-10-15', '2001-11-15', '2001-12-15', '2002-01-15', '2002-02-15', '2002-03-15', '2002-04-15', '2002-05-15', '2002-06-15', '2002-07-15', '2002-08-15', '2002-09-15', '2002-10-15', '2002-11-15', '2002-12-15', '2003-01-15', '2003-02-15', '2003-03-15', '2003-04-15', '2003-05-15', '2003-06-15', '2003-07-15', '2003-08-15', '2003-09-15', '2003-10-15', '2003-11-15', '2003-12-15', 
// '2004-01-15', '2004-02-15', '2004-03-15', '2004-04-15', '2004-05-15', '2004-06-15', '2004-07-15', '2004-08-15', '2004-09-15', '2004-10-15', '2004-11-15', '2004-12-15', 
// '2005-01-15', '2005-02-15', '2005-03-15', '2005-04-15', '2005-05-15', '2005-06-15', '2005-07-15', '2005-08-15', '2005-09-15', '2005-10-15', '2005-11-15', '2005-12-15', '2006-01-15', '2006-02-15', '2006-03-15', '2006-04-15', '2006-05-15', '2006-06-15', '2006-07-15', '2006-08-15', '2006-09-15', '2006-10-15', '2006-11-15', '2006-12-15', '2007-01-15', '2007-02-15', '2007-03-15', '2007-04-15', '2007-05-15', '2007-06-15', '2007-07-15', '2007-08-15', '2007-09-15', '2007-10-15', '2007-11-15', '2007-12-15', '2008-01-15', '2008-02-15', '2008-03-15', '2008-04-15', '2008-05-15', '2008-06-15', '2008-07-15', '2008-08-15', '2008-09-15', '2008-10-15', '2008-11-15', '2008-12-15', '2009-01-15', '2009-02-15', '2009-03-15', '2009-04-15', '2009-05-15', '2009-06-15', '2009-07-15', '2009-08-15', '2009-09-15', '2009-10-15', '2009-11-15', '2009-12-15', '2010-01-15', '2010-02-15', '2010-03-15', '2010-04-15', '2010-05-15', '2010-06-15', '2010-07-15', '2010-08-15', '2010-09-15', '2010-10-15', '2010-11-15', '2010-12-15', '2011-01-15', '2011-02-15', '2011-03-15', '2011-04-15', '2011-05-15', '2011-06-15', '2011-07-15', '2011-08-15', '2011-09-15', '2011-10-15', '2011-11-15', '2011-12-15', '2012-01-15', '2012-02-15', '2012-03-15', '2012-04-15', '2012-05-15', '2012-06-15', '2012-07-15', '2012-08-15', '2012-09-15', '2012-10-15', '2012-11-15', '2012-12-15', '2013-01-15', '2013-02-15', '2013-03-15', '2013-04-15', '2013-05-15', '2013-06-15', '2013-07-15', '2013-08-15', '2013-09-15', '2013-10-15', '2013-11-15', '2013-12-15', '2014-01-15', '2014-02-15', '2014-03-15', '2014-04-15', '2014-05-15', '2014-06-15', '2014-07-15', '2014-08-15', '2014-09-15', '2014-10-15', '2014-11-15', '2014-12-15', '2015-01-15']
var months = ['2004-02-15', '2004-05-15', '2004-08-15', '2004-11-15', '2005-02-15', '2005-05-15', '2005-08-15', '2005-11-15', '2006-02-15', '2006-05-15', '2006-08-15', '2006-11-15', '2007-02-15', '2007-05-15', '2007-08-15', '2007-11-15', '2008-02-15', '2008-05-15', '2008-08-15', '2008-11-15', '2009-02-15', '2009-05-15', '2009-08-15', '2009-11-15', '2010-02-15', '2010-05-15', '2010-08-15', '2010-11-15', '2011-02-15', '2011-05-15', '2011-08-15', '2011-11-15', '2012-02-15', '2012-05-15', '2012-08-15', '2012-11-15', '2013-02-15', '2013-05-15', '2013-08-15', '2013-11-15', '2014-02-15', '2014-05-15', '2014-08-15', '2014-11-15'];
var nullArr = Array.apply(null, new Array(months.length)).map(function() { return null; });

var datasetNames = ['mediansaleprice', 'soldforloss', 'decreasinginvalues', 'soldasforeclosures'];

var data = {};
var numLoaded = 0;

console.log(metros);


function fetchDataset(name, metro) {
  console.log(metro);
  d3.xhr('/' + name)
    .header("Content-Type", "application/json")
    .post(JSON.stringify(metro), function(error, result) {
      if (error) return console.warn(error);

      var json = JSON.parse(result.response);
      console.log('received dataset ' + name);
      console.log(json);

      var average = json.average[Object.keys(json.average)[0]];
      json.average = average ? average : nullArr;

      // if (json.average) {
      //   var newArr = [];
      //   for (var i = 0; i < json.average.length-1; i+=3) {
      //     var values = json.average.slice(i, i+3);
      //     var sum = 0;
      //     var num = 0;
      //     for (var j = 0; j < 3; j++) {
      //       if (values[j] !== null) {
      //         sum += values[j];
      //         num++;
      //       }
      //     }
      //     if (num === 0)
      //       newArr.push(null);
      //     else
      //       newArr.push(sum / num);
      //   }
      //   // console.log(newArr);
      //   json.average = newArr;
      // }


      // // var nullCount = 0;
      // // TODO: Do this in backend
      // for (var key in json.values) {
      //   // console.log(key);
      //   if (json.values[key]) {
      //     var newArr = [];
      //     for (var i = 0; i < json.values[key].length-1; i+=3) {
      //       var values = json.values[key].slice(i, i+3);
      //       var sum = 0;
      //       var num = 0;
      //       for (var j = 0; j < 3; j++) {
      //         if (values[j] !== null) {
      //           sum += values[j];
      //           num++;
      //         }
      //       }
      //       if (num === 0)
      //         newArr.push(null);
      //       else
      //         newArr.push(sum / num);
      //     }
      //     // console.log(newArr);
      //     json.values[key] = newArr;
      //   }


        // TODO: Keep this and run again as soon as we have all metro averages
        // if (json[key]) {
        //   for (var i = 0; i < data[name][key].length; i++) {
        //     if (json[key][i] === null)
        //       nullCount++;
        //   }
        // }

      // }

      // console.log(name + ': ' + nullCount);

      data[name] = json;

      numLoaded++;
      if (numLoaded == datasetNames.length) {
        // TODO: Remove this once we have a description
        d3.select('#loading').text('Done!');
      }

      if (selectDatasetWhenLoaded == name) {
        dataset(name);
        selectDatasetWhenLoaded = '';
      }

    }); 
}










/* ------------------------------------------- Initialization --------------------------------------------------- */

var slidedDown = false;
var maxSliderValue = 43.99;//132;  // TODO: Maybe change to numSliderValues
var scrollSpeed = 0.01;
var playing = false;
var startColor = '#9e9e9e';
var city = 'San Diego';
var selectedArea = ''; 
var lockedArea = '';
var areasInBarChart = ['92037', '91901', '91902', '91910', '91911', '91913', '92037'];
var selectedTimeIndex = 0;
var selectedDataset = '';
var selectDatasetWhenLoaded = '';

var datasetColors = {mediansaleprice: {map: '#f44336', charts: '#ef5350'}, soldforloss: {map: '#00bcd4', charts: '#00bcd4'}, decreasinginvalues: {map: '#8bc34a', charts: '#8bc34a'}, soldasforeclosures: {map: '#ffb300', charts: '#ffb300'}};
var minDataValue = 0;
// TODO: Make these better
var maxDataValues = {mediansaleprice: 1000000, soldforloss: 100, decreasinginvalues: 100, soldasforeclosures: 70};
var axisLabels = {mediansaleprice: 'Median sale price', soldforloss: 'Homes sold for loss', decreasinginvalues: 'Homes decreasing in value', soldasforeclosures: 'Homes foreclosed out of 10k'};
var numberFormats = {'': function() { return ''; }, mediansaleprice: d3.format('$.3s'), soldforloss: function(x) { return d3.format('.0f')(x) + '%'; }, decreasinginvalues: function(x) { return d3.format('.0f')(x) + '%'; }, soldasforeclosures: d3.format('.0f')};


function down() {
  if (!slidedDown) {
    // d3.select('#front-header')
    //   .transition()
    //   .duration(1000)
    //   .style('top', '-300px');


    d3.select('#navbar')
      .transition()
      .duration(1000)
      .style('top', '0px');

    d3.select('#descriptions')
      .transition()
      .duration(1000)
      .style('top', '50px');

    d3.select('#content-pane')
      .transition()
      .duration(1000)
      .style('top', '50px');


    d3.selectAll('.description')
      .transition()
      .delay(1000)
      .style('visibility', 'hidden');


    slidedDown = true;
  }
}

d3.select('#choose-san-diego').on('click', function() {
  d3.select('#navbar')
    .style('visibility', 'visible')
    .transition()
    .duration(1000)
    .style('top', '300px')
    .style('opacity', 1);

  d3.select('#descriptions')
    .transition()
    .delay(1000)
    .style('visibility', 'visible');

  d3.select('#content-pane')
    .style('visibility', 'visible')
    .transition()
    .duration(1000)
    .style('top', '350px');

  d3.select('#footer')
    .transition()
    .duration(1000)
    .style('background-color', '#616161');


  d3.select('#header')
    .style('visibility', 'hidden');


  // Load the datasets as the first thing, so we reduce waiting time
  for (var i = 0; i < datasetNames.length; i++) {
    fetchDataset(datasetNames[i], metros[0]);
  }

});



d3.selectAll('.nav-title')
  .on('mouseover', function(d, i) {
    d3.select(d3.selectAll('.description')[0][i]).style('visibility', 'visible');
    // d3.selectAll('.nav-title').classed('active', false);
  })
  .on('mouseout', function() {
    d3.selectAll('.description').style('visibility', 'hidden');
    // d3.select(d3.selectAll('.nav-title')[0][selectedTitle]).classed('active', 'true');
  })
  .on('click', function(d, i) {
    down();
    dataset(datasetNames[i]);
    d3.selectAll('.nav-title').classed('active', false);
    d3.select(this).classed('active', true);
  });


// TODO: #content only covers the area of the visualizations, not the border around them. make this for the complete area
// TODO: Show a pointer cursor for this
// TODO: Do not use slidedDown and a click on content, but a different overlay
d3.select('#content').on('click', function(d,i) {
  if (!slidedDown) {
    down();
    d3.select('.nav-title').classed('active',true);
    dataset('mediansaleprice');

    slidedDown = true;
  }
});

function initVisualizations() {
  d3.select('#time-chart-legend').style('visibility', 'visible');
  d3.select('#time-chart').select('.c3-axis-x').style('visibility', 'visible', 'important');
  d3.select('#bar-chart').select('.c3-axis-x').style('visibility', 'visible', 'important');
  d3.select('#map').select('.map-legend').style('visibility', 'visible');

  d3.select('#time-chart').select('.c3-chart')
    .on('mouseover', function() {
      // TODO: Get the opacity values right
      d3.select('#time-chart').selectAll('.c3-line').style('stroke-opacity', 0.5);      
    })
    .on('mousemove', function() {
      d3.select('#time-chart').selectAll('.c3-texts-average,.c3-texts-area').selectAll('.c3-text').style('visibility', function(d, i) { return (d3.select('#time-chart').select('.c3-circle-' + i).classed('_expanded_') || i == selectedTimeIndex) ? 'visible' : 'hidden'; });
    })
    .on('mouseout', function() {
      d3.select('#time-chart').selectAll('.c3-texts-average,.c3-texts-area').selectAll('.c3-text').style('visibility', function(d, i) { return (i == selectedTimeIndex) ? 'visible' : 'hidden'; });
      d3.select('#time-chart').selectAll('.c3-line').style('stroke-opacity', 1);
    });


  $(document).on('mousewheel', function(evt) {
    moveSliderTo(Math.max(0, Math.min(maxSliderValue, slider.value() - scrollSpeed * event.deltaY)));
  });
}









/* --------------------------------------- Visualization Functions -------------------------------------------------- */

function showCurrentValuesInMap() {
  map.updateChoropleth(blankMapColors);
  var mapColors = {};
  for (var area in data[selectedDataset].values) {
    mapColors['zip' + area] = (data[selectedDataset].values[area][selectedTimeIndex] === null ? startColor : colorScale(data[selectedDataset].values[area][selectedTimeIndex]));
  }
  map.updateChoropleth(mapColors);
}

function highlightSelectedAreaInMap() {
  if (selectedArea) {
    d3.selectAll('.datamaps-subunit').style('filter', '');
    d3.select('#map').select('.zip' + lockedArea).moveToFront().style('filter', 'url(#drop-shadow-small)');
    d3.select('#map').select('.zip' + selectedArea).moveToFront().style('filter', 'url(#drop-shadow)');
  } else {
      d3.select('#map').selectAll('.datamaps-subunit')
        .style('filter', '');
  }
}


function highlightSelectedAreaInBarChart() {
  if (selectedArea) {
    if (areasInBarChart.indexOf(selectedArea) != -1) {
      d3.select('#bar-chart').selectAll('.c3-bar').classed('not-highlighted', function(d, i) { return areasInBarChart[i] != selectedArea; });
      d3.select('#bar-chart').selectAll('.c3-text').classed('highlighted', function(d, i) { return areasInBarChart[i-1] == selectedArea; });
    } else {
      d3.select('#bar-chart').selectAll('.c3-bar').classed('not-highlighted', false);
      d3.select('#bar-chart').selectAll('.c3-text').classed('highlighted', false);
    }
  } else {
    d3.select('#bar-chart').selectAll('.c3-bar').classed('not-highlighted', false);
    d3.select('#bar-chart').selectAll('.c3-text').classed('highlighted', false);
  }
}

// Has to be called each time the contents of the bar chart are redrawn. This applies after loading data and resizing.
function attachMouseListenersToBarChart() {
  d3.select('#bar-chart').selectAll('.c3-event-rect')
    .data(areasInBarChart)
    .on('mouseover', function(d, i) {
      if (d != ' ') {
        area(d);
      } else {
        area(lockedArea);
      }
    })          
    .on('click', function() {
      lockSelectedArea();
    });

  d3.select('#bar-chart').select('.c3-event-rects')
    .on('mouseout', function(d, i) {
      area(lockedArea);
    });
}

var sortedAreaValuePairs;
function sortAreasByValue() {
  sortedAreaValuePairs = Object.keys(data[selectedDataset].values)
    .filter(function(area) {
      return data[selectedDataset].values[area][selectedTimeIndex] !== null; 
    })
    .map(function(area) {
      return [area, data[selectedDataset].values[area][selectedTimeIndex]];
    });

  sortedAreaValuePairs.sort(function(first, second) {
    return second[1] - first[1];
  });
}

function showTopBottomValuesInBarChart() {  
    showValuesInBarChart([0, 1, 2, null, sortedAreaValuePairs.length-3, sortedAreaValuePairs.length-2, sortedAreaValuePairs.length-1]);
}

function showValuesInBarChart(ranks) {

  var areaValuePairsToShow = [];
  for (var i = 0; i < ranks.length; i++) {
    areaValuePairsToShow[i] = (ranks[i] === null) ? [' ', null] : sortedAreaValuePairs[ranks[i]];
  }
  // console.log(areaValuePairsToShow);

  areasInBarChart = areaValuePairsToShow.map(function(item) { return item[0]; });

  barChart.load({
    json: {
      values: areaValuePairsToShow.map(function(item) { return item[1] === null ? 0 : item[1]; })
    },
    done: function() {      
      attachMouseListenersToBarChart();
    }
  });
}

function highlightSelectedTimeInTimeChart() {  
  d3.select('#time-chart').selectAll('.c3-circle').style('fill-opacity', '0');
  d3.select('#time-chart').selectAll('.c3-circle-' + selectedTimeIndex).style('fill-opacity', '1');
  d3.select('#time-chart').selectAll('.c3-texts-average,.c3-texts-area').selectAll('.c3-text').style('visibility', function(d, i) {  return (d3.select('#time-chart').select('.c3-circle-' + i).classed('_expanded_') || i == selectedTimeIndex) ? 'visible' : 'hidden';  });
}



function dataset(name) {  

  // TODO: Make visualizations grey while data is loading, maybe even by using a small transition

  d3.select('#content-overlay').style('visibility', 'visible');
  d3.select('#time-slider-wrapper').style('visibility', 'hidden');
  // TODO: .classed does not update the color immediately
  d3.select('#loading-spinner').classed(datasetNames.join(' '), false).classed(name, true);
  d3.select('#loading-spinner-wrapper').style('display', 'block');


  if (!data[name]) {  // dataset is not loaded yet, show it later
    selectDatasetWhenLoaded = name;
  } else {
    if (!selectedDataset) { initVisualizations(); }  // first time a dataset is selected

    selectedDataset = name;

    colorScale.domain([minDataValue, maxDataValues[selectedDataset]]);
    colorScale.range(['#f8f8f8', datasetColors[selectedDataset].map]);
    showDatasetInMapLegend(selectedDataset);
    showCurrentValuesInMap();

    barChart.data.colors({ values: datasetColors[selectedDataset].charts });
    barChart.axis.max(maxDataValues[selectedDataset]);
    barChart.axis.labels({y: axisLabels[selectedDataset]});    
    sortAreasByValue();
    showTopBottomValuesInBarChart();
    highlightSelectedAreaInBarChart();
    
    timeChart.data.colors({ area: datasetColors[selectedDataset].charts });
    d3.select('#area-text').style('color', datasetColors[selectedDataset].charts);
    timeChart.axis.max(maxDataValues[selectedDataset]);
    timeChart.axis.labels({y: axisLabels[selectedDataset]});
    timeChart.load({
      json: {
        months: months,  // has to be loaded as well because both average and area are loaded
        average: data[selectedDataset].average,
        area: selectedArea ? data[selectedDataset].values[selectedArea] : nullArr
      }
    });
    highlightSelectedTimeInTimeChart();

    d3.select('#loading-spinner-wrapper').style('display', 'none');
    d3.select('#content-overlay').style('visibility', 'hidden');
    d3.select('#time-slider-wrapper').style('visibility', 'visible');
  }
  
}

function time(index) {
  // console.log(index);
  if (index != selectedTimeIndex) {
    selectedTimeIndex = index;

    sortAreasByValue();
    // TODO: If there are just going to be top/bottom values in the bar chart, integrate all of this stuff into one method
    showTopBottomValuesInBarChart();
    highlightSelectedAreaInBarChart();

    highlightSelectedTimeInTimeChart();

    showCurrentValuesInMap();
  }
}

function area(name) {
  if (name != selectedArea) {
    // console.log(name);
    setTimeout(function() {
      if (name == selectedArea) {  // only load data into the time chart if the area is still selected
        timeChart.load({
          json: {
            area: name ? data[selectedDataset].values[name] : nullArr
          }
        });
        d3.select('#area-text').text(name ? name : 'Select an area on the map');
      }
    }, 50);

    selectedArea = name;
    highlightSelectedAreaInBarChart();
    highlightSelectedAreaInMap();
  }
}

function lockSelectedArea() {
  d3.select('#map').select('.zip' + lockedArea).style('filter', '');

  // TODO: Johannes is working on this

  // var i = 0;
  // while (i < sortedAreaValuePairs.length) {
  //   console.log(sortedAreaValuePairs[i][0]);
  //   console.log(selectedArea);
  //   if (sortedAreaValuePairs[i][0] == selectedArea) {
  //     break;
  //   }
  //   i++;
  // }

  // console.log(i);

  // // TODO: Change if i is first or last
  // var itemsToShow = [sortedAreaValuePairs[0], [' ', null], sortedAreaValuePairs[i-1], sortedAreaValuePairs[i], sortedAreaValuePairs[i+1], [' ', null], sortedAreaValuePairs[sortedAreaValuePairs.length-1]];
  // console.log(itemsToShow);

  // areasInBarChart = itemsToShow.map(function(item) { return item[0]; });

  // barChart.load({
  //   json: {
  //     values: itemsToShow.map(function(item) { return item[1] === null ? 0 : item[1]; }),
  //     neighborhoods: ['1.', ' ', i-1 + '.', i + '.', i+1 + '.', ' ', sortedAreaValuePairs.length + '.'] //itemsToShow.map(function(item) { return item[0]; })
  //   }
  // });

  // d3.select('#bar-chart').selectAll('.c3-bar')
  //   .style('opacity', function(d, i) { return (i == selectedArea) ? 1 : 0.3; });
  // d3.select('#bar-chart').selectAll('.c3-text')
  //   .style('fill', function(d, i) { return (i == selectedArea) ? '#f8f8f8' : startColor; });


  lockedArea = selectedArea;
}





/* ------------------------------------------- Time Slider ----------------------------------------------- */

var slider;
d3.select('#time-slider').call(
  slider = d3.slider()
    .orientation("vertical")
    .min(0)
    .max(maxSliderValue)
    // .axis(d3.svg.axis().orient("right").tickSize(9.5).tickValues([8, 16, 24, 32, 40]))//[12,24,36,48,60,72,84,96,108,120,132,144,156,168]))
    .value(maxSliderValue)
    .on('slide', function(evt, value) {
      updateSliderElements(value);
      time(getTimeIndex(value));
    }));

d3.selectAll('.time-text').on('click', function() {
  var top = parseFloat(d3.select(this).style('top'));
  var sliderHeight = parseFloat(d3.select('#time-slider').style('height'));
  moveSliderTo((sliderHeight - top) / sliderHeight * maxSliderValue - 1);  
});

d3.select('#time-play-pause')
  .on('click', function() {
    playing = !playing;
    d3.select('#time-play-pause')
      .classed('mdi-av-play-circle-fill', !playing)
      .classed('mdi-av-pause-circle-fill', playing);

    // TODO: Some time, this does not pause on click properly
    function playTime() {
      if (playing) {
        var newValue = Math.max(0, Math.round(slider.value()) - 1);
        moveSliderTo(newValue);
        // console.log(slider.value());

        if (newValue === 0) {
          playing = false;
          // TODO: Ch
          d3.select('#time-play-pause')        
            .classed('mdi-av-play-circle-fill', true)
            .classed('mdi-av-pause-circle-fill', false);
            // .classed('mdi-av-replay', true);  // TODO: Make the replay icon with a circle around the arrow (just like the play/pause icons)
        }
        // console.log(this);
        window.setTimeout(playTime, 300);
      }
    }

    if (playing) {
      if (slider.value() === 0) {
        moveSliderTo(maxSliderValue);
        d3.select('#time-play-pause').classed('mdi-av-replay', false);
      }
      playTime();
    }

  });


function getTimeIndex(sliderValue) {
  return Math.floor(maxSliderValue - sliderValue);
}

function moveSliderTo(value) {
  slider.value(value);
  updateSliderElements(value);
  time(getTimeIndex(value));
}

// var oldHeight = '0px';
// var newHeight = '0px';
var monthNames = ['Jan - Mar', 'Apr - Jun', 'Jul - Sep', 'Oct - Dec'];//['Q1', 'Q2', 'Q3', 'Q4'];//['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function updateSliderElements(sliderValue) {
  var pixelsFromTop = parseFloat(d3.select('#time-slider').style('height')) * (maxSliderValue - sliderValue) / maxSliderValue;

  // TODO: This is currently in d3.slider.js; move it out from there
  // oldHeight = d3.select('.d3-slider-progress').style('height');
  // newHeight = pixelsFromTop + 'px';
  // TODO: Make this a class, not an id
  // d3.select('.d3-slider-progress')
  //   .transition()
  //   .styleTween('height', function() { return d3.interpolate(oldHeight, newHeight); })
  //   .duration(250);


  d3.selectAll('.time-text')
    .each(function() {
      var element = d3.select(this);
      var top = parseFloat(element.style('top'));
      var bottom = top + parseFloat(element.style('height'));
      element.style('color', (pixelsFromTop >= top && pixelsFromTop <= bottom) ? '#f8f8f8' : '#9e9e9e');
    });

  // TODO: Maybe move this to time()
  d3.select('#month').text(monthNames[getTimeIndex(sliderValue) % 4]);
  d3.select('#year').text(2004 + Math.floor(getTimeIndex(sliderValue) / 4));

  // oldHeight = newHeight;

  // TODO: Make axis ticks white
  d3.selectAll('.time-point')
    .style('background', function() {
      return parseFloat(d3.select(this).style('top')) <= pixelsFromTop ? '#f8f8f8' : startColor;
    });
  
}









/* ------------------------------------------- Bar Chart ----------------------------------------------- */

var barChart = c3.generate({
  bindto: '#bar-chart',
  size: barChartSize(),
  data: {
    json: {
      values: [1, 0.9, 0.8, null, 0.3, 0.2, 0.1]
    },
    colors: {
      values: startColor
    },
    type: 'bar',
    // TODO: If labels are shown, there is a slight space between the bars and the area names. Fix this
    labels: {
      format: function (value, id, i, j) { return value ? numberFormats[selectedDataset](value) : ''; }
    }
  },
  legend: {show: false},
  bar: {
    width: {
        ratio: 0.5 // this makes bar width 50% of length between ticks
    }
  },
  axis: {
    x: {
      tick: {
        format: function(x) {
          switch (x) {
            case 1: return 'Highest';
            // case 3: return '.  .  .';
            case 5: return 'Lowest';
          }
        }
      }
    },
    y: {
      min: 0,
      max: 1,
      tick: {
        format: function(d) {return '';}
      },
      label: {
        text: '',
        position: 'outer-middle'
      }
    }
  },
  transition: {duration: 150},
  tooltip: {show: false}
});










/* ------------------------------------------- Time Chart ----------------------------------------------- */

var timeChart = c3.generate({
  bindto: '#time-chart',
  size: timeChartSize(), 
  data: {
    x: 'months',
    json: {
      months: months,
      average: nullArr,
      area: nullArr
    },
    colors: {      
      average: '#f8f8f8'
    },
    names: {
      area: "",
      average: "Metro Average"
    },
    labels: {
      format: function (value, id, i, j) { return value === null ? '' : numberFormats[selectedDataset](value); }
    }
  },
  padding: {
    // left: 10,
    right: 10
  },
  legend: {show: false},
  grid: {y: {
    show: true
    // lines: [{value: 0}]
  }},
  axis: {
    x: {
      type: 'timeseries',
      tick: {
        format: '%Y',
        values: ['2005-07-02', '2009-07-02', '2013-07-02']  // 07-02 is the middle day of the year
      }
    },
    y: {
      min: 0, 
      max: 1,
      // padding: {bottom: 0}, 
      tick: {
        count: 4,
        format: function(d) {return '';}
      },
      label: {
        text: '',
        position: 'outer-middle'
      }
    }
  },
  // transition: {duration: 0},
  tooltip: {show: false}
});









/* ------------------------------------------- Map ------------------------------------------------------- */

var colorScale = d3.scale.linear().clamp(true);  // range will be added during 'dataset'
var blankMapColors = {};
var map = new Datamap({
  element: document.getElementById('map'),
  // responsive: true,
  geographyConfig: {
    dataUrl: 'data/SanDiego.json',
    borderColor: '#757575', 
    borderWidth: 0,  // 0.7
    highlightOnHover: false,
    // highlightFillColor: 'foo',  // just some random string to keep fill color the same
    // highlightBorderColor: 'black',
    // highlightBorderWidth: 2,
    popupTemplate: function(geography, data) {
      var s = '<div class="hoverinfo" style="text-align: center">' + geography.id.replace('zip', '');
      if (geography.properties.name)
        s += '<br><span style="font-size: 0.85em">' + geography.properties.name  + '</span>';
      if (lockedArea === '')
        s += '<br><span style="font-size: 0.85em; color: red; font-weight: bold">Click to Select</span>';
      s += '</div>';
      return s;
    }
  },
  scope: 'tl_2010_06_zcta510',
  fills: {
    defaultFill: startColor
  }, 
  setProjection: function(element, options) {
    var width = options.width || element.offsetWidth;
    var height = options.height || element.offsetHeight;

    // console.log('w: ' + width + ' h:' + height);

    // console.log(element);
    // console.log(options);

    // // Create a unit projection.
    // var projection = d3.geo.mercator()
    //   .scale(1)
    //   .translate([0, 0]);

    // // Create a path generator.
    // var path = d3.geo.path()
    //   .projection(projection);

    // var areas = topojson.feature(us, us.objects.states)

    // // Compute the bounds of a feature of interest, then derive scale & translate.
    // var b = path.bounds(element),
    //     s = 0.95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
    //     t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    // // Update the projection to use computed scale & translate.
    // projection
    //     .scale(s)
    //     .translate(t);


    var projection = d3.geo.mercator()
  		.center([-117.0, 33.0])
  		.scale(20000) //* width);
      .translate([width / 2, height / 2]);
	
     return {path: d3.geo.path().projection(projection), projection: projection};
  },
  done: function(datamap) {    

    originalSubunitsSize = datamap.svg.select('.datamaps-subunits').node().getBoundingClientRect();
    clipMapToContainer();

    console.log('translate(' + (mapSize().width / 2 - 100) + 'px, ' + (mapSize().height - 50) + 'px)');

    mapLegend = datamap.svg.append('g')
      .style('transform', 'translate(' + (mapSize().width / 2 - 96) + 'px, ' + (mapSize().height - 65) + 'px)')
      .classed('map-legend', true);

    // Make legend with color gradient, see https://gist.github.com/nowherenearithaca/4449376
    // and http://bl.ocks.org/mbostock/1086421

    var numStops = 10;
    for (var datasetName in datasetColors) {
      var gradient = mapLegend.append("defs")
        .append("linearGradient")
        .attr("id",'gradient-' + datasetName)
        .attr("x1","0%")
        .attr("x2","100%")
        .attr("y1","0%")
        .attr("y2","0%");

      var scale = d3.scale.linear()
        .domain([0, numStops-1])
        .range(['#f8f8f8', datasetColors[datasetName].map]);

      for (var i = 0; i < numStops; i++) {
        // console.log(i + ' - ' + i/(numStops-1) + ' - ' + scale(i));
        gradient.append("stop")
          .attr("offset", i / (numStops - 1))
          .attr("stop-color", scale(i));
      }  
    }

    mapLegendTextName = mapLegend.append('text')
      // .attr("class","legendText")
      .attr("text-anchor", "middle")
      .attr("x", 70)
      .attr("y", 10);

    mapLegendRect = mapLegend.append("rect")
      .attr("fill", startColor)
      .attr("x", 0)
      .attr("y", 20)
      .attr("width", 140)
      .attr("height", 10);

    mapLegend.append('rect')
      .attr('fill', startColor)
      .attr('x', 155)
      .attr('y', 20)
      .attr('width', 37)
      .attr('height', 10);

    mapLegend.append('text')
      // .attr("class","legendText")
      .attr("text-anchor", "start")
      .attr("x", 155)
      .attr("y", 43)
      .text('No Data');

    mapLegendTextMin = mapLegend.append('text')
      // .attr("class","legendText")
      .attr("text-anchor", "start")
      .attr("x", 0)
      .attr("y", 43);

    mapLegendTextMiddle = mapLegend.append('text')
      // .attr("class","legendText")
      .attr("text-anchor", "middle")
      .attr("x", 70)
      .attr("y", 43);

    mapLegendTextMax = mapLegend.append('text')
      // .attr("class","legendText")
      .attr("text-anchor", "end")
      .attr("x", 140)
      .attr("y", 43);





    // TODO: Make sure to select dataset only once map is loaded
    blankMapColors = {};
    var geometries = datamap.customTopo.objects.tl_2010_06_zcta510.geometries;
    for (var i = 0; i < geometries.length; i++) {
      blankMapColors[geometries[i].id] = startColor;
    }

    // define drop shadow as here: http://bl.ocks.org/cpbotha/5200394
    var defs = datamap.svg.append("defs");

    var ids = ['drop-shadow', 'drop-shadow-small'];
    var stdDeviations = [4, 1.5];
    for (var i = 0; i < ids.length; i++) {
      var filter = defs.append("filter")
          .attr("id", ids[i])
          .attr("x", "-50%")
          .attr("y", "-50%")
          .attr("height", "200%")  // prevent the shadow from being clipped by making the filter area bigger
          .attr("width", "200%");

      filter.append("feGaussianBlur")
          .attr("in", "SourceAlpha")
          .attr("stdDeviation", stdDeviations[i])  // size of the shadow
          .attr("result", "blur");

      filter.append("feOffset")
          .attr("in", "blur")
          // .attr("dx", 5)  // translation in x/y direction
          // .attr("dy", 5)
          .attr("result", "offsetBlur");

      var feMerge = filter.append("feMerge");

      feMerge.append("feMergeNode")
          .attr("in", "offsetBlur");
      feMerge.append("feMergeNode")
          .attr("in", "SourceGraphic");
    }


    // Function to place svg element on top of all other elements
    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };

    datamap.svg.selectAll('.datamaps-subunit')
      .on('mouseover.custom', function(geography) {      
        area(geography.id.replace('zip', ''));
      })
      .on('click', function(geography) {
        lockSelectedArea();
      });


    datamap.svg.select('.datamaps-subunits')
      .on('mouseout', function(geography) {
        area(lockedArea);        
      });
  }
});

var originalSubunitsSize;
function clipMapToContainer() {
  var subunits = d3.select('#map').select('.datamaps-subunits');

  var divSize = mapSize();
  var scaleFactor = Math.min(divSize.width / originalSubunitsSize.width, divSize.height / originalSubunitsSize.height);

  // apply scale and measure again for translation values
  subunits.style('transform', 'scale(' + scaleFactor + ')');
  var newSubunitsSize = subunits.node().getBoundingClientRect();

  // apply final scale and translation
  subunits.style('transform', 'translate(' + (divSize.left - newSubunitsSize.left + divSize.width / 2 - newSubunitsSize.width / 2) + 'px, ' + (divSize.top - newSubunitsSize.top + divSize.height / 2 - newSubunitsSize.height / 2) + 'px) scale(' + scaleFactor + ')');
}

var mapLegend, mapLegendRect, mapLegendTextName, mapLegendTextMin, mapLegendTextMiddle, mapLegendTextMax;

function showDatasetInMapLegend(name) {
  mapLegendRect.attr('fill', 'url(#gradient-' + name + ')');
  mapLegendTextName.text(axisLabels[name]);
  mapLegendTextMin.text(0);
  mapLegendTextMiddle.text(numberFormats[name](maxDataValues[name] / 2));
  mapLegendTextMax.text(numberFormats[name](maxDataValues[name]));  // TODO: Make clear that the rightmost color also encompasses values > max value
}


/* ------------------------------------------- Resizing --------------------------------------------------- */

function barChartSize() {
  return d3.select('#bar-chart-wrapper').node().getBoundingClientRect();
}
function timeChartSize() {
  return d3.select('#time-chart-wrapper').node().getBoundingClientRect();
}
function mapSize() {
  return d3.select('#map').node().getBoundingClientRect();
}

// var originalMapSize = mapSize();  // TODO: Do this in done method of datamaps
// var originalSubunitsSize = d3.select('#map').select('.datamaps-subunits').node().getBoundingClientRect();
// d3.select('#map').select('.datamaps-subunits').style('-webkit-transform', function() {
//     return 'scale(' + Math.min(originalMapSize.width / originalSubunitsSize.width, originalMapSize.height / originalSubunitsSize.height) + ')';
//   });

window.addEventListener('resize', function() {
  barChart.resize(barChartSize());
  attachMouseListenersToBarChart();
  timeChart.resize(timeChartSize());
  clipMapToContainer();
});
