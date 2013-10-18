/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/schema/type/simple/restricted'], function ($restrictedType) {

  'use strict';

  return $restrictedType.derive({

    initialize: function (options) {
      $restrictedType.prototype.initialize.call(this, options.base, options.facets);
      this._qname = options.qname;
      this._namespace = options.namespace;
      this._valueType = options.valueType;
    },

    getQName: function () {
      return this._qname;
    },

    getValueType: function () {
      return this._valueType;
    }

  });

});
