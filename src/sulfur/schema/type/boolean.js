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
  'sulfur/util'
], function ($factory, $pattern, $validators, $util) {

  'use strict';

  var $ = $factory.clone({

    /**
     * Validate the facets applicable to the boolean type.
     *
     * @param [object] facets
     * @param [#push()] errors (optional) an object receiving a pair of facet
     *   name and message for each validation error
     *
     * @option facets [array] enumeration an array of allowed boolean literals
     * @option facets [array] patterns an array of patterns
     *
     * @return [boolean] whether all facets are valid or not
     */
    validateFacets: (function () {

      function validateEnumerationFacet(facets, errors) {
        if (facets.enumeration.length === 0) {
          if (errors) {
            errors.push([ 'enumeration',
              "must specify at least one of 'true', '1', 'false' or '0'" ]);
          }
          return false;
        }
        return facets.enumeration.every(function (value) {
          if (value === 'true' || value === '1' || value === 'false' || value === '0') {
            return true;
          }
          if (errors) {
            errors.push([ 'enumeration',
              "must specify only boolean values 'true', '1', 'false' or '0'" ]);
          }
          return false;
        });
      }

      function validatePatternsFacet(facets, errors) {
        if (facets.patterns.length === 0) {
          if (errors) {
            errors.push([ 'patterns', "must specify at least one XSD pattern" ]);
          }
          return false;
        }
        return facets.patterns.every(function (pattern) {
          if ($pattern.prototype.isPrototypeOf(pattern)) {
            return true;
          }
          if (errors) {
            errors.push([ 'patterns', "must specify only XSD patterns" ]);
          }
          return false;
        });
      }

      var VALIDATORS = [
        [ 'enumeration', validateEnumerationFacet ],
        [ 'patterns', validatePatternsFacet ]
      ];

      return function (facets, errors) {
        return VALIDATORS.every(function (_) {
          var facetName = _[0];
          if ($util.isDefined(facets[facetName])) {
            return _[1](facets, errors);
          }
          return true;
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
     * @option facets [array] enumeration an array of allowed boolean literals
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
        this.enumeration = $util.uniq(facets.enumeration);
      }

      if (facets.patterns) {
        this.patterns = $util.uniq(facets.patterns, function (pattern) {
          return pattern.toLiteral();
        });
      }
    },

    /**
     * Create a validator for this boolean type using all defined facets.
     *
     * @return [#validate()] the validator
     */
    validator: (function () {

      var BOOLEAN_LITERAL_PATTERN = /^(?:true|false|1|0)$/;

      return function () {
        var validators = [ $validators.pattern.create(BOOLEAN_LITERAL_PATTERN) ];

        if (this.enumeration) {
          validators.push($validators.enumeration.create(this.enumeration));
        }

        if (this.patterns) {
          validators.push(
            $validators.some.create(
              this.patterns.map(function (pattern) {
                return $validators.pattern.create(pattern);
              })
            )
          );
        }

        return $validators.all.create(validators);
      };

    }())

  });

  return $;

});
