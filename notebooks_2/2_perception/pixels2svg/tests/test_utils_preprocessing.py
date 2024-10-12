import os
import unittest

import numpy as np
from numpy.testing import assert_array_equal

from tests.base import EMPTY_PNG_PATH, FIXTURES_DIR

from pixels2svg.utils import preprocessing
from pixels2svg.utils.pixel import read_image, rgba_array_to_id_array


class TestUtilsPixel(unittest.TestCase):

    def test_apply_color_tolerance_empty_image(self):

        empty_img = read_image(EMPTY_PNG_PATH)
        for tolerance in (0, 50, 100):
            res = preprocessing.apply_color_tolerance(empty_img, tolerance)
            assert_array_equal(empty_img, res)

    def test_apply_color_tolerance(self):
        img_array = np.zeros((3, 3, 4), dtype=np.uint8)
        img_array[0, 0, :] = (120, 120, 120, 255)
        img_array[0, 1, :] = (120, 120, 121, 255)
        img_array[1, 0, :] = (120, 120, 122, 255)
        img_array[2, 0, :] = (121, 121, 121, 255)
        img_array[0, 2, :] = (119, 119, 119, 255)

        reduced_colors = preprocessing.apply_color_tolerance(img_array, 1)
        assert_array_equal(reduced_colors[0, 0, :3], (120, 120, 120))
        assert_array_equal(reduced_colors[1, 0, :3], (120, 120, 120))
        assert_array_equal(reduced_colors[0, 1, :3], (120, 120, 120))

    def test_apply_color_tolerance_integration(self):
        img_array = read_image(os.path.join(FIXTURES_DIR, 'gradient.png'))
        reduced_colors = preprocessing.apply_color_tolerance(img_array, 4)

        self.assertTrue(
            len(np.unique(rgba_array_to_id_array(reduced_colors)))
            < len(np.unique(rgba_array_to_id_array(img_array)))
        )

        # from PIL import Image
        # Image.fromarray(np.swapaxes(reduced_colors, 0, 1)).show()

    def test_remove_background_empty_image(self):

        empty_img = read_image(EMPTY_PNG_PATH)
        for background_tolerance in (0, 1, 2, 3, 4, 5):
            for maximal_non_bg_artifact_size in (0, 1, 2, 3, 4, 5):
                res = preprocessing.remove_background(
                    empty_img,
                    background_tolerance=background_tolerance,
                    maximal_non_bg_artifact_size=maximal_non_bg_artifact_size)
                assert_array_equal(empty_img, res)

    def test_remove_background_integration(self):
        img_array = read_image(os.path.join(FIXTURES_DIR, 'banana.png'))
        res = preprocessing.remove_background(img_array)

        green_bg = img_array[:, :, 1] == 255
        transparent_bg = res[:, :, 3] == 0
        assert_array_equal(green_bg, transparent_bg)

        # from PIL import Image
        # Image.fromarray(np.swapaxes(res, 0, 1)).show()
