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
  'sulfur/schema/value/simple/date',
  'sulfur/schema/value/simple/dateTime',
  'sulfur/schema/value/simple/numeric'
], function (shared, DateValue, DateTimeValue, NumericValue) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/value/simple/date', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it("should be derived from sulfur/schema/value/simple/numeric", function () {
      expect(NumericValue).to.be.prototypeOf(DateValue);
    });

    describe('.parse()', function () {

      it("should ignore leading and trailing white space", function () {
        var dt = DateValue.parse('\x09\x0A\x0D 0001-01-01 \x09\x0A\x0D');
        expect(dt).to.eql(DateValue.create());
      });

      it("should accept a valid date literal", function () {
        var spy = sandbox.spy(DateValue.prototype, 'initialize');
        var dt = DateValue.parse('0001-02-03');
        expect(spy).to.be.calledOn(dt).and.be.calledWith({
          year: 1,
          month: 2,
          day: 3
        });
      });

      it("should accept timezone Z as 00:00", function () {
        var spy = sandbox.spy(DateValue.prototype, 'initialize');
        var dt = DateValue.parse('0001-01-01Z');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 1,
          month: 1,
          day: 1,
          offset: 0
        });
      });

      it("should accept a positive timezone", function () {
        var spy = sandbox.spy(DateValue.prototype, 'initialize');
        var dt = DateValue.parse('0001-01-01+01:00');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 1,
          month: 1,
          day: 1,
          offset: 60
        });
      });

      it("should accept a negative timezone", function () {
        var spy = sandbox.spy(DateValue.prototype, 'initialize');
        var dt = DateValue.parse('0001-01-01-01:00');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 1,
          month: 1,
          day: 1,
          offset: -60
        });
      });

      it("should throw an error if #initialize() throws", function () {
        sandbox.stub(DateValue.prototype, 'initialize').throws(
          new Error('invalid for testing purposes'));
        expect(bind(DateValue, 'parse', '0001-01-01'))
          .to.throw('invalid date literal "0001-01-01", error: invalid for testing purposes');
      });

      it("should reject a year with less than 4 digits", function () {
        expect(bind(DateValue, 'parse', '001-01-01'))
          .to.throw('invalid date literal "001-01-01"');
      });

      it("should reject a year with more than 4 digits", function () {
        expect(bind(DateValue, 'parse', '00001-01-01'))
          .to.throw('invalid date literal "00001-01-01"');
      });

      it("should reject a month with less than 2 digits", function () {
        expect(bind(DateValue, 'parse', '0001-1-01'))
          .to.throw('invalid date literal "0001-1-01"');
      });

      it("should reject a month with more than 2 digits", function () {
        expect(bind(DateValue, 'parse', '0001-001-01'))
          .to.throw('invalid date literal "0001-001-01"');
      });

      it("should reject a day with less than 2 digits", function () {
        expect(bind(DateValue, 'parse', '0001-01-1'))
          .to.throw('invalid date literal "0001-01-1"');
      });

      it("should reject a day with more than 2 digits", function () {
        expect(bind(DateValue, 'parse', '0001-01-001'))
          .to.throw('invalid date literal "0001-01-001"');
      });

      it("should reject a timezone hour with less than 2 digits", function () {
        expect(bind(DateValue, 'parse', '0001-01-01+1:00'))
          .to.throw('invalid date literal "0001-01-01+1:00"');
      });

      it("should reject a timezone hour with more than 2 digits", function () {
        expect(bind(DateValue, 'parse', '0001-01-01+001:00'))
          .to.throw('invalid date literal "0001-01-01+001:00"');
      });

      it("should reject a timezone minute with less than 2 digits", function () {
        expect(bind(DateValue, 'parse', '0001-01-01+01:0'))
          .to.throw('invalid date literal "0001-01-01+01:0"');
      });

      it("should reject a timezone minute with more than 2 digits", function () {
        expect(bind(DateValue, 'parse', '0001-01-01+01:000'))
          .to.throw('invalid date literal "0001-01-01+01:000"');
      });

    });

    describe('#initialize()', function () {

      it("should use 1 as default year", function () {
        var dt = DateValue.create();
        expect(dt.year).to.equal(1);
      });

      it("should use 1 as default month", function () {
        var dt = DateValue.create();
        expect(dt.month).to.equal(1);
      });

      it("should use 1 as default day", function () {
        var dt = DateValue.create();
        expect(dt.day).to.equal(1);
      });

      it("should reject year less than 1", function () {
        expect(bind(DateValue, 'create', { year: 0 }))
          .to.throw("year must not be less than 1");
      });

      it("should reject year greater than 9999", function () {
        expect(bind(DateValue, 'create', { year: 10000 }))
          .to.throw("year must not be greater than 9999");
      });

      it("should reject non-integer year", function () {
        expect(bind(DateValue, 'create', { year: 1.2 }))
          .to.throw("year must be an integer");
      });

      it("should reject non-integer month", function () {
        expect(bind(DateValue, 'create', { month: 1.2 }))
          .to.throw("month must be an integer");
      });

      it("should reject month less than 1", function () {
        expect(bind(DateValue, 'create', { month: 0 }))
          .to.throw("month must not be less than 1");
      });

      it("should reject month greater than 12", function () {
        expect(bind(DateValue, 'create', { month: 13 }))
          .to.throw("month must not be greater than 12");
      });

      it("should reject non-integer day", function () {
        expect(bind(DateValue, 'create', { day: 1.2 }))
          .to.throw("day must be an integer");
      });

      it("should reject day less than 1", function () {
        expect(bind(DateValue, 'create', { day: 0 }))
          .to.throw("day must not be less than 1");
      });

      it("should reject day greater than 31 for month 1, 3, 5, 7, 8, 10 and 12", function () {
        [1, 3, 5, 7, 8, 10, 12].forEach(function (month) {
          expect(bind(DateValue, 'create', { monht: month, day: 32 }))
            .to.throw("day must not be greater than 31 for month 1, 3, 5, 7, 8, 10 and 12");
        });
      });

      it("should reject day greater than 30 for month 4, 6, 9 and 11", function () {
        [4, 6, 9, 11].forEach(function (month) {
          expect(bind(DateValue, 'create', { month: month, day: 31 }))
            .to.throw("day must not be greater than 30 for month 4, 6, 9 and 11");
        });
      });

      it("should reject day greater than 29 for month 2 and leap years", function () {
        expect(bind(DateValue, 'create', { year: 2000, month: 2, day: 30 }))
          .to.throw("day must not be greater than 29 for month 2 in leap years");
      });

      it("should reject day greater than 28 for month 2 and non-leap years", function () {
        expect(bind(DateValue, 'create', { year: 1900, month: 2, day: 29 }))
          .to.throw("day must not be greater than 29 for month 2 in non-leap years");
      });

      context("with a timezone", function () {

        it("should reject a non-integer timezone offset", function () {
          expect(bind(DateValue, 'create', { offset: 1.2 }))
            .to.throw("timezone offset must be an integer");
        });

        it("should adjust the day to UTC", function () {
          var dt = DateValue.create({ day: 3, offset: 24 * 60 });
          var x = DateValue.create({ day: 2, offset: 0 });
          expect(dt).to.eql(x);
        });

        it("should adjust the month to UTC", function () {
          var dt = DateValue.create({ month: 1, day: 31, offset: -24 * 60 });
          var x = DateValue.create({ month: 2, day: 1, offset: 0 });
          expect(dt).to.eql(x);
        });

        it("should adjust the year to UTC", function () {
          var dt = DateValue.create({ year: 2, offset: 24 * 60 });
          var x = DateValue.create({ year: 1, month: 12, day: 31, offset: 0 });
          expect(dt).to.eql(x);
        });

        it("should throw if year will be less than 1", function () {
          expect(bind(DateValue, 'create', { offset: 13 * 60 }))
            .to.throw("cannot normalize if year will be less than 1");
        });

        it("should throw if year will be greater than 9999", function () {
          expect(bind(DateValue, 'create', { year: 9999, month: 12, day: 31, offset: -13 * 60 }))
            .to.throw("cannot normalize if year will be greater than 9999");
        });

      });

    });

    describe('#year', function () {

      it("should return the year", function () {
        var dt = DateValue.create();
        expect(dt.year).to.equal(1);
      });

    });

    describe('#month', function () {

      it("should return the month", function () {
        var dt = DateValue.create();
        expect(dt.month).to.equal(1);
      });

    });

    describe('#day', function () {

      it("should return the day", function () {
        var dt = DateValue.create();
        expect(dt.day).to.equal(1);
      });

    });

    describe('#toString()', function () {

      it("should pad year to 4 digits", function () {
        var dt = DateValue.create();
        expect(dt.toString()).to.equal('0001-01-01');
        dt = DateValue.create({ year: 1000 });
        expect(dt.toString()).to.equal('1000-01-01');
      });

      it("should pad month to 2 digits", function () {
        var dt = DateValue.create();
        expect(dt.toString()).to.equal('0001-01-01');
        dt = DateValue.create({ month: 10 });
        expect(dt.toString()).to.equal('0001-10-01');
      });

      it("should pad day to 2 digits", function () {
        var dt = DateValue.create();
        expect(dt.toString()).to.equal('0001-01-01');
        dt = DateValue.create({ day: 10 });
        expect(dt.toString()).to.equal('0001-01-10');
      });

      context("with a timezone", function () {

        it("should use 'Z' when UTC", function () {
          var dt = DateValue.create({ offset: 0 });
          expect(dt.toString()).to.equal('0001-01-01Z');
        });

        it("should use the recoverable timezone", function () {
          var dt = DateValue.create({ day: 2, offset: 14 * 60 + 17  });
          expect(dt.toString()).to.equal('0001-01-01-09:43');
        });

        it("should use '+' for a positive recoverable timezone", function () {
          var dt = DateValue.create({ day: 2, offset: -(14 * 60 + 17) });
          expect(dt.toString()).to.equal('0001-01-03+09:43');
        });

        it("should use '-' for a negative recoverable timezone", function () {
          var dt = DateValue.create({ day: 2, offset: 14 * 60 + 17  });
          expect(dt.toString()).to.equal('0001-01-01-09:43');
        });

      });

    });

    describe('#hasTimezone()', function () {

      it("should return true if it has a timezone", function () {
        var dt = DateValue.create({ offset: 0 });
        expect(dt.hasTimezone()).to.be.true;
      });

      it("should return false if it has no timezone", function () {
        var dt = DateValue.create();
        expect(dt.hasTimezone()).to.be.false;
      });

    });

    describe('#getRecoverableTimezone', function () {

      it("should return undefined when no timezone is defined", function () {
        var dt = DateValue.create();
        expect(dt.getRecoverableTimezone()).to.be.undefined;
      });

      context("with a timezone", function () {

        it("should return 0/0 if already in UTC", function () {
          var dt = DateValue.create({ offset: 0 });
          expect(dt.getRecoverableTimezone()).to.eql({
            hour: 0,
            minute: 0
          });
        });

        it("should return -11/-59 when timezone is -11:59", function () {
          var dt = DateValue.create({ offset: -(11 * 60 + 59) });
          expect(dt.getRecoverableTimezone()).to.eql({
            hour: -11,
            minute: -59
          });
        });

        it("should return 12/00 when timezone is +12:00", function () {
          var dt = DateValue.create({ offset: 12 * 60 });
          expect(dt.getRecoverableTimezone()).to.eql({
            hour: 12,
            minute: 0
          });
        });

        it("should return (24:00-timezone) when timezone is greater than +12:00", function () {
          var dt = DateValue.create({ day: 2, offset: 12 * 60 + 42 });
          expect(dt.getRecoverableTimezone()).to.eql({
            hour: -11,
            minute: -18
          });
        });

        it("should return (timezone+24:00) when timezone is less than -11:59", function () {
          var dt = DateValue.create({ offset: -(12 * 60 + 42) });
          expect(dt.getRecoverableTimezone()).to.eql({
            hour: 11,
            minute: 18
          });
        });

      });

    });

    describe('#cmp()', function () {

      it("should call sulfur/schema/dateTime#cmp() with datetimes based on both LHS' and RHS' midpoints", function () {
        var cmp = sandbox.spy(DateTimeValue.prototype, 'cmp');

        var lhs = DateValue.create({ year: 2000, month: 3, day: 17, offset: 5 * 60 + 13 });
        var rhs = DateValue.create({ year: 1999, month: 12, day: 6, offset: -(12 * 60 + 3) });

        var r = lhs.cmp(rhs);

        expect(cmp).to.be.calledWith(DateTimeValue.create({
          year: 1999,
          month: 12,
          day: 6,
          hour: 12,
          offset: -(12 * 60 + 3)
        }));

        expect(cmp.getCall(0).thisValue).to.eql(DateTimeValue.create({
          year: 2000,
          month: 3,
          day: 17,
          hour: 12,
          offset: 5 * 60 + 13
        }));

        expect(cmp).to.have.returned(r);
      });

    });

  });

});
