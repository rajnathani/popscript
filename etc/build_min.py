import os,sys

if __name__ == '__main__':
	popscript_code = open('../src/popscript.js').read();
	split_popscript_code = popscript_code.split(";");
	index_of_second_semi_colon = len(split_popscript_code[0]) + len(split_popscript_code[1]) + 1

	to_minify_popscript_code = popscript_code.replace(popscript_code[:index_of_second_semi_colon + 1], '')

	to_min_file = open('popscript.semi.min.js', 'w')
	to_min_file.write(to_minify_popscript_code)
	to_min_file.close()

	minified = os.popen('uglifyjs popscript.semi.min.js -c -m').read()
	minified = popscript_code[: index_of_second_semi_colon+1] + '\n\n' + minified

	min_file = open('../src/popscript.min.js', 'w')
	min_file.write(minified)
	min_file.close()

	print_out = True if '--print' in sys.argv else False
	if print_out:
		print minified