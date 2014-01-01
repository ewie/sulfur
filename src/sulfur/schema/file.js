/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/schema/value/simple/mediaType'
], function (Factory, MediaTypeValue) {

  'use strict';

  return Factory.derive({

    /**
     * @param {Blob} blob
     */
    initialize: function (blob) {
      this._blob = blob;
      this._mediaType = MediaTypeValue.create.apply(MediaTypeValue,
        this._blob.type.split('/'));
    },

    /**
     * @param {sulfur/schema/value/simple/mediaType} the file's media type
     */
    get mediaType() {
      return this._mediaType;
    }

  });

});
