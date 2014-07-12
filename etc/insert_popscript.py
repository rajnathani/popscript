from extract_popscript import extract_popscript

def insert_popscript(content, start,end, extra_indent,tooltips=True, variable=False):
	semi_start_index = content.index(start) + len(start)
	semi_end_index = content.index(end)
	semi_extracted_content = content[semi_start_index:semi_end_index]
	
	start_index = semi_extracted_content.index('\n')
	end_index = semi_extracted_content.rindex('\n')
	extracted_content = semi_extracted_content[start_index+1 : end_index]

	extra_indent = ' ' * (4*extra_indent) # this extra indent is for the pre-formatting of the popscript code to lie in indentation with the jade template / rst doc
	new_content = content[0:semi_start_index + start_index + 1] + \
	 extra_indent + extract_popscript(tooltips, variable).replace('\n', '\n' + extra_indent) + \
		content[len(extracted_content) + semi_start_index + start_index:] 
	return new_content