/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/ui/presenter'
], function (shared, Presenter) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/ui/presenter', function () {

    describe('#model', function () {

      it("should return the associated model", function () {
        var m = {};
        var p = Presenter.create(null, m);
        expect(p.model).to.equal(m);
      });

    });

    describe('#view', function () {

      it("should return the associated view", function () {
        var v = {};
        var p = Presenter.create(v);
        expect(p.view).to.equal(v);
      });

    });

  });

});
