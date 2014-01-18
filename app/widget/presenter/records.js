/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/widget/presenter/record',
  'app/widget/view/records',
  'sulfur/ui/presenter',
  'sulfur/util/objectMap'
], function (RecordPresenter, RecordsView, Presenter, ObjectMap) {

  'use strict';

  return Presenter.derive({

    initialize: function (model) {
      var view = RecordsView.create();
      Presenter.prototype.initialize.call(this, view, model);

      var index = ObjectMap.create();

      function add(record) {
        var p = RecordPresenter.create(record);
        index.set(record, p);
        view.access('records').append(p.view);
      }

      model.items.forEach(add);

      model.publisher.subscribe('add', function (_, record) {
        add(record);
      });

      model.publisher.subscribe('remove', function (_, record) {
        var p = index.get(record);
        view.access('records').remove(p.view);
        index.remove(record);
      });
    }

  });

});
