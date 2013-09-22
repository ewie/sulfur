/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/type/decimal',
  'sulfur/schema/value/integer'
], function ($decimalType, $integerValue) {

  'use strict';

  var $ = $decimalType.clone({

    getValueType: function () {
      return $integerValue;
    }

  });

  $.augment({

    validateFacets: function () {
      if (!$decimalType.prototype.validateFacets.call(this)) {
        return false;
      }
      if (this.getFacets()) {
        var fractionDigitsFacet = this.getStandardFacet('fractionDigits');
        if (fractionDigitsFacet && fractionDigitsFacet.getValue() !== 0) {
          return false;
        }
      }
      return true;
    }

  });

  return $;

});
