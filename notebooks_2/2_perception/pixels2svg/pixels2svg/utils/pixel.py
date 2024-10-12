from typing import Tuple

import numpy as np
from PIL import Image

PixelRGBA = Tuple[int, int, int, int]
PixelRGB = Tuple[int, int, int]
TRUE_TRANSPARENT: PixelRGBA = (255, 255, 255, 0)


def read_image(image_path: str) -> np.ndarray:
    image = Image.open(image_path)
    mode = image.mode
    rgba_image = image.convert('RGBA')
    image.close()
    # convert from PIL Y/X convention to usual X/Y convention
    rgba_array = np.swapaxes(np.array(rgba_image), 0, 1)
    rgba_image.close()
    # make sure there is only one transparent BG color if original mode is RGBA
    if mode == 'RGBA':
        rgba_array[rgba_array[:, :, 3] == 0] = TRUE_TRANSPARENT
    return rgba_array


def int_to_bytes(x: int, n_bytes=None) -> bytes:
    if n_bytes is None:
        n_bytes = (x.bit_length() + 7) // 8
    if x == 0:
        n_bytes = 1
    return x.to_bytes(n_bytes, 'big')


def int_from_bytes(xbytes: bytes) -> int:
    return int.from_bytes(xbytes, 'big')


def rgba_to_id(rgba_val: PixelRGBA) -> int:
    return int_from_bytes(b''.join([int_to_bytes(val) for val in rgba_val]))


def id_to_rgba(label: int) -> PixelRGBA:
    four_bytes = int_to_bytes(label, n_bytes=4)
    return tuple(four_bytes)


def rgba_array_to_id_array(rgba_array: np.ndarray) -> np.ndarray:
    rgba_uint8 = rgba_array.astype(np.uint8)
    id_uint32 = rgba_uint8[:, :, 0].astype(np.uint32)
    id_uint32 = np.left_shift(id_uint32, 8) + rgba_uint8[:, :, 1]
    id_uint32 = np.left_shift(id_uint32, 8) + rgba_uint8[:, :, 2]
    id_uint32 = np.left_shift(id_uint32, 8) + rgba_uint8[:, :, 3]
    return id_uint32


def id_array_to_rgba_array(id_array: np.ndarray) -> np.ndarray:
    rgba = id_array.astype(np.uint32)
    _rgb = np.right_shift(rgba, 8)
    __rg = np.right_shift(_rgb, 8)
    ___r = np.right_shift(__rg, 8)

    __r_ = np.left_shift(___r, 8)
    _r__ = np.left_shift(__r_, 8)
    r___ = np.left_shift(_r__, 8)

    ___g = __rg - __r_
    __g_ = np.left_shift(___g, 8)
    _g__ = np.left_shift(__g_, 8)

    ___b = _rgb - _r__ - __g_
    __b_ = np.left_shift(___b, 8)

    ___a = rgba - r___ - _g__ - __b_

    r, g, b, a = (array.astype(np.uint8)
                  for array in (___r, ___g, ___b, ___a))

    return np.stack([r, g, b, a], axis=-1)


def rgb_color_to_hex_code(color: PixelRGB) -> str:
    """convert tuple of 3 RGB uint8 values to hex color code string"""

    color_code = ''.join(['{:02x}'.format(color[i]) for i in range(3)])
    return f'#{color_code}'.lower()
