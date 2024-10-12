from typing import Optional, Tuple, Union

import numpy as np

Coord = Union[int, float]
Point = Tuple[Coord, Coord]
Polygon = Tuple[Point, ...]
Line = Tuple[Point, Point]
BoundingBox = Tuple[Coord, Coord, Coord, Coord]  # xmin, xmax, ymin, ymax


def find_first_non_zero_coords(blob: np.ndarray) -> Point:
    # use the fact that the max possible value is 1 in binary arrays :
    # argmax stops if the max has been reached already.
    index = np.argmax(blob.astype(bool))
    coords = np.unravel_index(index, shape=blob.shape)
    return tuple(coords)


def bounding_box(points: Polygon) -> BoundingBox:
    x = [p[0] for p in points]
    y = [p[1] for p in points]
    x_min, x_max = min(x), max(x)
    y_min, y_max = min(y), max(y)
    return x_min, x_max, y_min, y_max


def minimal_polygon(points: Polygon) -> Polygon:
    current_n_points = len(points)
    previous_n_points = current_n_points + 1
    current_points = list(points)

    def points_on_same_line(p1: Point, p2: Point, p3: Point) -> bool:
        return (p1[0] == p2[0] == p3[0]) or (p1[1] == p2[1] == p3[1])

    while previous_n_points > current_n_points:
        indices_to_remove = set()
        modulo = current_n_points
        for i in range(current_n_points // 3 + current_n_points % 3 + 2):
            i1 = i * 3
            i2 = i * 3 + 1
            i3 = i * 3 + 2
            i1, i2, i3 = (p % modulo for p in (i1, i2, i3))
            p1, p2, p3 = (current_points[i_] for i_ in (i1, i2, i3))
            if points_on_same_line(p1, p2, p3):
                indices_to_remove.add(i2)

        previous_n_points = len(current_points)
        for index in sorted(indices_to_remove, reverse=True):
            del current_points[index]
        current_n_points = len(current_points)

    return tuple(current_points)


class Contours:

    def __init__(self,
                 outside: Polygon,
                 inner_holes: Optional[Tuple[Polygon, ...]] = None):
        """Small class representing a shape with a polygonal contour,
        and potential holes in it.
        Outer and inner contours are tuples of points ordered clockwise.
        """
        self.outside: Polygon = outside
        self.inner_holes: Tuple[Polygon, ...] = inner_holes or tuple()


def _get_pixel_contour_segments(blob: np.ndarray,
                                i: int,
                                j: int) -> Tuple[Line, ...]:
    """Return a tuple of lines corresponding to the exterior contours at
    point (i, j) of the polygon
    """
    lines = []

    left_side = ((i, j+1), (i, j))
    right_side = ((i + 1, j), (i + 1, j + 1))
    top_side = ((i, j), (i + 1, j))
    bottom_side = ((i + 1, j + 1), (i, j + 1))

    if (i == 0
            or (i > 0 and not blob[i - 1, j])):
        lines.append(left_side)
    if (i == blob.shape[0] - 1
            or (i < blob.shape[0] - 1 and not blob[i + 1, j])):
        lines.append(right_side)

    if (j == 0
            or (j > 0 and not blob[i, j - 1])):
        lines.append(top_side)
    if (j == blob.shape[1] - 1
            or (j < blob.shape[1] - 1 and not blob[i, j + 1])):
        lines.append(bottom_side)

    return tuple(lines)


def calculate_blob_contours(blob: np.ndarray) -> Contours:

    # get list of 2D coordinates of points of blob
    non_zero = np.nonzero(blob)
    pixels = tuple((x, y) for x, y in zip(non_zero[0], non_zero[1]))

    # build set of polygon lines
    lines = set()
    for pixel in pixels:
        pixel_side_lines = _get_pixel_contour_segments(blob, *pixel)
        for line in pixel_side_lines:
            lines.add(line)

    # this will contain the polygons we build
    polygons = []

    # we will pick a line L1, then find the next line L2 (L1[1] == L2[0])
    # => each point is only shared by two lines
    iter_lines = lines.copy()
    current_line = iter_lines.pop()
    ordered_points = [*current_line]
    while len(iter_lines) > 0:
        found = False
        for line in iter_lines:
            if line[0] == current_line[1]:
                ordered_points.append(line[1])
                current_line = line
                iter_lines.remove(line)
                found = True
                break
        if not found:
            # this happens only when there are multiple polygons
            if ordered_points[-1] == ordered_points[0]:
                # we're done with the current polygon
                polygons.append(tuple(ordered_points[:-1]))
                # current line is the last line of the polygon we just
                # finished defining. We switch to the next line, which will
                # be the first of the new polygon
                current_line = iter_lines.pop()
                ordered_points = [*current_line]
            else:
                # if it happens then the algorithm has a mistake
                raise ValueError(
                    f'no candidate line for {current_line} in {iter_lines}')

    # add the last polygon
    polygons.append(tuple(ordered_points[:-1]))

    bounding_boxes = [bounding_box(polygon) for polygon in polygons]
    bbox_with_x_min = np.argmin([bbox[0] for bbox in bounding_boxes])
    bbox_with_x_max = np.argmax([bbox[1] for bbox in bounding_boxes])
    bbox_with_y_min = np.argmin([bbox[2] for bbox in bounding_boxes])
    bbox_with_y_max = np.argmax([bbox[3] for bbox in bounding_boxes])
    if not (bbox_with_x_min == bbox_with_x_max
            == bbox_with_y_min == bbox_with_y_max):
        # if it happens then the algorithm has a mistake
        raise ValueError('something went wrong')

    outside_contours = minimal_polygon(polygons[bbox_with_x_min])
    # define the inner contours in the same order as the outer contours (
    # i.e. clockwise). The SVG utils will be responsible to implement
    # order-dependent rendering logic.
    inner_holes = tuple(minimal_polygon(polygon)[::-1]
                        for i, polygon in enumerate(polygons)
                        if i != bbox_with_x_min)

    return Contours(outside_contours, inner_holes)
