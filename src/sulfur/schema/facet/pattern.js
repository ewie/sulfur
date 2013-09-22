/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/_standard',
  'sulfur/schema/pattern',
  'sulfur/schema/validator/pattern',
  'sulfur/schema/validator/some',
  'sulfur/util'
], function (
    $_standardFacet,
    $pattern,
    $patternValidator,
    $someValidator,
    $util
) {

  'use strict';

  var $ = $_standardFacet.clone({

    getName: function () {
      return 'pattern';
    }

  });

  $.augment({

    initialize: function (values) {
      if (values.length === 0) {
        throw new Error("expecting at least one sulfur/schema/pattern");
      }
      if (!values.every($util.bind($pattern.prototype, 'isPrototypeOf'))) {
        throw new Error("expecting only sulfur/schema/pattern values");
      }
      $_standardFacet.prototype.initialize.call(this, $util.uniq(values));
    },

    validate: function () {
      return true;
    },

    createValidator: function () {
      return $someValidator.create(this.getValue().map(function (pattern) {
        return $patternValidator.create(pattern);
      }));
    }

  });

  return $;

});
