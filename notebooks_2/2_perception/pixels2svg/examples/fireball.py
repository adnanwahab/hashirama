from contextlib import contextmanager
from os import path
from time import perf_counter

from examples.base import FIREBALL_PNG_PATH

from pixels2svg import pixels2svg


@contextmanager
def catchtime() -> float:
    start = perf_counter()
    yield lambda: perf_counter() - start
    print(f'Time: {perf_counter() - start:.3f} seconds\n')


def main():
    for tolerance in (0, 64, 128, 256, 512):
        # first iteration will take a long time because there are many colors
        dir_path, image_name = path.split(FIREBALL_PNG_PATH)
        print(f'Converting {image_name} with color tolerance: {tolerance}')
        with catchtime():
            svg_img = pixels2svg(FIREBALL_PNG_PATH,
                                 color_tolerance=tolerance)
        output_path = path.join(dir_path,
                                image_name.replace(
                                    '.png', f'_tolerance_{tolerance}.svg'))
        svg_img.save_to_path(output_path)


if __name__ == '__main__':
    main()
