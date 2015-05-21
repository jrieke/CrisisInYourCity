/*

Used to connect to and query the Deplhi PostgreSql database

Author: Sindre Magnussen

*/

var postgre = require('pg');

module.exports = function(connString){
    var module = {};

    module.getSoldForGainNorm = function(params, callback){
        executeYearBoundedCountyQuery({tablename: "zillow_zip_pct_of_homes_selling_for_gain_all_homes_norm"}, params, callback);
    };

    module.getMedianListPrice = function(params, callback){
        executeYearBoundedCountyQuery({tablename: "zillow_zip_median_sold_price_all_homes_norm"}, params, callback);
    };

    module.getSoldAsForeclosures = function(params, callback){
        executeYearBoundedCountyQuery({tablename: "zillow_zip_homes_sold_as_foreclosures_ratio_all_homes_norm"}, params, callback);
    };

    module.getNumberOfSales = function(params, callback){
        executeYearBoundedCountyQuery({tablename: ""}, params, callback);
    };

    module.getSoldForLoss = function(params, callback){
        executeYearBoundedCountyQuery({tablename: "zillow_zip_pct_of_homes_selling_for_loss_all_homes_norm"}, params, callback);
    };

    function executeYearBoundedCountyQuery(config, params, callback){
        postgre.connect(connString, function(err, client, done){
            if(err){
                console.log("Error fetching client from pool");
            }
            client.query("SELECT \"RegionName\", \"Year\", \"Month\", \"Value\" FROM "
                + config.tablename +" WHERE "
                + "\"State\"='CA' AND \"CountyName\"=$1 AND \"Year\">=$2 AND"
                + " \"Year\"<= $3 ORDER BY \"RegionName\", \"Year\", \"Month\"",
                [params.county, params.startYear, params.endYear],
                function(err, result){
                    done();

                    if(err){
                        console.log(err);
                    }

                    callback(result.rows);
                });
        });
    }


    return module;

};







