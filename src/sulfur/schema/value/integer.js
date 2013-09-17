/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/schema/value/decimal'], function ($decimalValue) {

  'use strict';

  /**
   * A regular expression matching an integer literal with optional insignifcant
   * fraction digits (only zero digits). Captures the following groups:
   *
   *   $1 optional sign
   *   $2 integral digits
   */
  var LITERAL_PATTERN = /^([+-]?)([0-9]+)(?:\.0+)?$/;

  var $ = $decimalValue.clone({

    /**
     * Check if a string represents a valid integer value.
     *
     * @param [string] s the string representation
     *
     * @return [boolean] whether the representation is valid
     */
    isValidLiteral: function (s) {
      return LITERAL_PATTERN.test(s);
    },

    /**
     * Parse a string representing an integer value (i.e. a decimal with no
     * significant fraction digits).
     *
     * @param [string] s the string representation
     *
     * @return [sulfur/schema/value/integer] the parsed integer
     *
     * @throw [Error] if the string represent no valid integer
     */
    parse: function (s) {
      var m = LITERAL_PATTERN.exec(s);
      if (!m) {
        throw new Error('invalid decimal integer "' + s + '"');
      }
      return this.create({
        integralDigits: m[2],
        positive: m[1] !== '-'
      });
    }

  });

  $.augment({

    /**
     * @param [object] options
     *
     * @option options [string] integralDigits (default '0')
     *   the digits to the left of the period
     * @option options [string] fractionDigits (default '0')
     *   the digits to the right of the period, must be zero
     * @option options [boolean] positive (default true)
     *   whether the integer is positive
     */
    initialize: function (options) {
      $decimalValue.prototype.initialize.call(this, options);
      if (this.countFractionDigits() !== 0) {
        throw new Error("fractionDigits must be zero");
      }
    }

  });

  return $;

});
