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
var maxSliderValue = 5;
var scrollSpeed = 0.003;
var playing = false;
var startColor = '#9e9e9e';
var city = 'San Diego';
var selectedNeighborhood = 'La Jolla';  // TODO: At the beginning, no neighborhood should be selected
var neighborhoodsForBarChart = ['La Jolla', 'Pacific Beach', 'Old Town', 'Balboa Park', 'Ocean Beach', 'Mission Bay'];
var selectedTimeIndex = 0;
var selectedDataset = -1;
var datasetColors = [{map: '#f44336', charts: '#ef5350'}, {map: '#00bcd4', charts: '#00bcd4'}, {map: '#8bc34a', charts: '#8bc34a'}, {map: '#ffb300', charts: '#ffb300'}];


function slideUp() {
  if (!slidedUp) {
    d3.select('#front-header')
      .transition()
      .duration(1000)
      .style('top', '-300px');

    d3.select('#content')
      .transition()
      .duration(1000)
      .style('top', '80px');

    slidedUp = true;
  }
}

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
    slideUp();
    if (selectedDataset == -1) { initVisualizations(); }  // TODO: See if this causes any problems because the stuff from the dataset needs longer to load
    dataset(i);
    d3.selectAll('.nav-title').classed('active', false);
    d3.select(this).classed('active', true);
    // selectedTitle = i;
  });





var data = {
  months: ['2005-01-15', '2006-01-15', '2007-01-15', '2008-01-15', '2009-01-15', '2010-01-15']
};
var areas = ['Amphitheater And Water Park', 'Bella Lago', 'Bonita Long Canyon', 'East Lake', 'Eastlake Trails', 'Eastlake Vistas', 'Eastlake Woods', 'Estlake Greens', 'Fenton St', 'Golf Course', 'Lynwood Hills', 'Northwest', 'Otay Ranch', 'Paseo Ranchoero', 'Rancho Del Rey', 'Rolling Hills Ranch', 'Southwest', 'Sunbow', 'Terra Nova', 'Thomy Locust Pl', 'Village Center', 'Yosemite Dr', 'Allied Gardens', 'Alta Vista', 'Balboa Park', 'Bario Logan', 'Bay Ho', 'Bay Park', 'Bay Terrace', 'Bird Land', 'Carmel Mountain', 'Carmel Valley', 'Chollas View', 'City Heights East', 'City Heights West', 'Clairemont Mesa', 'College Area', 'Columbia', 'Core', 'Cortez Hill', 'Darnall', 'Del Cerro', 'Del Mar Heights', 'East Village', 'Egger Highlands', 'El Cerritos', 'Emerald Hills', 'Encanto', 'Gaslamp Quarter', 'Gateway', 'Grant Hill', 'Grantville', 'Horton Plaza', 'Jomacha-Lomita', 'Kearny Mesa', 'Kensington', 'La Jolla', 'La Jolla Village', 'Lake Murray', 'Lincoln Park', 'Linda Vista', 'Little Italy', 'Loma Portal', 'Marina', 'Memorial', 'Midtown', 'Midtown District', 'Mira Mesa', 'Miramar', 'Mission Bay', 'Mission Valley', 'Moreno Mission', 'Mount Hope', 'Mountain View', 'Nestor', 'Normal Heights', 'North City', 'North Clairemont', 'North Hills', 'Oak Park', 'Ocean Beach', 'Old Town', 'Pacific Beach', 'Palm City', 'Paradise Hills', 'Park West', 'Rancho Bernadino', 'Rancho Penasquitos', 'Rolando', 'Roseville', 'Sabre Springs', 'San Carlos', 'San Ysidro', 'Scripps Ranch', 'Serra Mesa', 'Sky Line', 'Sorrento Valley', 'South Park', 'Southcrest', 'Talmadge', 'Tierrasanta', 'Tijuana River Valley', 'Torrey Pines', 'University City', 'Valencia Park', 'Webster', 'West University Heights', 'Wooded Area'];
for (var i = 0; i < areas.length; i++) {
  data[areas[i]] = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
}



function initVisualizations() {
  timeChart.data.colors({
    average: '#f8f8f8'
  });
  timeChart.data.names({
    neighborhood: selectedNeighborhood,
    average: 'Average'
  });
  d3.select('#neighborhood-text').text(selectedNeighborhood);

  // TODO: Do this a little bit more elegant than just making it visible at once, eg by a transition with opacity
  d3.select('#time-slider-wrapper')
    .style('visibility', 'visible');

  $(document).on('mousewheel', function(evt) {
    var newValue = Math.max(0, Math.min(maxSliderValue, slider.value() - scrollSpeed * event.deltaY));
    slider.value(newValue);
    updateSliderElements(newValue, false);
    time(Math.round(newValue));
  });
}

function time(index) {
  if (index != selectedTimeIndex) {    
    d3.select('#year')
      .text(Math.round(2005+index));  // TODO: Change this once we have actual months for the slider values

    barChart.load({
      json: {
        values: neighborhoodsForBarChart.map(function(neighborhood) { return data[neighborhood][index]; })
      }
    });

    // TODO: Maybe integrate this with the same snippet in dataset()
    var mapColors = {};
    for (var area in data) {
      // datamaps cannot deal with spaces in the keys, so we remove them
      mapColors[area.split(' ').join('')] = colorScale(data[area][index]);
    }
    // 'mapColors' also contains the 'months' field, but that is simply ignored by datamaps
    map.updateChoropleth(mapColors);

    selectedTimeIndex = index;
  }
} 

function neighborhood(name) {
  if (name != selectedNeighborhood) {
    timeChart.data.names({
      neighborhood: name
    });
    timeChart.load({
      json: {
        neighborhood: data[name]
      }
    });
    d3.select('#neighborhood-text').text(name);

    // TODO: Update bar chart

    selectedNeighborhood = name;
  }
}

function dataset(index) {
  // TODO: Make visualizations grey while data is loading, maybe even by using a small transition

  d3.select('#content-overlay').style('visibility', 'visible');

  colorScale.range(['#f8f8f8', datasetColors[index].map]);
  var mapColors = {};
  for (var area in data) {
    // datamaps cannot deal with spaces in the keys, so we remove them
    mapColors[area.split(' ').join('')] = colorScale(data[area][selectedTimeIndex]);
  }
  // 'mapColors' also contains the 'months' field, but that is simply ignored by datamaps
  map.updateChoropleth(mapColors);

  barChart.data.colors({
    values: datasetColors[index].charts
  });
  barChart.load({
    json: {
      neighborhoods: neighborhoodsForBarChart,  // has to be loaded at the same time as values, otherwise the text fields stay empty
      values: neighborhoodsForBarChart.map(function(neighborhood) { return data[neighborhood][selectedTimeIndex]; })
    }
  });

  timeChart.data.colors({
    neighborhood: datasetColors[index].charts
  });
  timeChart.load({
    json: {
      average: [0.50, 0.70, 0.8, 0.30, 0.1, 0.60],  // TODO: Load actual data here
      neighborhood: data[selectedNeighborhood]
    }
  });
  d3.select('#neighborhood-text').style('color', datasetColors[index].charts);

  d3.select('#content-overlay').style('visibility', 'hidden');
  
}



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

  
}




var slider;
d3.select('#time-slider').call(
  slider = d3.slider()
    .orientation("vertical")
    .min(0)
    .max(maxSliderValue)
    .value(maxSliderValue)
    .on('slide', function(evt, value) {
      updateSliderElements(value, false);
      time(Math.round(value));
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
        time(Math.round(newValue));
        // console.log(slider.value());

        if (newValue === 0) {
          playing = false;
          d3.select('#time-play-pause')
            .classed('mdi-av-play-circle-fill', !playing)
            .classed('mdi-av-pause-circle-fill', playing);
        }
        // console.log(this);
        window.setTimeout(playTime, 1000);
      }
    }

    if (playing) {
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
    type: 'bar'
    // TODO: If labels are shown, there is a slight space between the bars and the neighborhood names
    // labels: {
    //   format: d3.format('.3s')
    // }
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
      show: false,
      min: 0,
      max: 1
    }
  }
  // tooltip: {show: false}
});
console.log(d3.select('#time-chart'));
d3.select('#time-chart').select('svg').select('g').append('g').append("circle")
  .attr("cx", 30)
  .attr("cy", 30)
  .attr("r", 20);

var timeChart = c3.generate({
  bindto: '#time-chart',
  size: timeChartSize(), 
  data: {
    x: 'years',
    json: {
      years: data['months'],//[2005, 2006, 2007, 2008, 2009, 2010],
      average: [1, 1, 1, 1, 1, 1], 
      neighborhood: [1, 1, 1, 1, 1, 1]
    },  // real data is loaded in 'dataset'
    colors: {
      average: startColor,
      neighborhood: startColor
    }
    // labels: {
    //   format: function (v, id, i, j) { 
    //     if (i == 4)
    //       return id; 
    //   }
    // }
  },
  padding: {
    left: 10,
    right: 10
  },    
  point: {show: false},
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
        values: ['2005-07-02', '2006-07-02', '2007-07-02', '2008-07-02', '2009-07-02']  // 07-02 is the middle day of the year
      }
    },
    y: {
      show: false,
      min: 0, 
      max: 1,  // TODO: Adapt this to the max value of all data
      padding: {bottom: 0}, 
      tick: {
        count: 4
      }
    }
  }
  // tooltip: {show: false}
});


var colorScale = d3.scale.linear()
  .domain([0, 1]);
  // range will be added during 'dataset'

var map = new Datamap({
  element: document.getElementById('map'),
  responsive: true,
  geographyConfig: {
    dataUrl: 'data/SanDiego.json',
    borderColor: '#757575', 
    borderWidth: 0.7,  // 0
    highlightFillColor: 'foo',  // just some random string to keep fill color the same
    highlightBorderColor: 'black',
    highlightBorderWidth: 2,
    popupTemplate: function(geography, data) {
      neighborhood(geography.properties.NAME);
      return '<div class="hoverinfo"><strong>' + geography.properties.NAME + '</strong></div>';
    }
  },
  scope: 'SanDiego',
  fills: {
    defaultFill: startColor
  }, 
  setProjection: function(element, options) {
    var width = options.width || element.offsetWidth;
    var height = options.height || element.offsetHeight;

    // var size = mapSize();
    var projection = d3.geo.mercator()
  		.center([-117.1063889, 32.8152778])
  		.scale(38000)
      .translate([width / 2, height / 2]);
	
     var path = d3.geo.path().projection(projection);
     return {path: path, projection: projection};
  },
  done: function(datamap) {
    // TODO: Maybe call updateChoropleth for the first time here

    datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
    //   neighborhood(geography.properties.NAME);

    });
  }
});

window.addEventListener('resize', function() {
  barChart.resize(barChartSize());
  timeChart.resize(timeChartSize());
  // map.resize();
  map.resize(mapSize());
});

