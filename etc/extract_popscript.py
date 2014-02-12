import sys, os
import re


tooltip_mappings = {
    "basic: {": "This is a pop class.",

    "ANIMATION: {": "Animate your pops",

    "duration: 200": "Enter a number for the duration of the animation period",

    "y: 'auto'": "Align your pop the position where you think it belongs.",

    "esc: 'ye',": "Mention your booleans through 'yes', 'yeah', 'naah', ...",

    "tooltip: {": "The pop you are currently viewing",

    "click_me_out: 'yeh',": "Click this pop to close it. Try it out right now?",

}



def extract_popscript(tooltips=False, variable=False):
    '''
    Extract and Return the popscript from popscript.js
    If tooltips is mentioned then it fill up the code with the respective tooltips.
    If variable is mentioned then retain 'var popscript = {'
    '''
    popscript_js = open('../src/popscript.js')
    popscript_code = popscript_js.read()
    start_index =  popscript_code.index('var popscript') if variable else (popscript_code.index('\n') + 1)
    end_index = popscript_code.index(';')
    extracted_popscript = popscript_code[start_index : end_index]
    if not variable:
        extracted_popscript = extracted_popscript[:extracted_popscript.rindex('}')] + extracted_popscript[extracted_popscript.rfind('}')+1:]
    if (tooltips):
        for find,tooltip in tooltip_mappings.iteritems():
            if find not in extracted_popscript:
                raise Exception()
            extracted_popscript = extracted_popscript.replace(find, find + '   <span class="nocode sample-popscript-tooltip" data-tooltip="%s"></span>' % tooltip, 1)
    popscript_js.close()
    return extracted_popscript

if __name__ == '__main__':
    tooltips = True if '-t' in sys.argv else False
    variable = True if '-v' in sys.argv else False
    home_page = True if '-h' in sys.argv else False
    print_out = True if '--print' in sys.argv else False

    extracted_popscript = extract_popscript(tooltips or home_page, variable and not home_page)
    if print_out:
        print extracted_popscript