/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/qname'
], function (shared, QName) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/qname', function () {

    var qname;

    beforeEach(function () {
      qname = QName.create('foo', 'urn:bar');
    });

    describe('#localName', function () {

      it("should return the local name", function () {
        expect(qname.localName).to.equal('foo');
      });

    });

    describe('#namespaceURI', function () {

      it("should return the namespace URI", function () {
        expect(qname.namespaceURI).to.equal('urn:bar');
      });

    });

    describe('#toString()', function () {

      it("should return the Clark Notation", function () {
        expect(qname.toString()).to.equal('{urn:bar}foo');
      });

    });

  });

});
