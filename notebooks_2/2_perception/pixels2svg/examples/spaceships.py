from os import path

from examples.base import SPACESHIPS_PNG_PATH

from pixels2svg import pixels2svg


def main():
    svg_img = pixels2svg(SPACESHIPS_PNG_PATH,
                         remove_background=True)
    output_path = path.join(path.dirname(SPACESHIPS_PNG_PATH),
                            'spaceships.svg')
    svg_img.save_to_path(output_path)


if __name__ == '__main__':
    main()
