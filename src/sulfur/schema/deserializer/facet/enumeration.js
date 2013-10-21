/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/enumeration',
  'sulfur/util'
], function (EnumerationFacet, util) {

  'use strict';

  return {

    getFacet: util.returns(EnumerationFacet),

    parseValue: function (s, p) {
      return p.parse(s);
    },

    createFacet: function (values) {
      return EnumerationFacet.create(values);
    }

  };

});
