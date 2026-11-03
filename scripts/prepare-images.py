"""Prepare the user's bakery photographs without altering cake appearances.

Run from the project root with Python and Pillow installed. Source JPEGs remain
untouched. All transforms are EXIF orientation, documented crops and WebP encoding.
"""

from pathlib import Path

from PIL import Image, ImageOps


PROJECT = Path(__file__).resolve().parent.parent
SOURCE = PROJECT / "reference-assets" / "new_assets"
DESTINATION = PROJECT / "public" / "images"

# Output path, source filename suffix, optional (left, top, right, bottom) crop.
PHOTOGRAPHS = [
    ("hero/hero-princess.webp", "12.53.36 AM (1)", None),
    ("cakes/floral-princess.webp", "12.53.36 AM (1)", None),
    ("founder/neha-portrait.webp", "12.53.38 AM (1)", None),
    ("founder/neha-portrait-alt.webp", "12.53.38 AM (1)", None),
    ("founder/studio-celebrations.webp", "12.53.38 AM (2)", None),
    ("hero/studio-celebrations.webp", "12.53.38 AM (2)", None),
    ("founder/eight-year-milestone.webp", "12.53.34 AM", None),
    ("founder/studio-collection.webp", "12.53.34 AM (1)", None),
    # Remove the Instagram music/header and caption from this one source.
    ("founder/fairy-studio.webp", "12.53.34 AM (2)", (0, 165, 918, 1457)),
    ("founder/celebration-studio.webp", "12.53.38 AM", None),
    ("cakes/princess-castle.webp", "12.53.35 AM (1)", None),
    ("cakes/chocolate-celebration.webp", "12.53.35 AM (2)", None),
    ("cakes/chocolate-squares.webp", "12.53.35 AM (2)", None),
    ("cakes/badminton-celebration.webp", "12.53.35 AM", None),
    ("cakes/rosette-heart.webp", "12.53.36 AM", None),
    ("cakes/floral-celebration.webp", "12.53.37 AM (1)", None),
    ("kids/jungle-celebration.webp", "12.53.37 AM (2)", None),
    ("kids/jungle-tiers.webp", "12.53.37 AM (2)", (430, 180, 1080, 1330)),
    ("cakes/studio-selection.webp", "12.53.37 AM", None),
    ("cakes/eighth-anniversary.webp", "12.53.34 AM", (220, 450, 744, 1340)),
    ("hero/milestone-cake-detail.webp", "12.53.34 AM", (270, 450, 744, 1340)),
    ("cakes/golden-crown.webp", "12.53.38 AM (2)", (85, 800, 555, 1285)),
    ("cakes/barbie-dress.webp", "12.53.38 AM (2)", (450, 285, 775, 720)),
    ("cakes/film-fiftieth.webp", "12.53.38 AM (2)", (390, 635, 735, 970)),
    ("cakes/construction-truck.webp", "12.53.38 AM (2)", (545, 845, 1000, 1285)),
    ("cakes/dinosaur-party.webp", "12.53.38 AM (2)", (805, 610, 1080, 955)),
    ("cakes/racing-car.webp", "12.53.38 AM (2)", (80, 375, 390, 750)),
]


def main() -> None:
    total = 0
    for output, suffix, bounds in PHOTOGRAPHS:
        source = SOURCE / f"WhatsApp Image 2026-11-03 at {suffix}.jpeg"
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            if bounds:
                image = image.crop(bounds)
            # Keep the originals' resolution; never upscale small detail crops.
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            target = DESTINATION / output
            target.parent.mkdir(parents=True, exist_ok=True)
            image.save(target, "WEBP", quality=88, method=6)
            total += target.stat().st_size
            print(f"{output}: {image.width} x {image.height}")
    print(f"Prepared {len(PHOTOGRAPHS)} photographs: {total / 1024:.0f} KB total")


if __name__ == "__main__":
    main()
