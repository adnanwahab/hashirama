from io import StringIO
from typing import Optional, Tuple, Union

from svgwrite import Drawing as SVGDrawing
from svgwrite.container import Group
from svgwrite.path import Path

from pixels2svg.utils.geometry import Polygon
from pixels2svg.utils.pixel import PixelRGB, PixelRGBA, rgb_color_to_hex_code


class Drawing(SVGDrawing):
    def __init__(self, width: int, height: int):
        super().__init__(size=(f'{width}px', f'{height}px'),
                         viewBox=f'0 0 {width} {height}',
                         profile='full')
        self.width: int = width
        self.height: int = height

    def save_to_path(self, path: str, pretty: bool = False):
        with open(path, 'w', encoding='utf-8') as svg_file:
            self.write(svg_file, pretty=pretty)

    def to_string(self, pretty: bool = False) -> str:
        io = StringIO()
        self.write(io, pretty=pretty)
        svg_str = io.getvalue()
        io.close()
        return svg_str


def polygon_to_path_data(polygon: Polygon) -> str:
    string_points = [f'{p[0]},{p[1]}' for p in polygon]
    data = f'M {" ".join(string_points)} z'
    return data


def polygon_with_holes_to_path_data(polygon: Polygon,
                                    holes: Tuple[Polygon, ...]) -> str:
    path_data = polygon_to_path_data(polygon)
    if holes:
        inverted_pathes = [polygon_to_path_data(hole[::-1]) for hole in holes]
        path_data = f'{path_data} {" ".join(inverted_pathes)}'
    return path_data


def draw_path(svg: Union[Drawing, Group],
              path_data: str,
              color: Union[PixelRGBA, PixelRGB, str],
              opacity: float = 1.0,
              **extra_args):
    """Draw a shape with fill color from a path data
    """

    if isinstance(color, str):
        hex_color = color
    elif isinstance(color, tuple):
        hex_color = rgb_color_to_hex_code(color[:3])
        if len(color) == 4:
            opacity = color[3] / 255
    else:
        raise ValueError(f'unexpected value for color: {color}')

    shape = Path(d=path_data, **extra_args)
    shape = shape.fill(hex_color, opacity=opacity)
    svg.add(shape)


def draw_polygon(svg: Union[Drawing, Group],
                 polygon: Polygon,
                 color: Union[PixelRGBA, PixelRGB, str],
                 holes: Optional[Tuple[Polygon, ...]] = None,
                 opacity: float = 1.0,
                 **extra_args):
    """Draw a shape with fill color.
    """

    if holes:
        path_data = polygon_with_holes_to_path_data(polygon, holes)
    else:
        path_data = polygon_to_path_data(polygon)

    draw_path(svg, path_data, color, opacity, **extra_args)
