/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/object'], function ($object) {

  'use strict';

  return $object.derive({

    /**
     * Initialize the validator with an object responding to #isPrototypeOf().
     *
     * @param [#isPrototypeOf()] prototype
     */
    initialize: function (prototype) {
      this._prototype = prototype;
    },

    /**
     * Check if an object derives from the required prototype.
     *
     * @param [object] obj the object to check
     *
     * @return [boolean] whether `obj` derives from the required prototype or not
     */
    validate: function (obj) {
      return this._prototype.isPrototypeOf(obj);
    }

  });

});
