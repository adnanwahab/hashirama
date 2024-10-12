import os
import sys

sys.path[0:0] = ['pixels2svg']

from __version__ import __version__

try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup


with open('README.md', 'r') as readme:
    readme_text = readme.read()
    readme_text = readme_text.split('## Contributing')[0]

if os.path.isfile('COPYRIGHT'):
    add_copyright_mentions = True

    with open('COPYRIGHT', 'r') as copyright:
        copyright_text = copyright.read()

    orig_source_file_texts = {}

    # prepend copyright mentions to each source file
    for subdir, dirs, files in os.walk('pixels2svg'):
        for file in files:
            if not file.endswith('.py'):
                continue
            file_path = os.path.join(subdir, file)

            with open(file_path, 'r') as source_file:
                source_text = source_file.read()
                orig_source_file_texts[file_path] = source_text

            with open(file_path, 'w') as source_file:
                source_file.write('"""\n')
                source_file.write(copyright_text)
                source_file.write('\n"""\n\n')
                source_file.write(source_text)
else:
    add_copyright_mentions = False

try:
    setup(
        name='pixels2svg',
        description='pixels2svg : Convert pixels to SVG square-based shapes.',
        license='GNU General Public License v3 or later (GPLv3+)',
        version=__version__,
        author='Valentin François',
        maintainer='Valentin François',
        url='https://github.com/ValentinFrancois/pixels2svg',
        packages=['pixels2svg', 'pixels2svg.utils'],
        install_requires=[
           'connected-components-3d',
           'scipy',
           'Pillow',
           'svgwrite'
        ],
        long_description=readme_text,
        long_description_content_type='text/markdown',
        platforms=['any'],
        python_requires='>=3.7.0',
    )

finally:
    if add_copyright_mentions:
        # reset source files texts to leave a clean git history
        for subdir, dirs, files in os.walk('pixels2svg'):
            for file in files:
                if not file.endswith('.py'):
                    continue
                file_path = os.path.join(subdir, file)
                with open(file_path, 'w') as source_file:
                    source_file.write(orig_source_file_texts[file_path])
