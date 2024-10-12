import os
import unittest

import cc3d
import numpy as np
from PIL import Image, ImageDraw

from tests.base import FIXTURES_DIR

from pixels2svg.utils import geometry
from pixels2svg.utils.pixel import read_image


class TestUtilsGeometry(unittest.TestCase):

    def test__get_pixel_contour_segments(self):

        array_1 = np.array([
            [1, 1, 0],
            [1, 1, 0],
            [0, 0, 0],
        ])

        lines_1 = geometry._get_pixel_contour_segments(array_1, 0, 0)
        self.assertIn(((0, 1), (0, 0)), lines_1)
        self.assertIn(((0, 0), (1, 0)), lines_1)
        self.assertEqual(len(lines_1), 2)

        lines_2 = geometry._get_pixel_contour_segments(array_1, 0, 1)
        self.assertIn(((1, 2), (0, 2)), lines_2)
        self.assertIn(((0, 2), (0, 1)), lines_2)
        self.assertEqual(len(lines_1), 2)

        # TODO add more tests

    def test_minimal_polygon(self):

        square = (
            (0, 0), (0, 1), (0, 2), (0, 3),  # →
            (1, 3), (2, 3), (3, 3),   # ↓
            (3, 2), (3, 1), (3, 0),  # ←
            (2, 0), (1, 0),  # ↑
        )

        self.assertEqual(
            geometry.minimal_polygon(square),
            ((0, 0), (0, 3), (3, 3), (3, 0))
        )

        square_2 = (*square[:3], (0, 2.5), *square[3:])
        self.assertEqual(
            geometry.minimal_polygon(square_2),
            ((0, 0), (0, 3), (3, 3), (3, 0))
        )

        square_3 = (*square[:3], (0, 2.33), (0, 2.66), *square[3:])
        self.assertEqual(
            geometry.minimal_polygon(square_3),
            ((0, 0), (0, 3), (3, 3), (3, 0))
        )

    def test_polygon_contours_integration(self):
        """Used for development"""
        img = read_image(os.path.join(FIXTURES_DIR, 'polygon_blobs.png'))
        blobs = img[:, :, 3].astype(bool)

        end_blobs_img = Image.fromarray(np.zeros(blobs.shape, dtype=bool))

        labels = cc3d.connected_components(blobs,
                                           out_dtype=np.uint16,
                                           connectivity=4)
        for blob_id, blob_shape in cc3d.each(labels,
                                             binary=False,
                                             in_place=True):
            contours = geometry.calculate_blob_contours(blob_shape)
            self.assertEqual(contours.inner_holes, tuple())
            img1 = ImageDraw.Draw(end_blobs_img)
            img1.polygon(contours.outside, fill=1, outline=None)

        end_blobs = np.array(end_blobs_img).T
        # Image.fromarray(end_blobs).show()
        self.assertTrue(np.all(end_blobs[blobs]))
