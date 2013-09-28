/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/value/_simple',
  'sulfur/schema/value/date',
  'sulfur/schema/value/dateTime'
], function ($shared, $_simpleValue, $dateValue, $dateTimeValue) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var bind = $shared.bind;

  describe('sulfur/schema/date', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it("should be derived from sulfur/schema/value/_simple", function () {
      expect($_simpleValue).to.be.prototypeOf($dateValue);
    });

    describe('.isValidLiteral()', function () {

      it("should return true if .parse() does not throw", function () {
        sandbox.stub($dateValue, 'parse');
        expect($dateValue.isValidLiteral()).to.be.true;
      });

      it("should return false if .parse() throws", function () {
        sandbox.stub($dateValue, 'parse').throws();
        expect($dateValue.isValidLiteral()).to.be.false;
      });

    });

    describe('.parse()', function () {

      it("should accept a valid date literal", function () {
        var spy = sandbox.spy($dateValue.prototype, 'initialize');
        var dt = $dateValue.parse('0001-02-03');
        expect(spy).to.be.calledOn(dt).and.be.calledWith({
          year: 1,
          month: 2,
          day: 3
        });
      });

      it("should accept timezone Z as 00:00", function () {
        var spy = sandbox.spy($dateValue.prototype, 'initialize');
        var dt = $dateValue.parse('0001-01-01Z');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 1,
          month: 1,
          day: 1,
          tzhour: 0,
          tzminute: 0
        });
      });

      it("should accept a positive timezone", function () {
        var spy = sandbox.spy($dateValue.prototype, 'initialize');
        var dt = $dateValue.parse('0001-01-01+01:00');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 1,
          month: 1,
          day: 1,
          tzhour: 1,
          tzminute: 0
        });
      });

      it("should accept a negative timezone", function () {
        var spy = sandbox.spy($dateValue.prototype, 'initialize');
        var dt = $dateValue.parse('0001-01-01-01:00');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 1,
          month: 1,
          day: 1,
          tzhour: -1,
          tzminute: 0
        });
      });

      it("should throw an error if #initialize() throws", function () {
        sandbox.stub($dateValue.prototype, 'initialize').throws(
          new Error('invalid for testing purposes'));
        expect(bind($dateValue, 'parse', '0001-01-01'))
          .to.throw('invalid date literal "0001-01-01", error: invalid for testing purposes');
      });

      it("should reject a year with less than 4 digits", function () {
        expect(bind($dateValue, 'parse', '001-01-01'))
          .to.throw('invalid date literal "001-01-01"');
      });

      it("should reject a year with more than 4 digits", function () {
        expect(bind($dateValue, 'parse', '00001-01-01'))
          .to.throw('invalid date literal "00001-01-01"');
      });

      it("should reject a month with less than 2 digits", function () {
        expect(bind($dateValue, 'parse', '0001-1-01'))
          .to.throw('invalid date literal "0001-1-01"');
      });

      it("should reject a month with more than 2 digits", function () {
        expect(bind($dateValue, 'parse', '0001-001-01'))
          .to.throw('invalid date literal "0001-001-01"');
      });

      it("should reject a day with less than 2 digits", function () {
        expect(bind($dateValue, 'parse', '0001-01-1'))
          .to.throw('invalid date literal "0001-01-1"');
      });

      it("should reject a day with more than 2 digits", function () {
        expect(bind($dateValue, 'parse', '0001-01-001'))
          .to.throw('invalid date literal "0001-01-001"');
      });

      it("should reject a timezone hour with less than 2 digits", function () {
        expect(bind($dateValue, 'parse', '0001-01-01+1:00'))
          .to.throw('invalid date literal "0001-01-01+1:00"');
      });

      it("should reject a timezone hour with more than 2 digits", function () {
        expect(bind($dateValue, 'parse', '0001-01-01+001:00'))
          .to.throw('invalid date literal "0001-01-01+001:00"');
      });

      it("should reject a timezone minute with less than 2 digits", function () {
        expect(bind($dateValue, 'parse', '0001-01-01+01:0'))
          .to.throw('invalid date literal "0001-01-01+01:0"');
      });

      it("should reject a timezone minute with more than 2 digits", function () {
        expect(bind($dateValue, 'parse', '0001-01-01+01:000'))
          .to.throw('invalid date literal "0001-01-01+01:000"');
      });

    });

    describe('#initialize()', function () {

      it("should use 1 as default year", function () {
        var dt = $dateValue.create();
        expect(dt.getYear()).to.equal(1);
      });

      it("should use 1 as default month", function () {
        var dt = $dateValue.create();
        expect(dt.getMonth()).to.equal(1);
      });

      it("should use 1 as default day", function () {
        var dt = $dateValue.create();
        expect(dt.getDay()).to.equal(1);
      });

      it("should reject year less than 1", function () {
        expect(bind($dateValue, 'create', { year: 0 }))
          .to.throw("year must not be less than 1");
      });

      it("should reject year greater than 9999", function () {
        expect(bind($dateValue, 'create', { year: 10000 }))
          .to.throw("year must not be greater than 9999");
      });

      it("should reject non-integer year", function () {
        expect(bind($dateValue, 'create', { year: 1.2 }))
          .to.throw("year must be an integer");
      });

      it("should reject non-integer month", function () {
        expect(bind($dateValue, 'create', { month: 1.2 }))
          .to.throw("month must be an integer");
      });

      it("should reject month less than 1", function () {
        expect(bind($dateValue, 'create', { month: 0 }))
          .to.throw("month must not be less than 1");
      });

      it("should reject month greater than 12", function () {
        expect(bind($dateValue, 'create', { month: 13 }))
          .to.throw("month must not be greater than 12");
      });

      it("should reject non-integer day", function () {
        expect(bind($dateValue, 'create', { day: 1.2 }))
          .to.throw("day must be an integer");
      });

      it("should reject day less than 1", function () {
        expect(bind($dateValue, 'create', { day: 0 }))
          .to.throw("day must not be less than 1");
      });

      it("should reject day greater than 31 for month 1, 3, 5, 7, 8, 10 and 12", function () {
        [1, 3, 5, 7, 8, 10, 12].forEach(function (month) {
          expect(bind($dateValue, 'create', { monht: month, day: 32 }))
            .to.throw("day must not be greater than 31 for month 1, 3, 5, 7, 8, 10 and 12");
        });
      });

      it("should reject day greater than 30 for month 4, 6, 9 and 11", function () {
        [4, 6, 9, 11].forEach(function (month) {
          expect(bind($dateValue, 'create', { month: month, day: 31 }))
            .to.throw("day must not be greater than 30 for month 4, 6, 9 and 11");
        });
      });

      it("should reject day greater than 29 for month 2 and leap years", function () {
        expect(bind($dateValue, 'create', { year: 2000, month: 2, day: 30 }))
          .to.throw("day must not be greater than 29 for month 2 in leap years");
      });

      it("should reject day greater than 28 for month 2 and non-leap years", function () {
        expect(bind($dateValue, 'create', { year: 1900, month: 2, day: 29 }))
          .to.throw("day must not be greater than 29 for month 2 in non-leap years");
      });

      context("with a timezone", function () {

        it("should use zero for timezone hour when not given", function () {
          var dt = $dateValue.create({ tzminute: 0 });
          expect(dt).to.eql($dateValue.create({ tzhour: 0, tzminute: 0 }));
        });

        it("should use zero for timezone minute when not given", function () {
          var dt = $dateValue.create({ tzhour: 0 });
          expect(dt).to.eql($dateValue.create({ tzhour: 0, tzminute: 0 }));
        });

        it("should reject a non-integer timezone hour", function () {
          expect(bind($dateValue, 'create', { tzhour: 1.2 }))
            .to.throw("timezone hour must be an integer");
        });

        it("should reject timezone hour greater than 99", function () {
          expect(bind($dateValue, 'create', { tzhour: 100 }))
            .to.throw("timezone hour must not be greater than 99");
        });

        it("should reject timezone hour less than -99", function () {
          expect(bind($dateValue, 'create', { tzhour: -100 }))
            .to.throw("timezone hour must not be less than -99");
        });

        it("should reject a non-integer timezone minute", function () {
          expect(bind($dateValue, 'create', { tzminute: 1.2 }))
            .to.throw("timezone minute must be an integer");
        });

        it("should reject timezone minute greater than 99", function () {
          expect(bind($dateValue, 'create', { tzminute: 100 }))
            .to.throw("timezone minute must not be greater than 99");
        });

        it("should reject timezone minute less than -99", function () {
          expect(bind($dateValue, 'create', { tzminute: -100 }))
            .to.throw("timezone minute must not be less than -99");
        });

        it("should reject non-zero hour and non-zero minute with different signs", function () {
          expect(bind($dateValue, 'create', { tzhour: 1, tzminute: -30 }))
            .to.throw("timezone hour and minute must be of the same sign for a non-zero hour");
        });

        it("should adjust the day to UTC", function () {
          var dt = $dateValue.create({ day: 3, tzhour: 24 });
          var x = $dateValue.create({ day: 2, tzhour: 0 });
          expect(dt).to.eql(x);
        });

        it("should adjust the month to UTC", function () {
          var dt = $dateValue.create({ month: 1, day: 31, tzhour: -24 });
          var x = $dateValue.create({ month: 2, day: 1, tzhour: 0 });
          expect(dt).to.eql(x);
        });

        it("should adjust the year to UTC", function () {
          var dt = $dateValue.create({ year: 2, tzhour: 24 });
          var x = $dateValue.create({ year: 1, month: 12, day: 31, tzhour: 0 });
          expect(dt).to.eql(x);
        });

        it("should throw if year will be less than 1", function () {
          expect(bind($dateValue, 'create', { tzhour: 13 }))
            .to.throw("cannot normalize if year will be less than 1");
        });

        it("should throw if year will be greater than 9999", function () {
          expect(bind($dateValue, 'create', { year: 9999, month: 12, day: 31, tzhour: -13 }))
            .to.throw("cannot normalize if year will be greater than 9999");
        });

      });

    });

    describe('#getYear()', function () {

      it("should return the year", function () {
        var dt = $dateValue.create();
        expect(dt.getYear()).to.equal(1);
      });

    });

    describe('#getMonth()', function () {

      it("should return the month", function () {
        var dt = $dateValue.create();
        expect(dt.getMonth()).to.equal(1);
      });

    });

    describe('#getDay()', function () {

      it("should return the day", function () {
        var dt = $dateValue.create();
        expect(dt.getDay()).to.equal(1);
      });

    });

    describe('#toString()', function () {

      it("should pad with zeros", function () {
        var dt = $dateValue.create();
        expect(dt.toString()).to.equal('0001-01-01');
      });

      context("with a timezone", function () {

        it("should use 'Z' when UTC", function () {
          var dt = $dateValue.create({ tzhour: 0 });
          expect(dt.toString()).to.equal('0001-01-01Z');
        });

        it("should use the recoverable timezone", function () {
          var dt = $dateValue.create({ day: 2, tzhour: 14, tzminute: 17  });
          expect(dt.toString()).to.equal('0001-01-01-09:43');
        });

        it("should use '+' for a positive recoverable timezone", function () {
          var dt = $dateValue.create({ day: 2, tzhour: -14, tzminute: -17  });
          expect(dt.toString()).to.equal('0001-01-03+09:43');
        });

        it("should use '-' for a negative recoverable timezone", function () {
          var dt = $dateValue.create({ day: 2, tzhour: 14, tzminute: 17  });
          expect(dt.toString()).to.equal('0001-01-01-09:43');
        });

      });

    });

    describe('#hasTimezone()', function () {

      it("should return true if it has a timezone", function () {
        var dt = $dateValue.create({ tzhour: 0 });
        expect(dt.hasTimezone()).to.be.true;
      });

      it("should return false if it has no timezone", function () {
        var dt = $dateValue.create();
        expect(dt.hasTimezone()).to.be.false;
      });

    });

    describe('#getRecoverableTimezone()', function () {

      it("should return undefined when no timezone is defined", function () {
        var dt = $dateValue.create();
        expect(dt.getRecoverableTimezone()).to.be.undefined;
      });

      context("with a timezone", function () {

        it("should return 0/0 if already in UTC", function () {
          var dt = $dateValue.create({ tzhour: 0 });
          expect(dt.getRecoverableTimezone()).to.eql({
            hour: 0,
            minute: 0
          });
        });

        it("should return -11/-59 when timezone is -11:59", function () {
          var dt = $dateValue.create({ tzhour: -11, tzminute: -59 });
          expect(dt.getRecoverableTimezone()).to.eql({
            hour: -11,
            minute: -59
          });
        });

        it("should return 12/00 when timezone is +12:00", function () {
          var dt = $dateValue.create({ tzhour: 12 });
          expect(dt.getRecoverableTimezone()).to.eql({
            hour: 12,
            minute: 0
          });
        });

        it("should return (24:00-timezone) when timezone is greater than +12:00", function () {
          var dt = $dateValue.create({ day: 2, tzhour: 12, tzminute: 42 });
          expect(dt.getRecoverableTimezone()).to.eql({
            hour: -11,
            minute: -18
          });
        });

        it("should return (timezone+24:00) when timezone is less than -11:59", function () {
          var dt = $dateValue.create({ tzhour: -12, tzminute: -42 });
          expect(dt.getRecoverableTimezone()).to.eql({
            hour: 11,
            minute: 18
          });
        });

      });

    });

    describe('#cmp()', function () {

      it("should call sulfur/schema/dateTime#cmp() with datetimes based on both LHS' and RHS' midpoints", function () {
        var cmpSpy = sandbox.spy($dateTimeValue.prototype, 'cmp');

        var lhs = $dateValue.create({ year: 2000, month: 3, day: 17, tzhour: 5, tzminute: 13 });
        var rhs = $dateValue.create({ year: 1999, month: 12, day: 6, tzhour: -12, tzminute: -3 });

        var r = lhs.cmp(rhs);

        expect(cmpSpy).to.be.calledWith($dateTimeValue.create({
          year: 1999,
          month: 12,
          day: 6,
          hour: 12,
          tzhour: -12,
          tzminute: -3
        }));

        expect(cmpSpy.getCall(0).thisValue).to.eql($dateTimeValue.create({
          year: 2000,
          month: 3,
          day: 17,
          hour: 12,
          tzhour: 5,
          tzminute: 13
        }));

        expect(cmpSpy).to.have.returned(r);
      });

    });

    describe('#eq()', function () {

      it("should return true if #cmp() returns zero", function () {
        var lhs = $dateValue.create();
        var rhs = $dateValue.create();
        var cmpStub = sandbox.stub($dateValue.prototype, 'cmp').returns(0);
        expect(lhs.eq(rhs)).to.be.true;
        expect(cmpStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return false if #cmp() return non-zero", function () {
        var lhs = $dateValue.create();
        var rhs = $dateValue.create();
        var cmpStub = sandbox.stub($dateValue.prototype, 'cmp').returns(1);
        expect(lhs.eq(rhs)).to.be.false;
        expect(cmpStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

    describe('#lt()', function () {

      it("should return true if #cmp() returns less than zero", function () {
        var lhs = $dateValue.create();
        var rhs = $dateValue.create();
        var cmpStub = sandbox.stub($dateValue.prototype, 'cmp').returns(-1);
        expect(lhs.lt(rhs)).to.be.true;
        expect(cmpStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return false if #cmp() returns non-negative", function () {
        var lhs = $dateValue.create();
        var rhs = $dateValue.create();
        var cmpStub = sandbox.stub($dateValue.prototype, 'cmp').returns(0);
        expect(lhs.lt(rhs)).to.be.false;
        expect(cmpStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

    describe('#gt()', function () {

      it("should return true if #cmp() returns greater than zero", function () {
        var lhs = $dateValue.create();
        var rhs = $dateValue.create();
        var cmpStub = sandbox.stub($dateValue.prototype, 'cmp').returns(1);
        expect(lhs.gt(rhs)).to.be.true;
        expect(cmpStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return false if #cmp() returns non-positive", function () {
        var lhs = $dateValue.create();
        var rhs = $dateValue.create();
        var cmpStub = sandbox.stub($dateValue.prototype, 'cmp').returns(0);
        expect(lhs.gt(rhs)).to.be.false;
        expect(cmpStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

    describe('#lteq()', function () {

      it("should return false if #gt() returns true", function () {
        var lhs = $dateValue.create();
        var rhs = $dateValue.create();
        var gtStub = sandbox.stub($dateValue.prototype, 'gt').returns(true);
        expect(lhs.lteq(rhs)).to.be.false;
        expect(gtStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return true if #gt() returns false", function () {
        var lhs = $dateValue.create();
        var rhs = $dateValue.create();
        var gtStub = sandbox.stub($dateValue.prototype, 'gt').returns(false);
        expect(lhs.lteq(rhs)).to.be.true;
        expect(gtStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

    describe('#gteq()', function () {

      it("should return false if #lt() returns true", function () {
        var lhs = $dateValue.create();
        var rhs = $dateValue.create();
        var ltStub = sandbox.stub($dateValue.prototype, 'lt').returns(true);
        expect(lhs.gteq(rhs)).to.be.false;
        expect(ltStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return true if #lt() returns false", function () {
        var lhs = $dateValue.create();
        var rhs = $dateValue.create();
        var ltStub = sandbox.stub($dateValue.prototype, 'lt').returns(false);
        expect(lhs.gteq(rhs)).to.be.true;
        expect(ltStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

  });

});
