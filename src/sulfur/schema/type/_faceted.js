/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/prototype',
  'sulfur/util/orderedMap'
], function ($factory, $allValidator, $prototypeValidator, $orderedMap) {

  'use strict';

  var XSD_NAMESPACE = 'http://www.w3.org/2001/XMLSchema';

  function key(namespace, name) {
    return '{' + namespace + '}' + name;
  }

  function facetKey(facet) {
    return key(facet.getNamespace(), facet.getName());
  }

  /**
   * @abstract
   *
   * @implement .getLegalFacets() an array of legal facet types
   * @implement #getValueType() a type representing the value space of this type
   *
   * @api private
   */
  return $factory.derive({

    initialize: function (facets) {
      this._facets = $orderedMap.create(facetKey);
      if (facets) {
        facets.reduce(function (facets, facet) {
          if (!facets.canBeInserted(facet)) {
            throw new Error("duplicate facet");
          }
          facets.insert(facet);
          return facets;
        }, this._facets);
      }
    },

    getFacets: function () {
      return this._facets.toArray();
    },

    countFacets: function () {
      return this._facets.countItems();
    },

    hasFacet: function (name, namespace) {
      return this._facets.containsKey(key(namespace, name));
    },

    hasStandardFacet: function (name) {
      return this.hasFacet(name, XSD_NAMESPACE);
    },

    getFacet: function (name, namespace) {
      return this._facets.getItemByKey(key(namespace, name));
    },

    getStandardFacet: function (name) {
      return this.getFacet(name, XSD_NAMESPACE);
    },

    validateFacets: (function () {

      function hasIllegalFacets(type, legalFacets) {
        return 0 < legalFacets.reduce(function (count, legalFacet) {
          var name = legalFacet.getName();
          var namespace = legalFacet.getNamespace();
          type.hasFacet(name, namespace) && (count -= 1);
          return count;
        }, type.countFacets());
      }

      return function () {
        if (this._facets.isEmpty()) {
          return true;
        }
        if (hasIllegalFacets(this, this.factory.getLegalFacets())) {
          return false;
        }
        return this.getFacets().every(function (facet) {
          return facet.validate(this);
        }.bind(this));
      };

    }()),

    createValidator: function () {
      var validators = [];
      if (this._facets) {
        validators = this._facets.toArray().reduce(function (validators, facet) {
          validators.push(facet.createValidator());
          return validators;
        }, validators);
      }
      return $allValidator.create(validators);
    }

  });

});
