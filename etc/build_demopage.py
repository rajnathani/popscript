from extract_popscript import extract_popscript
from insert_popscript import insert_popscript


if __name__ == '__main__':
    f = open('../www/page/demo.jade')
    content = f.read()

    new_content = insert_popscript(content, start='pre.long-pre.', end='.right-area', extra_indent=4)

    f.close()
    index_js = open('../www/static/js/index.js')
    js_content = index_js.read()
    extracted_demo_js = js_content[js_content.index('if (demo_page) {\n') + len('if (demo_page) {\n'):js_content.rindex('\n}')]

    # fix html character entities
    extracted_demo_js = extracted_demo_js.replace('<', '&lt;').replace('>', '&gt;')

    # fix page indenations
    extra_indent = ' ' * (4*3) # this extra indent is for the pre-formatting of the popscript code to lie in indentation with the jade template
    extracted_demo_js = extra_indent + extracted_demo_js.replace('\n', '\n' + extra_indent)

    new_content = new_content[:new_content.rindex('pre.long-pre.\n') + len('pre.long-pre.\n')] + extracted_demo_js  + ''; # End of the file
    index_js.close()

    f = open('../www/page/demo.jade', 'w')
    f.write(new_content)
    f.close()
