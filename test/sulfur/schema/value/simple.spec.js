/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/value/simple'
], function (shared, SimpleValue) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/value/simple', function () {

    var DerivedSimpleValue;

    beforeEach(function () {
      DerivedSimpleValue = SimpleValue.clone();
    });

    describe('.isValidLiteral()', function () {

      beforeEach(function () {
        DerivedSimpleValue.parse = function () {};
      });

      it("should return false when .parse() throws", function () {
        var spy = sinon.stub(DerivedSimpleValue, 'parse').throws();
        var s = {};
        var r = DerivedSimpleValue.isValidLiteral(s);
        expect(spy).to.be.calledWith(sinon.match.same(s));
        expect(r).to.be.false;
      });

      it("should return true when .parse() does not throw", function () {
        var spy = sinon.spy(DerivedSimpleValue, 'parse');
        var s = {};
        var r = DerivedSimpleValue.isValidLiteral(s);
        expect(spy).to.be.calledWith(sinon.match.same(s));
        expect(r).to.be.true;
      });

    });

  });

});
