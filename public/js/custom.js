// TODO: Make a minified version

/* ------------------------------------------- Helpers -------------------------------------------------- */

function fadeIn(selector, duration) {
  d3.select(selector).style('visibility' , 'visible')
    .transition().duration(duration ? duration : 500).style('opacity', 1);
}

function fadeOut(selector, duration) {
  d3.select(selector).transition().duration(duration ? duration : 500).style('opacity', 0);
  d3.select(selector).transition().delay(duration ? duration : 500).style('visibility' , 'hidden');
}

// Used for both the map and the bar chart popup
function popupText(area) {
  return '<div class="hoverinfo"><span style="font-weight: bold">' + 
    ((area in data[selectedDataset].values) ? numberFormats[selectedDataset](data[selectedDataset].values[area][selectedTimeIndex]) : 'No Data') +
    '</span><br><span style="font-size: 0.9em">' + ((area in areaNames) ? (areaNames[area] + ', ') : '') + selectedMetro.state + ' ' + area +
    ((lockedArea) ? '' : '<br><span style="font-size: 0.9em; color: red; font-weight: bold">Click to select</span>') + '</div>';
}




/* ------------------------------------------- Data Fetching -------------------------------------------------- */
var months = ['2004-02-15', '2004-05-15', '2004-08-15', '2004-11-15', '2005-02-15', '2005-05-15', '2005-08-15', '2005-11-15', '2006-02-15', '2006-05-15', '2006-08-15', '2006-11-15', '2007-02-15', '2007-05-15', '2007-08-15', '2007-11-15', '2008-02-15', '2008-05-15', '2008-08-15', '2008-11-15', '2009-02-15', '2009-05-15', '2009-08-15', '2009-11-15', '2010-02-15', '2010-05-15', '2010-08-15', '2010-11-15', '2011-02-15', '2011-05-15', '2011-08-15', '2011-11-15', '2012-02-15', '2012-05-15', '2012-08-15', '2012-11-15', '2013-02-15', '2013-05-15', '2013-08-15', '2013-11-15', '2014-02-15', '2014-05-15', '2014-08-15', '2014-11-15'];
var datasetNames = ['mediansaleprice', 'soldforloss', 'decreasinginvalues', 'soldasforeclosures'];
var LOADING = 1;
var LOADED = 2;
var FAILED = 3;
var datasetStatus = {'mediansaleprice': LOADING, 'soldforloss': LOADING, 'decreasinginvalues': LOADING, 'soldasforeclosures': LOADING};
var nullArr = Array.apply(null, new Array(months.length)).map(function() { return null; });
var data = {};

// Get a dataset from the backend and put it into 'data'
function fetchDataset(name, metro) {
  d3.xhr('/' + name)
    .header("Content-Type", "application/json")
    .post(JSON.stringify(metro), function(error, result) {
      if (error) {
        datasetStatus[name] = FAILED;
        return console.warn(error);
      }

      var json = JSON.parse(result.response);
      console.log('received dataset ' + name);
      console.log(json);


      if (json.values === null && json.average === null) {
        datasetStatus[name] = FAILED;
      } else {
        json.average = ((json.average && Object.keys(json.average) && Object.keys(json.average)[0])) ? json.average[Object.keys(json.average)[0]] : nullArr;
        datasetStatus[name] = LOADED;
      }

      data[name] = json;

      // TODO: Maybe make this better
      if (selectDatasetWhenLoaded == name) {
        selectDatasetWhenLoaded = '';
        dataset(name);
      }

    });
}








/* -------------------------------------- Initialization of visualizations ---------------------------------------------- */

var selectedMetro;
var selectedDataset = '';
var selectDatasetWhenLoaded = '';
var selectedTimeIndex = 0;
var selectedArea = '';
var lockedArea = '';

var startColor = '#9e9e9e';
var datasetColors = {mediansaleprice: {map: '#f44336', charts: '#ef5350'}, soldforloss: {map: '#00bcd4', charts: '#00bcd4'}, decreasinginvalues: {map: '#8bc34a', charts: '#8bc34a'}, soldasforeclosures: {map: '#ffb300', charts: '#ffb300'}};
var navBarColors = {mediansaleprice: '#ef5350', soldforloss: '#00bcd4', decreasinginvalues: '#8bc34a', soldasforeclosures: '#ffb300'};
var axisLabels = {mediansaleprice: 'Median sale price', soldforloss: 'Homes sold for loss', decreasinginvalues: 'Homes decreasing in value', soldasforeclosures: 'Homes foreclosed out of 10k'};

var minDataValues = {mediansaleprice: 200000, soldforloss: 0, decreasinginvalues: 0, soldasforeclosures: 0};
var maxDataValues = {mediansaleprice: 1000000, soldforloss: 80, decreasinginvalues: 100, soldasforeclosures: 80};
var numberFormats = {'': function() { return ''; }, mediansaleprice: d3.format('$.3s'), soldforloss: function(x) { return d3.format('.0f')(x) + '%'; }, decreasinginvalues: function(x) { return d3.format('.0f')(x) + '%'; }, soldasforeclosures: d3.format('.0f')};

function initVisualizations() {
  d3.select('#time-chart-legend').style('visibility', 'visible');
  d3.select('#time-chart').select('.c3-axis-x').style('visibility', 'visible', 'important');
  d3.select('#bar-chart').select('.c3-axis-x').style('visibility', 'visible', 'important');
  d3.select('#map').select('.map-legend').style('visibility', 'visible');

  d3.select('#time-chart').select('.c3-chart')
    .on('mouseover', function() {
      d3.select('#time-chart').selectAll('.c3-line').style('stroke-opacity', 0.5);
    })
    .on('mousemove', function() {
      d3.select('#time-chart').selectAll('.c3-texts-average,.c3-texts-area').selectAll('.c3-text').style('visibility', function(d, i) { return (d3.select('#time-chart').select('.c3-circle-' + i).classed('_expanded_') || i == selectedTimeIndex) ? 'visible' : 'hidden'; });
    })
    .on('mouseout', function() {
      d3.select('#time-chart').selectAll('.c3-texts-average,.c3-texts-area').selectAll('.c3-text').style('visibility', function(d, i) { return (i == selectedTimeIndex) ? 'visible' : 'hidden'; });
      d3.select('#time-chart').selectAll('.c3-line').style('stroke-opacity', 1);
    });

  // TODO: Deactivate this while page is updating
  $(document).on('mousewheel', function(evt) {
    moveSliderTo(Math.max(0, Math.min(maxSliderValue, slider.value() - scrollSpeed * event.deltaY)));
  });
}

function resetVisualizations() {
    timeChart.axis.labels({y: ' '});
    barChart.axis.labels({y: ' '});

    barChart.data.colors({ values: startColor });
    barChart.load({ json: barChartDefaultValues });
    barChart.axis.max(1);
    timeChart.load({ json: timeChartDefaultValues });

    d3.select('#time-chart-legend').style('visibility', 'hidden');
    d3.select('#time-chart').select('.c3-axis-x').style('visibility', 'hidden', 'important');
    d3.select('#bar-chart').select('.c3-axis-x').style('visibility', 'hidden', 'important');
    d3.select('#map').select('.map-legend').style('visibility', 'hidden');

    map.updateChoropleth(blankMapColors);  // TODO: Refactor this into a method resetMapValues or resetMapColors
    // TODO: Maybe hide selected and clicked area in map

    $(document).on('mousewheel', null);
}







/* --------------------------------------- Convenience functions for visualization -------------------------------------------------- */
/* ----------------------------------- Call ONLY these to change the data that is shown --------------------------------------------- */

// Slide up the visualizations, load the map and data for the metro
function metro(metroObject) {

  selectedMetro = metroObject;

  // Slide up visualizations and show/hide elements
  var transitionDuration = 1700;
  d3.select('nav')
    .style('visibility', 'visible')
    .transition()
    .duration(transitionDuration)
    .style('top', '0px')
    .style('opacity', 1);
  d3.select('#descriptions')
    .transition()
    .delay(transitionDuration)
    .style('visibility', 'visible');
  fadeIn('#metro-name-wrapper');
  d3.select('#metro-name')
    .text(metroObject.metro);
  d3.select('#content-pane')
    .style('visibility', 'visible')
    .transition()
    .duration(transitionDuration)
    .style('top', '50px');
  d3.select('#dataset-hint')   
    .style('visibility', 'visible')
    .transition()
    .duration(500) 
    .delay(1500)
    .style('opacity', 1);
  d3.select('#footer')
    .transition()
    .duration(transitionDuration)
    .style('background-color', '#616161', 'important');
  fadeOut('#header');

  setTimeout(function() {
    d3.selectAll('nav ul li')
      .style('cursor', 'pointer')
      .on('mouseover', function(d, i) {
        d3.select(d3.selectAll('.description')[0][i]).style('visibility', 'visible');
      })
      .on('mouseout', function() {
        d3.selectAll('.description').style('visibility', 'hidden');
      })
      .on('click', function(d, i) {
        d3.select('#dataset-hint').style('visibility', 'hidden');
        dataset(datasetNames[i]);
        d3.selectAll('nav ul li').classed('active', false);
        d3.select(this).classed('active', true);
        fadeOut('#dataset-hint');
      })
      .on('touchend', function() {
        // On touch devices, automatically hide the description
        d3.selectAll('.description').transition().delay(5000).style('visibility', 'hidden');
      });
  }, transitionDuration);

  // TODO: Make descriptions active here

  // Load map and data after some time, so the animations above run smoothly
  setTimeout(function() {loadMap(metroObject);}, 0);
  setTimeout(function() {
    // Load the datasets as the first thing, so we reduce waiting time
    for (var i = 0; i < datasetNames.length; i++) {
      fetchDataset(datasetNames[i], metroObject);
    }
  }, 1000);
}

// Show the dataset in the visualizations
function dataset(name) {

  d3.select('#content-overlay').style('visibility', 'visible');
  fadeOut('#time-slider-wrapper');

  selectDatasetWhenLoaded = '';

  switch (datasetStatus[name]) {
    case LOADING:
      selectDatasetWhenLoaded = name;
      // TODO: .classed does not update the color immediately
      d3.select('#loading-spinner').classed(datasetNames.join(' '), false).classed(name, true);
      d3.select('#loading-spinner-wrapper').style('display', 'block');
      fadeIn('#loading-spinner-wrapper');
      resetVisualizations(); // TODO: Only do this if another dataset was already loaded before
      break;
    case FAILED:
      selectedDataset = '';
      fadeOut('#loading-spinner-wrapper');
      d3.select('#loading-spinner-wrapper').transition().delay(500).style('display', 'none');
      fadeIn('#error-message');
      resetVisualizations();
      break;
    case LOADED:
      if (!selectedDataset) { initVisualizations(); }  // first time a dataset is selected

      selectedDataset = name;

      colorScale.domain([minDataValues[selectedDataset], maxDataValues[selectedDataset]]);
      colorScale.range(['#f8f8f8', datasetColors[selectedDataset].map]);
      showDatasetInMapLegend(selectedDataset);
      showCurrentValuesInMap();
      highlightSelectedAreaInMap();

      barChart.axis.min(minDataValues[selectedDataset]);
      barChart.axis.max(maxDataValues[selectedDataset]);
      barChart.axis.labels({y: axisLabels[selectedDataset]});
      barChart.data.colors({ values: datasetColors[selectedDataset].charts });
      sortAreasByValue();
      showTopBottomValuesInBarChart();
      highlightSelectedAreaInBarChart();

      // TODO: Sometimes, the bar chart does not update properly here (the values show up, but the bars stay grey and the same height as before).
      // Redrawing via resize fixes this temporarily. Investigate, why it does not update properly in the first place.
      barChart.resize();
      attachMouseListenersToBarChart();

      timeChart.data.colors({ area: datasetColors[selectedDataset].charts, average: '#f8f8f8' });
      d3.select('#area-text').style('color', datasetColors[selectedDataset].charts);
      timeChart.axis.min(minDataValues[selectedDataset]);
      timeChart.axis.max(maxDataValues[selectedDataset]);
      timeChart.axis.labels({y: axisLabels[selectedDataset]});
      timeChart.load({
        json: {
          months: months,  // has to be loaded as well because both average and area are loaded
          average: data[selectedDataset].average,
          area: (selectedArea && selectedArea in data[selectedDataset].values) ? data[selectedDataset].values[selectedArea] : nullArr
        }
      });
      if (data[selectedDataset].average == nullArr) {
        d3.select('#metro-text').style('display', 'none');//text('Metro Average not available').style('color', startColor);
      } else {
        d3.select('#metro-text').style('display', 'inline');//text('Metro Average').style('color', '#f8f8f8');
      }
      highlightSelectedTimeInTimeChart();

      fadeOut('#loading-spinner-wrapper');
      d3.select('#loading-spinner-wrapper').transition().delay(500).style('display', 'none');
      fadeOut('#error-message');
      d3.select('#content-overlay').style('visibility', 'hidden');
      fadeIn('#time-slider-wrapper');
      break;
  }

}

// Show data for a time point in the visualizations
function time(index) {
  if (index != selectedTimeIndex) {
    selectedTimeIndex = index;

    sortAreasByValue();
    // TODO: If there are just going to be top/bottom values in the bar chart, integrate all of this stuff into one method
    showTopBottomValuesInBarChart();
    highlightSelectedAreaInBarChart();
    highlightSelectedTimeInTimeChart();

    showCurrentValuesInMap();
    d3.select('.datamaps-hoverover').html(popupText(selectedArea));
    d3.select('.bar-chart-hoverover').style('display', 'none');
  }
}

// Highlight an area in the visualizations and show its data
function area(name) {
  if (name != selectedArea) {
    setTimeout(function() {
      if (name == selectedArea) {  // only load data into the time chart if the area is still selected
        timeChart.load({
          json: {
            area: (name && name in data[selectedDataset].values) ? data[selectedDataset].values[name] : nullArr
          }
        });
        d3.select('#area-text').text(name ? selectedMetro.state + ' ' + name : 'Select an area on the map');
      }
    }, 50);

    selectedArea = name;
    highlightSelectedAreaInBarChart();
    highlightSelectedAreaInMap();
  }
}

// Make the selected area stay selected permanently
function lockSelectedArea() {
  if (lockedArea != selectedArea) {
    d3.select('#map').select('.zip' + lockedArea).style('filter', '');
    lockedArea = selectedArea;
  }
}






/* ------------------------------------------- Autocomplete ----------------------------------------------- */

// Set up autocomplete
var autocomplete = $('#autocomplete').autocomplete({
    lookup: metros.map(function(metroObject) { return {value: metroObject.metro + ', ' + metroObject.state, data: metroObject}; }),
    lookupLimit: 4,
    showNoSuggestionNotice: true,
    triggerSelectOnValidInput: false,
    autoSelectFirst: true,
    appendTo: d3.select('#suggestions'),
    onSelect: function (result) {
      metro(result.data);
    }
});

// Create default suggestions
d3.select('#suggestions')
  .selectAll('.autocomplete-default')
  .data([
      {metro: 'Los Angeles', state: 'CA'},
      {metro: 'San Francisco', state: 'CA'},
      {metro: 'San Diego', state: 'CA'},
      {metro: 'Sacramento', state: 'CA'}
    ])
  .enter()
  .append('div')
  .classed('autocomplete-suggestion', true)
  .classed('autocomplete-default', true)
  .text(function(d) { return d.metro; })
  .on('mouseover', function() { d3.select(this).classed('autocomplete-selected', true); })
  .on('mouseout', function() { d3.select(this).classed('autocomplete-selected', false); })
  .on('click', function(d) {
    d3.select('#autocomplete').attr('value', d.metro + ', ' + d.state);
    metro(d);
  });

// Show default suggestions when there is no input
d3.select('#autocomplete')
  .on('input', function() {
    if (this.value) {
      d3.selectAll('.autocomplete-default').style('display', 'none');
      d3.select('#header-description').style('visibility', 'hidden');
    } else {
      d3.selectAll('.autocomplete-default').style('display', 'block');
      d3.select('#header-description').style('visibility', 'visible');
    }
  });







/* ------------------------------------------- Time Slider ----------------------------------------------- */

var maxSliderValue = months.length - 0.01;
var scrollSpeed = 0.01;
var playing = false;
var slider;
var monthNames = ['Jan - Mar', 'Apr - Jun', 'Jul - Sep', 'Oct - Dec'];

function getTimeIndex(sliderValue) {
  return Math.floor(maxSliderValue - sliderValue);
}

// Init slider
d3.select('#time-slider').call(
  slider = d3.slider()
    .orientation("vertical")
    .min(0)
    .max(maxSliderValue)
    .value(maxSliderValue)
    .on('slide', function(evt, value) {
      updateSliderElements(value);
      time(getTimeIndex(value));
    }));

// Make texts on time line clickable
d3.selectAll('.time-texts p').on('click', function() {
  var top = parseFloat(d3.select(this).style('top'));
  var sliderHeight = parseFloat(d3.select('#time-slider').style('height'));
  moveSliderTo((sliderHeight - top) / sliderHeight * maxSliderValue - 1);
});

// Set the month and year labels, highlight progress and notches on time slider
function updateSliderElements(sliderValue) {
  var pixelsFromTop = parseFloat(d3.select('#time-slider').style('height')) * (maxSliderValue - sliderValue) / maxSliderValue;

  // TODO: This is currently in d3.slider.js; move it out from there
  // oldHeight = d3.select('.d3-slider-progress').style('height');
  // newHeight = pixelsFromTop + 'px';

  d3.selectAll('.time-texts p')
    .each(function() {
      var element = d3.select(this);
      var top = parseFloat(element.style('top'));
      var bottom = top + parseFloat(element.style('height'));
      element.style('color', (pixelsFromTop >= top && pixelsFromTop <= bottom) ? '#f8f8f8' : '#9e9e9e');
    });

  d3.select('#month').text(monthNames[getTimeIndex(sliderValue) % 4]);
  d3.select('#year').text(2004 + Math.floor(getTimeIndex(sliderValue) / 4));

  d3.selectAll('.time-point')
    .style('background', function() {
      return parseFloat(d3.select(this).style('top')) <= pixelsFromTop ? '#f8f8f8' : startColor;
    });
}

function moveSliderTo(value) {
  slider.value(value);
  updateSliderElements(value);
  time(getTimeIndex(value));
}

// Make button play and pause the time slider
d3.select('#time-play-pause')
  .on('click', function() {
    playing = !playing;
    d3.select('#time-play-pause')
      .classed('mdi-av-play-circle-fill', !playing)
      .classed('mdi-av-pause-circle-fill', playing);

    function playTime() {
      if (playing) {
        var newValue = Math.max(0, Math.round(slider.value()) - 1);
        moveSliderTo(newValue);

        if (newValue === 0) {
          playing = false;
          d3.select('#time-play-pause')
            .classed('mdi-av-play-circle-fill', true)
            .classed('mdi-av-pause-circle-fill', false);
        }

        // Call this function again after some time to go to the next point
        window.setTimeout(playTime, 300);
      }
    }

    if (playing) {

      // Reset if slider handle is at the bottom
      if (slider.value() === 0) {
        moveSliderTo(maxSliderValue);
        d3.select('#time-play-pause').classed('mdi-av-replay', false);
      }

      playTime();
    }

  });






/* ------------------------------------------- Bar Chart ----------------------------------------------- */

var barChartDefaultValues = { values: [1, 0.9, 0.8, null, 0.3, 0.2, 0.1] };
var barChartDefaultColors = { values: startColor };
var barChart = c3.generate({
  bindto: '#bar-chart',
  size: barChartSize(),
  data: {
    json: barChartDefaultValues,
    colors: barChartDefaultColors,
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
      padding: {bottom: 0, top: 15},
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

function positionBarChartHoverover() {
  var coordinates = [0, 0];
  coordinates = d3.mouse(d3.select('#bar-chart-wrapper').node());
  var x = coordinates[0];
  var y = coordinates[1];
  d3.select('.bar-chart-hoverover')
    .style('top', y + 30 + 'px')
    .style('left', x + 50 + 'px');
}

// Has to be called each time the contents of the bar chart are redrawn. This applies after loading data and resizing.
function attachMouseListenersToBarChart() {
  d3.select('#bar-chart').selectAll('.c3-event-rect')
    .data(areasInBarChart)
    .on('mouseover', function(d, i) {
      if (d != ' ') {
        area(d);
        d3.select('.bar-chart-hoverover')
          .style('display', 'block')
          .html(popupText(d));
        positionBarChartHoverover();
      } else {
        area(lockedArea);
      }
    })
    .on('mousemove', function() {
      positionBarChartHoverover();
    })
    .on('click', function() {
      lockSelectedArea();
    });

  d3.select('#bar-chart').select('.c3-event-rects')
    .on('mouseout', function(d, i) {
      area(lockedArea);
      d3.select('.bar-chart-hoverover').style('display', 'none');
    });
}

// TODO: Refactor this, because we just have top bottom values in the barchart
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

var areasInBarChart = [];
function showValuesInBarChart(ranks) {

  var areaValuePairsToShow = [];
  for (var i = 0; i < ranks.length; i++) {
    areaValuePairsToShow[i] = (ranks[i] === null) ? [' ', null] : sortedAreaValuePairs[ranks[i]];
  }
  console.log(areaValuePairsToShow);

  areasInBarChart = areaValuePairsToShow.map(function(item) { return item ? item[0] : ' '; });

  barChart.load({
    json: {
      values: areaValuePairsToShow.map(function(item) { return (item && item[1]) ? item[1] : 0; })
    },
    done: function() {
      attachMouseListenersToBarChart();
    }
  });
}








/* ------------------------------------------- Time Chart ----------------------------------------------- */

var timeChartDefaultValues = {
      months: months,
      average: nullArr,
      area: nullArr
    };
var timeChartDefaultColors = { average: startColor, area: startColor };
var timeChart = c3.generate({
  bindto: '#time-chart',
  size: timeChartSize(),
  data: {
    x: 'months',
    json: timeChartDefaultValues,
    colors: timeChartDefaultColors,
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
      padding: {bottom: 0, top: 15},
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

function highlightSelectedTimeInTimeChart() {
  d3.select('#time-chart').selectAll('.c3-circle').style('fill-opacity', '0');
  d3.select('#time-chart').selectAll('.c3-circle-' + selectedTimeIndex).style('fill-opacity', '1');
  d3.select('#time-chart').selectAll('.c3-texts-average,.c3-texts-area').selectAll('.c3-text').style('visibility', function(d, i) {  return (d3.select('#time-chart').select('.c3-circle-' + i).classed('_expanded_') || i == selectedTimeIndex) ? 'visible' : 'hidden';  });
}







/* ------------------------------------------- Map ------------------------------------------------------- */

var colorScale = d3.scale.linear().clamp(true);  // range will be added during 'dataset'
var blankMapColors = {};
var areaNames = {};
var map;
function loadMap(metro) {
  map = new Datamap({
    element: document.getElementById('map'),
    // responsive: true,
    geographyConfig: {
      dataUrl: 'data/' + metro.state + '/' + metro.metro.replace(' ', '') + '.json',
      borderColor: '#757575',
      borderWidth: 0, 
      highlightOnHover: false,
      popupTemplate: function(geography, data) {
        return popupText(geography.id.replace('zip', ''), geography.properties.name);
      }
    },
    scope: 'zip',
    fills: {
      defaultFill: startColor
    },
    setProjection: function(element, options) {
      var width = options.width || element.offsetWidth;
      var height = options.height || element.offsetHeight;

      var projection = d3.geo.mercator()
    		.center([-117.0, 33.0])
    		.scale(20000)
        .translate([width / 2, height / 2]);

       return {path: d3.geo.path().projection(projection), projection: projection};
    },
    done: function(datamap) {

      originalSubunitsSize = datamap.svg.select('.datamaps-subunits').node().getBoundingClientRect();
      clipMapToContainer();

      // console.log('translate(' + (mapSize().width / 2 - 100) + 'px, ' + (mapSize().height - 50) + 'px)');

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
      var geometries = datamap.customTopo.objects.zip.geometries;
      for (var i = 0; i < geometries.length; i++) {
        blankMapColors[geometries[i].id] = startColor;
        if (geometries[i]. properties.name)
          areaNames[geometries[i].id.replace('zip', '')] = geometries[i].properties.name;
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
            // .attr("dx", 1)  // translation in x/y direction
            // .attr("dy", 1)
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
}

var originalSubunitsSize;
function clipMapToContainer() {
  var subunits = d3.select('#map').select('.datamaps-subunits');

  if (subunits.node()) {

    var divSize = mapSize();
    var scaleFactor = Math.min(divSize.width / originalSubunitsSize.width, divSize.height / originalSubunitsSize.height);

    // TODO: Firefox scales elements from the center, so the map position is wrong afterwards.
    // subunits.style('position', 'absolute');
    // subunits.style('-moz-transform-origin', 'top left');

    // apply scale and measure again for translation values
    var scaleTransform = 'scale(' + scaleFactor + ')';
    subunits.style('transform', scaleTransform);
    // subunits.style('-webkit-transform', scaleTransform);
    // subunits.style('-ms-transform', scaleTransform);
    // subunits.style('-moz-transform', scaleTransform);
    var newSubunitsSize = subunits.node().getBoundingClientRect();

    // apply final scale and translation
    var finalTransform = 'translate(' + (divSize.left - newSubunitsSize.left + divSize.width / 2 - newSubunitsSize.width / 2) + 'px, ' + (divSize.top - newSubunitsSize.top + divSize.height / 2 - newSubunitsSize.height / 2) + 'px) scale(' + scaleFactor + ')';
    subunits.style('transform', finalTransform);
    // subunits.style('-webkit-transform', finalTransform);
    // subunits.style('-ms-transform', finalTransform);
    // subunits.style('-moz-transform', finalTransform);
  }
}

var mapLegend, mapLegendRect, mapLegendTextName, mapLegendTextMin, mapLegendTextMiddle, mapLegendTextMax;
function showDatasetInMapLegend(name) {
  mapLegendRect.attr('fill', 'url(#gradient-' + name + ')');
  mapLegendTextName.text(axisLabels[name]);
  mapLegendTextMin.text(numberFormats[name](minDataValues[name]));
  mapLegendTextMiddle.text(numberFormats[name](minDataValues[name] + (maxDataValues[name] - minDataValues[name]) / 2));
  mapLegendTextMax.text('>' + numberFormats[name](maxDataValues[name]));  // TODO: Make clear that the rightmost color also encompasses values > max value
}

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






/* ------------------------------------------- Resizing --------------------------------------------------- */

function barChartSize() {
  return d3.select('#bar-chart-wrapper').node().getBoundingClientRect();
}
function timeChartSize() {
  return d3.select('#time-chart-wrapper').node().getBoundingClientRect();
}
function mapSize() {
  return d3.select('#map-wrapper').node().getBoundingClientRect();
}

window.addEventListener('resize', function() {
  barChart.resize(barChartSize());
  attachMouseListenersToBarChart();
  timeChart.resize(timeChartSize());
  clipMapToContainer();
});







/*---------------------------------------- Leap Motion -------------------------------------------------------------- */
//Highlighter  - Switching between tabs etc
var currentTab=$('nav ul li').attr('id').split("-")[2];
var updateHighlights = function(dir){
    //var nextTab = $('nav ul li').attr('id').split("-")[2];


    var nextTab=0;
    if(currentTab != null){
        nextTab=parseInt(currentTab);
    }

    if((nextTab+dir) <5 && (nextTab+dir)>=1 ){
        console.log("DIR is : "+parseInt(nextTab+dir));
        nextTab = nextTab + dir;
    }
    else if(nextTab+parseInt(dir) <= 0){
        nextTab = 4;
    }
    else{
        nextTab = 1;

    }

    dataset(datasetNames[nextTab-1]);
    d3.selectAll('nav ul li').classed('active', false);
    var tag ="#"+datasetNames[nextTab-1];
    d3.select('.'+datasetNames[nextTab-1]).classed('active',true);

    //d3.dataset(datasetNames[nextTab-1]);
    //d3.selectAll('nav ul li').classed('active',true);

    //console.log(datasetNames[nextTab-1]);
    console.log("next:"+nextTab);
    currentTab=nextTab;
};

var timeSlider = function(dir){
    if (selectedMetro) { 
        if((playing && dir==-1) ||(!playing && dir==1)){
            $('#time-play-pause')[0].click();
            //playing = !playing;
        }
        if(dir == 0){
            moveSliderTo(maxSliderValue);
            playing = false;
            d3.select('#time-play-pause')
                .classed('mdi-av-play-circle-fill', true)
                .classed('mdi-av-pause-circle-fill', false);
        }
    }
};

//Leapmotion
var controller = Leap.loop({enableGestures: true}, function(frame){
});

/* ----------- LEAP FUNCTIONS TO SWIPE BETWEEN PAGES/CATEGORIES --------------*/
var swipeRightFunction = function(){
  updateHighlights(1);
};


var swipeLeftFunction = function(){
    console.log("CALLS LEFT");
    updateHighlights(-1);
};

var swipeUpFunction = function () {
    console.log("Calls UP");
    timeSlider(-1);
};

var swipeDownFunction = function () {
    console.log("Calls DOWN");
    timeSlider(1);
};

var circleFunction = function () {
    console.log("Calls circle");
    timeSlider(0);
};

/* ------------- CONFIG FOR LEAP-GESTURES.JS ---------------- */
config = {
    // Event handles for recognized gestures
    swipeLeft: swipeLeftFunction,
    swipeRight: swipeRightFunction,
    swipeUp: swipeUpFunction,
    swipeDown: swipeDownFunction,
    circle: circleFunction, // Set to null or leave out to not track this type of gesture
    hand: null,
    clap: null,
    statusChanged: null, // gets called when the status changes
    preventBackForth: true, // This enables users to continuously swipe in one direction.
    confidenceThreshold: 0.35, // Gestures with a confidence lower than this are ignored
    handDuration: 800, // How long a fist has to be kept to trigger the event (in ms)
    controller: controller, // You can pass in a LeapController if youo want, elsewise one is created for you. Remember to set "enableGestures: true"!
    useControllerEvents: false // If set to true, the event functions will be ignored. You can then use the appropriate controller.on(...) functions (see below)
};

var leapGestures = new LeapGestures(config);

