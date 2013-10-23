/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.clone({

    /**
     * Create an XML document with a root element of the given namespace URI
     * and qualified name.
     *
     * @param {string} namespaceURI
     * @param {string} qname
     *
     * @return {sulfur/util/document}
     */
    make: function (namespaceURI, qname) {
      var d = document.implementation.createDocument(
        namespaceURI, qname, null);
      return this.create(d);
    }

  }).augment({

    /**
     * @param {Document} document
     */
    initialize: function (document) {
      this._document = document;
    },

    /**
     * @return {Document} the document set on initialization
     */
    getDocument: function () {
      return this._document;
    },

    /**
     * @return {Element} the underlying document's root element
     */
    getRoot: function () {
      return this._document.documentElement;
    },

    /**
     * @param {string} namespaceURI
     * @param {string} qname
     *
     * @return {Element}
     */
    createElement: function (namespaceURI, qname) {
      return this._document.createElementNS(namespaceURI, qname);
    },

    /**
     * Declare a namespace by setting the xmlns attribute on the given element.
     *
     * @param {string} namespaceURI
     * @param {string} prefix
     * @param {Element} element (optional) the element on which to declare the
     *   namespace, use the root element by default
     *
     * @throw {Error} when the element has the given prefix
     * @throw {Error} when the element has a namespace declaration with the
     *   given prefix (the declared namespace must not necessarily affect the
     *   particular element)
     */
    declareNamespace: (function () {

      function hasDeclarationWithPrefix(prefix, element) {
        if (element.prefix === prefix) {
          return true;
        }
        var colon = prefix ? ':' : '';
        var name = 'xmlns' + colon + prefix;
        return element.hasAttribute(name);
      }

      return function (namespaceURI, prefix, element) {
        element || (element = this.getRoot());
        var colon = prefix ? ':' : '';
        var name = 'xmlns' + colon + prefix;
        if (hasDeclarationWithPrefix(prefix, element)) {
          throw new Error('prefix "' + prefix + '" is already declared');
        }
        element.setAttribute(name, namespaceURI);
      };

    }()),

    /**
     * Lookup the namespace URI for the given namespace prefix.
     *
     * @param {string|null} prefix
     * @param {Element} element (optional) the element for which to lookup the
     *   prefix, use the root element by default
     *
     * @return {string} the namespace URI when the given prefix is declared
     * @return {null} when no such namespace is declared
     */
    lookupNamespaceURI: (function () {

      function lookupDeclaration(prefix, element) {
        var name = 'xmlns';
        prefix && (name += ':' + prefix);
        if (element.hasAttribute(name)) {
          return element.getAttribute(name);
        }
      }

      function lookupNamespaceURI(prefix, element) {
        do {
          if (element.prefix === prefix) {
            return element.namespaceURI;
          }
          var namespaceURI = lookupDeclaration(prefix, element);
          if (namespaceURI !== undefined) {
            return namespaceURI;
          }
          element = element.parentElement;
        } while (element);

        return null;
      }

      return function (prefix, element) {
        element || (element = this.getRoot());

        if (!prefix || prefix.length === 0) {
          prefix = null;
        }

        var namespaceURI = element.lookupNamespaceURI(prefix);
        if (namespaceURI !== null) {
          return namespaceURI;
        }

        // Element#lookupNamespaceURI does not respect all namespace declarations
        //   (https://bugzilla.mozilla.org/show_bug.cgi?id=312019).
        // So we have to examine the xmlns attributes on each parent element.
        return lookupNamespaceURI(prefix, element);
      };

    }()),

    /**
     * Lookup the prefix associated with the given namespace URI.
     *
     * @param {string} namespaceURI
     * @param {Element} element (optional) the element for which to lookup the
     *   prefix, use the root element by default
     *
     * @return {string} the associated prefix (may be an empty string) when declared
     * @return {null} when no such namespace is declared
     */
    lookupPrefix: (function () {

      function lookupDeclaration(namespaceURI, element) {
        var attrs = element.attributes;
        if (attrs.xmlns && attrs.xmlns.value === namespaceURI) {
          return '';
        }
        for (var i = 0; i < attrs.length; i += 1) {
          var attr = attrs[i];
          var name = attr.name;
          if (name.indexOf('xmlns:') === 0) {
            if (attr.value === namespaceURI) {
              return name.substr(name.indexOf(':') + 1);
            }
          }
        }
      }

      function lookupPrefix(namespaceURI, element) {
        do {
          if (element.namespaceURI === namespaceURI) {
            return element.prefix || '';
          }
          var prefix = lookupDeclaration(namespaceURI, element);
          if (prefix !== undefined) {
            return prefix;
          }
          element = element.parentElement;
        } while (element);

        return null;
      }

      return function (namespaceURI, element) {
        element || (element = this.getRoot());

        var prefix = element.lookupPrefix(namespaceURI);
        if (prefix !== null) {
          return prefix;
        }

        // Element#lookupPrefix does not respect all namespace declarations
        //   (https://bugzilla.mozilla.org/show_bug.cgi?id=312019).
        // So we have to examine the xmlns attributes on each parent element.
        return lookupPrefix(namespaceURI, element);
      };

    }())

  });

});
