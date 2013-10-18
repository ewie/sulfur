/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet',
  'sulfur/schema/pattern',
  'sulfur/schema/qname',
  'sulfur/schema/validator/pattern',
  'sulfur/schema/validator/some',
  'sulfur/util'
], function (
    $facet,
    $pattern,
    $qname,
    $patternValidator,
    $someValidator,
    $util
) {

  'use strict';

  var $ = $facet.clone({

    getQName: $util.returns(
      $qname.create('pattern', 'http://www.w3.org/2001/XMLSchema')),

    isShadowingLowerRestrictions: $util.returns(false),

    getMutualExclusiveFacets: $util.returns([])

  });

  $.augment({

    initialize: function (values) {
      if (values.length === 0) {
        throw new Error("expecting at least one sulfur/schema/pattern");
      }
      if (!values.every($util.bind($pattern.prototype, 'isPrototypeOf'))) {
        throw new Error("expecting only sulfur/schema/pattern values");
      }
      $facet.prototype.initialize.call(this, $util.uniq(values));
    },

    isRestrictionOf: $util.returns(undefined),

    validate: $util.returns(true),

    createValidator: function () {
      return $someValidator.create(this.getValue().map(function (pattern) {
        return $patternValidator.create(pattern);
      }));
    }

  });

  return $;

});
