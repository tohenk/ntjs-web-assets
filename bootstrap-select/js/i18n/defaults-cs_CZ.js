/*!
 * Bootstrap-select v1.14.0-beta3 (https://developer.snapappointments.com/bootstrap-select)
 *
 * Copyright 2012-2023 SnapAppointments, LLC
 * Licensed under MIT (https://github.com/snapappointments/bootstrap-select/blob/master/LICENSE)
 */

(function (root, factory) {
  if (root === undefined && window !== undefined) root = window;
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(root["jQuery"]);
  }
}(this, function (jQuery) {

(function ($) {
  $.fn.selectpicker.defaults = {
    noneSelectedText: 'Vyberte ze seznamu',
    noneResultsText: 'Pro hledání {0} nebyly nalezeny žádné výsledky',
    countSelectedText: 'Vybrané {0} z {1}',
    maxOptionsText: ['Limit překročen ({n} {var} max)', 'Limit skupiny překročen ({n} {var} max)', ['položek', 'položka']],
    multipleSeparator: ', ',
    selectAllText: 'Vybrat vše',
    deselectAllText: 'Zrušit výběr'
  };
})(jQuery);


}));
//# sourceMappingURL=defaults-cs_CZ.js.map