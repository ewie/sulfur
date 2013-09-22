/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/_standard',
  'sulfur/schema/validator/enumeration',
  'sulfur/util'
], function ($_standardFacet, $enumerationValidator, $util) {

  'use strict';

  var $ = $_standardFacet.clone({

    getName: function () {
      return 'enumeration';
    }

  });

  $.augment({

    initialize: function (values) {
      if (values.length === 0) {
        throw new Error("must provide at least one value");
      }
      $_standardFacet.prototype.initialize.call(this, $util.uniq(values));
    },

    validate: function (type) {
      return this.getValue().every(function (value) {
        return type.getValueType().prototype.isPrototypeOf(value);
      });
    },

    createValidator: function () {
      return $enumerationValidator.create(this.getValue(), { testMethod: 'eq' });
    }

  });

  return $;

});
