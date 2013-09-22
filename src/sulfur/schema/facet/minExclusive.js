/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/_standard',
  'sulfur/schema/validator/minimum',
  'sulfur/util'
], function ($_standardFacet, $minimumValidator, $util) {

  'use strict';

  var $ = $_standardFacet.clone({

    getName: function () {
      return 'minExclusive';
    },

    getEffectiveValue: function (values) {
      values = $util.sort(values, function (x, y) {
        return x.cmp(y);
      });
      return values[values.length - 1];
    }

  });

  $.augment({

    validate: function (type, errors) {
      if (!type.getValueType().prototype.isPrototypeOf(this.getValue())) {
        return false;
      }

      if (type.hasStandardFacet('minInclusive')) {
        if (errors) {
          errors.push("cannot be used along with facet 'minInclusive'");
        }
        return false;
      }

      var maxExclusiveFacet = type.getStandardFacet('maxExclusive');
      if (maxExclusiveFacet && this.getValue().gt(maxExclusiveFacet.getValue())) {
        if (errors) {
          errors.push("must be less than or equal to facet 'maxExclusive'");
        }
        return false;
      }

      var maxInclusiveFacet = type.getStandardFacet('maxInclusive');
      if (maxInclusiveFacet && this.getValue().gteq(maxInclusiveFacet.getValue())) {
        if (errors) {
          errors.push("must be less than facet 'maxInclusive'");
        }
        return false;
      }

      return true;
    },

    createValidator: function () {
      return $minimumValidator.create(this.getValue(), { exclusive: true });
    }

  });

  return $;

});
