/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/model/value/pattern',
  'app/editor/presenter/value/patternGroup',
  'app/editor/view/facet/pattern',
  'sulfur/ui/collection',
  'sulfur/ui/presenter',
  'sulfur/util/objectMap'
], function (PatternValueModel, PatternGroupValuePresenter, PatternFacetView, Collection, Presenter, ObjectMap) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = PatternFacetView.create();
      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('add', function () {
        model.get('groups').add(Collection.create([ PatternValueModel.create() ]));
      });

      this._registerModel();
    },

    _registerModel: function () {
      this.model.publisher.subscribe('update:groups', invoke(function () {
        this._registerGroupsCollection();
      }.bind(this)));
    },

    _registerGroupsCollection: function () {
      var model = this.model;
      var view = this.view;
      var groups = model.get('groups');

      var index = ObjectMap.create();

      groups.items.forEach(function (group) {
        var vp = PatternGroupValuePresenter.create(group);
        index.set(group, vp.view);
        view.access('groups').append(vp.view);
      });

      groups.publisher.subscribe('add', function (_, group) {
        var vp = PatternGroupValuePresenter.create(group);
        index.set(group, vp.view);
        view.access('groups').append(vp.view);
      });

      groups.publisher.subscribe('remove', function (_, group) {
        view.access('groups').remove(index.get(group));
      });
    }

  });

});
