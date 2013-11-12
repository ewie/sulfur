/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/value/complex',
  'sulfur/schema/value/simple/string'
], function (shared, ComplexValue, StringValue) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/schema/value/complex', function () {

    describe('#initialize()', function () {

      it("should initialize with an array of name/value pairs", function () {
        var values = [
          [ 'foo', StringValue.create() ]
        ];
        var type = ComplexValue.create(values);
        expect(type.getValue('foo')).to.equal(values[0][1]);
      });

      it("should reject duplicate names", function () {
        var values = [
          [ 'foo', StringValue.create() ],
          [ 'foo', StringValue.create() ]
        ];
        expect(bind(ComplexValue, 'create', values))
          .to.throw('duplicate name "foo"');
      });

    });

    describe('#getValue()', function () {

      var type;
      var values;

      beforeEach(function () {
        values = [ [ 'foo', StringValue.create() ] ];
        type = ComplexValue.create(values);
      });

      it("should return the value associated with the given name", function () {
        expect(type.getValue('foo')).to.equal(values[0][1]);
      });

      it("should reject when the given name is not associated with any value", function () {
        expect(bind(type, 'getValue', 'bar'))
          .to.throw('name "bar" is not associated with any value');
      });

    });

  });

});
