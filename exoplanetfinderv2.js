(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "pl_name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "pl_masse",
            alias: "Mass_Earth",
            dataType: tableau.dataTypeEnum.float
        }, {
			id: "pl_rade",
            alias: "Radius_Earth",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "rowupdate",
            dataType: tableau.dataTypeEnum.date
        }];

        var tableSchema = {
            id: "exoplanets",
            alias: "Confirmed ExoPlanets",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_name,pl_masse,pl_rade,rowupdate&order=dec&format=json&callback=foo", function(resp) {
                var resp2 = resp.features,
				tableData = [];
			for (var i = 0, len = [0]resp2.length; i < len; i++) {
                tableData.push({
                    "pl_name": [0]resp2[i].pl_name,
                    "pl_masse": [0]resp2[i].properties.pl_masse,
                    "pl_rade": [0]resp2[i].properties.pl_rade,
                    "rowupdate": [0]resp2[i].rowupdate
                });
			}	

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "ExoPlanet Data"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();