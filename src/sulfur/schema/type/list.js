/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/validators',
  'sulfur/util'
], function ($factory, $validators, $util) {

  'use strict';

  var $ = $factory.clone({

    /**
     * Validate the facets applicable to the list type.
     *
     * @param [object] facets
     * @param [array] errors (optional) an array to hold pairs of facet name
     *   and validation message for each invalid facet
     *
     * @option facets [number] maxLength
     * @option factes [number] minLength
     *
     * @return [boolean] whether all facets are valid or not
     */
    validateFacets: (function () {

      function validateMaxLengthFacet(facets, errors) {
        var value = facets.maxLength;
        if (value < 0) {
          if (errors) {
            errors.push([ 'maxLength', "must not be negative" ]);
          }
          return false;
        }
        if ($util.isDefined(facets.minLength) && value < facets.minLength) {
          if (errors) {
            errors.push([ 'maxLength', "must be greater than or equal to facet minLength" ]);
          }
          return false;
        }
        return true;
      }

      function validateMinLengthFacet(facets, errors) {
        var value = facets.minLength;
        if (value < 0) {
          if (errors) {
            errors.push([ 'minLength', "must not be negative" ]);
          }
          return false;
        }
        return true;
      }

      var VALIDATORS = [
        [ 'maxLength', validateMaxLengthFacet ],
        [ 'minLength', validateMinLengthFacet ]
      ];

      return function (facets, errors) {
        return VALIDATORS.every(function (_) {
          return $util.isUndefined(facets[_[0]]) || _[1](facets, errors);
        });
      };

    }())

  });

  $.augment({

    /**
     * @param [#validator()] itemType
     * @param [object] facets (optional)
     *
     * @option facets [number] maxLength
     * @option factes [number] minLength
     */
    initialize: function (itemType, facets) {
      facets || (facets = {});

      var errors = [];
      if (!this.factory.validateFacets(facets, errors)) {
        throw new Error('facet ' + errors[0][0] + ' ' + errors[0][1]);
      }

      this._itemType = itemType;

      this._maxLength = facets.maxLength;
      this._minLength = facets.minLength;
    },

    /**
     * @return [#validator()] the item type
     */
    getItemType: function () {
      return this._itemType;
    },

    /**
     * @return [number] the value of facet `maxLength` when defined
     * @return [undefined] when facet `maxLength` is not defined
     */
    getMaxLengthValue: function () {
      return this._maxLength;
    },

    /**
     * @return [number] the value of facet `minLength` when defined
     * @return [undefined] when facet `minLength` is not defined
     */
    getMinLengthValue: function () {
      return this._minLength;
    },

    /**
     * Create a validator for all defined facets of this type.
     *
     * @return [#validate()] the validator
     */
    validator: function () {
      var validators = [ $validators.each.create(this._itemType.validator()) ];

      if ($util.isDefined(this._maxLength) || $util.isDefined(this._minLength)) {
        validators.push($validators.length.create({
          max: this._maxLength,
          min: this._minLength
        }));
      }

      return $validators.all.create(validators);
    }

  });

  return $;

});
