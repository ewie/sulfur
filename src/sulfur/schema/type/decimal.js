/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/object',
  'sulfur/schema/decimal',
  'sulfur/schema/pattern',
  'sulfur/schema/validators',
  'sulfur/util/orderedMap'
], function ($object, $decimal, $pattern, $validators, $orderedMap) {

  'use strict';

  function isDefined(x) {
    return typeof x !== 'undefined';
  }

  function isInteger(x) {
    return ~~x === x && x < Math.pow(2, 53);
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
     * Initialize the type with facets.
     *
     * @param [object] facets
     * @param [array] errors (optional) an array receiving a pair of facet name
     *   and message for each validation error
     *
     * @option facets [array] enumeration
     * @option facets [number] fractionDigits
     * @option facets [sulfur/schema/decimal] maxExclusive
     * @option facets [sulfur/schema/decimal] maxInclusive
     * @option facets [sulfur/schema/decimal] minExclusive
     * @option facets [sulfur/schema/decimal] minInclusive
     * @option facets [array] patterns
     * @option facets [number] totalDigits
     */
    validateFacets: (function () {

      function validateEnumerationFacet(facets, errors) {
        if (facets.enumeration.length === 0) {
          if (errors) {
            errors.push([ 'enumeration', "must specify at least one decimal value" ]);
          }
          return false;
        }
        return facets.enumeration.every(function (_) {
          if ($decimal.prototype.isPrototypeOf(_)) {
            return true;
          }
          if (errors) {
            errors.push([ 'enumeration', "must specify only decimal values" ]);
          }
          return false;
        });
      }

      function validateFractionDigitsFacet(facets, errors) {
        var value = facets.fractionDigits;
        if (value < 0 || !isInteger(value)) {
          if (errors) {
            errors.push([ 'fractionDigits', "must be an integer within range [0, 2^53)" ]);
          }
          return false;
        }
        return true;
      }

      function validateMaxExclusiveFacet(facets, errors) {
        if (isDefined(facets.maxInclusive)) {
          if (errors) {
            errors.push([ 'maxExclusive', "cannot be used along with facet maxInclusive" ]);
          }
          return false;
        }
        if (!$decimal.prototype.isPrototypeOf(facets.maxExclusive)) {
          if (errors) {
            errors.push([ 'maxExclusive', "must be a decimal value" ]);
          }
          return false;
        }
        if (isDefined(facets.minInclusive)) {
          if (facets.maxExclusive.lteq(facets.minInclusive)) {
            if (errors) {
              errors.push([ 'maxExclusive', "must be greater than facet minInclusive" ]);
            }
            return false;
          }
        }
        if (isDefined(facets.minExclusive)) {
          if (facets.maxExclusive.lt(facets.minExclusive)) {
            if (errors) {
              errors.push([ 'maxExclusive', "must be greater than or equal to facet minExclusive" ]);
            }
            return false;
          }
        }
        return true;
      }

      function validateMaxInclusiveFacet(facets, errors) {
        if (!$decimal.prototype.isPrototypeOf(facets.maxInclusive)) {
          if (errors) {
            errors.push([ 'maxInclusive', "must be a decimal value" ]);
          }
          return false;
        }
        if (isDefined(facets.minInclusive)) {
          if (facets.maxInclusive.lt(facets.minInclusive)) {
            if (errors) {
              errors.push([ 'maxInclusive', "must be greater than or equal to facet minInclusive" ]);
            }
            return false;
          }
        }
        if (isDefined(facets.minExclusive)) {
          if (facets.maxInclusive.lteq(facets.minExclusive)) {
            if (errors) {
              errors.push([ 'maxInclusive', "must be greater than facet minExclusive" ]);
            }
            return false;
          }
        }
        return true;
      }

      function validateMinExclusiveFacet(facets, errors) {
        if (isDefined(facets.minInclusive)) {
          if (errors) {
            errors.push([ 'minExclusive', "cannot be used along with facet minInclusive" ]);
          }
          return false;
        }
        if (!$decimal.prototype.isPrototypeOf(facets.minExclusive)) {
          if (errors) {
            errors.push([ 'minExclusive', "must be a decimal value" ]);
          }
          return false;
        }
        return true;
      }

      function validateMinInclusiveFacet(facets, errors) {
        if ($decimal.prototype.isPrototypeOf(facets.minInclusive)) {
          return true;
        }
        if (errors) {
          errors.push([ 'minInclusive', "must be a decimal value" ]);
        }
        return false;
      }

      function validatePatternsFacet(facets, errors) {
        if (facets.patterns.length === 0) {
          if (errors) {
            errors.push([ 'patterns', "must specify at least one XSD pattern" ]);
          }
          return false;
        }
        return facets.patterns.every(function (_) {
          if ($pattern.prototype.isPrototypeOf(_)) {
            return true;
          }
          if (errors) {
            errors.push([ 'patterns', "must specify only XSD patterns" ]);
          }
          return false;
        });
      }

      function validateTotalDigitsFacet(facets, errors) {
        var value = facets.totalDigits;
        if (value < 1 || !isInteger(value)) {
          if (errors) {
            errors.push([ 'totalDigits', "must be an integer within range (0, 2^53)" ]);
          }
          return false;
        }
        return true;
      }

      var VALIDATORS = [
        [ 'enumeration', validateEnumerationFacet ],
        [ 'fractionDigits', validateFractionDigitsFacet ],
        [ 'maxExclusive', validateMaxExclusiveFacet ],
        [ 'maxInclusive', validateMaxInclusiveFacet ],
        [ 'minExclusive', validateMinExclusiveFacet ],
        [ 'minInclusive', validateMinInclusiveFacet ],
        [ 'patterns', validatePatternsFacet ],
        [ 'totalDigits', validateTotalDigitsFacet ]
      ];

      return function (facets, errors) {
        return VALIDATORS.every(function (_) {
          return !isDefined(facets[_[0]]) || _[1](facets, errors);
        });
      };

    }())

  });

  $.augment({

    /**
     * Initialize the type with facets.
     *
     * @param [object] facets (optional)
     *
     * @option facets [array] enumeration
     * @option facets [number] fractionDigits
     * @option facets [sulfur/schema/decimal] maxExclusive
     * @option facets [sulfur/schema/decimal] maxInclusive
     * @option facets [sulfur/schema/decimal] minExclusive
     * @option facets [sulfur/schema/decimal] minInclusive
     * @option facets [array] patterns
     * @option facets [number] totalDigits
     *
     * @throw [Error] if .validateFacets() returns false
     */

    initialize: function (facets) {
      facets || (facets = []);

      var errors = [];
      if (!$.validateFacets(facets, errors)) {
        throw new Error('facet ' + errors[0][0] + ' ' + errors[0][1]);
      }

      if (facets.enumeration) {
        this.enumeration = uniq(facets.enumeration, function (value) {
          return value.toLiteral();
        });
      }

      this.fractionDigits = facets.fractionDigits;
      this.maxExclusive = facets.maxExclusive;
      this.maxInclusive = facets.maxInclusive;
      this.minExclusive = facets.minExclusive;
      this.minInclusive = facets.minInclusive;

      if (facets.patterns) {
        this.patterns = uniq(facets.patterns, function (value) {
          return value.toLiteral();
        });
      }

      this.totalDigits = facets.totalDigits;
    },

    validator: function () {
      var validators = [ $validators.prototype.create($decimal.prototype) ];

      if (this.enumeration) {
        validators.push($validators.enumeration.create(this.enumeration));
      }

      if (isDefined(this.fractionDigits)) {
        validators.push($validators.property.create(
          'countFractionDigits',
          $validators.maximum.create(this.fractionDigits)
        ));
      }

      if (this.maxExclusive) {
        validators.push($validators.maximum.create(this.maxExclusive, { exclusive: true }));
      }

      if (this.maxInclusive) {
        validators.push($validators.maximum.create(this.maxInclusive));
      }

      if (this.minExclusive) {
        validators.push($validators.minimum.create(this.minExclusive, { exclusive: true }));
      }

      if (this.minInclusive) {
        validators.push($validators.minimum.create(this.minInclusive));
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

      if (isDefined(this.totalDigits)) {
        validators.push($validators.property.create(
          'countDigits',
          $validators.maximum.create(this.totalDigits)
        ));
      }

      return $validators.all.create(validators);
    }

  });

  return $;

});
