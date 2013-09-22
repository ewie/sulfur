/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/_standard',
  'sulfur/schema/validator/equal',
  'sulfur/schema/validator/property',
  'sulfur/util'
], function ($_standardFacet, $equalValidator, $propertyValidator, $util) {

  'use strict';

  var $ = $_standardFacet.clone({

    getName: function () {
      return 'length';
    }

  });

  $.augment({

    /**
     * @param [number] value
     *
     * @throw [Error] if `value` is not an integer within [0, 2^53)
     */
    initialize: function (value) {
      if (!$util.isInteger(value) || value < 0) {
        throw new Error("expecting a non-negative integer less than 2^53");
      }
      $_standardFacet.prototype.initialize.call(this, value);
    },

    validate: function (type, errors) {
      if (type.hasStandardFacet('maxLength')) {
        if (errors) {
          errors.push("cannot be used along with facet 'maxLength'");
        }
        return false;
      }
      if (type.hasStandardFacet('minLength')) {
        if (errors) {
          errors.push("cannot be used along with facet 'minLength'");
        }
        return false;
      }
      return true;
    },

    createValidator: function () {
      return $propertyValidator.create('getLength',
        $equalValidator.create(this.getValue()));
    }

  });

  return $;

});
