/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * Initialize the validator with an object responding to .isPrototypeOf().
     *
     * @param {.isPrototypeOf()} prototype
     */
    initialize: function (prototype) {
      this._prototype = prototype;
    },

    /**
     * @return {object} the prototype to match
     */
    get prototype() {
      return this._prototype;
    },

    /**
     * Check if an object derives from the required prototype.
     *
     * @param {object} obj the object to check
     *
     * @return {boolean} whether `obj` derives from the required prototype or not
     */
    validate: function (obj) {
      return this._prototype.isPrototypeOf(obj);
    }

  });

});
