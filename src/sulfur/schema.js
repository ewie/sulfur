/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (qname, elements) {
      this._qname = qname;
      this._elements = elements;
    },

    get qname() {
      return this._qname;
    },

    get elements() {
      return this._elements;
    }

  });

});
