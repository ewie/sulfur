/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define(['shared', 'sulfur'], function ($shared, $sulfur) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur', function () {

    describe('.getNamespaceURI()', function () {

      it("should return 'https://vsr.informatik.tu-chemnitz.de/projects/2013/sulfur'", function () {
        expect($sulfur.getNamespaceURI()).to.equal('https://vsr.informatik.tu-chemnitz.de/projects/2013/sulfur');
      });

    });

  });

});
