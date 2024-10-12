import os.path

from svgwrite.container import Group

from examples.base import SWORD_PNG_PATH

from pixels2svg import Drawing, pixels2svg


def main():
    overlay_img = pixels2svg(SWORD_PNG_PATH)
    final_img = Drawing(overlay_img.width, overlay_img.height)

    # add some custom style to the output SVG shapes
    group_1 = Group()
    group_2 = Group()
    for element in overlay_img.elements:
        # by default pixels2svg groups shapes of same color inside <g> elements
        if element.elementname == 'g':
            for shape in element.elements:
                shape['fill-opacity'] = 0
                shape['fill'] = 'none'
                shape['stroke'] = '#0000ff'
                shape['stroke-width'] = 0.4
                group_1.add(shape)
                shape_2 = shape.copy()
                shape_2['stroke'] = 'white'
                shape_2['stroke-width'] = 0.1
                group_2.add(shape_2)

    final_img.add(group_1)
    final_img.add(group_2)
    final_img.save_to_path(os.path.join(os.path.dirname(SWORD_PNG_PATH),
                                        'sword_outline.svg'))


if __name__ == '__main__':
    main()
