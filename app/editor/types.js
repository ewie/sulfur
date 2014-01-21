/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur',
  'sulfur/schema/types'
], function (sulfur, schemaTypes) {

  'use strict';

  var listName = 'xs:list';
  var sequenceName = 'xs:sequence';

  var typeName = (function () {

    var prefixes = Object.create(null);
    prefixes['http://www.w3.org/2001/XMLSchema'] = 'xs';
    prefixes[sulfur.namespaceURI] = 'sulfur';

    return function typeName(type) {
      var prefix = prefixes[type.qname.namespaceURI];
      return prefix + ':' + type.qname.localName;
    };

  }());

  function indexTypes(types) {
    return types.reduce(function (index, type) {
      var qname = type.qname;
      var name = typeName(type);
      index.name2type[name] = type;
      index.qname2name[qname] = name;
      return index;
    }, {
      name2type: Object.create(null),
      qname2name: Object.create(null)
    });
  }

  var simpleTypeIndex = indexTypes(schemaTypes.simpleTypes);
  var complexTypeIndex = indexTypes(schemaTypes.complexTypes);

  var simpleTypeNames = Object.keys(simpleTypeIndex.name2type);
  var complexTypeNames = Object.keys(complexTypeIndex.name2type);

  var atomicTypeNames = simpleTypeNames.concat(complexTypeNames).sort();

  var primitiveTypeNames = [listName, sequenceName].concat(atomicTypeNames).sort();

  function atomicName(type) {
    var qname = type.qname;
    return simpleTypeIndex.qname2name[qname] || complexTypeIndex.qname2name[qname];
  }

  function isSimpleListType(type) {
    return schemaTypes.isSimpleListType(type);
  }

  function isComplexListType(type) {
    return schemaTypes.complexListType === type;
  }

  return {

    displayName: function (type) {
      return isSimpleListType(type) ?
        listName :
        isComplexListType(type) ?
          sequenceName :
          atomicName(type);
    },

    isList: function (name) {
      return name === listName;
    },

    isSequence: function (name) {
      return name === sequenceName;
    },

    isSimple: function (name) {
      return !!simpleTypeIndex.name2type[name];
    },

    isComplex: function (name) {
      return !!complexTypeIndex.name2type[name];
    },

    anyType: function (name) {
      if (this.isList(name)) {
        return schemaTypes.simpleListType;
      } else if (this.isSequence(name)) {
        return schemaTypes.complexListType;
      } else {
        return this.atomicType(name);
      }
    },

    atomicType: function (name) {
      return simpleTypeIndex.name2type[name] || complexTypeIndex.name2type[name];
    },

    get primitiveTypeNames() {
      return primitiveTypeNames;
    },

    get atomicTypeNames() {
      return atomicTypeNames;
    },

    get simpleTypeNames() {
      return simpleTypeNames;
    }

  };

});
