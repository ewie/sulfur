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

    describe('#id', function () {

      it("should return the ID when defined", function () {
        var record = Record.create([], '42');
        expect(record.id).to.equal('42');
      });

      it("should return undefined when no ID is defined", function () {
        var record = Record.create([]);
        expect(record.id).to.be.undefined;
      });

    });

    describe('#isNew', function () {

      it("should return false when an ID is defined", function () {
        var record = Record.create([], '123');
        expect(record.isNew).to.be.false;
      });

      it("should return true when no ID is defined", function () {
        var record = Record.create([]);
        expect(record.isNew).to.be.true;
      });

    });

    describe('#names', function () {

      it("should return an array with the names of all defined values", function () {
        var record = Record.create([
          [ 'foo' ],
          [ 'bar' ]
        ]);
        var names = record.names;
        expect(names).to.have.lengthOf(2);
        expect(names).to.include('foo');
        expect(names).to.include('bar');
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
