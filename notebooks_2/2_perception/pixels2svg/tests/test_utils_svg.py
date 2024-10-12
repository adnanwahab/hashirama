import unittest

from pixels2svg.utils import svg


class TestUtilsSVG(unittest.TestCase):

    def test_draw_polygon(self):

        svg_img = svg.Drawing(100, 100)

        outer_contour = ((25, 25), (75, 25), (75, 50), (75, 75), (25, 75))

        inner_contours = (((40, 40), (50, 40), (50, 50), (40, 50)),
                          ((50, 50), (60, 50), (50, 60)))

        svg.draw_polygon(svg_img,
                         polygon=outer_contour,
                         holes=inner_contours,
                         color=(0, 0, 255),
                         opacity=0.5)

        svg_img.save_to_path('test_draw_polygon.svg')
