lib:
	mkdir -p lib

lib/jszip.js: lib
	cat node_modules/jszip/jszip.js > lib/jszip.js
	cat node_modules/jszip/jszip-deflate.js >> lib/jszip.js

clean:
	rm -f lib/jszip.js
