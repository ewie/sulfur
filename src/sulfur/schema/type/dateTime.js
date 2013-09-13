/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/dateTime',
  'sulfur/schema/pattern',
  'sulfur/schema/validators',
  'sulfur/util'
], function ($factory, $dateTime, $pattern, $validators, $util) {

  'use strict';

  var $ = $factory.clone({

    /**
     * Initialize the type with facets.
     *
     * @param [object] facets
     * @param [array] errors (optional) an array receiving a pair of facet name
     *   and message for each validation error
     *
     * @option facets [array] enumeration
     * @option facets [sulfur/schema/dateTime] maxExclusive
     * @option facets [sulfur/schema/dateTime] maxInclusive
     * @option facets [sulfur/schema/dateTime] minExclusive
     * @option facets [sulfur/schema/dateTime] minInclusive
     * @option facets [array] patterns
     */
    validateFacets: (function () {

      function validateEnumerationFacet(facets, errors) {
        if (facets.enumeration.length === 0) {
          if (errors) {
            errors.push([ 'enumeration', "must specify at least one XSD datetime value" ]);
          }
          return false;
        }
        return facets.enumeration.every(function (_) {
          if ($dateTime.prototype.isPrototypeOf(_)) {
            return true;
          }
          if (errors) {
            errors.push([ 'enumeration', "must specify only XSD datetime values" ]);
          }
          return false;
        });
      }

      function validateMaxExclusiveFacet(facets, errors) {
        if ($util.isDefined(facets.maxInclusive)) {
          if (errors) {
            errors.push([ 'maxExclusive', "cannot be used along with facet maxInclusive" ]);
          }
          return false;
        }
        if (!$dateTime.prototype.isPrototypeOf(facets.maxExclusive)) {
          if (errors) {
            errors.push([ 'maxExclusive', "must be an XSD datetime" ]);
          }
          return false;
        }
        if ($util.isDefined(facets.minExclusive) && facets.maxExclusive.lt(facets.minExclusive)) {
          if (errors) {
            errors.push([ 'maxExclusive', "must be greater than or equal to facet minExclusive" ]);
          }
          return false;
        }
        if ($util.isDefined(facets.minInclusive) && facets.maxExclusive.lteq(facets.minInclusive)) {
          if (errors) {
            errors.push([ 'maxExclusive', "must be greater than facet minInclusive" ]);
          }
          return false;
        }
        return true;
      }

      function validateMaxInclusiveFacet(facets, errors) {
        if (!$dateTime.prototype.isPrototypeOf(facets.maxInclusive)) {
          if (errors) {
            errors.push([ 'maxInclusive', "must be an XSD datetime" ]);
          }
          return false;
        }
        if ($util.isDefined(facets.minInclusive) && facets.maxInclusive.lt(facets.minInclusive)) {
          if (errors) {
            errors.push([ 'maxInclusive', "must be greater than or equal to facet minInclusive" ]);
          }
          return false;
        }
        if ($util.isDefined(facets.minExclusive) && facets.maxInclusive.lteq(facets.minExclusive)) {
          if (errors) {
            errors.push([ 'maxInclusive', "must be greater than facet minExclusive" ]);
          }
          return false;
        }
        return true;
      }

      function validateMinExclusiveFacet(facets, errors) {
        if ($util.isDefined(facets.minInclusive)) {
          if (errors) {
            errors.push([ 'minExclusive', "cannot be used along with facet minInclusive" ]);
          }
          return false;
        }
        if (!$dateTime.prototype.isPrototypeOf(facets.minExclusive)) {
          if (errors) {
            errors.push([ 'minExclusive', "must be an XSD datetime" ]);
          }
          return false;
        }
        return true;
      }

      function validateMinInclusiveFacet(facets, errors) {
        if (!$dateTime.prototype.isPrototypeOf(facets.minInclusive)) {
          if (errors) {
            errors.push([ 'minInclusive', "must be an XSD datetime" ]);
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

      var VALIDATORS = [
        [ 'enumeration', validateEnumerationFacet ],
        [ 'maxExclusive', validateMaxExclusiveFacet ],
        [ 'maxInclusive', validateMaxInclusiveFacet ],
        [ 'minExclusive', validateMinExclusiveFacet ],
        [ 'minInclusive', validateMinInclusiveFacet ],
        [ 'patterns', validatePatternsFacet ]
      ];

      return function (facets, errors) {
        return VALIDATORS.every(function (_) {
          var name = _[0];
          if ($util.isDefined(facets[name])) {
            return _[1](facets, errors);
          }
          return true;
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
     * @option facets [sulfur/schema/dateTime] maxExclusive
     * @option facets [sulfur/schema/dateTime] maxInclusive
     * @option facets [sulfur/schema/dateTime] minExclusive
     * @option facets [sulfur/schema/dateTime] minInclusive
     * @option facets [array] patterns
     *
     * @throw [Error] if .validateFacets() returns false
     */
    initialize: function (facets) {
      facets || (facets = {});

      var errors = [];
      if (!this.factory.validateFacets(facets, errors)) {
        throw new Error('facet ' + errors[0][0] + ' ' + errors[0][1]);
      }

      this.maxExclusive = facets.maxExclusive;
      this.maxInclusive = facets.maxInclusive;
      this.minExclusive = facets.minExclusive;
      this.minInclusive = facets.minInclusive;

      if (facets.enumeration) {
        this.enumeration = $util.uniq(facets.enumeration.map(function (_) {
          return _.normalize();
        }), function (_) {
          return _.toLiteral();
        });
      }

      if (facets.patterns) {
        this.patterns = $util.uniq(facets.patterns, function (_) {
          return _.toLiteral();
        });
      }
    },

    /**
     * Create a validator for this dateTime type using all defined facets.
     *
     * @return [#validate()] the validator
     */
    validator: function () {
      var validators = [ $validators.prototype.create($dateTime.prototype) ];

      if (this.enumeration) {
        validators.push($validators.enumeration.create(this.enumeration));
      }

      if (this.maxExclusive) {
        validators.push($validators.maximum.create(this.maxExclusive, { exclusive: true }));
      } else if (this.maxInclusive) {
        validators.push($validators.maximum.create(this.maxInclusive));
      }

      if (this.minExclusive) {
        validators.push($validators.minimum.create(this.minExclusive, { exclusive: true }));
      } else if (this.minInclusive) {
        validators.push($validators.minimum.create(this.minInclusive));
      }

      if (this.patterns) {
        validators.push($validators.some.create(this.patterns.map(function (_) {
          return $validators.pattern.create(_);
        })));
      }

      return $validators.all.create(validators);
    }

  });

  return $;

});
