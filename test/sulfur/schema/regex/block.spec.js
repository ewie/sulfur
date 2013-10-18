/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/regex/block',
  'sulfur/unicode'
], function (shared, Block, Unicode) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/schema/regex/block', function () {

    describe('#initialize()', function () {

      context("with an unknown block name", function () {

        it("should reject the block name", function () {
          expect(bind(Block, 'create', 'xxx'))
            .to.throw("unknown Unicode block xxx");
        });
      });

      context("with an unsupported block name", function () {

        it("should reject the block name", function () {
          UNSUPPORTED_UNICODE_BLOCKS.forEach(function (name) {
            expect(bind(Block, 'create', name))
              .to.throw("unsupported Unicode block " + name);
          });
        });

      });

      context("with a supported block name", function () {

        it("should initialize the block with the given name", function () {
          SUPPORTED_UNICODE_BLOCKS.forEach(function (name) {
            var b = Block.create(name);
            expect(b.name).to.equal(name);
          });
        });

      });

      context("when called without second argument", function () {

        it("should initialize the block as positive", function () {
          var b = Block.create('BasicLatin');
          expect(b.positive).to.be.true;
        });

      });

    });

  });

  var UNSUPPORTED_UNICODE_BLOCKS = [
    'HighPrivateUseSurrogates',
    'HighSurrogates',
    'LowSurrogates'
  ];

  var SUPPORTED_UNICODE_BLOCKS = Unicode.getBlockNames().reduce(
    function (blocks, name) {
      if (UNSUPPORTED_UNICODE_BLOCKS.indexOf(name) === -1) {
        blocks.push(name);
      }
      return blocks;
    }, []);

});
