../www/pages/index.jade: ../src/popscript.js
	python build_indexpage.py

../www/pages/demo.jade: ../src/popscript.js ../www/static/js/index.js
	python build_demopage.py

../www/docs/core.rst: ../src/popscript.js
	python build_doc_core.py

../src/popscript.min.js: ../src/popscript.js
	python build_min.py

indexpage: ../www/pages/index.jade
demopage: ../www/pages/demo.jade
doc_core: ../www/docs/core.rst	
min: ../src/popscript.min.js

all: indexpage demopage doc_core min

.PHONY: indexpage demopage doc_core min
