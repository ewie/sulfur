/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/_standard',
  'sulfur/schema/validator/maximum',
  'sulfur/schema/validator/property',
  'sulfur/util'
], function ($_standardFacet, $maximumValidator, $propertyValidator, $util) {

  'use strict';

  var $ = $_standardFacet.clone({

    getName: function () {
      return 'totalDigits';
    }

  });

  $.augment({

    initialize: function (value) {
      if (!$util.isInteger(value) || value < 1) {
        throw new Error("expecting a positive integer less than 2^53");
      }
      $_standardFacet.prototype.initialize.call(this, value);
    },

    validate: function () {
      return true;
    },

    createValidator: function () {
      return $propertyValidator.create(
        'countDigits',
        $maximumValidator.create(this.getValue())
      );
    }

  });

  return $;

});
