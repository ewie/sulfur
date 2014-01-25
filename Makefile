HIGHLIGHT_JS_VERSION = 8.0

RJS_OPTS = pragmas.production=false

vardir:
	mkdir -p var

libdir:
	mkdir -p lib

builddir:
	mkdir -p build

var/highlight.js: vardir
	-git submodule add git://github.com/isagalaev/highlight.js var/highlight.js
	git submodule update

lib/highlight.js: libdir var/highlight.js
	cd var/highlight.js; \
		git checkout tags/$(HIGHLIGHT_JS_VERSION); \
		python3 tools/build.py -tamd xml; \
		git checkout master
	mv var/highlight.js/build/highlight.pack.js lib/highlight.js

lib/jszip.js: libdir
	cat node_modules/jszip/jszip.js > lib/jszip.js
	cat node_modules/jszip/jszip-deflate.js >> lib/jszip.js

widget:
	r.js -o app/widget/build.js $(RJS_OPTS)

editor: lib/highlight.js lib/jszip.js
	r.js -o app/editor/build.js $(RJS_OPTS)

build: RJS_OPTS += pragmas.production=true optimize=uglify2
build: builddir widget editor
	cp app/editor/main-built.js build/main.js
	cp app/editor/index.html build/index.html
	cat app/common/style.css app/editor/style.css app/editor/github.css > build/style.css
	cp app/common/sulfur.svg build/sulfur.svg

clean:
	rm -f app/editor/main-built.js
	rm -f app/widget/main-built.js
	rm -rf build
	rm -f lib/highlight.js
	rm -f lib/jszip.js
