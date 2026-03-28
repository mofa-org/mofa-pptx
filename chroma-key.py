#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow>=10.0.0", "numpy>=1.24.0"]
# ///
"""Chroma key: replace green screen background with transparency."""

import os
from pathlib import Path
from PIL import Image
import numpy as np

def chroma_key(input_path, output_path):
    """Replace green-dominant pixels with transparency."""
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img, dtype=np.int16)

    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]

    # Green screen: green channel significantly higher than red and blue
    is_green = (g > 80) & (g > r + 30) & (g > b + 30)

    # Also catch lighter greens near edges
    is_light_green = (g > 150) & (g > r * 1.3) & (g > b * 1.3)

    mask = is_green | is_light_green
    data[mask] = [0, 0, 0, 0]

    result = Image.fromarray(data.astype(np.uint8))
    result.save(output_path, "PNG")

    pct = mask.sum() / mask.size * 100
    print(f"{Path(input_path).name}: {pct:.1f}% green removed")

input_dir = "/Users/yuechen/home/cc-ppt/product-images-4k"
output_dir = "/Users/yuechen/home/cc-ppt/product-images-transparent"
os.makedirs(output_dir, exist_ok=True)

for f in sorted(os.listdir(input_dir)):
    if f.endswith(".png"):
        chroma_key(
            os.path.join(input_dir, f),
            os.path.join(output_dir, f)
        )
