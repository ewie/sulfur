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
  'app/common/model/value/list',
  'app/common/model/value/string',
  'app/common/model/value/uri',
  'app/editor/model/facet/enumeration',
  'app/editor/model/facet/maxLength',
  'app/editor/model/facet/minLength',
  'app/editor/model/facet/pattern',
  'app/editor/model/type/simple/atomic',
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facets',
  'sulfur/schema/type/simple/list',
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
    ListValueModel,
    StringValueModel,
    UriValueModel,
    EnumerationFacetModel,
    MaxLengthFacetModel,
    PatternFacetModel,
    MinLengthFacetModel,
    SimpleAtomicTypeModel,
    EnumerationFacet,
    MaxLengthFacet,
    MinLengthFacet,
    PatternFacet,
    Facets,
    SimpleListType,
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

  function isList(type) { return SimpleListType.prototype.isPrototypeOf(type) }

  var allowedFacets = [
    EnumerationFacet,
    MaxLengthFacet,
    MinLengthFacet,
    PatternFacet
  ];

  function getFacetModel(facet) {
    switch (facet) {
    case EnumerationFacet:
      return EnumerationFacetModel;
    case MaxLengthFacet:
      return MaxLengthFacetModel;
    case MinLengthFacet:
      return MinLengthFacetModel;
    case PatternFacet:
      return PatternFacetModel;
    default:
      throw new Error("unexpected facet");
    }
  }

  function getItemValueModel(valueType) {
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

  function getValueModel(valueType) {
    var ivm = getItemValueModel(valueType.itemValueType);
    if (ivm) {
      return ListValueModel.withItemValueModel(ivm);
    }
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

  return Model.clone({

    attributes: {
      itemType: { default: null },
      facets: { default: function () { return Collection.create() } }
    },

    _extract: function (type) {
      var facets;
      var itemType;
      if (isList(type)) {
        itemType = SimpleAtomicTypeModel.createFromObject(type.itemType);
      } else {
        facets = Collection.create(allowedFacets.map(function (allowedFacet) {
          return createFacetModel(allowedFacet, type);
        }));
        itemType = SimpleAtomicTypeModel.createFromObject(type.primitive.itemType);
      }
      return {
        itemType: itemType,
        facets: facets
      };
    },

    createWithItemTypeModel: function (itemTypeModel) {
      var type = SimpleListType.create(itemTypeModel.primitive);
      var facets = Collection.create(allowedFacets.map(function (allowedFacet) {
        return createFacetModel(allowedFacet, type);
      }));
      return this.create({
        itemType: itemTypeModel,
        facets: facets
      });
    },

    getValueModel: getValueModel

  }).augment({

    get primitive() {
      var itemTypeModel = this.get('itemType');
      // use a dummy item type without a value type
      var itemType = itemTypeModel ? itemTypeModel.object : { valueType: null };
      return SimpleListType.create(itemType);
    },

    update: function (attrs) {
      if (attrs.itemType && !attrs.facets) {
        var type = SimpleListType.create(attrs.itemType.primitive);
        attrs.facets = Collection.create(allowedFacets.map(function (allowedFacet) {
          return createFacetModel(allowedFacet, type);
        }));
      }
      return Model.prototype.update.call(this, attrs);
    },

    _validate: function (errors) {
      Model.prototype._validate.call(this, errors);
      var itemType = this.get('itemType');

      if (itemType) {
        var baseType = this.primitive;
        var facetModels = this.get('facets').items;
        var facets = facetModels.reduce(function (facets, facetModel) {
          var facet = facetModel.object;
          if (facet) {
            // a facet model may not return an array of facet instances
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
      } else {
        errors.itemType = true;
      }
    },

    _construct: function () {
      var facets = this.get('facets').items.reduce(function (facets, facetModel) {
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

      var itemType = this.get('itemType');
      if (!itemType) {
        return;
      }
      itemType = itemType.object;
      var base = SimpleListType.create(itemType);
      while (facets.length) {
        var fcts = Facets.create(facets.pop());
        base = RestrictedType.create(base, fcts);
      }
      return base;
    }

  });

});
