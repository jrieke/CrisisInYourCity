/*

Used to connect to and query the Deplhi PostgreSql database

Author: Sindre Magnussen

*/

var postgre = require('pg');

module.exports = function(connString){
    var module = {};

    module.getSoldForGainNorm = function(city, callback){
        postgre.connect(connString, function(err, client, done){
            if(err){
                console.log("Error fetching client from pool.");
            }
            client.query("SELECT \"RegionName\", \"Year\", \"Month\", \"Value\" FROM zillow_zip_pct_of_homes_selling_for_gain_all_homes_norm WHERE "
             + "\"State\"='CA' AND \"City\"=\'"+ city +"\' ORDER BY \"RegionName\", \"Year\", \"Month\"",
                function(err, result){
                    done();

                    if(err){
                        console.log(err);
                    }

                    callback(result.rows);
            });
        });
    };

    module.connect = function(setup){
        var pg_client = new postgre.Client({
            user: setup.username,
            password: setup.passw,
            database: setup.db_name,
            host: setup.host_url,
            port: setup.port
        });
        pg_client.connect(function(err){
            if(err){
                console.log(err);
                return err;
            }
        });
        return pg_client;
    };

    module.testquery = function(pg_client){
        var query = pg_client.query("select distinct \"State\" from zillow_zip_pct_of_homes_selling_for_gain_all_homes_norm",
            function(err, result){
                if(err) console.log(err);
                console.log(result.rows);
            });
    };

    module.close = function(pg_client){
        pg_client.close();
    };

    return module;

};







