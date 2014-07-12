import os
from insert_popscript import insert_popscript


if __name__ == '__main__':
	f = open('../www/page/index.jade')
	content = f.read()
	new_content = insert_popscript(content, start='pre.long-pre.', end='.right-area', extra_indent=4)
	f.close()

	f = open('../www/page/index.jade', 'w')
	f.write(new_content)
	f.close()
