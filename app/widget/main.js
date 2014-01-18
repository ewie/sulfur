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
      'leaflet': '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.1/leaflet',
      'sulfur': 'src/sulfur',
      'text': 'node_modules/text/text',
      'unorm': 'node_modules/unorm/lib/unorm'
    },
    shim: {
      'unorm': { exports: 'unorm' }
    }
  });
//>>excludeEnd("production");

  require([
    'app/widget/model/app',
    'app/widget/presenter/app'
  ], function (AppModel, AppPresenter) {

    var app = AppPresenter.create(AppModel.create());
    document.body.appendChild(app.view.element);

  });

}());
