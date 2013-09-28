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
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/presence',
  'sulfur/schema/validator/property',
  'sulfur/schema/validator/prototype',
  'sulfur/schema/value/fileRef'
], function (
    $mediaTypeFacet,
    $mediaType,
    $_simpleType,
    $allValidator,
    $presenceValidator,
    $propertyValidator,
    $prototypeValidator,
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
      var mediaTypeFacet = this.getFacet($mediaTypeFacet.getName(), $mediaTypeFacet.getNamespace());
      if (!mediaTypeFacet) {
        return validator;
      }
      return $allValidator.create([
        $prototypeValidator.create(this.getValueType().prototype),
        $presenceValidator.create(
          'getFile',
          $propertyValidator.create(
            'getMediaType',
            mediaTypeFacet.createValidator()
          )
        )
      ]);
    }

  });

  return $;

});
