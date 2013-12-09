/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet',
  'sulfur/schema/qname',
  'sulfur/schema/validator/pattern',
  'sulfur/schema/validator/some',
  'sulfur/schema/value/simple/pattern',
  'sulfur/util'
], function (
    Facet,
    QName,
    PatternValidator,
    SomeValidator,
    PatternValue,
    util
) {

  'use strict';

  var qname = QName.create('pattern', 'http://www.w3.org/2001/XMLSchema');

  return Facet.clone({

    get qname() { return qname },

    get isShadowingLowerRestrictions() { return false },

    get mutualExclusiveFacets() { return [] },

    getValueType: function () { return PatternValue }

  }).augment({

    initialize: function (values) {
      if (values.length === 0) {
        throw new Error("expecting at least one sulfur/schema/value/simple/pattern");
      }
      if (!values.every(util.bind(PatternValue.prototype, 'isPrototypeOf'))) {
        throw new Error("expecting only sulfur/schema/value/simple/pattern values");
      }
      Facet.prototype.initialize.call(this, util.uniq(values));
    },

    isRestrictionOf: util.returns(undefined),

    validate: util.returns(true),

    createValidator: function () {
      return SomeValidator.create(this.value.map(function (pattern) {
        return PatternValidator.create(pattern);
      }));
    }

  });

});
