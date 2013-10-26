/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/schema/mediaType'
], function (Factory, MediaType) {

  'use strict';

  return Factory.derive({

    /**
     * @param {Blob} blob
     */
    initialize: function (blob) {
      this._blob = blob;
      this._mediaType = MediaType.create.apply(MediaType,
        this._blob.type.split('/'));
    },

    /**
     * @param {sulfur/schema/mediaType} the file's media type
     */
    get mediaType() {
      return this._mediaType;
    }

  });

});
