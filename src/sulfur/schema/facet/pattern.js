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
    Facet,
    Pattern,
    QName,
    PatternValidator,
    SomeValidator,
    util
) {

  'use strict';

  var $ = Facet.clone({

    getQName: util.returns(
      QName.create('pattern', 'http://www.w3.org/2001/XMLSchema')),

    isShadowingLowerRestrictions: util.returns(false),

    getMutualExclusiveFacets: util.returns([])

  });

  $.augment({

    initialize: function (values) {
      if (values.length === 0) {
        throw new Error("expecting at least one sulfur/schema/pattern");
      }
      if (!values.every(util.bind(Pattern.prototype, 'isPrototypeOf'))) {
        throw new Error("expecting only sulfur/schema/pattern values");
      }
      Facet.prototype.initialize.call(this, util.uniq(values));
    },

    isRestrictionOf: util.returns(undefined),

    validate: util.returns(true),

    createValidator: function () {
      return SomeValidator.create(this.getValue().map(function (pattern) {
        return PatternValidator.create(pattern);
      }));
    }

  });

  return $;

});