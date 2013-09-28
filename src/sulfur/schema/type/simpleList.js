/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/type/_faceted',
  'sulfur/schema/type/_simple',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/each',
  'sulfur/schema/validator/equal',
  'sulfur/schema/validator/property',
  'sulfur/schema/validator/prototype',
  'sulfur/schema/value/simpleList'
], function (
    $enumerationFacet,
    $lengthFacet,
    $maxLengthFacet,
    $minLengthFacet,
    $patternFacet,
    $_facetedType,
    $_simpleType,
    $allValidator,
    $eachValidator,
    $equalValidator,
    $propertyValidator,
    $prototypeValidator,
    $simpleListValue
) {

  'use strict';

  var $ = $_facetedType.clone({

    getLegalFacets: function () {
      return [
        $enumerationFacet,
        $lengthFacet,
        $maxLengthFacet,
        $minLengthFacet,
        $patternFacet
      ];
    }

  });

  $.augment({

    initialize: function (type, facets) {
      if (this.factory.prototype.isPrototypeOf(type)) {
        $_facetedType.prototype.initialize.call(this, facets);
        this._base = type;
      } else if ($_simpleType.prototype.isPrototypeOf(type)) {
        this._itemType = type;
      } else {
        throw new Error("expecting a sulfur/schema/type/_simple as item type " +
          "or a sulfur/schema/type/simpleList as base type");
      }
    },

    getBase: function () {
      return this._base;
    },

    getItemType: function () {
      return this._itemType;
    },

    getValueType: function () {
      return this._base ? this._base.getValueType() : this._itemType;
    },

    createValidator: function () {
      if (this._base) {
        // XXX sulfur/schema/type/_faceted creates the facet validators in the
        //   order specified by #getLegalFacets(). For the sake of simplicity
        //   we access the first ("enumeration") and last ("pattern") validator
        //   by accessing the array of validators.
        var facetsValidator = $_facetedType.prototype.createValidator.call(this);
        if (this.hasStandardFacet('enumeration')) {
          facetsValidator._validators[0] = $propertyValidator.create(
            'toArray', $eachValidator.create(facetsValidator._validators[0]));
        }
        if (this.hasStandardFacet('pattern')) {
          var i = facetsValidator._validators.length - 1;
          facetsValidator._validators[i] = $propertyValidator.create(
            'toString', facetsValidator._validators[i]);
        }
        return $allValidator.create([
          this._base.createValidator(),
          facetsValidator
        ]);
      } else {
        return $allValidator.create([
          $prototypeValidator.create($simpleListValue.prototype),
          $propertyValidator.create('getItemValueType',
            $equalValidator.create(this.getItemType().getValueType()))
        ]);
      }
    }

  });

  return $;

});
