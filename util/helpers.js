/**
 * Created by Petter on 20.05.2015.
 */

// var toposandiego = require('../public/data/SanDiego.json');
// var toposanfransisco = require('../public/data/SanFrancisco.json');
// var topolosangeles = require('../public/data/LosAngeles.json');

exports.parseRowsByColumn =  function(rows, column, value_column){
    var jsonData = {};
    var currentRegion = rows[0][column];
    var values = [];

    jsonData[currentRegion] = values;

    var i = 0;
    for(i = 0; i < rows.length; i++){
        var row = rows[i];
        if(row[column].replace(/\s+/g, '').toLowerCase() != currentRegion.replace(/\s+/g, '').toLowerCase()){
            jsonData[currentRegion] = values;
            currentRegion = row[column];
            values = [];
        }
        values.push(row[value_column]);
    }

    return jsonData;
};

exports.getTopoJson= function(city){
    if (city== 'sandiego'){
        return toposandiego;
    }
    else if (city == 'sanfransisco'){
        return toposanfransisco;
    }
    else if (city == 'losangeles'){
        return topolosangeles;
    }
    else{
        return null;
    }
};
