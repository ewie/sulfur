/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/schema/value/simple'], function (SimpleValue) {

  'use strict';

  return SimpleValue.clone({

    parse: function (s) { return this.create(s) }

  }).augment({

    /**
     * @param {string} value
     * @param {sulfur/schema/file} file (optional) the file
     */
    initialize: function (value, file) {
      this._value = value;
      this._file = file;
    },

    /**
     * @return {string} the reference's identifier
     */
    get value() { return this._value },

    /**
     * @return {sulfur/schema/file} the file when associated
     * @return {undefined} when no file is associated
     */
    get file() { return this._file },

    /**
     * @return {true} when equal
     * @return {false} when not equal
     */
    eq: function (other) { return this.value === other.value },

    /**
     * @return {string} the reference's identifier
     */
    toString: function () { return this.value }

  });

});
