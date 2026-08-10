from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image


GOLD = np.array([203, 167, 61], dtype=np.float32)
WHITE = np.array([255, 255, 255], dtype=np.float32)


def clamp01(values: np.ndarray) -> np.ndarray:
    return np.clip(values, 0.0, 1.0)


def extract_logo(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGB")
    rgb = np.asarray(image, dtype=np.float32)
    red, green, blue = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    maximum = rgb.max(axis=2)
    minimum = rgb.min(axis=2)
    chroma = maximum - minimum
    luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722

    white_luminance = clamp01((luminance - 92.0) / 150.0)
    white_neutrality = clamp01((34.0 - chroma) / 22.0)
    white_alpha = white_luminance * white_neutrality

    red_gold_signal = clamp01((red - blue - 8.0) / 80.0)
    green_gold_signal = clamp01((green - blue - 4.0) / 60.0)
    gold_order = clamp01((red - green + 3.0) / 25.0)
    gold_alpha = np.minimum(red_gold_signal, green_gold_signal) * gold_order

    alpha = np.maximum(white_alpha, gold_alpha)
    alpha[alpha < 0.055] = 0.0
    alpha = np.power(alpha, 0.78)

    gold_pixels = gold_alpha > white_alpha
    clean_rgb = np.empty_like(rgb)
    clean_rgb[:] = WHITE
    clean_rgb[gold_pixels] = GOLD

    rgba = np.dstack((clean_rgb, alpha[..., None] * 255.0)).astype(np.uint8)
    result = Image.fromarray(rgba, mode="RGBA")

    bounds = result.getchannel("A").getbbox()
    if bounds is None:
        raise RuntimeError("Nenhum elemento da logo foi detectado.")

    padding = 12
    left = max(0, bounds[0] - padding)
    top = max(0, bounds[1] - padding)
    right = min(result.width, bounds[2] + padding)
    bottom = min(result.height, bounds[3] + padding)

    destination.parent.mkdir(parents=True, exist_ok=True)
    result.crop((left, top, right, bottom)).save(destination, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Extrai a logo do fundo quadriculado preservando as cores da marca.")
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    extract_logo(args.input, args.output)


if __name__ == "__main__":
    main()
