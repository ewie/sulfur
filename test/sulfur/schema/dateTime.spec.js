/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/dateTime',
  'sulfur/schema/decimal'
], function ($shared, $dateTime, $decimal) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var bind = $shared.bind;

  describe('sulfur/schema/dateTime', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('.isValidLiteral()', function () {

      it("should return true if .parse() does not throw", function () {
        sandbox.stub($dateTime, 'parse');
        expect($dateTime.isValidLiteral()).to.be.true;
      });

      it("should return false if .parse() throws", function () {
        sandbox.stub($dateTime, 'parse').throws();
        expect($dateTime.isValidLiteral()).to.be.false;
      });

    });

    describe('.parse()', function () {

      it("should accept a valid datetime literal", function () {
        var spy = sandbox.spy($dateTime.prototype, 'initialize');
        var dt = $dateTime.parse('0001-02-03T04:05:06.789');
        expect(spy).to.be.calledOn(dt).and.be.calledWith({
          year: 1,
          month: 2,
          day: 3,
          hour: 4,
          minute: 5,
          second: $decimal.parse('6.789')
        });
      });

      it("should accept a second with fractional part", function () {
        var spy = sandbox.spy($dateTime.prototype, 'initialize');
        var dt = $dateTime.parse('0001-01-01T00:00:00.123');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 1,
          month: 1,
          day: 1,
          hour: 0,
          minute: 0,
          second: $decimal.parse('0.123')
        });
      });

      it("should accept time zone Z as 00:00", function () {
        var spy = sandbox.spy($dateTime.prototype, 'initialize');
        var dt = $dateTime.parse('0001-01-01T00:00:00Z');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 1,
          month: 1,
          day: 1,
          hour: 0,
          minute: 0,
          second: $decimal.create(),
          tzhour: 0,
          tzminute: 0
        });
      });

      it("should accept a positive time zone", function () {
        var spy = sandbox.spy($dateTime.prototype, 'initialize');
        var dt = $dateTime.parse('0001-01-01T00:00:00+01:00');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 1,
          month: 1,
          day: 1,
          hour: 0,
          minute: 0,
          second: $decimal.create(),
          tzhour: 1,
          tzminute: 0
        });
      });

      it("should accept a negative time zone", function () {
        var spy = sandbox.spy($dateTime.prototype, 'initialize');
        var dt = $dateTime.parse('0001-01-01T00:00:00-01:00');
        expect(spy).to.be.calledOn(dt).and.calledWith({
          year: 1,
          month: 1,
          day: 1,
          hour: 0,
          minute: 0,
          second: $decimal.create(),
          tzhour: -1,
          tzminute: 0
        });
      });

      it("should throw an error if #initialize() throws", function () {
        sandbox.stub($dateTime.prototype, 'initialize').throws(new Error('invalid for testing purposes'));
        expect(bind($dateTime, 'parse', '0001-01-01T00:00:00'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:00", error: invalid for testing purposes');
      });

      it("should reject a year with less than 4 digits", function () {
        expect(bind($dateTime, 'parse', '001-01-01T00:00:00'))
          .to.throw('invalid datetime literal "001-01-01T00:00:00"');
      });

      it("should reject a year with more than 4 digits", function () {
        expect(bind($dateTime, 'parse', '00001-01-01T00:00:00'))
          .to.throw('invalid datetime literal "00001-01-01T00:00:00"');
      });

      it("should reject a month with less than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-1-01T00:00:00'))
          .to.throw('invalid datetime literal "0001-1-01T00:00:00"');
      });

      it("should reject a month with more than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-001-01T00:00:00'))
          .to.throw('invalid datetime literal "0001-001-01T00:00:00"');
      });

      it("should reject a day with less than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-01-1T00:00:00'))
          .to.throw('invalid datetime literal "0001-01-1T00:00:00"');
      });

      it("should reject a day with more than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-01-001T00:00:00'))
          .to.throw('invalid datetime literal "0001-01-001T00:00:00"');
      });

      it("should reject an hour with less than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-01-01T0:00:00'))
          .to.throw('invalid datetime literal "0001-01-01T0:00:00"');
      });

      it("should reject an hour with more than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-01-01T000:00:00'))
          .to.throw('invalid datetime literal "0001-01-01T000:00:00"');
      });

      it("should reject a minute with less than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-01-01T00:0:00'))
          .to.throw('invalid datetime literal "0001-01-01T00:0:00"');
      });

      it("should reject a minute with more than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-01-01T00:000:00'))
          .to.throw('invalid datetime literal "0001-01-01T00:000:00"');
      });

      it("should reject a second with less than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-01-01T00:00:0'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:0"');
      });

      it("should reject a second with more than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-01-01T00:00:000'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:000"');
      });

      it("should reject a time zone hour with less than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-01-01T00:00:00+1:00'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:00+1:00"');
      });

      it("should reject a time zone hour with more than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-01-01T00:00:00+001:00'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:00+001:00"');
      });

      it("should reject a time zone minute with less than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-01-01T00:00:00+01:0'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:00+01:0"');
      });

      it("should reject a time zone minute with more than 2 digits", function () {
        expect(bind($dateTime, 'parse', '0001-01-01T00:00:00+01:000'))
          .to.throw('invalid datetime literal "0001-01-01T00:00:00+01:000"');
      });

    });

    describe('#initialize()', function () {

      it("should use 1 as default year", function () {
        var dt = $dateTime.create();
        expect(dt.year).to.equal(1);
      });

      it("should use 1 as default month", function () {
        var dt = $dateTime.create();
        expect(dt.month).to.equal(1);
      });

      it("should use 1 as default day", function () {
        var dt = $dateTime.create();
        expect(dt.day).to.equal(1);
      });

      it("should use zero as default hour", function () {
        var dt = $dateTime.create();
        expect(dt.hour).to.equal(0);
      });

      it("should use zero as default minute", function () {
        var dt = $dateTime.create();
        expect(dt.minute).to.equal(0);
      });

      it("should use zero as default second", function () {
        var dt = $dateTime.create();
        expect(dt.second).to.eql($decimal.parse('0'));
      });

      it("should reject year less than 1", function () {
        expect(bind($dateTime, 'create', { year: 0 }))
          .to.throw("year must not be less than 1");
      });

      it("should reject year greater than 9999", function () {
        expect(bind($dateTime, 'create', { year: 10000 }))
          .to.throw("year must not be greater than 9999");
      });

      it("should reject non-integer year", function () {
        expect(bind($dateTime, 'create', { year: 1.2 }))
          .to.throw("year must be an integer");
      });

      it("should reject non-integer month", function () {
        expect(bind($dateTime, 'create', { month: 1.2 }))
          .to.throw("month must be an integer");
      });

      it("should reject month less than 1", function () {
        expect(bind($dateTime, 'create', { month: 0 }))
          .to.throw("month must not be less than 1");
      });

      it("should reject month greater than 12", function () {
        expect(bind($dateTime, 'create', { month: 13 }))
          .to.throw("month must not be greater than 12");
      });

      it("should reject non-integer day", function () {
        expect(bind($dateTime, 'create', { day: 1.2 }))
          .to.throw("day must be an integer");
      });

      it("should reject day less than 1", function () {
        expect(bind($dateTime, 'create', { day: 0 }))
          .to.throw("day must not be less than 1");
      });

      it("should reject day greater than 31 for month 1, 3, 5, 7, 8, 10 and 12", function () {
        [1, 3, 5, 7, 8, 10, 12].forEach(function (month) {
          expect(bind($dateTime, 'create', { monht: month, day: 32 }))
            .to.throw("day must not be greater than 31 for month 1, 3, 5, 7, 8, 10 and 12");
        });
      });

      it("should reject day greater than 30 for month 4, 6, 9 and 11", function () {
        [4, 6, 9, 11].forEach(function (month) {
          expect(bind($dateTime, 'create', { month: month, day: 31 }))
            .to.throw("day must not be greater than 30 for month 4, 6, 9 and 11");
        });
      });

      it("should reject day greater than 29 for month 2 and leap years", function () {
        expect(bind($dateTime, 'create', { year: 2000, month: 2, day: 30 }))
          .to.throw("day must not be greater than 29 for month 2 in leap years");
      });

      it("should reject day greater than 28 for month 2 and non-leap years", function () {
        expect(bind($dateTime, 'create', { year: 1900, month: 2, day: 29 }))
          .to.throw("day must not be greater than 29 for month 2 in non-leap years");
      });

      it("should reject non-integer hour", function () {
        expect(bind($dateTime, 'create', { hour: 1.2 }))
          .to.throw("hour must be an integer");
      });

      it("should reject negative hour", function () {
        expect(bind($dateTime, 'create', { hour: -1 }))
          .to.throw("hour must be non-negative");
      });

      it("should reject hour greater than 23", function () {
        expect(bind($dateTime, 'create', { hour: 24 }))
          .to.throw("hour must not be greater than 23");
      });

      it("should reject non-integer minute", function () {
        expect(bind($dateTime, 'create', { minute: 1.2 }))
          .to.throw("minute must be an integer");
      });

      it("should reject negative minute", function () {
        expect(bind($dateTime, 'create', { minute: -1 }))
          .to.throw("minute must be non-negative");
      });

      it("should reject minute greater than 59", function () {
        expect(bind($dateTime, 'create', { minute: 60 }))
          .to.throw("minute must not be greater than 59");
      });

      it("should reject non-decimal second", function () {
        expect(bind($dateTime, 'create', { second: 0 }))
          .to.throw("second must be a decimal");
      });

      it("should reject a negative second", function () {
        expect(bind($dateTime, 'create', { second: $decimal.parse('-1') }))
          .to.throw("second must be non-negative");
      });

      it("should reject a second greater than or equal to 60", function () {
        expect(bind($dateTime, 'create', { second: $decimal.parse('60') }))
          .to.throw("second must not be greater than or equal to 60");
      });

      context("with a time zone", function () {

        it("should use zero for time zone hour when not given", function () {
          var dt = $dateTime.create({ tzminute: 0 });
          expect(dt.tzhour).to.equal(0);
        });

        it("should use zero for time zone minute when not given", function () {
          var dt = $dateTime.create({ tzhour: 0 });
          expect(dt.tzminute).to.equal(0);
        });

        it("should reject time zone hour greater than 14", function () {
          expect(bind($dateTime, 'create', { tzhour: 15 }))
            .to.throw("time zone hour must not be greater than 14");
        });

        it("should reject time zone hour less than -14", function () {
          expect(bind($dateTime, 'create', { tzhour: -15 }))
            .to.throw("time zone hour must not be less than -14");
        });

        it("should reject time zone minute greater than 59", function () {
          expect(bind($dateTime, 'create', { tzminute: 60 }))
            .to.throw("time zone minute must not be greater than 59");
        });

        it("should reject time zone minute less than -59", function () {
          expect(bind($dateTime, 'create', { tzminute: -60 }))
            .to.throw("time zone minute must not be less than -59");
        });

        it("should reject non-zero hour and non-zero minute with different signs", function () {
          expect(bind($dateTime, 'create', { tzhour: 1, tzminute: -30 }))
            .to.throw("time zone hour and minute must be of the same sign for a non-zero hour");
        });

        it("should reject a time zone greater than +14:00", function () {
          expect(bind($dateTime, 'create', { tzhour: 14, tzminute: 1 }))
            .to.throw("time zone must not be greater than +14:00");
        });

        it("should reject a time zone less than -14:00", function () {
          expect(bind($dateTime, 'create', { tzhour: -14, tzminute: 1 }))
            .to.throw("time zone must not be less than -14:00");
        });

      });

    });

    describe('#toLiteral()', function () {

      it("should pad with zeros", function () {
        var dt = $dateTime.create();
        expect(dt.toLiteral()).to.equal('0001-01-01T00:00:00');
      });

      it("should include the second's fractional part", function () {
        var dt = $dateTime.create({ second: $decimal.parse('1.2') });
        expect(dt.toLiteral()).to.equal('0001-01-01T00:00:01.2');
      });

      context("with time zone", function () {

        it("should use 'Z' when UTC", function () {
          var dt = $dateTime.create({ tzhour: 0 });
          expect(dt.toLiteral()).to.equal('0001-01-01T00:00:00Z');
        });

        it("should use '+' for a positive time zone hour", function () {
          var dt = $dateTime.create({ tzhour: 1 });
          expect(dt.toLiteral()).to.equal('0001-01-01T00:00:00+01:00');
        });

        it("should use '-' for a negative time zone hour", function () {
          var dt = $dateTime.create({ tzhour: -1 });
          expect(dt.toLiteral()).to.equal('0001-01-01T00:00:00-01:00');
        });

        it("should use '+' for a positive time zone minute", function () {
          var dt = $dateTime.create({ tzminute: 1 });
          expect(dt.toLiteral()).to.equal('0001-01-01T00:00:00+00:01');
        });

        it("should use '-' for a negative time zone minute", function () {
          var dt = $dateTime.create({ tzminute: -1 });
          expect(dt.toLiteral()).to.equal('0001-01-01T00:00:00-00:01');
        });

        it("should pad time zone hour and minute with a zero to 2 digits", function () {
          var dt = $dateTime.create({ tzhour: 1 });
          expect(dt.toLiteral()).to.equal('0001-01-01T00:00:00+01:00');
        });

      });

    });

    describe('#toCanonicalLiteral()', function () {

      it("should call #toLiteral() on the result if #normalize()", function () {
        var dt = $dateTime.create();
        var normalizeSpy = sandbox.spy($dateTime.prototype, 'normalize');
        var toLiteralSpy = sandbox.spy($dateTime.prototype, 'toLiteral');
        var r = dt.toCanonicalLiteral();
        expect(normalizeSpy).to.be.calledOn(dt);
        expect(toLiteralSpy)
          .to.be.calledOn(normalizeSpy.getCall(0).returnValue)
          .and
          .to.have.returned(r);
      });

    });

    describe('#hasTimeZone()', function () {

      it("should return true if it has a time zone", function () {
        var dt = $dateTime.create({ tzhour: 0 });
        expect(dt.hasTimeZone()).to.be.true;
      });

      it("should return false if it has no time zone", function () {
        var dt = $dateTime.create();
        expect(dt.hasTimeZone()).to.be.false;
      });

    });

    describe('#isZulu()', function () {

      it("should return false if it has no timezone", function () {
        var dt = $dateTime.create();
        expect(dt.isZulu()).to.be.false;
      });

      context("with a time zone", function () {

        it("should return true if hour and minute are both zero", function () {
          var dt = $dateTime.create({ tzhour: 0 });
          expect(dt.isZulu()).to.be.true;
        });

        it("should return false if hour is non-zero", function () {
          var dt = $dateTime.create({ tzhour: 1 });
          expect(dt.isZulu()).to.be.false;
        });

        it("should return false if minute is non-zero", function () {
          var dt = $dateTime.create({ tzminute: 1 });
          expect(dt.isZulu()).to.be.false;
        });

      });

    });

    describe('#normalize()', function () {

      it("should return this if there's no time zone", function () {
        var dt = $dateTime.create();
        var r = dt.normalize();
        expect(r).to.equal(dt);
      });

      context("with a time zone", function () {

        it("should return this if already in UTC", function () {
          var dt = $dateTime.create({ tzhour: 0 });
          var r = dt.normalize();
          expect(r).to.equal(dt);
        });

        it("should adjust the minute", function () {
          var dt = $dateTime.create({ minute: 35, tzminute: 30 });
          var r = dt.normalize();
          var x = $dateTime.create({ minute: 5, tzhour: 0 });
          expect(r).to.eql(x);
        });

        it("should adjust the hour", function () {
          var dt = $dateTime.create({ hour: 7, tzhour: 3 });
          var r = dt.normalize();
          var x = $dateTime.create({ hour: 4, tzhour: 0 });
          expect(r).to.eql(x);
        });

        it("should adjust the day", function () {
          var dt = $dateTime.create({ day: 3, hour: 4, tzhour: 5 });
          var r = dt.normalize();
          var x = $dateTime.create({ day: 2, hour: 23, tzhour: 0 });
          expect(r).to.eql(x);
        });

        it("should adjust the month", function () {
          var dt = $dateTime.create({ month: 1, day: 31, hour: 23, tzhour: -2 });
          var r = dt.normalize();
          var x = $dateTime.create({ month: 2, day: 1, hour: 1, tzhour: 0 });
          expect(r).to.eql(x);
        });

        it("should adjust the year", function () {
          var dt = $dateTime.create({ year: 2, hour: 1, tzhour: 2 });
          var r = dt.normalize();
          var x = $dateTime.create({ year: 1, month: 12, day: 31, hour: 23, tzhour: 0 });
          expect(r).to.eql(x);
        });

        it("should throw if year will be less than 1", function () {
          var dt = $dateTime.create({ tzhour: 1 });
          expect(bind(dt, 'normalize'))
            .to.throw("cannot normalize if year will be less than 1");
        });

        it("should throw if year will be greater than 9999", function () {
          var dt = $dateTime.create({ year: 9999, month: 12, day: 31, hour: 23, tzhour: -1 });
          expect(bind(dt, 'normalize'))
            .to.throw("cannot normalize if year will be greater than 9999");
        });

      });

    });

    describe('#cmp()', function () {

      context("when the LHS has a time zone", function () {

        context("when the RHS has a time zone", function () {

          it("should call #cmp() on the normalized LHS passing the normalized RHS", function () {
            var lhs = $dateTime.create({ year: 1000, tzhour: 1 });
            var rhs = $dateTime.create({ year: 1000, tzhour: 2 });
            var normalizeSpy = sandbox.spy($dateTime.prototype, 'normalize');
            var cmpSpy = sandbox.spy($dateTime.prototype, 'cmp');
            var result = lhs.cmp(rhs);
            expect(normalizeSpy).to.be.calledTwice;
            expect(normalizeSpy.getCall(0).thisValue).to.equal(lhs);
            expect(normalizeSpy.getCall(1).thisValue).to.equal(rhs);
            expect(cmpSpy).to.be.calledOn(normalizeSpy.getCall(0).returnValue)
              .and.calledWith(normalizeSpy.getCall(1).returnValue)
              .and.to.have.returned(result);
          });

          context("when LHS and RHS are both in UTC", function () {

            context("with inequal year", function () {

              var lhs = $dateTime.create({ year: 1, tzhour: 0 });
              var rhs = $dateTime.create({ year: 2, tzhour: 0 });

              it("should return -1 if LHS year is less than RHS year", function () {
                expect(lhs.cmp(rhs)).to.equal(-1);
              });

              it("should return 1 if LHS year is greater than RHS year", function () {
                expect(rhs.cmp(lhs)).to.equal(1);
              });

            });

            context("with equal year", function ()  {

              context("with inequal month", function () {

                var lhs = $dateTime.create({ month: 1, tzhour: 0 });
                var rhs = $dateTime.create({ month: 2, tzhour: 0 });

                it("should return -1 if LHS month is less than RHS month", function () {
                  expect(lhs.cmp(rhs)).to.equal(-1);
                });

                it("should return 1 if LHS month is greater than RHS month", function () {
                  expect(rhs.cmp(lhs)).to.equal(1);
                });

              });

              context("with equal month", function ()  {

                context("with inequal day", function () {

                  var lhs = $dateTime.create({ day: 1, tzhour: 0 });
                  var rhs = $dateTime.create({ day: 2, tzhour: 0 });

                  it("should return -1 if LHS day is less than RHS day", function () {
                    expect(lhs.cmp(rhs)).to.equal(-1);
                  });

                  it("should return 1 if LHS day is greater than RHS month", function () {
                    expect(rhs.cmp(lhs)).to.equal(1);
                  });

                });

                context("with equal day", function ()  {

                  context("with inequal hour", function () {

                    var lhs = $dateTime.create({ hour: 1, tzhour: 0 });
                    var rhs = $dateTime.create({ hour: 2, tzhour: 0 });

                    it("should return -1 if LHS hour is less than RHS hour", function () {
                      expect(lhs.cmp(rhs)).to.equal(-1);
                    });

                    it("should return 1 if LHS hour is greater than RHS hour", function () {
                      expect(rhs.cmp(lhs)).to.equal(1);
                    });

                  });

                  context("with equal hour", function ()  {

                    context("with inequal minute", function () {

                      var lhs = $dateTime.create({ minute: 1, tzhour: 0 });
                      var rhs = $dateTime.create({ minute: 2, tzhour: 0 });

                      it("should return -1 if LHS minute is less than RHS minute", function () {
                        expect(lhs.cmp(rhs)).to.equal(-1);
                      });

                      it("should return 1 if LHS minute is greater than RHS minute", function () {
                        expect(rhs.cmp(lhs)).to.equal(1);
                      });

                    });

                    context("with equal minute", function ()  {

                      it("should return 0 with equal second", function () {
                        var lhs = $dateTime.create({ tzhour: 0 });
                        var rhs = $dateTime.create({ tzhour: 0 });
                        expect(lhs.cmp(rhs)).to.equal(0);
                      });

                      context("with inequal second", function () {

                        var lhs = $dateTime.create({ second: $decimal.parse('1'), tzhour: 0 });
                        var rhs = $dateTime.create({ second: $decimal.parse('2'), tzhour: 0 });

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

        context("when the RHS has no time zone", function () {

          it("should return -1 if LHS is less than RHS+14:00", function () {
            var lhs = $dateTime.create({ year: 2000, tzhour: 0 });
            var rhs = $dateTime.create({ year: 2000, hour: 15 });
            expect(lhs.cmp(rhs)).to.equal(-1);
          });

          it("should return 1 if LHS is greater than or equal to RHS+14:00 and greater than RHS-14:00", function () {
            var lhs = $dateTime.create({ year: 2000, hour: 15, tzhour: 0 });
            var rhs = $dateTime.create({ year: 2000 });
            expect(lhs.cmp(rhs)).to.equal(1);
          });

          it("should return undefined if RHS+14:00 < LHS < RHS-14:00", function () {
            var lhs = $dateTime.create({ year: 2000, tzhour: 0 });
            var rhs = $dateTime.create({ year: 2000 });
            expect(lhs.cmp(rhs)).to.be.undefined;
          });

        });

      });

      context("when the LHS has no time zone", function () {

        context("when the RHS has a time zone", function () {

          it("should return -1 if LHS-14:00 is less than RHS", function () {
            var lhs = $dateTime.create({ year: 2000 });
            var rhs = $dateTime.create({ year: 2000, hour: 15, tzhour: 0 });
            expect(lhs.cmp(rhs)).to.equal(-1);
          });

          it("should return 1 if LHS-14:00 is greater than or equal RHS and LHS+14:00 is greater than RHS", function () {
            var lhs = $dateTime.create({ year: 2000, hour: 15 });
            var rhs = $dateTime.create({ year: 2000, tzhour: 0 });
            expect(lhs.cmp(rhs)).to.equal(1);
          });

          it("should return undefined if LHS+14:00 < RHS < LHS-14:00", function () {
            var lhs = $dateTime.create({ year: 2000 });
            var rhs = $dateTime.create({ year: 2000, tzhour: 0 });
            expect(lhs.cmp(rhs)).to.be.undefined;
          });

        });

        context("when the RHS has no time zone", function () {

          context("with inequal year", function () {

            var lhs = $dateTime.create({ year: 1 });
            var rhs = $dateTime.create({ year: 2 });

            it("should return -1 if LHS year is less than RHS year", function () {
              expect(lhs.cmp(rhs)).to.equal(-1);
            });

            it("should return 1 if LHS year is greater than RHS year", function () {
              expect(rhs.cmp(lhs)).to.equal(1);
            });

          });

          context("with equal year", function ()  {

            context("with inequal month", function () {

              var lhs = $dateTime.create({ month: 1 });
              var rhs = $dateTime.create({ month: 2 });

              it("should return -1 if LHS month is less than RHS month", function () {
                expect(lhs.cmp(rhs)).to.equal(-1);
              });

              it("should return 1 if LHS month is greater than RHS month", function () {
                expect(rhs.cmp(lhs)).to.equal(1);
              });

            });

            context("with equal month", function ()  {

              context("with inequal day", function () {

                var lhs = $dateTime.create({ day: 1 });
                var rhs = $dateTime.create({ day: 2 });

                it("should return -1 if LHS day is less than RHS day", function () {
                  expect(lhs.cmp(rhs)).to.equal(-1);
                });

                it("should return 1 if LHS day is greater than RHS month", function () {
                  expect(rhs.cmp(lhs)).to.equal(1);
                });

              });

              context("with equal day", function ()  {

                context("with inequal hour", function () {

                  var lhs = $dateTime.create({ hour: 1 });
                  var rhs = $dateTime.create({ hour: 2 });

                  it("should return -1 if LHS hour is less than RHS hour", function () {
                    expect(lhs.cmp(rhs)).to.equal(-1);
                  });

                  it("should return 1 if LHS hour is greater than RHS hour", function () {
                    expect(rhs.cmp(lhs)).to.equal(1);
                  });

                });

                context("with equal hour", function ()  {

                  context("with inequal minute", function () {

                    var lhs = $dateTime.create({ minute: 1 });
                    var rhs = $dateTime.create({ minute: 2 });

                    it("should return -1 if LHS minute is less than RHS minute", function () {
                      expect(lhs.cmp(rhs)).to.equal(-1);
                    });

                    it("should return 1 if LHS minute is greater than RHS minute", function () {
                      expect(rhs.cmp(lhs)).to.equal(1);
                    });

                  });

                  context("with equal minute", function ()  {

                    it("should return 0 with equal second", function () {
                      var lhs = $dateTime.create();
                      var rhs = $dateTime.create();
                      expect(lhs.cmp(rhs)).to.equal(0);
                    });

                    context("with inequal second", function () {

                      var lhs = $dateTime.create({ second: $decimal.parse('1') });
                      var rhs = $dateTime.create({ second: $decimal.parse('2') });

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

    describe('#eq()', function () {

      it("should return true if #cmp() returns zero", function () {
        var lhs = $dateTime.create();
        var rhs = $dateTime.create();
        sandbox.stub($dateTime.prototype, 'cmp').returns(0);
        expect(lhs.eq(rhs)).to.be.true;
      });

      it("should return false if #cmp() return non-zero", function () {
        var lhs = $dateTime.create();
        var rhs = $dateTime.create();
        sandbox.stub($dateTime.prototype, 'cmp').returns(1);
        expect(lhs.eq(rhs)).to.be.false;
      });

    });

    describe('#lt()', function () {

      it("should return true if #cmp() returns less than zero", function () {
        var lhs = $dateTime.create();
        var rhs = $dateTime.create();
        sandbox.stub($dateTime.prototype, 'cmp').returns(-1);
        expect(lhs.lt(rhs)).to.be.true;
      });

      it("should return false if #cmp() returns non-negative", function () {
        var lhs = $dateTime.create();
        var rhs = $dateTime.create();
        sandbox.stub($dateTime.prototype, 'cmp').returns(0);
        expect(lhs.lt(rhs)).to.be.false;
      });

    });

    describe('#gt()', function () {

      it("should return true if #cmp() returns greater than zero", function () {
        var lhs = $dateTime.create();
        var rhs = $dateTime.create();
        sandbox.stub($dateTime.prototype, 'cmp').returns(1);
        expect(lhs.gt(rhs)).to.be.true;
      });

      it("should return false if #cmp() returns non-positive", function () {
        var lhs = $dateTime.create();
        var rhs = $dateTime.create();
        sandbox.stub($dateTime.prototype, 'cmp').returns(0);
        expect(lhs.gt(rhs)).to.be.false;
      });

    });

    describe('#lteq()', function () {

      it("should return false if #gt() returns true", function () {
        var lhs = $dateTime.create();
        var rhs = $dateTime.create();
        sandbox.stub($dateTime.prototype, 'gt').returns(true);
        expect(lhs.lteq(rhs)).to.be.false;
      });

      it("should return true if #gt() returns false", function () {
        var lhs = $dateTime.create();
        var rhs = $dateTime.create();
        sandbox.stub($dateTime.prototype, 'gt').returns(false);
        expect(lhs.lteq(rhs)).to.be.true;
      });

    });

    describe('#gteq()', function () {

      it("should return false if #lt() returns true", function () {
        var lhs = $dateTime.create();
        var rhs = $dateTime.create();
        sandbox.stub($dateTime.prototype, 'lt').returns(true);
        expect(lhs.gteq(rhs)).to.be.false;
      });

      it("should return true if #lt() returns false", function () {
        var lhs = $dateTime.create();
        var rhs = $dateTime.create();
        sandbox.stub($dateTime.prototype, 'lt').returns(false);
        expect(lhs.gteq(rhs)).to.be.true;
      });

    });

  });

});
