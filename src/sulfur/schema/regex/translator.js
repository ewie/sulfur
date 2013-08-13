/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/object',
  'sulfur/schema/regex/any',
  'sulfur/schema/regex/block',
  'sulfur/schema/regex/branch',
  'sulfur/schema/regex/category',
  'sulfur/schema/regex/codepoint',
  'sulfur/schema/regex/class',
  'sulfur/schema/regex/codeunit',
  'sulfur/schema/regex/group',
  'sulfur/schema/regex/pattern',
  'sulfur/schema/regex/piece',
  'sulfur/schema/regex/range',
  'sulfur/schema/regex/ranges',
  'sulfur/unicode'
], function (
  $object,
  $any,
  $block,
  $branch,
  $category,
  $codepoint,
  $class,
  $codeunit,
  $group,
  $pattern,
  $piece,
  $range,
  $ranges,
  $unicode
) {

  'use strict';

  /**
   * The translator is responsible for translating a regular expression tree
   * produced by the parser into a tree that can be compiled into a JavaScript
   * regular expression.
   *
   * The translation process most notably resolves multi character escapes
   * and non-BMP codepoints.
   */

  function isObjectOf(obj, type) {
    return type.prototype.isPrototypeOf(obj);
  }

  function isPattern(obj) {
    return isObjectOf(obj, $pattern);
  }

  function isCodepoint(obj) {
    return isObjectOf(obj, $codepoint);
  }

  function isClass(obj) {
    return isObjectOf(obj, $class);
  }

  function isGroup(obj) {
    return isObjectOf(obj, $group);
  }

  function isAny(obj) {
    return isObjectOf(obj, $any);
  }

  function isBlock(obj) {
    return isObjectOf(obj, $block);
  }

  function isCategory(obj) {
    return isObjectOf(obj, $category);
  }

  function translatePattern(pattern) {
    // translate each branch
    var branches = pattern.branches.map(function (branch) {
      return translateBranch(branch);
    });

    // flatten branches if possible
    branches = branches.reduce(function (branches, branch) {
      // get the first piece of `branch` if the branch only contains this
      // single piece
      var piece = branch.pieces.length === 1 ? branch.pieces[0] : undefined;

      if (piece && isPattern(piece.atom) && piece.quant.min === 1 &&
          piece.quant.max === 1)
      {
        // merge the branches of a single pattern with a quantity of exactly 1
        branches.push.apply(branches, piece.atom.branches);
      } else {
        branches.push(branch);
      }
      return branches;
    }, []);

    return $pattern.create(branches);
  }

  function translateBranch(branch) {
    var pieces = branch.pieces.map(function (piece) {
      return translatePiece(piece);
    });

    return $branch.create(pieces);
  }

  function translatePiece(piece) {
    var atom = piece.atom;
    if (isCodepoint(atom)) {
      atom = translateCodepoint(atom);
    } else if (isPattern(atom)) {
      atom = translatePattern(atom);
    } else if (isAny(atom)) {
      atom = translateAny(atom);
    } else if (isGroup(atom)) {
      atom = translateGroup(atom);
    } else if (isClass(atom)) {
      atom = translateClass(atom);
    } else if (isBlock(atom)) {
      atom = translateBlock(atom);
    } else if (isCategory(atom)) {
      atom = translateCategory(atom);
    } else {
      throw new Error("not yet implemented");
    }
    return $piece.create(atom, piece.quant);
  }

  function translateCodepoint(character) {
    var pair = $unicode.encodeToSurrogatePair(character.value);
    if (pair) {
      return $pattern.create(
        [$branch.create(
           [$piece.create(
              $codeunit.create(pair[0])),
            $piece.create(
              $codeunit.create(pair[1]))
           ])
        ]);
    } else {
      return $codeunit.create(character.value);
    }
  }

  function translateAny() {
    return $group.create([
      $codeunit.create(0xA),
      $codeunit.create(0xD)
    ], { positive: false });
  }

  function translateBlock(block) {
    var range = $unicode.getBlockRange(block.name);
    return $group.create([
      $range.create(
        $codeunit.create(range[0]),
        $codeunit.create(range[1]))
    ], { positive: block.positive });
  }

  function translateCategory(category) {
    var name = category.name;

    var ranges;
    if ($unicode.isValidCategory(name)) {
      ranges = $unicode.getCategoryRanges(name);
    } else {
      ranges = $unicode.getCategoryGroupRanges(name);
    }

    var items = ranges.reduce(function (items, range) {
      var d = range[1] - range[0];
      if (d === 0) {
        items.push($codeunit.create(range[0]));
      } else if (d === 1) {
        items.push(
          $codeunit.create(range[0]),
          $codeunit.create(range[1]));
      } else {
        items.push(
          $range.create(
            $codeunit.create(range[0]),
            $codeunit.create(range[1])));
      }
      return items;
    }, []);

    return $group.create(items, { positive: category.positive });
  }

  function resolveCodepointItem(codepoint) {
    var value = codepoint.value;
    var pair = $unicode.encodeToSurrogatePair(value);
    if (pair) {
      return [
        [ pair[0], pair[0] ],
        [ pair[1], pair[1] ]
      ];
    } else {
      return [
        [ value, value ]
      ];
    }
  }

  function resolveRangeItem(range) {
    var start = range.start.value;
    var end = range.end.value;
    var startPair = $unicode.encodeToSurrogatePair(start);
    var endPair = $unicode.encodeToSurrogatePair(end);
    var ranges = [];
    if (startPair && endPair) {
      ranges.push(
        [ startPair[0], startPair[0] ],
        [ endPair[1], endPair[1] ]);
    } else if (!startPair && endPair) {
      if (start < endPair[0]) {
        ranges.push([ start, endPair[0] ]);
      }
      ranges.push([ endPair[1], endPair[1] ]);
    } else {
      ranges.push([ start, end ]);
    }
    return ranges;
  }

  function invertRanges(ranges) {
    return $ranges.create(ranges).invert().array;
  }

  function resolveBlockItem(block) {
    var ranges = [ $unicode.getBlockRange(block.name) ];
    return block.positive ? ranges : invertRanges(ranges);
  }

  function resolveCategoryItem(category) {
    var name = category.name;
    var ranges;
    if ($unicode.isValidCategory(name)) {
      ranges = $unicode.getCategoryRanges(name);
    } else if ($unicode.isValidCategoryGroup(name)) {
      ranges = $unicode.getCategoryGroupRanges(name);
    }
    return category.positive ? ranges : invertRanges(ranges);
  }


  function resolveItemsToRanges(group) {
    var ranges = group.items.reduce(function (ranges, item) {
      if (isObjectOf(item, $range)) {
        ranges = ranges.concat(resolveRangeItem(item));
      } else if (isCodepoint(item)) {
        ranges = ranges.concat(resolveCodepointItem(item));
      } else if (isBlock(item)) {
        ranges = ranges.concat(resolveBlockItem(item));
      } else if (isCategory(item)) {
        ranges = ranges.concat(resolveCategoryItem(item));
      } else if (isClass(item)) {
        ranges = ranges.concat(resolveClassItem(item));
      } else {
        throw new Error("unknown group item");
      }
      return ranges;
    }, []);

    return $ranges.create(ranges);
  }

  function resolveGroupToRanges(group) {
    var ranges = resolveItemsToRanges(group);
    var positive = group.positive;

    if (group.subtrahend) {
      var pair = resolveGroupToRanges(group.subtrahend);
      var subRanges = pair[0];
      var subPositive = pair[1];

      if (group.positive && subPositive) {
        // A - B
        ranges = ranges.subtract(subRanges);
      } else if (group.positive && !subPositive) {
        // A - ^B = A - (U - B) = (A - U) + B = 0 + B
        ranges = subRanges;
      } else if (!group.positive && subPositive) {
        // ^A - B = (U - A) - B = U - A - B = U - (A + B) = ^(A + B)
        ranges = ranges.add(subRanges);
      } else {
        // ^A - ^B = (U - A) - (U - B) = (U - U) + (B - A) = B - A
        ranges = subRanges.subtract(ranges);
      }
    }

    return [ranges, positive];
  }

  function translateGroup(group) {
    var pair = resolveGroupToRanges(group);
    var ranges = pair[0];
    var positive = pair[1];

    var items = ranges.array.reduce(function (items, range) {
      var d = range[1] - range[0];
      if (d === 0) {
        items.push($codeunit.create(range[0]));
      } else if (d === 1) {
        items.push(
          $codeunit.create(range[0]),
          $codeunit.create(range[1]));
      } else {
        items.push(
          $range.create(
            $codeunit.create(range[0]),
            $codeunit.create(range[1])));
      }
      return items;
    }, []);

    return $group.create(items, { positive: positive });
  }

  function resolveClassItem(class_) {
    var pair = resolveClassToRanges(class_);
    var ranges = pair[0];
    var positive = pair[1];
    return positive ? ranges : invertRanges(ranges);
  }

  function resolveClassToRanges(class_) {
    var ranges, positive;

    switch (class_.name) {
    case $class.SPACE:
      ranges = [ [0x9, 0xA], [0xD, 0xD], [0x20, 0x20] ];
      positive = class_.positive;
      break;
    case $class.DIGIT:
      ranges = $unicode.getCategoryRanges('Nd');
      positive = class_.positive;
      break;
    case $class.WORD:
      ranges = resolveWordClass();
      positive = !class_.positive;
      break;
    case $class.CHAR:
      ranges = $unicode.getXmlNameCharRanges();
      positive = class_.positive;
      break;
    case $class.INITIAL:
      ranges = $unicode.getXmlNameStartCharRanges();
      positive = class_.positive;
      break;
    default:
      throw new Error("not yet implemented");
    }

    return [ranges, positive];
  }

  function translateClass(class_) {
    var ranges = resolveClassToRanges(class_);
    var positive = ranges[1];
    ranges = ranges[0];

    var items = ranges.reduce(function (items, range) {
      if (range[0] === range[1]) {
        items.push($codeunit.create(range[0]));
      } else if (range[0] === (range[1] - 1)) {
        items.push(
          $codeunit.create(range[0]),
          $codeunit.create(range[1]));
      } else {
        items.push(
          $range.create(
            $codeunit.create(range[0]),
            $codeunit.create(range[1])));
      }
      return items;
    }, []);

    return $group.create(items, { positive: positive });
  }

  function resolveWordClass() {
    var cRanges = $unicode.getCategoryGroupRanges('C');
    var pRanges = $unicode.getCategoryGroupRanges('P');
    var zRanges = $unicode.getCategoryGroupRanges('Z');
    return $ranges.create(cRanges.concat(pRanges, zRanges)).array;
  }

  return $object.derive({
    translate: function (pattern) {
      return translatePattern(pattern);
    }
  });

});
