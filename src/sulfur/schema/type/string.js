/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/object',
  'sulfur/schema/pattern',
  'sulfur/schema/validators',
  'sulfur/util/orderedMap',
  'unorm'
], function ($object, $pattern, $validators, $orderedMap, $unorm) {

  'use strict';

  function isDefined(obj) {
    return typeof obj !== 'undefined';
  }

  function uniq(values, keyfn) {
    var map = $orderedMap.create(keyfn);
    values.forEach(function (value) {
      if (map.canBeInserted(value)) {
        map.insert(value);
      }
    });
    return map.toArray();
  }

  var $ = $object.clone({

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
            errors.push([ 'enumeration', "must specify at least one value" ]);
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
        if (isDefined('minLength')) {
          if (facets.maxLength < facets.minLength) {
            if (errors) {
              errors.push([ 'maxLength', "must be greater than or equal to facet minLength" ]);
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
        [ 'maxLength', validateMaxLengthFacet ],
        [ 'minLength', validateMinLengthFacet ],
        [ 'patterns', validatePatternsFacet ]
      ];

      return function (facets, errors) {
        return VALIDATORS.every(function (_) {
          var name = _[0];
          if (isDefined(facets[name])) {
            return _[1](facets, errors);
          }
          return true;
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
      if (!$.validateFacets(facets, errors)) {
        throw new Error('facet ' + errors[0][0] + ' ' + errors[0][1]);
      }

      if (facets.enumeration) {
        this.enumeration = uniq(facets.enumeration.map(function (_) {
          return $unorm.nfc(_);
        }));
      }

      isDefined(facets.maxLength) && (this.maxLength = facets.maxLength);
      isDefined(facets.minLength) && (this.minLength = facets.minLength);

      if (facets.patterns) {
        this.patterns = uniq(facets.patterns, function (_) {
          return _.toLiteral();
        });
      }
    },

    /**
     * Create a validator for this string type using all defined facets.
     *
     * @return [#validate()] the validator
     */
    validator: function () {
      var validators = [];

      if (isDefined(this.maxLength) || isDefined(this.minLength)) {
        validators.push($validators.length.create({
          min: this.minLength,
          max: this.maxLength
        }));
      }

      if (this.enumeration) {
        validators.push($validators.enumeration.create(this.enumeration));
      }

      if (this.patterns) {
        validators.push(
          $validators.some.create(
            this.patterns.map(function (_) {
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