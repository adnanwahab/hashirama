import os
import unittest
from tempfile import NamedTemporaryFile

import numpy as np
from cairosvg import svg2png
from numpy.testing import assert_array_equal
from PIL.Image import NEAREST, fromarray

from tests.base import BRAIN_OVERLAY_PNG_PATH, EMPTY_PNG_PATH, SWORD_PNG_PATH

from pixels2svg.main import pixels2svg
from pixels2svg.utils.pixel import read_image


class TestMain(unittest.TestCase):

    @staticmethod
    def resample_rgba_array(rgba_array: np.ndarray,
                            new_width: int,
                            new_height: int) -> np.ndarray:
        image = fromarray(np.swapaxes(rgba_array, 0, 1))
        image_resampled = image.resize((new_width, new_height),
                                       NEAREST)
        image_resampled_array = np.array(image_resampled)
        return np.swapaxes(image_resampled_array, 0, 1)

    def test_convert_example_images(self):
        for image_path in (SWORD_PNG_PATH, BRAIN_OVERLAY_PNG_PATH):
            output_svg_path = image_path.replace('.png', '_converted.svg')
            drawing = pixels2svg(image_path)
            drawing['id'] = os.path.basename(image_path).replace('.png', '')
            drawing.save_to_path(output_svg_path)

    def test_options(self):

        option_combinations = (
            dict(group_by_color=False, pretty=False),
            dict(group_by_color=False, pretty=True),
            dict(group_by_color=True, pretty=False),
            dict(group_by_color=True, pretty=True),
        )

        for image_path in (SWORD_PNG_PATH,
                           EMPTY_PNG_PATH,
                           BRAIN_OVERLAY_PNG_PATH):

            orig_image_array = read_image(image_path)
            orig_image_array_resampled = self.resample_rgba_array(
                orig_image_array,
                orig_image_array.shape[0] * 4,
                orig_image_array.shape[1] * 4,
            )

            for option_combination in option_combinations:
                with NamedTemporaryFile() as output_svg, \
                        NamedTemporaryFile() as output_png:
                    pixels2svg(image_path,
                               output_path=output_svg.name,
                               **option_combination)

                    # test that rasterizing the SVG gives the same PNG as
                    # the original PNG
                    svg2png(url=output_svg.name,
                            write_to=output_png.name,
                            output_width=orig_image_array.shape[0],
                            output_height=orig_image_array.shape[1])
                    output_image_array = read_image(output_png.name)
                    assert_array_equal(orig_image_array,
                                       output_image_array)

                    # test that rasterizing the SVG at a higher resolution
                    # (* 2^n) is the same as upscaling the PNG with nearest
                    # neighbor resampling
                    svg2png(url=output_svg.name,
                            write_to=output_png.name,
                            output_width=orig_image_array.shape[0] * 4,
                            output_height=orig_image_array.shape[1] * 4)
                    output_image_array_resampled = read_image(output_png.name)
                    assert_array_equal(orig_image_array_resampled,
                                       output_image_array_resampled)
