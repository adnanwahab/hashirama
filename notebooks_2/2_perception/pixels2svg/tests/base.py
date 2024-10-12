import os

from examples.base import BRAIN_OVERLAY_PNG_PATH  # noqa: F401
from examples.base import BRAIN_PNG_PATH  # noqa: F401
from examples.base import IMAGES_DIR  # noqa: F401
from examples.base import SWORD_PNG_PATH  # noqa: F401

TEST_DIR = os.path.abspath(os.path.dirname(__file__))
FIXTURES_DIR = os.path.join(TEST_DIR, 'fixtures')

EMPTY_PNG_PATH = os.path.join(FIXTURES_DIR, 'empty.png')
