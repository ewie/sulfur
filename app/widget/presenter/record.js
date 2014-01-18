/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/widget/config',
  'app/widget/presenter/field',
  'app/widget/view/record',
  'sulfur/ui/presenter'
], function (config, FieldPresenter, RecordView, Presenter) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = RecordView.create();
      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('remove', function () {
        model.publisher.publish('delete');
      });

      view.publisher.subscribe('save', function () {
        model.publisher.publish('save');
      });

      view.publisher.subscribe('close', function () {
        model.publisher.publish('close');
      });

      view.publisher.subscribe('reset', function () {
        model.publisher.publish('load');
      });

      view.publisher.subscribe('open', function () {
        model.publisher.publish('open');
      });

      model.publisher.subscribe('change', invoke(function () {
        view.setValid(model.isValid());
      }));

      model.publisher.subscribe('update:id', invoke(function () {
        var id = model.get('id');
        view.access('id').text = id;
        var url;
        if (id) {
          var dgs = config.dgs;
          var resource = config.resource;
          url = dgs.recordUrl(resource, id);
        }
        view.setDownloadLink(url);
      }));

      model.publisher.subscribe('update:opened', invoke(function () {
        view.showBody(model.get('opened'));
      }));

      model.publisher.subscribe('update:fields', invoke(function () {
        // the fields collection is supposed to be fixed, so no other fields
        // will be added
        view.access('fields').clear();
        model.get('fields').items.forEach(function (field) {
          var p = FieldPresenter.create(field);
          view.access('fields').append(p.view);
        });
      }));
    }

  });

});
