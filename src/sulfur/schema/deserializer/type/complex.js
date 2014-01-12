/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/schema/elements',
  'sulfur/schema/type/complex/list',
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/type/complex/restricted',
  'sulfur/schema/value/simple/integer',
  'sulfur/util',
  'sulfur/util/stringMap',
  'sulfur/util/xpath'
], function (
    Factory,
    Elements,
    ListType,
    PrimitiveType,
    RestrictedType,
    IntegerValue,
    util,
    StringMap,
    XPath
) {

  'use strict';

  var XSD_NAMESPACE = 'http://www.w3.org/2001/XMLSchema';
  var NS = { xs: XSD_NAMESPACE };

  return Factory.derive({

    initialize: function (types) {
      if (!types.length) {
        throw new Error("expecting an array of one or more types");
      }
      this._typeIndex = types.reduce(function (index, type) {
        if (!PrimitiveType.prototype.isPrototypeOf(type)) {
          throw new Error("expecting only sulfur/schema/type/complex types");
        }
        var qname = type.qname;
        if (index.contains(qname)) {
          throw new Error("type with duplicate qualified name " + qname);
        }
        index.set(qname, type);
        return index;
      }, StringMap.create());
    },

    resolveQualifiedName: function (qname) {
      return this._typeIndex.get(qname);
    },

    resolveTypeElement: (function () {

      function declaresMandatoryAttributes(element, xpath) {
        var groups = xpath.all('xs:attributeGroup', element, NS);
        if (groups.length) {
          return groups.some(function (group) {
            return declaresMandatoryAttributes(group, xpath);
          });
        }
        return xpath.contains('xs:attribute[@use = "required"]', element, NS);
      }

      /**
       * @param {Element} element
       * @param {sulfur/schema/resolver/type} resolver
       *
       * @return {undefined} when the element has an incompatible type and cannot be ignored
       * @return {null} when the element has an incompatible type but can be ignored
       * @return {sulfur/schema/element} an element with compatible type
       */
      function resolveElement(element, resolver, xpath) {
        var minOccurs = element.hasAttribute('minOccurs') ?
          parseInt(element.getAttribute('minOccurs'), 10) : 1;

        if (minOccurs === 0 && element.getAttribute('maxOccurs') === '0') {
          return null;
        }

        if (minOccurs > 1) {
          return;
        }

        if (resolver.isRecursiveElementDeclaration(element)) {
          return;
        }

        var e;
        try {
          e = resolver.resolveElementDeclaration(element, xpath);
        } catch (ex) {
          return minOccurs > 0 ? undefined : null;
        }

        return e;
      }

      function findCompatibleType(types, elements) {
        var part = util.bipart(elements, util.property('isOptional'));
        var optionalElements = part.true;
        var mandatoryElements = part.false;

        // Find all types definining all mandatory elements.
        types = types.filter(function (type) {
          var allowedElements = type.allowedElements;
          return mandatoryElements.every(function (element) {
            var allowedElement = allowedElements.getByName(element.name);
            return allowedElement &&
              element.type.isRestrictionOf(allowedElement.type);
          });
        });

        // With no optional elements, use the first matched type that does not
        // define additional elements.
        if (optionalElements.length === 0) {
          return util.first(types, function (type) {
            return type.allowedElements.size === mandatoryElements.length;
          });
        }

        // Calculate the number of elements of each type matched by an optional
        // element.
        var scores = types.map(function (type) {
          var allowedElements = type.allowedElements;
          return optionalElements.reduce(function (score, element) {
            var allowedElement = allowedElements.getByName(element.name);
            var match = allowedElement &&
              element.type.isRestrictionOf(allowedElement.type);
            if (match) {
              score += 1;
            }
            return score;
          }, 0);
        });

        // Use the first type with the highest number of elements matched by
        // optional elements.
        var maxScore = scores.reduce(function (max, score) {
          return Math.max(max, score);
        }, 0);

        return util.first(types, function (type, i) {
          if (scores[i] === maxScore) {
            return type;
          }
        });
      }

      function resolveElementGroup(group, resolver, xpath) {
        var elements = xpath.all('xs:element', group, NS);

        var es = [];
        for (var i = 0; i < elements.length; i += 1) {
          var e = resolveElement(elements[i], resolver, xpath);
          if (e === undefined) {
            return;
          }
          if (e === null) {
            continue;
          }
          es.push(e);
        }

        return es;
      }

      function resolveAll(element, resolver, xpath, types) {
        if (declaresMandatoryAttributes(element, xpath)) {
          return;
        }

        var all = xpath.first('xs:all', element, NS);
        var elements = resolveElementGroup(all, resolver, xpath);
        if (!elements) {
          return;
        }

        var type = findCompatibleType(types, elements);
        if (!type) {
          return;
        }

        return RestrictedType.create(type, Elements.create(elements));
      }

      function getOccurs(element, name) {
        name += 'Occurs';
        if (element.hasAttribute(name)) {
          var value = element.getAttribute(name);
          if (value === 'unbounded') {
            return;
          }
          return IntegerValue.parse(value);
        }
        return IntegerValue.parse('1');
      }

      function resolveSequenceOrChoice(element, resolver, xpath) {
        var group = xpath.first('xs:sequence|xs:choice', element, NS);
        var elements = resolveElementGroup(group, resolver, xpath);

        if (elements) {
          var part = util.bipart(elements, function (e) { return e.isOptional }, 'optional', 'mandatory');

          var itemElement;

          switch (part.mandatory.length) {
          case 0:
            // use the very first element
            (part.optional.length === 1) && (itemElement = part.optional[0]);
            break;
          case 1:
            // select the first mandatory element
            itemElement = part.mandatory[0];
            break;
          }

          if (itemElement) {
            return ListType.create(itemElement, {
              maxLength: getOccurs(group, 'max'),
              minLength: getOccurs(group, 'min')
            });
          }
        }
      }

      return function (element, resolver) {
        if (element.localName !== 'complexType' ||
            element.namespaceURI !== XSD_NAMESPACE)
        {
          return;
        }

        var xpath = XPath.create(element);

        if (xpath.contains('xs:all', element, NS)) {
          return resolveAll(element, resolver, xpath, this._typeIndex.values);
        }

        if (xpath.contains('xs:sequence|xs:choice', element, NS)) {
          return resolveSequenceOrChoice(element, resolver, xpath);
        }

      };

    }())

  });

});
