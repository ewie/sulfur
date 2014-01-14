/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur',
  'sulfur/schema/facet/mediaType',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/presence',
  'sulfur/schema/validator/property',
  'sulfur/schema/value/simple/fileRef'
], function (
    sulfur,
    MediaTypeFacet,
    Facets,
    QName,
    PrimitiveType,
    AllValidator,
    PresenceValidator,
    PropertyValidator,
    FileRefValue
) {

  'use strict';

  var FileRefType = PrimitiveType.derive({

    createRestrictionValidator: function (restriction) {
      // XXX Does not consider facets other than mediaType (because it's the
      //   only currently allowed facet), needs an implementation analog to
      //   sulfur/schema/type/simple/primitive/string when additional facets
      //   will be allowed.
      var mediaTypeFacet = MediaTypeFacet.getEffectiveFacet(restriction);
      var v = mediaTypeFacet.createValidator();
      return AllValidator.create([
        this.createValidator(),
        PropertyValidator.create('file',
          PresenceValidator.create(PropertyValidator.create('mediaType', v)))
      ]);
    }

  });

  return FileRefType.create({
    qname: QName.create('fileRef', sulfur.namespaceURI),
    valueType: FileRefValue,
    facets: Facets.create([ MediaTypeFacet ])
  });

});
