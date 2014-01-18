/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/type/complex/list',
  'sulfur/schema/type/complex/primitive/geolocation',
  'sulfur/schema/type/simple/derived/byte',
  'sulfur/schema/type/simple/derived/int',
  'sulfur/schema/type/simple/derived/integer',
  'sulfur/schema/type/simple/derived/long',
  'sulfur/schema/type/simple/derived/negativeInteger',
  'sulfur/schema/type/simple/derived/nonNegativeInteger',
  'sulfur/schema/type/simple/derived/nonPositiveInteger',
  'sulfur/schema/type/simple/derived/positiveInteger',
  'sulfur/schema/type/simple/derived/short',
  'sulfur/schema/type/simple/derived/unsignedByte',
  'sulfur/schema/type/simple/derived/unsignedInt',
  'sulfur/schema/type/simple/derived/unsignedLong',
  'sulfur/schema/type/simple/derived/unsignedShort',
  'sulfur/schema/type/simple/list',
  'sulfur/schema/type/simple/primitive/anyURI',
  'sulfur/schema/type/simple/primitive/boolean',
  'sulfur/schema/type/simple/primitive/date',
  'sulfur/schema/type/simple/primitive/dateTime',
  'sulfur/schema/type/simple/primitive/decimal',
  'sulfur/schema/type/simple/primitive/double',
  'sulfur/schema/type/simple/primitive/fileRef',
  'sulfur/schema/type/simple/primitive/float',
  'sulfur/schema/type/simple/primitive/string',
  'sulfur/schema/types'
], function (
    shared,
    ComplexListType,
    GeolocationType,
    ByteType,
    IntType,
    IntegerType,
    LongType,
    NegativeIntegerType,
    NonNegativeIntegerType,
    NonPositiveIntegerType,
    PositiveIntegerType,
    ShortType,
    UnsignedByteType,
    UnsignedIntType,
    UnsignedLongType,
    UnsignedShortType,
    SimpleListType,
    AnyUriType,
    BooleanType,
    DateType,
    DateTimeType,
    DecimalType,
    DoubleType,
    FileRefType,
    FloatType,
    StringType,
    types
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/types', function () {

    describe('.isSimpleType()', function () {

      it("should return true when .simpleTypes contains the given value", function () {
        expect(types.isSimpleType(types.simpleTypes[0])).to.be.true;
      });

      it("should return false when .simpleTypes does not contain the given value", function () {
        expect(types.isSimpleType({})).to.be.false;
      });

    });

    describe('.isComplexType()', function () {

      it("should return true when .simpleTypes contains the given value", function () {
        expect(types.isComplexType(types.complexTypes[0])).to.be.true;
      });

      it("should return false when .simpleTypes does not contain the given value", function () {
        expect(types.isComplexType({})).to.be.false;
      });

    });

    describe('.isSimpleListType()', function () {

      it("should return true when .simpleListType.prototype is the prototype of the given value", function () {
        var value = Object.create(types.simpleListType.prototype);
        expect(types.isSimpleListType(value)).to.be.true;
      });

      it("should return false when .simpleListType.prototype is not the prototype of the given value", function () {
        expect(types.isSimpleListType({})).to.be.false;
      });

    });

    describe('.simpleListType', function () {

      it("should return sulfur/schema/type/simple/list", function () {
        expect(types.simpleListType).to.equal(SimpleListType);
      });

    });

    describe('.complexListType', function () {

      it("should return sulfur/schema/type/complex/list", function () {
        expect(types.complexListType).to.equal(ComplexListType);
      });

    });

    describe('.simpleTypes', function () {

      [
        AnyUriType,
        BooleanType,
        DateType,
        DateTimeType,
        DecimalType,
        DoubleType,
        FileRefType,
        FloatType,
        StringType
      ].forEach(function (type) {

        it("should include sulfur/schema/type/simple/primitive/" + type.qname.localName, function () {
          expect(types.simpleTypes).to.include(type);
        });

      });

      [
        ByteType,
        IntType,
        IntegerType,
        LongType,
        NegativeIntegerType,
        NonNegativeIntegerType,
        NonPositiveIntegerType,
        PositiveIntegerType,
        ShortType,
        UnsignedByteType,
        UnsignedIntType,
        UnsignedLongType,
        UnsignedShortType
      ].forEach(function (type) {

        it("should include sulfur/schema/type/simple/derived/" + type.qname.localName, function () {
          expect(types.simpleTypes).to.include(type);
        });

      });

    });

    describe('.complexTypes', function () {

      it("should include sulfur/schema/type/complex/primitive/geolocation", function () {
        expect(types.complexTypes).to.include(GeolocationType);
      });

    });

  });

});
