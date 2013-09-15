/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/date',
  'sulfur/schema/pattern',
  'sulfur/schema/validators',
  'sulfur/util'
], function ($factory, $date, $pattern, $validators, $util) {

  'use strict';

  var $ = $factory.clone({

    /**
     * Validate the facets applicable to the date type.
     *
     * @param [object] facets
     * @param [array] errors (optional) an array receiving a pair of facet name
     *   and message for each validation error
     *
     * @option facets [array] enumeration
     * @option facets [sulfur/schema/date] maxExclusive
     * @option facets [sulfur/schema/date] maxInclusive
     * @option facets [sulfur/schema/date] minExclusive
     * @option facets [sulfur/schema/date] minInclusive
     * @option facets [array] patterns
     *
     * @return [boolean] whether all facets are valid or not
     */
    validateFacets: (function () {

      function isDate(x) {
        return $date.prototype.isPrototypeOf(x);
      }

      function validateEnumerationFacet(facets, errors) {
        if (facets.enumeration.length === 0) {
          if (errors) {
            errors.push([ 'enumeration', "must specify at least one XSD date value" ]);
          }
          return false;
        }
        if (!facets.enumeration.every(isDate)) {
          if (errors) {
            errors.push([ 'enumeration', "must specify only XSD date values" ]);
          }
          return false;
        }
        return true;
      }

      function validateMaxExclusiveFacet(facets, errors) {
        if ($util.isDefined(facets.maxInclusive)) {
          if (errors) {
            errors.push([ 'maxExclusive', "cannot be used along with facet maxInclusive" ]);
          }
          return false;
        }
        if (!isDate(facets.maxExclusive)) {
          if (errors) {
            errors.push([ 'maxExclusive', "must be an XSD date" ]);
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
        if (!isDate(facets.maxInclusive)) {
          if (errors) {
            errors.push([ 'maxInclusive', "must be an XSD date" ]);
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
        if (!isDate(facets.minExclusive)) {
          if (errors) {
            errors.push([ 'minExclusive', "must be an XSD date" ]);
          }
          return false;
        }
        return true;
      }

      function validateMinInclusiveFacet(facets, errors) {
        if (!isDate(facets.minInclusive)) {
          if (errors) {
            errors.push([ 'minInclusive', "must be an XSD date" ]);
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
        if (!facets.patterns.every($util.bind($pattern.prototype, 'isPrototypeOf'))) {
          if (errors) {
            errors.push([ 'patterns', "must specify only XSD patterns" ]);
          }
          return false;
        }
        return true;
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
          return $util.isUndefined(facets[_[0]]) || _[1](facets, errors);
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
     * @option facets [sulfur/schema/date] maxExclusive
     * @option facets [sulfur/schema/date] maxInclusive
     * @option facets [sulfur/schema/date] minExclusive
     * @option facets [sulfur/schema/date] minInclusive
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

      this._maxExclusive = facets.maxExclusive;
      this._maxInclusive = facets.maxInclusive;
      this._minExclusive = facets.minExclusive;
      this._minInclusive = facets.minInclusive;

      if (facets.enumeration) {
        this._enumeration = $util.uniq(
          facets.enumeration.map($util.method('normalize')),
          $util.method('toLiteral'));
      }

      if (facets.patterns) {
        this._patterns = $util.uniq(facets.patterns, $util.method('toLiteral'));
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
     * @return [sulfur/schema/date] the value if facet `maxExclusive` when defined
     * @return [undefined] if facet `maxExclusive` is not defined
     */
    getMaxExclusiveValue: function () {
      return this._maxExclusive;
    },

    /**
     * @return [sulfur/schema/date] the value if facet `maxInclusive` when defined
     * @return [undefined] if facet `maxInclusive` is not defined
     */
    getMaxInclusiveValue: function () {
      return this._maxInclusive;
    },

    /**
     * @return [sulfur/schema/date] the value if facet `minExclusive` when defined
     * @return [undefined] if facet `minExclusive` is not defined
     */
    getMinExclusiveValue: function () {
      return this._minExclusive;
    },

    /**
     * @return [sulfur/schema/date] the value if facet `minInclusive` when defined
     * @return [undefined] if facet `minInclusive` is not defined
     */
    getMinInclusiveValue: function () {
      return this._minInclusive;
    },

    /**
     * @return [array] the patterns of facet `patterns` if defined
     * @return [undefined] if facet `patterns` is not defined
     */
    getPatternValues: function () {
      return this._patterns;
    },

    /**
     * Create a validator for this date type using all defined facets.
     *
     * @return [#validate()] the validator
     */
    validator: function () {
      var validators = [ $validators.prototype.create($date.prototype) ];

      if (this._enumeration) {
        validators.push($validators.enumeration.create(this._enumeration));
      }

      if (this._maxExclusive) {
        validators.push($validators.maximum.create(this._maxExclusive, { exclusive: true }));
      } else if (this._maxInclusive) {
        validators.push($validators.maximum.create(this._maxInclusive));
      }

      if (this._minExclusive) {
        validators.push($validators.minimum.create(this._minExclusive, { exclusive: true }));
      } else if (this._minInclusive) {
        validators.push($validators.minimum.create(this._minInclusive));
      }

      if (this._patterns) {
        validators.push($validators.some.create(this._patterns.map(function (_) {
          return $validators.pattern.create(_);
        })));
      }

      return $validators.all.create(validators);
    }

  });

  return $;

});
