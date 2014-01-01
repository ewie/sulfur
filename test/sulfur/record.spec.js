/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/record'
], function (shared, Record) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/record', function () {

    describe('#initialize()', function () {

      it("should reject values with duplicate name", function () {
        var values = [
          [ 'x' ],
          [ 'x' ]
        ];
        expect(bind(Record, 'create', values))
          .to.throw('duplicate value with name "x"');
      });

    });

    describe('#value()', function () {

      var value;
      var record;

      beforeEach(function () {
        value = {};
        record = Record.create([
          [ 'foo', value ]
        ]);
      });

      it("should return undefined when no value for the given name is defined", function () {
        expect(record.value('xxx')).to.be.undefined;
      });

      it("should return the value for the given name when defined", function () {
        expect(record.value('foo')).to.equal(value);
      });

    });

  });

});
