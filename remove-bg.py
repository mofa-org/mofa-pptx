#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow>=10.0.0", "numpy>=1.24.0"]
# ///
"""Remove near-white/gray backgrounds from product images and make transparent."""

import sys
import os
from pathlib import Path
from PIL import Image
import numpy as np

def remove_background(input_path, output_path, threshold=230):
    """Remove near-white background and save with transparency."""
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)

    # Find pixels where R, G, B are all above threshold (near-white/light gray)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Also check that the pixel is not too colorful (low saturation)
    max_rgb = np.maximum(np.maximum(r.astype(int), g.astype(int)), b.astype(int))
    min_rgb = np.minimum(np.minimum(r.astype(int), g.astype(int)), b.astype(int))
    saturation = max_rgb - min_rgb

    # Background: bright AND low saturation
    is_bg = (r > threshold) & (g > threshold) & (b > threshold) & (saturation < 30)

    # Set background pixels to transparent
    data[is_bg] = [255, 255, 255, 0]

    result = Image.fromarray(data)
    result.save(output_path, "PNG")

    bg_pct = is_bg.sum() / is_bg.size * 100
    print(f"{Path(input_path).name}: {bg_pct:.1f}% background removed -> {Path(output_path).name}")

if __name__ == "__main__":
    input_dir = "/Users/yuechen/home/cc-ppt/product-images-4k"
    output_dir = "/Users/yuechen/home/cc-ppt/product-images-transparent"
    os.makedirs(output_dir, exist_ok=True)

    for f in sorted(os.listdir(input_dir)):
        if f.endswith(".png"):
            remove_background(
                os.path.join(input_dir, f),
                os.path.join(output_dir, f)
            )
