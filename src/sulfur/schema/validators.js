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
  'sulfur/schema/validator/maximum',
  'sulfur/schema/validator/minimum',
  'sulfur/schema/validator/pattern',
  'sulfur/schema/validator/prototype',
  'sulfur/schema/validator/some'
], function (all, enumeration, length, maximum, minimum, pattern, prototype, some) {

  'use strict';

  return {
    all: all,
    enumeration: enumeration,
    length: length,
    maximum: maximum,
    minimum: minimum,
    pattern: pattern,
    prototype: prototype,
    some: some
  };

});
