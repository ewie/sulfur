/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/enumeration',
  'sulfur/schema/validator/length',
  'sulfur/schema/validator/pattern',
  'sulfur/schema/validator/some'
], function (all, enumeration, length, pattern, some) {

  'use strict';

  return {
    all: all,
    enumeration: enumeration,
    length: length,
    pattern: pattern,
    some: some
  };

});
