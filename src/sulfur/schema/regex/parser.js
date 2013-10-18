/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/regex/any',
  'sulfur/schema/regex/block',
  'sulfur/schema/regex/branch',
  'sulfur/schema/regex/category',
  'sulfur/schema/regex/codepoint',
  'sulfur/schema/regex/class',
  'sulfur/schema/regex/group',
  'sulfur/schema/regex/pattern',
  'sulfur/schema/regex/quant',
  'sulfur/schema/regex/piece',
  'sulfur/schema/regex/range',
  'sulfur/unicode'
], function (
  Factory,
  Any,
  Block,
  Branch,
  Category,
  Codepoint,
  Class,
  Group,
  Pattern,
  Quant,
  Piece,
  Range,
  Unicode
) {

  'use strict';

  /**
   * A parser parses a regular expression according to XML Schema 1.0 (but with
   * some changes in semantic, due to compatibility issues with the
   * DataGridService).
   */

  /**
   * Test if a codepoint value is a valid XML character.
   *
   * @param [number] value the codepoint value
   *
   * @return [boolean] true if valid
   */
  function isValidXmlCharacterCodepoint(value) {
    return value === 0x9 || value === 0xA || value === 0xD ||
           value >= 0x20 && value <= 0xd7FF ||
           value >= 0xE000 && value <= 0xFFFD ||
           value >= 0x10000 && value <= 0x10FFFF;
  }

  var resolveCharacterReferences = (function () {
    var NAMED_REFERENCES = {
      'amp': '&',
      'apos': "'",
      'gt': '>',
      'lt': '<',
      'quot': '"'
    };

    return function resolveCharacterReferences(s) {
      s = s.replace(/&#(\d+);/g, function (m, dec) {
        var val = parseInt(dec, 10);
        if (!isValidXmlCharacterCodepoint(val)) {
          throw new Error("illegal XML character " + m);
        }
        return Unicode.encodeCharacterAsUtf16(val);
      });

      s = s.replace(/&#x([\dA-Fa-f]+);/g, function (m, hex) {
        var val = parseInt(hex, 16);
        if (!isValidXmlCharacterCodepoint(val)) {
          throw new Error("illegal XML character " + m);
        }
        return Unicode.encodeCharacterAsUtf16(val);
      });

      s = s.replace(/&([^;]+);/g, function (m, name) {
        if (NAMED_REFERENCES.hasOwnProperty(name)) {
          return NAMED_REFERENCES[name];
        } else {
          throw new Error("unknown named character reference " + m);
        }
      });

      return s;
    };
  }());

  var Scanner = Factory.derive({
    initialize: function (source) {
      // By resolving character references the scanner is much simpler.
      this.source = resolveCharacterReferences(source);
    },

    advance: function (count) {
      this.source = this.source.substr(count);
    },

    back: function (s) {
      this.source = s + this.source;
    },

    indexOf: function (sub) {
      return this.source.indexOf(sub);
    },

    test: function (prefix) {
      return this.indexOf(prefix) === 0;
    },

    scan: function (pattern) {
      if (typeof pattern === 'string') {
        if (this.test(pattern)) {
          this.advance(pattern.length);
          return true;
        }
      } else {
        var match = this.matches(pattern);
        if (match) {
          if (match.index) {
            throw new Error("scan only with a pattern anchored to the beginning of the input");
          }
          this.advance(match[0].length);
          return match;
        }
      }
    },

    matches: function (pattern) {
      var match = pattern.exec(this.source);
      if (match) {
        return match;
      }
    },

    consume: function (length) {
      var s = this.source.substr(0, length);
      this.advance(length);
      return s;
    },

    consumeCodepoint: function () {
      var pair = Unicode.decodeCharacterFromUtf16(this.source);
      if (pair[1].length > 1) {
        console.log(pair);
      }
      this.advance(pair[1]);
      return pair[0];
    }
  });

  function parsePattern(scanner) {
    var branches = [];
    do {
      var branch = parseBranch(scanner);
      if (branch) {
        branches.push(branch);
      }
    } while (scanner.scan('|'));
    return Pattern.create(branches);
  }

  function parseBranch(scanner) {
    var pieces = [];
    var piece;
    do {
      piece = parsePiece(scanner);
      if (piece) {
        pieces.push(piece);
      }
    } while (piece);
    return Branch.create(pieces);
  }

  function parsePiece(scanner) {
    var atom = parseAtom(scanner);
    if (atom) {
      var q = parseQuantifier(scanner);
      return Piece.create(atom, q);
    }
  }

  function parseAtom(scanner) {
    return parseChar(scanner) ||
           parseCharClass(scanner) ||
           parseSubPattern(scanner);
  }

  function parseSubPattern(scanner) {
    if (scanner.scan('(')) {
      var p = parsePattern(scanner);
      if (!scanner.scan(')')) {
        throw new Error("incomplete parenthesis");
      }
      return p;
    }
  }

  var parseQuantifier = (function () {
    function parseSimpleQuantifier(scanner) {
      var match = scanner.scan(/^[?+*]/);
      if (match) {
        switch (match[0]) {
        case '+':
          return Quant.create(1, Number.POSITIVE_INFINITY);
        case '*':
          return Quant.create(0, Number.POSITIVE_INFINITY);
        case '?':
          return Quant.create(0, 1);
        }
      }
    }

    function parseGenericQuantifier(scanner) {
      if (scanner.scan('{')) {
        var p = scanner.indexOf('}');
        if (p === -1) {
          throw new Error("incomplete quantifier");
        }

        var s = scanner.consume(p);
        var match = /^(?:(\d+)(,)?|(\d+),(\d+))$/.exec(s);
        if (!match) {
          throw new Error("invalid quantifier {" + s + "}");
        }

        // Consume the closing curly brace.
        scanner.advance(1);

        var min, max;
        if (match[1]) {
          min = parseInt(match[1], 10);
          max = match[2] ? Number.POSITIVE_INFINITY : min;
        } else if (match[3]) {
          min = parseInt(match[3], 10);
          max = parseInt(match[4], 10);
        }

        return Quant.create(min, max);
      }
    }

    return function parseQuantifier(scanner) {
      return parseSimpleQuantifier(scanner) || parseGenericQuantifier(scanner);
    };
  }());

  function parseChar(scanner) {
    if (scanner.matches(/^[^.\\?*+()|[\]]/)) {
      var value = scanner.consumeCodepoint();
      return Codepoint.create(value);
    }
  }

  function parseCharClass(scanner) {
    if (scanner.scan('.')) {
      return Any.create();
    }
    return parseCharClassEsc(scanner) || parseCharClassExpr(scanner);
  }

  var parseCharClassExpr = (function () {

    var parseCharRange = (function () {
      function parseRangeChar(scanner) {
        return parseGroupChar(scanner) || parseSingleCharEsc(scanner);
      }

      function parseGroupChar(scanner) {
        if (scanner.matches(/^[^\\[\]\-]/)) {
          return Codepoint.create(scanner.consumeCodepoint());
        }
      }

      return function parseCharRange(scanner) {
        var s = parseRangeChar(scanner);
        if (scanner.scan('-')) {
          var e = parseRangeChar(scanner);
          if (e) {
            return Range.create(s, e);
          } else {
            // The end of the range could not be parsed so put the dash back.
            scanner.back('-');
          }
        }
        return s;
      };
    }());

    return function parseCharClassExpr(scanner) {
      if (scanner.scan('[')) {
        if (scanner.scan(']')) {
          throw new Error("empty character group");
        }

        var positive = !scanner.scan('^');
        var items = [];

        // Check for an initial dash.
        if (scanner.scan('-')) {
          items.push(Codepoint.create('-'));
        }

        var item;
        do {
          item = parseCharRange(scanner) || parseCharClassEsc(scanner);
          if (item) {
            items.push(item);
          }
        } while (item);

        // Check for a trailing dash which may indicate a subtraction or just be
        // the second valid occurrence for a plain dash character.
        var dash = scanner.scan('-');
        var group;

        // TODO what about more than 2 dashes e.g. [a-z---[x]]

        if (dash) {
          if (scanner.test('[')) {
            // The trailing dash is followed by a group, thus a subtraction.
            group = parseCharClassExpr(scanner);
          } else if (scanner.test('-[')) {
            // The trailing dash is followed by another dash, thus a trailing dash and a subtraction.
            items.push(Codepoint.create('-'));
            scanner.consume(1);
            group = parseCharClassExpr(scanner);
          } else {
            // The trailing dash is not followed by a group, thus the allowed trailing dash.
            items.push(Codepoint.create('-'));
          }
        }

        if (!scanner.scan(']')) {
          throw new Error("incomplete character group");
        }

        return Group.create(items, {
          positive: positive,
          subtract: group
        });
      }
    };

  }());

  var parseSingleCharEsc = (function () {

    var CONTROL_CHARS = {
      'n': '\n',
      'r': '\r',
      't': '\t'
    };

    var PATTERN = (function () {
      var ctrls = Object.keys(CONTROL_CHARS).join('');
      var pattern = '^\\\\(?:([' + ctrls + '])|([\\\\|.\\-^?*+{}()[\\]]))';
      return new RegExp(pattern);
    }());

    return function parseSingleCharEsc(scanner) {
      var match = scanner.scan(PATTERN);
      if (match) {
        if (match[1]) {
          return Codepoint.create(CONTROL_CHARS[match[1]]);
        }
        if (match[2]) {
          return Codepoint.create(match[2]);
        }
      }
    };
  }());

  var parseCharClassEsc = (function () {
    var parseMultiCharEsc = (function () {
      var CLASSES = {
        'c': Class.CHAR,
        'd': Class.DIGIT,
        'i': Class.INITIAL,
        's': Class.SPACE,
        'w': Class.WORD
      };

      var PATTERN = (function () {
        var classes = Object.keys(CLASSES).join('');
        var pattern = '^\\\\([' + classes + '])';
        return new RegExp(pattern, 'i');
      }());

      return function parseMultiCharEsc(scanner) {
        var match = scanner.scan(PATTERN);
        if (match) {
          var c = match[1];
          var name = CLASSES[c.toLowerCase()];
          // Lower case indicates to match positively.
          var mode = c === c.toLowerCase();
          return Class.create(name, mode);
        }
      };
    }());

    function parsePropertyEsc(scanner) {
      var match = scanner.scan(/^\\([pP])/);
      if (match) {
        var mode = match[1] === 'p';
        if (!scanner.scan('{')) {
          throw new Error("escape " + match[0] + " expects a Unicode category or block name");
        }
        var p = scanner.indexOf('}');
        if (p === -1) {
          throw new Error("incomplete escape " + match[0]);
        }
        var name = scanner.consume(p);
        if (!name) {
          throw new Error("escape " + match[0] + " expects a Unicode category or block name");
        }
        // Consume the closing curly brace.
        scanner.consume(1);

        if (name.indexOf('Is') === 0) {
          return Block.create(name.substr(2), mode);
        } else {
          return Category.create(name, mode);
        }
      }
    }

    return function parseCharEsc(scanner) {
      if (scanner.matches(/^\\./)) {
        var esc = parseSingleCharEsc(scanner) ||
                  parseMultiCharEsc(scanner) ||
                  parsePropertyEsc(scanner);
        if (esc) {
          return esc;
        }
        throw new Error("unknown escape " + scanner.consume(2));
      }
    };

  }());

  return Factory.derive({
    /**
     * @param [string] source the regular expression source text
     *
     * @throw [Error] if there are errors in syntax or semantic
     *
     * @return [pattern] a pattern as the root of the syntax tree
     */
    parse: function (source) {
      var scan = Scanner.create(source);
      return parsePattern(scan);
    }
  });

});
