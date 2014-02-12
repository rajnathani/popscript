import os
from insert_popscript import insert_popscript


if __name__ == '__main__':
	f = open('../www/pages/index.jade')
	content = f.read()
	new_content = insert_popscript(content, start='pre.', end='.right-area', extra_indent=3)
	f.close()

	f = open('../www/pages/index.jade', 'w')
	f.write(new_content)
	f.close()