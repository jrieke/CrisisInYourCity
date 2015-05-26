/**
 * Created by Petter on 20.05.2015.
 */

exports.parseRowsByColumn =  function(rows, column, value_column){
    var jsonData = {};
    var currentRegion = rows[0][column];
    var values = [];

    var i = 0;
    for(i = 0; i < rows.length; i++){
        var row = rows[i];
        if(row[column] != currentRegion){
            jsonData[currentRegion] = values;
            currentRegion = row[column];
            values = [];
        }
        values.push(row[value_column]);
    }

    return jsonData;
};
