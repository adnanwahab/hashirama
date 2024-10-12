import base64
import mimetypes
import os.path

from svgwrite.image import Image
from svgwrite.masking import ClipPath

from examples.base import BRAIN_OVERLAY_PNG_PATH, BRAIN_PNG_PATH

from pixels2svg import Drawing, pixels2svg


def file_to_base64(filepath):
    """Returns the content of a file as a Base64 encoded string.
    """
    with open(filepath, 'rb') as f:
        encoded_str = base64.b64encode(f.read())
    return encoded_str.decode('utf-8')


def file_to_base64_html(filepath):
    mime_type = mimetypes.guess_type(filepath)[0]
    base64_data = file_to_base64(filepath)
    return f'data:{mime_type};base64,{base64_data}'


def main():
    overlay_img = pixels2svg(BRAIN_OVERLAY_PNG_PATH)
    final_img = Drawing(overlay_img.width, overlay_img.height)
    final_img.add(Image(href=file_to_base64_html(BRAIN_PNG_PATH),
                        size=("100%", "100%")))

    # add some custom style to the output SVG shapes
    customized_shapes = []
    for element in overlay_img.elements:
        # by default pixels2svg groups shapes of same color inside <g> elements
        if element.elementname == 'g':
            for shape in element.elements:
                shape['fill-opacity'] = 0.1
                shape['stroke'] = shape['fill']
                shape['stroke-width'] = 3
                customized_shapes.append(shape)

    # we'll use clip masks to make sure contours are only drawn on the inside
    shape_clip_paths = []
    for shape in customized_shapes:
        clip_path = ClipPath(id=shape['id'] + '_mask',
                             clipPathUnits='userSpaceOnUse')
        clip_path.add(shape)
        shape_clip_paths.append(clip_path)

    # add the clip paths to the <defs> tag
    for element in final_img.elements:
        if element.elementname == 'defs':
            for clip_path in shape_clip_paths:
                element.add(clip_path)

    # add the customized shapes to the svg (no need to re-group them)
    for shape, clip_path in zip(customized_shapes, shape_clip_paths):
        shape['clip-path'] = f'url(#{clip_path["id"]})'
        final_img.add(shape)

    final_img.save_to_path(os.path.join(os.path.dirname(BRAIN_PNG_PATH),
                                        'brain_overlay.svg'))


if __name__ == '__main__':
    main()
