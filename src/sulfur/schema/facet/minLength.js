/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/_standard',
  'sulfur/schema/validator/minimum',
  'sulfur/schema/validator/property'
], function ($_standardFacet, $minimumValidator, $propertyValidator) {

  'use strict';

  var $ = $_standardFacet.clone({

    getName: function () {
      return 'minLength';
    }

  });

  $.augment({

    validate: function (type, errors) {
      if (type.hasStandardFacet('length')) {
        if (errors) {
          errors.push("cannot be used along with facet 'length'");
        }
        return false;
      }

      var maxLengthFacet = type.getStandardFacet('maxLength');
      if (maxLengthFacet && this._value > maxLengthFacet.getValue()) {
        if (errors) {
          errors.push("must not be greater than facet 'maxLength'");
        }
        return false;
      }

      return true;
    },

    createValidator: function () {
      return $propertyValidator.create(
        'getLength',
        $minimumValidator.create(this.getValue())
      );
    }

  });

  return $;

});
