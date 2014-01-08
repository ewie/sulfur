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
      // XXX temporary schema location
      return 'http://www-user.tu-chemnitz.de/~ewie/sulfur.xsd';
    }

  };

});
