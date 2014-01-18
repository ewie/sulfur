/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/dataGridService',
  'sulfur/ui/publisher'
], function (DataGridService, Publisher) {

  'use strict';

  var publisher = Publisher.create();
  var dgs;

  return {

    get dataGridService() { return dgs },

    get endpoint() { return localStorage.getItem('endpoint') },

    set endpoint(url) {
      localStorage.setItem('endpoint', url);
      dgs = DataGridService.create(url);
      this.publisher.publish('change', this);
    },

    get proxy() { return localStorage.getItem('proxy') },

    set proxy(url) {
      localStorage.setItem('proxy', url);
      this.publisher.publish('change', this);
    },

    url: function (url) {
      if (this.proxy) {
        return this.proxy + encodeURIComponent(url);
      } else {
        return url;
      }
    },

    get publisher() { return publisher }

  };

});
