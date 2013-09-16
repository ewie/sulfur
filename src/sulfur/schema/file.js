/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/mediaType'
], function ($factory, $mediaType) {

  'use strict';

  return $factory.derive({

    /**
     * @param [Blob] blob
     */
    initialize: function (blob) {
      this._blob = blob;
    },

    /**
     * @param [sulfur/schema/mediaType] the file's media type
     */
    getMediaType: function () {
      return $mediaType.create.apply($mediaType, this._blob.type.split('/'));
    }

  });

});
