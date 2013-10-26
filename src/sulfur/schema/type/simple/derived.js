/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/schema/type/simple/restricted'], function (RestrictedType) {

  'use strict';

  return RestrictedType.derive({

    initialize: function (options) {
      RestrictedType.prototype.initialize.call(this, options.base, options.facets);
      this._qname = options.qname;
      this._namespace = options.namespace;
      this._valueType = options.valueType;
    },

    get qname() {
      return this._qname;
    },

    get valueType() {
      return this._valueType;
    }

  });

});
