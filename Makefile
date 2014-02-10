HIGHLIGHT_JS_VERSION = 8.0

RJS_OPTS = pragmas.production=false

submodulesdir:
	mkdir -p submodules

libdir:
	mkdir -p lib

builddir:
	mkdir -p build

submodules/highlight.js: submodulesdir
	-git submodule add git://github.com/isagalaev/highlight.js submodules/highlight.js
	git submodule update

lib/highlight.js: libdir submodules/highlight.js
	cd submodules/highlight.js; \
		git checkout tags/$(HIGHLIGHT_JS_VERSION); \
		python3 tools/build.py -tamd xml; \
		git checkout master
	mv submodules/highlight.js/build/highlight.pack.js lib/highlight.js

lib/jszip.js: libdir
	cat node_modules/jszip/jszip.js > lib/jszip.js
	cat node_modules/jszip/jszip-deflate.js >> lib/jszip.js

widget:
	r.js -o app/widget/build.js $(RJS_OPTS)

editor: lib/highlight.js lib/jszip.js
	r.js -o app/editor/build.js $(RJS_OPTS)

bundle: builddir widget editor
	cp app/editor/main-built.js build/main.js
	cp app/editor/index.html build/index.html
	cat app/common/style.css app/editor/style.css app/editor/github.css > build/style.css
	cp app/common/sulfur.svg build/sulfur.svg

build: RJS_OPTS += pragmas.production=true
build: bundle

build-minify: RJS_OPTS += optimize=uglify2
build-minify: build

clean:
	rm -f app/editor/main-built.js
	rm -f app/widget/main-built.js
	rm -rf build
	rm -f lib/highlight.js
	rm -f lib/jszip.js
