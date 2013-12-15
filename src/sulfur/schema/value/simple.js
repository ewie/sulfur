/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  /**
   * @api public
   *
   * @abstract
   *
   * @implement {sulfur/schema/value/simple} .parse({string})
   * @implement {boolean} #eq({sulfur/schema/value/simple})
   * @implememt {string} #toString()
   */
  return Factory.clone({

    isValidLiteral: function (s) {
      try {
        this.parse(s);
      } catch (e) {
        return false;
      }
      return true;
    }

  });

});
