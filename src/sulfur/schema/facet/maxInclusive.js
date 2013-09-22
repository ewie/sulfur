/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/_standard',
  'sulfur/schema/validator/maximum',
  'sulfur/util'
], function ($_standardFacet, $maximumValidator, $util) {

  'use strict';

  var $ = $_standardFacet.clone({

    getName: function () {
      return 'maxInclusive';
    },

    getEffectiveValue: function (values) {
      values = $util.sort(values, function (x, y) {
        return x.cmp(y);
      });
      return values[0];
    }

  });

  $.augment({

    validate: function (type, errors) {
      if (!type.getValueType().prototype.isPrototypeOf(this.getValue())) {
        return false;
      }

      if (type.hasStandardFacet('maxExclusive')) {
        if (errors) {
          errors.push("cannot be used along with facet 'maxExclusive'");
        }
        return false;
      }

      var minExclusiveFacet = type.getStandardFacet('minExclusive');
      if (minExclusiveFacet && this.getValue().lteq(minExclusiveFacet.getValue())) {
        if (errors) {
          errors.push("must be greater than facet 'minExclusive'");
        }
        return false;
      }

      var minInclusiveFacet = type.getStandardFacet('minInclusive');
      if (minInclusiveFacet && this.getValue().lt(minInclusiveFacet.getValue())) {
        if (errors) {
          errors.push("must be greater than or equal to facet 'minInclusive'");
        }
        return false;
      }

      return true;
    },

    createValidator: function () {
      return $maximumValidator.create(this.getValue());
    }

  });

  return $;

});
