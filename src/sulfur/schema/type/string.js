/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/pattern',
  'sulfur/schema/validators',
  'sulfur/schema/value/string',
  'sulfur/util'
], function ($factory, $pattern, $validators, $stringValue, $util) {

  'use strict';

  var $ = $factory.clone({

    /**
     * Validate the facets applicable to the string type.
     *
     * @param [object] facets
     * @param [array] errors (optional) an array filled with pairs of facet
     *   name and message for each validation error
     *
     * @options facets [array] enumeration an array of allowed string values
     * @options facets [number] maxLength the maximum allowed string length
     * @options facets [number] minLength the minimum required string length
     * @options facets [array] patterns an array of patterns
     *
     * @return [boolean] whether all facets are valid or not
     */
    validateFacets: (function () {

      function validateEnumerationFacet(facets, errors) {
        if (facets.enumeration.length === 0) {
          if (errors) {
            errors.push([ 'enumeration',
              "must specify at least one sulfur/schema/value/string value" ]);
          }
          return false;
        }
        if (!facets.enumeration.every($util.bind($stringValue.prototype, 'isPrototypeOf'))) {
          if (errors) {
            errors.push([ 'enumeration',
              "must specify only sulfur/schema/value/string values" ]);
          }
          return false;
        }
        return true;
      }

      function validateMaxLengthFacet(facets, errors) {
        if (facets.maxLength < 0 || Math.floor(facets.maxLength) !== facets.maxLength) {
          if (errors) {
            errors.push([ 'maxLength', "must be a non-negative integer" ]);
          }
          return false;
        }
        if ($util.isDefined(facets.minLength)) {
          if (facets.maxLength < facets.minLength) {
            if (errors) {
              errors.push([ 'maxLength',
                "must be greater than or equal to facet minLength" ]);
            }
            return false;
          }
        }
        return true;
      }

      function validateMinLengthFacet(facets, errors) {
        if (facets.minLength < 0 || Math.floor(facets.minLength) !== facets.minLength) {
          if (errors) {
            errors.push([ 'minLength', "must be a non-negative integer" ]);
          }
          return false;
        }
        return true;
      }

      function validatePatternsFacet(facets, errors) {
        if (facets.patterns.length === 0) {
          if (errors) {
            errors.push([ 'patterns', "must specify at least one sulfur/schema/pattern" ]);
          }
          return false;
        }
        if (!facets.patterns.every($util.bind($pattern.prototype, 'isPrototypeOf'))) {
          if (errors) {
            errors.push([ 'patterns', "must specify only sulfur/schema/pattern" ]);
          }
          return false;
        }
        return true;
      }

      var VALIDATORS = [
        [ 'enumeration', validateEnumerationFacet ],
        [ 'maxLength', validateMaxLengthFacet ],
        [ 'minLength', validateMinLengthFacet ],
        [ 'patterns', validatePatternsFacet ]
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
     * Initialize a string type with facets
     *
     * @param [object] facets (optional)
     *
     * @options facets [array] enumeration an array of allowed string values
     * @options facets [number] maxLength the maximum allowed string length
     * @options facets [number] minLength the minimum required string length
     * @options facets [array] patterns an array of patterns
     *
     * @throw [Error] when .validateFacets() returns false
     */
    initialize: function (facets) {
      facets || (facets = {});

      var errors = [];
      if (!this.factory.validateFacets(facets, errors)) {
        throw new Error('facet ' + errors[0][0] + ' ' + errors[0][1]);
      }

      if (facets.enumeration) {
        this._enumeration = $util.uniq(facets.enumeration);
      }

      this._maxLength = facets.maxLength;
      this._minLength = facets.minLength;

      if (facets.patterns) {
        this._patterns = $util.uniq(facets.patterns);
      }
    },

    /**
     * @return [array] the values of facet `enumeration` if defined
     * @return [undefined] if facet `enumeration` is not defined
     */
    getEnumerationValues: function () {
      return this._enumeration;
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
     * @return [array] the patterns of facet `patterns` if defined
     * @return [undefined] if facet `patterns` is not defined
     */
    getPatternValues: function () {
      return this._patterns;
    },

    /**
     * Create a validator for this string type using all defined facets.
     *
     * @return [#validate()] the validator
     */
    validator: function () {
      var validators = [];

      if ($util.isDefined(this._maxLength) || $util.isDefined(this._minLength)) {
        validators.push($validators.length.create({
          min: this._minLength,
          max: this._maxLength
        }));
      }

      if (this._enumeration) {
        validators.push($validators.enumeration.create(
          this._enumeration, { testMethod: 'eq' }));
      }

      if (this._patterns) {
        validators.push(
          $validators.some.create(
            this._patterns.map(function (_) {
              return $validators.pattern.create(_);
            })
          )
        );
      }

      return $validators.all.create(validators);
    }

  });

  return $;

});
