/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global require */

(function () {

  'use strict';

//>>excludeStart("production", pragmas.production);
  require.config({
    baseUrl: '../../',
    paths: {
      'highlight': 'lib/highlight',
      'jszip': 'lib/jszip',
      'sulfur': 'src/sulfur',
      'text': 'node_modules/text/text',
      'unorm': 'node_modules/unorm/lib/unorm'
    },
    shim: {
      'jszip': { exports: 'JSZip' },
      'unorm': { exports: 'unorm' }
    }
  });
//>>excludeEnd("production");

  require([
    'app/editor/model/app',
    'app/editor/presenter/app'
  ], function (AppModel, AppPresenter) {

    var m = AppModel.createFromSettings();
    var p = AppPresenter.create(m);
    document.body.appendChild(p.view.element);

  });

}());
