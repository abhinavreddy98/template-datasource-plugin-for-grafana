import {QueryCtrl} from 'app/plugins/sdk';

const defaultQuery = `some default query you want on your query editor`;

export class KustoQueryCtrl extends QueryCtrl {

  constructor($scope, $injector)  {

    super($scope, $injector);



    this.scope = $scope;

    this.target.target = this.target.target || 'select metric';

    this.target.format = this.target.format || 'timeserie';

    this.formats = [{ text: 'Time series', value: 'time_series' }, { text: 'Table', value: 'table' }];

    this.target.rawSql = this.target.rawSql || defaultQuery; //declare input variables in your query editor like this

    this.showhelp = false;                                  //or this

  }



  getOptions(query) {

    return this.datasource.metricFindQuery(query || '');

  }



  toggleEditorMode() {

    this.target.rawQuery = !this.target.rawQuery;

  }



  onChangeInternal() {

    this.panelCtrl.refresh(); // Asks the panel to refresh data.

  }

}



KustoQueryCtrl.templateUrl = 'partials/query.editor.html';
