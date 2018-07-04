import {GenericDatasource} from './datasource';
import {GenericQueryCtrl} from './query_ctrl';

class GenericConfigCtrl {}
GenericConfigCtrl.templateUrl = 'partials/config.html';

class GenericQueryOptionsCtrl {}
GenericQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

export {
  GenericDatasource as Datasource,
  GenericQueryCtrl as QueryCtrl,
  GenericConfigCtrl as ConfigCtrl,
  GenericQueryOptionsCtrl as QueryOptionsCtrl,
};
