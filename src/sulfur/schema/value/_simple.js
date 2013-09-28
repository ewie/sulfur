/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/factory'], function ($factory) {

  'use strict';

  /**
   * @abstract
   *
   * @implement #eq() equality test
   * @implement #toString() the value's canonical string representation
   */
  return $factory.derive();

});
