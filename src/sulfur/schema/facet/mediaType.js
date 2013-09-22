/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/_any',
  'sulfur/schema/mediaType',
  'sulfur/schema/validator/enumeration',
  'sulfur/util'
], function ($_anyFacet, $mediaType, $enumerationValidator, $util) {

  'use strict';

  function isMediaType(x) {
    return $mediaType.prototype.isPrototypeOf(x);
  }

  var $ = $_anyFacet.clone({

    getName: function () {
      return 'mediaType';
    },

    getNamespace: function () {
      return 'https://vsr.informatik.tu-chemnitz.de/projects/2013/sulfur';
    }

  });

  $.augment({

    initialize: function (value) {
      if (value.length === 0) {
        throw new Error("expecting at least one sulfur/schema/mediaType value");
      }
      if (!value.every(isMediaType)) {
        throw new Error("expecting only sulfur/schema/mediaType values");
      }
      value = $util.uniq(value);
      $_anyFacet.prototype.initialize.call(this, value);
    },

    validate: function () {
      return true;
    },

    createValidator: function () {
      return $enumerationValidator.create(
        this.getValue(),
        { testMethod: 'matches' });
    }

  });

  return $;

});
