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
     * @param {sulfur/schema/value/simple/string} id
     * @param {sulfur/schema/file} file (optional)
     */
    initialize: function (id, file) {
      this._id = id;
      this._file = file;
    },

    /**
     * @return {sulfur/schema/value/simple/string} the reference's identifier
     */
    getIdentifier: function () {
      return this._id;
    },

    /**
     * @return {sulfur/schema/file} the file when defined
     * @return {undefined} when no file is defined
     */
    getFile: function () {
      return this._file;
    }

  });

});