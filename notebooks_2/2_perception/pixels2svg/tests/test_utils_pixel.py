import os
import unittest

from numpy.testing import assert_array_equal

from tests.base import FIXTURES_DIR, SWORD_PNG_PATH

from pixels2svg.utils import pixel

IMAGE_FORMATS_DIR = os.path.join(FIXTURES_DIR, 'formats')


class TestUtilsPixel(unittest.TestCase):

    def test_id_to_from_rgba(self):

        self.assertEqual(
            (184, 0, 255, 54),
            pixel.id_to_rgba(pixel.rgba_to_id((184, 0, 255, 54)))
        )

    def test_id_to_from_rgba_array(self):

        img = pixel.read_image(SWORD_PNG_PATH)

        assert_array_equal(
            img,
            pixel.id_array_to_rgba_array(pixel.rgba_array_to_id_array(img))
        )

    def test_read_image(self):
        image_arrays = []
        for filename in os.listdir(IMAGE_FORMATS_DIR):
            image_path = os.path.join(IMAGE_FORMATS_DIR, filename)
            image_arrays.append(pixel.read_image(image_path))
        array_base = image_arrays[0]
        for array_comp in image_arrays[1:]:
            assert_array_equal(array_base, array_comp)
