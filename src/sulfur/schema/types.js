/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
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
], function (
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
    StringType
) {

  'use strict';

  return {

    isSimpleType: function (type) {
      return this.simpleTypes.indexOf(type) >= 0;
    },

    isComplexType: function (type) {
      return this.complexTypes.indexOf(type) >= 0;
    },

    isSimpleListType: function (type) {
      return this.simpleListType.prototype.isPrototypeOf(type);
    },

    get simpleListType() { return SimpleListType },

    get complexListType() { return ComplexListType },

    get simpleTypes() {
      return [
        AnyUriType,
        BooleanType,
        ByteType,
        DateType,
        DateTimeType,
        DecimalType,
        DoubleType,
        FileRefType,
        FloatType,
        IntType,
        IntegerType,
        LongType,
        NegativeIntegerType,
        NonNegativeIntegerType,
        NonPositiveIntegerType,
        PositiveIntegerType,
        ShortType,
        StringType,
        UnsignedByteType,
        UnsignedIntType,
        UnsignedLongType,
        UnsignedShortType
      ];
    },

    get complexTypes() {
      return [
        GeolocationType
      ];
    }

  };

});
