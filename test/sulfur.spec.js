/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define(['shared', 'sulfur'], function (shared, sulfur) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur', function () {

    describe('.namespaceURI', function () {

      it("should return 'https://vsr.informatik.tu-chemnitz.de/projects/2013/sulfur'", function () {
        expect(sulfur.namespaceURI).to.equal('https://vsr.informatik.tu-chemnitz.de/projects/2013/sulfur');
      });

    });

    describe('.schemaLocationURL', function () {

      it("should return 'https://www-user.tu-chemnitz.de/~ewie/sulfur.xsd'", function () {
        expect(sulfur.schemaLocationURL).to.equal('http://www-user.tu-chemnitz.de/~ewie/sulfur.xsd');
      });

    });

  });

});
