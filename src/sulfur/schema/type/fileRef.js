/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/mediaType',
  'sulfur/schema/mediaType',
  'sulfur/schema/type/_simple',
  'sulfur/schema/validator/presence',
  'sulfur/schema/validator/property',
  'sulfur/schema/value/fileRef'
], function (
    $mediaTypeFacet,
    $mediaType,
    $_simpleType,
    $presenceValidator,
    $propertyValidator,
    $fileRefValue
) {

  'use strict';

  var $ = $_simpleType.clone({

    getValueType: function () {
      return $fileRefValue;
    },

    getLegalFacets: function () {
      return [ $mediaTypeFacet ];
    }

  });

  $.augment({

    createValidator: function () {
      var validator = $_simpleType.prototype.createValidator.call(this);
      if (this.hasFacet($mediaTypeFacet.getName(), $mediaTypeFacet.getNamespace())) {
        validator._validators[1] = $presenceValidator.create(
          'getFile',
          $propertyValidator.create(
            'getMediaType',
            validator._validators[1]
          )
        );
      }
      return validator;
    }

  });

  return $;

});
