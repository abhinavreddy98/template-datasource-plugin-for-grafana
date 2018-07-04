import _ from "lodash";

export class GenericDatasource {
    constructor(instanceSettings, $q, backendSrv, templateSrv) {
        this.type = instanceSettings.type;
        this.url = instanceSettings.url;
        this.id = instanceSettings.id;
        this.name = instanceSettings.name;
        this.database = instanceSettings.jsonData.database; //.jsonData is for any custom inputs you are taking as variables in confog.html 
        this.q = $q;
        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;
        this.withCredentials = instanceSettings.withCredentials;
        this.headers = {
            'Content-Type': 'application/json; charset=utf-8',
        };
    };

    query(options) {
        const rawQuery = options.targets[0].rawQuery;
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
            resultDiv.innerHTML = csl;
        }
        if (options.targets[0].length <= 0) {
          return this.$q.when({data: []});
        }
        return this.doRequest({
            url: this.url + 'You need to use the appropriate url which your database uses to receive query requests', //this.url is the url you enter in config.html
            method: 'POST',   //or GET or PUT
            headers: this.headers,
            data: {
                options,
                field-that-your-database-expects: this.database, //these are just examples you need to find out the format of the body your database expects
                field-that-your-database-expects: rawQuery,
                ...
            }
        }).then(this.responseParser);
    }

    responseParser(res){          //res will be the entire HTTP response you receive from your database. res.data contains your data
        var data  = [], datapoints = [], titles = [];
        var i = 0;
        var j = 0;
        if (!res.data.Tables) {     //See the example responses sent by an imaginary datasource for which I have made this responeParser
          return { data: data };    //They are available under imaginary-response-table.json and imaginary-response-timeseries.json
        }

        if(res.config.data.options.targets[0].format === "time_series"){
          var timepos = 0;
          for(j=0; j<res.data.Tables[0].Columns.length; j++){
            if(res.data.Tables[0].Columns[j].ColumnType == "datetime"){
              timepos = j;
              break;
            }
          }

        for(j=0; j<res.data.Tables[0].Columns.length; j++){
          if(j != timepos){
            for(i=0; i<res.data.Tables[0].Rows.length; i++){
              datapoints.push([
                res.data.Tables[0].Rows[i][j] , +new Date(res.data.Tables[0].Rows[i][timepos])
              ]);
            }
            data.push({         //Why is data in this format? https://github.com/grafana/simple-json-datasource/blob/master/README.md check example timeserie response
              target: res.data.Tables[0].Columns[j].ColumnName,
              datapoints: datapoints,
              refid: res.config.data.queries[0].refId,
            });
          }
        }
        return {data: data};

         
        if(res.config.data.options.targets[0].format === "table"){
          for(j = 0; j < res.data.Tables[0].Columns.length; j++){
            titles.push({
                text: res.data.Tables[0].Columns[j].ColumnName,
                type: res.data.Tables[0].Columns[j].DataType,
            });
          }
          for(j = 0; j < res.data.Tables[0].Rows.length; j++){
            datapoints.push(
                res.data.Tables[0].Rows[j]
            );
          }

          data.push({       //Why is data in this format? https://github.com/grafana/simple-json-datasource/blob/master/README.md check example table response
            columns: titles,
            rows: datapoints,
            type: "table",
          });
          return {data: data};
        }
    }


  metricFindQuery(query, optionalOptions) {
    return this.backendSrv
      .datasourceRequest({
        url: 'any url which will get you a 200 OK, preferably your database url',
        method: 'POST',
        data: {
        },
      });

  }


    testDatasource() {              //Use this function to test for authentication to your datasource
        return this.doRequest({
          url: this.url + '/ping',  //any url belonging to your database that would give 200 OK only if you have sufficient permission
          method: 'GET',
        }).then(response => {
          if (response.status === 200) {
            return { status: "success", message: "Data source is working", title: "Success" };
          }
        });
      }

      doRequest(options) {
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;
        return this.backendSrv.datasourceRequest(options);
      }
}
