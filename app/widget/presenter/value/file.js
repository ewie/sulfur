/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/widget/config',
  'app/widget/view/value/file',
  'sulfur/ui/presenter'
], function (config, FileValueView, Presenter) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = FileValueView.create();
      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('change', function () {
        var blob = view.access('file').file;
        model.update({ blob: blob });
      });

      model.publisher.subscribe('change:blob', invoke(function () {
        view.access('file').error = model.error('blob');
      }));

      model.publisher.subscribe('update:id', invoke(function () {
        var id = model.get('id');
        if (id) {
          var dgs = config.dgs;
          var resource = config.resource;
          var url = dgs.fileUrl(resource, id);
          view.showDownloadLink(url);
        } else {
          view.hideDownloadLink();
        }
      }));
    }

  });

});
