/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/type/complex/list',
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/type/complex/restricted',
  'sulfur/util',
  'sulfur/util/orderedMap'
], function (
    $factory,
    $element,
    $elements,
    $listType,
    $primitiveType,
    $restrictedType,
    $util,
    $orderedMap
) {

  'use strict';

  var XSD_NAMESPACE = 'http://www.w3.org/2001/XMLSchema';
  var NS = { xs: XSD_NAMESPACE };

  function keyfn(type) {
    return type.getQName().toString();
  }

  return $factory.derive({

    initialize: function (types) {
      if (!types.length) {
        throw new Error("expecting an array of one or more types");
      }
      this._typeIndex = types.reduce(function (index, type) {
        if (!$primitiveType.prototype.isPrototypeOf(type)) {
          throw new Error("expecting only sulfur/schema/type/complex types");
        }
        var qname = index.getKey(type);
        if (index.containsKey(qname)) {
          throw new Error("type with duplicate qualified name " + qname);
        }
        index.insert(type);
        return index;
      }, $orderedMap.create(keyfn));
    },

    resolveQualifiedName: function (qname) {
      return this._typeIndex.getItemByKey(qname.toString());
    },

    resolveElement: (function () {

      function declaresMandatoryAttributes(element, xpath) {
        var groups = xpath.all('xs:attributeGroup', element, NS);
        if (groups.length) {
          return groups.some(function (group) {
            return declaresMandatoryAttributes(group, xpath);
          });
        }
        return xpath.contains('xs:attribute[@use = "required"]', element, NS);
      }

      function resolveElement(element, resolver) {
        var minOccurs = element.hasAttribute('minOccurs') ?
          parseInt(element.getAttribute('minOccurs'), 10) : 1;

        // ignore the element when prohibited
        if (minOccurs === 0 && element.getAttribute('maxOccurs') === '0') {
          return;
        }

        if (minOccurs > 1) {
          throw new Error("incompatible complex type due to an element " +
            "requiring more than one occurrence");
        }

        var type;
        try {
          type = resolver.resolveElementType(element);
        } catch (e) {
          // reject the element when mandatory
          if (minOccurs > 0) {
            throw new Error("incompatible complex type due to mandatory element " +
              "with incompatible type (" + e.message + ")");
          }
          // ignore the element when optional
          return;
        }

        var name = element.getAttribute('name');
        return $element.create(name, type, { optional: minOccurs === 0 });
      }

      function findCompatibleType(types, elements) {
        var part = $util.bipart(elements, $util.method('isOptional'));
        var optionalElements = part.true;
        var mandatoryElements = part.false;

        // Find all types definining all mandatory elements.
        types = types.filter(function (type) {
          var allowedElements = type.getAllowedElements();
          return mandatoryElements.every(function (element) {
            var allowedElement = allowedElements.getElement(element.getName());
            return allowedElement &&
              element.getType().isRestrictionOf(allowedElement.getType());
          });
        });

        // With no optional elements, use the first matched type that does not
        // define additional elements.
        if (optionalElements.length === 0) {
          return $util.first(types, function (type) {
            return type.getAllowedElements().getSize() === mandatoryElements.length;
          });
        }

        // Calculate the number of elements of each type matched by an optional
        // element.
        var scores = types.map(function (type) {
          var allowedElements = type.getAllowedElements();
          return optionalElements.reduce(function (score, element) {
            var allowedElement = allowedElements.getElement(element.getName());
            var match = allowedElement &&
              element.getType().isRestrictionOf(allowedElement.getType());
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

        return $util.first(types, function (type, i) {
          if (scores[i] === maxScore) {
            return type;
          }
        });
      }

      function resolveElements(element, resolver) {
        return resolver.getXPath().all('xs:all/xs:element', element, NS)
          .reduce(function (elements, element) {
            element = resolveElement(element, resolver);
            element && elements.push(element);
            return elements;
          }, []);
      }

      function resolveAll(types, element, resolver) {
        var xpath = resolver.getXPath();

        if (declaresMandatoryAttributes(element, xpath)) {
          throw new Error("incompatible complex type due to mandatory attributes");
        }

        var elements = resolveElements(element, resolver);

        var type = findCompatibleType(types, elements);
        if (!type) {
          throw new Error("incompatible complex type");
        }

        return $restrictedType.create(type, $elements.create(elements));
      }

      function getOccurs(element, name) {
        name += 'Occurs';
        if (element.hasAttribute(name)) {
          var value = element.getAttribute(name);
          if (value === 'unbounded') {
            return;
          }
          return parseInt(value, 10);
        }
        return 1;
      }

      function resolveSequence(element, resolver) {
        var xpath = resolver.getXPath();
        var sequence = xpath.first('xs:sequence', element, NS);

        var mandatoryElementsExpr = 'xs:element[not(@minOccurs) or @minOccurs != "0"]';
        var optionalElementsExpr = 'xs:element[@minOccurs = "0"]';

        var mandatoryElementCount = xpath.count(mandatoryElementsExpr, sequence, NS);
        if (mandatoryElementCount > 1) {
          throw new Error("incompatible complex list type due to multiple mandatory elements");
        } else if (mandatoryElementCount === 0) {
          var optionalElementCount = xpath.count(optionalElementsExpr, sequence, NS);
          if (optionalElementCount > 1) {
            throw new Error("incompatible complex list type due to multiple optional elements");
          }
        }

        var itemElement = xpath.first(mandatoryElementsExpr, sequence, NS) ||
          xpath.first(optionalElementsExpr, sequence, NS);

        itemElement = resolveElement(itemElement, resolver);

        return $listType.create(itemElement, {
          maxLength: getOccurs(sequence, 'max'),
          minLength: getOccurs(sequence, 'min')
        });
      }

      return function (element, resolver) {
        if (element.localName !== 'complexType' ||
            element.namespaceURI !== XSD_NAMESPACE)
        {
          return;
        }

        var xpath = resolver.getXPath();

        if (xpath.contains('xs:all', element, NS)) {
          return resolveAll(this._typeIndex.toArray(), element, resolver);
        }

        if (xpath.contains('xs:sequence', element, NS)) {
          return resolveSequence(element, resolver);
        }
      };

    }())

  });

});
