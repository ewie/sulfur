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
], function ($shared, $qname) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/qname', function () {

    var qname;

    beforeEach(function () {
      qname = $qname.create('foo', 'urn:bar');
    });

    describe('#getLocalName()', function () {

      it("should return the local name", function () {
        expect(qname.getLocalName()).to.equal('foo');
      });

    });

    describe('#getNamespaceURI()', function () {

      it("should return the namespace URI", function () {
        expect(qname.getNamespaceURI()).to.equal('urn:bar');
      });

    });

    describe('#toString()', function () {

      it("should return the Clark Notation", function () {
        expect(qname.toString()).to.equal('{urn:bar}foo');
      });

    });

  });

});
