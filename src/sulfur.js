/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(function () {

  'use strict';

  return {

    get namespaceURI() {
      return 'https://vsr.informatik.tu-chemnitz.de/projects/2013/sulfur';
    },

    get schemaLocationURL() {
      // TODO
      // use a more future proof location for the XML Schema which must be
      // accessible to the WebComposition/Data Grid Service when validating XML
      return 'http://www-user.tu-chemnitz.de/~ewie/sulfur.xsd';
    }

  };

});
