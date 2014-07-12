import os
from insert_popscript import insert_popscript


if __name__ == '__main__':
	f = open('../www/docs/pop-properties.rst')
	content = f.read()
	new_content = insert_popscript(content, variable=True,tooltips=False, start='Script for reference::\n', end='.. _properties:', extra_indent=1)
	f.close()

	f = open('../www/docs/pop-properties', 'w')
	f.write(new_content)
	f.close()
