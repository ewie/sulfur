/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/model/value/double',
  'app/widget/model/value/geolocation',
  'app/widget/model/value/sequence',
  'app/widget/view/value/geolocation',
  'sulfur/ui/presenter'
], function (
    DoubleValueModel,
    GeolocationValueModel,
    SequenceValueModel,
    GeolocationValueView,
    Presenter
) {

  'use strict';

  function coordsToAttrs(coords) {
    return {
      latitude: DoubleValueModel.create({ value: coords.latitude.toString() }),
      longitude: DoubleValueModel.create({ value: coords.longitude.toString() })
    };
  }

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = GeolocationValueView.create();
      Presenter.prototype.initialize.call(this, view, model);

      var isList = SequenceValueModel.prototype.isPrototypeOf(model);

      if (isList) {
        model.get('values').items.forEach(function (value) {
          var lat = value.get('latitude').get('value');
          var lng = value.get('longitude').get('value');
          view.add(lat, lng);
        });

        model.publisher.subscribe('change:values', invoke(function () {
          var error = model.error('values');
          var n = model.get('values').size;
          for (var i = 0; i < n; i += 1) {
            error ? view.setInvalid(i) : view.setValid(i);
          }
        }));
      } else {
        var lat = model.get('latitude').get('value');
        var lng = model.get('longitude').get('value');
        lat && lng && view.add(lat, lng);
        model.publisher.subscribe('change', invoke(function () {
          model.isValid() ? view.setValid(0) : view.setInvalid(0);
        }));
      }

      view.publisher.subscribe('add', function (_, p, i) {
        var attrs = coordsToAttrs(p);
        if (isList) {
          model.get('values').add(GeolocationValueModel.create(attrs));
        } else {
          model.update(attrs);
          // immediately remove any additional position, so that there can only
          // be a single marker
          (i > 0) && view.removeLocationAt(i);
        }
      });

      view.publisher.subscribe('remove', function (_, p, i) {
        if (isList) {
          var values = model.get('values');
          var value = values.item(i);
          values.remove(value);
        } else if (i === 0) {
          model.update({
            longitude: DoubleValueModel.create(),
            latitude: DoubleValueModel.create()
          });
        }
      });

      view.publisher.subscribe('move', function (_, p, i) {
        var attrs = coordsToAttrs(p);
        if (isList) {
          var values = model.get('values');
          var value = values.item(i);
          value.update(attrs);
        } else {
          model.update(attrs);
        }
      });
    }

  });

});
