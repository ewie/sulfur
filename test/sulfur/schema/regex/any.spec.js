/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/regex/any'
], function ($shared, $any) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur.schema.regex.any', function () {

    it("should exist", function () {
      expect($any).to.exist;
    });

  });

});
