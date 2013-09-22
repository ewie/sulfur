/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/schema/facet/_any'], function ($_anyFacet) {

  'use strict';

  /**
   * A base factory for standard schema facets.
   *
   * @abstract
   *
   * @implement [#validate()] #createValidator()
   * @implement [boolean] #validate()
   *
   * @api private
   */
  return $_anyFacet.clone({

    /**
     * Get the facet's XML namespace, which is "http://www.w3.org/2001/XMLSchema"
     * for standard facets.
     *
     * @api public
     *
     * @return [string] the namespace
     */
    getNamespace: function () {
      return 'http://www.w3.org/2001/XMLSchema';
    }

  });

});
