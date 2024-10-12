import argparse

from pixels2svg.main import pixels2svg


class SmartFormatter(argparse.HelpFormatter):

    def _split_lines(self, text, width):
        splitted_by_line_break = text.splitlines()
        res = []
        for line in splitted_by_line_break:
            res.extend(super()._split_lines(line, width))
        return res


def run_command():
    parser = argparse.ArgumentParser(description='pixels2svg CLI',
                                     formatter_class=SmartFormatter)
    parser.add_argument(
        'input',
        metavar='<input path>',
        type=str,
        help='Path to the input the bitmap image '
             '(anything supported by PIL.Image).')
    parser.add_argument(
        '--output', '-o',
        metavar='<path>',
        type=str,
        help='Path to the output SVG image.\n If not  passed, will print '
             'the output in the terminal.')
    parser.add_argument(
        '--color_tolerance', '-c',
        metavar='<int>',
        type=int,
        help='Color tolerance (1 = the smallest luminosity difference i.e. '
             'a difference of 1 on the Blue channel).',
        default=0)
    parser.add_argument(
        '--remove_background', '-b',
        action='store_true',
        help='If the input image has a solid background, will try to remove '
             'it.')
    parser.add_argument(
        '--background_tolerance',
        metavar='<float>',
        type=float,
        default=1.0,
        help='(Only relevant when `remove_background = True`)\n'
             'Arbitrary quantity of blur use to remove noise - just fine-tune '
             'the value if the default (1.0) doesn\'t work well.\n'
             '0 means no blur will be used.')
    parser.add_argument(
        '--maximal_non_bg_artifact_size',
        metavar='<float>',
        type=float,
        default=2.0,
        help='(Only relevant when `remove_background = True`)\n'
             'When a blob of pixels is clone enough to the detected image '
             'contours and below this threshold, it won\'t be considered as '
             'background.\n Combined with `background_tolerance`, this allows '
             'you to control how progressive the background detection should '
             'be with blurred contours.\n'
             'Size is expressed in %% of total image pixels.')
    parser.add_argument(
        '--no_group_by_color',
        action='store_true',
        help='Do not group shapes of same color together inside <g> tags.')
    parser.add_argument(
        '--no_pretty',
        action='store_true',
        help='Do not pretty-write the SVG code.')

    args = parser.parse_args()

    output_str = pixels2svg(
        args.input,
        output_path=args.output if args.output else None,
        group_by_color=not args.no_group_by_color,
        as_string=not args.output,
        pretty=not args.no_pretty,
        color_tolerance=args.color_tolerance,
        remove_background=args.remove_background,
    )
    if output_str:
        print(output_str)
