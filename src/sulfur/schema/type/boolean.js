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
  'sulfur/schema/value/boolean',
  'sulfur/util'
], function ($factory, $pattern, $validators, $booleanValue, $util) {

  'use strict';

  var $ = $factory.clone({

    /**
     * Validate the facets applicable to the boolean type.
     *
     * @param [object] facets
     * @param [#push()] errors (optional) an object receiving a pair of facet
     *   name and message for each validation error
     *
     * @option facets [array] enumeration an array of allowed boolean values
     * @option facets [array] patterns an array of patterns
     *
     * @return [boolean] whether all facets are valid or not
     */
    validateFacets: (function () {

      function validateEnumerationFacet(facets, errors) {
        if (facets.enumeration.length === 0) {
          if (errors) {
            errors.push([ 'enumeration',
              "must specify at least one sulfur/schema/value/boolean value" ]);
          }
          return false;
        }
        if (!facets.enumeration.every($util.bind($booleanValue.prototype, 'isPrototypeOf'))) {
          if (errors) {
            errors.push([ 'enumeration',
              "must specify only sulfur/schema/value/boolean values" ]);
          }
          return false;
        }
        return true;
      }

      function validatePatternsFacet(facets, errors) {
        if (facets.patterns.length === 0) {
          if (errors) {
            errors.push([ 'patterns', "must specify at least one pattern" ]);
          }
          return false;
        }
        if (!facets.patterns.every($util.bind($pattern.prototype, 'isPrototypeOf'))) {
          if (errors) {
            errors.push([ 'patterns', "must specify only patterns" ]);
          }
          return false;
        }
        return true;
      }

      var VALIDATORS = [
        [ 'enumeration', validateEnumerationFacet ],
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
     * Initialize a boolean type with facets.
     *
     * @param [object] facets (optional) the facets
     *
     * @option facets [array] enumeration an array of allowed boolean values
     * @option facets [array] patterns an array of patterns
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
     * @return [array] the patterns of facet `patterns` if defined
     * @return [undefined] if facet `patterns` is not defined
     */
    getPatternValues: function () {
      return this._patterns;
    },

    /**
     * Create a validator for this boolean type using all defined facets.
     *
     * @return [#validate()] the validator
     */
    validator: function () {
      var validators = [ $validators.prototype.create($booleanValue.prototype) ];

      if (this._enumeration) {
        validators.push($validators.enumeration.create(
          this._enumeration, { testMethod: 'eq' }));
      }

      if (this._patterns) {
        validators.push(
          $validators.some.create(
            this._patterns.map(function (pattern) {
              return $validators.pattern.create(pattern);
            })
          )
        );
      }

      return $validators.all.create(validators);
    }

  });

  return $;

});
