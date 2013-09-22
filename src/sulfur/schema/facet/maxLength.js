/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/_standard',
  'sulfur/schema/validator/maximum',
  'sulfur/schema/validator/property'
], function ($_standardFacet, $maximumValidator, $propertyValidator) {

  'use strict';

  var $ = $_standardFacet.clone({

    getName: function () {
      return 'maxLength';
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
      var minLengthFacet = type.getStandardFacet('minLength');
      if (minLengthFacet && this._value < minLengthFacet.getValue()) {
        if (errors) {
          errors.push("must not be less than facet 'minLength'");
        }
        return false;
      }
      return true;
    },

    createValidator: function () {
      return $propertyValidator.create(
        'getLength',
        $maximumValidator.create(this.getValue())
      );
    }

  });

  return $;

});
