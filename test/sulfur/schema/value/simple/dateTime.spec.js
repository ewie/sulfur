/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/value/simple/dateTime',
  'sulfur/schema/value/simple/decimal',
  'sulfur/schema/value/simple/integer',
  'sulfur/schema/value/simple/numeric'
], function (shared, DateTimeValue, DecimalValue, IntegerValue, NumericValue) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/value/simple/dateTime', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it("should be derived from sulfur/schema/value/simple/numeric", function () {
      expect(NumericValue).to.be.prototypeOf(DateTimeValue);
    });

    describe('.parse()', function () {

      it("should ignore leading and trailing white space", function () {
        var dt = DateTimeValue.parse('\x09\x0A\x0D 0001-01-01T00:00:00 \x09\x0A\x0D');
        expect(dt).to.eql(DateTimeValue.create());
      });

      it("should accept a valid datetime literal", function () {
        var spy = sandbox.spy(DateTimeValue.prototype, 'initialize');
        var dt = DateTimeValue.parse('0001-02-03T04:05:06.789');
        expect(spy).to.be.calledOn(dt).and.be.calledWith({
          year: 1,
          month: 2,
          day: 3,
          hour: 4,
          minute: 5,
          second: DecimalValue.parse('6.789')
        });
      });

      it("should accept a second with fractional part", function () {
        var spy = sandbox.spy(DateTimeValue.prototype, 'initialize');
        var dt = DateTimeValue.parse('0001-01-01T00:00:00.123');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 1,
          month: 1,
          day: 1,
          hour: 0,
          minute: 0,
          second: DecimalValue.parse('0.123')
        });
      });

      it("should accept timezone Z as 00:00", function () {
        var spy = sandbox.spy(DateTimeValue.prototype, 'initialize');
        var dt = DateTimeValue.parse('0001-01-01T00:00:00Z');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 1,
          month: 1,
          day: 1,
          hour: 0,
          minute: 0,
          second: DecimalValue.create(),
          offset: 0
        });
      });

      it("should accept a positive timezone", function () {
        var spy = sandbox.spy(DateTimeValue.prototype, 'initialize');
        var dt = DateTimeValue.parse('0002-01-01T00:00:00+01:00');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 2,
          month: 1,
          day: 1,
          hour: 0,
          minute: 0,
          second: DecimalValue.create(),
          offset: 60
        });
      });

      it("should accept a negative timezone", function () {
        var spy = sandbox.spy(DateTimeValue.prototype, 'initialize');
        var dt = DateTimeValue.parse('0001-01-01T00:00:00-01:00');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 1,
          month: 1,
          day: 1,
          hour: 0,
          minute: 0,
          second: DecimalValue.create(),
          offset: -60
        });
      });

      it("should throw an error if #initialize() throws", function () {
        sandbox.stub(DateTimeValue.prototype, 'initialize').throws(new Error('invalid for testing purposes'));
        expect(bind(DateTimeValue, 'parse', '0001-01-01T00:00:00'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:00", error: invalid for testing purposes');
      });

      it("should reject a year with less than 4 digits", function () {
        expect(bind(DateTimeValue, 'parse', '001-01-01T00:00:00'))
          .to.throw('invalid datetime literal "001-01-01T00:00:00"');
      });

      it("should reject a year with more than 4 digits", function () {
        expect(bind(DateTimeValue, 'parse', '00001-01-01T00:00:00'))
          .to.throw('invalid datetime literal "00001-01-01T00:00:00"');
      });

      it("should reject a month with less than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-1-01T00:00:00'))
          .to.throw('invalid datetime literal "0001-1-01T00:00:00"');
      });

      it("should reject a month with more than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-001-01T00:00:00'))
          .to.throw('invalid datetime literal "0001-001-01T00:00:00"');
      });

      it("should reject a day with less than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-01-1T00:00:00'))
          .to.throw('invalid datetime literal "0001-01-1T00:00:00"');
      });

      it("should reject a day with more than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-01-001T00:00:00'))
          .to.throw('invalid datetime literal "0001-01-001T00:00:00"');
      });

      it("should reject an hour with less than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-01-01T0:00:00'))
          .to.throw('invalid datetime literal "0001-01-01T0:00:00"');
      });

      it("should reject an hour with more than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-01-01T000:00:00'))
          .to.throw('invalid datetime literal "0001-01-01T000:00:00"');
      });

      it("should reject a minute with less than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-01-01T00:0:00'))
          .to.throw('invalid datetime literal "0001-01-01T00:0:00"');
      });

      it("should reject a minute with more than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-01-01T00:000:00'))
          .to.throw('invalid datetime literal "0001-01-01T00:000:00"');
      });

      it("should reject a second with less than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-01-01T00:00:0'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:0"');
      });

      it("should reject a second with more than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-01-01T00:00:000'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:000"');
      });

      it("should reject a timezone hour with less than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-01-01T00:00:00+1:00'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:00+1:00"');
      });

      it("should reject a timezone hour with more than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-01-01T00:00:00+001:00'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:00+001:00"');
      });

      it("should reject a timezone minute with less than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-01-01T00:00:00+01:0'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:00+01:0"');
      });

      it("should reject a timezone minute with more than 2 digits", function () {
        expect(bind(DateTimeValue, 'parse', '0001-01-01T00:00:00+01:000'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:00+01:000"');
      });

    });

    describe('#initialize()', function () {

      it("should use 1 as default year", function () {
        var dt = DateTimeValue.create();
        expect(dt.year).to.equal(1);
      });

      it("should use 1 as default month", function () {
        var dt = DateTimeValue.create();
        expect(dt.month).to.equal(1);
      });

      it("should use 1 as default day", function () {
        var dt = DateTimeValue.create();
        expect(dt.day).to.equal(1);
      });

      it("should use zero as default hour", function () {
        var dt = DateTimeValue.create();
        expect(dt.hour).to.equal(0);
      });

      it("should use zero as default minute", function () {
        var dt = DateTimeValue.create();
        expect(dt.minute).to.equal(0);
      });

      it("should use zero as default second", function () {
        var dt = DateTimeValue.create();
        expect(dt.second).to.eql(DecimalValue.create());
      });

      it("should reject year less than 1", function () {
        expect(bind(DateTimeValue, 'create', { year: 0 }))
          .to.throw("year must not be less than 1");
      });

      it("should reject year greater than 9999", function () {
        expect(bind(DateTimeValue, 'create', { year: 10000 }))
          .to.throw("year must not be greater than 9999");
      });

      it("should reject non-integer year", function () {
        expect(bind(DateTimeValue, 'create', { year: 1.2 }))
          .to.throw("year must be an integer");
      });

      it("should reject non-integer month", function () {
        expect(bind(DateTimeValue, 'create', { month: 1.2 }))
          .to.throw("month must be an integer");
      });

      it("should reject month less than 1", function () {
        expect(bind(DateTimeValue, 'create', { month: 0 }))
          .to.throw("month must not be less than 1");
      });

      it("should reject month greater than 12", function () {
        expect(bind(DateTimeValue, 'create', { month: 13 }))
          .to.throw("month must not be greater than 12");
      });

      it("should reject non-integer day", function () {
        expect(bind(DateTimeValue, 'create', { day: 1.2 }))
          .to.throw("day must be an integer");
      });

      it("should reject day less than 1", function () {
        expect(bind(DateTimeValue, 'create', { day: 0 }))
          .to.throw("day must not be less than 1");
      });

      it("should reject day greater than 31 for month 1, 3, 5, 7, 8, 10 and 12", function () {
        [1, 3, 5, 7, 8, 10, 12].forEach(function (month) {
          expect(bind(DateTimeValue, 'create', { monht: month, day: 32 }))
            .to.throw("day must not be greater than 31 for month 1, 3, 5, 7, 8, 10 and 12");
        });
      });

      it("should reject day greater than 30 for month 4, 6, 9 and 11", function () {
        [4, 6, 9, 11].forEach(function (month) {
          expect(bind(DateTimeValue, 'create', { month: month, day: 31 }))
            .to.throw("day must not be greater than 30 for month 4, 6, 9 and 11");
        });
      });

      it("should reject day greater than 29 for month 2 and leap years", function () {
        expect(bind(DateTimeValue, 'create', { year: 2000, month: 2, day: 30 }))
          .to.throw("day must not be greater than 29 for month 2 in leap years");
      });

      it("should reject day greater than 28 for month 2 and non-leap years", function () {
        expect(bind(DateTimeValue, 'create', { year: 1900, month: 2, day: 29 }))
          .to.throw("day must not be greater than 29 for month 2 in non-leap years");
      });

      it("should reject non-integer hour", function () {
        expect(bind(DateTimeValue, 'create', { hour: 1.2 }))
          .to.throw("hour must be an integer");
      });

      it("should reject negative hour", function () {
        expect(bind(DateTimeValue, 'create', { hour: -1 }))
          .to.throw("hour must be non-negative");
      });

      it("should reject hour greater than 23", function () {
        expect(bind(DateTimeValue, 'create', { hour: 24 }))
          .to.throw("hour must not be greater than 23");
      });

      it("should reject non-integer minute", function () {
        expect(bind(DateTimeValue, 'create', { minute: 1.2 }))
          .to.throw("minute must be an integer");
      });

      it("should reject negative minute", function () {
        expect(bind(DateTimeValue, 'create', { minute: -1 }))
          .to.throw("minute must be non-negative");
      });

      it("should reject minute greater than 59", function () {
        expect(bind(DateTimeValue, 'create', { minute: 60 }))
          .to.throw("minute must not be greater than 59");
      });

      it("should reject non-decimal second", function () {
        expect(bind(DateTimeValue, 'create', { second: 0 }))
          .to.throw("second must be a decimal");
      });

      it("should reject a negative second", function () {
        expect(bind(DateTimeValue, 'create', { second: DecimalValue.parse('-1') }))
          .to.throw("second must be non-negative");
      });

      it("should reject a second greater than or equal to 60", function () {
        expect(bind(DateTimeValue, 'create', { second: DecimalValue.parse('60') }))
          .to.throw("second must not be greater than or equal to 60");
      });

      context("with a timezone", function () {

        it("should reject a non-integer timezone offset", function () {
          expect(bind(DateTimeValue, 'create', { offset: 1.2 }))
            .to.throw("timezone offset must be an integer");
        });

        it("should adjust the minute to UTC", function () {
          var dt = DateTimeValue.create({ minute: 35, offset: 30 });
          var x = DateTimeValue.create({ minute: 5, offset: 0 });
          expect(dt).to.eql(x);
        });

        it("should adjust the hour to UTC", function () {
          var dt = DateTimeValue.create({ hour: 7, offset: 3 * 60 });
          var x = DateTimeValue.create({ hour: 4, offset: 0 });
          expect(dt).to.eql(x);
        });

        it("should adjust the day to UTC", function () {
          var dt = DateTimeValue.create({ day: 3, hour: 4, offset: 5 * 60 });
          var x = DateTimeValue.create({ day: 2, hour: 23, offset: 0 });
          expect(dt).to.eql(x);
        });

        it("should adjust the month to UTC", function () {
          var dt = DateTimeValue.create({ month: 1, day: 31, hour: 23, offset: -2 * 60 });
          var x = DateTimeValue.create({ month: 2, day: 1, hour: 1, offset: 0 });
          expect(dt).to.eql(x);
        });

        it("should adjust the year to UTC", function () {
          var dt = DateTimeValue.create({ year: 2, hour: 1, offset: 2 * 60 });
          var x = DateTimeValue.create({ year: 1, month: 12, day: 31, hour: 23, offset: 0 });
          expect(dt).to.eql(x);
        });

        it("should throw if year will be less than 1", function () {
          expect(bind(DateTimeValue, 'create', { offset: 60 }))
            .to.throw("cannot normalize if year will be less than 1");
        });

        it("should throw if year will be greater than 9999", function () {
          expect(bind(DateTimeValue, 'create', { year: 9999, month: 12, day: 31, hour: 23, offset: -60 }))
            .to.throw("cannot normalize if year will be greater than 9999");
        });

      });

    });

    describe('#year', function () {

      it("should return the year", function () {
        var dt = DateTimeValue.create();
        expect(dt.year).to.equal(1);
      });

    });

    describe('#month', function () {

      it("should return the month", function () {
        var dt = DateTimeValue.create();
        expect(dt.month).to.equal(1);
      });

    });

    describe('#day', function () {

      it("should return the day", function () {
        var dt = DateTimeValue.create();
        expect(dt.day).to.equal(1);
      });

    });

    describe('#hour', function () {

      it("should return the hour", function () {
        var dt = DateTimeValue.create();
        expect(dt.hour).to.equal(0);
      });

    });

    describe('#minute', function () {

      it("should return the minute", function () {
        var dt = DateTimeValue.create();
        expect(dt.minute).to.equal(0);
      });

    });

    describe('#second', function () {

      it("should return the second", function () {
        var dt = DateTimeValue.create();
        expect(dt.second).to.eql(DecimalValue.create());
      });

    });

    describe('#toString()', function () {

      it("should pad year to 4 digits", function () {
        var dt = DateTimeValue.create();
        expect(dt.toString()).to.equal('0001-01-01T00:00:00');
        dt = DateTimeValue.create({ year: 1000 });
        expect(dt.toString()).to.equal('1000-01-01T00:00:00');
      });

      it("should pad month to 2 digits", function () {
        var dt = DateTimeValue.create();
        expect(dt.toString()).to.equal('0001-01-01T00:00:00');
        dt = DateTimeValue.create({ month: 10 });
        expect(dt.toString()).to.equal('0001-10-01T00:00:00');
      });

      it("should pad day to 2 digits", function () {
        var dt = DateTimeValue.create();
        expect(dt.toString()).to.equal('0001-01-01T00:00:00');
        dt = DateTimeValue.create({ day: 10 });
        expect(dt.toString()).to.equal('0001-01-10T00:00:00');
      });

      it("should pad hour to 2 digits", function () {
        var dt = DateTimeValue.create();
        expect(dt.toString()).to.equal('0001-01-01T00:00:00');
        dt = DateTimeValue.create({ hour: 10 });
        expect(dt.toString()).to.equal('0001-01-01T10:00:00');
      });

      it("should pad minute to 2 digits", function () {
        var dt = DateTimeValue.create();
        expect(dt.toString()).to.equal('0001-01-01T00:00:00');
        dt = DateTimeValue.create({ minute: 10 });
        expect(dt.toString()).to.equal('0001-01-01T00:10:00');
      });

      it("should pad second to 2 digits", function () {
        var dt = DateTimeValue.create();
        expect(dt.toString()).to.equal('0001-01-01T00:00:00');
        dt = DateTimeValue.create({ second: DecimalValue.parse('10') });
        expect(dt.toString()).to.equal('0001-01-01T00:00:10');
      });

      it("should include significant fraction digits", function () {
        var dt = DateTimeValue.create({ second: DecimalValue.parse('10.1') });
        expect(dt.toString()).to.equal('0001-01-01T00:00:10.1');
      });

      it("should use 'Z' to denote a timezoned datetime", function () {
        var dt = DateTimeValue.create({ offset: 0 });
        expect(dt.toString()).to.equal('0001-01-01T00:00:00Z');
      });

      it("should handle seconds initialized with an sulfur/schema/value/simple/integer", function () {
        var dt = DateTimeValue.create({ second: IntegerValue.parse('1') });
        expect(dt.toString()).to.equal('0001-01-01T00:00:01');
        dt = DateTimeValue.create({ second: IntegerValue.parse('10') });
        expect(dt.toString()).to.equal('0001-01-01T00:00:10');
      });

    });

    describe('#hasTimezone()', function () {

      it("should return true if it has a timezone", function () {
        var dt = DateTimeValue.create({ offset: 0 });
        expect(dt.hasTimezone()).to.be.true;
      });

      it("should return false if it has no timezone", function () {
        var dt = DateTimeValue.create();
        expect(dt.hasTimezone()).to.be.false;
      });

    });

    describe('#cmp()', function () {

      context("with inequal normalized year", function () {

        var lhs = DateTimeValue.create({ year: 1 });
        var rhs = DateTimeValue.create({ year: 2 });

        it("should return -1 if LHS year is less than RHS year", function () {
          expect(lhs.cmp(rhs)).to.equal(-1);
        });

        it("should return 1 if LHS year is greater than RHS year", function () {
          expect(rhs.cmp(lhs)).to.equal(1);
        });

      });

      context("with equal normalized year", function ()  {

        context("with inequal normalized month", function () {

          var lhs = DateTimeValue.create({ month: 1 });
          var rhs = DateTimeValue.create({ month: 2 });

          it("should return -1 if LHS month is less than RHS month", function () {
            expect(lhs.cmp(rhs)).to.equal(-1);
          });

          it("should return 1 if LHS month is greater than RHS month", function () {
            expect(rhs.cmp(lhs)).to.equal(1);
          });

        });

        context("with equal normalized month", function ()  {

          context("with inequal normalized day", function () {

            var lhs = DateTimeValue.create({ day: 1 });
            var rhs = DateTimeValue.create({ day: 2 });

            it("should return -1 if LHS day is less than RHS day", function () {
              expect(lhs.cmp(rhs)).to.equal(-1);
            });

            it("should return 1 if LHS day is greater than RHS month", function () {
              expect(rhs.cmp(lhs)).to.equal(1);
            });

          });

          context("with equal normalized day", function ()  {

            context("with inequal normalized hour", function () {

              var lhs = DateTimeValue.create({ hour: 1 });
              var rhs = DateTimeValue.create({ hour: 2 });

              it("should return -1 if LHS hour is less than RHS hour", function () {
                expect(lhs.cmp(rhs)).to.equal(-1);
              });

              it("should return 1 if LHS hour is greater than RHS hour", function () {
                expect(rhs.cmp(lhs)).to.equal(1);
              });

            });

            context("with equal normalized hour", function ()  {

              context("with inequal normalized minute", function () {

                var lhs = DateTimeValue.create({ minute: 1 });
                var rhs = DateTimeValue.create({ minute: 2 });

                it("should return -1 if LHS minute is less than RHS minute", function () {
                  expect(lhs.cmp(rhs)).to.equal(-1);
                });

                it("should return 1 if LHS minute is greater than RHS minute", function () {
                  expect(rhs.cmp(lhs)).to.equal(1);
                });

              });

              context("with equal normalized minute", function ()  {

                it("should return 0 with equal second", function () {
                  var lhs = DateTimeValue.create();
                  var rhs = DateTimeValue.create();
                  expect(lhs.cmp(rhs)).to.equal(0);
                });

                context("with inequal second", function () {

                  var lhs = DateTimeValue.create({ second: DecimalValue.parse('1') });
                  var rhs = DateTimeValue.create({ second: DecimalValue.parse('2') });

                  it("should return -1 if LHS second is less than RHS second", function () {
                    expect(lhs.cmp(rhs)).to.equal(-1);
                  });

                  it("should return 1 if LHS second is greater than RHS second", function () {
                    expect(rhs.cmp(lhs)).to.equal(1);
                  });

                });

              });

            });

          });

        });

      });

    });

  });

});
