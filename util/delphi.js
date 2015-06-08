/*

Used to connect to and query the Deplhi PostgreSql database

Author: Sindre Magnussen

*/

var postgre = require('pg');

module.exports = function(connString){
    var module = {};

    module.ZIP_TABLE_SOLD_FOR_GAIN = "zillow_zip_pct_of_homes_selling_for_gain_all_homes_norm";
    module.ZIP_TABLE_MEDIAN_SALE_PRICE = "zillow_zip_median_sold_price_all_homes_norm";
    module.ZIP_TABLE_FORECLOSURES = "zillow_zip_homes_sold_as_foreclosures_ratio_all_homes_norm";
    module.ZIP_TABLE_SOLD_FOR_LOSS = "zillow_zip_pct_of_homes_selling_for_loss_all_homes_norm";
    module.ZIP_TABLE_DECREASING_VALUES = "zillow_zip_pct_of_homes_decreasing_in_values_all_homes_norm";

    module.METRO_TABLE_MEDIAN_SALE_PRICE = "zillow_metro_median_sold_price_all_homes_norm";
    module.METRO_TABLE_FORECLOSURES = "zillow_metro_homes_sold_as_foreclosures_ratio_all_homes_norm";
    module.METRO_TABLE_SOLD_FOR_LOSS = "";
    module.METRO_TABLE_DECREASING_VALUES = "zillow_metro_pct_of_homes_decreasing_in_values_all_homes_norm";

    var query_select = "SELECT \"RegionName\", \"Year\", \"Month\", \"Value\" FROM ";
    var metro_region_where =  " WHERE "
        + "\"RegionName\"=$1 AND \"Year\">=$2 AND"
        + " \"Year\"<= $3 ORDER BY \"RegionName\", \"Year\", \"Month\"";
    var metro_where = " WHERE "
        + "\"State\"=$1 AND \"Metro\"=$2 AND \"Year\">=$3 AND"
        + " \"Year\"<= $4 ORDER BY \"RegionName\", \"Year\", \"Month\"";

    module.executeYearBoundedQuery = function (config, params, callback){
        postgre.connect(connString, function(err, client, done){
            if(err){
                console.log("Error fetching client from pool");
            }
            client.query( getQueryString(config.metro, config.tablename),
                getQueryParameters(config.metro, params),
                function(err, result){
                    done();

                    if(err){
                        console.log(err);
                    }

                    callback(result.rows);
                });
        });
    };

    var getQueryString = function (is_metro_query, tablename) {
        var queryString;
        if(!is_metro_query){
            queryString = query_select + tablename + metro_where;
        } else{
            queryString = query_select + tablename + metro_region_where;
        }
        return queryString;
    };

    var getQueryParameters = function (is_metro_query, params) {
        if(!is_metro_query){
            return [params.state, params.metro, params.startYear, params.endYear];
        } else {
            return [params.metro + ', ' + params.state, params.startYear, params.endYear];
        }
    };


    return module;

};







