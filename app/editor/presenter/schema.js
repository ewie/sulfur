/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/model/element',
  'app/editor/presenter/element',
  'app/editor/presenter/tab',
  'app/editor/view/schema',
  'sulfur/ui/presenter',
  'sulfur/util/objectMap'
], function (
    ElementModel,
    ElementPresenter,
    TabPresenter,
    SchemaView,
    Presenter,
    ObjectMap
) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = SchemaView.create();

      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('add-element', function () {
        model.get('elements').add(ElementModel.create());
      });

      view.publisher.subscribe('root', function () {
        model.update({ name: view.access('root').value });
      });

      view.publisher.subscribe('namespace', function () {
        model.update({ namespace: view.access('namespace').value });
      });

      this._registerModel();
    },

    _registerModel: function () {
      var model = this.model;
      var view = this.view;

      model.publisher.subscribe('change:name', invoke(function () {
        view.access('root').value = model.get('name');
        view.access('root').error = model.error('name');
      }));

      model.publisher.subscribe('change:namespace', invoke(function () {
        view.access('namespace').value = model.get('namespace');
        view.access('namespace').error = model.error('namespace');
      }));

      model.publisher.subscribe('update:elements', invoke(function () {
        view.access('tabs').clear();
        var elements = model.get('elements');
        var selectedTab;
        var index = ObjectMap.create();

        function add(m) {
          var ep = ElementPresenter.create(m);
          view.access('element').view = ep.view;

          var tp = TabPresenter.create(m);
          view.access('tabs').append(tp.view);

          if (selectedTab && elements.size > 1) {
            selectedTab.unselect();
          }
          tp.select();
          selectedTab = tp;

          index.set(m, { tp: tp, ep: ep });

          m.publisher.subscribe('select', function () {
            selectedTab.unselect();
            view.access('element').view = ep.view;
            tp.select();
            selectedTab = tp;
          });

          m.publisher.subscribe('remove', function () {
            tp.model.destroy();
          });
        }

        elements.items.forEach(add);

        elements.publisher.subscribe('add', function (_, m) { add(m) });

        elements.publisher.subscribe('move', function (_, m, i) {
          var last = elements.size - 1;
          var n;
          if (i < last) {
            n = elements.item(i + 1);
          } else {
            n = elements.item(last - 1);
          }
          var ntp = index.get(n).tp;
          var mtp = index.get(m).tp;
          if (i < last) {
            view.access('tabs').moveBefore(mtp.view, ntp.view);
          } else {
            view.access('tabs').moveAfter(mtp.view, ntp.view);
          }
        });

        elements.publisher.subscribe('remove', function (_, m, i) {
          var mtp = index.get(m).tp;
          view.access('tabs').remove(mtp.view);
          if (elements.size === 0) {
            view.access('element').remove();
            selectedTab = null;
          } else {
            index.remove(m);
            // Select another element when the removed element happend to be
            // selected.
            if (selectedTab === mtp) {
              // Because the element was already removed from the collection
              // the index `i` denotes the next item of the collection.
              // Therefore we can use this index to select the element after
              // the removed element. When the removed element was the last
              // item of the collection we select the current last item.
              (i === elements.size) && (i -= 1);

              var n = elements.item(i);
              var ntp = index.get(n).tp;
              ntp.select();
              selectedTab = ntp;
              view.access('element').view = index.get(n).ep.view;
            }
          }
        });
      }));
    }

  });

});
