import cc3d
import numpy as np
from scipy import ndimage

from pixels2svg.utils.pixel import (TRUE_TRANSPARENT, id_to_rgba,
                                    rgba_array_to_id_array)

# grayscale = 0.3 * R + 0.59 * G + 0.11 * B
GRAYSCALE_R = 0.3
GRAYSCALE_G = 0.59
GRAYSCALE_B = 0.11

B_TOLERANCE_UNIT = 1
G_TOLERANCE_UNIT = B_TOLERANCE_UNIT * GRAYSCALE_B / GRAYSCALE_G
R_TOLERANCE_UNIT = B_TOLERANCE_UNIT * GRAYSCALE_B / GRAYSCALE_R


def _reduce_colors(rgba_array: np.ndarray, tolerance: int = 0) -> np.ndarray:

    alpha_channel_values = set(np.unique(rgba_array[:, :, 3]))
    if 0 in alpha_channel_values:
        alpha_channel_values.remove(0)
    if len(alpha_channel_values) == 0:
        # image is empty
        return rgba_array
    alpha_channel_range = max(alpha_channel_values) - min(alpha_channel_values)
    a_tolerance_unit = alpha_channel_range / 255 / 5

    reduction_factors = [
        min(1 + (2 * tolerance * channel_tolerance), 255)
        for channel_tolerance in (
            R_TOLERANCE_UNIT,
            G_TOLERANCE_UNIT,
            B_TOLERANCE_UNIT,
            a_tolerance_unit
        )
    ]

    reduced_colors = rgba_array.astype(np.float64)
    for i in range(4):
        channel = reduced_colors[:, :, i]
        reduced_colors[:, :, i] = channel // reduction_factors[i]
        if i == 3:
            channel_non_zero = (channel > 0).astype(np.float64)
            channel_non_zero[reduced_colors[:, :, i] == 255] = 0
            reduced_colors[:, :, i] += channel_non_zero

    return reduced_colors.astype(np.uint8)


def apply_color_tolerance(rgba_array: np.ndarray,
                          tolerance: int = 0) -> np.ndarray:
    orig_colors_id_array = rgba_array_to_id_array(rgba_array)

    reduced_colors = _reduce_colors(rgba_array, tolerance)
    reduced_colors_id_array = rgba_array_to_id_array(reduced_colors)
    labels = cc3d.connected_components(reduced_colors_id_array,
                                       out_dtype=np.uint64,
                                       connectivity=4)

    reduced_rgba_colors = np.zeros(rgba_array.shape, np.uint8)

    for _, blob_shape in cc3d.each(labels, binary=True, in_place=True):
        (similar_color_ids,
         similar_color_ids_areas) = np.unique(orig_colors_id_array[blob_shape],
                                              return_counts=True)
        sorted_ids_by_area = sorted(zip(similar_color_ids,
                                        similar_color_ids_areas),
                                    key=lambda c: c[1],
                                    reverse=True)
        sorted_rgba_colors_by_area = [id_to_rgba(int(color_id))
                                      for color_id, _ in sorted_ids_by_area]

        alpha_values = [rgba[3] for rgba in sorted_rgba_colors_by_area]

        percentile_90 = np.percentile(alpha_values, 90)
        percentile_75 = np.percentile(alpha_values, 75)
        percentile_25 = np.percentile(alpha_values, 25)

        main_color_rgba = None
        for rgba_color in sorted_rgba_colors_by_area:
            alpha = rgba_color[3]
            if (alpha > percentile_90
                    or (percentile_25 <= alpha <= percentile_75)):
                main_color_rgba = rgba_color
                break
        if main_color_rgba is None:
            main_color_rgba = sorted_rgba_colors_by_area[0]

        reduced_rgba_colors[blob_shape, :] = main_color_rgba

    return reduced_rgba_colors


def remove_background(rgba_array: np.ndarray,
                      background_tolerance: float = 1.0,
                      maximal_non_bg_artifact_size: float = 2.0) -> np.ndarray:
    """Background removal technique:
    1) Create a first base mask using contour detection
    2) Dilate that mask to get the 'maximum area' where we will consider
       non-background pixels
    3) Group adjacent pixels of same color in blobs
    4) Iterate through each blob and consider it non-background if:
       - most of its pixels are inside the base mask
       - or most of its pixels are inside the dilated mask AND its area is
         below a certain threshold (a few % of the image area)

    """
    min_alpha = rgba_array[:, :, 3].min()
    if min_alpha < 95 / 100 * 255:
        # no background removal if background has pixels with alpha
        # (tolerate pixels with an alpha 0.95 < a < 1 to allow human mistakes
        # at creation time in some image editing software)
        return rgba_array

    gray = np.zeros(rgba_array.shape[:2], np.float64)
    gray += rgba_array[:, :, 0] * GRAYSCALE_R
    gray += rgba_array[:, :, 1] * GRAYSCALE_G
    gray += rgba_array[:, :, 2] * GRAYSCALE_B
    gray *= rgba_array[:, :, 3] / 255
    gray = np.around(gray).astype(np.uint8)

    width = rgba_array.shape[0]
    height = rgba_array.shape[1]
    blur_quantity = background_tolerance / 128 * width
    non_bg_area_threshold = maximal_non_bg_artifact_size / 100 * width * height

    blurred = ndimage.gaussian_filter(gray, sigma=blur_quantity)
    contours = ndimage.filters.sobel(blurred)

    # create base mask (take pretty bright contours)
    base_mask = contours > np.percentile(contours, 50)
    # fill any hole created by interconnected contours
    # (blobs can still contain holes at this point if they touch the borders)
    base_mask = ndimage.binary_fill_holes(base_mask)

    # dilate base mask
    dilated_mask = ndimage.gaussian_filter(
        base_mask.astype(np.uint8) * 255, sigma=blur_quantity)
    dilated_mask = dilated_mask > np.percentile(dilated_mask, 20)

    # calculate connected blobs of same RGBA color
    colors_id_array = rgba_array_to_id_array(rgba_array)
    labels = cc3d.connected_components(colors_id_array,
                                       out_dtype=np.uint64,
                                       connectivity=4)

    final_mask = np.ones(labels.shape, dtype=bool)

    # iterate through blobs
    for blob_id, blob_shape in cc3d.each(labels, binary=True, in_place=True):

        base_mask_overlap = np.count_nonzero(
            np.logical_and(blob_shape, base_mask))
        shape_area = np.count_nonzero(blob_shape)

        # most pixels are in the base mask
        if base_mask_overlap > 0.5 * shape_area:
            final_mask[blob_shape] = False
            continue

        # most pixels are in the dilated mask AND blob is small enough
        dilated_mask_overlap = np.count_nonzero(
            np.logical_and(blob_shape, dilated_mask))
        if (dilated_mask_overlap > 0.5 * shape_area
                and shape_area < non_bg_area_threshold):
            final_mask[blob_shape] = False

    rgba_array[final_mask, :] = TRUE_TRANSPARENT
    return rgba_array
