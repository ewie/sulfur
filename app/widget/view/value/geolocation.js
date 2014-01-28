/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'leaflet',
  'text!app/widget/html/value/geolocation.html',
  'sulfur/ui/view',
  'sulfur/ui/view/blueprint'
], function (leaflet, html, View, Blueprint) {

  'use strict';

  var validIcon = leaflet.divIcon({
    className: 'geolocation-value-valid',
    iconSize: leaflet.point(27, 41),
    iconAnchor: leaflet.point(13, 41)
  });

  var invalidIcon = leaflet.divIcon({
    className: 'geolocation-value-invalid',
    iconSize: leaflet.point(27, 41),
    iconAnchor: leaflet.point(13, 41)
  });

  function supportsGeolocation() {
    if (!navigator.geolocation) {
      return false;
    }
    // XXX since version 24 Firefox geolocation is broken
    //   https://bugs.launchpad.net/ubuntu/+source/firefox/+bug/1231273
    var m = /Firefox\/(\d+)/.exec(navigator.userAgent);
    if (m) {
      return parseInt(m[1], 10) <= 23;
    }
    return true;
  }

  function getUserPosition(cb) {
    if (supportsGeolocation()) {
      navigator.geolocation.getCurrentPosition(function (position) {
        cb(position.coords.latitude, position.coords.longitude, 14);
      }, function () {
        cb(0, 0, 1);
      });
    } else {
      // invoke the callback asynchronously to mock the behaviour of
      // geolocation.getCurrentPosition()
      setTimeout(function () { cb(0, 0, 1) }, 0);
    }
  }

  var blueprint = Blueprint.create({ html: html });

  function isVisible(e) {
    while (e) {
      if (window.getComputedStyle(e).display === 'none') {
        return false;
      }
      e = e.parentElement;
    }
    return true;
  }

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    initialize: function () {
      View.prototype.initialize.call(this);

      var e = this.element.querySelector('.map');
      var map = this._map = leaflet.map(e);
      var self = this;
      this._markers = [];

      getUserPosition(function (lat, lng, zoom) {
        map.setView([lat, lng], zoom);

        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        map.on('click', function (ev) {
          var latlng = ev.latlng.wrap();
          var lat = latlng.lat;
          var lng = latlng.lng;
          self.add(lat, lng);
        });
      });
    },

    add: function (lat, lng) {
      var markers = this._markers;
      var publisher = this.publisher;
      var map = this._map;
      var m = leaflet.marker([ lat, lng ], { draggable: true, riseOnHover: true, icon: validIcon });
      m.addTo(this._map);
      markers.push(m);

      publisher.publish('add', this, {
        longitude: lng,
        latitude: lat
      }, markers.length - 1);

      m.on('click', function (ev) { ev.originalEvent.stopPropagation() });

      m.on('contextmenu', function (ev) {
        map.removeLayer(m);
        ev.originalEvent.stopPropagation();
      });

      m.on('dragend', function () {
        var coords = m.getLatLng();
        publisher.publish('move', this, {
          latitude: coords.lat,
          longitude: coords.lng
        }, markers.indexOf(m));
      });

      m.on('remove', function () {
        var i = markers.indexOf(m);
        (i !== -1) && markers.splice(i, 1);

        var p = m.getLatLng();

        publisher.publish('remove', this, {
          longitude: p.lng,
          latitude: p.lat
        }, i);
      });
    },

    removeLocationAt: function (index) {
      var m = this._markers[index];
      this._map.removeLayer(m);
      this._markers.splice(index, 1);
    },

    setValid: function (index) {
      var m = this._markers[index];
      m && m.setIcon(validIcon);
    },

    setInvalid: function (index) {
      var m = this._markers[index];
      m && m.setIcon(invalidIcon);
    },

    inserted: function () {
      // the map element needs to be visible to be initialized, so poll until
      // its displayed
      var i = setInterval(function () {
        if (isVisible(this.element)) {
          clearInterval(i);
          this._map.invalidateSize();
        }
      }.bind(this), 200);
    }

  });

});
