/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/model/value/boolean',
  'app/common/model/value/date',
  'app/common/model/value/dateTime',
  'app/common/model/value/decimal',
  'app/common/model/value/double',
  'app/common/model/value/float',
  'app/common/model/value/integer',
  'app/common/model/value/string',
  'app/common/model/value/uri',
  'app/editor/model/facet/enumeration',
  'app/editor/model/facet/fractionDigits',
  'app/editor/model/facet/max',
  'app/editor/model/facet/maxLength',
  'app/editor/model/facet/mediaType',
  'app/editor/model/facet/min',
  'app/editor/model/facet/minLength',
  'app/editor/model/facet/pattern',
  'app/editor/model/facet/totalDigits',
  'app/editor/model/facet/whiteSpace',
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/fractionDigits',
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/mediaType',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facet/totalDigits',
  'sulfur/schema/facet/whiteSpace',
  'sulfur/schema/facets',
  'sulfur/schema/type/simple/derived',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/value/simple/boolean',
  'sulfur/schema/value/simple/date',
  'sulfur/schema/value/simple/dateTime',
  'sulfur/schema/value/simple/decimal',
  'sulfur/schema/value/simple/double',
  'sulfur/schema/value/simple/float',
  'sulfur/schema/value/simple/integer',
  'sulfur/schema/value/simple/string',
  'sulfur/schema/value/simple/uri',
  'sulfur/ui/collection',
  'sulfur/ui/model'
], function (
    BooleanValueModel,
    DateValueModel,
    DateTimeValueModel,
    DecimalValueModel,
    DoubleValueModel,
    FloatValueModel,
    IntegerValueModel,
    StringValueModel,
    UriValueModel,
    EnumerationFacetModel,
    FractionDigitsFacetModel,
    MaxFacetModel,
    MaxLengthFacetModel,
    MediaTypeFacetModel,
    MinFacetModel,
    MinLengthFacetModel,
    PatternFacetModel,
    TotalDigitsFacetModel,
    WhiteSpaceFacetModel,
    EnumerationFacet,
    FractionDigitsFacet,
    LengthFacet,
    MaxExclusiveFacet,
    MaxInclusiveFacet,
    MaxLengthFacet,
    MediaTypeFacet,
    MinExclusiveFacet,
    MinInclusiveFacet,
    MinLengthFacet,
    PatternFacet,
    TotalDigitsFacet,
    WhiteSpaceFacet,
    Facets,
    DerivedType,
    PrimitiveType,
    RestrictedType,
    BooleanValue,
    DateValue,
    DateTimeValue,
    DecimalValue,
    DoubleValue,
    FloatValue,
    IntegerValue,
    StringValue,
    UriValue,
    Collection,
    Model
) {

  'use strict';

  function isFactoryOf(f, x) {
    return f.prototype.isPrototypeOf(x);
  }

  var isPrimitive = isFactoryOf.bind(null, PrimitiveType);
  var isDerived = isFactoryOf.bind(null, DerivedType);

  function getFacetModel(facet) {
    switch (facet) {
    case EnumerationFacet:
      return EnumerationFacetModel;
    case FractionDigitsFacet:
      return FractionDigitsFacetModel;
    case MaxInclusiveFacet:
      return MaxFacetModel;
    case MaxLengthFacet:
      return MaxLengthFacetModel;
    case MediaTypeFacet:
      return MediaTypeFacetModel;
    case MinInclusiveFacet:
      return MinFacetModel;
    case MinLengthFacet:
      return MinLengthFacetModel;
    case PatternFacet:
      return PatternFacetModel;
    case TotalDigitsFacet:
      return TotalDigitsFacetModel;
    case WhiteSpaceFacet:
      return WhiteSpaceFacetModel;
    default:
      throw new Error("unexpected facet");
    }
  }

  function getValueModel(valueType) {
    switch (valueType) {
    case BooleanValue:
      return BooleanValueModel;
    case DateValue:
      return DateValueModel;
    case DateTimeValue:
      return DateTimeValueModel;
    case DecimalValue:
      return DecimalValueModel;
    case DoubleValue:
      return DoubleValueModel;
    case FloatValue:
      return FloatValueModel;
    case IntegerValue:
      return IntegerValueModel;
    case StringValue:
      return StringValueModel;
    case UriValue:
      return UriValueModel;
    }
  }

  function getAllowedFacets(type) {
    return type.allowedFacets.toArray().reduce(function (facets, allowedFacet) {
      // Ignore facet "length" because it will be modelled with facet "maxLength"
      // and "minLength", ignore facet "maxExclusive" and "minExclusive" because
      // they will be modelled with facet "max" and "min" respectively.
      if (allowedFacet !== LengthFacet &&
          allowedFacet !== MaxExclusiveFacet &&
          allowedFacet !== MinExclusiveFacet)
      {
        facets.push(allowedFacet);
      }
      return facets;
    }, []);
  }

  function getFacetModelWithValueModel(allowedFacet, restriction) {
    var fm = getFacetModel(allowedFacet);
    var vm = getValueModel(restriction.valueType);
    return fm.withValueModel(vm);
  }

  function createFacetModel(allowedFacet, restriction) {
    var fm = getFacetModelWithValueModel(allowedFacet, restriction);
    if (allowedFacet.isShadowingLowerRestrictions) {
      var ef = allowedFacet.getEffectiveFacet(restriction);
      return ef ? fm.createFromObject(ef) : fm.create();
    } else {
      var facets = allowedFacet.getEffectiveFacets(restriction);
      return fm.createFromObject(facets);
    }
  }

  /**
   * @return {array} an array of arrays each containing the facets of a single
   *   restriction step, the first item contains the facets of the highest
   *   restriction step, the last item the facets of the lowest restriction
   *   step
   */
  function getFacets(facetModels) {
    return facetModels.reduce(function (facets, facetModel) {
      var facet = facetModel.object;
      if (facet) {
        // a facet model may not return an array of facet instances
        if (!Array.isArray(facet)) {
          facet = [ facet ];
        }
        facet.forEach(function (f, i) {
          facets[i] || (facets[i] = []);
          facets[i].push(f);
        });
      }
      return facets;
    }, []);
  }

  function createRestrictedType(baseType, facets) {
    while (facets.length) {
      var fcts = Facets.create(facets.pop());
      baseType = RestrictedType.create(baseType, fcts);
    }
    return baseType;
  }

  function constructBaseType(model) {
    var facets = getFacets(model.get('facets').items);
    // remove the highest restriction step
    facets.shift();
    return createRestrictedType(model.get('base'), facets);
  }

  return Model.clone({

    attributes: {
      base: { default: null },
      facets: { default: function () { return Collection.create() } }
    },

    _extract: function (type) {
      var allowedFacets = getAllowedFacets(type);
      var base;
      var facets;
      if (isPrimitive(type) || isDerived(type)) {
        base = type;
        facets = Collection.create(allowedFacets.map(function (allowedFacet) {
          var valueModel = getValueModel(type.valueType);
          var facetModel = getFacetModel(allowedFacet);
          return facetModel.withValueModel(valueModel).create();
        }));
      } else {
        base = type.primitive;
        facets = Collection.create(allowedFacets.map(function (allowedFacet) {
          return createFacetModel(allowedFacet, type);
        }));
      }
      return {
        base: base,
        facets: facets
      };
    },

    createFromBaseType: function (type) {
      var allowedFacets = getAllowedFacets(type);
      var facets = Collection.create(allowedFacets.map(function (allowedFacet) {
        return getFacetModelWithValueModel(allowedFacet, type).create();
      }));
      return this.create({
        base: type,
        facets: facets
      });
    },

    getValueModel: getValueModel

  }).augment({

    /**
     * Get the first named base type instead of the actual primitive.
     */
    get primitive() { return this.get('base').namedBaseOrSelf },

    _validate: function (errors) {
      Model.prototype._validate.call(this, errors);
      var facetModels = this.get('facets').items;
      var facets = facetModels.reduce(function (facets, facetModel) {
        var facet = facetModel.object;
        if (facet) {
          if (Array.isArray(facet)) {
            (facet.length > 0) && facets.push(facet[0]);
          } else {
            facets.push(facet);
          }
        }
        return facets;
      }, []);

      facets = facets.length > 0 ? Facets.create(facets) : null;

      var baseType = constructBaseType(this);

      facetModels.forEach(function (facetModel) {
        facetModel.validateWithBaseTypeAndFacets(baseType, facets);
      });
    },

    validateWithBaseType: function (baseType) {
      var facetModels = this.get('facets').items;
      var facets = facetModels.reduce(function (facets, facetModel) {
        var facet = facetModel.object;
        if (facet) {
          if (Array.isArray(facet)) {
            (facet.length > 0) && facets.push(facet[0]);
          } else {
            facets.push(facet);
          }
        }
        return facets;
      }, []);

      facets = facets.length > 0 ? Facets.create(facets) : null;

      facetModels.forEach(function (facetModel) {
        facetModel.validateWithBaseTypeAndFacets(baseType, facets);
      });
    },

    _construct: function () {
      var facets = getFacets(this.get('facets').items);
      return createRestrictedType(this.get('base'), facets);
    }

  });

});
