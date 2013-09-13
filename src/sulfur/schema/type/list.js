/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/validators'
], function ($factory, $validators) {

  'use strict';

  function isDefined(x) {
    return typeof x !== 'undefined';
  }

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
        if (isDefined(facets.minLength) && value < facets.minLength) {
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
          return isDefined(facets[_[0]]) ? _[1](facets, errors) : true;
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

      this.itemType = itemType;

      this.maxLength = facets.maxLength;
      this.minLength = facets.minLength;
    },

    /**
     * Create a validator for all defined facets of this type.
     *
     * @return [#validate()] the validator
     */
    validator: function () {
      var validators = [ $validators.each.create(this.itemType.validator()) ];

      if (isDefined(this.maxLength) || isDefined(this.minLength)) {
        validators.push($validators.length.create({
          max: this.maxLength,
          min: this.minLength
        }));
      }

      return $validators.all.create(validators);
    }

  });

  return $;

});
