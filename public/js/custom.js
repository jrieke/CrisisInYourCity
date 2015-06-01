// TODO: Divide this into different files
// TODO: Make a minified version





function barChartSize() {
  return d3.select('#bar-chart-wrapper').node().getBoundingClientRect();
}
function timeChartSize() {
  return d3.select('#time-chart-wrapper').node().getBoundingClientRect();
}
function mapSize() {
  return d3.select('#map-wrapper').node().getBoundingClientRect();
}

var slidedUp = false;
var maxSliderValue = 180;
var scrollSpeed = 0.03;
var playing = false;
var startColor = '#9e9e9e';
var city = 'San Diego';
var selectedArea = ''; 
var clickedArea = '';
var areasForBarChart = ['92037', '91901', '91902', '91910', '91911', '91913'];
var selectedTimeIndex = 0;
var selectedDataset = '';

var datasetColors = {mediansaleprice: {map: '#f44336', charts: '#ef5350'}, soldforloss: {map: '#00bcd4', charts: '#00bcd4'}, decreasinginvalues: {map: '#8bc34a', charts: '#8bc34a'}, soldasforeclosures: {map: '#ffb300', charts: '#ffb300'}};
var minDataValue = 0;
var datasetNames = ['mediansaleprice', 'soldforloss', 'decreasinginvalues', 'soldasforeclosures'];
var maxDataValues = {mediansaleprice: 1000000, soldforloss: 80, decreasinginvalues: 100, soldasforeclosures: 40};
var axisLabels = {mediansaleprice: 'Median sale price / $', soldforloss: 'Homes sold for loss / %', decreasinginvalues: 'Homes decreasing in value / %', soldasforeclosures: 'Homes foreclosed / %'};
var numberFormats = {'': function() { return ''; }, mediansaleprice: d3.format('.3s'), soldforloss: d3.format('.0f'), decreasinginvalues: d3.format('.0f'), soldasforeclosures: d3.format('.0f')};

function down() {
  if (!slidedUp) {
    d3.select('#front-header')
      .transition()
      .duration(1000)
      .style('top', '-300px');

    d3.select('#content')
      .transition()
      .duration(1000)
      .style('top', '80px');

    d3.select('#up-arrow')
      .transition()
      .duration(1000)
      .style('opacity', 1);

    d3.selectAll('.description')
      .transition()
      .delay(1000)
      .style('visibility', 'hidden');


    slidedUp = true;
  }
}

function up() {
  if (slidedUp) {
    d3.select('#front-header')
      .transition()
      .duration(1000)
      .style('top', '0px');

    d3.select('#content')
      .transition()
      .duration(1000)
      .style('top', '380px');

    d3.select('#up-arrow')
      .transition()
      .duration(1000)
      .style('opacity', 0);

    // TODO: uninit visualizations when going up

    slidedUp = false;
  }
}
d3.select('#up-arrow').on('click', up);

var slidecounter = false;

function intro() {


if (!slidecounter) {



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
    slidecounter = true;
    if (!selectedDataset) { initVisualizations(); }  // TODO: See if this causes any problems because the stuff from the dataset needs longer to load
    dataset(datasetNames[i]);  // TODO: Fix this to work with all datasets
    d3.selectAll('.nav-title').classed('active', false);
    d3.select(this).classed('active', true);
    // selectedTitle = i;
  });


}

else {

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
    if (!selectedDataset) { initVisualizations(); }  // TODO: See if this causes any problems because the stuff from the dataset needs longer to load
    dataset(datasetNames[i]);
    d3.selectAll('.nav-title').classed('active', false);
    d3.select(this).classed('active', true);
    // selectedTitle = i;
  });

}

}

intro();





var data = {
  // months: ['2005-01-15', '2006-01-15', '2007-01-15', '2008-01-15', '2009-01-15', '2010-01-15']
  months: ['2000-01-15', '2000-02-15', '2000-03-15', '2000-04-15', '2000-05-15', '2000-06-15', '2000-07-15', '2000-08-15', '2000-09-15', '2000-10-15', '2000-11-15', '2000-12-15', '2001-01-15', '2001-02-15', '2001-03-15', '2001-04-15', '2001-05-15', '2001-06-15', '2001-07-15', '2001-08-15', '2001-09-15', '2001-10-15', '2001-11-15', '2001-12-15', '2002-01-15', '2002-02-15', '2002-03-15', '2002-04-15', '2002-05-15', '2002-06-15', '2002-07-15', '2002-08-15', '2002-09-15', '2002-10-15', '2002-11-15', '2002-12-15', '2003-01-15', '2003-02-15', '2003-03-15', '2003-04-15', '2003-05-15', '2003-06-15', '2003-07-15', '2003-08-15', '2003-09-15', '2003-10-15', '2003-11-15', '2003-12-15', '2004-01-15', '2004-02-15', '2004-03-15', '2004-04-15', '2004-05-15', '2004-06-15', '2004-07-15', '2004-08-15', '2004-09-15', '2004-10-15', '2004-11-15', '2004-12-15', 
  '2005-01-15', '2005-02-15', '2005-03-15', '2005-04-15', '2005-05-15', '2005-06-15', '2005-07-15', '2005-08-15', '2005-09-15', '2005-10-15', '2005-11-15', '2005-12-15', '2006-01-15', '2006-02-15', '2006-03-15', '2006-04-15', '2006-05-15', '2006-06-15', '2006-07-15', '2006-08-15', '2006-09-15', '2006-10-15', '2006-11-15', '2006-12-15', '2007-01-15', '2007-02-15', '2007-03-15', '2007-04-15', '2007-05-15', '2007-06-15', '2007-07-15', '2007-08-15', '2007-09-15', '2007-10-15', '2007-11-15', '2007-12-15', '2008-01-15', '2008-02-15', '2008-03-15', '2008-04-15', '2008-05-15', '2008-06-15', '2008-07-15', '2008-08-15', '2008-09-15', '2008-10-15', '2008-11-15', '2008-12-15', '2009-01-15', '2009-02-15', '2009-03-15', '2009-04-15', '2009-05-15', '2009-06-15', '2009-07-15', '2009-08-15', '2009-09-15', '2009-10-15', '2009-11-15', '2009-12-15', '2010-01-15', '2010-02-15', '2010-03-15', '2010-04-15', '2010-05-15', '2010-06-15', '2010-07-15', '2010-08-15', '2010-09-15', '2010-10-15', '2010-11-15', '2010-12-15', '2011-01-15', '2011-02-15', '2011-03-15', '2011-04-15', '2011-05-15', '2011-06-15', '2011-07-15', '2011-08-15', '2011-09-15', '2011-10-15', '2011-11-15', '2011-12-15', '2012-01-15', '2012-02-15', '2012-03-15', '2012-04-15', '2012-05-15', '2012-06-15', '2012-07-15', '2012-08-15', '2012-09-15', '2012-10-15', '2012-11-15', '2012-12-15', '2013-01-15', '2013-02-15', '2013-03-15', '2013-04-15', '2013-05-15', '2013-06-15', '2013-07-15', '2013-08-15', '2013-09-15', '2013-10-15', '2013-11-15', '2013-12-15', '2014-01-15', '2014-02-15', '2014-03-15', '2014-04-15', '2014-05-15', '2014-06-15', '2014-07-15', '2014-08-15', '2014-09-15', '2014-10-15', '2014-11-15', '2014-12-15', '2015-01-15']
};
// var areas = ['Amphitheater And Water Park', 'Bella Lago', 'Bonita Long Canyon', 'East Lake', 'Eastlake Trails', 'Eastlake Vistas', 'Eastlake Woods', 'Estlake Greens', 'Fenton St', 'Golf Course', 'Lynwood Hills', 'Northwest', 'Otay Ranch', 'Paseo Ranchoero', 'Rancho Del Rey', 'Rolling Hills Ranch', 'Southwest', 'Sunbow', 'Terra Nova', 'Thomy Locust Pl', 'Village Center', 'Yosemite Dr', 'Allied Gardens', 'Alta Vista', 'Balboa Park', 'Bario Logan', 'Bay Ho', 'Bay Park', 'Bay Terrace', 'Bird Land', 'Carmel Mountain', 'Carmel Valley', 'Chollas View', 'City Heights East', 'City Heights West', 'Clairemont Mesa', 'College Area', 'Columbia', 'Core', 'Cortez Hill', 'Darnall', 'Del Cerro', 'Del Mar Heights', 'East Village', 'Egger Highlands', 'El Cerritos', 'Emerald Hills', 'Encanto', 'Gaslamp Quarter', 'Gateway', 'Grant Hill', 'Grantville', 'Horton Plaza', 'Jomacha-Lomita', 'Kearny Mesa', 'Kensington', 'La Jolla', 'La Jolla Village', 'Lake Murray', 'Lincoln Park', 'Linda Vista', 'Little Italy', 'Loma Portal', 'Marina', 'Memorial', 'Midtown', 'Midtown District', 'Mira Mesa', 'Miramar', 'Mission Bay', 'Mission Valley', 'Moreno Mission', 'Mount Hope', 'Mountain View', 'Nestor', 'Normal Heights', 'North City', 'North Clairemont', 'North Hills', 'Oak Park', 'Ocean Beach', 'Old Town', 'Pacific Beach', 'Palm City', 'Paradise Hills', 'Park West', 'Rancho Bernadino', 'Rancho Penasquitos', 'Rolando', 'Roseville', 'Sabre Springs', 'San Carlos', 'San Ysidro', 'Scripps Ranch', 'Serra Mesa', 'Sky Line', 'Sorrento Valley', 'South Park', 'Southcrest', 'Talmadge', 'Tierrasanta', 'Tijuana River Valley', 'Torrey Pines', 'University City', 'Valencia Park', 'Webster', 'West University Heights', 'Wooded Area'];
// for (var i = 0; i < areas.length; i++) {
//   data[areas[i]] = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
// }
var average = [];  // TODO: Get real numbers


var numLoaded = 0;

function fetchDataset(name) {
  d3.json('/' + name, function(error, json) {
    if (error) return console.log(error);

    console.log('received dataset ' + name);
    // console.log(json);

    json.average = json['92101'];  // TODO: The city average should already be in the json file
    data[name] = json;

    numLoaded++;
    if (numLoaded == datasetNames.length) {
      d3.select('#loading').text('Done!');
    }

  
  // var firstRun = true;  
  // var valuesArr = [];
  // for (var area in json) {
  //   var values = [];
  //   for (var month in json[area]) {
  //     if (firstRun) {
  //       data.months.push(month + '-15');
  //     }
  //     values.push(json[area][month]);
  //   }
  //   valuesArr.push(values);
  // }

  // average = valuesArr[Math.floor(Math.random() * valuesArr.length)];
  // for (var i = 0; i < areas.length; i++) {
  //   data[areas[i]] = valuesArr[Math.floor(Math.random() * valuesArr.length)];
  // }

  // console.log(data);

  });
}


for (var i = 0; i < datasetNames.length; i++) {
  fetchDataset(datasetNames[i]);
}



function initVisualizations() {
  timeChart.data.colors({
    average: '#f8f8f8'
  });
  d3.select('#time-chart-legend').style('visibility', 'visible');
  // d3.select('#neighborhood-text').text(selectedArea);
  // d3.select('#city-text').text(Metro Average);
  // d3.select('#time-chart').selectAll('.c3-circle-0').style('fill-opacity', 1);
  // d3.select('#time-chart').selectAll('.c3-text-0').style('visibility', 'visible');
  d3.select('#time-chart').select('.c3-chart')
    .on('mouseover', function() {
      d3.select('#time-chart').selectAll('.c3-line').style('stroke-opacity', 0.5);      
    })
    .on('mousemove', function() {
      d3.select('#time-chart').selectAll('.c3-texts-average,.c3-texts-neighborhood').selectAll('.c3-text').style('visibility', function(d, i) { return (d3.select('#time-chart').select('.c3-circle-' + i).classed('_expanded_') || i == selectedTimeIndex) ? 'visible' : 'hidden'; });
    })
    .on('mouseout', function() {
      d3.select('#time-chart').selectAll('.c3-texts-average,.c3-texts-neighborhood').selectAll('.c3-text').style('visibility', function(d, i) { return (i == selectedTimeIndex) ? 'visible' : 'hidden'; });
      d3.select('#time-chart').selectAll('.c3-line').style('stroke-opacity', 0.9);
    });

  // d3.select('#bar-chart').selectAll('.c3-text').style('visibility', 'visible');   // Now handled through 'numberFormats'
  // d3.select('#bar-chart').selectAll('.c3-bar')
  //   .on('mouseover', function() {
  //     d3.select('#bar-chart').selectAll('.c3-bar').style('fill-opacity', 0.5);
  //     d3.select(this).style('fill-opacity', 1);
  //   })
  //   .on('mouseout', function() {
  //     d3.select('#bar-chart').selectAll('.c3-bar').style('fill-opacity', 1);
  //   });

  // TODO: Do this a little bit more elegant than just making it visible at once, eg by a transition with opacity
  d3.select('#time-slider-wrapper').style('visibility', 'visible');

  $(document).on('mousewheel', function(evt) {
    var newValue = Math.max(0, Math.min(maxSliderValue, slider.value() - scrollSpeed * event.deltaY));
    slider.value(newValue);
    updateSliderElements(newValue, false);
    // console.log(newValue);
    time(maxSliderValue - Math.round(newValue));
  });
}



function time(index) {
  // console.log(index);
  if (index != selectedTimeIndex) {    
    barChart.load({
      json: {
        values: areasForBarChart.map(function(area) { return data[selectedDataset][area][selectedTimeIndex] === null ? 0 : data[selectedDataset][area][selectedTimeIndex]; })
      }
    });

    // d3.select('#time-chart').selectAll('.c3-circle').style('visibility', 'hidden');
    d3.select('#time-chart').selectAll('.c3-circle').style('fill-opacity', '0');
    // d3.select('#time-chart').selectAll('.c3-circle').style('r', '1');
    // d3.select('#time-chart').selectAll('.c3-circle-' + index).style('visibility', 'visible');
    d3.select('#time-chart').selectAll('.c3-circle-' + index).style('fill-opacity', '1');
    // d3.select('#time-chart').selectAll('.c3-circle-' + index).style('r', '5');
    // d3.select('#time-chart').select('.c3-circles-average').selectAll('.c3-circle').style('opacity', function(d, i) { return (i < index+1) ? 1 : 0.2; });
    // d3.select('#time-chart').select('.c3-circles-neighborhood').selectAll('.c3-circle').style('opacity', function(d, i) { return (i < index+1) ? 1 : 0.2; });

    d3.select('#time-chart').selectAll('.c3-texts-average,.c3-texts-neighborhood').selectAll('.c3-text').style('visibility', function(d, i) {  return (d3.select('#time-chart').select('.c3-circle-' + i).classed('_expanded_') || i == index) ? 'visible' : 'hidden';  });
    // d3.select('#time-chart').selectAll('.c3-text-' + index).style('visibility', 'visible');

    // TODO: Maybe integrate this with the same snippet in dataset()
    map.updateChoropleth(blankMapColors);

    var mapColors = {};
    for (var area in data[selectedDataset]) {
      mapColors['zip' + area] = (data[selectedDataset][area][index] === null ? startColor : colorScale(data[selectedDataset][area][index]));
    }
    // 'mapColors' also contains the 'months' field, but that is simply ignored by datamaps
    map.updateChoropleth(mapColors);

    selectedTimeIndex = index;
  }
} 

function neighborhood(name) {
  console.log(name);
  if (name != selectedArea) {    
    timeChart.data.names({
      neighborhood: name
    });
    if (name) {
      // console.log(name);
      timeChart.load({
        json: {
          neighborhood: data[selectedDataset][name]
        }
      });
      d3.select('#neighborhood-text').text(name);
    } else {  // unselect area
      timeChart.load({
        json: {
          neighborhood: [null]
        }
      });
      d3.select('#neighborhood-text').text('Select an area on the map');
    }

    // TODO: Update bar chart

    selectedArea = name;
  }
}

function dataset(name) {
  // TODO: Maybe change this function to use selectedDataset instead of name
  selectedDataset = name;

  // TODO: Make visualizations grey while data is loading, maybe even by using a small transition
  // TODO: Just a short fix to make this work. Change the frontend to work with the dataset names instead of indices and remove this
  var index = 0;

  d3.select('#content-overlay').style('visibility', 'visible');

  colorScale.domain([minDataValue, maxDataValues[name]]);
  colorScale.range(['#f8f8f8', datasetColors[name].map]);

  map.updateChoropleth(blankMapColors);
  var mapColors = {};
  for (var area in data[name]) {
    mapColors['zip' + area] = (data[name][area][selectedTimeIndex] === null ? startColor : colorScale(data[name][area][selectedTimeIndex]));
  }
  // 'mapColors' also contains the 'months' field, but that is simply ignored by datamaps
  // console.log(mapColors);
  // mapColors2 = {'92037': '#00ff00'};
  // console.log(mapColors2);
  // map.updateChoropleth(mapColors2);
  map.updateChoropleth(mapColors);

  barChart.data.colors({
    values: datasetColors[name].charts
  });
  barChart.axis.max(maxDataValues[name]);
  barChart.axis.labels({y: axisLabels[name]});
  barChart.load({
    json: {
      neighborhoods: areasForBarChart,  // has to be loaded at the same time as values, otherwise the text fields stay empty
      values: areasForBarChart.map(function(area) { return data[name][area][selectedTimeIndex] === null ? 0 : data[name][area][selectedTimeIndex]; })
    }
  });

  timeChart.data.colors({
    neighborhood: datasetColors[name].charts
  });
  timeChart.axis.max(maxDataValues[name]);
  timeChart.axis.labels({y: axisLabels[name]});
  timeChart.load({
    json: {
      years: data.months,
      average: data[name].average,
      neighborhood: selectedArea ? data[name][selectedArea] : [null]
    }
  });
  d3.select('#neighborhood-text').style('color', datasetColors[name].charts);

  d3.select('#content-overlay').style('visibility', 'hidden');


  
}


// var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


// TODO: Integrate this with time()
function updateSliderElements(sliderValue, animate) {
  // console.log(sliderValue);
  // console.log(Math.round(2005+(maxSliderValue - sliderValue)));
  // console.log(((maxSliderValue-sliderValue)/maxSliderValue*100 + '%'));
  var percent = (maxSliderValue - sliderValue) / maxSliderValue * 100;

  d3.select('#slider-progress')  // TODO: Maybe integrate this in d3.slider directly or send them a pull request
    // .transition()
    // .styleTween(position, function() { return d3.interpolate(oldPos, newPos); })
    // .duration(animate ? 250 : 0)
    .style('height', percent + '%');

  // TODO: Allow user to click on timeline texts
  var pos = parseFloat(d3.select('#slider-progress').style('height'));
  d3.selectAll('.time-text')
    .each(function() {
      var element = d3.select(this);
      var top = parseFloat(element.style('top'));
      var bottom = top + parseFloat(element.style('height'));
      // console.log(top + " - " + bottom);
      element.style('color', (pos >= top && pos <= bottom) ? '#f8f8f8' : '#9e9e9e');
    });

  d3.select('#month').text(monthNames[Math.floor(maxSliderValue-sliderValue) % 12]);
  d3.select('#year').text(Math.floor(2000 + (maxSliderValue-sliderValue) / 12));  // TODO: Change this once we have actual months for the slider values

  // d3.selectAll('.d3-slider-axis-right').selectAll('line').style('stroke', function() { d3.select(this).top}'#f8f8f8');
  
}




var slider;
d3.select('#time-slider').call(
  slider = d3.slider()
    .orientation("vertical")
    .min(0)
    .max(maxSliderValue)
    .axis(d3.svg.axis().orient("right").tickSize(9.5).tickValues([24,48,72,96,120,144]))//[12,24,36,48,60,72,84,96,108,120,132,144,156,168]))
    .value(maxSliderValue)
    .on('slide', function(evt, value) {
      updateSliderElements(value, false);
      time(maxSliderValue - Math.round(value));
    }));

d3.select('#time-play-pause')
  .on('click', function() {
    playing = !playing;
    d3.select('#time-play-pause')
      .classed('mdi-av-play-circle-fill', !playing)
      .classed('mdi-av-pause-circle-fill', playing);

    function playTime() {
      if (playing) {
        var newValue = Math.max(0, Math.round(slider.value()) - 1);
        slider.value(newValue);
        updateSliderElements(newValue, true);
        time(maxSliderValue - Math.round(newValue));
        // console.log(slider.value());

        if (newValue === 0) {
          playing = false;
          // TODO: Ch
          d3.select('#time-play-pause')        
            .classed('mdi-av-play-circle-fill', false)
            .classed('mdi-av-pause-circle-fill', false)
            .classed('mdi-av-replay', true);  // TODO: Make the replay icon with a circle around the arrow (just like the play/pause icons)
        }
        // console.log(this);
        window.setTimeout(playTime, 100);
      }
    }

    if (playing) {
      if (slider.value() === 0) {
        slider.value(maxSliderValue);
        updateSliderElements(maxSliderValue, true);
        time(0);
        d3.select('#time-play-pause').classed('mdi-av-replay', false);
      }
      playTime();
    }

  });




var barChart = c3.generate({
  bindto: '#bar-chart',
  size: barChartSize(),
  data: {
    x: 'neighborhoods',
    json: {
      neighborhoods: [' ', ' ', ' ', ' ', ' ', ' '],
      values: [0.3, 0.7, 1, 0.3, 0.15, 0.4]
    },  // real data is loaded in 'dataset'
    colors: {
      values: startColor
    },
    type: 'bar',
    // TODO: If labels are shown, there is a slight space between the bars and the neighborhood names
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
      type: 'category'  // needed to show string labels
    },
    y: {
      // show: false,
      min: minDataValue,
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


var timeChart = c3.generate({
  bindto: '#time-chart',
  size: timeChartSize(), 
  data: {
    x: 'years',
    json: {
      // years: data['months'],//[2005, 2006, 2007, 2008, 2009, 2010],
      // average: [1, 1, 1, 1, 1, 1], 
      // neighborhood: [1, 1, 1, 1, 1, 1]
      // TODO: Shouldn't this have dummy data in the beginning?
    },  // real data is loaded in 'dataset'
    colors: {
      average: startColor,
      neighborhood: startColor
    },
    names: {
      neighborhood: "",
      average: "Metro Average"
    },
    // regions: {
    //   average: [{end: '2005-10-15', style: 'dashed'}]
    // }
    labels: {
      format: function (value, id, i, j) { return value === null ? '' : numberFormats[selectedDataset](value); }
    }
  },
  padding: {
    // left: 10,
    right: 10
  },    
  // point: {show: false},
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
        values: ['2001-07-02', '2005-07-02', '2009-07-02', '2013-07-02']  // 07-02 is the middle day of the year
      }
    },
    y: {
      // show: false,
      min: minDataValue, 
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


var colorScale = d3.scale.linear();
  // range will be added during 'dataset'

// TODO: Add a legend for the colors

var blankMapColors = {};
var map = new Datamap({
  element: document.getElementById('map'),
  responsive: true,
  geographyConfig: {
    dataUrl: 'data/SanDiego.json',
    borderColor: '#757575', 
    borderWidth: 0,  // 0.7
    highlightOnHover: false,
    // highlightFillColor: 'foo',  // just some random string to keep fill color the same
    // highlightBorderColor: 'black',
    // highlightBorderWidth: 2,
    popupTemplate: function(geography, data) {
      // TODO: Change this to ZIP codes
      // console.log(geography.id.replace('zip', ''));  // TODO: Remove zip here

      return '<div class="hoverinfo" style="text-align: center">' + geography.id.replace('zip', '') + (geography.properties.name ? ('<br><span style="font-size: 0.85em">' + geography.properties.name  + '</span>') : '') + '</div>';
    }
  },
  scope: 'tl_2010_06_zcta510',
  fills: {
    defaultFill: startColor
  }, 
  setProjection: function(element, options) {
    var width = options.width || element.offsetWidth;
    var height = options.height || element.offsetHeight;

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

    // var size = mapSize();
    var projection = d3.geo.mercator()
  		.center([-117.0, 33.0])
  		.scale(20000)
      .translate([width / 2, height / 2]);
	
     return {path: d3.geo.path().projection(projection), projection: projection};
  },
  done: function(datamap) {
    // TODO: Maybe call updateChoropleth for the first time here

    
    blankMapColors = {};
    var geometries = datamap.customTopo.objects.tl_2010_06_zcta510.geometries;
    for (var i = 0; i < geometries.length; i++) {
      blankMapColors[geometries[i].id] = startColor;
    }

    // datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {

    // define drop shadow as here: http://bl.ocks.org/cpbotha/5200394
    var defs = datamap.svg.append("defs");
    var filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("height", "200%")  // prevent the shadow from being clipped by making the filter area bigger
        .attr("width", "200%");

    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 4)  // size of the shadow
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


    // place svg element on top of all other elements
    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };



    datamap.svg.selectAll('.datamaps-subunit')
      // .style("filter", "url(#drop-shadow)")
      .on('mouseover.custom', function(geography) {      
        datamap.svg.select('.zip' + clickedArea).moveToFront();  
        d3.select(this).moveToFront();
        datamap.svg.selectAll('.datamaps-subunit')
          .style('filter', function() { return (d3.select(this).classed(geography.id) || d3.select(this).classed('zip' + clickedArea)) ? 'url(#drop-shadow)' : ''; });
          // .style('stroke', '#000');
        setTimeout(neighborhood, 0, geography.id.replace('zip', ''));  // load the data async
      })
      .on('click', function(geography) {
        datamap.svg.select('.zip' + clickedArea).style('filter', '');
        clickedArea = geography.id.replace('zip', '');
         
        // d3.select(this).style('stroke-width', '2px').style('stroke', '#f00');
        // neighborhood(geography.id.replace('zip', ''));
      });


    datamap.svg.select('.datamaps-subunits')
      .on('mouseout', function(geography) {
        // TODO: The borders between the areas do not belong to the .datamaps-subunits element. 
        // Hence, moving the mouse from one area to another triggers this mouseout event. In this case, do NOT load the data of the clickedArea.
        // Maybe this will solve on the way by loading all data into the time chart up front, and only making the current area visible
        setTimeout(neighborhood, 0, clickedArea);  // load the data async
        
        datamap.svg.select('.zip' + clickedArea).moveToFront();  
        datamap.svg.selectAll('.datamaps-subunit')
          .style('filter', function() { return (d3.select(this).classed('zip' + clickedArea)) ? 'url(#drop-shadow)' : ''; });
      });
  }
});
map.legend();

window.addEventListener('resize', function() {
  barChart.resize(barChartSize());
  timeChart.resize(timeChartSize());
  // map.resize();
  map.resize(mapSize());
});


$("#content").click(function(d,i) {

  if(!slidecounter) {


  down();
  if (!selectedDataset) { initVisualizations(); }
  d3.select('.nav-title').classed('active',true);
  dataset('mediansaleprice');

  slidecounter = true;

}
});




