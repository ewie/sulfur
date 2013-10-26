/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet',
  'sulfur/schema/qname',
  'sulfur/schema/validator/enumeration',
  'sulfur/util'
], function (Facet, QName, EnumerationValidator, util) {

  'use strict';

  var qname = QName.create('enumeration', 'http://www.w3.org/2001/XMLSchema');

  var $ = Facet.clone({

    get qname() { return qname; },

    isShadowingLowerRestrictions: util.returns(true),

    get mutualExclusiveFacets() { return []; }

  });

  $.augment({

    initialize: function (values) {
      if (values.length === 0) {
        throw new Error("must provide at least one value");
      }
      Facet.prototype.initialize.call(this, util.uniq(values));
    },

    isRestrictionOf: function (type) {
      var v = type.createValidator();
      return this.value.every(function (value) {
        return v.validate(value);
      });
    },

    validate: function (type) {
      return this.value.every(function (value) {
        return type.valueType.prototype.isPrototypeOf(value);
      });
    },

    createValidator: function () {
      return EnumerationValidator.create(this.value, { testMethod: 'eq' });
    }

  });

  return $;

});
