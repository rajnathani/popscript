import os
from insert_popscript import insert_popscript


if __name__ == '__main__':
	f = open('../www/docs/core.rst')
	content = f.read()
	new_content = insert_popscript(content, variable=True,tooltips=False, start='top of the file `popscript.js`)::\n', end='Before commencing on the properties', extra_indent=1)
	f.close()

	f = open('../www/docs/core.rst', 'w')
	f.write(new_content)
	f.close()