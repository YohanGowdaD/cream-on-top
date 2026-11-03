"""Download the three Google Fonts latin WOFF2 files used by this proposal."""
from pathlib import Path
import re
import urllib.request

target = Path(__file__).resolve().parent.parent / "src" / "fonts"
target.mkdir(parents=True, exist_ok=True)
families = [
    ("Cormorant+Garamond:ital,wght@0,400;1,400", "CormorantGaramond"),
    ("DM+Sans:wght@100..900", "DMSans"),
]
for family, name in families:
    request = urllib.request.Request(
        "https://fonts.googleapis.com/css2?family=" + family + "&display=swap",
        headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"},
    )
    css = urllib.request.urlopen(request, timeout=30).read().decode("utf-8")
    rules = re.findall(r"@font-face\s*\{([^}]+)\}", css)
    selected = {}
    for font_rule in rules:
        style = "italic" if "font-style: italic" in font_rule else "normal"
        selected[style] = font_rule
    if not selected:
        raise RuntimeError("No font faces found: " + css[:300])
    for style, font_rule in selected.items():
        url = re.search(r"url\(['\"]?(https://[^)'\"]+)", font_rule).group(1)
        suffix = "-Italic" if style == "italic" else "-Regular"
        filename = name + (suffix if name == "CormorantGaramond" else "") + ".woff2"
        data = urllib.request.urlopen(url, timeout=30).read()
        if not data.startswith(b"wOF2"):
            raise RuntimeError("Expected WOFF2 font data")
        (target / filename).write_bytes(data)
        print(filename, len(data), "bytes")

for folder in ["cormorantgaramond", "dmsans"]:
    license_url = "https://raw.githubusercontent.com/google/fonts/main/ofl/" + folder + "/OFL.txt"
    (target / (folder + "-OFL.txt")).write_bytes(urllib.request.urlopen(license_url, timeout=30).read())
