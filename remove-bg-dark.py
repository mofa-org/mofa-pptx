#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow>=10.0.0", "numpy>=1.24.0"]
# ///
"""Remove dark gray backgrounds from specific product images."""

import os
from pathlib import Path
from PIL import Image
import numpy as np

def remove_dark_background(input_path, output_path, threshold=130):
    """Remove near-dark/gray background and save with transparency."""
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)

    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    max_rgb = np.maximum(np.maximum(r.astype(int), g.astype(int)), b.astype(int))
    min_rgb = np.minimum(np.minimum(r.astype(int), g.astype(int)), b.astype(int))
    saturation = max_rgb - min_rgb

    # Background: dark AND low saturation
    is_bg = (r < threshold) & (g < threshold) & (b < threshold) & (saturation < 30)

    data[is_bg] = [0, 0, 0, 0]

    result = Image.fromarray(data)
    result.save(output_path, "PNG")

    bg_pct = is_bg.sum() / is_bg.size * 100
    print(f"{Path(input_path).name}: {bg_pct:.1f}% dark background removed")

input_dir = "/Users/yuechen/home/cc-ppt/product-images-4k"
output_dir = "/Users/yuechen/home/cc-ppt/product-images-transparent"

for name in ["DMC500.png", "VA500.png"]:
    remove_dark_background(
        os.path.join(input_dir, name),
        os.path.join(output_dir, name)
    )
