import os


default_sphinx_stylesheet = '<link rel="stylesheet" href="_static/default.css" type="text/css" />'
pygments_sphinx_stylesheet = '<link rel="stylesheet" href="_static/pygments.css" type="text/css" />'
fix_sphinx_stylesheet = '<link rel="stylesheet" href="/static/css/fix_sphinx.css" type="text/css" />'
main_stylesheets ='''
<link rel="stylesheet" type="text/css" href="/static/css/google-web-fonts.css"/>
    <link rel="stylesheet" href="/static/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="src/popscript.css"/>
    <link rel="stylesheet" type="text/css" href="/static/css/normalize.css"/>
    <link rel="stylesheet" type="text/css" href="/static/css/main.css"/>
    <link rel="stylesheet" type="text/css" href="/static/css/google-prettify-tomorrow-theme.css"/>
''' + default_sphinx_stylesheet + pygments_sphinx_stylesheet + fix_sphinx_stylesheet


header = '''
<div id="header" class="cf">
    <a id="logo" href="/"><span>POP</span><span>SCRIPT</span></a>
    <a href="/docs/index.html"><span class="icon-book"></span> DOCS</a>
    <a href="/demo.html"><span class="icon-hand-up"></span> DEMO</a>
    <a href="/download.html"><span class="icon-download"></span> DOWNLOAD</a>
</div>
'''



os.chdir(os.getcwd() + '/_build/html/')

# thanks for the reminder of list comprehensions:
# http://stackoverflow.com/questions/3207219/how-to-list-all-files-of-a-directory-in-python

l= [f for f in os.listdir(os.getcwd()) if f.endswith('.html') and f != 'genindex.html' ]

for fname in l:
	f = open(fname, 'r')
	content = f.read()

	content = content.replace('<h3>This Page</h3>', '').replace('<h3><a href="#">Table Of Contents</a></h3>', '').replace('<a href="index.html">Table Of Contents</a>','').replace(default_sphinx_stylesheet, '').replace(pygments_sphinx_stylesheet,'').replace('</head>', main_stylesheets + '</head>').replace('<body>','<body>' + header)
	f.close()
	f = open(fname, 'w')
	f.write(content)
	f.close()

