/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/file',
  'sulfur/schema/value/simple/fileRef',
  'sulfur/schema/value/simple/string'
], function (shared, File, FileRefValue, StringValue) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/value/simple/fileRef', function () {

    describe('#identifier', function () {

      it("should return the ID", function () {
        var id = StringValue.create();
        var fr = FileRefValue.create(id);
        expect(fr.identifier).to.equal(id);
      });

    });

    describe('#file()', function () {

      it("should return the file when set", function () {
        var id = StringValue.create();
        var file = File.create(new Blob());
        var fr = FileRefValue.create(id, file);
        expect(fr.file).to.equal(file);
      });

      it("should return undefined when no file is set", function () {
        var id = StringValue.create();
        var fr = FileRefValue.create(id);
        expect(fr.file).to.be.undefined;
      });

    });

  });

});
