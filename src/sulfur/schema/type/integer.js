/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/type/decimal',
  'sulfur/schema/validators',
  'sulfur/schema/value/integer',
  'sulfur/util'
], function ($decimalType, $validators, $integerValue, $util) {

  'use strict';

  var $ = $decimalType.clone({

    validateFacets: (function () {

      function isInteger(x) {
        return $integerValue.prototype.isPrototypeOf(x);
      }

      function validateEnumerationFacet(facets, errors) {
        if (facets.enumeration.length === 0) {
          if (errors) {
            errors.push([ 'enumeration', "must specify at least one sulfur/schema/value/integer value" ]);
          }
          return false;
        }
        if (!facets.enumeration.every(isInteger)) {
          if (errors) {
            errors.push([ 'enumeration', "must specify only sulfur/schema/value/integer values" ]);
          }
          return false;
        }
        return true;
      }

      function validateMinInclusiveFacet(facets, errors) {
        if (isInteger(facets.minInclusive)) {
          return true;
        }
        if (errors) {
          errors.push([ 'minInclusive', "must be a sulfur/schema/value/integer value" ]);
        }
        return false;
      }

      function validateMaxInclusiveFacet(facets, errors) {
        if (isInteger(facets.maxInclusive)) {
          return true;
        }
        if (errors) {
          errors.push([ 'maxInclusive', "must be a sulfur/schema/value/integer value" ]);
        }
        return false;
      }

      function validateMinExclusiveFacet(facets, errors) {
        if (isInteger(facets.minExclusive)) {
          return true;
        }
        if (errors) {
          errors.push([ 'minExclusive', "must be a sulfur/schema/value/integer value" ]);
        }
        return false;
      }

      function validateMaxExclusiveFacet(facets, errors) {
        if (isInteger(facets.maxExclusive)) {
          return true;
        }
        if (errors) {
          errors.push([ 'maxExclusive', "must be a sulfur/schema/value/integer value" ]);
        }
        return false;
      }

      function validateFractionDigitsFacet(facets, errors) {
        if (facets.fractionDigits === 0) {
          return true;
        }
        if (errors) {
          errors.push([ 'fractionDigits', "must be zero" ]);
        }
        return false;
      }

      var VALIDATORS = [
        [ 'enumeration', validateEnumerationFacet ],
        [ 'fractionDigits', validateFractionDigitsFacet ],
        [ 'maxExclusive', validateMaxExclusiveFacet ],
        [ 'maxInclusive', validateMaxInclusiveFacet ],
        [ 'minExclusive', validateMinExclusiveFacet ],
        [ 'minInclusive', validateMinInclusiveFacet ]
      ];

      return function (facets, errors) {
        return VALIDATORS.every(function (_) {
          return $util.isUndefined(facets[_[0]]) || _[1](facets, errors);
        }) && $decimalType.validateFacets(facets, errors);
      };

    }())

  });

  $.augment({

    validator: function () {
      var v = $decimalType.prototype.validator.call(this);
      var validators = [
        $validators.prototype.create($integerValue.prototype)
      ].concat(v._validators.slice(1));
      return $validators.all.create(validators);
    }

  });

  return $;

});
